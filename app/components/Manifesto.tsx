'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useLocale } from '~/lib/LocaleContext';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';
import { observeRevealOnce } from '~/lib/motionReveal';

export function Manifesto() {
  const { t } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef   = useRef<(HTMLDivElement | null)[]>([]);
  const rulerRef   = useRef<HTMLDivElement>(null);
  const played     = useRef(false);

  useEffect(() => {
    if (!reducedMotion) return;
    if (played.current) return;
    played.current = true;
    linesRef.current.forEach(el => {
      if (el) gsap.set(el, { opacity: 1, y: 0, skewY: 0 });
    });
    if (rulerRef.current) gsap.set(rulerRef.current, { opacity: 1, scaleX: 1 });
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const play = () => {
      if (played.current) return;
      played.current = true;

      const tl = gsap.timeline();
      linesRef.current.forEach((el, i) => {
        if (!el) return;
        const ease = i === 1 ? 'expo.out' : 'power4.out';
        tl.fromTo(el,
          { opacity: 0, y: 28, skewY: 1.5 },
          { opacity: 1, y: 0, skewY: 0, duration: i === 1 ? 1.05 : 1.1, ease },
          i === 0 ? 0 : '-=0.65',
        );
      });
      if (rulerRef.current) {
        tl.fromTo(rulerRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.9, ease: 'power3.out', transformOrigin: 'left center' },
          '-=0.5',
        );
      }
    };

    return observeRevealOnce(section, play, { threshold: 0.12, failSafeMs: 4000 });
  }, [reducedMotion]);

  const lines = [
    { text: t.manifesto.line1, accent: false },
    { text: t.manifesto.line2, accent: true  },
  ];

  return (
    <section
      id="manifesto"
      ref={sectionRef}
      className="section-manifesto-aura"
      style={{
        borderTop: '1px solid rgba(192,192,192,0.18)',
        borderBottom: '1px solid rgba(182,102,255,0.12)',
        padding: '72px 0 64px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 15% 50%, rgba(255,18,147,0.06) 0%, transparent 35%), radial-gradient(circle at 85% 50%, rgba(110,203,255,0.06) 0%, transparent 35%)',
          pointerEvents: 'none',
        }}
      />
      <div className="px-8 md:px-16 lg:px-24 relative z-10">
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          letterSpacing: '0.35em',
          color: '#C0C0C0',
          textTransform: 'uppercase',
          marginBottom: '2rem',
          opacity: 0.85,
          fontWeight: 500,
        }}>
          {t.manifesto.eyebrow}
        </p>

        <div style={{ marginBottom: '2.5rem', maxWidth: 'min(100%, 48rem)' }}>
          {lines.map((line, i) => (
            <div
              key={i}
              ref={el => { linesRef.current[i] = el; }}
              style={{
                fontFamily: line.accent
                  ? 'var(--font-y2k-display), "Monument Extended", "Helvetica Neue", "Arial Black", sans-serif'
                  : '"Monument Extended", "Helvetica Neue", "Arial Black", sans-serif',
                fontWeight: 900,
                fontSize: i === 0
                  ? 'clamp(1.75rem, 4vw, 3.35rem)'
                  : 'clamp(1.65rem, 3.6vw, 3rem)',
                lineHeight: 1.08,
                letterSpacing: i === 0 ? '-0.02em' : '-0.015em',
                textTransform: 'uppercase',
                ...(line.accent
                  ? {
                      background: 'linear-gradient(105deg, #ff1293 0%, #c9a84c 42%, #6ecbff 88%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                      textShadow: 'none',
                      filter: 'drop-shadow(0 0 32px rgba(255,18,147,0.3))',
                    }
                  : {
                      color: '#F2F2F2',
                      textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 0 48px rgba(242,242,242,0.08)',
                    }),
                opacity: 0,
              }}
            >
              {line.text}
            </div>
          ))}
        </div>

        <div
          ref={rulerRef}
          style={{ display: 'flex', alignItems: 'center', gap: '2rem', opacity: 0 }}
        >
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, #FF1293, #C0C0C0, #F2F2F2, #C0C0C0, rgba(192,192,192,0.05))',
            backgroundSize: '300% 100%',
            animation: reducedMotion ? 'none' : 'iridescent 4s ease infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            letterSpacing: '0.25em',
            color: 'rgba(168,168,168,0.35)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            {t.manifesto.season}
          </span>
          <div style={{ width: '40px', height: '1px', background: 'rgba(192,192,192,0.2)' }} />
        </div>

        <div style={{ marginTop: '1.75rem', maxWidth: 'min(100%, 40rem)' }}>
          <a
            href="#collection"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.52rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(110,203,255,0.65)',
              textDecoration: 'none',
              borderBottom: '0.5px solid rgba(255,18,147,0.35)',
              paddingBottom: '0.2rem',
              display: 'inline-block',
              transition: 'color 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(ev) => {
              ev.currentTarget.style.color = 'rgba(255,18,147,0.95)';
              ev.currentTarget.style.borderBottomColor = 'rgba(110,203,255,0.65)';
            }}
            onMouseLeave={(ev) => {
              ev.currentTarget.style.color = 'rgba(110,203,255,0.65)';
              ev.currentTarget.style.borderBottomColor = 'rgba(255,18,147,0.35)';
            }}
          >
            {t.manifesto.toCollection}
          </a>
        </div>
      </div>
    </section>
  );
}
