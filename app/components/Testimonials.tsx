'use client';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useLocale } from '~/lib/LocaleContext';

const QUOTES = [
  { text: '穿上它的那一刻，我不再需要解释自己。',       origin: '匿名买家 — 东京',    lang: 'ZH' },
  { text: 'This is not jewelry. This is a declaration.', origin: 'Anonymous — London', lang: 'EN' },
  { text: 'Je ne l\'enlève plus. C\'est devenu ma peau.', origin: 'Anonyme — Paris',   lang: 'FR' },
  { text: '手に取った瞬間、これが最後の一点だと確信した。', origin: '匿名 — 大阪',      lang: 'JP' },
  { text: 'Not a purchase. An initiation.',              origin: 'Anonymous — New York', lang: 'EN' },
  { text: '이건 액세서리가 아니다. 선언이다.',           origin: '익명 — 서울',        lang: 'KR' },
];

export function Testimonials() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const itemsRef   = useRef<(HTMLDivElement | null)[]>([]);
  const played     = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const play = () => {
      if (played.current) return;
      played.current = true;

      itemsRef.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: i * 0.1 }
        );
      });
    };

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) play(); },
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

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
          color: 'rgba(201,168,76,0.45)',
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
                color: 'rgba(201,168,76,0.12)',
                marginBottom: '1.2rem',
                userSelect: 'none',
              }}>
                "
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
                background: 'rgba(201,168,76,0.3)',
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
