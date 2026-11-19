# site-jgg

Site institucional da JGG Group (jgggroup.com.br), recriado fora do ChatGPT Sites.

- **Páginas:** Astro, geradas como HTML estático (`src/pages`).
- **Hospedagem:** Cloudflare Workers com Static Assets (`wrangler.jsonc`).
- **APIs:** `src/worker.ts`
  - `GET /api/market`: cotações CEPEA (soja PR, milho, boi gordo, café arábica) e PTAX do Banco Central, com cache de 30 min.
  - `POST /api/leads`: contato da triagem. Envia e-mail por Resend e, se configurado, um webhook assinado. Não grava dados pessoais.
- **PDF do panorama:** gerado no navegador (`src/scripts/report-pdf.ts`, pdf-lib) com o mesmo layout do original.

## Rodar localmente

```bash
npm install
npm run build
npx wrangler dev --port 8799     # http://127.0.0.1:8799
```

## Publicar

```bash
npm run deploy                   # astro build + wrangler deploy
```

Prévia: https://site-jgg.jgggroup.workers.dev (cabeçalho `x-robots-tag: noindex` fora do domínio real).

## Segredos

Nenhum segredo fica no repositório. Configure no Worker:

```bash
npx wrangler secret put RESEND_API_KEY            # obrigatório para o formulário
npx wrangler secret put AUTOMATION_WEBHOOK_URL    # opcional (CRM)
npx wrangler secret put AUTOMATION_WEBHOOK_SECRET # opcional (assinatura HMAC x-jgg-signature)
```

`LEAD_TO`, `LEAD_FROM` e `CANONICAL_HOST` são variáveis públicas em `wrangler.jsonc`.

## Conteúdo

- Triagem: `src/data/diagnostico.ts`.
- CSS: `src/styles/original.css` é a folha do site original, sem a importação do Google Fonts (as fontes agora são servidas pelo próprio site). Acréscimos ficam em `src/styles/additions.css`.

### Agro Radar

1. Adicione um `.md` a `src/content/radar/` com o endereço do artigo no nome do arquivo. Use o cabeçalho do piloto como modelo. Informe título, resumo, categoria, data (`AAAA-MM-DD`) e fontes. Se houver uma ferramenta relacionada, preencha `tool`.
2. Mantenha `status: draft` durante a revisão editorial e jurídica. Execute `npm run deploy:preview` para conferir o artigo, a lista do Radar e o destaque na home. O sitemap público lista somente artigos aptos à publicação.
3. Após a aprovação editorial, use `status: approved`. Um build de produção inclui o artigo a partir da data definida, no horário de Brasília. Publique no domínio oficial após a autorização de produção. A lista do Radar, os três destaques mais recentes e o sitemap são montados no build.

## Verificação

```bash
node scripts/check-links.mjs https://site-jgg.jgggroup.workers.dev --external
python3 -I scripts/compare-text.py <pasta-com-html-original> https://site-jgg.jgggroup.workers.dev
```

Documentos: `docs/migracao.md` (mapa de URLs e diferenças) e `docs/virada-dns.md` (plano de troca do DNS).
