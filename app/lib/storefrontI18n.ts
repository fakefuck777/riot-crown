import type { CountryCode, LanguageCode } from '@shopify/hydrogen-react/storefront-api-types';

/** Env shape from Oxygen / MiniOxygen (see server.ts). */
export type StorefrontI18nEnv = {
  PUBLIC_STOREFRONT_LANGUAGE?: string;
  PUBLIC_STOREFRONT_COUNTRY?: string;
};

/**
 * Storefront API `@inContext` defaults for Hydrogen.
 * Set `PUBLIC_STOREFRONT_LANGUAGE` / `PUBLIC_STOREFRONT_COUNTRY` to match your Shopify
 * market (e.g. JA + JP for Tokyo-primary, EN + US otherwise).
 */
export function getStorefrontI18n(env: StorefrontI18nEnv): {
  language: LanguageCode;
  country: CountryCode;
} {
  const rawLang = env.PUBLIC_STOREFRONT_LANGUAGE?.trim().toUpperCase();
  const rawCountry = env.PUBLIC_STOREFRONT_COUNTRY?.trim().toUpperCase();
  return {
    language: (rawLang || 'EN') as LanguageCode,
    country: (rawCountry || 'US') as CountryCode,
  };
}
