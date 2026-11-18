export const GET = () =>
  new Response(`User-Agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nHost: jgggroup.com.br\nSitemap: https://jgggroup.com.br/sitemap.xml\n`, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
