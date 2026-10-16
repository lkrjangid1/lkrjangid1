import { z } from 'zod';
import { categoryOverrides, featured as featuredSlugs } from './site';
import { readRepoJson } from './source';

export const SCREENSHOT_BASE = 'https://raw.githubusercontent.com/lkrjangid1/lkrjangid1/refs/heads/main/screen_shots/';

const LinkSchema = z.object({ label: z.string(), url: z.string().url() });

export const RawProjectSchema = z
  .object({
    title: z.string().min(1),
    role: z.string().optional().default(''),
    metrics: z.string().optional().default(''),
    tech: z.array(z.string()).optional().default([]),
    links: z.array(LinkSchema).optional().default([]),
    points: z.array(z.string()).optional().default([]),
    screenshots: z.array(z.string()).optional().default([]),
  })
  .passthrough();

export const RawPackageSchema = z
  .object({
    name: z.string(),
    description: z.string().optional().default(''),
    url: z.string().url(),
    platforms: z.string().optional().default(''),
  })
  .passthrough();

export const ProjectsFileSchema = z.object({
  projects: z.array(RawProjectSchema).min(1),
  packages: z.array(RawPackageSchema).optional().default([]),
});

export type RawProject = z.infer<typeof RawProjectSchema>;
export type RawPackage = z.infer<typeof RawPackageSchema>;

export interface Link {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  name: string;
  subtitle: string;
  role: string;
  metrics: string;
  tech: string[];
  links: Link[];
  points: string[];
  screenshots: string[];
  category: string;
  featured: boolean;
  primaryLink?: Link;
}

/** Long titles that would make unwieldy URLs. */
const slugAliases: Record<string, string> = {
  'ai-based-research-paper-search-summarization-and-chat-application': 'research-assistant',
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Splits "Name — Subtitle" (em dash, en dash or spaced hyphen). */
export function splitTitle(title: string): { name: string; subtitle: string } {
  const m = title.match(/^(.*?)\s+[—–-]\s+(.*)$/);
  return m ? { name: m[1].trim(), subtitle: m[2].trim() } : { name: title.trim(), subtitle: '' };
}

function guessCategory(p: RawProject): string {
  const hay = `${p.title} ${p.role} ${p.tech.join(' ')}`.toLowerCase();
  if (/univest/.test(hay)) return 'production';
  if (/iot|esp32|ai\b|gemini|langchain|vision/.test(hay)) return 'ai-iot';
  if (/html|css|website/.test(hay)) return 'web';
  if (/flutter|kotlin|android|swift/.test(hay)) return 'apps';
  return 'other';
}

const PRIMARY_LABEL = /(play store|website|live|try|app store|chrome web store)/i;

export function pickPrimaryLink(links: Link[]): Link | undefined {
  return links.find((l) => PRIMARY_LABEL.test(l.label)) ?? links[0];
}

export function normalize(raw: unknown, caseStudies: ReadonlySet<string> = new Set()): Project {
  const p = RawProjectSchema.parse(raw);
  const { name, subtitle } = splitTitle(p.title);
  const base = slugify(name);
  const slug = slugAliases[base] ?? base;
  const links = p.links.map((l) => ({ label: l.label, url: l.url }));
  const primaryLink = caseStudies.has(slug)
    ? { label: 'Case study', url: `/work/${slug}` }
    : pickPrimaryLink(links);
  return {
    slug,
    title: p.title,
    name,
    subtitle,
    role: p.role,
    metrics: p.metrics,
    tech: p.tech,
    links,
    points: p.points,
    screenshots: p.screenshots.map((s) => (/^https?:\/\//.test(s) ? s : SCREENSHOT_BASE + s)),
    category: categoryOverrides[slug] ?? guessCategory(p),
    featured: featuredSlugs.includes(slug),
    primaryLink,
  };
}

/** Parses the whole file. Throws on anything malformed so the build fails instead of shipping an empty grid. */
export function parseProjectsFile(data: unknown, caseStudies: ReadonlySet<string> = new Set()) {
  const file = ProjectsFileSchema.parse(data);
  const projects = file.projects.map((p) => normalize(p, caseStudies));
  const seen = new Set<string>();
  for (const p of projects) {
    if (seen.has(p.slug)) throw new Error(`projects.json: duplicate slug "${p.slug}"`);
    seen.add(p.slug);
  }
  // Featured first, in the order listed in site.ts; the rest keep file order.
  const rank = (p: Project) => (p.featured ? featuredSlugs.indexOf(p.slug) : featuredSlugs.length);
  projects.sort((a, b) => rank(a) - rank(b));
  return { projects, packages: file.packages };
}

let cache: Promise<{ projects: Project[]; packages: RawPackage[] }> | undefined;

export function loadProjectsFile(caseStudies: ReadonlySet<string> = new Set()) {
  cache ??= readRepoJson('projects.json').then((data) => parseProjectsFile(data, caseStudies));
  return cache;
}

export async function getProjects(caseStudies?: ReadonlySet<string>): Promise<Project[]> {
  return (await loadProjectsFile(caseStudies)).projects;
}
