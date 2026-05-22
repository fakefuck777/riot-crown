'use client';
import { useRef, useEffect, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { useLocale } from '~/lib/LocaleContext';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';
import { useMagnetic } from '~/hooks/useMagnetic';

const GraffitiCanvas = lazy(() =>
  import('~/components/GraffitiCanvas').then(m => ({ default: m.GraffitiCanvas }))
);

export function Hero() {
  const { t } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const heroRootRef  = useRef<HTMLElement>(null);
  const sectionRef   = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const subtitleRef  = useRef<HTMLParagraphElement>(null);
  const eyebrowRef   = useRef<HTMLParagraphElement>(null);
  const dividerRef   = useRef<HTMLDivElement>(null);
  const scrollRef    = useRef<HTMLDivElement>(null);
  const ctaBlockRef  = useRef<HTMLDivElement>(null);
  const scrollVelRef = useRef<number>(0);
  const mouseRef     = useRef<[number, number]>([0.5, 0.5]);
  const ctaMagneticRef = useMagnetic<HTMLDivElement>(1.05);

  useEffect(() => {
    if (reducedMotion) return;
    let lastTime = performance.now();
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      const dt  = Math.max(now - lastTime, 1);
      scrollVelRef.current = Math.min(Math.abs(e.deltaY) / dt * 0.04, 1.0);
      lastTime = now;
      gsap.to(scrollVelRef, { current: 0, duration: 1.2, ease: 'power2.out', overwrite: true });
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [reducedMotion]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (reducedMotion) {
      gsap.set(section, { rotationX: 0, rotationY: 0 });
      return;
    }
    const setRotX = gsap.quickTo(section, 'rotationX', { duration: 2.35, ease: 'power2.out' });
    const setRotY = gsap.quickTo(section, 'rotationY', { duration: 2.35, ease: 'power2.out' });
    gsap.set(section, { transformPerspective: 2000, transformOrigin: 'center center' });

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = 1 - e.clientY / window.innerHeight;
      mouseRef.current = [nx, ny];
      const tx = (ny - 0.5) * -3.4;
      const ty = (nx - 0.5) * 3.4;
      setRotX(tx);
      setRotY(ty);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reducedMotion]);

  useEffect(() => {
    const root = heroRootRef.current;
    if (!root) return;

    if (reducedMotion) {
      gsap.set(
        [
          eyebrowRef.current,
          titleRef.current,
          dividerRef.current,
          subtitleRef.current,
          ctaBlockRef.current,
          scrollRef.current,
        ].filter(Boolean),
        { opacity: 1, x: 0, y: 0, skewY: 0, scaleX: 1, clearProps: 'transform' },
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 });

      tl.fromTo(eyebrowRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out' },
      );

      tl.fromTo(titleRef.current,
        { opacity: 0, y: 60, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.4, ease: 'power4.out' },
        '-=0.5',
      );

      tl.fromTo(dividerRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8, ease: 'power3.out', transformOrigin: 'left center' },
        '-=0.6',
      );

      tl.fromTo(subtitleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
        '-=0.5',
      );

      tl.fromTo(ctaBlockRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
        '-=0.45',
      );

      tl.fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3',
      );
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const targets = [
      eyebrowRef.current,
      titleRef.current,
      dividerRef.current,
      subtitleRef.current,
      ctaBlockRef.current,
      scrollRef.current,
    ].filter(Boolean) as HTMLElement[];

    const t = window.setTimeout(() => {
      const title = titleRef.current;
      if (!title) return;
      const o = parseFloat(window.getComputedStyle(title).opacity);
      if (o < 0.08) {
        gsap.set(targets, { opacity: 1, x: 0, y: 0, skewY: 0, scaleX: 1, clearProps: 'transform' });
      }
    }, 3200);
    return () => window.clearTimeout(t);
  }, [reducedMotion]);

  return (
    <section
      ref={heroRootRef}
      id="hero"
      data-riot-hero="split-webgl-v2"
      className="relative isolate w-full min-h-screen min-h-dvh bg-void"
      style={{ overflow: 'hidden' }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 min-h-dvh w-full"
        aria-hidden
      >
        <Suspense
          fallback={<div className="absolute inset-0 h-full min-h-dvh w-full bg-void" aria-hidden />}
        >
          <GraffitiCanvas
            scrollVelRef={scrollVelRef}
            mouseRef={mouseRef}
            className="absolute inset-0 h-full min-h-dvh w-full"
          />
        </Suspense>
      </div>

      <div
        ref={sectionRef}
        className="pointer-events-none absolute inset-0 z-[1] min-h-dvh w-full"
        style={{
          willChange: 'transform',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 88% 70% at 50% 38%, rgba(5,5,5,0.22) 0%, rgba(5,5,5,0.55) 52%, rgba(5,5,5,0.94) 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '28%',
            background: 'linear-gradient(to bottom, transparent, var(--void))',
          }}
        />

        {!reducedMotion ? <div className="y2k-hero-chrome-orbit" aria-hidden /> : null}

        <div className="pointer-events-auto absolute inset-0 flex w-full max-w-full flex-col justify-center px-8 md:px-16 lg:px-24">

        <div className="y2k-hero-glyph-row" aria-hidden>
          <span title="butterfly">🦋</span>
          <span>✦</span>
          <span title="heart">♡</span>
          <span>✧</span>
          <span title="lock">🔒</span>
          <span>▪</span>
          <span title="pixel">◼</span>
          <span>✟</span>
          <span>★</span>
        </div>
        {!reducedMotion ? (
          <div className="y2k-hero-marquee" aria-hidden>
            <div className="y2k-hero-marquee__track">
              <span>{t.hero.marquee}</span>
              <span>{t.hero.marquee}</span>
            </div>
          </div>
        ) : null}

        <p
          ref={eyebrowRef}
          className="w-full max-w-full"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(192,192,192,0.7)',
            marginBottom: '2rem',
            opacity: 0,
          }}
        >
          {t.hero.eyebrow}
        </p>

        <h1
          ref={titleRef}
          className="w-full max-w-full"
          style={{
            fontFamily: '"Monument Extended", "Helvetica Neue", "Arial Black", sans-serif',
            fontWeight: 900,
            fontSize: 'clamp(8rem, min(22vw, 32vh), 42rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            background: 'linear-gradient(135deg, #E8E8E8 0%, #C0C0C0 25%, #E8E8E8 50%, #B0B0B0 75%, #E8E8E8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: 0,
            textShadow: 'none',
            filter: 'drop-shadow(0 0 40px rgba(192,192,192,0.4)) drop-shadow(0 0 80px rgba(192,192,192,0.2))',
            whiteSpace: 'nowrap',
          }}
        >
          {t.hero.title1} {t.hero.title2}
        </h1>

        <div
          ref={dividerRef}
          style={{
            width: 'clamp(120px, 20vw, 280px)',
            height: '1px',
            marginTop: '2.5rem',
            marginBottom: '2rem',
            background: 'linear-gradient(90deg, #C0C0C0, rgba(192,192,192,0.2))',
            opacity: 0,
            boxShadow: '0 0 12px rgba(192,192,192,0.3)',
          }}
        />

        <div ref={subtitleRef} style={{ opacity: 0 }}>
          <p
            className="y2k-hero-body-copy"
            style={{
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(242,242,242,0.45)',
            marginBottom: '0.75rem',
            maxWidth: 'min(38rem, 92vw)',
            lineHeight: 1.75,
            whiteSpace: 'pre-wrap',
          }}
          >
            {t.hero.subtitle}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.15em',
              color: 'rgba(192,192,192,0.5)',
            }}>
              15 {t.hero.artifacts}
            </span>
            <span style={{ width: '1px', height: '10px', background: 'rgba(242,242,242,0.15)' }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.15em',
              color: 'rgba(242,242,242,0.25)',
            }}>
              {t.hero.limited}
            </span>
            <span style={{ width: '1px', height: '10px', background: 'rgba(242,242,242,0.15)' }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.15em',
              color: 'rgba(242,242,242,0.25)',
            }}>
              {t.hero.season}
            </span>
          </div>
        </div>

        <div ref={ctaBlockRef} style={{ marginTop: '2.25rem', opacity: 0 }}>
          <div ref={ctaMagneticRef} className="inline-block will-change-transform">
            <button
              type="button"
              onClick={() => {
                document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border border-[rgba(192,192,192,0.55)] bg-[rgba(192,192,192,0.1)] px-8 py-3 uppercase tracking-[0.28em] text-chrome transition-colors hover:border-[#C0C0C0] hover:bg-[rgba(192,192,192,0.18)]"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem' }}
            >
              {t.hero.shopCta}
            </button>
          </div>
          <p
            className="mt-3 max-w-md text-chrome opacity-50"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '0.14em', lineHeight: 1.65 }}
          >
            {t.hero.ctaTrust}
          </p>
        </div>
        </div>

        <div
          ref={scrollRef}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
          style={{ opacity: 0 }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            letterSpacing: '0.3em',
            color: 'rgba(242,242,242,0.25)',
            textTransform: 'uppercase',
          }}>
            {t.hero.scroll}
          </span>
          <div style={{
            width: '1px',
            height: '48px',
            background: 'linear-gradient(to bottom, rgba(192,192,192,0.5), transparent)',
            animation: reducedMotion ? 'none' : 'pulse 2.4s ease-in-out infinite',
          }} />
        </div>

        <div className="pointer-events-none absolute bottom-10 left-8 md:left-16" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5rem',
          letterSpacing: '0.1em',
          color: 'rgba(242,242,242,0.15)',
          lineHeight: 1.8,
        }}>
          <div>{t.hero.coords}</div>
          <div>{t.hero.district}</div>
        </div>

        <div className="pointer-events-none absolute bottom-10 right-8 text-right md:right-16" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5rem',
          letterSpacing: '0.1em',
          color: 'rgba(242,242,242,0.15)',
          lineHeight: 1.8,
        }}>
          <div>{t.hero.rights}</div>
          <div>{t.hero.allRights}</div>
        </div>
      </div>
    </section>
  );
}
