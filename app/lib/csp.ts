/**
 * Baseline Content-Security-Policy for Remix + Hydrogen + GA + inline styles.
 * Uses `unsafe-inline` for scripts/styles because the app ships many inline `style={{}}`
 * blocks and Remix injects hydration scripts without per-request nonces in this stack.
 */
export function buildContentSecurityPolicy(): string {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "manifest-src 'self'",
    "frame-src 'self'",
    "worker-src 'self' blob:",
    "media-src 'self' blob: data:",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com data:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
    "connect-src 'self' https: wss:",
    'upgrade-insecure-requests',
  ].join('; ');
}
