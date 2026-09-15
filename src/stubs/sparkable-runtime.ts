// No-op stub for @sparkable-cms/cms/runtime — used only when the CMS package is
// not installed (token-less dev / stubbed build). It still reads the committed
// site-settings.json so the blog config and SEO fallbacks survive a build
// without the real package. Mirrors the real runtime's public API.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function loadSettings(): Record<string, any> {
  try {
    const path = fileURLToPath(new URL('../../site-settings.json', import.meta.url));
    if (existsSync(path)) return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    /* ignore — fall through to empty defaults */
  }
  return {};
}

// The default blog field set (kept in lockstep with the CMS's DEFAULT_BLOG_FIELDS).
const DEFAULT_BLOG_FIELDS = [
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'headline', label: 'Headline', type: 'text', optional: true },
  { key: 'category', label: 'Category', type: 'text', default: 'Uncategorized' },
  {
    key: 'categoryStyle',
    label: 'Style',
    type: 'select',
    default: 'blue',
    options: [
      { value: 'blue', label: 'Blue' },
      { value: 'green', label: 'Green' },
      { value: 'amber', label: 'Amber' },
    ],
  },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'featuredImage', label: 'Featured image', type: 'image' },
  { key: 'readTime', label: 'Read time', type: 'readtime' },
  { key: 'related', label: 'Related posts', type: 'related' },
];

export function readSiteSettings() {
  return loadSettings();
}

export function resolveBlogFields() {
  const settings = loadSettings();
  const fields = settings.blog?.fields;
  return Array.isArray(fields) && fields.length ? fields : DEFAULT_BLOG_FIELDS;
}

export function resolveFeaturedSlug(): string {
  return loadSettings().blog?.featuredSlug ?? '';
}

export function getFeaturedPost<T extends { id?: string; data?: any }>(posts: T[]): T | undefined {
  const slug = resolveFeaturedSlug();
  const live = posts.filter((p) => !p.data?.draft);
  const chosen = slug ? live.find((p) => p.id === slug) : undefined;
  if (chosen) return chosen;
  return live
    .slice()
    .sort((a, b) => new Date(b.data?.date).getTime() - new Date(a.data?.date).getTime())[0];
}
