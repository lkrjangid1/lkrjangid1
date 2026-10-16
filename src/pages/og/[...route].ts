import { OGImageRoute } from 'astro-og-canvas';
import { site } from '../../data/site';
import { getWork } from '../../data/work';
import { repos } from '../../data/repos';

const { projects, caseStudies } = await getWork();

const pages: Record<string, { title: string; description: string }> = {
  home: { title: site.name, description: `${site.role} · ${site.claim}` },
  work: { title: 'Work', description: `${projects.length + repos.length} projects: fintech at Univest, Flutter tooling, indie apps and open source.` },
  'open-source': { title: 'Open source', description: '24 pub.dev packages and the native-api-bindgen toolchain.' },
  writing: { title: 'Writing', description: 'Flutter internals, Shorebird code push, native interop and performance.' },
  about: { title: 'About', description: site.bio[0] },
  contact: { title: 'Get in touch', description: site.availability },
};
for (const p of projects) pages[`work-${p.slug}`] = { title: p.name, description: p.subtitle || p.points[0] || '' };
for (const c of caseStudies) pages[`work-${c.id}`] = { title: c.data.title, description: c.data.headline };

const fonts = [
  './node_modules/@fontsource/inter/files/inter-latin-500-normal.woff2',
  './node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2',
];

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[246, 245, 241]],
    border: { color: [24, 95, 165], width: 16, side: 'inline-start' },
    padding: 80,
    font: {
      title: { families: ['Inter'], weight: 'Medium', size: 72, lineHeight: 1.1, color: [20, 20, 19] },
      description: { families: ['Inter'], weight: 'Normal', size: 34, lineHeight: 1.4, color: [95, 94, 90] },
    },
    fonts,
  }),
});
