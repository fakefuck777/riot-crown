'use client';
import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { ProductCard } from '~/components/ProductCard';
import { useAudio } from '~/hooks/useAudio';
import { useLocale } from '~/lib/LocaleContext';
import { PRODUCTS } from '~/lib/products';
import { withLocalePath } from '~/lib/localePath';
import type { ProductData } from '~/lib/products';

interface ProductGridProps {
  products?: ProductData[];
}

export function ProductGrid({ products = PRODUCTS }: ProductGridProps) {
  const { t, locale } = useLocale();
  const { startDrone } = useAudio();
  const navigate = useNavigate();

  useEffect(() => {
    const start = () => startDrone();
    window.addEventListener('pointerdown', start, { once: true });
    return () => window.removeEventListener('pointerdown', start);
  }, [startDrone]);

  return (
    <section id="collection" className="w-full bg-void-plate px-8 py-20 md:px-16 md:py-24 lg:px-24" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 18% 12%, rgba(255,18,147,0.08) 0%, transparent 28%), radial-gradient(circle at 82% 18%, rgba(110,203,255,0.08) 0%, transparent 26%), radial-gradient(circle at 50% 100%, rgba(192,192,192,0.08) 0%, transparent 36%)',
          pointerEvents: 'none',
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
      <div className="flex items-end justify-between mb-16 gap-8 flex-wrap">
        <div>
          <p className="text-label tracking-ultra-wide mb-4 text-y2k-pink opacity-75">
            {t.grid.eyebrow}
          </p>
          <h2
            className="uppercase leading-none text-gradient-gold"
            style={{
              fontFamily: 'var(--font-y2k-display), "Monument Extended", "Helvetica Neue", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2.35rem, 5vw, 5rem)',
              letterSpacing: '0.07em',
              textShadow: '0 0 40px rgba(255,18,147,0.08)',
            }}
          >
            {t.grid.title}
          </h2>
          <p
            className="mt-5 max-w-2xl text-chrome"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.12em', lineHeight: 1.9, opacity: 0.72 }}
          >
            {t.grid.desireHook}
          </p>
        </div>
        <div
          className="glow-gold"
          style={{
            padding: '0.9rem 1rem',
            border: '1px solid rgba(192,192,192,0.2)',
            background: 'rgba(5,5,5,0.45)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            minWidth: '110px',
          }}
        >
          <p
            className="text-chrome hidden md:block"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.08em', opacity: 0.55, marginBottom: '0.3rem' }}
          >
            LIVE EDIT
          </p>
          <p
            style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', letterSpacing: '0.02em', color: '#C0C0C0' }}
          >
            {products.length.toString().padStart(2, '0')} {t.grid.objects}
          </p>
        </div>
      </div>

      <div className="divider-y2k-chrome mb-16" />

      <div
        className="product-collection-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gridAutoRows: 'minmax(460px, auto)',
          gap: '1px',
          background: 'linear-gradient(135deg, rgba(242,242,242,0.08), rgba(192,192,192,0.08), rgba(255,18,147,0.08))',
          boxShadow: '0 24px 80px rgba(0,0,0,0.28)',
        }}
      >
        {products.map((product, index) => (
          <GridCell key={product.id} size={product.size} gridArea={product.gridArea}>
            <ProductCard
              product={product}
              fetchPriority={index === 0 ? 'high' : 'low'}
              onClick={() => navigate(withLocalePath(locale, `/products/${product.id}`))}
            />
          </GridCell>
        ))}
      </div>

      <div className="divider-chrome mt-16 opacity-20" />
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .product-collection-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .product-collection-grid > * {
            grid-area: unset !important;
            min-height: 400px !important;
          }
        }
        @media (max-width: 640px) {
          .product-collection-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .product-collection-grid > * {
            min-height: 300px !important;
          }
        }
        @media (max-width: 360px) {
          .product-collection-grid {
            grid-template-columns: 1fr !important;
          }
          .product-collection-grid > * {
            min-height: 260px !important;
          }
        }
        @media (max-height: 480px) and (orientation: landscape) {
          .product-collection-grid > * {
            min-height: 220px !important;
          }
        }
      `}</style>
    </section>
  );
}

const SPAN_MAP: Record<ProductData['size'], React.CSSProperties> = {
  large:    { minHeight: '920px' },
  tall:     { minHeight: '460px' },
  wide:     { minHeight: '380px' },
  standard: { minHeight: '460px' },
};

function GridCell({
  size, gridArea, children,
}: {
  size: ProductData['size'];
  gridArea?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ ...SPAN_MAP[size], gridArea, background: '#050505', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
}
