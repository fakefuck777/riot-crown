'use client';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';

interface GhostImageProps {
  src:       string;
  alt:       string;
  className?: string;
  style?:    React.CSSProperties;
  /** Pass `high` for above-the-fold LCP candidates. */
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Responsive widths hint for `srcSet`-ready CDNs and browser scheduling. */
  sizes?: string;
}

/**
 * GhostImage — lazy-load with dark grainy fog dissolve.
 *
 * Before load: a near-black placeholder with animated grain texture
 * and a subtle shimmer sweep — the image exists as a void.
 *
 * On load: the fog lifts. CSS transitions dissolve the blur and
 * grain overlay out over 900ms, revealing the image beneath.
 *
 * Uses IntersectionObserver — images outside the viewport never load.
 */
export function GhostImage({ src, alt, className, style, fetchPriority = 'auto', sizes }: GhostImageProps) {
  const isDataUri = useMemo(() => src.startsWith('data:'), [src]);
  const [loaded,  setLoaded]  = useState(isDataUri);
  const [visible, setVisible] = useState(isDataUri);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLImageElement>(null);

  // Reset loading state when the image source changes (client navigations).
  useEffect(() => {
    if (isDataUri) {
      setVisible(true);
      setLoaded(true);
      return;
    }
    setVisible(false);
    setLoaded(false);
  }, [src, isDataUri]);

  // Callback ref — fires synchronously when <img> mounts.
  // For data URIs, img.complete is often true at this point.
  const imgCallbackRef = useCallback((img: HTMLImageElement | null) => {
    (imgRef as React.MutableRefObject<HTMLImageElement | null>).current = img;
    if (img?.complete && img.naturalHeight > 0) setLoaded(true);
  }, []);

  // ── Intersection observer — trigger load when near viewport ──────────────
  useEffect(() => {
    if (isDataUri) return;

    const el = wrapRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '20% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src, isDataUri]);

  // Cached / bfcache: `onLoad` can be skipped after client navigations; recheck
  // when `visible` flips true so we do not stay stuck on blur(12px).
  useEffect(() => {
    if (isDataUri || !visible) return;
    const img = imgRef.current;
    if (!img) return;
    const sync = () => {
      if (img.complete && img.naturalHeight > 0) setLoaded(true);
    };
    sync();
    const raf = requestAnimationFrame(sync);
    const failSafe = window.setTimeout(() => setLoaded(true), 12_000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failSafe);
    };
  }, [visible, src, isDataUri]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      {/* ── Actual image — only src-assigned when visible ── */}
      {visible && (
        <img
          ref={imgCallbackRef}
          src={src}
          alt={alt}
          sizes={sizes}
          loading={fetchPriority === 'high' ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={fetchPriority}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: loaded
              ? 'contrast(1.04) saturate(1.06) brightness(0.91)'
              : 'contrast(1.04) saturate(1.06) brightness(0.91) blur(14px)',
            transform: loaded ? 'scale(1)' : 'scale(1.035)',
            transition: 'filter 1050ms cubic-bezier(0.16,1,0.3,1), transform 1050ms cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      )}

      {/* ── Ghost fog overlay — dissolves out on load ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          // Dark base
          background: '#080808',
          opacity: loaded ? 0 : 1,
          transition: 'opacity 1050ms cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* ── Grain texture on the fog ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`,
          backgroundSize: '160px 160px',
          mixBlendMode: 'overlay',
          opacity: loaded ? 0 : 0.8,
          transition: 'opacity 820ms cubic-bezier(0.22,1,0.36,1)',
        }}
      />

      {/* ── Shimmer sweep — horizontal light pass while loading ── */}
      {!loaded && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(105deg, transparent 38%, rgba(242,242,242,0.035) 50%, transparent 62%)',
            backgroundSize: '220% 100%',
            animation: 'ghostShimmer 3.1s cubic-bezier(0.45,0,0.55,1) infinite',
          }}
        />
      )}
    </div>
  );
}
