import type { Locale } from '~/lib/i18n';
import { LOCALES } from '~/lib/i18n';

/** Lowercase URL segment for non-EN locales; EN keeps unprefixed paths (`/` not `/en`). */
export const LOCALE_URL_SLUG: Record<Locale, string> = {
  EN: 'en',
  ZH: 'zh',
  JP: 'ja',
  KR: 'ko',
  FR: 'fr',
};

const SLUG_TO_LOCALE = Object.fromEntries(
  (LOCALES as readonly Locale[]).map((loc) => [LOCALE_URL_SLUG[loc], loc] as const),
) as Record<string, Locale>;

/** First path segment (lowercase) → UI locale, or null if not a locale slug. */
export function localeFromUrlSlug(segment: string | undefined): Locale | null {
  if (!segment) return null;
  return SLUG_TO_LOCALE[segment.toLowerCase()] ?? null;
}

export interface StrippedPath {
  /** Locale read from the first segment, if it matched a known slug. */
  leadingLocale: Locale | null;
  /** Path without the leading `/{slug}` when `leadingLocale` was set (always starts with `/`). */
  restPath: string;
}

/**
 * Strips a single leading locale segment from the pathname.
 * Example: `/ja/products/01` → `{ leadingLocale: 'JP', restPath: '/products/01' }`.
 */
export function stripLeadingLocaleFromPathname(pathname: string): StrippedPath {
  const raw = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const segments = raw.split('/').filter(Boolean);
  if (segments.length === 0) return { leadingLocale: null, restPath: '/' };

  const first = segments[0] ?? '';
  const loc = localeFromUrlSlug(first);
  if (!loc) return { leadingLocale: null, restPath: raw === '' ? '/' : raw };

  const tail = segments.slice(1);
  const restPath = tail.length ? `/${tail.join('/')}` : '/';
  return { leadingLocale: loc, restPath };
}

/**
 * Builds a path with optional locale prefix. EN stays unprefixed; others use `/{slug}/...`.
 * `targetPath` should be the logical path (e.g. `/products/01`), without an existing locale prefix.
 */
export function withLocalePath(locale: Locale, targetPath: string): string {
  const t = targetPath.startsWith('/') ? targetPath : `/${targetPath}`;
  if (locale === 'EN') return t || '/';
  const slug = LOCALE_URL_SLUG[locale];
  if (t === '/') return `/${slug}`;
  return `/${slug}${t}`;
}
