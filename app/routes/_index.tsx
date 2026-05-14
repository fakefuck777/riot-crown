import type { MetaFunction } from '@shopify/remix-oxygen';
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import type { Storefront } from '@shopify/hydrogen';
import { SITE_DESCRIPTION, SITE_HOME_TITLE, SITE_KEYWORDS } from '~/lib/siteMeta';
import { Hero } from '~/components/Hero';
import { Manifesto } from '~/components/Manifesto';
import { ProductGrid } from '~/components/ProductGrid';
import { ScarcityEngine } from '~/components/ScarcityEngine';
import { TrustBar } from '~/components/TrustBar';
import { Testimonials } from '~/components/Testimonials';
import { Footer } from '~/components/Footer';
import { loadStoreCatalog } from '~/lib/shopifyCatalog.server';

type HydrogenRouteContext = {
  storefront?: Storefront;
  env?: { PUBLIC_HOME_COLLECTION_HANDLE?: string };
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const siteUrl = new URL(request.url).origin.replace(/\/$/, '');
  const ctx = context as HydrogenRouteContext;
  const { products: catalogProducts } = await loadStoreCatalog(ctx.storefront, {
    collectionHandle: ctx.env?.PUBLIC_HOME_COLLECTION_HANDLE,
    requestUrl: request.url,
  });
  const { buildCatalogItemListJsonLd } = await import('~/lib/schemaOrg');
  return json({
    siteUrl,
    catalogProducts,
    catalogJsonLd: JSON.stringify(buildCatalogItemListJsonLd(siteUrl, catalogProducts)),
  });
}

export const meta: MetaFunction = () => [
  { title: SITE_HOME_TITLE },
  { name: 'description', content: SITE_DESCRIPTION },
  { name: 'keywords', content: SITE_KEYWORDS },
  { name: 'robots', content: 'index, follow' },
];

export default function Index() {
  const { catalogJsonLd, catalogProducts } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.location.hash.replace(/^#/, '');
    if (!raw || !document.getElementById(raw)) return;
    const id = window.setTimeout(() => {
      document.getElementById(raw)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: catalogJsonLd }} />
      <Hero />
      <Manifesto />
      <ProductGrid products={catalogProducts} />
      <ScarcityEngine products={catalogProducts} />
      <TrustBar />
      <Testimonials />
      <Footer />
    </main>
  );
}
