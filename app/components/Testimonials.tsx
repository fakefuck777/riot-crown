'use client';
import { useRef, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { useLocale } from '~/lib/LocaleContext';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';
import { observeRevealOnce } from '~/lib/motionReveal';

const QUOTES = [
  { text: '不是首飾，是訊號。亮，但不討好。', origin: '匿名買家 — 多城', lang: 'ZH' },
  { text: 'Not demure — iconic. Chrome on my pulse, zero apologies.', origin: 'Anonymous — London', lang: 'EN' },
  { text: 'Pas sage — iconique. Du chrome au poignet, zéro excuse.', origin: 'Anonyme — Paris', lang: 'FR' },
  { text: '控えめじゃない——iconic。脈にクローム、言い訳なし。', origin: '匿名 — 大阪', lang: 'JP' },
  { text: 'Early-2000s energy in a velvet box. Still hits at 3am.', origin: 'Anonymous — New York', lang: 'EN' },
  { text: '이건 악세서리가 아니다 — 시그널이다.', origin: '익명 — 서울', lang: 'KR' },
];

export function Testimonials() {
  const { t } = useLocale();
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef   = useRef<(HTMLDivElement | null)[]>([]);
  const played     = useRef(false);

  useLayoutEffect(() => {
    if (!reducedMotion) return;
    if (played.current) return;
    played.current = true;
    itemsRef.current.forEach(el => {
      if (el) gsap.set(el, { opacity: 1, y: 0 });
    });
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    const play = () => {
      if (played.current) return;
      played.current = true;
      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.1 },
        );
      });
    };

    return observeRevealOnce(section, play, { threshold: 0.08, failSafeMs: 4000 });
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="section-void-pit"
      style={{
        borderTop: '0.5px solid rgba(242,242,242,0.05)',
        padding: '100px 0 80px',
        overflow: 'hidden',
      }}
    >
      <div className="px-8 md:px-16 lg:px-24">

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.52rem',
          letterSpacing: '0.35em',
          color: 'rgba(182,102,255,0.5)',
          textTransform: 'uppercase',
          marginBottom: '4rem',
        }}>
          {t.testimonials.eyebrow}
        </p>

        <div         style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: 'rgba(242,242,242,0.04)',
        }}
          className="testimonials-grid"
        >
          {QUOTES.map((q, i) => (
            <div
              key={i}
              ref={el => { itemsRef.current[i] = el; }}
              style={{
                background: '#030303',
                padding: '2.5rem 2rem',
                opacity: 0,
                position: 'relative',
              }}
            >
              <div style={{
                fontFamily: '"Monument Extended", "Helvetica Neue", sans-serif',
                fontSize: '3rem',
                lineHeight: 0.6,
                background: 'linear-gradient(135deg, rgba(255,18,147,0.35), rgba(201,168,76,0.25))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                marginBottom: '1.2rem',
                userSelect: 'none',
              }}>
                {'\u201c'}
              </div>

              <p style={{
                fontFamily: q.lang === 'EN' || q.lang === 'FR'
                  ? '"Monument Extended", "Helvetica Neue", sans-serif'
                  : 'var(--font-mono)',
                fontWeight: q.lang === 'EN' || q.lang === 'FR' ? 400 : 300,
                fontSize: q.lang === 'ZH' || q.lang === 'JP' || q.lang === 'KR'
                  ? '0.85rem'
                  : '0.78rem',
                lineHeight: 1.65,
                letterSpacing: q.lang === 'EN' || q.lang === 'FR' ? '0.04em' : '0.06em',
                color: 'rgba(242,242,242,0.75)',
                marginBottom: '1.8rem',
              }}>
                {q.text}
              </p>

              <div style={{
                width: '24px',
                height: '1px',
                background: 'linear-gradient(90deg, #ff1293, #6ecbff)',
                marginBottom: '0.8rem',
              }} />

              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.48rem',
                letterSpacing: '0.2em',
                color: 'rgba(168,168,168,0.35)',
                textTransform: 'uppercase',
              }}>
                {q.origin}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '1px',
          background: 'rgba(242,242,242,0.04)',
          padding: '1.2rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.48rem',
            letterSpacing: '0.25em',
            color: 'rgba(201,168,76,0.3)',
            textTransform: 'uppercase',
          }}>
            {t.testimonials.footer1}
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.48rem',
            letterSpacing: '0.15em',
            color: 'rgba(242,242,242,0.12)',
            textTransform: 'uppercase',
          }}>
            {t.testimonials.footer2}
          </p>
        </div>

      </div>
    </section>
  );
}
