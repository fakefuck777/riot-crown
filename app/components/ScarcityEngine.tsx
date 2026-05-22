'use client';
import { useMemo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useLocale } from '~/lib/LocaleContext';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';
import { computeCatalogStockStats, getCatalogStockStats } from '~/lib/products';
import type { ProductData } from '~/lib/products';

export function ScarcityEngine({ products }: { products?: ProductData[] }) {
  const { t } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const heartRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(
    () => (products?.length ? computeCatalogStockStats(products) : getCatalogStockStats()),
    [products],
  );

  const fillPct = useMemo(() => {
    if (stats.listedSkuCount === 0) return 8;
    const share = stats.lowSkuCount / stats.listedSkuCount;
    return Math.max(10, Math.min(100, Math.round(share * 100)));
  }, [stats.listedSkuCount, stats.lowSkuCount]);

  const barColor = stats.minStock <= 3 ? '#FF1293' : stats.lowSkuCount >= 5 ? '#C0C0C0' : '#A8A8A8';

  const showLowStockNote = stats.minStock <= 5 && stats.lowSkuCount >= 1;

  const displayCount = stats.totalUnits >= 100 ? String(stats.totalUnits) : String(stats.totalUnits).padStart(2, '0');

  useEffect(() => {
    const el = heartRef.current;
    if (!el || reducedMotion) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.0 });
    tl.to(el, { scaleX: 1.22, scaleY: 1.14, duration: 0.12, ease: 'power2.out' })
      .to(el, { scaleX: 0.94, scaleY: 0.9, duration: 0.14, ease: 'power2.inOut' })
      .to(el, { scaleX: 1.08, scaleY: 1.05, duration: 0.16, ease: 'power2.out' })
      .to(el, { scaleX: 1, scaleY: 1, duration: 0.45, ease: 'power3.out' });
    return () => { tl.kill(); };
  }, [reducedMotion]);

  return (
    <div
      id="scarcity"
      style={{
        background: 'linear-gradient(145deg, rgba(8,8,12,0.98) 0%, rgba(14,8,18,0.98) 45%, rgba(8,10,14,0.98) 100%)',
        padding: '48px 0',
        borderTop: '0.5px solid rgba(182,102,255,0.12)',
        borderBottom: '0.5px solid rgba(192,192,192,0.08)',
      }}
    >
      <div className="px-8 md:px-16 lg:px-24">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
          className="scarcity-grid"
        >

          <div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.3em',
              color: 'rgba(255,18,147,0.65)',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}>
              {t.scarcity.product}
            </p>

            <h2 style={{
              fontFamily: '"Monument Extended", "Helvetica Neue", "Arial Black", sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(1.6rem, 3.5vw, 3rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              color: '#F2F2F2',
              marginBottom: '0.5rem',
            }}>
              {t.scarcity.headline1}
            </h2>
            <h2 style={{
              fontFamily: '"Monument Extended", "Helvetica Neue", "Arial Black", sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(1.6rem, 3.5vw, 3rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              background: 'linear-gradient(100deg, #ff1293 0%, #c9a84c 45%, #6ecbff 95%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '2.5rem',
              filter: 'drop-shadow(0 0 20px rgba(255,18,147,0.2))',
            }}>
              {t.scarcity.headline2}
            </h2>

            <div style={{ position: 'relative', height: '1px', background: 'rgba(242,242,242,0.06)', marginBottom: '0.75rem' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '1px',
                width: `${fillPct}%`,
                background: barColor,
                boxShadow: `0 0 10px ${barColor}`,
                transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1), background 0.5s ease',
              }} />
            </div>

            {showLowStockNote && (
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.52rem',
                letterSpacing: '0.18em',
                color: stats.minStock <= 3 ? '#FF1293' : 'rgba(192,192,192,0.75)',
                textTransform: 'uppercase',
                lineHeight: 1.65,
                maxWidth: '28rem',
              }}>
                {t.scarcity.critical}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
              <span
                style={{
                  fontFamily: '"Monument Extended", "Helvetica Neue", "Arial Black", sans-serif',
                  fontWeight: 900,
                  fontSize: stats.totalUnits >= 100
                    ? 'clamp(3.5rem, 8vw, 7rem)'
                    : 'clamp(5rem, 10vw, 9rem)',
                  lineHeight: 1,
                  color: '#F2F2F2',
                  letterSpacing: '-0.04em',
                  display: 'inline-block',
                }}
              >
                {displayCount}
              </span>
            </div>

            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.2em',
              color: 'rgba(168,168,168,0.5)',
              textTransform: 'uppercase',
              textAlign: 'right',
              maxWidth: '20rem',
            }}>
              {t.scarcity.left}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                ref={heartRef}
                style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: stats.minStock <= 3 ? '#FF1293' : '#C0C0C0',
                  boxShadow: stats.minStock <= 3
                    ? '0 0 14px rgba(255,18,147,0.9)'
                    : '0 0 10px rgba(192,192,192,0.7)',
                  animation: reducedMotion ? 'none' : 'goldPulse 2s ease-in-out infinite',
                }}
              />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.15em',
                color: 'rgba(242,242,242,0.2)',
              }}>
                {t.scarcityLive}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
