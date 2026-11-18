# Plano de virada do DNS — jgggroup.com.br

**Status: aprovado por Gilberto em 18/11/2026.**

Zona: `jgggroup.com.br` (Cloudflare, plano Free). Estado lido em 18/11/2026.

## Registros que mudam (só estes três)

| ID do registro | Tipo | Nome | Hoje | Depois |
|---|---|---|---|---|
| 5db32c9c8de26138a94b935c392ce4e8 | A | jgggroup.com.br | 172.66.3.26 · somente DNS | 192.0.2.1 · **proxied** |
| 5cde450adf6d5feda778f3cfd1bc491e | A | jgggroup.com.br | 162.159.143.30 · somente DNS | **apagado** |
| 4978d5e25e1b77a1cdb003a8a1df5dd4 | CNAME | www.jgggroup.com.br | custom-domains.chatgpt.site · somente DNS | jgggroup.com.br · **proxied** |

`192.0.2.1` é um endereço reservado para documentação: com o proxy ligado, a Cloudflare entrega a requisição ao Worker pela rota e nunca contata esse IP.

**Não mudam:** todos os demais registros da zona — e-mail (MX, SPF, DKIM, DMARC e provedores de envio), verificações e todos os outros subdomínios. Os TXT `_cf-custom-hostname`, `_openai-site-verification` e `openai-domain-verification` ficam até o fim do período de observação.

## Antes da virada

1. ✓ Textos aprovados (`docs/migracao.md`).
2. ✓ RESEND_API_KEY configurada e testada na prévia.
3. ✓ Leads antigos: Gilberto decidiu não exportar.
4. ✓ Webhook: descartado.
5. Escolher um horário de pouco acesso. Duração prevista: 10 minutos de trabalho e até 5 minutos de propagação (TTL automático = 300 s).

## Ordem da virada

1. **Rotas do Worker** (não têm efeito enquanto os registros estão "somente DNS"). Acrescentar em `wrangler.jsonc` e publicar:
   ```jsonc
   "routes": [
     { "pattern": "jgggroup.com.br/*", "zone_name": "jgggroup.com.br" },
     { "pattern": "www.jgggroup.com.br/*", "zone_name": "jgggroup.com.br" }
   ]
   ```
2. **Domínio principal:** editar o A `5db32c9c…` para `192.0.2.1` com proxy ligado; apagar o A `5cde450a…`.
3. **Testar** (de fora): `curl -sI https://jgggroup.com.br/` deve trazer `content-security-policy` com `static.cloudflareinsights.com` (só o site novo tem isso) e não deve trazer `x-robots-tag`. Conferir `/api/market`, `/sitemap.xml`, `/robots.txt` e enviar um formulário de teste.
4. **www:** editar o CNAME `4978d5e2…` para `jgggroup.com.br` com proxy ligado. Testar: `curl -sI https://www.jgggroup.com.br/radar` → `301` para `https://jgggroup.com.br/radar`.
5. **Search Console:** reenviar `https://jgggroup.com.br/sitemap.xml`.
6. **Web Analytics:** ligar o Cloudflare Web Analytics para o domínio (com proxy ligado, a injeção é automática; a CSP já permite).

## Como voltar atrás (até 5 minutos)

Funciona enquanto o domínio continuar configurado no ChatGPT Sites. Por isso, **não remova o domínio do ChatGPT Sites** antes do fim da observação.

1. Editar o A `5db32c9c…` de volta para `172.66.3.26`, **somente DNS**.
2. Recriar o A `jgggroup.com.br` → `162.159.143.30`, **somente DNS**.
3. Editar o CNAME `www` de volta para `custom-domains.chatgpt.site`, **somente DNS**.
4. (Opcional) Retirar as rotas do `wrangler.jsonc` e publicar.

## Depois da virada

- Observar por 7 dias: erros 4xx/5xx no painel do Worker, chegada dos e-mails de contato, Search Console.
- Depois disso, com aprovação: remover o domínio no ChatGPT Sites e apagar os TXT `_cf-custom-hostname` (2), `_openai-site-verification` (2) e `openai-domain-verification` (2, um deles duplicado com letra trocada).

## Riscos e o que não foi verificado

- **Hipótese não testada:** com o registro em proxy apontando para `192.0.2.1`, o tráfego fica na zona de Gilberto e não segue para o hostname personalizado que o ChatGPT Sites mantém na Cloudflare dele. O passo 3 verifica isso logo após a troca; se falhar, volte atrás e remova o domínio no ChatGPT Sites antes de tentar de novo.
- Certificado: conferido em 18/11/2026 pela API — Universal SSL ativo para `jgggroup.com.br` e `*.jgggroup.com.br` (Google Trust Services). "Always Use HTTPS" está desligado na zona; o Worker redireciona http → https sozinho.
