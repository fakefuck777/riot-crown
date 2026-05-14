/** Oxygen / MiniOxygen env fragment used only for safe debug logging (never log full tokens). */
export type StorefrontTokenEnv = {
  PRIVATE_STOREFRONT_API_TOKEN?: string;
  PUBLIC_STOREFRONT_API_TOKEN?: string;
};

/**
 * Returns a safe debug label showing which token mode is active and its first 6 chars.
 * Private token takes precedence (Hydrogen uses Shopify-Storefront-Private-Token header).
 * Public token must be the Storefront API token (starts with 2b10 or similar), NOT an Admin token (shpa/shpat_).
 */
export function storefrontTokenPrefix4FromEnv(env: StorefrontTokenEnv | undefined): string {
  const priv = (env?.PRIVATE_STOREFRONT_API_TOKEN ?? '').trim();
  const pub  = (env?.PUBLIC_STOREFRONT_API_TOKEN ?? '').trim();
  if (priv) return `PRIVATE:${priv.slice(0, 6)}`;
  if (pub)  return `PUBLIC:${pub.slice(0, 6)}`;
  return 'NONE';
}
