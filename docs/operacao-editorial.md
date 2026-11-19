# Operação editorial da JGG

## Agro Radar

- Prepare uma pauta por semana. Entregue um Markdown em `src/content/radar` com endereço estável, título, resumo, tema, data e links para as fontes oficiais.
- Use `status: draft` na preparação. Troque para `approved` depois do aval editorial. A data deve chegar em São Paulo antes de o artigo entrar em um build de produção. A prévia também permite conferir rascunhos.
- Preencha `author: gilberto-jacob` somente quando a autoria estiver confirmada. Quando o crédito confirmado for de responsabilidade técnica, use `technicalLead: gilberto-jacob`. Acrescente `modifiedDate` depois de revisão substancial.
- Inclua uma ferramenta relacionada pelo campo `tool` e uma imagem de 1200 × 630 na pasta `public/compartilhar`. Para vídeo gravado e aprovado, deixe o MP4 e as legendas VTT na pasta `public/videos` e informe os caminhos em `video.file` e `video.captions`.
- A pauta pode ser entregue pelo Hermes no mesmo formato. Confirme o fluxo, quem revisa e quem autoriza o envio às redes. A publicação estática depende de um build após a aprovação e a data definida.
- Para a campanha inaugural, encaminhe o post à página do artigo. Exemplo de atribuição para o LinkedIn: `?utm_source=linkedin&utm_medium=social&utm_campaign=pequena-propriedade-rural`. Preserve o mesmo nome de campanha ao marcar o link do Instagram.
- Quando o canal público do Agro Digest estiver confirmado, configure `PUBLIC_AGRO_DIGEST_URL` com o endereço oficial `https://www.whatsapp.com/channel/…` no build. Confira a abertura do canal em um navegador sem sessão.

## Rascunho de vídeo para revisão

**O tamanho da propriedade basta para impedir a penhora?**

O tamanho é um dos pontos. O módulo fiscal muda conforme o município. Quando há mais de um terreno contínuo, confira a área total e a redação do Tema 961 do STF. Em uma execução, o Tema 1234 do STJ atribui a quem alega a proteção a prova de que a propriedade é explorada pela família. O tipo de garantia também importa. A Terceira Turma do STJ já examinou a questão em um caso de alienação fiduciária. No Agro Radar você encontra as decisões, e o verificador calcula a dimensão em módulos fiscais. O resultado é informativo e a análise depende dos documentos.

## Agro Alerta e Mercado Agro

- A home e a página Agro Alerta leem o mesmo registro em `src/data/agro-alerta.ts`. Para a MP 1.376/2026, compare o último andamento publicado pelo Congresso com o anterior. Encaminhe alteração, data e link como rascunho à equipe. Use os informativos do STJ para sugerir novas pautas.
- O Mercado Agro mantém o último valor confirmado por indicador no cache da Cloudflare por até sete dias. Em uma falha, mostra a data e o rótulo “Última confirmada”. Se a região da Cloudflare que atende o visitante não tiver cópia, o indicador aparece como indisponível.

## Módulos fiscais

A base pública `public/modulos-fiscais-incra-2022-2025.json` contém município, módulo fiscal em hectares e fração mínima de parcelamento. Foi extraída do Anexo IV publicado no DOU de 02/08/2022 e complementada com o município de Boa Esperança do Norte conforme a Instrução Especial 6/2025. As duas instruções estão na [lista oficial do Incra](https://www.gov.br/incra/pt-br/centrais-de-conteudos/legislacao/instrucao-especial/). Ao atualizar, confira a cobertura das 27 UFs, nomes duplicados dentro de cada UF e valores amostrais na [consulta oficial](https://www.gov.br/pt-br/servicos/consultar-indices-basicos).
