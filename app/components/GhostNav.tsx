'use client';
import { useRef, useCallback, useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { gsap } from 'gsap';
import { LanguageSwitcher } from '~/components/LanguageSwitcher';
import { useLocale } from '~/lib/LocaleContext';
import { usePrefersReducedMotion } from '~/hooks/usePrefersReducedMotion';
import { withLocalePath } from '~/lib/localePath';

const HOME_SCROLL_IDS = new Set(['hero', 'manifesto', 'collection', 'scarcity']);

const navGold   = (a: number) => `rgba(192,192,192,${a})`;
const navChrome = (a: number) => `rgba(242,242,242,${a})`;
const navVoid   = (a: number) => `rgba(5,5,5,${a})`;

/** Shared nav chrome — keeps seam / rails / mobile line in one visual key */
const NAV = {
  gold:   navGold,
  chrome: navChrome,
  void:   navVoid,
  seam: [
    `linear-gradient(90deg, ${navGold(0.26)} 0%, ${navChrome(0.09)} 12%, ${navGold(0.18)} 24%, ${navChrome(0.24)} 50%, ${navGold(0.18)} 76%, ${navChrome(0.09)} 88%, ${navGold(0.26)} 100%)`,
    `linear-gradient(90deg, ${navVoid(0)} 0%, ${navVoid(0.18)} 50%, ${navVoid(0)} 100%)`,
  ].join(','),
  mobileHairline: `linear-gradient(90deg, ${navGold(0.22)} 0%, ${navChrome(0.1)} 22%, ${navGold(0.32)} 50%, ${navChrome(0.1)} 78%, ${navGold(0.22)} 100%)`,
  railTop:    `linear-gradient(90deg, ${navGold(0.22)} 0%, ${navChrome(0.06)} 24%, ${navGold(0.32)} 50%, ${navChrome(0.06)} 76%, ${navGold(0.22)} 100%)`,
  railBottom: `linear-gradient(90deg, ${navGold(0.2)} 0%, ${navChrome(0.12)} 50%, ${navGold(0.2)} 100%)`,
  sheen: `radial-gradient(120% 160% at 50% -30%, ${navGold(0.09)} 0%, transparent 58%)`,
  glitch: `linear-gradient(90deg, rgba(255,0,88,0.1) 0%, rgba(255,70,110,0.07) 20%, rgba(200,185,255,0.045) 45%, rgba(0,230,255,0.065) 70%, rgba(0,200,255,0.1) 100%)`,
  menuBottom: `linear-gradient(90deg, rgba(255,17,147,0.22) 0%, ${navGold(0.45)} 24%, ${navChrome(0.28)} 50%, ${navGold(0.45)} 76%, rgba(255,17,147,0.22) 100%)`,
} as const;

export function GhostNav({ onCartOpen, cartCount = 0 }: { onCartOpen: () => void; cartCount?: number }) {
  const { t, locale } = useLocale();
  const navigate = useNavigate();
  const reducedMotion = usePrefersReducedMotion();
  const navRef        = useRef<HTMLElement>(null);
  const contentRef    = useRef<HTMLDivElement>(null);
  const glitchRef     = useRef<HTMLDivElement>(null);
  const seamRef       = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const tlRef         = useRef<gsap.core.Timeline | null>(null);
  const [expanded,    setExpanded]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [showScrollFab, setShowScrollFab] = useState(false);
  const [assistOpen, setAssistOpen]   = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Keeps imperative close (backdrop / Escape) in sync — avoids stale `mobileOpen` in callbacks. */
  const mobileOpenRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const h = window.innerHeight || 1;
      const past = y > Math.min(160, h * 0.2);
      setShowScrollFab(past);
      if (!past) setAssistOpen(false);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!assistOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAssistOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [assistOpen]);
  useEffect(() => {
    if (mobileOpen) setAssistOpen(false);
  }, [mobileOpen]);

  useEffect(() => {
    mobileOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  const expand = useCallback(() => {
    if (collapseTimer.current) { clearTimeout(collapseTimer.current); collapseTimer.current = null; }
    if (expanded) return;
    setExpanded(true);

    const nav = navRef.current, content = contentRef.current;
    const glitch = glitchRef.current, seam = seamRef.current;
    if (!nav || !content || !glitch || !seam) return;

    tlRef.current?.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    if (reducedMotion) {
      tl.set(nav, { height: 72 })
        .set(content, { opacity: 1, skewX: 0, y: 0, clearProps: 'transform' })
        .set(glitch, { opacity: 0, scaleY: 1 })
        .set(seam, { opacity: 0 });
      return;
    }

    tl.fromTo(nav, { height: 1 }, { height: 72, duration: 0.26, ease: 'power3.out' });

    tl.fromTo(glitch,
      { opacity: 0, scaleY: 1 },
      { opacity: 0.72, scaleY: 1.015, duration: 0.045, ease: 'power1.out' },
      0.05,
    )
      .to(glitch, { opacity: 0, scaleY: 1, duration: 0.11, ease: 'power2.inOut' });

    tl.fromTo(content,
      { opacity: 0, skewX: -1.2, y: -5 },
      { opacity: 1, skewX: 0, y: 0, duration: 0.38, ease: 'power4.out' },
      0.06,
    );

    tl.to(seam, { opacity: 0, duration: 0.26, ease: 'sine.out' }, 0.04);
  }, [expanded, reducedMotion]);

  const scheduleCollapse = useCallback(() => {
    collapseTimer.current = setTimeout(() => {
      setExpanded(false);
      const nav = navRef.current, content = contentRef.current, seam = seamRef.current;
      if (!nav || !content || !seam) return;
      tlRef.current?.kill();

      if (reducedMotion) {
        gsap.set(nav, { height: 1 });
        gsap.set(content, { opacity: 0 });
        gsap.set(seam, { opacity: 1 });
        return;
      }

      gsap.timeline()
        .to(content, { opacity: 0, y: -3, duration: 0.22, ease: 'power3.in' })
        .to(nav,     { height: 1,  duration: 0.28, ease: 'power3.inOut' }, '-=0.12')
        .to(seam,    { opacity: 1, duration: 0.32, ease: 'sine.in' }, '-=0.18');
    }, 300);
  }, [reducedMotion]);

  const cancelCollapse = useCallback(() => {
    if (collapseTimer.current) { clearTimeout(collapseTimer.current); collapseTimer.current = null; }
  }, []);

  const openMobileMenu = useCallback(() => {
    const menu = mobileMenuRef.current;
    if (!menu || mobileOpenRef.current) return;
    mobileOpenRef.current = true;
    setMobileOpen(true);
    gsap.set(menu, { display: 'flex' });
    if (reducedMotion) {
      gsap.set(menu, { opacity: 1, y: 0 });
      const links = menu.querySelectorAll<HTMLElement>('[data-nav-link]');
      gsap.set(links, { opacity: 1, x: 0, clearProps: 'transform' });
      return;
    }
    gsap.fromTo(menu,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.36, ease: 'power3.out' },
    );
    const links = menu.querySelectorAll<HTMLElement>('[data-nav-link]');
    gsap.fromTo(links,
      { opacity: 0, x: -12 },
      {
        opacity: 1,
        x: 0,
        duration: 0.34,
        stagger: 0.055,
        ease: 'power3.out',
        delay: 0.06,
        clearProps: 'transform',
      },
    );
  }, [reducedMotion]);

  const closeMobileMenu = useCallback(() => {
    const menu = mobileMenuRef.current;
    if (!menu || !mobileOpenRef.current) return;
    const links = menu.querySelectorAll<HTMLElement>('[data-nav-link]');
    gsap.killTweensOf(links);
    if (reducedMotion) {
      gsap.set(links, { clearProps: 'all' });
      gsap.set(menu, { display: 'none' });
      mobileOpenRef.current = false;
      setMobileOpen(false);
      return;
    }
    gsap.to(links, {
      opacity: 0,
      x: -8,
      duration: 0.14,
      stagger: { each: 0.03, from: 'end' },
      ease: 'power2.in',
    });
    gsap.to(menu, {
      opacity: 0,
      y: -6,
      duration: 0.22,
      ease: 'power2.in',
      delay: 0.04,
      onComplete: () => {
        gsap.set(menu, { display: 'none' });
        mobileOpenRef.current = false;
        setMobileOpen(false);
      },
    });
  }, [reducedMotion]);

  const toggleMobile = useCallback(() => {
    if (mobileOpenRef.current) closeMobileMenu();
    else openMobileMenu();
  }, [closeMobileMenu, openMobileMenu]);

  const scrollTo = useCallback((id: string) => {
    if (mobileOpenRef.current) closeMobileMenu();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setAssistOpen(false);
      return;
    }
    if (HOME_SCROLL_IDS.has(id)) {
      navigate({ pathname: withLocalePath(locale, '/'), hash: id });
      setAssistOpen(false);
    }
  }, [closeMobileMenu, navigate, locale]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen, closeMobileMenu]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && mobileOpen) {
        const menu = mobileMenuRef.current;
        if (menu) gsap.set(menu, { display: 'none' });
        mobileOpenRef.current = false;
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [mobileOpen]);

  const NAV_LINKS = [
    { label: t.nav.artifacts, id: 'collection' },
    { label: t.nav.archive,   id: 'manifesto' },
    { label: t.nav.ritual,    id: 'scarcity' },
    { label: t.nav.void,      id: 'hero' },
  ];

  return (
    <>
      <div
        ref={seamRef}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
        style={{
          height: '1px',
          background: NAV.seam,
        }}
      />

      <div
        className="pointer-events-none fixed left-0 right-0 z-50 md:hidden"
        style={{
          top: 'calc(52px + env(safe-area-inset-top, 0px))',
          height: '1px',
          background: NAV.mobileHairline,
          opacity: 0.55,
        }}
        aria-hidden
      />
      <div
        className="fixed top-0 left-0 right-0 z-40 hidden md:block"
        style={{ height: '52px' }}
        onMouseEnter={expand}
        onMouseLeave={scheduleCollapse}
      />

      {/* Mobile always-visible bar */}
      <div
        className={`fixed top-0 left-0 right-0 flex md:hidden items-center justify-between px-6 ${mobileOpen ? 'z-[70]' : 'z-50'}`}
        style={{
          minHeight: 'calc(52px + env(safe-area-inset-top, 0px))',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          background: 'rgba(5,5,5,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: 'none',
          boxShadow: `inset 0 1px 0 ${NAV.chrome(0.05)}, inset 0 -1px 0 ${NAV.gold(0.2)}`,
        }}
      >
        <button
          onClick={() => scrollTo('hero')}
          style={{
            fontFamily: '"Monument Extended", "Helvetica Neue", sans-serif',
            fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.25em',
            color: '#F2F2F2', background: 'none', border: 'none', cursor: 'pointer',
            padding: '6px 0',
          }}
        >
          {t.nav.logo}
        </button>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            flexShrink: 0,
            marginLeft: 'auto',
          }}
        >
          <button
            type="button"
            onClick={onCartOpen}
            aria-label={t.nav.cartOpenAria.replace('{n}', String(cartCount))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(4,4,4,0.35)',
              border: `1px solid ${navGold(0.28)}`,
              cursor: 'pointer',
              padding: '8px 8px',
              borderRadius: '4px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.56rem',
                letterSpacing: '0.1em',
                color: 'rgba(242,242,242,0.86)',
                whiteSpace: 'nowrap',
              }}
            >
              {t.nav.cart}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                color: '#C0C0C0',
              }}
            >
              [{cartCount.toString().padStart(2, '0')}]
            </span>
          </button>
          <div
            style={{ width: '1px', height: '16px', background: 'rgba(242,242,242,0.12)', flexShrink: 0 }}
            aria-hidden
          />
          <button
            type="button"
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-controls="ghost-mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'rgba(4,4,4,0.35)',
              border: `1px solid ${navGold(0.28)}`,
              cursor: 'pointer',
              padding: '6px 8px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '0.45rem',
              borderRadius: '4px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexShrink: 0 }}>
              <div style={{ width: '20px', height: '1px', background: mobileOpen ? '#C0C0C0' : '#F2F2F2', transition: 'background 0.22s ease, transform 0.34s cubic-bezier(0.22,1,0.36,1)', transform: mobileOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
              <div style={{ width: '20px', height: '1px', background: mobileOpen ? 'transparent' : '#F2F2F2', transition: 'background 0.22s ease, opacity 0.2s ease', opacity: mobileOpen ? 0 : 1 }} />
              <div style={{ width: '20px', height: '1px', background: mobileOpen ? '#C0C0C0' : '#F2F2F2', transition: 'background 0.22s ease, transform 0.34s cubic-bezier(0.22,1,0.36,1)', transform: mobileOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.56rem',
                letterSpacing: '0.14em',
                color: 'rgba(242,242,242,0.86)',
                whiteSpace: 'nowrap',
              }}
            >
              {t.nav.menuButton}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile full-screen menu — z below top bar so MENU / hamburger stays tappable to close */}
      <div
        id="ghost-mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menuButton}
        className="fixed inset-0 z-[60] flex flex-col md:hidden"
        style={{
          display: 'none',
        }}
      >
        <button
          type="button"
          className="absolute inset-0 z-0 cursor-default border-0 bg-transparent p-0"
          aria-label={t.nav.jumpMenuClose}
          onClick={closeMobileMenu}
        />
        <div
          className="relative z-10 flex min-h-0 flex-1 flex-col pointer-events-none"
          style={{
            background: `linear-gradient(185deg, ${NAV.gold(0.045)} 0%, transparent 18%), rgba(3,3,3,0.985)`,
            backdropFilter: 'blur(28px) saturate(0.45)',
            WebkitBackdropFilter: 'blur(28px) saturate(0.45)',
            paddingTop: 'calc(80px + env(safe-area-inset-top, 0px))',
            paddingLeft: '2rem',
            paddingRight: '2rem',
          }}
        >
        <div className="pointer-events-auto" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '3rem' }}>
          {NAV_LINKS.map(({ label, id }) => (
            <button
              data-nav-link
              key={label}
              onClick={() => scrollTo(id)}
              style={{
                fontFamily: '"Monument Extended", "Helvetica Neue", sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1.4rem, 6vw, 2rem)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'rgba(242,242,242,0.7)',
                background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left',
                padding: '0.6rem 0',
                borderBottom: '0.5px solid rgba(242,242,242,0.05)',
                transition: 'color 0.2s',
              }}
              onTouchStart={e => { (e.currentTarget as HTMLElement).style.color = '#C0C0C0'; }}
              onTouchEnd={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(242,242,242,0.7)'; }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="pointer-events-auto" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <LanguageSwitcher />
          <button
            onClick={() => { onCartOpen(); closeMobileMenu(); }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.2em',
              color: '#C0C0C0', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase',
              padding: '6px 0',
            }}
          >
            {t.nav.cart} [{cartCount.toString().padStart(2, '0')}]
          </button>
        </div>
        <div
          className="pointer-events-none"
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
            background: NAV.menuBottom,
            opacity: 0.44,
          }}
          aria-hidden
        />
        </div>
      </div>

      {/* Desktop only: a 1px-tall bar + backdrop-filter on mobile Safari has caused
          full-viewport blur artifacts; mobile uses the dedicated bar above. */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
        style={{
          height: '1px',
          background: 'rgba(5,5,5,0.93)',
          backdropFilter: expanded ? 'blur(28px) saturate(0.48)' : 'blur(24px) saturate(0.38)',
          WebkitBackdropFilter: expanded ? 'blur(28px) saturate(0.48)' : 'blur(24px) saturate(0.38)',
          borderBottom: 'none',
          overflow: 'visible',
          boxShadow: expanded
            ? '0 16px 44px -14px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)'
            : 'none',
          transition: 'box-shadow 0.38s cubic-bezier(0.22,1,0.36,1), backdrop-filter 0.4s ease',
        }}
        onMouseEnter={() => { cancelCollapse(); expand(); }}
        onMouseLeave={scheduleCollapse}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: NAV.sheen,
            opacity: expanded ? 1 : 0.65,
            transition: 'opacity 0.45s ease',
          }}
          aria-hidden
        />

        {/* Full-width glass rails */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px"
          style={{
            background: NAV.railTop,
            opacity: 0.48,
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-px"
          style={{
            background: NAV.railBottom,
            opacity: 0.55,
          }}
          aria-hidden
        />

        <div
          ref={glitchRef}
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            opacity: 0,
            background: NAV.glitch,
            mixBlendMode: 'screen',
            transformOrigin: '50% 0%',
          }}
        />

        <div
          ref={contentRef}
          className="relative z-[2] flex h-[72px] w-full items-center justify-between px-8 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:justify-between md:px-16"
          style={{ opacity: 0 }}
        >
          <div className="flex min-w-0 justify-start md:min-w-[10rem]">
            <button
              onClick={() => scrollTo('hero')}
              className="text-titanium uppercase"
              style={{
                fontFamily: '"Monument Extended", "Helvetica Neue", sans-serif',
                fontWeight: 800,
                fontSize: '0.92rem',
                letterSpacing: '0.28em',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 0',
              }}
            >
              {t.nav.logo}
            </button>
          </div>

          <div className="hidden min-w-0 shrink-0 items-center justify-center gap-7 md:flex lg:gap-9">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={label}
                onClick={() => scrollTo(id)}
                className="text-nav text-chrome hover:text-titanium transition-colors duration-300"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0' }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex min-w-0 shrink-0 items-center justify-end gap-6 md:min-w-[10rem] md:gap-8">
            <LanguageSwitcher />
            <button
              onClick={onCartOpen}
              aria-label={t.nav.cartOpenAria.replace('{n}', String(cartCount))}
              title={t.nav.cartOpenAria.replace('{n}', String(cartCount))}
              className="text-nav text-chrome hover:text-gold transition-colors duration-300 flex items-center gap-2 md:gap-3"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 6px', borderRadius: '2px' }}
            >
              <span>{t.nav.cart}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#C0C0C0' }}>
                [{cartCount.toString().padStart(2, '0')}]
              </span>
            </button>
          </div>
        </div>
      </nav>

      {showScrollFab && !mobileOpen ? (
        <>
          {assistOpen ? (
            <>
              <button
                type="button"
                aria-label={t.nav.jumpMenuClose}
                className="fixed inset-0 z-[57]"
                style={{ background: 'rgba(0,0,0,0.42)' }}
                onClick={() => setAssistOpen(false)}
              />
              <div
                id="jump-section-menu"
                role="dialog"
                aria-modal="true"
                aria-labelledby="jump-menu-title"
                className="fixed z-[58] flex flex-col overflow-hidden rounded-md border"
                style={{
                  right: 'max(1rem, env(safe-area-inset-right, 0px))',
                  bottom: 'max(8.5rem, calc(env(safe-area-inset-bottom, 0px) + 7rem))',
                  width: 'min(17.5rem, calc(100vw - 2rem))',
                  maxHeight: 'min(72vh, 24rem)',
                  borderColor: navGold(0.48),
                  background: 'rgba(6,6,6,0.96)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 52px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderBottom: `1px solid ${navChrome(0.1)}`,
                  }}
                >
                  <span
                    id="jump-menu-title"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.2em',
                      color: navGold(1),
                      opacity: 0.95,
                    }}
                  >
                    {t.nav.jumpMenuTitle}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAssistOpen(false)}
                    className="text-chrome hover:text-gold transition-colors"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.55rem',
                      letterSpacing: '0.14em',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 6px',
                    }}
                  >
                    {t.nav.jumpMenuClose}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', padding: '6px 0 8px' }}>
                  {NAV_LINKS.map(({ label, id }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => scrollTo(id)}
                      className="text-left text-chrome transition-colors hover:bg-white/5 hover:text-gold"
                      style={{
                        fontFamily: '"Monument Extended", "Helvetica Neue", sans-serif',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        letterSpacing: '0.12em',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '11px 14px',
                        borderBottom: '0.5px solid rgba(242,242,242,0.06)',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      onCartOpen();
                      setAssistOpen(false);
                    }}
                    className="text-left text-gold transition-colors hover:bg-white/5"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      letterSpacing: '0.16em',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '12px 14px',
                    }}
                  >
                    {t.nav.cart} · [{cartCount.toString().padStart(2, '0')}]
                  </button>
                </div>
              </div>
            </>
          ) : null}
          <button
            type="button"
            onClick={() => setAssistOpen((o) => !o)}
            aria-expanded={assistOpen}
            aria-controls="jump-section-menu"
            className="fixed z-[59] flex items-center justify-center rounded-full border shadow-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              right: 'max(1rem, env(safe-area-inset-right, 0px))',
              bottom: 'max(6.25rem, calc(env(safe-area-inset-bottom, 0px) + 5rem))',
              minHeight: '52px',
              padding: '12px 22px',
              borderColor: navGold(0.55),
              background: 'rgba(8,8,8,0.94)',
              color: navGold(1),
              fontFamily: 'system-ui, "Helvetica Neue", sans-serif',
              fontSize: 'clamp(0.85rem, 3.4vw, 1rem)',
              fontWeight: 700,
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
              lineHeight: 1.25,
              textAlign: 'center',
              boxShadow: '0 10px 32px rgba(0,0,0,0.45)',
            }}
          >
            {t.nav.jumpMenuFab}
          </button>
        </>
      ) : null}
    </>
  );
}
