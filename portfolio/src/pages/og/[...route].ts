import { OGImageRoute } from 'astro-og-canvas';
import { site } from '../../data/site';
import { getWork } from '../../data/work';
import { repos } from '../../data/repos';
import { brand } from '../../data/icons';

const { projects, caseStudies } = await getWork();

type Page = { title: string; description: string; accent?: string };
const pages: Record<string, Page> = {
  home: { title: site.name, description: `${site.role} at Univest · Flutter, Android and iOS apps for 9M+ users, and the tooling underneath them.` },
  work: { title: 'Work', description: `${projects.length + repos.length} projects: fintech at Univest, Flutter tooling, indie apps and open source.` },
  'open-source': { title: 'Open source', description: 'pub.dev packages and the native-api-bindgen toolchain.' },
  writing: { title: 'Writing', description: 'Flutter internals, Shorebird code push, native interop and performance.' },
  about: { title: 'About', description: site.bio[0] },
  contact: { title: 'Have an app to build or fix?', description: site.availability },
};
for (const p of projects) pages[`work-${p.slug}`] = { title: p.name, description: p.subtitle || p.points[0] || '', accent: brand(p.slug, p.name).accent };
for (const c of caseStudies) pages[`work-${c.id}`] = { title: c.data.title, description: c.data.headline, accent: brand(c.id, c.data.title).accent };

const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const fonts = [
  './node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-600-normal.woff2',
  './node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2',
];

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page: Page) => ({
    title: page.title,
    description: `${page.description}\n\n${site.handle} · ${site.role}`,
    bgGradient: [[7, 8, 11], [16, 22, 32]],
    border: { color: rgb(page.accent ?? '#3db9ff'), width: 14, side: 'block-end' },
    padding: 84,
    font: {
      title: { families: ['Space Grotesk'], weight: 'SemiBold', size: 84, lineHeight: 1.02, color: [244, 245, 247] },
      description: { families: ['Inter'], weight: 'Normal', size: 32, lineHeight: 1.45, color: [163, 168, 180] },
    },
    fonts,
  }),
});
