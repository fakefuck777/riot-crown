import type { ProductData } from '~/lib/products';
import { parseDisplayPriceYen } from '~/lib/price';
import { productOgImageUrl, SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from '~/lib/siteMeta';

const SCHEMA = 'https://schema.org';

/** Organization + WebSite graph for `<html>` (single injection in root layout). */
export function buildRootJsonLd(siteUrl: string) {
  const base = siteUrl.replace(/\/$/, '');
  const logo = `${base}/og-brand.svg`;
  const orgId = `${base}/#organization`;
  const webId = `${base}/#website`;

  return {
    '@context': SCHEMA,
    '@graph': [
      {
        '@type': ['Organization', 'OnlineStore'],
        '@id': orgId,
        name: SITE_NAME,
        legalName: SITE_NAME,
        url: base,
        slogan: SITE_TAGLINE,
        description: SITE_DESCRIPTION,
        logo: { '@type': 'ImageObject', url: logo, contentUrl: logo },
        image: [logo],
        areaServed: { '@type': 'Place', name: 'Worldwide' },
        knowsAbout: [
          'Y2K fashion jewelry',
          'millennium design',
          'chrome finish jewelry',
          'crystal jewelry',
          'sterling silver',
          'gold jewelry',
        ],
        priceRange: '¥¥',
      },
      {
        '@type': 'WebSite',
        '@id': webId,
        name: SITE_NAME,
        url: base,
        description: SITE_DESCRIPTION,
        inLanguage: ['en', 'zh-Hant', 'ja', 'ko', 'fr'],
        publisher: { '@id': orgId },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${base}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
}

/** ItemList for the catalog (home route; complements root graph). */
export function buildCatalogItemListJsonLd(siteUrl: string, products: ProductData[]) {
  const base = siteUrl.replace(/\/$/, '');
  return {
    '@context': SCHEMA,
    '@type': 'ItemList',
    name: `${SITE_NAME} — collection`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.name,
      url: `${base}/products/${p.id}`,
    })),
  };
}

function availabilityUrl(stock: number | undefined): string {
  if (stock === undefined) return `${SCHEMA}/InStock`;
  return stock > 0 ? `${SCHEMA}/InStock` : `${SCHEMA}/OutOfStock`;
}

/** Product + BreadcrumbList for PDP (references root `#organization`). */
export function buildProductJsonLd(siteUrl: string, product: ProductData, requestPathname?: string) {
  const base = siteUrl.replace(/\/$/, '');
  const path =
    requestPathname && requestPathname.startsWith('/')
      ? requestPathname
      : `/products/${product.id}`;
  const canonical = `${base}${path}`;
  const orgId = `${base}/#organization`;
  const primaryImage =
    product.imageUrl.startsWith('http://') || product.imageUrl.startsWith('https://')
      ? product.imageUrl
      : productOgImageUrl(base, product.id);
  const offerCurrency = product.priceCurrency ?? 'JPY';
  const offerPrice =
    product.priceAmount != null
      ? product.priceAmount
      : String(Math.round(parseDisplayPriceYen(product.price)));
  const desc = (product.descriptions.EN ?? product.descriptions.ZH ?? product.name).slice(0, 8000);

  return {
    '@context': SCHEMA,
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${canonical}#product`,
        name: product.name,
        description: desc,
        sku: product.id,
        mpn: product.id,
        image: [primaryImage],
        brand: { '@type': 'Brand', name: SITE_NAME },
        category: 'Jewelry',
        material: product.material,
        offers: {
          '@type': 'Offer',
          url: canonical,
          priceCurrency: offerCurrency,
          price: offerPrice,
          priceValidUntil: new Date(Date.now() + 180 * 864e5).toISOString().slice(0, 10),
          availability: availabilityUrl(product.stock),
          itemCondition: `${SCHEMA}/NewCondition`,
          seller: { '@id': orgId },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: SITE_NAME,
            item: base,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: product.name,
            item: canonical,
          },
        ],
      },
    ],
  };
}
