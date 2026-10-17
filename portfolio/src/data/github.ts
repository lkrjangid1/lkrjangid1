// GitHub activity at build time (the daily rebuild keeps it fresh). Uses the public contributions
// calendar and the unauthenticated REST API; a GITHUB_TOKEN raises the rate limit in CI if present.
export const GITHUB_USER = 'lkrjangid1';

export interface Day { date: string; count: number; level: number }
export interface GithubStats {
  user: string;
  url: string;
  total: number;
  weeks: Day[][];
  months: { label: string; count: number }[];
  busiest: Day;
  longestStreak: number;
  currentStreak: number;
  stars: number;
  followers: number;
  repos: number;
  fetchedAt: string;
}

const headers = (): Record<string, string> => ({
  'User-Agent': 'lkrjangid-portfolio',
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
});

/** Parses GitHub's contributions calendar HTML into days. Exported for tests. */
export function parseCalendar(html: string): Day[] {
  const counts = new Map<string, number>();
  for (const m of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    const n = m[2].match(/^(\d[\d,]*) contributions?/);
    counts.set(m[1], n ? Number(n[1].replace(/,/g, '')) : 0);
  }
  const days: Day[] = [];
  for (const m of html.matchAll(/<td\b[^>]*\bdata-date="(\d{4}-\d{2}-\d{2})"[^>]*>/g)) {
    const tag = m[0];
    const id = tag.match(/\bid="([^"]+)"/)?.[1] ?? '';
    const level = Number(tag.match(/\bdata-level="(\d)"/)?.[1] ?? 0);
    days.push({ date: m[1], count: counts.get(id) ?? 0, level });
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

/** Aggregates days into weeks (Sunday-first columns), month totals and streaks. Exported for tests. */
export function summarize(days: Day[]) {
  const weeks: Day[][] = [];
  for (const d of days) {
    const dow = new Date(`${d.date}T00:00:00Z`).getUTCDay();
    if (dow === 0 || weeks.length === 0) weeks.push([]);
    weeks[weeks.length - 1].push(d);
  }
  const fmt = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' });
  const monthMap = new Map<string, { label: string; count: number }>();
  for (const d of days) {
    const key = d.date.slice(0, 7);
    const m = monthMap.get(key) ?? { label: fmt.format(new Date(`${d.date}T00:00:00Z`)), count: 0 };
    m.count += d.count;
    monthMap.set(key, m);
  }
  let longest = 0, run = 0;
  for (const d of days) { run = d.count > 0 ? run + 1 : 0; longest = Math.max(longest, run); }
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current++;
    else if (i === days.length - 1) continue; // today may not have activity yet
    else break;
  }
  const busiest = days.reduce((a, b) => (b.count > a.count ? b : a), days[0]);
  return { weeks, months: [...monthMap.values()].slice(-12), busiest, longestStreak: longest, currentStreak: current, total: days.reduce((n, d) => n + d.count, 0) };
}

let cache: Promise<GithubStats | null> | undefined;

export function getGithubStats(): Promise<GithubStats | null> {
  cache ??= (async () => {
    try {
      const [cal, user] = await Promise.all([
        fetch(`https://github.com/users/${GITHUB_USER}/contributions`, { headers: { 'User-Agent': 'Mozilla/5.0' } }).then((r) => {
          if (!r.ok) throw new Error(`calendar HTTP ${r.status}`);
          return r.text();
        }),
        fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers: headers() }).then((r) => {
          if (!r.ok) throw new Error(`user HTTP ${r.status}`);
          return r.json();
        }),
      ]);
      const repos: { fork: boolean; stargazers_count: number }[] = [];
      for (let page = 1; page < 10; page++) {
        const r = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&page=${page}`, { headers: headers() });
        if (!r.ok) throw new Error(`repos HTTP ${r.status}`);
        const batch = await r.json();
        repos.push(...batch);
        if (batch.length < 100) break;
      }
      const days = parseCalendar(cal);
      if (days.length < 300) throw new Error(`calendar parse found only ${days.length} days`);
      const own = repos.filter((r) => !r.fork);
      return {
        user: GITHUB_USER,
        url: `https://github.com/${GITHUB_USER}`,
        ...summarize(days),
        stars: own.reduce((n, r) => n + r.stargazers_count, 0),
        followers: user.followers,
        repos: own.length,
        fetchedAt: new Date().toISOString().slice(0, 10),
      };
    } catch (err) {
      console.warn(`[github] stats unavailable, hiding the section: ${(err as Error).message}`);
      return null;
    }
  })();
  return cache;
}
