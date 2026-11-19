# Operação editorial da JGG

## JGG Insights

- Na segunda-feira, selecione duas pautas com base nas fontes oficiais e confira o que já existe no acervo. Na terça, publique uma notícia jurídica comentada. Na quinta, publique um editorial ou uma análise aprofundada. Uma quinta por mês recebe o artigo estratégico. Alertas urgentes saem fora desse calendário após revisão.
- Entregue cada rascunho em Markdown com endereço estável, título, resumo, tema, data e fontes oficiais. Envie os dois rascunhos para revisão de Gilberto. Após aprovação, mantenha os artigos em `src/content/radar`.
- Para um editorial, use `level: Editorial`. Abra com o fato, a data e a situação oficial. Explique a questão jurídica, as consequências práticas para o produtor e, em seção própria, a posição institucional da JGG. Inclua a notícia original e os documentos oficiais em `sources`. Em temas em andamento, informe a data da última conferência.
- Use `status: draft` na preparação. Troque para `approved` depois do aval editorial. A data deve chegar em São Paulo antes de o artigo entrar em um build de produção. A prévia também permite conferir rascunhos.
- No artigo escolhido para o destaque semanal, preencha `featuredFrom` com a data da edição, em formato `AAAA-MM-DD`. A nova edição assume o destaque no build de quinta, depois da data prevista e da aprovação. Quando uma edição atrasa, a última matéria segue em destaque. O arquivo conserva as URLs `/radar` e `/radar/{slug}` e permite filtrar por tema e mês.
- Preencha `author: gilberto-jacob` somente quando a autoria estiver confirmada. Quando o crédito confirmado for de responsabilidade técnica, use `technicalLead: gilberto-jacob`. Acrescente `modifiedDate` depois de revisão substancial.
- Inclua uma ferramenta relacionada pelo campo `tool` e uma imagem de 1200 × 630 na pasta `public/compartilhar`. Para vídeo gravado e aprovado, deixe o MP4 e as legendas VTT na pasta `public/videos` e informe os caminhos em `video.file` e `video.captions`.
- A pauta pode ser entregue pelo Hermes no mesmo formato. Confirme o fluxo, quem revisa e quem autoriza o envio às redes. A publicação estática depende de um build após a aprovação e a data definida.
- Para a campanha inaugural, encaminhe o post à página do artigo. Exemplo de atribuição para o LinkedIn: `?utm_source=linkedin&utm_medium=social&utm_campaign=pequena-propriedade-rural`. Preserve o mesmo nome de campanha ao marcar o link do Instagram.
- Quando o canal público do Agro Digest estiver confirmado, configure `PUBLIC_AGRO_DIGEST_URL` com o endereço oficial `https://www.whatsapp.com/channel/…` no build. Confira a abertura do canal em um navegador sem sessão.

### Pauta do primeiro mês para revisão

| Semana | Terça · notícia comentada | Quinta · análise aprofundada |
| --- | --- | --- |
| 23 a 27/11 | **24/11** · Novo andamento do PLV, se confirmado, ou outra notícia oficial de crédito rural | **26/11** · Renegociação de dívidas rurais. Revisar o editorial preparado e conferir os limites das medidas em discussão |
| 30/11 a 04/12 | **01/12** · Ato ou decisão recente sobre CPR, CCB ou garantias, se confirmado em fonte oficial | **03/12** · CPR e CCB. Como examinar origem do saldo, custo e garantias na renegociação |
| 07 a 11/12 | **08/12** · Andamento do PLV ou decisão oficial recente sobre proteção patrimonial | **10/12** · Pequena propriedade rural. Nova análise sobre como documentar a exploração familiar e os limites das garantias, com referência ao artigo já publicado |
| 14 a 18/12 | **15/12** · Ato ou decisão recente sobre prorrogação do crédito rural, se confirmado em fonte oficial | **17/12** · Artigo estratégico do mês. Prorrogação do crédito rural, requisitos, documentação e limites |

As pautas de terça dependem de fatos novos confirmados. Se o fato sugerido não se materializar, selecione outra notícia oficial relevante na reunião de segunda. Use a mesma URL quando atualizar um artigo sobre o mesmo fato, acrescente `modifiedDate` na revisão substancial e proponha uma pauta distinta para completar a edição. As datas são alvos editoriais e dependem de aprovação.

## Rascunho de vídeo para revisão

**O tamanho da propriedade basta para impedir a penhora?**

O tamanho é um dos pontos. O módulo fiscal muda conforme o município. Quando há mais de um terreno contínuo, confira a área total e a redação do Tema 961 do STF. Em uma execução, o Tema 1234 do STJ atribui a quem alega a proteção a prova de que a propriedade é explorada pela família. O tipo de garantia também importa. A Terceira Turma do STJ já examinou a questão em um caso de alienação fiduciária. No JGG Insights você encontra as decisões, e o verificador calcula a dimensão em módulos fiscais. O resultado é informativo e a análise depende dos documentos.

## Agro Alerta e Mercado Agro

- A home e a página Agro Alerta leem o mesmo registro em `src/data/agro-alerta.ts`. Preencha `editorialSlug` com o nome do arquivo do Insights sem a extensão, para que a chamada abra o editorial. Mantenha o histórico e a tramitação oficial na página Agro Alerta. Para a MP 1.376/2026, compare o andamento registrado no Congresso com a norma ou o veto no Diário Oficial da União, quando houver. Ao confirmar mudança, apresente a atualização do editorial no mesmo dia de detecção, com a data, a fonte e as diferenças práticas verificadas. Mantenha a mesma URL do artigo e revise a situação exibida no Agro Alerta. Use os informativos do STJ para sugerir novas pautas.
- O Mercado Agro mantém o último valor confirmado por indicador no cache da Cloudflare por até sete dias. Em uma falha, mostra a data e o rótulo “Última confirmada”. Se a região da Cloudflare que atende o visitante não tiver cópia, o indicador aparece como indisponível.

## Módulos fiscais

A base pública `public/modulos-fiscais-incra-2022-2025.json` contém município, módulo fiscal em hectares e fração mínima de parcelamento. Foi extraída do Anexo IV publicado no DOU de 02/08/2022 e complementada com o município de Boa Esperança do Norte conforme a Instrução Especial 6/2025. As duas instruções estão na [lista oficial do Incra](https://www.gov.br/incra/pt-br/centrais-de-conteudos/legislacao/instrucao-especial/). Ao atualizar, confira a cobertura das 27 UFs, nomes duplicados dentro de cada UF e valores amostrais na [consulta oficial](https://www.gov.br/pt-br/servicos/consultar-indices-basicos).
