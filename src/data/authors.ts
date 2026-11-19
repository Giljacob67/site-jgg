export const gilbertoJacob = {
  slug: 'gilberto-jacob',
  name: 'Gilberto Jacob',
  role: 'Advogado Fundador | Sócio Sênior da JGG Group',
  registration: 'OAB/PR 17.158',
  experience: 'Mais de 30 anos de experiência na advocacia',
  education: 'Pós-graduado em Direito do Agronegócio e Política Agrícola pela ESMAFE.',
  description: 'Gilberto Jacob, advogado fundador e sócio sênior da JGG Group, atua em Direito Agrário, Direito Bancário e Crédito Rural. OAB/PR 17.158.',
  bio: [
    'Com mais de três décadas de trajetória profissional na advocacia, Gilberto Jacob é advogado fundador e sócio sênior da JGG Group, com atuação estratégica em Direito Agrário, Direito Bancário e Crédito Rural.',
    'Sua experiência profissional, aliada à formação especializada em Direito do Agronegócio, proporciona uma visão abrangente das relações jurídicas, financeiras e patrimoniais que envolvem a atividade rural.',
    'Ao longo de sua carreira, consolidou uma atuação voltada à condução de litígios complexos, à estruturação de estratégias jurídicas e à defesa dos interesses de produtores rurais e empresas do agronegócio, com especial atenção à proteção patrimonial, à segurança das operações financeiras e à continuidade da atividade produtiva.',
  ],
  portrait: {
    src: '/gilberto-jacob-400.webp',
    large: '/gilberto-jacob-800.webp',
    width: 400,
    height: 366,
  },
};

export const authors = [gilbertoJacob];

export const authorPath = (slug: string) => '/autores/' + slug;
