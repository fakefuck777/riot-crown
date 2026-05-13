export type HeroGpuTier = 'high' | 'mid' | 'low';

/**
 * Sync GPU / device heuristic for hero post stack (no network).
 * Used to scale bloom resolution and toggle SMAA without blocking render.
 */
export function getHeroGpuTier(): HeroGpuTier {
  if (typeof window === 'undefined') return 'high';

  const cores = navigator.hardwareConcurrency ?? 8;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory;
  const dpr = window.devicePixelRatio ?? 1;

  let score = 3;
  if (cores <= 4) score -= 1;
  if (cores <= 2) score -= 1;
  if (mem !== undefined && mem <= 4) score -= 1;
  if (mem !== undefined && mem <= 2) score -= 1;
  if (dpr >= 3 && cores <= 6) score -= 1;

  const coarse =
    'ontouchstart' in window ||
    (typeof navigator.maxTouchPoints === 'number' && navigator.maxTouchPoints > 0);
  if (coarse && cores <= 6 && (mem === undefined || mem <= 6)) score -= 1;

  if (score <= 1) return 'low';
  if (score === 2) return 'mid';
  return 'high';
}
