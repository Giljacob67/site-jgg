// Percorre o site a partir da raiz e confere todos os links internos (e, com --external, os externos).
// Uso: node scripts/check-links.mjs https://site-jgg.jgggroup.workers.dev [--external]
const base = new URL(process.argv[2] ?? 'http://127.0.0.1:8799');
const external = process.argv.includes('--external');
const seen = new Map(), queue = ['/'], ext = new Set(), bad = [];
while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  const res = await fetch(new URL(path, base), { redirect: 'manual' });
  seen.set(path, res.status);
  if (res.status >= 400) bad.push(`${res.status} ${path}`);
  if (!(res.headers.get('content-type') ?? '').includes('text/html')) continue;
  const html = await res.text();
  for (const [, raw] of html.matchAll(/(?:href|src)="([^"#]+)/g)) {
    const u = new URL(raw.replaceAll('&amp;', '&'), new URL(path, base));
    if (u.origin === base.origin) queue.push(u.pathname + u.search);
    else if (/^https?:/.test(u.protocol)) ext.add(u.href);
  }
}
if (external)
  for (const href of ext) {
    if (href.startsWith('https://wa.me/') || href.startsWith('https://jgggroup.com.br')) continue;
    const r = await fetch(href, { method: 'GET', redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0' } }).catch((e) => ({ status: String(e) }));
    if (!(r.status >= 200 && r.status < 400)) bad.push(`${r.status} ${href}`);
    else console.log(`ok ${r.status} ${href}`);
  }
console.log([...seen].map(([p, s]) => `${s} ${p}`).join('\n'));
console.log(`\n${seen.size} URLs internas, ${ext.size} externas, ${bad.length} com problema`);
bad.forEach((b) => console.log('FALHA', b));
process.exit(bad.length ? 1 : 0);
