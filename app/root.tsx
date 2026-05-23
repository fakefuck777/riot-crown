import { useEffect } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
  useRouteLoaderData,
  isRouteErrorResponse,
  Link,
} from '@remix-run/react';
import type { LinksFunction } from '@shopify/remix-oxygen';
import { json, type LoaderFunctionArgs, type MetaFunction } from '@shopify/remix-oxygen';
import type { Locale } from '~/lib/i18n';
import { serializeLocaleCookie } from '~/lib/localeCookie';
import { resolveLocaleForRequest } from '~/lib/localeDetection';
import { GrainOverlay }    from '~/components/GrainOverlay';
import { PointerLux }      from '~/components/PointerLux';
import { GhostNav }        from '~/components/GhostNav';
import { CartDrawer }      from '~/components/CartDrawer';
import { CheckoutPortal }  from '~/components/CheckoutPortal';
import { StickyConversionBar } from '~/components/StickyConversionBar';
import { EmailCapturePopupEnhanced } from '~/components/Marketing/EmailCapturePopupEnhanced';
import { ExitIntentPopup } from '~/components/ExitIntentPopup';
import { BundleRecommendation } from '~/components/BundleRecommendation';
import { useInertiaScroll } from '~/hooks/useInertiaScroll';
import { LocaleProvider, useLocale } from '~/lib/LocaleContext';
import { SkipToMain } from '~/components/SkipToMain';
import { ViewportModeSync } from '~/components/ViewportModeSync';
import { CartProvider, useCart } from '~/lib/CartContext';
import { MemberProvider } from '~/lib/MemberContext';
import { UserInteractionProvider } from '~/lib/UserInteractionContext';
import { LOCALE_BCP47, LOCALES } from '~/lib/i18n';
import { sumCartLineTotals, formatYenTotal } from '~/lib/price';
import {
  OG_IMAGE_PATH,
  SITE_DEFAULT_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  absoluteOgImage,
} from '~/lib/siteMeta';
import {
  stripLeadingLocaleFromPathname,
  withLocalePath,
} from '~/lib/localePath';
import { buildRootJsonLd } from '~/lib/schemaOrg';
import { LuxuryParticleSystem } from '~/components/LuxuryParticleSystem';
import { LuxuryGlowEffects } from '~/components/LuxuryGlowEffects';
import { LuxuryLoadingScreen } from '~/components/LuxuryLoadingScreen';
import globalStyles from '~/styles/global.css?url';

function SyncDocumentLang() {
  const { locale } = useLocale();
  useEffect(() => {
    document.documentElement.lang = LOCALE_BCP47[locale];
  }, [locale]);
  return null;
}

export const links: LinksFunction = () => [
  { rel: 'manifest', href: '/manifest.webmanifest' },
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href:
      'https://fonts.googleapis.com/css2?' +
      'family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400' +
      '&family=JetBrains+Mono:wght@300;400' +
      '&family=Oswald:wght@500;600;700' +
      '&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600' +
      '&family=Syne:wght@500;600;700;800' +
      '&display=swap',
  },
];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const siteUrl = new URL(request.url).origin;
  const shopDomain =
    (context as { env?: { PUBLIC_STORE_DOMAIN?: string } }).env?.PUBLIC_STORE_DOMAIN ?? '';
  const { locale, shouldPersist } = resolveLocaleForRequest(request);
  const headers = new Headers();
  if (shouldPersist) {
    const secure = new URL(request.url).protocol === 'https:';
    headers.append('Set-Cookie', serializeLocaleCookie(locale, secure));
  }
  return json(
    {
      siteUrl,
      shopDomain,
      initialLocale: locale,
    },
    shouldPersist ? { headers } : undefined,
  );
}

export const meta: MetaFunction<typeof loader> = ({ data, location }) => {
  const siteUrl = data?.siteUrl ?? '';
  const base = siteUrl.replace(/\/$/, '');
  const pathname = (location?.pathname ?? '/').split('?')[0] ?? '/';
  const { restPath } = stripLeadingLocaleFromPathname(pathname);
  const isHomeShell = restPath === '/';

  const ogImage = siteUrl ? absoluteOgImage(siteUrl) : OG_IMAGE_PATH;
  const hreflang =
    isHomeShell && base.length > 0
      ? [
          ...LOCALES.map(loc => ({
            tagName: 'link' as const,
            rel: 'alternate',
            hrefLang: LOCALE_BCP47[loc],
            href: `${base}${withLocalePath(loc, '/')}`,
          })),
          { tagName: 'link' as const, rel: 'alternate', hrefLang: 'x-default', href: `${base}/` },
          { tagName: 'link' as const, rel: 'canonical', href: `${base}${pathname}` },
        ]
      : [];

  return [
    { title: SITE_DEFAULT_TITLE },
    { name: 'description', content: SITE_DESCRIPTION },
    { name: 'keywords', content: SITE_KEYWORDS },
    { name: 'author', content: SITE_NAME },
    { name: 'robots', content: 'index, follow' },
    {
      name: 'googlebot',
      content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    },
    { name: 'color-scheme', content: 'dark' },
    { property: 'og:type', content: 'website' },
    ...(isHomeShell && base ? [{ property: 'og:url', content: `${base}${pathname}` }] : []),
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: SITE_DEFAULT_TITLE },
    { property: 'og:description', content: SITE_DESCRIPTION },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:alt', content: `${SITE_NAME} — brand mark` },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: SITE_DEFAULT_TITLE },
    { name: 'twitter:description', content: SITE_DESCRIPTION },
    { name: 'twitter:image', content: ogImage },
    { name: 'theme-color', content: '#050508' },
    { name: 'format-detection', content: 'telephone=no' },
    ...hreflang,
  ];
};

function AppShell({ children }: { children: React.ReactNode }) {
  const { items, isOpen, isCheckoutOpen, openCart, closeCart, openCheckout, closeCheckout } = useCart();
  useInertiaScroll();

  const { locale } = useLocale();
  const total = sumCartLineTotals(items);
  const cartPieceCount = items.reduce((n, i) => n + i.qty, 0);

  return (
    <>
      <LuxuryLoadingScreen />
      <LuxuryGlowEffects />
      <LuxuryParticleSystem />
      <GrainOverlay />
      <PointerLux />
      <GhostNav onCartOpen={openCart} cartCount={cartPieceCount} />
      <CartDrawer isOpen={isOpen} items={items} onClose={closeCart} onCheckout={openCheckout} />
      <CheckoutPortal
        isOpen={isCheckoutOpen}
        onClose={closeCheckout}
        total={formatYenTotal(total, LOCALE_BCP47[locale])}
      />
      <div id="scroll-container">
        {children}
      </div>
      <StickyConversionBar />

      {/* Marketing Popups */}
      <EmailCapturePopupEnhanced />
      <ExitIntentPopup />
      <BundleRecommendation mainProductName="Pearl Necklace" />
    </>
  );
}

function Layout({
  children,
  initialLocale = 'EN',
  siteUrl = '',
  shopDomain = '',
}: {
  children:       React.ReactNode;
  initialLocale?: Locale;
  siteUrl?:       string;
  shopDomain?:    string;
}) {
  const orgJsonLd =
    siteUrl.length > 0 ? JSON.stringify(buildRootJsonLd(siteUrl.replace(/\/$/, ''))) : '';
  const shop = shopDomain.trim();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        {/* viewport-fit=cover: safe-area env() on notch devices; interactive-widget: Android resizes layout when keyboard opens */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
        />
        {shop ? (
          <>
            <link rel="dns-prefetch" href={`https://${shop}`} />
            <link rel="preconnect" href={`https://${shop}`} crossOrigin="anonymous" />
          </>
        ) : null}
        <Meta />
        {orgJsonLd ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: orgJsonLd }} />
        ) : null}
        <Links />
      </head>
      <body className="bg-void text-titanium">
        <LocaleProvider initialLocale={initialLocale}>
          <SkipToMain />
          <SyncDocumentLang />
          <ViewportModeSync />
          <CartProvider>
            <MemberProvider>
              <UserInteractionProvider>
                <AppShell>{children}</AppShell>
              </UserInteractionProvider>
            </MemberProvider>
          </CartProvider>
        </LocaleProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { initialLocale, siteUrl, shopDomain } = useLoaderData<typeof loader>();
  return (
    <Layout initialLocale={initialLocale} siteUrl={siteUrl} shopDomain={shopDomain}>
      <main id="main-content" tabIndex={-1} className="relative outline-none mobile-main">
        <Outlet />
      </main>
    </Layout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useRouteLoaderData('root') as { initialLocale?: Locale } | undefined;
  const initialLocale = rootData?.initialLocale ?? 'EN';
  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : error instanceof Error
      ? (import.meta.env.DEV ? error.message : 'An unexpected error occurred.')
      : 'Unknown error';

  return (
    <Layout initialLocale={initialLocale}>
      <main id="main-content" tabIndex={-1} className="relative outline-none mobile-main">
        <div className="min-h-screen flex flex-col items-center justify-center px-16">
          <p className="text-label text-chrome mb-8 tracking-ultra-wide">SYSTEM FAULT</p>
          <h1 className="text-brutal text-titanium mb-12">ERROR</h1>
          <p
            className="text-data text-chrome max-w-md text-center mb-12"
            role="alert"
            aria-live="assertive"
          >
            {message}
          </p>
          <Link
            to={withLocalePath(initialLocale, '/')}
            className="text-label text-gold tracking-ultra-wide border border-gold/35 px-8 py-4 uppercase no-underline transition-colors hover:bg-gold/10"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem' }}
          >
            Return home
          </Link>
        </div>
      </main>
    </Layout>
  );
}
