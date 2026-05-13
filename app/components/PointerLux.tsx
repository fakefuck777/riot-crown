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
        className="absolute left-0 top-0 h-[min(58vw,820px)] w-[min(58vw,820px)] rounded-full"
        style={{
          background: `
            radial-gradient(circle closest-side,
              rgba(201,168,76,0.11) 0%,
              rgba(255,18,147,0.045) 42%,
              transparent 78%)
          `,
          filter: 'blur(64px)',
          mixBlendMode: 'screen',
          willChange: 'transform',
          opacity: 0.82,
        }}
      />
    </div>
  );
}
