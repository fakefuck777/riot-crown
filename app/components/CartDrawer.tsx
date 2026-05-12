'use client';
import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { useLocale } from '~/lib/LocaleContext';
import { useCart } from '~/lib/CartContext';
import { LOCALE_BCP47 } from '~/lib/i18n';
import { sumCartLineTotals, formatYenTotal, parseDisplayPriceYen } from '~/lib/price';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';
import { useFocusTrap } from '~/hooks/useFocusTrap';

import type { CartItem } from '~/lib/cartTypes';

export type { CartItem };

interface CartDrawerProps {
  isOpen:     boolean;
  items:      CartItem[];
  onClose:    () => void;
  onCheckout: () => void;
}

export function CartDrawer({ isOpen, items, onClose, onCheckout }: CartDrawerProps) {
  const { t, locale } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const drawerRef   = useRef<HTMLDivElement>(null);
  const aberRef     = useRef<HTMLDivElement>(null);
  const prevPieceCount = useRef(0);
  const lastFocusRef  = useRef<HTMLElement | null>(null);
  // mounted controls whether the drawer DOM exists at all
  const [mounted, setMounted] = useState(false);

  const pieceCount = items.reduce((n, i) => n + i.qty, 0);

  // Mount on first open, never unmount (keeps animation state)
  useEffect(() => {
    if (isOpen && !mounted) setMounted(true);
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [isOpen, onClose]);

  // Restore focus when cart closes (a11y)
  useEffect(() => {
    if (isOpen) {
      lastFocusRef.current = document.activeElement as HTMLElement | null;
    } else {
      queueMicrotask(() => lastFocusRef.current?.focus?.());
    }
  }, [isOpen]);

  // Focus first control when opened
  useEffect(() => {
    if (!isOpen || !mounted) return;
    const id = window.requestAnimationFrame(() => {
      const closeBtn = drawerRef.current?.querySelector<HTMLElement>('[data-cart-close]');
      closeBtn?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [isOpen, mounted]);

  // Animate in/out after mount. First open: `isOpen` flips true before `mounted`
  // is true, so this effect must re-run when `mounted` becomes true — otherwise
  // the backdrop appears (full-screen blur) but the drawer never slides in.
  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawer || !mounted) return;

    if (reducedMotion) {
      gsap.set(drawer, { x: isOpen ? '0%' : '100%' });
      return;
    }

    if (isOpen) {
      gsap.fromTo(drawer,
        { x: '100%' },
        { x: '0%', duration: 0.5, ease: 'power4.out' }
      );
    } else {
      gsap.to(drawer, { x: '100%', duration: 0.35, ease: 'power3.in' });
    }
  }, [isOpen, reducedMotion, mounted]);

  const triggerAberration = useCallback(() => {
    if (reducedMotion) return;
    const el = aberRef.current;
    if (!el) return;
    gsap.timeline()
      .set(el,  { opacity: 1, background: 'rgba(255,0,80,0.15)', x: -5, skewX: 1.5 })
      .set(el,  { background: 'rgba(0,220,255,0.12)', x: 4, skewX: -1 }, '+=0.02')
      .set(el,  { background: 'rgba(242,242,242,0.05)', x: 0, skewX: 0 }, '+=0.02')
      .to(el,   { opacity: 0, duration: 0.15, ease: 'power2.out' });
  }, [reducedMotion]);

  // Chromatic aberration when total piece count increases (new line or +qty)
  useEffect(() => {
    if (pieceCount > prevPieceCount.current) triggerAberration();
    prevPieceCount.current = pieceCount;
  }, [pieceCount, triggerAberration]);

  const total = sumCartLineTotals(items);
  const numberLocale = LOCALE_BCP47[locale];

  useFocusTrap(isOpen && mounted, drawerRef);

  return (
    <>
      <div className="sr-only" aria-live="polite" aria-atomic>
        {isOpen ? `${pieceCount} ${t.cart.liveRegionPieces}` : ''}
      </div>
      {/* Chromatic aberration flash — always in DOM, pointer-events none */}
      <div
        ref={aberRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{ opacity: 0 }}
      />

      {/* Backdrop — pure CSS, no GSAP */}
      <div
        className="fixed inset-0 z-[200]"
        aria-hidden={!isOpen}
        style={{
          background: 'rgba(5,5,5,0.6)',
          // Must turn off when closed: opacity:0 alone still composites backdrop-filter
          // on some WebKit/Chromium builds and can blur the entire viewport.
          backdropFilter: isOpen ? 'blur(4px)' : 'none',
          WebkitBackdropFilter: isOpen ? 'blur(4px)' : 'none',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          visibility: isOpen ? 'visible' : 'hidden',
          transition: isOpen
            ? 'opacity 0.3s ease, visibility 0s linear 0s'
            : 'opacity 0.3s ease, visibility 0s linear 0.3s',
        }}
        onClick={onClose}
      />

      {/* Drawer — only rendered after first open */}
      {mounted && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
          className="fixed top-0 right-0 h-full z-[201] flex flex-col"
          style={{
            width: 'min(480px, 100vw)',
            background: 'rgba(8,8,8,0.95)',
            backdropFilter: 'blur(40px) saturate(0.3)',
            WebkitBackdropFilter: 'blur(40px) saturate(0.3)',
            borderLeft: '0.5px solid rgba(242,242,242,0.08)',
            transform: 'translateX(100%)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-7"
            style={{ borderBottom: '0.5px solid rgba(242,242,242,0.06)' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.3em', color: 'rgba(201,168,76,0.4)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                {t.cart.eyebrow}
              </p>
              <h2 id="cart-drawer-title" style={{ fontFamily: '"Monument Extended","Helvetica Neue",sans-serif', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.15em', color: '#F2F2F2', textTransform: 'uppercase' }}>
                {t.cart.title}
              </h2>
            </div>
            <button
              type="button"
              data-cart-close
              onClick={onClose}
              aria-label={t.cart.close}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.2em', color: 'rgba(242,242,242,0.4)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F2F2F2'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(242,242,242,0.4)'; }}
            >
              {t.cart.close}
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-8 py-6" style={{ scrollbarWidth: 'none' }}>
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-6" style={{ opacity: 0.3 }}>
                <div className="divider-gold w-16" />
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.25em', color: '#A8A8A8', textTransform: 'uppercase', textAlign: 'center' }}>
                  {t.cart.empty}
                </p>
                <div className="divider-gold w-16" />
              </div>
            ) : (
              <div className="flex flex-col" style={{ gap: '1px', background: 'rgba(242,242,242,0.04)' }}>
                {items.map(item => (
                  <CartLineItem key={`${item.id}::${item.size ?? ''}`} item={item} numberLocale={numberLocale} />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-8 py-7" style={{ borderTop: '0.5px solid rgba(242,242,242,0.06)' }}>
              <div className="flex items-center justify-between mb-6">
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.25em', color: 'rgba(168,168,168,0.5)', textTransform: 'uppercase' }}>
                  {t.cart.total}
                </p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', letterSpacing: '-0.04em', color: '#F2F2F2', fontWeight: 300 }}>
                  {formatYenTotal(total, numberLocale)}
                </p>
              </div>
              <button
                type="button"
                onClick={onCheckout}
                style={{ width: '100%', padding: '1rem 0', background: '#F2F2F2', color: '#050505', border: 'none', cursor: 'pointer', fontFamily: '"Monument Extended","Helvetica Neue",sans-serif', fontWeight: 800, fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', transition: 'background 0.25s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C9A84C'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F2F2F2'; }}
              >
                {t.cart.acquire}
              </button>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', letterSpacing: '0.12em', color: 'rgba(168,168,168,0.2)', textTransform: 'uppercase', textAlign: 'center', marginTop: '1rem' }}>
                {t.cart.footer}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function CartLineItem({ item, numberLocale }: { item: CartItem; numberLocale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { removeFromCart, updateQty } = useCart();
  const reducedMotion = usePrefersReducedMotion();
  const sizeKey = item.size;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion) {
      gsap.set(el, { opacity: 1, x: 0 });
      return;
    }
    gsap.fromTo(el,
      { opacity: 0, x: 16 },
      { opacity: 1, x: 0, duration: 0.35, ease: 'power3.out' }
    );
  }, [reducedMotion]);

  const handleRemove = () => {
    const el = ref.current;
    if (!el || reducedMotion) {
      removeFromCart(item.id, sizeKey);
      return;
    }
    gsap.to(el, {
      opacity: 0, x: 16, height: 0, paddingTop: 0, paddingBottom: 0,
      duration: 0.25, ease: 'power2.in',
      onComplete: () => removeFromCart(item.id, sizeKey),
    });
  };

  const unitPrice = parseDisplayPriceYen(item.price);
  const lineTotal = formatYenTotal(unitPrice * item.qty, numberLocale);

  return (
    <div ref={ref} style={{ background: '#050505', padding: '1.2rem 1rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ fontFamily: '"Monument Extended","Helvetica Neue",sans-serif', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F2F2F2', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.name}
        </h3>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', letterSpacing: '0.15em', color: 'rgba(168,168,168,0.4)', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.material}
        </p>
        {item.size ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.44rem', letterSpacing: '0.12em', color: 'rgba(201,168,76,0.45)', textTransform: 'uppercase', marginTop: '0.35rem' }}>
            {item.size}
          </p>
        ) : null}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.75rem' }}>
          <button type="button" onClick={() => updateQty(item.id, item.qty - 1, sizeKey)} aria-label="Decrease quantity"
            style={{ width: '22px', height: '22px', background: 'rgba(242,242,242,0.06)', border: '0.5px solid rgba(242,242,242,0.12)', color: '#F2F2F2', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            −
          </button>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(242,242,242,0.5)', minWidth: '18px', textAlign: 'center' }}>
            {item.qty.toString().padStart(2, '0')}
          </span>
          <button type="button" onClick={() => updateQty(item.id, item.qty + 1, sizeKey)} aria-label="Increase quantity"
            style={{ width: '22px', height: '22px', background: 'rgba(242,242,242,0.06)', border: '0.5px solid rgba(242,242,242,0.12)', color: '#F2F2F2', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            +
          </button>
          <button type="button" onClick={handleRemove} aria-label={`Remove ${item.name}`}
            style={{ marginLeft: '0.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.44rem', letterSpacing: '0.15em', color: 'rgba(168,168,168,0.25)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', transition: 'color 0.2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FF1293'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(168,168,168,0.25)'; }}>
            REMOVE
          </button>
        </div>
      </div>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '-0.03em', color: '#C9A84C', fontWeight: 300, flexShrink: 0 }}>
        {lineTotal}
      </p>
    </div>
  );
}
