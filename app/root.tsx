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
} from '@remix-run/react';
import type { LinksFunction } from '@shopify/remix-oxygen';
import { json, type LoaderFunctionArgs, type MetaFunction } from '@shopify/remix-oxygen';
import type { Locale } from '~/lib/i18n';
import { parseLocaleFromCookie } from '~/lib/localeCookie';
import { GrainOverlay }    from '~/components/GrainOverlay';
import { PointerLux }      from '~/components/PointerLux';
import { GhostNav }        from '~/components/GhostNav';
import { CartDrawer }      from '~/components/CartDrawer';
import { CheckoutPortal }  from '~/components/CheckoutPortal';
import { StickyConversionBar } from '~/components/StickyConversionBar';
import { useInertiaScroll } from '~/hooks/useInertiaScroll';
import { LocaleProvider, useLocale } from '~/lib/LocaleContext';
import { SkipToMain } from '~/components/SkipToMain';
import { CartProvider, useCart } from '~/lib/CartContext';
import { LOCALE_BCP47 } from '~/lib/i18n';
import { sumCartLineTotals, formatYenTotal } from '~/lib/price';
import { SITE_DESCRIPTION } from '~/lib/siteMeta';
import globalStyles from '~/styles/global.css?url';

function SyncDocumentLang() {
  const { locale } = useLocale();
  useEffect(() => {
    document.documentElement.lang = LOCALE_BCP47[locale];
  }, [locale]);
  return null;
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400&family=Oswald:wght@500;600;700&display=swap',
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const siteUrl = new URL(request.url).origin;
  return json({
    siteUrl,
    initialLocale: parseLocaleFromCookie(request.headers.get('Cookie')),
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const siteUrl = data?.siteUrl ?? '';
  const ogImage = siteUrl ? `${siteUrl}/og-brand.svg` : '/og-brand.svg';
  return [
    { title: 'RIOT CROWN | Void Collection SS26' },
    { name: 'description', content: SITE_DESCRIPTION },
    { property: 'og:type', content: 'website' },
    ...(siteUrl ? [{ property: 'og:url', content: siteUrl }] : []),
    { property: 'og:title', content: 'RIOT CROWN | Void Collection SS26' },
    { property: 'og:description', content: SITE_DESCRIPTION },
    { property: 'og:image', content: ogImage },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'RIOT CROWN' },
    { name: 'twitter:description', content: SITE_DESCRIPTION },
    { name: 'theme-color', content: '#050505' },
    { name: 'format-detection', content: 'telephone=no' },
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
    </>
  );
}

function Layout({ children, initialLocale = 'EN' }: { children: React.ReactNode; initialLocale?: Locale }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-void text-titanium">
        <LocaleProvider initialLocale={initialLocale}>
          <SkipToMain />
          <SyncDocumentLang />
          <CartProvider>
            <AppShell>{children}</AppShell>
          </CartProvider>
        </LocaleProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { initialLocale } = useLoaderData<typeof loader>();
  return (
    <Layout initialLocale={initialLocale}>
      <main id="main-content" tabIndex={-1} className="relative outline-none">
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
      <main id="main-content" tabIndex={-1} className="relative outline-none">
        <div className="min-h-screen flex flex-col items-center justify-center px-16">
          <p className="text-label text-chrome mb-8 tracking-ultra-wide">SYSTEM FAULT</p>
          <h1 className="text-brutal text-titanium mb-12">ERROR</h1>
          <p className="text-data text-chrome max-w-md text-center">{message}</p>
        </div>
      </main>
    </Layout>
  );
}
