/**
 * Shopify Storefront catalog for Hydrogen/Oxygen.
 * - 降级测试：本文件内 GraphQL **不**使用 `@inContext` / `$country` / `$language`，用于确认在无查询级地区约束时 API 是否返回数据。
 * - `server.ts` 仍用 `resolveStorefrontI18nForRequest` 创建 `storefront`；购物车等内置查询若含 `$country` 仍会由 Hydrogen 注入 i18n。
 * - GraphQL: no Product.totalInventory / tracksInventory (avoids extra scopes that break whole query).
 * - Errors: logStorefrontFailure → JSON with extensions/stack/cause (Oxygen logs).
 */
import { CacheShort } from '@shopify/hydrogen';
import type { Storefront } from '@shopify/hydrogen';
import { makeSVG } from '~/lib/makeSVG';
import { PRODUCTS, type ProductData } from '~/lib/products';

const CATALOG_FIRST = 48;

function logStorefrontI18nBeforeQuery(
  storefront: Storefront,
  requestUrl: string | undefined,
  op: string,
): void {
  const i18n = (storefront as { i18n?: { country?: string; language?: string } }).i18n;
  console.log('Current context:', i18n);
  let pathname = '';
  try {
    pathname = requestUrl ? new URL(requestUrl).pathname : '';
  } catch {
    pathname = '';
  }
  if (requestUrl) {
    console.log('Current request path (compare to locale prefix / Markets):', { pathname, op });
  }
}

/**
 * Serialize Storefront / network errors — GraphQL errors often have extensions;
 * plain `Error` may stringify to `{}` in console.
 */
function serializeStorefrontErrors(errors: unknown): unknown[] {
  if (!Array.isArray(errors)) return [{ raw: errors }];
  return errors.map((err) => {
    if (err == null) return { value: null };
    if (typeof err === 'string') return { message: err };
    if (typeof err !== 'object') return { value: String(err) };
    const o = err as Record<string, unknown> & {
      message?: string;
      stack?: string;
      name?: string;
      locations?: unknown;
      path?: unknown;
      extensions?: unknown;
    };
    return {
      name: o.name,
      message: o.message ?? '(empty message — see stack/extensions)',
      stack: o.stack,
      locations: o.locations,
      path: o.path,
      extensions: o.extensions,
      keys: Object.keys(o),
    };
  });
}

function logStorefrontFailure(
  label: string,
  extra: Record<string, unknown>,
  errors?: unknown,
  caught?: unknown,
): void {
  const payload = {
    ...extra,
    graphQLErrors: errors != null ? serializeStorefrontErrors(errors) : undefined,
    caught:
      caught == null
        ? undefined
        : caught instanceof Error
          ? {
              name: caught.name,
              message: caught.message || '(empty)',
              stack: caught.stack,
              cause: caught.cause != null ? String(caught.cause) : undefined,
            }
          : String(caught),
  };
  console.error(`[${label}]`, JSON.stringify(payload, null, 2));
}

/** Oxygen: use `PUBLIC_STOREFRONT_API_TOKEN` (not …APITOKEN) — wired in `server.ts` → createStorefrontClient. */

const SIZE_CYCLE: ProductData['size'][] = [
  'large', 'tall', 'wide', 'standard', 'tall', 'standard',
];

/** Storefront catalog query — `nodes` on ProductConnection (API 2024+). 无 `@inContext`（降级测试）。
 * 说明：Storefront `products` / `product(handle:)` **没有** Admin 里那种 `publishedStatus: PUBLISHED` 参数；
 * 能查到的已是「对该 Storefront 渠道已发布」的商品；未发布到 Headless/Storefront 的会表现为 null / 空列表。 */
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
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        variants(first: 50) {
          nodes {
            id
            title
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
          priceRange {
            minVariantPrice { amount currencyCode }
          }
          variants(first: 50) {
            nodes {
              id
              title
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
      priceRange {
        minVariantPrice { amount currencyCode }
      }
      variants(first: 50) {
        nodes {
          id
          title
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

/** 暴力测试：`products` 不传 `query`；无 `@inContext`（降级测试）。 */
const PRODUCT_BRUTE_UNFILTERED_LIST_QUERY = `#graphql
  query ProductBruteUnfilteredList($first: Int!) {
    products(first: $first, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        handle
        title
      }
    }
  }
`;

/**
 * 暴力测试：仅用 handle 搜索语法，不包含 `status:ACTIVE` 或 `available_for_sale:true` 等子串。
 */
const PRODUCT_BRUTE_HANDLE_SEARCH_QUERY = `#graphql
  query ProductBruteHandleSearch($first: Int!, $search: String!) {
    products(first: $first, query: $search) {
      nodes {
        handle
        title
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

function defaultMerchandiseId(variants: Array<{ id: string }>): string | undefined {
  return variants[0]?.id;
}

type SfVariant = {
  id: string;
  title: string;
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

  const stock: number | undefined = undefined;

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
 * `requestUrl` 用于日志对比 `storefront.i18n` 与当前路径（含 `/ja/` 等 locale 前缀）。
 */
export async function loadStoreCatalog(
  storefront: Storefront | undefined,
  opts?: { collectionHandle?: string; requestUrl?: string },
): Promise<CatalogLoadResult> {
  if (!storefront) {
    return { products: PRODUCTS, source: 'demo' };
  }
  try {
    const shop = await fetchShopifyCatalog(storefront, {
      collectionHandle: opts?.collectionHandle,
      requestUrl: opts?.requestUrl,
    });
    if (shop.length > 0) {
      return { products: shop, source: 'shopify' };
    }
  } catch (e) {
    logStorefrontFailure('loadStoreCatalog', { note: 'unexpected throw' }, undefined, e);
  }
  return { products: PRODUCTS, source: 'demo' };
}

export async function fetchShopifyCatalog(
  storefront: Storefront,
  opts?: { collectionHandle?: string; requestUrl?: string },
): Promise<ProductData[]> {
  const handle = opts?.collectionHandle?.trim();
  const requestUrl = opts?.requestUrl;
  let nodes: SfProductNode[] = [];

  if (handle) {
    try {
      logStorefrontI18nBeforeQuery(storefront, requestUrl, 'CollectionCatalog');
      const variables = { handle, first: CATALOG_FIRST };
      const { data, errors } = await storefront.query(COLLECTION_PRODUCTS_QUERY, {
        variables,
        cache: CacheShort(),
      });
      if (errors?.length) {
        logStorefrontFailure('fetchShopifyCatalog.collection', { collectionHandle: handle }, errors);
      }
      const col = (data as { collection?: { products?: { nodes: SfProductNode[] } } } | null)?.collection;
      if (!col && !errors?.length) {
        console.warn(
          `[fetchShopifyCatalog] collection(handle="${handle}") returned null — check collection handle in Shopify admin (URL slug) and PUBLIC_HOME_COLLECTION_HANDLE env.`,
        );
      }
      nodes = col?.products?.nodes ?? [];
    } catch (e) {
      logStorefrontFailure('fetchShopifyCatalog.collection.exception', { collectionHandle: handle }, undefined, e);
    }
    if (nodes.length === 0) {
      try {
        logStorefrontI18nBeforeQuery(storefront, requestUrl, 'CatalogProducts.fallback');
        const variables = { first: CATALOG_FIRST };
        const { data: d2, errors: e2 } = await storefront.query(CATALOG_PRODUCTS_QUERY, {
          variables,
          cache: CacheShort(),
        });
        if (e2?.length) {
          logStorefrontFailure(
            'fetchShopifyCatalog.productsFallback',
            { reason: 'collection empty or missing', triedCollection: handle },
            e2,
          );
        }
        nodes =
          (d2 as { products?: { nodes: SfProductNode[] } } | null)?.products?.nodes ?? [];
      } catch (e) {
        logStorefrontFailure('fetchShopifyCatalog.productsFallback.exception', {}, undefined, e);
      }
    }
  } else {
    try {
      logStorefrontI18nBeforeQuery(storefront, requestUrl, 'CatalogProducts');
      const variables = { first: CATALOG_FIRST };
      const { data, errors } = await storefront.query(CATALOG_PRODUCTS_QUERY, {
        variables,
        cache: CacheShort(),
      });
      if (errors?.length) {
        logStorefrontFailure('fetchShopifyCatalog.products', { mode: 'allPublishedProducts' }, errors);
      }
      nodes = (data as { products?: { nodes: SfProductNode[] } } | null)?.products?.nodes ?? [];
    } catch (e) {
      logStorefrontFailure('fetchShopifyCatalog.products.exception', { mode: 'allPublishedProducts' }, undefined, e);
    }
  }

  return nodes.map((n, i) => mapNode(n, i));
}

export async function fetchShopifyProductByHandle(
  storefront: Storefront,
  handle: string,
  requestUrl?: string,
): Promise<ProductData | undefined> {
  if (!handle.trim()) return undefined;
  const h = handle.trim();
  try {
    logStorefrontI18nBeforeQuery(storefront, requestUrl, 'ProductByHandle');
    const variables = { handle: h };
    const { data, errors } = await storefront.query(PRODUCT_BY_HANDLE_QUERY, {
      variables,
      cache: CacheShort(),
    });
    if (errors?.length) {
      logStorefrontFailure('fetchShopifyProductByHandle', { handle: h }, errors);
    }
    const node = (data as { product?: SfProductNode | null } | null)?.product;
    try {
      const raw = (data as { product?: unknown } | null)?.product;
      console.log(
        '[Shopify Storefront product(handle) API]',
        JSON.stringify(
          {
            requestedHandle: h,
            graphQLErrors: serializeStorefrontErrors(errors ?? []),
            productNode: raw == null ? null : JSON.parse(JSON.stringify(raw)),
          },
          null,
          2,
        ),
      );
    } catch (logErr) {
      console.error('[Shopify Storefront product(handle) API] console.log serialize failed', logErr);
    }
    if (!node && !errors?.length) {
      console.warn(
        `[fetchShopifyProductByHandle] product(handle="${h}") is null — use the product SEO handle from Shopify admin, not the numeric admin id.`,
      );

      const bruteFirst = 40;

      try {
        logStorefrontI18nBeforeQuery(storefront, requestUrl, 'ProductBruteUnfilteredList');
        const listVars = { first: bruteFirst };
        const { data: listData, errors: listErr } = await storefront.query(
          PRODUCT_BRUTE_UNFILTERED_LIST_QUERY,
          { variables: listVars, cache: CacheShort() },
        );
        const listNodes =
          (listData as { products?: { nodes: { handle: string; title: string }[] } } | null)?.products
            ?.nodes ?? [];
        const handles = listNodes.map((n) => n.handle);
        console.log(
          '[Brute] products() without `query` filter — handles sample:',
          JSON.stringify({ count: listNodes.length, handles, requested: h, errors: listErr }),
        );
      } catch (bruteListErr) {
        console.error('[Brute] unfiltered list failed', bruteListErr);
      }

      try {
        logStorefrontI18nBeforeQuery(storefront, requestUrl, 'ProductBruteHandleSearch');
        const searchStr = `handle:${h}`;
        const searchVars = { first: 15, search: searchStr };
        const { data: searchData, errors: searchErr } = await storefront.query(
          PRODUCT_BRUTE_HANDLE_SEARCH_QUERY,
          { variables: searchVars, cache: CacheShort() },
        );
        const searchNodes =
          (searchData as { products?: { nodes: { handle: string; title: string }[] } } | null)?.products
            ?.nodes ?? [];
        console.log(
          '[Brute] products(query: handle only, no status / available_for_sale in string):',
          JSON.stringify({
            search: searchStr,
            matchCount: searchNodes.length,
            nodes: searchNodes,
            errors: searchErr,
          }),
        );
      } catch (bruteSearchErr) {
        console.error('[Brute] handle search failed', bruteSearchErr);
      }
    }
    if (!node) return undefined;
    return mapNode(node, 0);
  } catch (e) {
    logStorefrontFailure('fetchShopifyProductByHandle.exception', { handle: h }, undefined, e);
    return undefined;
  }
}
