import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().default(''),
    headline: z.string().optional(),
    category: z.string().default('Uncategorized'),
    categoryStyle: z.enum(['blue', 'green', 'amber']).catch('blue'),
    date: z.coerce.date(),
    featuredImage: z.object({ src: z.string().default(''), alt: z.string().default('') }).default({ src: '', alt: '' }),
    readTime: z.string().default(''),
    related: z.array(z.string()).default([]),
    body: z.string().default(''),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
