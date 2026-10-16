import type { RawPackage } from './projects';

export const PUBLISHER = 'lkrjangid.tech';

export interface Package {
  name: string;
  description: string;
  version: string;
  url: string;
  platforms: string[];
  points?: number;
  maxPoints?: number;
  published?: string;
}

const PLATFORM_NAMES: Record<string, string> = {
  android: 'Android', ios: 'iOS', web: 'Web', macos: 'macOS', windows: 'Windows', linux: 'Linux',
};

async function getJson(url: string): Promise<any> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

async function listNames(): Promise<string[]> {
  const names: string[] = [];
  let next: string | undefined = `https://pub.dev/api/search?q=publisher:${PUBLISHER}`;
  while (next) {
    const page: { packages: { package: string }[]; next?: string } = await getJson(next);
    names.push(...page.packages.map((p) => p.package));
    next = page.next;
  }
  return names;
}

async function fetchPackage(name: string): Promise<Package> {
  const [info, score] = await Promise.all([
    getJson(`https://pub.dev/api/packages/${name}`),
    getJson(`https://pub.dev/api/packages/${name}/score`).catch(() => null),
  ]);
  const tags: string[] = score?.tags ?? [];
  return {
    name,
    description: String(info.latest.pubspec.description ?? '').trim(),
    version: String(info.latest.version),
    url: `https://pub.dev/packages/${name}`,
    platforms: tags
      .filter((t) => t.startsWith('platform:'))
      .map((t) => PLATFORM_NAMES[t.slice(9)] ?? t.slice(9)),
    points: score?.grantedPoints,
    maxPoints: score?.maxPoints,
    published: info.latest.published,
  };
}

function fromCurated(p: RawPackage): Package {
  return {
    name: p.name,
    description: p.description,
    version: '',
    url: p.url,
    platforms: p.platforms ? p.platforms.split('·').map((s) => s.trim()) : [],
  };
}

let cache: Promise<Package[]> | undefined;

/**
 * Live list from pub.dev at build time, with descriptions from projects.json taking priority.
 * Falls back to the curated list if pub.dev is unreachable.
 */
export function getPackages(curated: RawPackage[]): Promise<Package[]> {
  cache ??= (async () => {
    const curatedByName = new Map(curated.map((p) => [p.name, p]));
    try {
      const names = await listNames();
      const pkgs = await Promise.all(names.map(fetchPackage));
      return pkgs
        .map((p) => ({ ...p, description: curatedByName.get(p.name)?.description || p.description }))
        .sort((a, b) => (b.published ?? '').localeCompare(a.published ?? ''));
    } catch (err) {
      console.warn(`[packages] pub.dev unavailable, using projects.json list: ${(err as Error).message}`);
      return curated.map(fromCurated);
    }
  })();
  return cache;
}

export const isBindgenFamily = (name: string) => name.startsWith('native_api_');
