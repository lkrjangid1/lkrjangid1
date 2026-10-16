import type { ImageMetadata } from 'astro';
import { appMeta } from './site';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/icons/*.{webp,png,svg}', { eager: true });
const byName = new Map(Object.entries(files).map(([p, m]) => [p.split('/').pop()!.replace(/\.\w+$/, ''), m.default]));

export interface AppBrand {
  accent: string;
  mono: string;
  icon?: ImageMetadata;
}

const PALETTE = ['#3db9ff', '#8b7cf6', '#ff7a45', '#2fb36e', '#f4b63a', '#ff4f81', '#19c3b4'];

/** Accent, monogram and optional icon for a project. Unknown projects get a stable palette colour. */
export function brand(slug: string, name = slug): AppBrand {
  const meta = appMeta[slug];
  if (meta) return { accent: meta.accent, mono: meta.mono, icon: meta.icon ? byName.get(meta.icon) : undefined };
  const hash = [...slug].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const mono = name.replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).map((w) => w[0]).join('').slice(0, 2) || '•';
  return { accent: PALETTE[hash % PALETTE.length], mono };
}
