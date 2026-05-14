'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from '@remix-run/react';
import { useLocale } from '~/lib/LocaleContext';
import { useCart } from '~/lib/CartContext';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';
import { withLocalePath } from '~/lib/localePath';
import type { ProductData } from '~/lib/products';

interface HeroProductCarouselProps {
  products: ProductData[];
}

export function HeroProductCarousel({ products }: HeroProductCarouselProps) {
  const { t, locale } = useLocale();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const featuredProducts = products.slice(0, 4);

  const goToSlide = useCallback((index: number) => {
    const normalized = ((index % featuredProducts.length) + featuredProducts.length) % featuredProducts.length;
    setCurrentIndex(normalized);

    if (carouselRef.current && !reducedMotion) {
      gsap.to(carouselRef.current, {
        x: -normalized * 100 + '%',
        duration: 0.6,
        ease: 'power2.inOut',
      });
    } else if (carouselRef.current) {
      gsap.set(carouselRef.current, { x: -normalized * 100 + '%' });
    }
  }, [featuredProducts.length, reducedMotion]);

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    if (reducedMotion) return;
    autoPlayRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [nextSlide, reducedMotion]);

  const handleMouseEnter = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;
    autoPlayRef.current = setInterval(nextSlide, 5000);
  };

  return (
    <section
      className="w-full bg-void-pit py-16 md:py-24 px-8 md:px-16 lg:px-24 cinematic-glow"
      style={{
        borderTop: '1px solid rgba(201,168,76,0.25)',
        borderBottom: '1px solid rgba(201,168,76,0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Cinematic background effect */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 30%, rgba(255,18,147,0.12) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(110,203,255,0.12) 0%, transparent 40%)',
          pointerEvents: 'none',
        }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <p
            className="text-label mb-3 md:mb-4 cinematic-pulse"
            style={{
              color: '#C9A84C',
              letterSpacing: '0.3em',
              opacity: 0.85,
            }}
          >
            ✦ FEATURED PIECES ✦
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-y2k-display), "Monument Extended", "Helvetica Neue", sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              letterSpacing: '0.08em',
              color: '#F2F2F2',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #F2F2F2 0%, #C9A84C 50%, #A8A8A8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 40px rgba(255,18,147,0.15)',
            }}
          >
            SHOP NOW
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              color: 'rgba(242,242,242,0.75)',
              maxWidth: '36rem',
              lineHeight: 1.9,
            }}
          >
            Explore our latest millennium jewelry collection. Crystal, chrome, and early-2000s attitude.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg cinematic-glow"
          style={{
            background: 'linear-gradient(135deg, rgba(5,5,5,0.6) 0%, rgba(201,168,76,0.08) 50%, rgba(5,5,5,0.6) 100%)',
            border: '1px solid rgba(201,168,76,0.3)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,168,76,0.15)',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Carousel Track */}
          <div
            ref={carouselRef}
            style={{
              display: 'flex',
              width: `${featuredProducts.length * 100}%`,
              transition: reducedMotion ? 'none' : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {featuredProducts.map((product, idx) => (
              <div
                key={product.id}
                style={{
                  width: `${100 / featuredProducts.length}%`,
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '320px',
                  background: idx === currentIndex
                    ? 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, rgba(110,203,255,0.04) 100%)'
                    : 'transparent',
                  transition: 'background 0.4s ease',
                }}
              >
                {/* Product Info */}
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                      fontWeight: 700,
                      color: '#F2F2F2',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {product.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: 'rgba(242,242,242,0.6)',
                      letterSpacing: '0.1em',
                      marginBottom: '1rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    {product.material}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      color: 'rgba(242,242,242,0.75)',
                      lineHeight: 1.6,
                      maxWidth: '280px',
                    }}
                  >
                    {product.description || 'Millennium jewelry crafted for the modern atelier.'}
                  </p>
                </div>

                {/* Price & CTA */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '1.5rem' }}>
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'rgba(242,242,242,0.5)',
                        letterSpacing: '0.08em',
                        marginBottom: '0.25rem',
                      }}
                    >
                      PRICE
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: '#C9A84C',
                        letterSpacing: '0.05em',
                      }}
                    >
                      ¥{product.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(withLocalePath(locale, `/products/${product.id}`))}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      padding: '10px 16px',
                      background: 'rgba(201,168,76,0.15)',
                      border: '1px solid rgba(201,168,76,0.4)',
                      color: '#C9A84C',
                      cursor: 'pointer',
                      borderRadius: '3px',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = 'rgba(201,168,76,0.25)';
                      el.style.boxShadow = '0 0 16px rgba(201,168,76,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = 'rgba(201,168,76,0.15)';
                      el.style.boxShadow = 'none';
                    }}
                  >
                    VIEW PIECE
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            aria-label="Previous product"
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(201,168,76,0.2)',
              border: '1px solid rgba(201,168,76,0.4)',
              color: '#C9A84C',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(201,168,76,0.35)';
              el.style.boxShadow = '0 0 16px rgba(201,168,76,0.3)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(201,168,76,0.2)';
              el.style.boxShadow = 'none';
            }}
          >
            ←
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next product"
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              background: 'rgba(201,168,76,0.2)',
              border: '1px solid rgba(201,168,76,0.4)',
              color: '#C9A84C',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(201,168,76,0.35)';
              el.style.boxShadow = '0 0 16px rgba(201,168,76,0.3)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(201,168,76,0.2)';
              el.style.boxShadow = 'none';
            }}
          >
            →
          </button>
        </div>

        {/* Indicators */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '1.5rem',
          }}
        >
          {featuredProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                width: idx === currentIndex ? '24px' : '8px',
                height: '8px',
                background: idx === currentIndex ? '#C9A84C' : 'rgba(201,168,76,0.3)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                if (idx !== currentIndex) el.style.background = 'rgba(201,168,76,0.5)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                if (idx !== currentIndex) el.style.background = 'rgba(201,168,76,0.3)';
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
