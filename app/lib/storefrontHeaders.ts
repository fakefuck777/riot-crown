/**
 * Mirrors Hydrogen’s `getStorefrontHeaders` (used by `createStorefrontClient`).
 * Kept locally so `server.ts` does not rely on non-exported package internals.
 */
function getHeader(request: Request, key: string): string | null {
  const value = request.headers.get(key);
  return typeof value === 'string' ? value : null;
}

export function getStorefrontHeaders(request: Request) {
  return {
    requestGroupId: getHeader(request, 'request-id'),
    buyerIp:        getHeader(request, 'oxygen-buyer-ip'),
    buyerIpSig:     getHeader(request, 'X-Shopify-Client-IP-Sig') ?? getHeader(request, 'x-shopify-client-ip-sig'),
    cookie:         getHeader(request, 'cookie'),
    purpose:        getHeader(request, 'sec-purpose') || getHeader(request, 'purpose'),
  };
}
