/**
 * Run `onReveal` once when `element` enters the viewport, or after a timeout,
 * or immediately if `IntersectionObserver` is unavailable. Prevents sections
 * staying at `opacity: 0` when IO / GSAP never fires (mobile Safari edge cases).
 */
export function observeRevealOnce(
  element: HTMLElement | null,
  onReveal: () => void,
  options?: { threshold?: number; rootMargin?: string; failSafeMs?: number },
): () => void {
  if (!element || typeof window === 'undefined') return () => {};

  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    onReveal();
  };

  const failSafeMs = options?.failSafeMs ?? 3500;
  const timer = window.setTimeout(run, failSafeMs);

  if (typeof IntersectionObserver === 'undefined') {
    queueMicrotask(run);
    return () => window.clearTimeout(timer);
  }

  const io = new IntersectionObserver(
    (entries) => {
      const hit = entries.some(e => e.isIntersecting);
      if (hit) run();
    },
    {
      threshold: options?.threshold ?? 0.06,
      rootMargin: options?.rootMargin ?? '0px 0px 12% 0px',
    },
  );
  io.observe(element);

  return () => {
    window.clearTimeout(timer);
    io.disconnect();
  };
}
