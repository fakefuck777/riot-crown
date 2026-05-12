'use client';
import { Link } from '@remix-run/react';
import { useLocale } from '~/lib/LocaleContext';
import { LEGAL_PAGE_IDS, getLegalDoc } from '~/lib/legalContent';

export function Footer() {
  const { t, locale } = useLocale();

  return (
    <footer style={{
      background: 'var(--void-pit)',
      borderTop: '0.5px solid rgba(201,168,76,0.08)',
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
              fontFamily: '"Monument Extended", "Helvetica Neue", "Arial Black", sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              color: '#F2F2F2',
              lineHeight: 0.9,
              marginBottom: '1.5rem',
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

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
              {[
                { label: 'IG', aria: 'Instagram' },
                { label: 'TW', aria: 'Twitter / X' },
                { label: 'TK', aria: 'TikTok' },
              ].map((s) => (
                <span
                  key={s.label}
                  role="link"
                  tabIndex={0}
                  aria-label={`Riot Crown on ${s.aria}`}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.52rem',
                    letterSpacing: '0.15em',
                    color: 'rgba(201,168,76,0.35)',
                    cursor: 'pointer',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(201,168,76,0.8)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(201,168,76,0.35)'; }}
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
                color: 'rgba(201,168,76,0.5)',
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
                      color: 'rgba(242,242,242,0.3)',
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                    }}>
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal & policies */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.25rem 2rem',
            marginBottom: '2.5rem',
            paddingTop: '0.5rem',
            borderTop: '0.5px solid rgba(242,242,242,0.06)',
          }}
        >
          {LEGAL_PAGE_IDS.map((page) => {
            const doc = getLegalDoc(page, locale);
            return (
              <Link
                key={page}
                to={`/legal/${page}`}
                prefetch="intent"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.52rem',
                  letterSpacing: '0.18em',
                  color: 'rgba(168,168,168,0.45)',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}
              >
                {doc.title}
              </Link>
            );
          })}
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
            color: 'rgba(242,242,242,0.12)',
            textTransform: 'uppercase',
          }}>
            {t.footer.copyright}
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.48rem',
            letterSpacing: '0.12em',
            color: 'rgba(201,168,76,0.15)',
            textTransform: 'uppercase',
          }}>
            {t.footer.edition}
          </p>
        </div>
      </div>
    </footer>
  );
}
