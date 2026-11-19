import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { radarCategories } from './data/radar';

const radar = defineCollection({
  loader: glob({ base: './src/content/radar', pattern: '*.md' }),
  schema: z.object({
    title: z.string().trim().min(1),
    summary: z.string().trim().min(1),
    category: z.enum(radarCategories),
    dateIso: z.iso.date(),
    status: z.enum(['draft', 'approved']).default('draft'),
    level: z.string().trim().min(1).default('Análise'),
    source: z.string().trim().min(1).default('Análise JGG'),
    tool: z.enum(['arrendamento', 'credito-rural', 'pequena-propriedade', 'checklist-credito-rural']).optional(),
    sources: z.array(z.object({
      label: z.string().trim().min(1),
      url: z.url({ protocol: /^https$/ }).optional(),
    })).min(1),
    notice: z.string().trim().min(1).optional(),
  }),
});

export const collections = { radar };
