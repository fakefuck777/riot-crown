import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';

/**
 * Device tier detection.
 * High-end:  hardwareConcurrency >= 8 AND not coarse pointer → 24fps grain
 * Mid:       hardwareConcurrency 4–7 OR high-res mobile      → 18fps grain
 * Low/mobile: coarse pointer OR concurrency < 4              → 12fps grain
 *
 * GraffitiCanvas dpr is capped separately in GraffitiCanvas.tsx.
 */
function getGrainFps(): number {
  if (typeof window === 'undefined') return 24;
  const mobile = window.matchMedia('(pointer: coarse)').matches;
  const cores  = navigator.hardwareConcurrency ?? 4;
  if (mobile)       return 12;
  if (cores >= 8)   return 24;
  return 18;
}

/**
 * Canvas-based animated film grain — adaptive FPS.
 * 24fps on high-end desktop (ROG/X270 class).
 * 18fps on mid-tier.
 * 12fps on mobile — still reads as film, saves ~40% GPU time.
 *
 * Canvas is half-resolution on mobile (scaled up via CSS) to halve
 * the pixel fill cost while keeping the grain coarse and tactile.
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

    const ctx    = canvas.getContext('2d');
    if (!ctx) return;

    const mobile  = window.matchMedia('(pointer: coarse)').matches;
    // Half-res on mobile — CSS stretches it back to full viewport
    const scale   = mobile ? 0.5 : 1.0;
    const fps     = getGrainFps();
    const interval = 1000 / fps;

    const resize = () => {
      canvas.width  = Math.floor(window.innerWidth  * scale);
      canvas.height = Math.floor(window.innerHeight * scale);
    };
    resize();
    window.addEventListener('resize', resize);

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
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        id="grain-canvas"
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 36,
          mixBlendMode: 'overlay',
          opacity: 0.04,
          background: '#080808',
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      id="grain-canvas"
      aria-hidden="true"
      style={{
        // Stretch half-res canvas back to full viewport on mobile
        width:  '100vw',
        height: '100vh',
      }}
    />
  );
}
