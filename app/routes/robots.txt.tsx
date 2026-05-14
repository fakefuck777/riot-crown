export default function RobotsTxt() {
  return null;
}

export function loader() {
  const robotsTxt = `User-agent: *
Allow: /
Allow: /collections
Allow: /products
Allow: /wishlist
Disallow: /admin
Disallow: /api
Disallow: /cart
Disallow: /checkout

Sitemap: https://riotcrown.shop/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
