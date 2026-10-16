import { writingTotal } from './site';

let articles: Promise<number> | undefined;

/** Total FlutDev posts from the Blogger feed at build time; falls back to the last known count. */
export function getArticleCount(): Promise<number> {
  articles ??= (async () => {
    try {
      const res = await fetch('https://flutdev.blogspot.com/feeds/posts/summary?alt=json&max-results=0');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const n = Number((await res.json())?.feed?.openSearch$totalResults?.$t);
      return Number.isFinite(n) && n > 0 ? n : writingTotal;
    } catch (err) {
      console.warn(`[stats] FlutDev feed unavailable, using ${writingTotal}: ${(err as Error).message}`);
      return writingTotal;
    }
  })();
  return articles;
}
