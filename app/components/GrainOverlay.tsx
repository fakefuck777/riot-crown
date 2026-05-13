import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';

/**
 * Film grain FPS — quality-first tiers (CPU fills pixels; cap fps on low tier).
 */
function getGrainFps(): number {
  if (typeof window === 'undefined') return 28;
  const mobile = window.matchMedia('(pointer: coarse)').matches;
  const cores  = navigator.hardwareConcurrency ?? 4;
  if (mobile) {
    if (cores >= 8) return 20;
    if (cores >= 6) return 18;
    return 15;
  }
  if (cores >= 8) return 28;
  if (cores >= 4) return 24;
  return 20;
}

/**
 * Internal grain buffer scale (1 = full viewport pixels). Touch devices use <1
 * then CSS-stretch; higher = finer grain when “畫質極致” is requested.
 */
function getGrainInternalScale(): number {
  if (typeof window === 'undefined') return 1;
  const mobile = window.matchMedia('(pointer: coarse)').matches;
  const cores  = navigator.hardwareConcurrency ?? 4;
  if (!mobile) return 1;
  if (cores >= 8) return 0.88;
  if (cores >= 6) return 0.78;
  return 0.68;
}

/**
 * Canvas-based animated film grain — adaptive FPS + resolution.
 */
export function GrainOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number | null>(null);
  const frameRef  = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if ('imageSmoothingQuality' in ctx) {
      ctx.imageSmoothingQuality = 'high';
    }
    ctx.imageSmoothingEnabled = true;

    const scale   = getGrainInternalScale();
    const fps     = getGrainFps();
    const interval = 1000 / fps;

    const viewportW = () => window.visualViewport?.width ?? window.innerWidth;
    const viewportH = () => window.visualViewport?.height ?? window.innerHeight;

    const resize = () => {
      canvas.width  = Math.floor(viewportW() * scale);
      canvas.height = Math.floor(viewportH() * scale);
    };
    resize();
    window.addEventListener('resize', resize);
    window.visualViewport?.addEventListener('resize', resize);
    window.visualViewport?.addEventListener('scroll', resize);

    let lastTime = 0;

    const render = (timestamp: number) => {
      rafRef.current = requestAnimationFrame(render);

      const elapsed = timestamp - lastTime;
      if (elapsed < interval) return;
      lastTime = timestamp - (elapsed % interval);

      frameRef.current++;

      const { width, height } = canvas;
      const imageData = ctx.createImageData(width, height);
      const data      = imageData.data;
      const seed      = frameRef.current * 9301 + 49297;

      for (let i = 0; i < data.length; i += 4) {
        const rand = ((seed + i) * 1664525 + 1013904223) & 0xffffffff;
        const val  = (rand >>> 0) % 255;
        data[i]     = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('resize', resize);
      window.visualViewport?.removeEventListener('scroll', resize);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        id="grain-canvas"
        className="min-h-dvh-safe"
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          pointerEvents: 'none',
          zIndex: 36,
          mixBlendMode: 'soft-light',
          opacity: 0.035,
          background: '#080808',
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      id="grain-canvas"
      className="min-h-dvh-safe"
      aria-hidden="true"
    />
  );
}
