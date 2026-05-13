import type { Locale } from '~/lib/i18n';
import { readLocaleCookieIfPresent } from '~/lib/localeCookie';
import { localeFromUrlSlug } from '~/lib/localePath';

/** ISO 3166-1 alpha-2 → UI locale when browser language is ambiguous. */
const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  JP: 'JP',
  KR: 'KR',
  CN: 'ZH',
  TW: 'ZH',
  HK: 'ZH',
  MO: 'ZH',
  SG: 'ZH',
  FR: 'FR',
  BE: 'FR',
  LU: 'FR',
  MC: 'FR',
  GF: 'FR',
  PF: 'FR',
  RE: 'FR',
  GP: 'FR',
  MQ: 'FR',
  US: 'EN',
  GB: 'EN',
  AU: 'EN',
  NZ: 'EN',
  IE: 'EN',
  CA: 'EN',
  IN: 'EN',
  ZA: 'EN',
};

/** Map BCP 47 / Accept-Language tag to supported locale, or null. */
export function localeFromLanguageTag(tagRaw: string): Locale | null {
  const tag = tagRaw.trim().toLowerCase();
  if (!tag) return null;
  if (tag.startsWith('zh')) return 'ZH';
  const primary = tag.split('-')[0] ?? tag;
  if (primary === 'ja') return 'JP';
  if (primary === 'ko') return 'KR';
  if (primary === 'fr') return 'FR';
  if (primary === 'en') return 'EN';
  return null;
}

/**
 * Parse `Accept-Language` (RFC 7231) and return the best supported locale, or null.
 */
export function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header?.trim()) return null;
  const scored: { tag: string; q: number }[] = [];
  for (const segment of header.split(',')) {
    const [langPart, ...params] = segment.trim().split(';');
    const tag = langPart.trim().toLowerCase();
    if (!tag) continue;
    let q = 1;
    for (const p of params) {
      const [k, v] = p.split('=').map(s => s.trim().toLowerCase());
      if (k === 'q' && v) {
        const n = parseFloat(v);
        if (!Number.isNaN(n)) q = Math.min(1, Math.max(0, n));
      }
    }
    scored.push({ tag, q });
  }
  scored.sort((a, b) => b.q - a.q);
  for (const { tag } of scored) {
    const loc = localeFromLanguageTag(tag);
    if (loc) return loc;
  }
  return null;
}

export function localeFromCountry(country: string | null): Locale | null {
  if (!country) return null;
  const c = country.toUpperCase();
  return COUNTRY_TO_LOCALE[c] ?? null;
}

export interface ResolvedLocale {
  locale:       Locale;
  /** When true, append `Set-Cookie` so the choice sticks (no valid cookie yet). */
  shouldPersist: boolean;
}

/**
 * Resolve UI locale:
 * 1. Explicit `/{localeSlug}/…` in the URL wins (user or share link).
 * 2. Else saved `riot_locale` cookie (user previously chose in LanguageSwitcher).
 * 3. Else **EN** — first visit is always English; we do not auto-pick from Accept-Language or edge country
 *    (users change language in the UI or open /ja/, /zh/, etc.).
 */
export function resolveLocaleForRequest(request: Request): ResolvedLocale {
  const url = new URL(request.url);
  const firstSeg = url.pathname.split('/').filter(Boolean)[0];
  const fromPath = localeFromUrlSlug(firstSeg?.toLowerCase());
  const cookieHeader = request.headers.get('Cookie');
  const fromCookie = readLocaleCookieIfPresent(cookieHeader);

  if (fromPath) {
    return {
      locale:       fromPath,
      shouldPersist: fromCookie !== fromPath,
    };
  }

  if (fromCookie) return { locale: fromCookie, shouldPersist: false };

  return { locale: 'EN', shouldPersist: true };
}
