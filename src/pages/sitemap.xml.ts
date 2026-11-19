import { getRadar } from '../data/radar-content';

const SITE = 'https://jgggroup.com.br';
const radar = await getRadar();
const pages: { path: string; modified?: string }[] = [
  '/', '/agro-alerta', '/diagnostico', '/radar', '/jurisprudencia', '/ferramentas',
  '/ferramentas/pequena-propriedade', '/ferramentas/arrendamento',
  '/ferramentas/credito-rural', '/ferramentas/checklist-credito-rural', '/privacidade',
  '/guias/credito-rural-e-garantias', '/guias/arrendamento-e-posse',
].map((path) => ({ path }));

for (const article of radar) {
  pages.push({
    path: `/radar/${article.slug}`,
    modified: article.kind === 'markdown' ? article.modifiedDate ?? article.dateIso : article.dateIso,
  });
}

export const GET = () => new Response(
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map(({ path, modified }) => `  <url><loc>${SITE}${path === '/' ? '' : path}</loc>${modified ? `<lastmod>${modified}</lastmod>` : ''}</url>`)
    .join('\n')}\n</urlset>\n`,
  { headers: { 'content-type': 'application/xml' } },
);
