/**
 * Canonical Online Store origin for account / policy deep links (Hydrogen compat stubs).
 */
export function shopifyStorefrontOrigin(context: unknown): string | null {
  const domain = (context as { env?: { PUBLIC_STORE_DOMAIN?: string } })?.env?.PUBLIC_STORE_DOMAIN;
  if (!domain || typeof domain !== 'string') return null;
  const host = domain.replace(/^https?:\/\//i, '').split('/')[0]?.trim();
  if (!host) return null;
  return `https://${host}`;
}
