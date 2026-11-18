// Perguntas e faixas da triagem, copiadas do site original.
export const questions: [string, [string, string, string]][] = [
  ['Como está sua relação com o crédito rural?', ['Tudo em dia e sob controle', 'Há parcelas próximas do vencimento', 'Existe atraso, renegociação ou execução']],
  ['Você sabe quais bens estão vinculados como garantia?', ['Sim, tenho clareza', 'Sei apenas parte', 'Não sei exatamente o que está vinculado']],
  ['A operação envolve CPR, CCB ou cédula rural?', ['Sei o tipo e tenho os documentos', 'Tenho dúvidas sobre o instrumento', 'Assinei sem entender a diferença']],
  ['Sua terra e seus cadastros estão regulares?', ['Matrícula, CAR e documentos conferem', 'Há alguma pendência', 'Não tenho segurança sobre a regularidade']],
  ['A sucessão e a exposição do patrimônio já foram planejadas?', ['Sim, há estrutura definida', 'O assunto começou, mas não terminou', 'Ainda não foi organizado']],
];

export function verdict(score: number) {
  if (score >= 8) return { label: 'Atenção prioritária', text: 'As respostas indicam exposição que merece leitura jurídica antes de nova assinatura, renegociação ou movimentação patrimonial.' };
  if (score >= 4) return { label: 'Pontos a organizar', text: 'Há pontos que podem ser organizados preventivamente para reduzir incerteza em crédito, terra e patrimônio.' };
  return { label: 'Cenário preventivo', text: 'O cenário parece preventivo. Ainda assim, documentos e garantias devem ser revistos quando houver nova operação.' };
}
