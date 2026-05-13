import * as THREE from 'three';

/**
 * EffectComposer 与 UnrealBloomPass 内部使用 HalfFloat 渲染目标。
 * 部分移动端 / 集显无法将其作为颜色附件，会导致整段后处理失败或整屏异常。
 */
export function supportsHeroHalfFloatTargets(renderer: THREE.WebGLRenderer): boolean {
  const target = new THREE.WebGLRenderTarget(4, 4, {
    type: THREE.HalfFloatType,
    depthBuffer: false,
    stencilBuffer: false,
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  });

  const prev = renderer.getRenderTarget();
  renderer.setRenderTarget(target);
  renderer.clear(true, true, true);

  const gl = renderer.getContext();
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;

  renderer.setRenderTarget(prev);
  target.dispose();

  return ok;
}
