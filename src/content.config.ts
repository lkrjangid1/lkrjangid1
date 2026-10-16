import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const work = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    headline: z.string(),
    summary: z.string(),
    role: z.string(),
    year: z.string().optional(),
    stack: z.array(z.string()),
    order: z.number(),
    problem: z.string(),
    approach: z.string(),
    result: z.string(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    repo: z.string().url().optional(),
  }),
});

export const collections = { work };
