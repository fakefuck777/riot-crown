/** Oxygen / MiniOxygen env fragment used only for safe debug logging (never log full tokens). */
export type StorefrontTokenEnv = {
  PRIVATE_STOREFRONT_API_TOKEN?: string;
  PUBLIC_STOREFRONT_API_TOKEN?: string;
};

/** First 4 chars of the token Hydrogen will prefer for Storefront API (private, else public). */
export function storefrontTokenPrefix4FromEnv(env: StorefrontTokenEnv | undefined): string {
  const raw =
    (env?.PRIVATE_STOREFRONT_API_TOKEN ?? '').trim() || (env?.PUBLIC_STOREFRONT_API_TOKEN ?? '').trim();
  if (!raw) return 'NONE';
  return raw.slice(0, 4);
}
