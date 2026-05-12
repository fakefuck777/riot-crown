'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useLocale } from '~/lib/LocaleContext';
import { LOCALES, type Locale } from '~/lib/i18n';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
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

    if (reducedMotion) {
      setLocale(next);
      return;
    }

    const el = displayRef.current;
    if (!el) { setLocale(next); return; }

    // Matrix scroll animation
    gsap.timeline()
      .to(el, { y: -14, opacity: 0, duration: 0.18, ease: 'power2.in' })
      .call(() => setLocale(next))
      .set(el, { y: 14, opacity: 0 })
      .to(el, { y: 0, opacity: 1, duration: 0.22, ease: 'power3.out' });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={toggleDropdown}
        aria-label={`Language: ${locale}. Click to change`}
        aria-expanded={dropdownOpen}
        className="text-nav text-chrome hover:text-titanium transition-colors duration-200"
        style={{
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.16em',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px 2px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <span ref={displayRef} style={{ display: 'inline-block' }}>{locale}</span>
        <span style={{ opacity: 0.4, fontSize: '0.5rem', lineHeight: 1 }}>▾</span>
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
          border: '0.5px solid rgba(242,242,242,0.1)',
          padding: '6px 0',
          minWidth: '64px',
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
      className="text-nav text-chrome hover:text-gold transition-colors duration-150 w-full text-left"
      style={{
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.14em',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px 16px',
        opacity: 0,
        display: 'block',
      }}
    >
      {locale}
    </button>
  );
}
