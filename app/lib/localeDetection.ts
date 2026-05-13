import type { Locale } from '~/lib/i18n';
import { readLocaleCookieIfPresent } from '~/lib/localeCookie';

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

function getCountryCode(request: Request): string | null {
  const tryKeys = [
    'cf-ipcountry',
    'CF-IPCountry',
    'x-vercel-ip-country',
    'X-Vercel-IP-Country',
    'x-geo-country',
    'X-Geo-Country',
  ];
  for (const key of tryKeys) {
    const v = request.headers.get(key);
    if (v && /^[A-Za-z]{2}$/.test(v.trim())) return v.trim().toUpperCase();
  }
  return null;
}

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
 * Resolve UI locale: saved cookie wins; else `Accept-Language`; else CDN / edge country; else EN.
 */
export function resolveLocaleForRequest(request: Request): ResolvedLocale {
  const cookieHeader = request.headers.get('Cookie');
  const fromCookie = readLocaleCookieIfPresent(cookieHeader);
  if (fromCookie) return { locale: fromCookie, shouldPersist: false };

  const fromAL = localeFromAcceptLanguage(request.headers.get('Accept-Language'));
  if (fromAL) return { locale: fromAL, shouldPersist: true };

  const fromCountry = localeFromCountry(getCountryCode(request));
  if (fromCountry) return { locale: fromCountry, shouldPersist: true };

  return { locale: 'EN', shouldPersist: true };
}
