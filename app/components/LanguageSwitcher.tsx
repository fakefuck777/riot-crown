'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useLocation, useNavigate } from '@remix-run/react';
import { useLocale } from '~/lib/LocaleContext';
import { LOCALES, type Locale } from '~/lib/i18n';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';
import { stripLeadingLocaleFromPathname, withLocalePath } from '~/lib/localePath';

const LANGUAGE_NAMES: Record<Locale, string> = {
  EN: 'English',
  ZH: '中文',
  JP: '日本語',
  KR: '한국어',
  FR: 'Français',
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const displayRef   = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef  = useRef<HTMLDivElement>(null);
  const isOpenRef    = useRef(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Toggle dropdown visibility imperatively to avoid re-render closing it
  const openDropdown = () => {
    const el = dropdownRef.current;
    if (!el || isOpenRef.current) return;
    isOpenRef.current = true;
    setDropdownOpen(true);
    el.style.display = 'block';
    gsap.fromTo(el,
      { opacity: 0, y: -6 },
      { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out' }
    );
  };

  const closeDropdown = () => {
    const el = dropdownRef.current;
    if (!el || !isOpenRef.current) return;
    isOpenRef.current = false;
    gsap.to(el, {
      opacity: 0, y: -4, duration: 0.14, ease: 'power2.in',
      onComplete: () => {
        el.style.display = 'none';
        setDropdownOpen(false);
      },
    });
  };

  const toggleDropdown = () => {
    isOpenRef.current ? closeDropdown() : openDropdown();
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    window.addEventListener('mousedown', handler, true);
    return () => window.removeEventListener('mousedown', handler, true);
  }, []);

  const switchTo = (next: Locale) => {
    closeDropdown();
    if (next === locale) return;

    const { restPath } = stripLeadingLocaleFromPathname(location.pathname);
    const nextPath = `${withLocalePath(next, restPath)}${location.search}${location.hash}`;

    const applyNavigate = () => {
      setLocale(next);
      navigate(nextPath);
    };

    if (reducedMotion) {
      applyNavigate();
      return;
    }

    const el = displayRef.current;
    if (!el) {
      applyNavigate();
      return;
    }

    // Matrix scroll animation
    gsap.timeline()
      .to(el, { y: -14, opacity: 0, duration: 0.18, ease: 'power2.in' })
      .call(applyNavigate)
      .set(el, { y: 14, opacity: 0 })
      .to(el, { y: 0, opacity: 1, duration: 0.22, ease: 'power3.out' });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={toggleDropdown}
        aria-label={`Language: ${LANGUAGE_NAMES[locale]}. Click to change`}
        aria-expanded={dropdownOpen}
        className="transition-all duration-300"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontWeight: 500,
          background: 'rgba(192,192,192,0.08)',
          border: '1px solid rgba(192,192,192,0.35)',
          cursor: 'pointer',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          borderRadius: '4px',
          color: '#C0C0C0',
          boxShadow: '0 0 12px rgba(192,192,192,0.15)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'rgba(192,192,192,0.15)';
          el.style.boxShadow = '0 0 24px rgba(192,192,192,0.35)';
          el.style.borderColor = 'rgba(192,192,192,0.65)';
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = 'rgba(192,192,192,0.08)';
          el.style.boxShadow = '0 0 12px rgba(192,192,192,0.15)';
          el.style.borderColor = 'rgba(192,192,192,0.35)';
        }}
      >
        <span ref={displayRef} style={{ display: 'inline-block' }}>{LANGUAGE_NAMES[locale]}</span>
        <span style={{ opacity: 0.6, fontSize: '0.5rem', lineHeight: 1 }}>▾</span>
      </button>

      {/* Dropdown — fixed to escape nav overflow:hidden */}
      <div
        ref={dropdownRef}
        style={{
          display: 'none',
          position: 'fixed',
          top: '72px',
          right: '64px',
          zIndex: 9999,
          background: 'rgba(5,5,5,0.98)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(192,192,192,0.35)',
          borderRadius: '6px',
          padding: '8px 0',
          minWidth: '140px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(192,192,192,0.2)',
        }}
      >
        {LOCALES.filter(l => l !== locale).map((l, i) => (
          <DropdownItem key={l} locale={l} index={i} onSelect={switchTo} />
        ))}
      </div>
    </div>
  );
}

function DropdownItem({
  locale, index, onSelect,
}: {
  locale: Locale;
  index: number;
  onSelect: (l: Locale) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.18, delay: index * 0.04, ease: 'power2.out' }
    );
  }, [index]);

  return (
    <button
      ref={ref}
      onClick={() => onSelect(locale)}
      className="transition-colors duration-150 w-full text-left"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        letterSpacing: '0.08em',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '10px 16px',
        opacity: 0,
        display: 'block',
        color: 'rgba(242,242,242,0.82)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = '#C0C0C0';
        el.style.background = 'rgba(192,192,192,0.08)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.color = 'rgba(242,242,242,0.82)';
        el.style.background = 'none';
      }}
    >
      {LANGUAGE_NAMES[locale]}
    </button>
  );
}
