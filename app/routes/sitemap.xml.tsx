export default function SitemapXml() {
  return null;
}

export function loader() {
  const baseUrl = 'https://riotcrown.shop';

  const routes = [
    { path: '/', priority: 1.0, changefreq: 'daily' },
    { path: '/collections', priority: 0.9, changefreq: 'weekly' },
    { path: '/products', priority: 0.8, changefreq: 'weekly' },
    { path: '/wishlist', priority: 0.7, changefreq: 'monthly' },
    { path: '/member-dashboard', priority: 0.7, changefreq: 'monthly' },
    { path: '/story', priority: 0.6, changefreq: 'monthly' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`
  )
  .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
