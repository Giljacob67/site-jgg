import { getCollection } from 'astro:content';
import { radar as legacy } from './radar';

const publicationDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' });
const displayDate = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
});

export async function getRadar({ includePreview = false } = {}) {
  const today = publicationDate.format(new Date());
  const slugs = new Set(legacy.map(({ slug }) => slug));
  const markdown = (await getCollection('radar')).map((entry) => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id) || slugs.has(entry.id)) {
      throw new Error(`Endereço inválido ou duplicado no Agro Radar: ${entry.id}`);
    }
    slugs.add(entry.id);
    const { status, ...data } = entry.data;
    return {
      ...data,
      kind: 'markdown' as const,
      slug: entry.id,
      entry,
      date: displayDate.format(new Date(data.dateIso)),
      published: status === 'approved' && data.dateIso <= today,
    };
  });

  return [
    ...legacy.map((item) => ({ ...item, kind: 'legacy' as const, published: true })),
    ...markdown.filter((item) => includePreview || item.published),
  ].sort((a, b) => b.dateIso.localeCompare(a.dateIso) || a.slug.localeCompare(b.slug));
}

export function getRadarFeatured(items: Awaited<ReturnType<typeof getRadar>>) {
  const today = publicationDate.format(new Date());
  const scheduled = items.flatMap((item) => {
    if (item.kind !== 'markdown' || !item.featuredFrom || item.featuredFrom > today || item.dateIso > today) return [];
    return [{ item, from: item.featuredFrom }];
  });
  scheduled.sort((a, b) => b.from.localeCompare(a.from));
  return scheduled[0]?.item ?? items.find(({ published }) => published);
}
