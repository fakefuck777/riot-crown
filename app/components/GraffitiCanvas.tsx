'use client';
import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';

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

  void main() {
    vec2 uv = vUv;

    // Mouse influence — fluid across full height (top used to be nearly static)
    vec2 mouseOffset = (uMouse - 0.5) * 0.14;
    float mouseFalloff = mix(0.42, 1.0, 1.0 - uv.y);
    uv += mouseOffset * mouseFalloff;

    // Scroll velocity warps the drip speed and turbulence
    float scrollBoost = 1.0 + uScrollVel * 4.0;

    // ── Base: absolute vantablack ──────────────────────────────────────────
    vec3 color = vec3(0.02, 0.02, 0.02);

    // ── Paint mass — slightly taller field so upper hero feels as “full” as center
    float paintMass = fbm(uv * vec2(1.15, 0.95) + vec2(uTime * 0.04, 0.0), 5);
    paintMass = smoothstep(0.04, 0.52, paintMass + uScrollVel * 0.32);

    // ── Neon pink base color ───────────────────────────────────────────────
    vec3 neonPink   = vec3(1.0,  0.07, 0.57);   // #FF1293
    vec3 neonHot    = vec3(1.0,  0.0,  0.38);   // deeper magenta
    vec3 chromeTint = vec3(0.85, 0.85, 0.92);   // liquid chrome

    // Color varies with noise — hot core, chrome edges
    float colorNoise = fbm(uv * 2.5 + uTime * 0.06, 3) * 0.5 + 0.5;
    vec3  paintColor = mix(neonHot, neonPink, colorNoise);

    // ── Drip streaks — 8 independent drips ────────────────────────────────
    float dripMask = 0.0;
    dripMask += drip(uv, 0.12, 0.18 * scrollBoost, 0.018);
    dripMask += drip(uv, 0.27, 0.14 * scrollBoost, 0.012);
    dripMask += drip(uv, 0.41, 0.22 * scrollBoost, 0.020);
    dripMask += drip(uv, 0.55, 0.16 * scrollBoost, 0.015);
    dripMask += drip(uv, 0.63, 0.19 * scrollBoost, 0.011);
    dripMask += drip(uv, 0.74, 0.13 * scrollBoost, 0.022);
    dripMask += drip(uv, 0.83, 0.21 * scrollBoost, 0.014);
    dripMask += drip(uv, 0.91, 0.17 * scrollBoost, 0.016);
    dripMask = clamp(dripMask, 0.0, 1.0);

    float totalPaint = clamp(paintMass * 0.7 + dripMask * 0.9, 0.0, 1.0);

    // ── Metallic specular highlight ────────────────────────────────────────
    vec2  lightDir  = normalize(uMouse - uv + vec2(0.3, 0.6));
    float spec      = specular(uv * 4.0, lightDir, 48.0);
    float specChrome = specular(uv * 8.0, lightDir, 120.0);

    // Chrome veins inside the paint
    vec3 litPaint = paintColor
                  + chromeTint * spec * 0.6
                  + vec3(1.0) * specChrome * 0.4;

    // ── Glow bloom — soft halo around paint edges ──────────────────────────
    float glow = totalPaint * (1.0 - totalPaint) * 2.5;
    vec3  glowColor = neonPink * glow * (1.0 + uScrollVel * 2.0);

    // ── Composite ─────────────────────────────────────────────────────────
    color = mix(color, litPaint, totalPaint);
    color += glowColor;

    // Vignette — gentle; old vertical squeeze (1.3) dimmed the top too much vs title area
    float vignette = 1.0 - smoothstep(0.45, 1.35,
                       length((vUv - 0.5) * vec2(1.0, 1.05)));
    color *= vignette;

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
    const mx = uniforms.uMouse.value.x + (tx - uniforms.uMouse.value.x) * 0.11;
    const my = uniforms.uMouse.value.y + (ty - uniforms.uMouse.value.y) * 0.11;
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
      />
    </mesh>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

interface GraffitiCanvasProps {
  scrollVelRef: React.MutableRefObject<number>;
  mouseRef:     React.MutableRefObject<[number, number]>;
  className?:   string;
}

export function GraffitiCanvas({ scrollVelRef, mouseRef, className }: GraffitiCanvasProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return (
      <div
        className={className}
        aria-hidden
        style={{ position: 'absolute', inset: 0, background: '#050505' }}
      />
    );
  }

  // Cap dpr: 1.5 on desktop (full quality), 1.0 on mobile (saves ~44% fill)
  const dpr = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
    ? [1, 1] as [number, number]
    : [1, 1.5] as [number, number];

  return (
    <Canvas
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 1], near: 0.1, far: 10 }}
      dpr={dpr}
    >
      <ShaderPlane scrollVelRef={scrollVelRef} mouseRef={mouseRef} />
    </Canvas>
  );
}
