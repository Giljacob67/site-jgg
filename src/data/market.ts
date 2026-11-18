// Valores exibidos antes de /api/market responder (os mesmos do site original).
export type Quote = { key: string; label: string; region: string; value: string; unit: string; variation: number | null; source: string; asOf: string };
export const fallbackQuotes: Quote[] = [
  { key: 'soja', label: 'Soja', region: 'PR', value: 'R$ 154,63', unit: '/ sc 60 kg', variation: 1.97, source: 'CEPEA', asOf: '20/08' },
  { key: 'milho', label: 'Milho', region: 'Indicador', value: 'R$ 67,74', unit: '/ sc 60 kg', variation: 0.52, source: 'CEPEA', asOf: '20/08' },
  { key: 'boi', label: 'Boi gordo', region: 'SP', value: 'R$ 345,70', unit: '/ @', variation: 0.25, source: 'CEPEA', asOf: '20/08' },
  { key: 'cafe', label: 'Café arábica', region: 'Indicador', value: 'R$ 1.821,66', unit: '/ sc 60 kg', variation: 0.94, source: 'CEPEA', asOf: '20/08' },
];
export const pct = (v: number) => Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
