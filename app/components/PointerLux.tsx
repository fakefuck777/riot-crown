'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';

/**
 * Ultra-subtle viewport-following chromatic wash (fine pointer only).
 * Does not replace the system cursor — accessibility-safe.
 */
export function PointerLux() {
  const reduced = usePrefersReducedMotion();
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    pos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    target.current = { ...pos.current };

    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const tick = () => {
      raf.current = requestAnimationFrame(tick);
      const g = glowRef.current;
      if (!g) return;
      const lerp = 0.052;
      pos.current.x += (target.current.x - pos.current.x) * lerp;
      pos.current.y += (target.current.y - pos.current.y) * lerp;
      g.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      className="pointer-lux-host pointer-events-none fixed inset-0 z-[34] max-md:hidden"
      aria-hidden
    >
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[min(68vw,920px)] w-[min(68vw,920px)] rounded-full"
        style={{
          background: `
            radial-gradient(circle closest-side,
              rgba(255,255,255,0.15) 0%,
              rgba(255,18,147,0.08) 28%,
              rgba(110,203,255,0.06) 52%,
              rgba(200,255,0,0.03) 68%,
              transparent 85%)
          `,
          filter: 'blur(72px)',
          mixBlendMode: 'screen',
          willChange: 'transform',
          opacity: 0.92,
          boxShadow: '0 0 120px rgba(255,18,147,0.15), inset 0 0 80px rgba(110,203,255,0.08)',
        }}
      />
    </div>
  );
}
