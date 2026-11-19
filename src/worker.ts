// Worker do site JGG Group: serve os arquivos estáticos (dist/) e duas APIs.
//   GET  /api/market  → cotações CEPEA, Deral e PTAX (cache de 30 min)
//   POST /api/leads   → envia o contato da triagem por e-mail (Resend) e, se configurado, a um webhook
// Nenhum dado pessoal é gravado aqui.

import { marketIndicators, type Quote } from './data/market';

interface Env {
  ASSETS: Fetcher;
  LEAD_LIMITER?: { limit(o: { key: string }): Promise<{ success: boolean }> };
  RESEND_API_KEY?: string;
  LEAD_TO?: string;
  LEAD_FROM?: string;
  AUTOMATION_WEBHOOK_URL?: string;
  AUTOMATION_WEBHOOK_SECRET?: string;
  CANONICAL_HOST?: string;
}

const SECURITY_HEADERS: Record<string, string> = {
  'content-security-policy':
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://cloudflareinsights.com; upgrade-insecure-requests",
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
};

let previewHost = false; // *.workers.dev: prévia, nunca indexar
function secure(res: Response, extra: Record<string, string> = {}) {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries({ ...SECURITY_HEADERS, ...extra })) out.headers.set(k, v);
  if (previewHost) out.headers.set('x-robots-tag', 'noindex, nofollow');
  return out;
}
const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  Response.json(body, { status, headers: { 'cache-control': 'no-store', ...headers } });

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    previewHost = url.hostname.endsWith('.workers.dev');

    // http → https e www.jgggroup.com.br → jgggroup.com.br (o canônico sempre foi o domínio sem www)
    const host = env.CANONICAL_HOST;
    if (host && (url.hostname === `www.${host}` || (url.hostname === host && url.protocol === 'http:'))) {
      url.hostname = host;
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    // /radar/ → /radar com 301 (o padrão dos assets seria 307)
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.replace(/\/+$/, '') || '/';
      return secure(new Response(null, { status: 301, headers: { location: url.pathname + url.search } }));
    }

    if (url.pathname === '/api/market' && request.method === 'GET') return secure(await market(request, ctx));
    if (url.pathname === '/api/leads') {
      if (request.method !== 'POST') return secure(json({ error: 'Método não permitido.' }, 405, { allow: 'POST' }));
      return secure(await leads(request, env, ctx));
    }
    // Links de PDF enviados pelo site antigo (válidos por 7 dias) — mesma mensagem do original para link expirado
    if (url.pathname.startsWith('/api/reports/'))
      return secure(new Response('Este link expirou. Solicite um novo panorama à equipe da JGG.', { status: 410, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } }));
    if (url.pathname.startsWith('/api/')) return secure(json({ error: 'Não encontrado.' }, 404));
    if (url.pathname === '/favicon.ico') return secure(await env.ASSETS.fetch(new Request(new URL('/favicon.svg', url), request)));

    const res = await env.ASSETS.fetch(request);
    const immutable = url.pathname.startsWith('/_astro/') && res.ok;
    return secure(res, immutable ? { 'cache-control': 'public, max-age=31536000, immutable' } : {});
  },
} satisfies ExportedHandler<Env>;

/* ---------------- /api/market ---------------- */

const CEPEA = [
  { key: 'soja', label: 'Soja', region: 'PR', unit: '/ sc 60 kg', page: 'soja', table: 'PARANÁ' },
  { key: 'milho', label: 'Milho', region: 'Indicador', unit: '/ sc 60 kg', page: 'milho', table: 'MILHO' },
  { key: 'boi', label: 'Boi gordo', region: 'SP', unit: '/ @', page: 'boi-gordo', table: 'BOI GORDO' },
  { key: 'cafe', label: 'Café arábica', region: 'Indicador', unit: '/ sc 60 kg', page: 'cafe', table: 'CAFÉ ARÁBICA' },
] as const;

const timeout = (ms: number) => AbortSignal.timeout(ms);
const brNum = (s: string) => Number(s.replace(/\./g, '').replace(',', '.'));
const deralProducts = new Map([
  ['Arroz Agulhinha em casca tipo 1 sc 60 Kg', { key: 'arroz', label: 'Arroz em casca' }],
  ['Feijão Carioca tipo 1 sc 60 Kg', { key: 'feijao-carioca', label: 'Feijão carioca' }],
  ['Feijão preto tipo 1 sc 60 Kg', { key: 'feijao-preto', label: 'Feijão preto' }],
  ['Trigo pão PH 78 sc 60 Kg', { key: 'trigo', label: 'Trigo pão' }],
]);
const quotePrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Lê a primeira linha (data, valor, variação diária) da tabela do indicador na página do CEPEA. */
async function cepea(def: (typeof CEPEA)[number]): Promise<Quote | null> {
  try {
    const res = await fetch(`https://www.cepea.org.br/br/indicador/${def.page}.aspx`, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; JGG-Site/1.0; +https://jgggroup.com.br)' },
      signal: timeout(6000),
      cf: { cacheTtl: 1800, cacheEverything: true },
    });
    if (!res.ok) return null;
    const text = (await res.text()).replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
    const titles = [...text.matchAll(/INDICADOR D[OA] [^/]*?(?:CEPEA\/ESALQ|ESALQ\/BM&(?:amp;)?FBOVESPA)(?: - [A-ZÀ-Ú]+)?/g)];
    const hit = titles.find((m) => m[0].includes(def.table));
    if (!hit) return null;
    const row = text.slice(hit.index!, hit.index! + 400).match(/(\d{2}\/\d{2}\/\d{4}) ([\d.]+,\d{2}) (-?[\d.]+,\d{2})%/);
    if (!row) return null;
    return { key: def.key, label: def.label, region: def.region, value: `R$ ${row[2]}`, unit: def.unit, variation: brNum(row[3]), source: 'CEPEA', asOf: row[1] };
  } catch {
    return null;
  }
}

async function ptax(): Promise<Quote | null> {
  try {
    const d = (x: Date) => `${String(x.getUTCMonth() + 1).padStart(2, '0')}-${String(x.getUTCDate()).padStart(2, '0')}-${x.getUTCFullYear()}`;
    const end = new Date(), start = new Date(end.getTime() - 10 * 86400000);
    const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${d(start)}'&@dataFinalCotacao='${d(end)}'&$orderby=dataHoraCotacao%20desc&$format=json`;
    const res = await fetch(url, { headers: { accept: 'application/json' }, signal: timeout(6000) });
    if (!res.ok) return null;
    const rows = ((await res.json()) as { value?: { cotacaoVenda: number; dataHoraCotacao: string }[] }).value ?? [];
    if (!rows.length) return null;
    const latest = rows[0], day = latest.dataHoraCotacao.slice(0, 10);
    const prev = rows.find((r) => r.dataHoraCotacao.slice(0, 10) !== day);
    const [year, m, dd] = day.split('-');
    return {
      key: 'dolar', label: 'Dólar PTAX', region: 'BCB',
      value: `R$ ${latest.cotacaoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`,
      unit: 'venda', variation: prev ? (latest.cotacaoVenda / prev.cotacaoVenda - 1) * 100 : null,
      source: 'Banco Central', asOf: `${dd}/${m}/${year}`,
    };
  } catch {
    return null;
  }
}

async function deral(): Promise<Quote[]> {
  try {
    const response = await fetch('https://celepar7.pr.gov.br/sima/cotdiat.asp', { signal: timeout(6000) });
    if (!response.ok) return [];
    const html = new TextDecoder('windows-1252').decode(await response.arrayBuffer());
    const asOf = html.match(/atacadista no dia(?:&nbsp;|\s)+(\d{2}\/\d{2}\/\d{4})/i)?.[1];
    if (!asOf) return [];

    const quotes: Quote[] = [];
    let product: { key: string; label: string } | undefined;
    for (const [row] of html.matchAll(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi)) {
      const cells = Array.from(row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi), ([, cell]) =>
        cell.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim(),
      );
      if (cells[0] !== 'm_c') {
        product = cells[1] === 'min' ? deralProducts.get(cells[0]) : undefined;
        continue;
      }
      if (!product) continue;
      // As três colunas finais são média estadual do dia, média anterior e variação.
      const [current, previous, change] = cells.slice(-3).map((cell) => cell ? Number(cell) : NaN);
      if (Number.isFinite(current) && current > 0) {
        quotes.push({
          ...product, region: 'PR · atacado', value: quotePrice.format(current), unit: '/ sc 60 kg',
          variation: previous > 0 && Number.isFinite(change) ? change : null, source: 'Deral', asOf,
        });
      }
      product = undefined;
    }
    return quotes;
  } catch {
    return [];
  }
}

async function market(request: Request, ctx: ExecutionContext) {
  const cache = caches.default;
  const key = new Request(new URL('/api/market?v=3', request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;
  const [cepeaQuotes, dollar, deralQuotes] = await Promise.all([Promise.all(CEPEA.map(cepea)), ptax(), deral()]);
  const live = [...cepeaQuotes.filter((q): q is Quote => q !== null), ...deralQuotes, ...(dollar ? [dollar] : [])];
  const snapshots = await Promise.all(marketIndicators.map(async ({ key: indicator }) => {
    const storageKey = new Request(new URL(`/api/market?last-confirmed=${indicator}`, request.url));
    const quote = live.find((candidate) => candidate.key === indicator);
    if (quote) {
      ctx.waitUntil(cache.put(storageKey, Response.json(quote, {
        headers: { 'cache-control': 'public, max-age=604800' },
      })).catch(() => undefined));
      return quote;
    }
    const previous = await cache.match(storageKey).catch(() => undefined);
    if (previous) {
      const last = await previous.json<Quote>();
      return { ...last, stale: true };
    }
    return null;
  }));
  const quotes = snapshots.filter((quote): quote is Quote => quote !== null);
  const ttl = live.length === marketIndicators.length ? 1800 : 120;
  const res = Response.json(
    { quotes, updatedAt: new Date().toISOString() },
    { headers: { 'cache-control': quotes.length ? `public, max-age=${Math.min(ttl, 900)}, s-maxage=${ttl}` : 'no-store' } },
  );
  if (quotes.length) ctx.waitUntil(cache.put(key, res.clone()).catch(() => undefined));
  return res;
}

/* ---------------- /api/leads ---------------- */

const trim = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

async function hmac(secret: string, body: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function leads(request: Request, env: Env, ctx: ExecutionContext) {
  const fail = 'Não foi possível registrar agora. Use o WhatsApp da JGG.';
  try {
    const origin = request.headers.get('origin');
    if (origin && new URL(origin).host !== new URL(request.url).host) return json({ error: 'Origem não permitida.' }, 403);
    if (Number(request.headers.get('content-length') ?? 0) > 50_000) return json({ error: 'Solicitação muito grande.' }, 413);
    const p = (await request.json()) as Record<string, unknown>;
    if (trim(p.website, 200)) return json({ ok: true }); // honeypot: robôs recebem "ok" e nada é enviado

    const ip = request.headers.get('cf-connecting-ip') ?? 'sem-ip';
    if (env.LEAD_LIMITER && !(await env.LEAD_LIMITER.limit({ key: ip })).success)
      return json({ error: 'Limite de tentativas atingido. Aguarde antes de tentar novamente.' }, 429, { 'retry-after': '60' });

    const lead = {
      name: trim(p.name, 120), phone: trim(p.phone, 40), email: trim(p.email, 160),
      city: trim(p.city, 100), state: trim(p.state, 2).toUpperCase(), matter: trim(p.matter || 'Outro assunto', 120),
      summary: trim(p.summary, 2000), diagnosticLabel: trim(p.diagnosticLabel, 100),
      diagnosticScore: Number.isFinite(Number(p.diagnosticScore)) ? Number(p.diagnosticScore) : null,
      answers: Array.isArray(p.diagnosticAnswers) ? p.diagnosticAnswers.slice(0, 10).map((a) => trim(a, 300)) : [],
    };
    const attribution = {
      utmSource: trim(p.utmSource, 120), utmMedium: trim(p.utmMedium, 120), utmCampaign: trim(p.utmCampaign, 160),
      origin: trim(p.origin, 160), persona: trim(p.persona, 80),
    };
    const digits = lead.phone.replace(/\D/g, '');
    if (!lead.name || digits.length < 10 || digits.length > 13 || !/^\S+@\S+\.\S+$/.test(lead.email) || p.consent !== true)
      return json({ error: 'Preencha nome, WhatsApp e e-mail válidos e confirme o consentimento.' }, 400);

    const occurredAt = new Date().toISOString();
    const eventId = `lead.created.${crypto.randomUUID()}`;
    const channels: Promise<void>[] = [];

    if (env.RESEND_API_KEY && env.LEAD_TO && env.LEAD_FROM) channels.push(sendEmail(env, lead, attribution, occurredAt));
    if (env.AUTOMATION_WEBHOOK_URL) {
      const body = JSON.stringify({ event: 'lead.created', eventId, occurredAt, consent: { given: true, at: occurredAt }, lead, attribution });
      channels.push(
        (async () => {
          const headers: Record<string, string> = { 'content-type': 'application/json', 'x-jgg-event-id': eventId };
          if (env.AUTOMATION_WEBHOOK_SECRET) headers['x-jgg-signature'] = `sha256=${await hmac(env.AUTOMATION_WEBHOOK_SECRET, body)}`;
          const r = await fetch(env.AUTOMATION_WEBHOOK_URL!, { method: 'POST', headers, body, signal: timeout(7000) });
          if (!r.ok) throw new Error(`webhook HTTP ${r.status}`);
        })(),
      );
    }
    if (!channels.length) {
      console.error('leads: nenhum canal configurado (RESEND_API_KEY/LEAD_TO/LEAD_FROM ou AUTOMATION_WEBHOOK_URL)');
      return json({ error: fail }, 503);
    }
    const results = await Promise.allSettled(channels);
    results.forEach((r) => r.status === 'rejected' && console.error('leads: canal falhou', String(r.reason)));
    if (!results.some((r) => r.status === 'fulfilled')) return json({ error: fail }, 502);
    return json({ ok: true }, 201);
  } catch (e) {
    console.error('leads: erro', String(e));
    return json({ error: fail }, 500);
  }
}

async function sendEmail(
  env: Env,
  lead: { name: string; phone: string; email: string; city: string; state: string; matter: string; summary: string; diagnosticLabel: string; diagnosticScore: number | null; answers: string[] },
  attribution: Record<string, string>,
  occurredAt: string,
) {
  const rows: [string, string][] = [
    ['Nome', lead.name], ['WhatsApp', lead.phone], ['E-mail', lead.email],
    ['Cidade/UF', [lead.city, lead.state].filter(Boolean).join(' / ')], ['Assunto', lead.matter],
    ['Panorama', `${lead.diagnosticLabel} · ${lead.diagnosticScore ?? '—'}/10`],
    ['Consentimento', `Sim, marcado no formulário em ${occurredAt}`],
    ...Object.entries(attribution).filter(([, v]) => v).map(([k, v]): [string, string] => [k, v]),
  ];
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), '', 'Relato:', lead.summary || '—', '', 'Respostas da triagem:', ...lead.answers.map((a, i) => `${i + 1}. ${a}`)].join('\n');
  const html = `<h2 style="font-family:sans-serif">Novo contato pelo site</h2><table style="font-family:sans-serif;font-size:14px">${rows.map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#555">${esc(k)}</td><td>${esc(v)}</td></tr>`).join('')}</table><h3 style="font-family:sans-serif">Relato</h3><p style="font-family:sans-serif;white-space:pre-wrap">${esc(lead.summary || '—')}</p><h3 style="font-family:sans-serif">Respostas da triagem</h3><ol style="font-family:sans-serif">${lead.answers.map((a) => `<li>${esc(a)}</li>`).join('')}</ol>`;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.LEAD_FROM, to: env.LEAD_TO!.split(',').map((s) => s.trim()), reply_to: lead.email,
      subject: `Site JGG · ${lead.matter} · ${lead.name}`, text, html,
    }),
    signal: timeout(8000),
  });
  if (!r.ok) throw new Error(`resend HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
}
