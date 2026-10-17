import type { ImageMetadata } from 'astro';
import type { Link, Project } from './projects';
import { framedShots, hiddenOnHome, reel, shortNames, type ReelVisual } from './site';
import { repos } from './repos';
import { shotSrc } from './shots';

export type ShotSrc = ImageMetadata | string;

export interface ReelItem {
  slug: string;
  name: string;
  platform: string;
  tagline: string;
  visual: ReelVisual;
  points: string[];
  metrics: string[];
  links: Link[];
  shots: ShotSrc[];
  href: string;
}

export interface Tile {
  slug: string;
  name: string;
  subtitle: string;
  summary: string;
  metric: string;
  href: string;
  external: boolean;
  shots: ShotSrc[];
  layout: 'phones' | 'posters' | 'image' | 'text';
}

const isPortrait = (s: ShotSrc) => typeof s !== 'string' && s.height > s.width * 1.2;
const splitMetrics = (m: string) => m.split(/\s+·\s+/).map((s) => s.trim()).filter(Boolean);

const bindgenRepo = repos.find((r) => r.slug === 'native-api-bindgen')!;

export function buildReel(projects: Project[]): ReelItem[] {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  return reel.flatMap((r): ReelItem[] => {
    if (r.slug === 'native-api-bindgen') {
      return [{
        ...r, name: 'native-api-bindgen',
        points: [
          bindgenRepo.desc,
          'A canonical IR feeds per-target generators that report a reason code for anything they skip.',
        ],
        metrics: ['~1 µs native calls', '1.80 ms vs 9.02 ms per 1 MB', '97.1% of android.jar'],
        links: [
          { label: 'Docs', url: bindgenRepo.live! },
          { label: 'GitHub', url: bindgenRepo.repo },
          { label: 'pub.dev', url: 'https://pub.dev/packages/native_api_bindgen' },
        ],
        shots: [], href: '/work/native-api-bindgen',
      }];
    }
    const p = bySlug.get(r.slug);
    if (!p) return []; // Project removed from projects.json; skip rather than break the page.
    return [{
      ...r, name: p.name, points: p.points.slice(0, 3), metrics: splitMetrics(p.metrics),
      links: p.links, shots: p.screenshots.map(shotSrc), href: `/work/${p.slug}`,
    }];
  });
}

/** Every project not in the reel, as a bento tile shaped by its screenshots. */
export function buildLineup(projects: Project[]): Tile[] {
  const inReel = new Set<string>(reel.map((r) => r.slug));
  return projects.filter((p) => !inReel.has(p.slug) && !hiddenOnHome.has(p.slug)).map((p) => {
    const shots = p.screenshots.map(shotSrc);
    const layout = shots.length === 0 ? 'text' : !isPortrait(shots[0]) ? 'image' : framedShots.has(p.slug) ? 'posters' : 'phones';
    return {
      slug: p.slug,
      name: shortNames[p.slug] ?? p.name,
      subtitle: p.subtitle,
      summary: p.points[0] ?? p.subtitle,
      metric: splitMetrics(p.metrics)[0] ?? '',
      href: `/work/${p.slug}`,
      external: false,
      shots,
      layout,
    };
  });
}
