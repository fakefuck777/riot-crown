import { useEffect } from 'react';

// Native scroll — no GSAP transform interference with fixed overlays.
// CSS scroll-behavior: smooth handles the feel.
export function useInertiaScroll(_options?: {
  damping?: number;
  wheelMultiplier?: number;
  touchDamping?: number;
  paused?: boolean;
}) {
  useEffect(() => {
    // Ensure the scroll container doesn't have a stale GSAP transform
    const container = document.getElementById('scroll-container');
    if (container) {
      container.style.transform = '';
      container.style.position  = '';
    }
  }, []);
}
