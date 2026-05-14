'use client';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';
import { useDocumentVisible } from '~/hooks/useDocumentVisible';
import { HeroCinematicPost } from '~/components/HeroCinematicPost';

// ─── GLSL ─────────────────────────────────────────────────────────────────────

const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */`
  precision highp float;

  uniform float  uTime;
  uniform vec2   uResolution;
  uniform vec2   uMouse;       // normalized 0..1
  uniform float  uScrollVel;   // scroll velocity magnitude, clamped 0..1

  varying vec2 vUv;

  // ── Noise primitives ────────────────────────────────────────────────────────
  vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                   + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                             dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x   + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // ── FBM — layered noise for organic drip texture ─────────────────────────
  float fbm(vec2 p, int octaves) {
    float val = 0.0, amp = 0.5, freq = 1.0;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      val  += amp * snoise(p * freq);
      amp  *= 0.5;
      freq *= 2.1;
    }
    return val;
  }

  // ── Drip function — vertical gravity-pulled streaks ───────────────────────
  float drip(vec2 uv, float seed, float speed, float width) {
    float x     = uv.x + snoise(vec2(seed, uv.y * 0.4)) * 0.08;
    float xDist = abs(x - seed);
    float body  = smoothstep(width, 0.0, xDist);

    // Gravity: drip head falls over time, trails behind
    float t       = mod(uTime * speed + seed * 7.3, 1.6) - 0.3;
    float head    = smoothstep(0.04, 0.0, abs(uv.y - t));
    float trail   = smoothstep(0.0, -0.35, uv.y - t) * smoothstep(-0.9, 0.0, uv.y - t);
    float surface = head + trail * 0.6;

    return body * surface;
  }

  // ── Metallic specular — Blinn-Phong approximation in screen space ─────────
  float specular(vec2 uv, vec2 lightDir, float shininess) {
    vec2  n    = normalize(vec2(
                   snoise(uv * 3.0 + uTime * 0.1),
                   snoise(uv * 3.0 + vec2(5.2, 1.3) + uTime * 0.1)
                 ));
    vec2  h    = normalize(lightDir + vec2(0.0, 1.0));
    float spec = pow(max(dot(n, h), 0.0), shininess);
    return spec;
  }

  // Tone map: keep highlights controlled but leave chroma strong (neon must read on first glance)
  vec3 tonemapLuxury(vec3 c) {
    c = max(c, vec3(1e-4));
    c = pow(c, vec3(0.99));
    vec3 num = c * (c * vec3(2.02) + vec3(0.06));
    vec3 den = c * (c * vec3(2.43) + vec3(0.59)) + vec3(0.14);
    vec3 x = num / den;
    float l = dot(x, vec3(0.299, 0.587, 0.114));
    x = mix(vec3(l), x, 1.11);
    return clamp(x, 0.0, 1.0);
  }

  void main() {
    vec2 uv = vUv;

    vec2 mouseOffset = (uMouse - 0.5) * 0.12;
    float mouseFalloff = mix(0.38, 1.0, 1.0 - uv.y);
    uv += mouseOffset * mouseFalloff;

    float asp = uResolution.x / max(uResolution.y, 1.0);
    vec2 nq = vec2(uv.x * asp, uv.y);

    float scrollBoost = 1.0 + uScrollVel * 3.6;

    vec3 color = vec3(0.014, 0.014, 0.026);

    float paintMass = fbm(nq * vec2(1.12, 0.96) + vec2(uTime * 0.035, 0.0), 5);
    paintMass = smoothstep(0.028, 0.54, paintMass + uScrollVel * 0.32);

    vec3 neonPink   = vec3(1.0,  0.02, 0.62);
    vec3 neonHot    = vec3(1.0,  0.0,  0.42);
    vec3 chromeTint = vec3(0.78, 0.82, 1.0);

    float colorNoise = fbm(nq * 2.45 + uTime * 0.055, 3) * 0.5 + 0.5;
    vec3  paintColor = mix(neonHot, neonPink, colorNoise);

    float dripMask = 0.0;
    dripMask += drip(uv, 0.08, 0.18 * scrollBoost, 0.018);
    dripMask += drip(uv, 0.12, 0.18 * scrollBoost, 0.018);
    dripMask += drip(uv, 0.20, 0.14 * scrollBoost, 0.012);
    dripMask += drip(uv, 0.27, 0.14 * scrollBoost, 0.012);
    dripMask += drip(uv, 0.35, 0.22 * scrollBoost, 0.020);
    dripMask += drip(uv, 0.41, 0.22 * scrollBoost, 0.020);
    dripMask += drip(uv, 0.50, 0.16 * scrollBoost, 0.015);
    dripMask += drip(uv, 0.55, 0.16 * scrollBoost, 0.015);
    dripMask += drip(uv, 0.60, 0.19 * scrollBoost, 0.011);
    dripMask += drip(uv, 0.63, 0.19 * scrollBoost, 0.011);
    dripMask += drip(uv, 0.70, 0.13 * scrollBoost, 0.022);
    dripMask += drip(uv, 0.74, 0.13 * scrollBoost, 0.022);
    dripMask += drip(uv, 0.80, 0.21 * scrollBoost, 0.014);
    dripMask += drip(uv, 0.83, 0.21 * scrollBoost, 0.014);
    dripMask += drip(uv, 0.88, 0.17 * scrollBoost, 0.016);
    dripMask += drip(uv, 0.91, 0.17 * scrollBoost, 0.016);
    dripMask = clamp(dripMask, 0.0, 1.0);

    float totalPaint = clamp(paintMass * 0.8 + dripMask * 0.96, 0.0, 1.0);

    vec2  ldRaw      = uMouse - uv + vec2(0.28, 0.58);
    float ldLen      = length(ldRaw);
    vec2  lightDir   = ldLen > 1e-4 ? normalize(ldRaw) : normalize(vec2(0.28, 0.96));
    float spec       = specular(nq * 3.8, lightDir, 44.0);
    float specChrome = specular(nq * 7.6, lightDir, 108.0);
    float microGlint = specular(nq * 14.0 + uTime * 0.02, lightDir, 220.0) * 0.42;

    vec3 litPaint = paintColor * 1.06
                  + chromeTint * spec * 0.62
                  + vec3(0.98, 0.99, 1.0) * specChrome * 0.44
                  + vec3(1.0, 0.92, 0.98) * microGlint;

    float glow = totalPaint * (1.0 - totalPaint) * 3.8;
    vec3  glowColor = neonPink * glow * (1.0 + uScrollVel * 2.8) * 1.0;

    color = mix(color, litPaint, totalPaint);
    color += glowColor;

    float peakPre = max(max(color.r, color.g), color.b);
    color += paintColor * smoothstep(0.42, 1.0, peakPre) * 0.052;

    vec2 vigUv = (vUv - 0.5) * vec2(1.14, 0.97);
    float dist = length(vigUv);
    float breathe = 0.018 * sin(uTime * 0.37);
    float vignette = pow(1.0 - smoothstep(0.33 + breathe, 1.36, dist), 1.14);
    color = mix(color * 0.84, color, vignette);

    float d = fract(sin(dot(gl_FragCoord.xy * 0.31 + uTime * 37.0, vec2(12.9898, 78.233))) * 43758.5453123);
    color += (d - 0.5) * 0.0038;

    vec3 chroma = color - dot(color, vec3(0.299, 0.587, 0.114));
    color += chroma * 0.085;

    color = tonemapLuxury(color);

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ─── Shader Mesh ──────────────────────────────────────────────────────────────

interface ShaderPlaneProps {
  scrollVelRef: React.MutableRefObject<number>;
  mouseRef:     React.MutableRefObject<[number, number]>;
}

function ShaderPlane({ scrollVelRef, mouseRef }: ShaderPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useMemo(() => ({
    uTime:       { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uMouse:      { value: new THREE.Vector2(0.5, 0.5) },
    uScrollVel:  { value: 0 },
  }), [size.width, size.height]);

  // Keep resolution uniform in sync
  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    const tx = mouseRef.current[0];
    const ty = mouseRef.current[1];
    const mx = uniforms.uMouse.value.x + (tx - uniforms.uMouse.value.x) * 0.068;
    const my = uniforms.uMouse.value.y + (ty - uniforms.uMouse.value.y) * 0.068;
    uniforms.uMouse.value.set(mx, my);
    uniforms.uScrollVel.value += (scrollVelRef.current - uniforms.uScrollVel.value) * 0.08;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/** WebGL context loss must call preventDefault to allow restore; wake loop after restore. */
function CanvasGpuLifecycle() {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const onLost = (e: Event) => {
      e.preventDefault();
    };
    const onRestored = () => {
      gl.setClearColor('#050505', 1);
      invalidate();
    };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);
    return () => {
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    };
  }, [gl]);

  useEffect(() => {
    const wake = () => {
      if (!document.hidden) invalidate();
    };
    document.addEventListener('visibilitychange', wake);
    return () => document.removeEventListener('visibilitychange', wake);
  }, []);

  return null;
}

// ─── Public component ─────────────────────────────────────────────────────────

interface GraffitiCanvasProps {
  scrollVelRef: React.MutableRefObject<number>;
  mouseRef:     React.MutableRefObject<[number, number]>;
  className?:   string;
}

/** 2× 在清晰度与帧率之间更稳；3× 对全屏后处理过重易卡顿。 */
const MAX_HERO_DPR = 2;

/** 与 Node SSR 一致；首帧客户端必须相同，否则 `dpr` 在 DPR=1 设备上会变成 [1,1] 触发 React #418/#425。 */
const HERO_CANVAS_DPR_SSR: [number, number] = [1, 2];

function readHeroCanvasDpr(): [number, number] {
  const raw = window.devicePixelRatio || 1;
  return [1, Math.min(MAX_HERO_DPR, Math.max(1, raw))];
}

export function GraffitiCanvas({ scrollVelRef, mouseRef, className }: GraffitiCanvasProps) {
  const reducedMotion = usePrefersReducedMotion();
  const tabVisible = useDocumentVisible();
  const [dpr, setDpr] = useState<[number, number]>(HERO_CANVAS_DPR_SSR);

  useEffect(() => {
    setDpr(readHeroCanvasDpr());
  }, []);

  if (reducedMotion) {
    return (
      <div
        className={className}
        aria-hidden
        style={{ position: 'absolute', inset: 0, background: '#050505' }}
      />
    );
  }

  return (
    <Canvas
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
      dpr={dpr}
      resize={{ scroll: false, debounce: { scroll: 0, resize: 120 } }}
      frameloop={tabVisible ? 'always' : 'never'}
      onCreated={({ gl }) => {
        gl.setClearColor('#050505', 1);
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.NoToneMapping;
      }}
    >
      <CanvasGpuLifecycle />
      <ShaderPlane scrollVelRef={scrollVelRef} mouseRef={mouseRef} />
      <HeroCinematicPost scrollVelRef={scrollVelRef} />
    </Canvas>
  );
}
