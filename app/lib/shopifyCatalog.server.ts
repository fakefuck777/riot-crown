import { CacheShort } from '@shopify/hydrogen';
import type { Storefront } from '@shopify/hydrogen';
import { makeSVG } from '~/lib/makeSVG';
import { PRODUCTS, type ProductData } from '~/lib/products';

const CATALOG_FIRST = 48;

const SIZE_CYCLE: ProductData['size'][] = [
  'large', 'tall', 'wide', 'standard', 'tall', 'standard',
];

/** Storefront catalog query — `nodes` on ProductConnection (API 2024+). */
const CATALOG_PRODUCTS_QUERY = `#graphql
  query CatalogProducts($first: Int!) {
    products(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        id
        handle
        title
        description
        descriptionHtml
        vendor
        productType
        tags
        featuredImage {
          url(transform: { maxWidth: 1200, maxHeight: 1600 })
          altText
        }
        totalInventory
        tracksInventory
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        variants(first: 50) {
          nodes {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

const COLLECTION_PRODUCTS_QUERY = `#graphql
  query CollectionCatalog($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      products(first: $first, sortKey: BEST_SELLING) {
        nodes {
          id
          handle
          title
          description
          descriptionHtml
          vendor
          productType
          tags
          featuredImage {
            url(transform: { maxWidth: 1200, maxHeight: 1600 })
            altText
          }
          totalInventory
          tracksInventory
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          variants(first: 50) {
            nodes {
              id
              title
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `#graphql
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      vendor
      productType
      tags
      featuredImage {
        url(transform: { maxWidth: 1600, maxHeight: 2000 })
        altText
      }
      totalInventory
      tracksInventory
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      variants(first: 50) {
        nodes {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatMoney(amount: string, currencyCode: string): string {
  const n = parseFloat(amount);
  if (!Number.isFinite(n)) return amount;
  if (currencyCode === 'CNY' || currencyCode === 'JPY') {
    const formatted = Math.round(n).toLocaleString('zh-CN', { maximumFractionDigits: 0 });
    return currencyCode === 'CNY' ? `¥ ${formatted}` : `¥ ${formatted}`;
  }
  if (currencyCode === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
  }
  if (currencyCode === 'EUR') {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);
  }
  return `${currencyCode} ${amount}`;
}

const SIZE_OPTION = /^(size|sizes|taille|尺码|尺寸|規格)$/i;

function variantSizes(
  variants: Array<{ selectedOptions: Array<{ name: string; value: string }> }>,
): string[] | undefined {
  const set = new Set<string>();
  for (const v of variants) {
    for (const opt of v.selectedOptions ?? []) {
      if (SIZE_OPTION.test(opt.name.trim())) {
        set.add(opt.value.trim());
      }
    }
  }
  if (set.size === 0) return undefined;
  return [...set];
}

function defaultMerchandiseId(
  variants: Array<{ id: string; availableForSale: boolean }>,
): string | undefined {
  const avail = variants.find(v => v.availableForSale);
  return (avail ?? variants[0])?.id;
}

type SfVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
};

type SfProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  featuredImage: { url: string; altText: string | null } | null;
  totalInventory: number | null;
  tracksInventory: boolean;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { nodes: SfVariant[] };
};

function variantSizeToIdMap(variants: SfVariant[]): Record<string, string> | undefined {
  const m: Record<string, string> = {};
  for (const v of variants) {
    const sizeOpt = v.selectedOptions?.find(o => SIZE_OPTION.test(o.name.trim()));
    if (sizeOpt) m[sizeOpt.value.trim()] = v.id;
  }
  return Object.keys(m).length ? m : undefined;
}

function mapNode(node: SfProductNode, index: number): ProductData {
  const variants = node.variants?.nodes ?? [];
  const descPlain =
    (node.description && node.description.trim()) ||
    stripHtml(node.descriptionHtml ?? '') ||
    node.title;
  const desc = descPlain.slice(0, 4000);
  const tagsUpper = (node.tags ?? []).slice(0, 8).map(t => String(t).toUpperCase());
  const detailsFromMeta = [node.vendor, node.productType].filter(Boolean) as string[];
  const detailsList: Record<string, string[]> = {
    ZH: tagsUpper.length ? tagsUpper : detailsFromMeta.map(s => s.toUpperCase()),
    EN: tagsUpper.length ? tagsUpper : detailsFromMeta.map(s => s.toUpperCase()),
    JP: tagsUpper.length ? tagsUpper : detailsFromMeta.map(s => s.toUpperCase()),
    KR: tagsUpper.length ? tagsUpper : detailsFromMeta.map(s => s.toUpperCase()),
    FR: tagsUpper.length ? tagsUpper : detailsFromMeta.map(s => s.toUpperCase()),
  };
  const minP = node.priceRange?.minVariantPrice;
  const priceStr = minP ? formatMoney(minP.amount, minP.currencyCode) : '—';
  const label = (node.handle || node.title).slice(0, 10).toUpperCase();
  const imageUrl =
    node.featuredImage?.url ??
    makeSVG(String(index + 1).padStart(2, '0'), 600, 800, '#C9A84C', label);

  let stock: number | undefined;
  if (node.tracksInventory && node.totalInventory != null) {
    stock = node.totalInventory;
  }

  const sizes = variantSizes(variants);
  const variantIdsBySize = variantSizeToIdMap(variants);
  const merchandiseId = defaultMerchandiseId(variants);

  return {
    id: node.handle,
    name: node.title,
    price: priceStr,
    priceAmount: minP?.amount,
    priceCurrency: minP?.currencyCode,
    material: (node.vendor || node.productType || '—').toUpperCase(),
    imageUrl,
    size: SIZE_CYCLE[index % SIZE_CYCLE.length],
    stock,
    descriptions: {
      ZH: desc,
      EN: desc,
      JP: desc,
      KR: desc,
      FR: desc,
    },
    detailsList,
    accent: '#C9A84C',
    sizes,
    variantIdsBySize,
    merchandiseId,
  };
}

export type CatalogLoadResult = {
  products: ProductData[];
  source: 'shopify' | 'demo';
};

/**
 * Shopify catalog when the API returns at least one product; otherwise the built-in demo list.
 */
export async function loadStoreCatalog(
  storefront: Storefront | undefined,
  collectionHandle?: string,
): Promise<CatalogLoadResult> {
  if (!storefront) {
    return { products: PRODUCTS, source: 'demo' };
  }
  try {
    const shop = await fetchShopifyCatalog(storefront, { collectionHandle });
    if (shop.length > 0) {
      return { products: shop, source: 'shopify' };
    }
  } catch (e) {
    console.error('[loadStoreCatalog]', e);
  }
  return { products: PRODUCTS, source: 'demo' };
}

/**
 * Load catalog for the storefront: Shopify products when API returns data,
 * otherwise empty (caller merges demo `PRODUCTS` if desired).
 */
export async function fetchShopifyCatalog(
  storefront: Storefront,
  opts?: { collectionHandle?: string },
): Promise<ProductData[]> {
  const handle = opts?.collectionHandle?.trim();
  let nodes: SfProductNode[] = [];

  if (handle) {
    const { data, errors } = await storefront.query(COLLECTION_PRODUCTS_QUERY, {
      variables: { handle, first: CATALOG_FIRST },
      cache: CacheShort(),
    });
    if (errors?.length) {
      console.error('[fetchShopifyCatalog] collection errors', errors);
    }
    const col = (data as { collection?: { products?: { nodes: SfProductNode[] } } } | null)?.collection;
    nodes = col?.products?.nodes ?? [];
    if (nodes.length === 0) {
      const { data: d2, errors: e2 } = await storefront.query(CATALOG_PRODUCTS_QUERY, {
        variables: { first: CATALOG_FIRST },
        cache: CacheShort(),
      });
      if (e2?.length) console.error('[fetchShopifyCatalog] products fallback errors', e2);
      nodes =
        (d2 as { products?: { nodes: SfProductNode[] } } | null)?.products?.nodes ?? [];
    }
  } else {
    const { data, errors } = await storefront.query(CATALOG_PRODUCTS_QUERY, {
      variables: { first: CATALOG_FIRST },
      cache: CacheShort(),
    });
    if (errors?.length) {
      console.error('[fetchShopifyCatalog] products errors', errors);
    }
    nodes = (data as { products?: { nodes: SfProductNode[] } } | null)?.products?.nodes ?? [];
  }

  return nodes.map((n, i) => mapNode(n, i));
}

export async function fetchShopifyProductByHandle(
  storefront: Storefront,
  handle: string,
): Promise<ProductData | undefined> {
  if (!handle.trim()) return undefined;
  const { data, errors } = await storefront.query(PRODUCT_BY_HANDLE_QUERY, {
    variables: { handle: handle.trim() },
    cache: CacheShort(),
  });
  if (errors?.length) {
    console.error('[fetchShopifyProductByHandle] errors', errors);
  }
  const node = (data as { product?: SfProductNode | null } | null)?.product;
  if (!node) return undefined;
  return mapNode(node, 0);
}
