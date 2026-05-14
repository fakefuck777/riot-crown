'use client';
import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';

const dofShader = {
  uniforms: {
    tDiffuse: { value: null },
    tDepth: { value: null },
    focus: { value: 1.0 },
    aperture: { value: 0.025 },
    maxblur: { value: 1.0 },
  },
  vertexShader: CopyShader.vertexShader,
  fragmentShader: /* glsl */`
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform sampler2D tDepth;
    uniform float focus;
    uniform float aperture;
    uniform float maxblur;
    varying vec2 vUv;

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float depth = texture2D(tDepth, vUv).x;
      float blur = abs(depth - focus) * aperture;
      blur = clamp(blur, 0.0, maxblur);

      vec4 col = texel;
      col += texture2D(tDiffuse, vUv + (vec2(0.0, 0.4) * blur));
      col += texture2D(tDiffuse, vUv + (vec2(0.15, 0.37) * blur));
      col += texture2D(tDiffuse, vUv + (vec2(0.29, 0.29) * blur));
      col += texture2D(tDiffuse, vUv + (vec2(0.4, 0.15) * blur));
      col += texture2D(tDiffuse, vUv + (vec2(0.37, -0.15) * blur));
      col += texture2D(tDiffuse, vUv + (vec2(0.29, -0.29) * blur));
      col += texture2D(tDiffuse, vUv + (vec2(0.15, -0.37) * blur));
      col += texture2D(tDiffuse, vUv + (vec2(0.0, -0.4) * blur));
      col += texture2D(tDiffuse, vUv + (vec2(-0.15, -0.37) * blur));
      col += texture2D(tDiffuse, vUv + (vec2(-0.29, -0.29) * blur));
      col += texture2D(tDiffuse, vUv + (vec2(-0.4, -0.15) * blur));
      col += texture2D(tDiffuse, vUv + (vec2(-0.37, 0.15) * blur));
      col += texture2D(tDiffuse, vUv + (vec2(-0.15, 0.37) * blur));

      gl_FragColor = col / 13.0;
    }
  `,
};

export function DepthOfFieldEffect() {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const dofPassRef = useRef<ShaderPass | null>(null);

  useEffect(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));

    const dofPass = new ShaderPass(dofShader);
    dofPass.uniforms.focus.value = 1.0;
    dofPass.uniforms.aperture.value = 0.035;
    dofPass.uniforms.maxblur.value = 1.2;

    composer.addPass(dofPass);
    composerRef.current = composer;
    dofPassRef.current = dofPass;

    const handleResize = () => {
      composer.setSize(size.width, size.height);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      composer.dispose();
    };
  }, [gl, scene, camera, size]);

  useFrame(() => {
    if (composerRef.current) {
      composerRef.current.render();
    }
  }, 1);

  return null;
}
