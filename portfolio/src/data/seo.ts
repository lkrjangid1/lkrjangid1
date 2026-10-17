// SEO helpers: snippet-safe text and the shared schema.org graph (one WebSite and one Person entity,
// referenced by @id from every page so search engines resolve a single Lokesh Jangid entity).
import { education, site } from './site';

export const ids = {
  website: `${site.url}/#website`,
  person: `${site.url}/#person`,
};

/** Trims to `max` characters at a word boundary, for meta descriptions (~155) and titles (~60). */
export function clamp(text: string, max = 155): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, Math.max(cut.lastIndexOf(' '), max * 0.6)).replace(/[\s,;:·—–-]+$/, '') + '…';
}

/** "Page part · Lokesh Jangid", dropping the page part's tail if the whole would exceed 60 chars. */
export function pageTitle(part: string): string {
  const suffix = ` · ${site.name}`;
  return clamp(part, 60 - suffix.length).replace(/…$/, '') + suffix;
}

export const websiteNode = {
  '@type': 'WebSite',
  '@id': ids.website,
  url: `${site.url}/`,
  name: `${site.name} — ${site.role}`,
  description: site.description,
  inLanguage: 'en',
  publisher: { '@id': ids.person },
};

export const personNode = {
  '@type': 'Person',
  '@id': ids.person,
  name: site.name,
  url: `${site.url}/`,
  image: `${site.url}/og/home.png`,
  email: `mailto:${site.email}`,
  jobTitle: site.role,
  description: site.description,
  worksFor: { '@type': 'Organization', name: 'Univest', url: 'https://univest.in/' },
  address: { '@type': 'PostalAddress', addressLocality: 'Gurgaon', addressRegion: 'Haryana', addressCountry: 'IN' },
  alumniOf: education.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.school.split(',')[0] })),
  knowsAbout: ['Flutter', 'Dart', 'Kotlin', 'Jetpack Compose', 'Swift', 'SwiftUI', 'Android development', 'iOS development', 'JNI', 'OTA code push', 'Mobile app performance', 'Fintech payments'],
  sameAs: Object.values(site.links),
};

/** BreadcrumbList for a clean path like /work/scalper, with readable names per segment. */
export function breadcrumbs(path: string, names: Record<string, string>) {
  const parts = path.split('/').filter(Boolean);
  if (!parts.length) return undefined;
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
      ...parts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: names[p] ?? p.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()),
        item: `${site.url}/${parts.slice(0, i + 1).join('/')}`,
      })),
    ],
  };
}
