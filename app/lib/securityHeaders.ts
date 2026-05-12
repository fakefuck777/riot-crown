/**
 * Baseline security headers for HTML responses (Hydrogen / MiniOxygen).
 * Does not replace WAF, CSP nonces for inline scripts, or dependency audits.
 */
export function applySecurityHeaders(
  headers: Headers,
  opts: { enableHsts?: boolean } = {},
): void {
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'SAMEORIGIN');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('X-DNS-Prefetch-Control', 'off');
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()',
  );
  if (opts.enableHsts) {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
}
