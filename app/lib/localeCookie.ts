import { LOCALES, type Locale } from '~/lib/i18n';

const COOKIE_NAME = 'riot_locale';
const COOKIE_RE = new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=(EN|ZH|JP|KR|FR)(?:;|$)`);

/** Returns a valid saved locale, or `null` if absent / invalid (so callers can auto-detect). */
export function readLocaleCookieIfPresent(cookieHeader: string | null): Locale | null {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(COOKIE_RE);
  const v = m?.[1] as Locale | undefined;
  return v && (LOCALES as readonly string[]).includes(v) ? v : null;
}

/** Kept for compatibility: same as `readLocaleCookieIfPresent` then `EN`. */
export function parseLocaleFromCookie(cookieHeader: string | null): Locale {
  return readLocaleCookieIfPresent(cookieHeader) ?? 'EN';
}

/** Non-HttpOnly cookie so SSR loaders can read preferred UI language. Pass `secure` on the server from `request.url`. */
export function serializeLocaleCookie(locale: Locale, secure?: boolean): string {
  const base = `${COOKIE_NAME}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  const useSecure =
    secure ?? (typeof window !== 'undefined' && window.location.protocol === 'https:');
  return useSecure ? `${base}; Secure` : base;
}
