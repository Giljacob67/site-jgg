type MarketIndicator = { key: string; label: string; region: string; unit: string; source: string };
export type Quote = MarketIndicator & { value: string; variation: number | null; asOf: string; stale?: boolean };

export const marketIndicators: MarketIndicator[] = [
  { key: 'soja', label: 'Soja', region: 'PR', unit: '/ sc 60 kg', source: 'CEPEA' },
  { key: 'milho', label: 'Milho', region: 'Indicador', unit: '/ sc 60 kg', source: 'CEPEA' },
  { key: 'boi', label: 'Boi gordo', region: 'SP', unit: '/ @', source: 'CEPEA' },
  { key: 'cafe', label: 'Café arábica', region: 'Indicador', unit: '/ sc 60 kg', source: 'CEPEA' },
  { key: 'arroz', label: 'Arroz em casca', region: 'PR · atacado', unit: '/ sc 60 kg', source: 'Deral' },
  { key: 'feijao-carioca', label: 'Feijão carioca', region: 'PR · atacado', unit: '/ sc 60 kg', source: 'Deral' },
  { key: 'feijao-preto', label: 'Feijão preto', region: 'PR · atacado', unit: '/ sc 60 kg', source: 'Deral' },
  { key: 'trigo', label: 'Trigo pão', region: 'PR · atacado', unit: '/ sc 60 kg', source: 'Deral' },
  { key: 'dolar', label: 'Dólar PTAX', region: 'BCB', unit: 'venda', source: 'Banco Central' },
];

export const pct = (v: number) => Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
