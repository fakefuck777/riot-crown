import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { PRODUCTS } from '~/lib/products';
import { LOCALES } from '~/lib/i18n';
import { withLocalePath } from '~/lib/localePath';

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function loader({ request }: LoaderFunctionArgs) {
  const origin = new URL(request.url).origin;
  const paths = new Set<string>();
  for (const loc of LOCALES) {
    paths.add(withLocalePath(loc, '/'));
    paths.add(withLocalePath(loc, '/search'));
    for (const p of PRODUCTS) {
      paths.add(withLocalePath(loc, `/products/${p.id}`));
    }
  }
  const pathList = [...paths].sort();
  const lastmod = new Date().toISOString().slice(0, 10);
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pathList.map((path) => {
      const priority =
        path.endsWith('/search') || path.includes('/search') ? '0.5' : path.includes('/products/') ? '0.7' : '1.0';
      return `<url><loc>${xmlEscape(`${origin}${path}`)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
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
