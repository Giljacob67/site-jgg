// Gera no navegador o mesmo "Panorama informativo" em PDF do site original (pdf-lib).
// Nada é guardado no servidor; por isso não há mais "link válido por 7 dias".
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const forest = rgb(0.03, 0.17, 0.14);
const copper = rgb(0.72, 0.52, 0.3);
const ink = rgb(0.08, 0.16, 0.13);
const muted = rgb(0.37, 0.44, 0.41);

function lines(text: string, max = 82) {
  return text.replace(/\s+/g, ' ').trim().split(' ').reduce<string[]>((out, word) => {
    const last = out.at(-1);
    if (!last || `${last} ${word}`.length > max) out.push(word);
    else out[out.length - 1] = `${last} ${word}`;
    return out;
  }, []);
}

export async function buildReport(r: { label: string; score: number; answers: string[] }) {
  const pdf = await PDFDocument.create();
  pdf.setTitle('Panorama informativo — JGG Group');
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage([595.28, 841.89]);
  page.drawRectangle({ x: 0, y: 720, width: 595.28, height: 121.89, color: forest });
  page.drawText('JGG GROUP', { x: 44, y: 796, size: 11, font: bold, color: copper });
  page.drawText('Panorama informativo', { x: 44, y: 758, size: 28, font: bold, color: rgb(1, 1, 1) });
  page.drawText('Diagnóstico inicial da operação rural', { x: 44, y: 738, size: 11, font: regular, color: rgb(0.76, 0.83, 0.8) });

  let y = 682;
  page.drawText(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, { x: 410, y, size: 9, font: regular, color: muted });
  y -= 48;
  page.drawText('INDICADOR INICIAL', { x: 44, y, size: 9, font: bold, color: copper });
  y -= 30;
  page.drawText(r.label || 'Cenário em avaliação', { x: 44, y, size: 24, font: bold, color: ink });
  page.drawText(`${r.score}/10`, { x: 474, y, size: 20, font: bold, color: copper });
  y -= 34;
  const intro = 'Este indicador organiza sinais de atenção informados pelo próprio usuário. Ele não representa parecer, laudo técnico ou conclusão jurídica sobre um caso concreto.';
  for (const line of lines(intro)) { page.drawText(line, { x: 44, y, size: 10.5, font: regular, color: muted }); y -= 16; }

  y -= 20;
  page.drawText('RESPOSTAS ORGANIZADAS', { x: 44, y, size: 9, font: bold, color: copper });
  y -= 24;
  for (const [i, answer] of r.answers.entries()) {
    page.drawCircle({ x: 50, y: y + 3, size: 8, color: forest });
    page.drawText(String(i + 1), { x: 47.5, y, size: 7, font: bold, color: rgb(1, 1, 1) });
    for (const line of lines(answer, 74)) { page.drawText(line, { x: 68, y, size: 9.5, font: regular, color: ink }); y -= 14; }
    y -= 10;
  }

  y = Math.max(y - 12, 150);
  page.drawRectangle({ x: 44, y: y - 85, width: 507, height: 102, color: rgb(0.94, 0.95, 0.92) });
  page.drawText('Próximos pontos a conferir', { x: 60, y: y - 8, size: 12, font: bold, color: forest });
  const next = 'Separe contratos, aditivos, garantias, matrícula, CAR e comprovantes da operação. Antes de assinar, renegociar ou movimentar patrimônio, confira os documentos em conjunto com um profissional habilitado.';
  let boxY = y - 29;
  for (const line of lines(next, 78)) { page.drawText(line, { x: 60, y: boxY, size: 9.5, font: regular, color: muted }); boxY -= 14; }

  page.drawText('JGG Group · contato@jgggroup.com.br · (44) 98833-5397', { x: 44, y: 66, size: 9, font: bold, color: forest });
  page.drawText('Conteúdo informativo. Cada caso exige análise própria.', { x: 44, y: 48, size: 8, font: regular, color: muted });
  return new Blob([await pdf.save()], { type: 'application/pdf' });
}
