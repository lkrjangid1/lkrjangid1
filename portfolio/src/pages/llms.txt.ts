// llms.txt (https://llmstxt.org): a plain-text map of the site for AI assistants and answer engines.
// Generated from the same data as the pages, so it stays in sync on every build.
import type { APIRoute } from 'astro';
import { achievements, education, experience, site, writing } from '../data/site';
import { getWork, getAllPackages } from '../data/work';
import { repos } from '../data/repos';

export const GET: APIRoute = async () => {
  const { projects } = await getWork();
  const packages = await getAllPackages();
  const u = (p: string) => new URL(p, site.url).href;
  const line = (name: string, url: string, note = '') => `- [${name}](${url})${note ? `: ${note}` : ''}`;

  const body = [
    `# ${site.name}`,
    '',
    `${site.name} — ${site.role} (Flutter, Android & iOS), India. Available for hire: ${u('/contact')}`,
    '',
    `> ${site.description}`,
    '',
    `${site.name} is a ${site.role} based in ${site.location}.`,
    '',
    `From the About page: "${site.bio.join(' ')}"`,
    '',
    `Contact: ${site.email} · ${site.availability}.`,
    '',
    '## Pages',
    line('Home', u('/'), 'overview, featured products, skills, experience'),
    line('Work', u('/work'), `all ${projects.length} projects and open-source repos`),
    line('Open source', u('/open-source'), `${packages.length} pub.dev packages and GitHub repos`),
    line('Writing', u('/writing'), 'selected FlutDev articles'),
    line('About', u('/about'), 'experience, education, skills, recommendations'),
    line('Contact', u('/contact')),
    line('Résumé (PDF)', u(site.resume)),
    '',
    '## Experience',
    ...experience.map((e) => `- ${e.role}, ${e.company} (${e.place}), ${e.period}: ${e.summary}`),
    ...education.map((e) => `- ${e.degree}, ${e.school}, ${e.period} (${e.note})`),
    '',
    '## Projects',
    ...projects.map((p) => line(p.name, u(`/work/${p.slug}`), [p.subtitle, p.metrics].filter(Boolean).join(' · '))),
    line('native-api-bindgen', u('/work/native-api-bindgen'), repos.find((r) => r.slug === 'native-api-bindgen')?.desc),
    '',
    '## Open source',
    ...packages.map((p) => line(p.name, p.url, p.description)),
    '',
    '## Writing',
    ...writing.map((p) => line(p.title, p.url, p.date)),
    '',
    '## Achievements',
    ...achievements.map((a) => `- ${a}`),
    '',
    '## Profiles',
    ...Object.entries(site.links).map(([k, v]) => line(k, v)),
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
