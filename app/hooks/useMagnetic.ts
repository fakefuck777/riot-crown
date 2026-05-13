'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/** Subtle magnetic pull on fine-pointer devices; no-op cleanup on unmount. */
export function useMagnetic<T extends HTMLElement>(strength = 1) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const max = 14 * strength;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const nx = ((e.clientX - cx) / Math.max(r.width / 2, 1)) * max;
      const ny = ((e.clientY - cy) / Math.max(r.height / 2, 1)) * max;
      gsap.to(el, { x: nx, y: ny, duration: 0.52, ease: 'power3.out', overwrite: 'auto' });
    };

    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.88, ease: 'power4.out', overwrite: 'auto' });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: 'transform' });
    };
  }, [strength]);

  return ref;
}
