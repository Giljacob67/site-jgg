// Utilidades dos simuladores: leitura de números no formato brasileiro e moeda.
export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
/** "1.000.000,50" -> 1000000.5 */
export const money = (s: string) => Number(s.replace(/\./g, '').replace(',', '.'));
/** "12,5" -> 12.5 (sem separador de milhar, como no original) */
export const num = (s: string) => Number(s.replace(',', '.'));
export const field = (name: string) => document.querySelector<HTMLInputElement & HTMLSelectElement>(`[name="${name}"]`)!;
export function render(out: HTMLElement, html: string | null, tone?: 'positive' | 'attention') {
  out.hidden = html === null;
  out.className = `calc-result ${tone ?? ''}`.trim();
  out.innerHTML = html ?? '';
}
