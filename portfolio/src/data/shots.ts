import type { ImageMetadata } from 'astro';

// screen_shots/ at the profile repo root. When the site is built inside that repo, screenshots are
// bundled from disk (same commit as projects.json); otherwise this glob is empty and the raw URL is used.
const local = import.meta.glob<{ default: ImageMetadata }>('../../../screen_shots/*.{png,jpg,jpeg,webp}', { eager: true });

const byName = new Map(Object.entries(local).map(([path, mod]) => [path.split('/').pop()!, mod.default]));

/** Resolves a screenshot URL from projects.json to a bundled local image when available. */
export function shotSrc(url: string): ImageMetadata | string {
  return byName.get(decodeURIComponent(url.split('/').pop() ?? '')) ?? url;
}
