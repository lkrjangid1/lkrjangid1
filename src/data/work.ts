import { getCollection, type CollectionEntry } from 'astro:content';
import { loadProjectsFile, type Project } from './projects';
import { getPackages } from './packages';

export type CaseStudy = CollectionEntry<'work'>;

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
}

/** projects.json, normalized, with case-study links resolved. */
export async function getWork(): Promise<{ projects: Project[]; caseStudies: CaseStudy[] }> {
  const caseStudies = await getCaseStudies();
  const { projects } = await loadProjectsFile(new Set(caseStudies.map((c) => c.id)));
  return { projects, caseStudies };
}

export async function getAllPackages() {
  const caseStudies = await getCaseStudies();
  const { packages } = await loadProjectsFile(new Set(caseStudies.map((c) => c.id)));
  return getPackages(packages);
}
