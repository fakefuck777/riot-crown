import type { CartItem } from '~/lib/cartTypes';

export const CART_STORAGE_KEY = 'riot_crown_cart_v1';
const STORAGE_KEY = CART_STORAGE_KEY;

function isCartItem(x: unknown): x is CartItem {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.id === 'string'
    && typeof o.name === 'string'
    && typeof o.price === 'string'
    && typeof o.material === 'string'
    && typeof o.qty === 'number'
    && Number.isFinite(o.qty)
    && o.qty >= 1
    && o.qty <= 999
    && (o.size === undefined || typeof o.size === 'string')
  );
}

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota / private mode — ignore */
  }
}
