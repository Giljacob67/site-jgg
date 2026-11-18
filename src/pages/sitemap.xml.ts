import { radar } from '../data/radar';
const SITE = 'https://jgggroup.com.br';
const built = new Date().toISOString();
const pages: [string, string, string, string][] = [
  ['', built, 'monthly', '1'],
  ['/diagnostico', built, 'monthly', '0.7'],
  ['/radar', built, 'daily', '0.7'],
  ['/ferramentas', built, 'monthly', '0.7'],
  ['/ferramentas/pequena-propriedade', built, 'monthly', '0.7'],
  ['/ferramentas/arrendamento', built, 'monthly', '0.7'],
  ['/ferramentas/credito-rural', built, 'monthly', '0.7'],
  ['/privacidade', built, 'monthly', '0.7'],
  ...radar.map((r): [string, string, string, string] => [`/radar/${r.slug}`, `${r.dateIso}T00:00:00.000Z`, 'weekly', '0.8']),
];
export const GET = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
      .map(([p, m, c, pr]) => `<url>\n<loc>${SITE}${p}</loc>\n<lastmod>${m}</lastmod>\n<changefreq>${c}</changefreq>\n<priority>${pr}</priority>\n</url>`)
      .join('\n')}\n</urlset>`,
    { headers: { 'content-type': 'application/xml' } },
  );
