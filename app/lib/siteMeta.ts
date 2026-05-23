/** Brand + SEO copy used by meta tags, JSON-LD, and manifests. */

export const SITE_NAME = 'RIOT CROWN';

export const SITE_DESCRIPTION =
  'RIOT CROWN — Exclusive luxury jewelry collective. Bespoke Y2K-futurist pieces: hand-forged crystal geometries, liquid chrome finishes, and neo-millennial minimalism. Private atelier editions; curated worldwide delivery; members-only access.';

/** Short line for Organization / manifest `description` caps. */
export const SITE_TAGLINE = 'Luxury atelier. Rare geometries. Curated for the discerning.';

export const SITE_TITLE_SUFFIX = 'Exclusive Luxury Jewelry · Private Atelier';

/** Default `<title>` for inner pages that do not override. */
export const SITE_DEFAULT_TITLE = `${SITE_NAME} | ${SITE_TITLE_SUFFIX}`;

/** Home hero route title (em dash). */
export const SITE_HOME_TITLE = `${SITE_NAME} — ${SITE_TITLE_SUFFIX}`;

export const PRODUCT_NOT_FOUND_TITLE = `Piece Not Found | ${SITE_NAME}`;

/** Comma-separated `keywords` meta (lightweight signal; keep honest, non-spammy). */
export const SITE_KEYWORDS = [
  'RIOT CROWN',
  'luxury jewelry',
  'exclusive jewelry',
  'bespoke jewelry',
  'Y2K jewelry',
  'crystal jewelry',
  'chrome jewelry',
  'atelier jewelry',
  'limited edition',
  'private collection',
].join(', ');

export const OG_IMAGE_PATH = '/og-brand.svg';

export function absoluteUrl(siteUrl: string, path: string): string {
  const base = siteUrl.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export function absoluteOgImage(siteUrl: string): string {
  return absoluteUrl(siteUrl, OG_IMAGE_PATH);
}

/** Dynamic Open Graph image for a catalog product (SVG, 1200×630). */
export function productOgImageUrl(siteUrl: string, productId: string): string {
  const base = siteUrl.replace(/\/$/, '');
  return `${base}/og/product/${productId}.svg`;
}
