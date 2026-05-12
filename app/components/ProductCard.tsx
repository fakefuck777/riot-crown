'use client';
import { useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { useAudio } from '~/hooks/useAudio';
import { GhostImage } from '~/components/GhostImage';
import { useLocale } from '~/lib/LocaleContext';
import { useCart } from '~/lib/CartContext';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';
import type { ProductData } from '~/lib/products';

export type { ProductData } from '~/lib/products';

export function ProductCard({
  product,
  onClick,
  fetchPriority = 'auto',
}: {
  product: ProductData;
  onClick?: () => void;
  fetchPriority?: 'high' | 'low' | 'auto';
}) {
  const cardRef    = useRef<HTMLDivElement>(null);
  const imageRef   = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);
  const infoRef    = useRef<HTMLDivElement>(null);
  const btnRef     = useRef<HTMLButtonElement>(null);
  const { playClick } = useAudio();
  const { t } = useLocale();
  const { addToCart } = useCart();
  const reducedMotion = usePrefersReducedMotion();

  const handleAcquire = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    playClick();
    addToCart({ id: product.id, name: product.name, price: product.price, material: product.material });
  }, [product, playClick, addToCart]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const card = cardRef.current, img = imageRef.current;
    if (!card || !img) return;
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
    const dy = (e.clientY - rect.top  - rect.height / 2) / rect.height;

    gsap.to(img, { x: dx * 18, y: dy * 18, duration: 1.6, ease: 'power3.out', overwrite: 'auto' });
    gsap.to(card, {
      rotationY: dx * 5, rotationX: -dy * 5,
      transformPerspective: 1000,
      duration: 1.2, ease: 'power3.out', overwrite: 'auto',
    });

    if (glowRef.current) {
      const px = ((e.clientX - rect.left) / rect.width)  * 100;
      const py = ((e.clientY - rect.top)  / rect.height) * 100;
      glowRef.current.style.background =
        `radial-gradient(circle at ${px}% ${py}%, rgba(255,18,147,0.18) 0%, transparent 60%)`;
    }
  }, [reducedMotion]);

  const onMouseEnter = useCallback(() => {
    playClick();
    const overlay = overlayRef.current, card = cardRef.current, info = infoRef.current;
    if (!overlay || !card) return;

    if (reducedMotion) {
      gsap.set(overlay, { opacity: 0.35 });
      gsap.set(card, { scale: 1 });
      if (info) gsap.set(info, { y: 0 });
      if (btnRef.current) gsap.set(btnRef.current, { y: 0, opacity: 1 });
      return;
    }

    gsap.timeline()
      .set(overlay, { opacity: 0 })
      .to(overlay, { opacity: 0.7, duration: 0.07, ease: 'none' })
      .to(overlay, { opacity: 0.4, duration: 0.1,  ease: 'power2.out' })
      .to(overlay, { opacity: 0.6, duration: 0.05, ease: 'none' })
      .to(overlay, { opacity: 0.35, duration: 0.25, ease: 'power3.out' });

    gsap.to(card, { scale: 1.012, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });

    if (info) {
      gsap.to(info, { y: -4, duration: 0.4, ease: 'power3.out' });
    }
    if (btnRef.current) {
      gsap.fromTo(btnRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, ease: 'power3.out', delay: 0.1 }
      );
    }
  }, [playClick, reducedMotion]);

  const onMouseLeave = useCallback(() => {
    const card = cardRef.current, img = imageRef.current;
    const overlay = overlayRef.current, info = infoRef.current;
    if (!card || !img || !overlay) return;

    if (reducedMotion) {
      gsap.set(overlay, { opacity: 0 });
      gsap.set([card, img], { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1 });
      if (info) gsap.set(info, { y: 0 });
      if (btnRef.current) gsap.set(btnRef.current, { y: 8, opacity: 0 });
      if (glowRef.current) glowRef.current.style.background = 'transparent';
      return;
    }

    gsap.to([card, img], {
      x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1,
      duration: 1.4, ease: 'elastic.out(1, 0.55)', overwrite: 'auto',
    });
    gsap.to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.out' });
    if (glowRef.current) glowRef.current.style.background = 'transparent';
    if (info) gsap.to(info, { y: 0, duration: 0.4, ease: 'power3.out' });
    if (btnRef.current) {
      gsap.to(btnRef.current, { y: 8, opacity: 0, duration: 0.2, ease: 'power2.in' });
    }
  }, [reducedMotion]);

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden group w-full h-full"
      style={{ willChange: 'transform', cursor: 'pointer', background: '#080808' }}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Image */}
      <div ref={imageRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
        <GhostImage
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full product-img"
          fetchPriority={fetchPriority}
        />
      </div>

      {/* Thermal overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0,
          background: `radial-gradient(ellipse at 40% 35%,
            rgba(255,220,50,0.85) 0%,
            rgba(255,80,0,0.65) 25%,
            rgba(255,18,147,0.45) 55%,
            rgba(80,0,120,0.25) 80%,
            transparent 100%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* Mouse glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
        style={{ transition: 'background 0.08s ease' }}
      />

      {/* Sparkle dots */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        style={{
          transition: 'opacity 0.4s ease',
          backgroundImage: `
            radial-gradient(1.5px 1.5px at 18% 22%, rgba(255,255,255,0.95) 0%, transparent 100%),
            radial-gradient(1px   1px   at 78% 12%, rgba(201,168,76,0.9)  0%, transparent 100%),
            radial-gradient(1px   1px   at 52% 68%, rgba(255,255,255,0.8) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 8%  78%, rgba(201,168,76,0.7)  0%, transparent 100%),
            radial-gradient(1px   1px   at 90% 52%, rgba(255,255,255,0.85) 0%, transparent 100%),
            radial-gradient(1px   1px   at 32% 88%, rgba(201,168,76,0.75) 0%, transparent 100%),
            radial-gradient(2px   2px   at 62% 38%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px   1px   at 44% 8%,  rgba(255,18,147,0.7)  0%, transparent 100%)
          `,
        }}
      />

      {/* Bottom gradient + info */}
      <div
        ref={infoRef}
        className="absolute bottom-0 left-0 right-0"
        style={{
          background: 'linear-gradient(to top, rgba(5,5,5,0.97) 0%, rgba(5,5,5,0.7) 50%, transparent 100%)',
          padding: '2rem 1.5rem 1.5rem',
        }}
      >
        {/* Material */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.52rem',
          letterSpacing: '0.22em',
          color: 'rgba(168,168,168,0.55)',
          textTransform: 'uppercase',
          marginBottom: '0.4rem',
        }}>
          {product.material}
        </p>

        {/* Name */}
        <h3 style={{
          fontFamily: '"Monument Extended", "Helvetica Neue", "Arial Black", sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(0.75rem, 1.2vw, 0.95rem)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#F2F2F2',
          marginBottom: '0.6rem',
          lineHeight: 1.2,
        }}>
          {product.name}
        </h3>

        {/* Price + ID row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            letterSpacing: '-0.02em',
            color: '#C9A84C',
            fontWeight: 300,
          }}>
            {product.price}
          </p>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            letterSpacing: '0.15em',
            color: 'rgba(242,242,242,0.2)',
          }}>
            #{product.id}
          </span>
        </div>

        {/* Acquire button — slides up on hover */}
        <button
          ref={btnRef}
          onClick={handleAcquire}
          className="product-acquire-btn"
          style={{
            marginTop: '1rem',
            width: '100%',
            padding: '0.65rem 0',
            background: 'transparent',
            border: '0.5px solid rgba(201,168,76,0.5)',
            color: '#C9A84C',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.58rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color 0.2s ease, color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            const btn = e.currentTarget;
            btn.style.borderColor = 'rgba(201,168,76,1)';
            btn.style.color = '#F2F2F2';
            btn.style.background = 'rgba(201,168,76,0.08)';
          }}
          onMouseLeave={(e) => {
            const btn = e.currentTarget;
            btn.style.borderColor = 'rgba(201,168,76,0.5)';
            btn.style.color = '#C9A84C';
            btn.style.background = 'transparent';
          }}
        >
          {t.grid.acquire}
        </button>
      </div>

      {/* Corner bracket — top left */}
      <div className="absolute top-3 left-3 pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity duration-500">
        <div style={{ width: '12px', height: '1px', background: '#C9A84C' }} />
        <div style={{ width: '1px', height: '12px', background: '#C9A84C' }} />
      </div>

      {/* Corner bracket — top right */}
      <div className="absolute top-3 right-3 pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity duration-500 flex flex-col items-end">
        <div style={{ width: '12px', height: '1px', background: '#C9A84C' }} />
        <div style={{ width: '1px', height: '12px', background: '#C9A84C', marginLeft: 'auto' }} />
      </div>

      {/* ID badge — top right resting */}
      <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-0 transition-opacity duration-300">
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.48rem',
          letterSpacing: '0.1em',
          color: '#A8A8A8',
        }}>
          {product.id.padStart(2, '0')}
        </span>
      </div>

      {/* Stock badge — top left, always visible */}
      {product.stock !== undefined && (
        <div className="absolute top-3 left-3" style={{ zIndex: 2 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.46rem',
            letterSpacing: '0.15em',
            color: product.stock <= 3 ? '#FF1293' : 'rgba(201,168,76,0.6)',
            textTransform: 'uppercase',
            animation: product.stock <= 3 && !reducedMotion ? 'scarcityBlink 1.6s ease-in-out infinite' : undefined,
          }}>
            {product.stock <= 3
              ? t.product.stockLow.replace('{n}', String(product.stock))
              : t.product.stockOk.replace('{n}', String(product.stock))}
          </span>
        </div>
      )}
    </div>
  );
}
