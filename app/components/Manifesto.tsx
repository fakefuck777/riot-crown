'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useLocale } from '~/lib/LocaleContext';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';

export function Manifesto() {
  const { t } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const linesRef   = useRef<(HTMLDivElement | null)[]>([]);
  const rulerRef   = useRef<HTMLDivElement>(null);
  const played     = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const play = () => {
      if (played.current) return;
      played.current = true;

      if (reducedMotion) {
        linesRef.current.forEach(el => {
          if (el) gsap.set(el, { opacity: 1, y: 0, skewY: 0 });
        });
        if (rulerRef.current) gsap.set(rulerRef.current, { opacity: 1, scaleX: 1 });
        return;
      }

      const tl = gsap.timeline();
      linesRef.current.forEach((el, i) => {
        if (!el) return;
        const ease = i === 1 ? 'expo.out' : 'power4.out';
        tl.fromTo(el,
          { opacity: 0, y: 28, skewY: 1.5 },
          { opacity: 1, y: 0, skewY: 0, duration: i === 1 ? 1.05 : 1.1, ease },
          i === 0 ? 0 : '-=0.65'
        );
      });
      if (rulerRef.current) {
        tl.fromTo(rulerRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.9, ease: 'power3.out', transformOrigin: 'left center' },
          '-=0.5'
        );
      }
    };

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) play(); },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
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
        borderTop: '0.5px solid rgba(201,168,76,0.12)',
        padding: '64px 0 52px',
        overflow: 'hidden',
      }}
    >
      <div className="px-8 md:px-16 lg:px-24">
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.35em',
          color: 'rgba(201,168,76,0.5)',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}>
          {t.manifesto.eyebrow}
        </p>

        <div style={{ marginBottom: '2rem', maxWidth: 'min(100%, 40rem)' }}>
          {lines.map((line, i) => (
            <div
              key={i}
              ref={el => { linesRef.current[i] = el; }}
              style={{
                fontFamily: '"Monument Extended", "Helvetica Neue", "Arial Black", sans-serif',
                fontWeight: 900,
                fontSize: i === 0
                  ? 'clamp(1.55rem, 3.6vw, 3rem)'
                  : 'clamp(1.45rem, 3.2vw, 2.65rem)',
                lineHeight: 1.12,
                letterSpacing: i === 0 ? '-0.02em' : '-0.015em',
                textTransform: 'uppercase',
                color: line.accent ? '#C9A84C' : '#F2F2F2',
                opacity: 0,
                textShadow: line.accent
                  ? '0 0 40px rgba(201,168,76,0.18)'
                  : '0 0 48px rgba(242,242,242,0.05)',
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
            background: 'linear-gradient(90deg, #FF1293, #C9A84C, #F2F2F2, #C9A84C, rgba(201,168,76,0.05))',
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
          <div style={{ width: '40px', height: '1px', background: 'rgba(201,168,76,0.2)' }} />
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
              color: 'rgba(201,168,76,0.55)',
              textDecoration: 'none',
              borderBottom: '0.5px solid rgba(201,168,76,0.25)',
              paddingBottom: '0.2rem',
              display: 'inline-block',
              transition: 'color 0.2s ease, border-color 0.2s ease',
            }}
            onMouseEnter={(ev) => {
              ev.currentTarget.style.color = 'rgba(201,168,76,0.95)';
              ev.currentTarget.style.borderBottomColor = 'rgba(201,168,76,0.55)';
            }}
            onMouseLeave={(ev) => {
              ev.currentTarget.style.color = 'rgba(201,168,76,0.55)';
              ev.currentTarget.style.borderBottomColor = 'rgba(201,168,76,0.25)';
            }}
          >
            {t.manifesto.toCollection}
          </a>
        </div>
      </div>
    </section>
  );
}
