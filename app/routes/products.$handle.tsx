import { useLoaderData } from '@remix-run/react';
import { json, type LoaderFunctionArgs, type MetaFunction } from '@shopify/remix-oxygen';
import type { Storefront } from '@shopify/hydrogen';
import { LOCALE_BCP47, LOCALES, type Locale } from '~/lib/i18n';
import {
  PRODUCT_NOT_FOUND_TITLE,
  SITE_KEYWORDS,
  SITE_NAME,
  productOgImageUrl,
} from '~/lib/siteMeta';
import { withLocalePath } from '~/lib/localePath';
import {
  fetchShopifyProductByHandle,
} from '~/lib/shopifyCatalog.server';
import { storefrontTokenPrefix4FromEnv, type StorefrontTokenEnv } from '~/lib/storefrontEnvDebug';
import { getProduct } from '~/lib/products';
import { ProductDetailEnhanced } from '~/components/Product/ProductDetailEnhanced';
import { useCart } from '~/lib/CartContext';

type HydrogenRouteContext = {
  storefront?: Storefront;
  env?: StorefrontTokenEnv & { PUBLIC_HOME_COLLECTION_HANDLE?: string };
};

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const siteUrl = url.origin.replace(/\/$/, '');
  const pathname = url.pathname;
  const handle = params.handle ?? '';
  const ctx = context as HydrogenRouteContext;
  const storefront = ctx.storefront;
  const debugTokenPrefix4 = storefrontTokenPrefix4FromEnv(ctx.env);

  let product = storefront
    ? await fetchShopifyProductByHandle(storefront, handle, {
        requestUrl: request.url,
        debugTokenPrefix4,
      })
    : undefined;
  if (!product) {
    product = getProduct(handle);
  }


  const { buildProductJsonLd } = await import('~/lib/schemaOrg');
  return json({
    siteUrl,
    pathname,
    product: product ?? null,
    productJsonLd: product
      ? JSON.stringify(buildProductJsonLd(siteUrl, product, pathname))
      : null,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data, params, location }) => {
  const pid = params.handle ?? '';
  const p = data?.product ?? undefined;
  const siteUrl = (data?.siteUrl ?? '').replace(/\/$/, '');
  const pagePath = (location?.pathname ?? `/products/${pid}`).split('?')[0] ?? `/products/${pid}`;
  const hreflang =
    siteUrl.length > 0
      ? [
          ...LOCALES.map((loc: Locale) => ({
            tagName: 'link' as const,
            rel: 'alternate',
            hrefLang: LOCALE_BCP47[loc],
            href: `${siteUrl}${withLocalePath(loc, `/products/${pid}`)}`,
          })),
          {
            tagName: 'link' as const,
            rel: 'alternate',
            hrefLang: 'x-default',
            href: `${siteUrl}${withLocalePath('EN', `/products/${pid}`)}`,
          },
        ]
      : [];

  if (!p) {
    return [
      { title: PRODUCT_NOT_FOUND_TITLE },
      { name: 'description', content: 'The requested piece is not in the RIOT CROWN catalog.' },
      { name: 'robots', content: 'noindex, follow' },
    ];
  }
  const desc = (p.descriptions.EN ?? p.descriptions.ZH ?? p.name).slice(0, 160);
  const canonical = siteUrl ? `${siteUrl}${pagePath}` : '';
  const ogImage =
    p.imageUrl.startsWith('http://') || p.imageUrl.startsWith('https://')
      ? p.imageUrl
      : siteUrl
        ? productOgImageUrl(siteUrl, pid)
        : '/og-brand.svg';
  const pageTitle = `${p.name} | ${SITE_NAME}`;
  const keywords = `${p.name}, ${p.material}, ${SITE_KEYWORDS}`.slice(0, 400);

  return [
    { title: pageTitle },
    { name: 'description', content: desc },
    { name: 'keywords', content: keywords },
    { name: 'robots', content: 'index, follow' },
    {
      name: 'googlebot',
      content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    },
    ...(canonical ? [{ tagName: 'link' as const, rel: 'canonical', href: canonical }] : []),
    { property: 'og:type', content: 'product' },
    ...(canonical ? [{ property: 'og:url', content: canonical }] : []),
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: p.name },
    { property: 'og:description', content: desc },
    { property: 'og:image', content: ogImage },
    {
      property: 'og:image:type',
      content: ogImage.endsWith('.svg') ? 'image/svg+xml' : 'image/jpeg',
    },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: p.name },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: p.name },
    { name: 'twitter:description', content: desc },
    { name: 'twitter:image', content: ogImage },
    ...hreflang,
  ];
};

export default function ProductDetail() {
  const { productJsonLd, product: loaderProduct } = useLoaderData<typeof loader>();
  const { addToCart } = useCart();

  if (!loaderProduct) {
    return (
      <div className="bg-void min-h-dvh-safe flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-display-xl font-black uppercase text-y2k-pink mb-4">
            产品未找到
          </h1>
          <p className="text-data text-titanium/70 mb-8">
            这件珍品不在我们的目录中。
          </p>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-y2k-pink to-y2k-purple text-white font-bold uppercase rounded hover:shadow-neon-pink transition-all"
          >
            返回首页
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {productJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: productJsonLd }}
        />
      ) : null}
      <ProductDetailEnhanced
        product={{
          id: loaderProduct.id,
          name: loaderProduct.name,
          price: loaderProduct.price,
          description: loaderProduct.descriptions?.ZH || loaderProduct.descriptions?.EN || '',
          material: loaderProduct.material,
          stock: loaderProduct.stock,
          totalStock: 100,
          soldCount: Math.floor(Math.random() * 50),
          launchDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }}
        onAddToCart={(item: Record<string, unknown>) => {
          addToCart({
            id: item.productId as string,
            name: item.productName as string,
            price: loaderProduct.price,
            material: item.material as string,
          });
        }}
      />
    </>
  );
}
