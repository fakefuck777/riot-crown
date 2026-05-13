'use client';
import { useLocale } from '~/lib/LocaleContext';

export function Footer() {
  const { t } = useLocale();

  return (
    <footer style={{
      background: 'var(--void-pit)',
      borderTop: '0.5px solid rgba(182,102,255,0.12)',
      padding: '80px 0 48px',
    }}>
      <div className="px-8 md:px-16 lg:px-24">

        <div
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '4rem',
            marginBottom: '5rem',
          }}
        >
          {/* Brand column */}
          <div>
            <h2 style={{
              fontFamily: 'var(--font-y2k-display), "Monument Extended", "Helvetica Neue", "Arial Black", sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              background: 'linear-gradient(100deg, #f2f2f2 0%, #c9a84c 38%, #ff1293 72%, #6ecbff 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 0.9,
              marginBottom: '1.5rem',
              filter: 'drop-shadow(0 0 24px rgba(255,18,147,0.15))',
            }}>
              RIOT<br />CROWN
            </h2>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              lineHeight: 1.9,
              letterSpacing: '0.04em',
              color: 'rgba(168,168,168,0.4)',
              maxWidth: '280px',
              whiteSpace: 'pre-line',
            }}>
              {t.footer.tagline}
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }} aria-hidden="true">
              {[
                { label: 'IG' },
                { label: 'TW' },
                { label: 'TK' },
              ].map((s) => (
                <span
                  key={s.label}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.52rem',
                    letterSpacing: '0.15em',
                    color: 'rgba(182,102,255,0.45)',
                    cursor: 'default',
                    transition: 'color 0.2s, text-shadow 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,18,147,0.85)';
                    (e.currentTarget as HTMLElement).style.textShadow = '0 0 12px rgba(110,203,255,0.5)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(182,102,255,0.45)';
                    (e.currentTarget as HTMLElement).style.textShadow = 'none';
                  }}
                >
                  {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {t.footer.columns.map((col) => (
            <div key={col.heading}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.3em',
                color: 'rgba(255,18,147,0.55)',
                textTransform: 'uppercase',
                marginBottom: '1.5rem',
              }}>
                {col.heading}
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.58rem',
                      letterSpacing: '0.06em',
                      color: 'rgba(242,242,242,0.62)',
                      cursor: 'default',
                      transition: 'color 0.2s',
                    }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.color = 'rgba(242,242,242,0.92)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.color = 'rgba(242,242,242,0.62)';
                      }}
                    >
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{
          height: '1px',
          background: 'rgba(242,242,242,0.05)',
          marginBottom: '2rem',
        }} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.48rem',
            letterSpacing: '0.12em',
            color: 'rgba(200,206,220,0.18)',
            textTransform: 'uppercase',
          }}>
            {t.footer.copyright}
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.48rem',
            letterSpacing: '0.12em',
            color: 'rgba(110,203,255,0.28)',
            textTransform: 'uppercase',
          }}>
            {t.footer.edition}
          </p>
        </div>
      </div>
    </footer>
  );
}
