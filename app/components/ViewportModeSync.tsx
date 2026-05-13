'use client';

import { useEffect } from 'react';

/**
 * Pushes viewport / interaction hints onto <html data-*>, so global CSS can
 * branch layouts without UA sniffing (fragile) or per-page resize listeners.
 */
export function ViewportModeSync() {
  useEffect(() => {
    const root = document.documentElement;

    const coarseMq = window.matchMedia('(pointer: coarse)');
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hoverMq = window.matchMedia('(hover: hover)');

    const setPointer = () => {
      root.dataset.pointer = coarseMq.matches ? 'coarse' : 'fine';
      root.dataset.hover = hoverMq.matches ? 'hover' : 'none';
    };

    const setMotion = () => {
      root.dataset.reducedMotion = reduceMq.matches ? 'reduce' : 'no-preference';
    };

    const applyGeometry = () => {
      const w = window.visualViewport?.width ?? window.innerWidth;
      const h = window.visualViewport?.height ?? window.innerHeight;
      const ih = window.innerHeight;

      let vw: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      if (w < 360) vw = 'xs';
      else if (w < 480) vw = 'sm';
      else if (w < 640) vw = 'md';
      else if (w < 768) vw = 'lg';
      else vw = 'xl';

      root.dataset.vw = vw;
      root.dataset.orientation = w >= h ? 'landscape' : 'portrait';

      const ratio = h / Math.max(w, 1);
      if (ratio >= 2) root.dataset.aspect = 'ultra-tall';
      else if (ratio <= 0.52) root.dataset.aspect = 'ultra-wide';
      else root.dataset.aspect = 'normal';

      // Keyboard / chrome shrink: visual viewport shorter than layout viewport
      const vvShort = ih > 0 && h < ih * 0.78;
      root.dataset.viewportChrome = vvShort ? 'compact' : 'comfortable';
    };

    setPointer();
    setMotion();
    applyGeometry();

    const onResize = () => {
      window.requestAnimationFrame(applyGeometry);
    };

    coarseMq.addEventListener('change', setPointer);
    hoverMq.addEventListener('change', setPointer);
    reduceMq.addEventListener('change', setMotion);
    window.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('scroll', onResize);

    return () => {
      coarseMq.removeEventListener('change', setPointer);
      hoverMq.removeEventListener('change', setPointer);
      reduceMq.removeEventListener('change', setMotion);
      window.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('scroll', onResize);
      root.removeAttribute('data-vw');
      root.removeAttribute('data-orientation');
      root.removeAttribute('data-aspect');
      root.removeAttribute('data-pointer');
      root.removeAttribute('data-hover');
      root.removeAttribute('data-reduced-motion');
      root.removeAttribute('data-viewport-chrome');
    };
  }, []);

  return null;
}
