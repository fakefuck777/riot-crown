'use client';
import { useLayoutEffect, useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { getHeroGpuTier } from '~/lib/heroGpuProfile';
import { supportsHeroHalfFloatTargets } from '~/lib/heroPostCapability';

/** 与 Canvas 对齐：降低 composer 像素负荷，减轻卡顿。 */
const MAX_DPR = 2;

const chromaticShader = {
  name: 'HeroChromaticAberration',
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0.002 },
  },
  vertexShader: CopyShader.vertexShader,
  fragmentShader: /* glsl */`
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform float amount;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      vec2 dir = (uv - 0.5) * amount;
      vec4 cR = texture2D(tDiffuse, uv + dir);
      vec4 cG = texture2D(tDiffuse, uv);
      vec4 cB = texture2D(tDiffuse, uv - dir);
      gl_FragColor = vec4(cR.r, cG.g, cB.b, cG.a);
    }
  `,
};

export interface HeroCinematicPostProps {
  scrollVelRef?: React.MutableRefObject<number>;
}

/**
 * Cinematic stack: bloom → [film] → chromatic → [SMAA on high only] → output.
 * `useFrame(..., 1)` owns the final frame (R3F disables default `gl.render`).
 */
export function HeroCinematicPost({ scrollVelRef }: HeroCinematicPostProps) {
  const { gl, scene, camera, size } = useThree();
  const tier = useMemo(() => getHeroGpuTier(), []);
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomRef = useRef<UnrealBloomPass | null>(null);
  const chromaticRef = useRef<ShaderPass | null>(null);
  const smaaRef = useRef<SMAAPass | null>(null);

  useLayoutEffect(() => {
    if (!supportsHeroHalfFloatTargets(gl)) {
      composerRef.current = null;
      bloomRef.current = null;
      chromaticRef.current = null;
      smaaRef.current = null;
      return;
    }

    const iw = typeof window !== 'undefined' ? window.innerWidth : 1280;
    const ih = typeof window !== 'undefined' ? window.innerHeight : 720;
    const w = Math.max(8, Math.floor(size.width) || iw);
    const h = Math.max(8, Math.floor(size.height) || ih);

    const bloomScale = tier === 'high' ? 1 : tier === 'mid' ? 0.52 : 0.36;
    const bw = Math.max(32, Math.floor(w * bloomScale));
    const bh = Math.max(32, Math.floor(h * bloomScale));

    const bloomStrength = tier === 'high' ? 0.28 : tier === 'mid' ? 0.22 : 0.17;
    const bloomThreshold = 0.3;
    const bloom = new UnrealBloomPass(new THREE.Vector2(bw, bh), bloomStrength, 0.42, bloomThreshold);
    const film =
      tier === 'low'
        ? null
        : new FilmPass(tier === 'high' ? 0.04 : 0.034, false);

    const chromatic = new ShaderPass(chromaticShader);
    chromatic.uniforms.amount.value =
      tier === 'high' ? 0.0018 : tier === 'mid' ? 0.0012 : 0.0007;

    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(bloom);
    if (film) composer.addPass(film);
    composer.addPass(chromatic);

    if (tier === 'high') {
      const smaa = new SMAAPass(w, h);
      composer.addPass(smaa);
      smaaRef.current = smaa;
    } else {
      smaaRef.current = null;
    }

    composer.addPass(new OutputPass());

    const pr = Math.min(MAX_DPR, gl.getPixelRatio());
    composer.setPixelRatio(pr);
    composer.setSize(w, h);

    composerRef.current = composer;
    bloomRef.current = bloom;
    chromaticRef.current = chromatic;

    return () => {
      smaaRef.current?.dispose();
      smaaRef.current = null;
      chromaticRef.current?.dispose();
      chromaticRef.current = null;
      composer.dispose();
      composerRef.current = null;
      bloomRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- size applied in useEffect; tier stable per session
  }, [gl, scene, camera, tier]);

  useEffect(() => {
    const c = composerRef.current;
    if (!c || size.width < 1 || size.height < 1) return;
    const pr = Math.min(MAX_DPR, gl.getPixelRatio());
    c.setPixelRatio(pr);
    c.setSize(size.width, size.height);
    smaaRef.current?.setSize(size.width, size.height);
  }, [gl, size.width, size.height]);

  useFrame((_state, delta) => {
    const composer = composerRef.current;
    const bloom = bloomRef.current;

    if (!composer) {
      gl.render(scene, camera);
      return;
    }

    if (bloom && scrollVelRef) {
      const v = Math.min(1, Math.max(0, scrollVelRef.current));
      const base = tier === 'high' ? 0.28 : tier === 'mid' ? 0.22 : 0.17;
      bloom.strength = base + v * 0.32;
      bloom.radius = 0.42 + v * 0.1;
    }

    composer.render(delta);
  }, 1);

  return null;
}
