import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { SITE_NAME, SITE_TAGLINE } from '~/lib/siteMeta';

/**
 * Web app manifest (installable surface, theme colors, icon).
 * @see https://developer.mozilla.org/en-US/docs/Web/Manifest
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const origin = new URL(request.url).origin;
  const icon = `${origin}/og-brand.svg`;

  const manifest = {
    id: `${origin}/`,
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_TAGLINE,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#050508',
    theme_color: '#050508',
    lang: 'en',
    dir: 'ltr',
    orientation: 'portrait-primary',
    categories: ['shopping', 'lifestyle', 'fashion'],
    icons: [
      {
        src: icon,
        type: 'image/svg+xml',
        sizes: 'any',
        purpose: 'any maskable',
      },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
