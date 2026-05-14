import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import type { Storefront } from '@shopify/hydrogen';
import { LOCALES } from '~/lib/i18n';
import { withLocalePath } from '~/lib/localePath';
import { loadStoreCatalog } from '~/lib/shopifyCatalog.server';
import { storefrontTokenPrefix4FromEnv, type StorefrontTokenEnv } from '~/lib/storefrontEnvDebug';

type HydrogenRouteContext = {
  storefront?: Storefront;
  env?: StorefrontTokenEnv & { PUBLIC_HOME_COLLECTION_HANDLE?: string };
};

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function loader({ request, context }: LoaderFunctionArgs) {
  const origin = new URL(request.url).origin;
  const ctx = context as HydrogenRouteContext;
  const debugTokenPrefix4 = storefrontTokenPrefix4FromEnv(ctx.env);
  const { products } = await loadStoreCatalog(ctx.storefront, {
    collectionHandle: ctx.env?.PUBLIC_HOME_COLLECTION_HANDLE,
    requestUrl: request.url,
    debugTokenPrefix4,
  });
  const paths = new Set<string>();
  for (const loc of LOCALES) {
    paths.add(withLocalePath(loc, '/'));
    paths.add(withLocalePath(loc, '/search'));
    for (const p of products) {
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
