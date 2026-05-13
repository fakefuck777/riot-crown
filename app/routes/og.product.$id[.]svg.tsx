import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { getProduct } from '~/lib/products';
import { escapeXml } from '~/lib/svgEscape';

const W = 1200;
const H = 630;

function buildProductOgSvg(product: NonNullable<ReturnType<typeof getProduct>>): string {
  const name = escapeXml(product.name.length > 72 ? `${product.name.slice(0, 69)}…` : product.name);
  const price = escapeXml(product.price);
  const material = escapeXml(
    product.material.length > 48 ? `${product.material.slice(0, 45)}…` : product.material,
  );
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="RIOT CROWN product">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff1293" stop-opacity="0.22"/>
      <stop offset="45%" stop-color="#050508" stop-opacity="1"/>
      <stop offset="100%" stop-color="#050508" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="line" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#c9a84c" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#6ecbff" stop-opacity="0.5"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#050508"/>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${W}" height="4" fill="url(#line)"/>
  <text x="72" y="110" fill="#C9A84C" font-family="ui-monospace,monospace" font-size="20" letter-spacing="0.42em">RIOT CROWN</text>
  <text x="72" y="240" fill="#F2F2F2" font-family="system-ui,-apple-system,BlinkMacSystemFont,sans-serif" font-size="46" font-weight="700">${name}</text>
  <text x="72" y="318" fill="#A8A8A8" font-family="ui-monospace,monospace" font-size="26" letter-spacing="0.12em">${material}</text>
  <text x="72" y="420" fill="#F2F2F2" font-family="ui-monospace,monospace" font-size="40" letter-spacing="0.08em">${price}</text>
  <text x="72" y="560" fill="rgba(242,242,242,0.22)" font-family="ui-monospace,monospace" font-size="16" letter-spacing="0.35em">Y2K · MILLENNIUM · ATELIER</text>
</svg>`;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id ?? '';
  const product = getProduct(id);
  if (!product) {
    return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  const body = buildProductOgSvg(product);
  return new Response(body, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
