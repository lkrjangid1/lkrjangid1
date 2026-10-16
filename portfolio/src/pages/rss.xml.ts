import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site, writing } from '../data/site';

export function GET(context: APIContext) {
  return rss({
    title: `${site.name} — writing`,
    description: 'Selected posts on Flutter internals, code push, native interop and performance.',
    site: context.site ?? site.url,
    items: [...writing]
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((p) => ({ title: p.title, link: p.url, pubDate: new Date(p.date), categories: p.series ? [p.series] : [] })),
  });
}
