// Conteúdo do JGG Agro Radar, copiado literalmente do site original (18/11/2026).
// Os textos novos ficam na coleção Markdown em src/content/radar/.

export type RadarSection = { heading: string; paragraphs: string[] };
export type RadarSource = { label: string; url: string };
export type RadarItem = {
  slug: string;
  category: string;
  date: string;
  dateIso: string;
  level: string;
  source: string;
  title: string;
  summary: string;
  sections: RadarSection[];
  sources: RadarSource[];
};

export const radarCategories = ['Crédito rural', 'Terra', 'Contratos', 'Ambiental', 'Tributário', 'Sucessão'] as const;

export const radar: RadarItem[] = [
  {
    slug: 'renegociacao-credito-rural-garantias',
    category: 'Crédito rural',
    date: '22 ago 2026',
    dateIso: '2026-08-22',
    level: 'Atenção',
    source: 'Curadoria JGG · fontes oficiais',
    title: 'Renegociação exige leitura das garantias antes da assinatura',
    summary:
      'Um acordo pode consolidar encargos e ampliar garantias. Antes de assinar, compare o saldo, o custo total e o patrimônio vinculado.',
    sections: [
      {
        heading: 'Por que olhar além da parcela',
        paragraphs: [
          'Uma renegociação pode alterar prazo, forma de pagamento, encargos e garantias. A comparação deve considerar o documento anterior, a memória de cálculo e o novo instrumento como um conjunto.',
          'O valor da nova parcela, isoladamente, não mostra o custo total nem a extensão do patrimônio comprometido.',
        ],
      },
      {
        heading: 'O que separar antes da análise',
        paragraphs: [
          'Reúna contrato ou cédula original, aditivos, extratos, memória de cálculo, comprovantes de pagamento e documentos das garantias. Verifique também se há aval, hipoteca, alienação fiduciária ou bens de terceiros.',
        ],
      },
      {
        heading: 'Próximo passo seguro',
        paragraphs: [
          'Peça que saldo, taxa, encargos, vencimentos e garantias estejam documentados. Quando houver dúvida relevante, a leitura individualizada deve ocorrer antes da assinatura.',
        ],
      },
    ],
    sources: [{ label: 'Manual de Crédito Rural — Banco Central', url: 'https://www3.bcb.gov.br/mcr' }],
  },
  {
    slug: 'regularidade-ambiental-credito-rural',
    category: 'Ambiental',
    date: '21 ago 2026',
    dateIso: '2026-08-21',
    level: 'Monitorar',
    source: 'Radar regulatório',
    title: 'Regularidade ambiental ganha peso nas novas operações de crédito',
    summary:
      'Pendências em CAR, embargos e licenciamento podem afetar o acesso a financiamento e precisam entrar no planejamento da safra.',
    sections: [
      {
        heading: 'Documentos que precisam conversar',
        paragraphs: [
          'Cadastro ambiental, matrícula, área efetivamente explorada e licenças devem ser conferidos em conjunto. Divergências podem gerar exigências adicionais na operação de crédito.',
        ],
      },
      {
        heading: 'Como organizar',
        paragraphs: [
          'Mapeie CAR, licenças, autos, embargos e obrigações de regularização com antecedência. Guarde os comprovantes e acompanhe o status nas bases oficiais.',
        ],
      },
    ],
    sources: [{ label: 'Cadastro Ambiental Rural — Serviço Florestal Brasileiro', url: 'https://www.car.gov.br/' }],
  },
  {
    slug: 'arrendamento-rural-clausulas-essenciais',
    category: 'Contratos',
    date: '20 ago 2026',
    dateIso: '2026-08-20',
    level: 'Prático',
    source: 'Análise JGG',
    title: 'Arrendamento rural: quatro cláusulas que evitam conflito no encerramento',
    summary:
      'Benfeitorias, preferência, prazo e responsabilidade ambiental devem ser tratados em conjunto — não como cláusulas isoladas.',
    sections: [
      {
        heading: 'Prazo e devolução',
        paragraphs: [
          'O contrato deve deixar claros início, término, aviso, estado de devolução da área e efeitos de eventual permanência após o prazo.',
        ],
      },
      {
        heading: 'Benfeitorias e responsabilidades',
        paragraphs: [
          'Defina previamente autorização, indenização, retirada e destinação das benfeitorias, além das responsabilidades ambientais e operacionais durante a ocupação.',
        ],
      },
      {
        heading: 'Preço e preferência',
        paragraphs: [
          'Forma de pagamento, critérios de atualização e exercício da preferência precisam ser compatíveis com as regras aplicáveis e com a operação real das partes.',
        ],
      },
    ],
    sources: [
      { label: 'Decreto nº 59.566/1966 — Planalto', url: 'https://www.planalto.gov.br/ccivil_03/decreto/antigos/d59566.htm' },
    ],
  },
  {
    slug: 'transacao-tributaria-passivo-rural',
    category: 'Tributário',
    date: '19 ago 2026',
    dateIso: '2026-08-19',
    level: 'Análise',
    source: 'Radar fiscal',
    title: 'Transação tributária: quando negociar e quando discutir o passivo',
    summary:
      'A escolha depende da origem da dívida, da recuperabilidade do crédito e da capacidade financeira da operação.',
    sections: [
      {
        heading: 'Diagnóstico antes da adesão',
        paragraphs: [
          'Identifique origem, período, processo, garantias e situação de cada débito. A adesão a uma modalidade de transação pode produzir efeitos que precisam ser compreendidos antes da decisão.',
        ],
      },
      {
        heading: 'Capacidade de pagamento',
        paragraphs: [
          'Simule parcelas, fluxo de caixa e impacto na safra. Compare a proposta com outras medidas administrativas ou judiciais aplicáveis ao caso.',
        ],
      },
    ],
    sources: [{ label: 'Regularize — Procuradoria-Geral da Fazenda Nacional', url: 'https://www.regularize.pgfn.gov.br/' }],
  },
  {
    slug: 'holding-rural-planejamento-sucessorio',
    category: 'Sucessão',
    date: '18 ago 2026',
    dateIso: '2026-08-18',
    level: 'Estratégia',
    source: 'Análise JGG',
    title: 'Holding rural não começa pelo contrato social',
    summary:
      'Antes da estrutura societária, a família precisa mapear patrimônio, operação, governança e expectativa entre gerações.',
    sections: [
      {
        heading: 'O mapa vem primeiro',
        paragraphs: [
          'Relacione imóveis, participações, dívidas, garantias, receitas, contratos e funções de cada familiar. A estrutura jurídica deve responder a esse cenário, e não substituí-lo.',
        ],
      },
      {
        heading: 'Governança e tributos',
        paragraphs: [
          'Regras de administração, saída, sucessão, distribuição de resultados e solução de conflitos devem ser avaliadas junto aos efeitos tributários e registrais.',
        ],
      },
    ],
    sources: [{ label: 'Código Civil — Planalto', url: 'https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm' }],
  },
  {
    slug: 'matricula-georreferenciamento-car',
    category: 'Terra',
    date: '16 ago 2026',
    dateIso: '2026-08-16',
    level: 'Prático',
    source: 'Guia JGG',
    title: 'Matrícula, georreferenciamento e CAR: documentos que precisam conversar',
    summary:
      'Inconsistências entre bases podem travar venda, inventário, financiamento e regularização da propriedade.',
    sections: [
      {
        heading: 'Três retratos da mesma área',
        paragraphs: [
          'Matrícula, certificação georreferenciada e cadastro ambiental cumprem funções diferentes. Área, perímetro, titularidade e confrontações devem ser comparados para localizar inconsistências.',
        ],
      },
      {
        heading: 'Organização preventiva',
        paragraphs: [
          'Guarde plantas, memoriais, recibos, certidões e protocolos. Antes de uma venda, inventário ou financiamento, verifique a atualização de cada base e as exigências aplicáveis.',
        ],
      },
    ],
    sources: [
      { label: 'SIGEF — Incra', url: 'https://sigef.incra.gov.br/' },
      { label: 'Cadastro Ambiental Rural', url: 'https://www.car.gov.br/' },
    ],
  },
];
