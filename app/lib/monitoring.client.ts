/**
 * Client-only monitoring: Web Vitals, optional Sentry, global error hooks.
 * Safe to import from entry.client — never import in route modules that SSR.
 */
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

function postVital(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    rating: metric.rating,
    delta: metric.delta,
    navigationType: 'navigationType' in metric ? (metric as { navigationType?: string }).navigationType : undefined,
    path: typeof window !== 'undefined' ? window.location.pathname : '',
  });
  const url = '/api/web-vitals';
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      void fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true });
    }
  } catch {
    /* ignore */
  }
}

export function initWebVitals() {
  if (typeof window === 'undefined') return;
  const isDev = import.meta.env.DEV;
  const report = (m: Metric) => {
    if (isDev) console.info(`[vitals] ${m.name}`, m.value.toFixed?.(2) ?? m.value, m.rating);
    if (!isDev || import.meta.env.VITE_WEB_VITALS_IN_DEV === '1') postVital(m);
  };
  onCLS(report);
  onINP(report);
  onLCP(report);
  onFCP(report);
  onTTFB(report);
}

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn || typeof window === 'undefined') return;
  void import('@sentry/browser').then((Sentry) => {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      tracesSampleRate: import.meta.env.PROD ? 0.08 : 1,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: 0,
    });
  });
}

export function initGlobalErrorReporting() {
  if (typeof window === 'undefined') return;
  window.addEventListener('error', (ev) => {
    console.error('[window.error]', ev.error ?? ev.message);
  });
  window.addEventListener('unhandledrejection', (ev) => {
    console.error('[unhandledrejection]', ev.reason);
  });
}

export function initClientMonitoring() {
  initGlobalErrorReporting();
  initWebVitals();
  initSentry();
}
