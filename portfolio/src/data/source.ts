import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const RAW_BASE = 'https://raw.githubusercontent.com/lkrjangid1/lkrjangid1/refs/heads/main/';

/**
 * Reads a data file from the profile repo root (one level above `portfolio/`) when the site is
 * built inside that repo, so a deploy always uses the data from the same commit. Falls back to
 * the raw GitHub URL when built elsewhere. Any failure throws, which fails the build.
 */
export async function readRepoJson(name: string): Promise<unknown> {
  const local = resolve(process.cwd(), '..', name);
  if (existsSync(local)) return JSON.parse(await readFile(local, 'utf8'));
  const res = await fetch(RAW_BASE + name);
  if (!res.ok) throw new Error(`${name} fetch failed: HTTP ${res.status}`);
  return res.json();
}
