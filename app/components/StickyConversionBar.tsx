'use client';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from '@remix-run/react';
import { useCart } from '~/lib/CartContext';
import { useLocale } from '~/lib/LocaleContext';
import { useMagnetic } from '~/hooks/useMagnetic';

export function StickyConversionBar() {
  const { t } = useLocale();
  const { openCart, isCheckoutOpen, items } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const collectionMagRef = useMagnetic<HTMLDivElement>(0.95);
  const [visible, setVisible] = useState(false);
  const cartCount = items.reduce((n, line) => n + line.qty, 0);

  useEffect(() => {
    const onScroll = () => {
      if (isCheckoutOpen) {
        setVisible(false);
        return;
      }
      const y = window.scrollY;
      const h = window.innerHeight;
      setVisible(y > h * 0.48);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isCheckoutOpen]);

  const scrollToCollection = () => {
    if (location.pathname === '/') {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    void navigate({ pathname: '/', hash: 'collection' });
  };

  if (isCheckoutOpen) return null;

  return (
    <div
      className="fixed left-0 right-0 z-[48] flex flex-col items-center gap-2 border-t border-[rgba(201,168,76,0.22)] bg-[rgba(5,5,5,0.94)] px-4 pt-3 backdrop-blur-xl transition-transform duration-300 ease-out"
      style={{
        bottom: 0,
        paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))',
        transform: visible ? 'translateY(0)' : 'translateY(115%)',
        pointerEvents: visible ? 'auto' : 'none',
        boxShadow: '0 -24px 48px rgba(0,0,0,0.45)',
      }}
      role="region"
      aria-label={t.hero.shopCta}
    >
      <div className="flex w-full max-w-lg items-stretch justify-center gap-3">
        <div ref={collectionMagRef} className="min-h-[44px] flex-1 will-change-transform">
          <button
            type="button"
            onClick={scrollToCollection}
            className="min-h-[44px] w-full border border-[rgba(201,168,76,0.55)] bg-[rgba(201,168,76,0.12)] px-4 py-2 text-center uppercase tracking-[0.22em] text-chrome transition-colors hover:border-[#C9A84C] hover:bg-[rgba(201,168,76,0.2)]"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem' }}
          >
            {t.hero.shopCta}
          </button>
        </div>
        <button
          type="button"
          onClick={openCart}
          className="min-h-[44px] flex-1 border border-[rgba(242,242,242,0.18)] bg-transparent px-4 py-2 uppercase tracking-[0.22em] text-titanium transition-colors hover:border-[rgba(201,168,76,0.45)]"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem' }}
          aria-label={t.nav.cartOpenAria.replace('{n}', String(cartCount))}
        >
          {t.nav.cart}
          {cartCount > 0 ? (
            <span className="ml-2 tabular-nums text-chrome opacity-80">{String(cartCount).padStart(2, '0')}</span>
          ) : null}
        </button>
      </div>
      <p
        className="max-w-lg text-center text-chrome opacity-45"
        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.12em' }}
      >
        {t.sticky.secureNote}
      </p>
    </div>
  );
}
