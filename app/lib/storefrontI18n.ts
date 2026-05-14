import type { CountryCode, LanguageCode } from '@shopify/hydrogen-react/storefront-api-types';
import type { Locale } from '~/lib/i18n';
import { readLocaleCookieIfPresent } from '~/lib/localeCookie';
import { stripLeadingLocaleFromPathname } from '~/lib/localePath';

/** Env shape from Oxygen / MiniOxygen (see server.ts). */
export type StorefrontI18nEnv = {
  PUBLIC_STOREFRONT_LANGUAGE?: string;
  PUBLIC_STOREFRONT_COUNTRY?: string;
};

/** Optional session overrides (set `storefront_country` / `storefront_language` if you add them). */
export type StorefrontSessionLike = { get: (key: string) => unknown };

/**
 * UI locale slug / cookie → Storefront `@inContext` language + country for non-EN locales.
 * `EN` (no prefix or `riot_locale=EN`) uses env `PUBLIC_STOREFRONT_*` only — set those in Oxygen
 * to your primary market (e.g. US + EN, or JP + JA) instead of inferring from code.
 */
const LOCALE_TO_MARKET: Record<Exclude<Locale, 'EN'>, { language: LanguageCode; country: CountryCode }> = {
  JP: { language: 'JA', country: 'JP' },
  KR: { language: 'KO', country: 'KR' },
  ZH: { language: 'ZH', country: 'CN' },
  FR: { language: 'FR', country: 'FR' },
};

/**
 * Per-request Storefront buyer context for `createStorefrontClient`:
 * 1. Leading URL locale (`/ja/...` → JP market) or `riot_locale` cookie when path has no prefix.
 * 2. Optional session keys `storefront_country` + `storefront_language` (if you set them).
 * 3. Else `getStorefrontI18n(env)` (Oxygen `PUBLIC_STOREFRONT_LANGUAGE` / `PUBLIC_STOREFRONT_COUNTRY`).
 */
export function resolveStorefrontI18nForRequest(
  request: Request,
  env: StorefrontI18nEnv,
  session?: StorefrontSessionLike,
): { language: LanguageCode; country: CountryCode } {
  const pathname = new URL(request.url).pathname;
  const { leadingLocale } = stripLeadingLocaleFromPathname(pathname);
  const cookieLocale = readLocaleCookieIfPresent(request.headers.get('Cookie'));
  const uiLocale = leadingLocale ?? cookieLocale;

  if (uiLocale && uiLocale !== 'EN') {
    return LOCALE_TO_MARKET[uiLocale];
  }

  const sc = session?.get('storefront_country');
  const sl = session?.get('storefront_language');
  if (typeof sc === 'string' && /^[A-Za-z]{2}$/.test(sc.trim()) && typeof sl === 'string' && sl.trim().length >= 2) {
    return {
      country: sc.trim().toUpperCase() as CountryCode,
      language: sl.trim().toUpperCase() as LanguageCode,
    };
  }

  return getStorefrontI18n(env);
}

/**
 * Env-only defaults for Storefront API `@inContext` (Hydrogen merges into queries that declare `$country` / `$language`).
 * Configure `PUBLIC_STOREFRONT_COUNTRY` / `PUBLIC_STOREFRONT_LANGUAGE` in Oxygen to match your Markets primary catalog.
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
