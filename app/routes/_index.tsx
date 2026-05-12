import type { MetaFunction } from '@shopify/remix-oxygen';
import { useEffect } from 'react';
import { useRouteLoaderData } from '@remix-run/react';
import { SITE_DESCRIPTION } from '~/lib/siteMeta';
import { Hero } from '~/components/Hero';
import { Manifesto } from '~/components/Manifesto';
import { ProductGrid } from '~/components/ProductGrid';
import { ScarcityEngine } from '~/components/ScarcityEngine';
import { TrustBar } from '~/components/TrustBar';
import { Testimonials } from '~/components/Testimonials';
import { Footer } from '~/components/Footer';

export const meta: MetaFunction = () => [
  { title: 'RIOT CROWN — Void Collection SS26' },
  {
    name: 'description',
    content: SITE_DESCRIPTION,
  },
];

function HomeJsonLd({ siteUrl }: { siteUrl: string }) {
  const payload = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RIOT CROWN',
    url: siteUrl,
    logo: `${siteUrl}/og-brand.svg`,
    description: SITE_DESCRIPTION,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export default function Index() {
  const root = useRouteLoaderData('root') as { siteUrl?: string } | undefined;

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
      {root?.siteUrl ? <HomeJsonLd siteUrl={root.siteUrl} /> : null}
      <Hero />
      <Manifesto />
      <ProductGrid />
      <ScarcityEngine />
      <TrustBar />
      <Testimonials />
      <Footer />
    </main>
  );
}
