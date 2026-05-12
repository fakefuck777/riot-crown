import type { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import { json, redirect } from '@shopify/remix-oxygen';
import { Link, useLoaderData } from '@remix-run/react';
import { useLocale } from '~/lib/LocaleContext';
import { getLegalDoc, isLegalPageId, type LegalPageId } from '~/lib/legalContent';

const META_TITLE: Record<LegalPageId, string> = {
  privacy: 'Privacy Policy',
  terms: 'Terms of Service',
  returns: 'Shipping & Returns',
  contact: 'Contact',
};

export async function loader({ params }: LoaderFunctionArgs) {
  const raw = params.page;
  if (!isLegalPageId(raw)) throw redirect('/legal/privacy');
  return json({ page: raw });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const page = data?.page as LegalPageId | undefined;
  const label = page ? META_TITLE[page] : 'Legal';
  return [
    { title: `${label} | RIOT CROWN` },
    { name: 'description', content: `RIOT CROWN — ${label}` },
    { property: 'og:title', content: `${label} | RIOT CROWN` },
    { name: 'robots', content: 'index,follow' },
  ];
};

export default function LegalPage() {
  const { page } = useLoaderData<typeof loader>();
  const { locale } = useLocale();
  const doc = getLegalDoc(page, locale);

  return (
    <main className="bg-void" style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="px-8 md:px-16 lg:px-24" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <Link
          to="/"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.25em',
            color: 'rgba(201,168,76,0.5)',
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          ← RIOT CROWN
        </Link>

        <h1
          style={{
            fontFamily: '"Monument Extended", "Helvetica Neue", "Arial Black", sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: '#F2F2F2',
            marginTop: '2.5rem',
            marginBottom: '2rem',
            lineHeight: 1.05,
          }}
        >
          {doc.title}
        </h1>

        <article style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', lineHeight: 1.85, color: 'rgba(242,242,242,0.65)' }}>
          {doc.blocks.map((b, i) =>
            b.type === 'h2' ? (
              <h2
                key={i}
                style={{
                  fontFamily: '"Monument Extended", "Helvetica Neue", sans-serif',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                  marginTop: i === 0 ? 0 : '2rem',
                  marginBottom: '0.75rem',
                }}
              >
                {b.text}
              </h2>
            ) : (
              <p key={i} style={{ marginBottom: '1rem' }}>
                {b.text}
              </p>
            ),
          )}
        </article>
      </div>
    </main>
  );
}
