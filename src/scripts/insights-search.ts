const stopWords = new Set(['a', 'as', 'o', 'os', 'da', 'das', 'de', 'do', 'dos', 'e', 'em', 'no', 'na', 'nos', 'nas', 'para', 'que']);

export function insightsWords(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(?:alongamento|alongar|prorrogacao|prorrogar)\b/g, 'prorrogacao')
    .replace(/\bcedulas? de produto rural\b/g, 'cpr')
    .replace(/\bcedulas? de credito bancario\b/g, 'ccb')
    .trim()
    .split(/ +/)
    .filter((word) => word && !stopWords.has(word));
}

export function matchesInsightsWords(terms: string[], content: string[]) {
  return terms.every((term) => content.some((word) =>
    term.length >= 3 ? word.startsWith(term) : word === term,
  ));
}
