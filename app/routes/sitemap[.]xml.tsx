import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { PRODUCTS } from '~/lib/products';

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function loader({ request }: LoaderFunctionArgs) {
  const origin = new URL(request.url).origin;
  const paths = [
    '/',
    '/search',
    ...PRODUCTS.map(p => `/products/${p.id}`),
  ];
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => {
      const priority = path === '/' ? '1.0' : path === '/search' ? '0.5' : '0.7';
      return `<url><loc>${xmlEscape(`${origin}${path}`)}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
    }),
    '</urlset>',
  ].join('');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
