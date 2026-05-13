'use client';
import { useLocale } from '~/lib/LocaleContext';

export function TrustBar() {
  const { t } = useLocale();

  return (
    <section
      className="bg-void"
      style={{
        borderTop: '0.5px solid rgba(242,242,242,0.05)',
        padding: '80px 0 100px',
      }}
    >
      <div className="px-8 md:px-16 lg:px-24">
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.35em',
          color: 'rgba(255,18,147,0.5)',
          textTransform: 'uppercase',
          marginBottom: '4rem',
        }}>
          {t.trust.eyebrow}
        </p>

        <div
          className="trust-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            background: 'rgba(242,242,242,0.04)',
          }}
        >          {t.trust.pillars.map((p, i) => (
            <div
              key={i}
              style={{
                background: '#050505',
                padding: '2.5rem 2rem',
                position: 'relative',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #c9a84c, #ff1293, #6ecbff)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                opacity: 0.85,
                marginBottom: '1.5rem',
                letterSpacing: '0.1em',
                filter: 'drop-shadow(0 0 8px rgba(255,18,147,0.25))',
              }}>
                {p.icon}
              </div>

              <h3 style={{
                fontFamily: '"Monument Extended", "Helvetica Neue", "Arial Black", sans-serif',
                fontWeight: 800,
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#F2F2F2',
                marginBottom: '1rem',
                lineHeight: 1.3,
              }}>
                {p.title}
              </h3>

              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                lineHeight: 1.8,
                letterSpacing: '0.04em',
                color: 'rgba(168,168,168,0.55)',
              }}>
                {p.body}
              </p>

              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '2rem',
                right: '2rem',
                height: '1px',
                background: i === 0
                  ? 'linear-gradient(90deg, #ff1293, #c9a84c, #6ecbff, transparent)'
                  : 'rgba(242,242,242,0.04)',
              }} />
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.52rem',
            letterSpacing: '0.2em',
            color: 'rgba(242,242,242,0.15)',
            textTransform: 'uppercase',
          }}>
            {t.trust.footer}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}>
            {['TOKYO', 'PARIS', 'NEW YORK', 'SEOUL'].map((city) => (
              <span key={city} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.48rem',
                letterSpacing: '0.15em',
                color: 'rgba(110,203,255,0.35)',
                textTransform: 'uppercase',
              }}>
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
