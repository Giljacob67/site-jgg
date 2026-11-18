# Migração do ChatGPT Sites para Cloudflare Workers

Inventário feito em 18/11/2026 a partir do site no ar e do código-fonte original (zip enviado por Gilberto).

## Mapa de URLs

| URL antiga | URL nova | Situação |
|---|---|---|
| `/` | `/` | igual |
| `/diagnostico` | `/diagnostico` | igual (envio do formulário mudou, ver abaixo) |
| `/radar` | `/radar` | igual |
| `/radar/renegociacao-credito-rural-garantias` | mesma | igual |
| `/radar/regularidade-ambiental-credito-rural` | mesma | igual |
| `/radar/arrendamento-rural-clausulas-essenciais` | mesma | igual |
| `/radar/transacao-tributaria-passivo-rural` | mesma | igual |
| `/radar/holding-rural-planejamento-sucessorio` | mesma | igual |
| `/radar/matricula-georreferenciamento-car` | mesma | igual |
| `/ferramentas` | `/ferramentas` | igual |
| `/ferramentas/pequena-propriedade` | mesma | igual |
| `/ferramentas/arrendamento` | mesma | igual |
| `/ferramentas/credito-rural` | mesma | igual |
| `/privacidade` | `/privacidade` | igual |
| `/sitemap.xml`, `/robots.txt` | iguais | mesmo conteúdo e mesmas URLs |
| `/api/market` | `/api/market` | mesma resposta (JSON) |
| `/api/leads` | `/api/leads` | mesmo formato de entrada; agora envia e-mail |
| `/api/reports/<token>` | — | responde 410 com a mesma mensagem de "link expirou" do original |
| `/admin`, `/api/admin/*`, `/api/radar`, `/api/radar/ingest` | — | removidos (404) |
| `www.jgggroup.com.br/*` | `jgggroup.com.br/*` | 301 (antes respondia 200 duplicado) |
| `/qualquer/` (barra final) | sem barra | 301 |

Nenhuma URL pública indexável mudou; por isso não há tabela de redirects de conteúdo.

## O que ficou diferente e por quê

1. **Fontes.** O CSS original importava DM Sans e Instrument Serif do Google Fonts, mas a política de segurança (CSP) do próprio site bloqueava esse endereço: no ar, o site aparece em Times/Arial. Agora as fontes são servidas pelo próprio domínio e aparecem como o projeto previa. É a única mudança visual ampla.
2. **Leads.** Antes: gravados num banco D1 do ChatGPT Sites, com painel `/admin` (login ChatGPT) e webhook opcional. Agora: e-mail para `contato@jgggroup.com.br` via Resend (remetente `site@jgggroup.com.br`, resposta direta ao cliente) e o mesmo webhook opcional, com assinatura HMAC. Nada é gravado no site.
3. **PDF do panorama.** Antes: gerado no servidor, link válido por 7 dias. Agora: gerado no navegador do cliente, mesmo layout e mesmo texto, sem link nem armazenamento.
4. **Painel `/admin` e ingestão do Radar** (sincronização do feed do STJ, rascunhos e revisão): removidos. Em 18/11 a API `/api/radar` estava vazia, então nenhum conteúdo publicado se perdeu. Artigos novos entram por `src/data/radar.ts`.
5. **Link "Administração" no rodapé:** removido junto com o painel.
6. **Ticker de mercado.** Antes: valores lidos do Notícias Agrícolas e rotulados "CEPEA". Agora: lidos direto das páginas do CEPEA e do Banco Central. A "Soja PR" agora usa o indicador CEPEA **Paraná** (R$ 159,78 em 17/11); antes mostrava o de **Paranaguá** (R$ 167,43), que não corresponde ao rótulo "PR".
7. **Metadados.** Os artigos tinham título, descrição e canônica no `<body>` (streaming do Next); agora ficam no `<head>`. A home ganhou `<link rel="canonical">`. Os JSON-LD (`LegalService` e `Article`) são os mesmos.
8. **Página 404.** Antes: página padrão do Next em inglês. Agora: página no layout do site (texto novo, rascunho abaixo).
9. **Acessibilidade.** Botões do orientador e do filtro do Radar com `aria-pressed`; barra de progresso da triagem com `role="progressbar"`; ícones decorativos com `aria-hidden`; convite de saída fecha com Esc.
10. **Simuladores.** O resultado só aparece depois que as taxas (ou a remuneração) são preenchidas. Antes, campo vazio contava como 0%.
11. **Artigos:** "← Voltar ao Agro Radar" e a etiqueta do tema ficavam colados; agora estão em linhas separadas.

## Decisões de Gilberto (18/11/2026)

- **Textos novos aprovados:** mensagem de sucesso da triagem ("As informações foram enviadas à equipe, que poderá retornar pelos dados informados. O relatório informativo em PDF pode ser baixado agora, neste navegador."), rótulo "E-mail *", rodapé do PDF sem "Link válido por 7 dias" e página 404 no layout do site.
- **Privacidade:** removida a frase "O link do panorama em PDF expira em sete dias."; data de atualização passou a 18 de novembro de 2026.
- **LinkedIn do rodapé:** `https://www.linkedin.com/company/jgggroup` (o antigo `/company/jgg-group` não existia).
- **Leads antigos:** não serão exportados do ChatGPT Sites. Novos leads chegam por e-mail em contato@jgggroup.com.br.
- **Webhook de automação:** descartado.
