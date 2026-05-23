import type { MetaFunction } from '@shopify/remix-oxygen';
import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { useEffect, Suspense, lazy } from 'react';
import type { Storefront } from '@shopify/hydrogen';
import { SITE_DESCRIPTION, SITE_HOME_TITLE, SITE_KEYWORDS } from '~/lib/siteMeta';
import { Manifesto } from '~/components/Manifesto';
import { ScrollNarrative } from '~/components/ScrollNarrative';
import { HeroProductCarousel } from '~/components/HeroProductCarousel';
import { ProductGrid } from '~/components/ProductGrid';
import { ScarcityEngine } from '~/components/ScarcityEngine';
import { TrustBar } from '~/components/TrustBar';
import { Testimonials } from '~/components/Testimonials';
import { Footer } from '~/components/Footer';
import { loadStoreCatalog } from '~/lib/shopifyCatalog.server';
import { storefrontTokenPrefix4FromEnv, type StorefrontTokenEnv } from '~/lib/storefrontEnvDebug';

// 延迟加载 3D 组件，避免阻塞初始渲染
const PearlNecklaceScene = lazy(() =>
  import('~/components/3D/PearlNecklaceScene').then(m => ({ default: m.PearlNecklaceScene }))
);

// 快速加载的占位符
function PearlNecklaceSceneFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#d4af37',
        fontSize: '14px',
        fontFamily: 'JetBrains Mono',
        letterSpacing: '0.1em',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '12px', opacity: 0.6 }}>
          <div style={{ animation: 'pulse 1.5s infinite' }}>●</div>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

type HydrogenRouteContext = {
  storefront?: Storefront;
  env?: StorefrontTokenEnv & { PUBLIC_HOME_COLLECTION_HANDLE?: string };
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const siteUrl = new URL(request.url).origin.replace(/\/$/, '');
  const ctx = context as HydrogenRouteContext;
  const debugTokenPrefix4 = storefrontTokenPrefix4FromEnv(ctx.env);
  const { products: catalogProducts } = await loadStoreCatalog(ctx.storefront, {
    collectionHandle: ctx.env?.PUBLIC_HOME_COLLECTION_HANDLE,
    requestUrl: request.url,
    debugTokenPrefix4,
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
      <Suspense fallback={<PearlNecklaceSceneFallback />}>
        <PearlNecklaceScene />
      </Suspense>
      <HeroProductCarousel products={catalogProducts} />
      <ProductGrid products={catalogProducts} />
      <Manifesto />
      <ScrollNarrative />
      <ScarcityEngine products={catalogProducts} />
      <TrustBar />
      <Testimonials />
      <Footer />
    </main>
  );
}
