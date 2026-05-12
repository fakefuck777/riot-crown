import type { MetaFunction } from '@shopify/remix-oxygen';
import { Form, Link, useSearchParams } from '@remix-run/react';
import { useMemo } from 'react';
import { PRODUCTS } from '~/lib/products';

export const meta: MetaFunction = () => [
  { title: 'Search | RIOT CROWN' },
  { name: 'robots', content: 'noindex' },
];

export default function SearchRoute() {
  const [params] = useSearchParams();
  const q = (params.get('q') ?? '').trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return [];
    return PRODUCTS.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q),
    );
  }, [q]);

  return (
    <main className="min-h-screen bg-void" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="px-8 md:px-16 lg:px-24" style={{ maxWidth: '960px', margin: '0 auto' }}>
        <Link
          to="/"
          className="text-label text-chrome tracking-ultra-wide"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', textDecoration: 'none', color: 'rgba(201,168,76,0.5)' }}
        >
          ← RIOT CROWN
        </Link>

        <h1
          className="text-brutal text-titanium mt-10 mb-8"
          style={{ fontFamily: '"Monument Extended", "Helvetica Neue", sans-serif', letterSpacing: '-0.02em' }}
        >
          SEARCH
        </h1>

        <Form method="get" replace className="mb-12 flex flex-wrap gap-4 items-end">
          <label className="flex flex-col gap-2 min-w-[200px] flex-1">
            <span className="text-label text-chrome" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.2em' }}>
              QUERY
            </span>
            <input
              name="q"
              type="search"
              defaultValue={params.get('q') ?? ''}
              className="bg-black/40 border border-chrome/20 text-titanium px-4 py-3 outline-none focus:border-gold/50"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
              autoComplete="off"
            />
          </label>
          <button
            type="submit"
            className="px-6 py-3 text-label tracking-ultra-wide uppercase border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem' }}
          >
            Run
          </button>
        </Form>

        {!q ? (
          <p className="text-data text-chrome" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
            Enter a term to filter in-catalog artifacts (name, material, or id).
          </p>
        ) : results.length === 0 ? (
          <p className="text-data text-chrome" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
            No matches for &quot;{params.get('q')}&quot;.
          </p>
        ) : (
          <ul className="space-y-4">
            {results.map(p => (
              <li key={p.id}>
                <Link
                  to={`/products/${p.id}`}
                  prefetch="intent"
                  className="block border border-chrome/10 p-4 hover:border-gold/30 transition-colors no-underline"
                  style={{ color: 'inherit' }}
                >
                  <p className="text-label text-chrome mb-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', letterSpacing: '0.2em' }}>
                    {p.material}
                  </p>
                  <p className="text-titanium font-bold tracking-wide" style={{ fontFamily: '"Monument Extended", sans-serif', fontSize: '0.95rem' }}>
                    {p.name}
                  </p>
                  <p className="text-gold mt-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                    {p.price}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
