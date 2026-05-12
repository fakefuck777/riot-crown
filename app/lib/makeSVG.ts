export function makeSVG(id: string, w: number, h: number, accent: string, name: string): string {
  const cx = w / 2;
  const cy = h / 2;
  const n  = parseInt(id, 10) || 1;
  const gx = cx + (((n * 37) % 5) - 2) * (w * 0.06);
  const gy = cy * 0.75 + (((n * 53) % 5) - 2) * (h * 0.05);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <radialGradient id="core${id}" cx="${(gx/w*100).toFixed(1)}%" cy="${(gy/h*100).toFixed(1)}%" r="50%">
        <stop offset="0%"   stop-color="${accent}" stop-opacity="1"/>
        <stop offset="25%"  stop-color="${accent}" stop-opacity="0.6"/>
        <stop offset="60%"  stop-color="${accent}" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="halo${id}" cx="${(gx/w*100).toFixed(1)}%" cy="${(gy/h*100).toFixed(1)}%" r="85%">
        <stop offset="0%"   stop-color="${accent}" stop-opacity="0.25"/>
        <stop offset="60%"  stop-color="${accent}" stop-opacity="0.05"/>
        <stop offset="100%" stop-color="#000000"   stop-opacity="0"/>
      </radialGradient>
      <filter id="blur${id}" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="${Math.round(Math.min(w,h) * 0.07)}"/>
      </filter>
    </defs>
    <rect width="${w}" height="${h}" fill="#0e0e0e"/>
    <rect width="${w}" height="${h}" fill="url(#halo${id})"/>
    <ellipse cx="${gx}" cy="${gy}" rx="${w * 0.22}" ry="${h * 0.22}"
      fill="${accent}" opacity="0.7" filter="url(#blur${id})"/>
    <rect width="${w}" height="${h}" fill="url(#core${id})"/>
    <line x1="16" y1="16" x2="44" y2="16" stroke="${accent}" stroke-width="1.5" opacity="0.8"/>
    <line x1="16" y1="16" x2="16" y2="44" stroke="${accent}" stroke-width="1.5" opacity="0.8"/>
    <line x1="${w-16}" y1="${h-16}" x2="${w-44}" y2="${h-16}" stroke="${accent}" stroke-width="1" opacity="0.4"/>
    <line x1="${w-16}" y1="${h-16}" x2="${w-16}" y2="${h-44}" stroke="${accent}" stroke-width="1" opacity="0.4"/>
    <text x="24" y="38" font-family="monospace" font-size="9" fill="${accent}" opacity="0.9" letter-spacing="2">${id}</text>
    <text x="${cx}" y="${cy - 8}" font-family="monospace" font-size="13" fill="#FFFFFF" text-anchor="middle" letter-spacing="4" opacity="0.9">${name.toUpperCase()}</text>
    <line x1="${cx - 32}" y1="${cy + 4}" x2="${cx + 32}" y2="${cy + 4}" stroke="${accent}" stroke-width="0.75" opacity="0.7"/>
    <text x="${cx}" y="${cy + 18}" font-family="monospace" font-size="7" fill="${accent}" text-anchor="middle" letter-spacing="3" opacity="0.7">RIOT CROWN</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
