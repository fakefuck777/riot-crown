import { useParams, useNavigate, Link } from '@remix-run/react';
import type { MetaFunction } from '@shopify/remix-oxygen';
import { useRef, useEffect, useLayoutEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { GhostImage } from '~/components/GhostImage';
import { useCart } from '~/lib/CartContext';
import { useAudio } from '~/hooks/useAudio';
import { useLocale } from '~/lib/LocaleContext';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';
import { getProduct, PRODUCTS, getDescription, getDetails } from '~/lib/products';

export const meta: MetaFunction = ({ params }) => {
  const p = getProduct(params.id ?? '');
  if (!p) {
    return [
      { title: 'Artifact Not Found | RIOT CROWN' },
      { name: 'robots', content: 'noindex' },
    ];
  }
  const desc = (p.descriptions.EN ?? p.descriptions.ZH ?? p.name).slice(0, 160);
  return [
    { title: `${p.name} | RIOT CROWN` },
    { name: 'description', content: desc },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: p.name },
    { property: 'og:description', content: desc },
  ];
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { playClick } = useAudio();
  const { t, locale } = useLocale();
  const reducedMotion = usePrefersReducedMotion();

  const product = getProduct(id ?? '');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeWarning, setSizeWarning] = useState(false);

  // Related products — 3 others excluding current
  const related = PRODUCTS.filter(p => p.id !== id).slice(0, 3);

  // Refs for entrance animation
  const pageRef    = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  const infoRef    = useRef<HTMLDivElement>(null);
  const btnRef     = useRef<HTMLButtonElement>(null);
  const addedRef   = useRef(false);

  // Reset size selection when product changes
  useEffect(() => {
    setSelectedSize(null);
    setSizeWarning(false);
  }, [id]);

  useEffect(() => {
    setSizeWarning(false);
  }, [selectedSize]);

  useEffect(() => {
    addedRef.current = false;
  }, [id]);

  // Run after DOM commit so refs exist; retry a few frames like CartDrawer + `mounted`
  // — otherwise first client navigation can leave image/info at opacity:0 (looks “broken”).
  useLayoutEffect(() => {
    const p = getProduct(id ?? '');
    if (!p) return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 12;

    const run = () => {
      if (cancelled) return;
      const img = imgRef.current;
      const info = infoRef.current;
      const btn = btnRef.current;
      if (!img || !info || !btn) {
        if (attempts++ < maxAttempts) {
          requestAnimationFrame(run);
        } else {
          if (img) gsap.set(img, { opacity: 1, x: 0 });
          if (info) gsap.set(info, { opacity: 1, x: 0 });
          if (btn) gsap.set(btn, { opacity: 1, y: 0 });
        }
        return;
      }

      gsap.killTweensOf([img, info, btn]);
      if (reducedMotion) {
        gsap.set([img, info, btn], { opacity: 1, x: 0, y: 0 });
        return;
      }

      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .fromTo(img,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.9 },
        ).fromTo(info,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.9 },
          '-=0.7',
        ).fromTo(btn,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.4',
        );
    };

    run();
    return () => {
      cancelled = true;
      const img = imgRef.current;
      const info = infoRef.current;
      const btn = btnRef.current;
      gsap.killTweensOf([img, info, btn].filter(Boolean));
    };
  }, [id, reducedMotion]);

  const handleAcquire = useCallback(() => {
    if (!product) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setSizeWarning(true);
      return;
    }
    setSizeWarning(false);
    playClick();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      material: product.material,
      ...(product.sizes?.length && selectedSize ? { size: selectedSize } : {}),
    });
    addedRef.current = true;

    // Button feedback — flash gold then back
    if (btnRef.current) {
      gsap.timeline()
        .to(btnRef.current, { background: '#C9A84C', color: '#050505', duration: 0.12 })
        .to(btnRef.current, { background: '#F2F2F2', color: '#050505', duration: 0.3, delay: 0.15 });
    }
    gsap.delayedCall(1.6, () => { addedRef.current = false; });
  }, [product, playClick, addToCart, selectedSize]);

  // 404 state
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-void">
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(201,168,76,0.5)' }}>
          {t.product.notFound}
        </p>
        <button
          onClick={() => navigate('/')}
          style={{ marginTop: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(242,242,242,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {t.product.backVoid}
        </button>
      </div>
    );
  }

  const isLowStock = (product.stock ?? 99) <= 3;

  return (
    <div ref={pageRef} className="bg-void" style={{ minHeight: '100vh', paddingTop: '80px' }}>

      {/* Back button */}
      <div className="px-8 md:px-16 lg:px-24 pt-10 pb-6">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.25em',
            color: 'rgba(201,168,76,0.5)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#C9A84C'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(201,168,76,0.5)'; }}
        >
          {t.product.back}
        </button>
      </div>

      {/* Main layout — image left, info right */}
      <div
        className="px-8 md:px-16 lg:px-24 pb-24 product-main-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4rem',
          alignItems: 'start',
        }}
      >
        {/* ── Image panel ── */}
        <div ref={imgRef} style={{ opacity: 0, position: 'sticky', top: '100px' }}>
          <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
            <GhostImage
              key={product.id}
              src={product.imageUrl}
              alt={product.name}
              fetchPriority="high"
              sizes="(min-width: 900px) 46vw, 100vw"
              style={{ width: '100%', height: '100%' }}
            />

            {/* Iridescent corner accent — Y2K touch */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #FF1293, #C9A84C, #F2F2F2, #C9A84C, #FF1293)',
              opacity: 0.6,
            }} />

            {/* Stock badge */}
            {product.stock !== undefined && (
              <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.48rem',
                  letterSpacing: '0.2em',
                  color: isLowStock ? '#FF1293' : 'rgba(201,168,76,0.7)',
                  textTransform: 'uppercase',
                  animation: isLowStock && !reducedMotion ? 'scarcityBlink 1.6s ease-in-out infinite' : undefined,
                }}>
                  {isLowStock ? t.product.stockLow.replace('{n}', String(product.stock)) : t.product.stockOk.replace('{n}', String(product.stock))}
                </span>
              </div>
            )}

            {/* ID badge */}
            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.48rem',
                letterSpacing: '0.15em',
                color: 'rgba(242,242,242,0.2)',
              }}>
                #{product.id}
              </span>
            </div>
          </div>
        </div>

        {/* ── Info panel ── */}
        <div ref={infoRef} style={{ opacity: 0, paddingTop: '1rem' }}>

          {/* Eyebrow */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            letterSpacing: '0.3em',
            color: 'rgba(201,168,76,0.5)',
            textTransform: 'uppercase',
            marginBottom: '1.2rem',
          }}>
            {product.material}
          </p>

          {/* Name */}
          <h1 style={{
            fontFamily: '"Monument Extended", "Helvetica Neue", "Arial Black", sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            color: '#F2F2F2',
            lineHeight: 0.95,
            marginBottom: '2rem',
          }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2.5rem',
            paddingBottom: '2.5rem',
            borderBottom: '0.5px solid rgba(242,242,242,0.08)',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.6rem',
              letterSpacing: '-0.04em',
              color: '#C9A84C',
              fontWeight: 300,
            }}>
              {product.price}
            </p>
            {isLowStock && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.48rem',
                letterSpacing: '0.2em',
                color: '#FF1293',
                textTransform: 'uppercase',
                animation: !reducedMotion ? 'scarcityBlink 1.6s ease-in-out infinite' : undefined,
              }}>
                {t.product.critical}
              </span>
            )}
          </div>

          {/* Description */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            lineHeight: 2,
            letterSpacing: '0.04em',
            color: 'rgba(242,242,242,0.6)',
            marginBottom: '2.5rem',
          }}>
            {getDescription(product, locale)}
          </p>

          {/* Details list */}
          <div style={{ marginBottom: '3rem' }}>
            {getDetails(product, locale).map((d, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 0',
                  borderBottom: '0.5px solid rgba(242,242,242,0.05)',
                }}
              >
                <div style={{ width: '4px', height: '4px', background: '#C9A84C', opacity: 0.6, flexShrink: 0 }} />
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.1em',
                  color: 'rgba(168,168,168,0.6)',
                  textTransform: 'uppercase',
                }}>
                  {d}
                </p>
              </div>
            ))}
          </div>

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                letterSpacing: '0.3em', color: 'rgba(201,168,76,0.5)',
                textTransform: 'uppercase', marginBottom: '1rem',
              }}>
                {selectedSize ? t.product.sizeSelected.replace('{s}', selectedSize) : t.product.sizeLabel}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    aria-pressed={selectedSize === s}
                    style={{
                      padding: '0.5rem 1rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.55rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      border: selectedSize === s
                        ? '0.5px solid #C9A84C'
                        : '0.5px solid rgba(242,242,242,0.12)',
                      background: selectedSize === s
                        ? 'rgba(201,168,76,0.1)'
                        : 'transparent',
                      color: selectedSize === s ? '#C9A84C' : 'rgba(242,242,242,0.4)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      if (selectedSize !== s) {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(242,242,242,0.7)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (selectedSize !== s) {
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,242,242,0.12)';
                        (e.currentTarget as HTMLElement).style.color = 'rgba(242,242,242,0.4)';
                      }
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Acquire button */}
          <button
            ref={btnRef}
            onClick={handleAcquire}
            aria-label={`Add ${product.name} to cart`}
            style={{
              width: '100%',
              padding: '1.1rem 0',
              background: '#F2F2F2',
              color: '#050505',
              border: 'none',
              cursor: 'pointer',
              fontFamily: '"Monument Extended", "Helvetica Neue", sans-serif',
              fontWeight: 800,
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              transition: 'background 0.2s, color 0.2s',
              marginBottom: '1rem',
            }}
            onMouseEnter={e => { if (!addedRef.current) gsap.to(e.currentTarget, { background: '#C9A84C', duration: 0.25 }); }}
            onMouseLeave={e => { if (!addedRef.current) gsap.to(e.currentTarget, { background: '#F2F2F2', duration: 0.25 }); }}
          >
            {t.product.acquire}
          </button>

          {sizeWarning ? (
            <p
              role="alert"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.52rem',
                letterSpacing: '0.12em',
                color: '#FF1293',
                textTransform: 'uppercase',
                textAlign: 'center',
                marginBottom: '1rem',
              }}
            >
              {t.product.sizeRequired}
            </p>
          ) : null}

          {/* Trust micro-copy */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.48rem',
            letterSpacing: '0.15em',
            color: 'rgba(168,168,168,0.25)',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}>
            {t.product.shipping}
          </p>

          {/* Iridescent divider — Y2K accent */}
          <div style={{
            marginTop: '3rem',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #FF1293, #C9A84C, #F2F2F2, #C9A84C, #FF1293, transparent)',
            opacity: 0.2,
          }} />

          {/* SS26 tag */}
          <p style={{
            marginTop: '1.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.48rem',
            letterSpacing: '0.25em',
            color: 'rgba(201,168,76,0.2)',
            textTransform: 'uppercase',
          }}>
            {t.product.season}
          </p>
        </div>
      </div>

      {/* Related products */}
      <div
        className="px-8 md:px-16 lg:px-24 pb-24"
        style={{ borderTop: '0.5px solid rgba(242,242,242,0.05)', paddingTop: '4rem' }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
          letterSpacing: '0.35em', color: 'rgba(201,168,76,0.45)',
          textTransform: 'uppercase', marginBottom: '3rem',
        }}>
          {t.product.covet}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(242,242,242,0.05)' }}
          className="related-grid"
        >
          {related.map(p => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              prefetch="intent"
              style={{ background: '#050505', cursor: 'pointer', position: 'relative', overflow: 'hidden', textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ aspectRatio: '3/4' }}>
                <GhostImage
                  key={p.id}
                  src={p.imageUrl}
                  alt={p.name}
                  fetchPriority="low"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 32vw, 92vw"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
              <div style={{ padding: '1.2rem 1rem' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.46rem', letterSpacing: '0.2em', color: 'rgba(168,168,168,0.4)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  {p.material}
                </p>
                <h3 style={{ fontFamily: '"Monument Extended", "Helvetica Neue", sans-serif', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#F2F2F2', marginBottom: '0.5rem' }}>
                  {p.name}
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '-0.02em', color: '#C9A84C', fontWeight: 300 }}>
                  {p.price}
                </p>
              </div>
              {/* Hover iridescent top line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: 'linear-gradient(90deg, #FF1293, #C9A84C, #F2F2F2, #C9A84C, #FF1293)',
                opacity: 0, transition: 'opacity 0.3s',
              }}
                className="related-hover-line"
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile layout override */}
      <style>{`
        @media (max-width: 768px) {
          .product-main-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            padding-left: 1.25rem !important;
            padding-right: 1.25rem !important;
          }
          .product-main-grid > div:first-child {
            position: static !important;
          }
          .related-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .related-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .related-grid > a:hover .related-hover-line {
          opacity: 0.5 !important;
        }
      `}</style>
    </div>
  );
}
