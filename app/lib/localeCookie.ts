import { LOCALES, type Locale } from '~/lib/i18n';

const COOKIE_NAME = 'riot_locale';

export function parseLocaleFromCookie(cookieHeader: string | null): Locale {
  if (!cookieHeader) return 'EN';
  const m = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=(EN|ZH|JP|KR|FR)(?:;|$)`));
  const v = m?.[1] as Locale | undefined;
  return v && (LOCALES as readonly string[]).includes(v) ? v : 'EN';
}

/** Non-HttpOnly cookie so SSR loaders can read preferred UI language. */
export function serializeLocaleCookie(locale: Locale): string {
  const base = `${COOKIE_NAME}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return `${base}; Secure`;
  }
  return base;
}
