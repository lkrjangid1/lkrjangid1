# Portfolio redesign — TRD for Claude Code

Oct 16, 2026 · @Aryan Beniwal

## Overview and goals

Replace lkrjangid.weebly.com with a static, self-owned site that positions Lokesh as a mobile platform engineer and loads projects from `projects.json`. Claude Code builds it from this TRD plus the attached design file `portfolio-designs.html` (the 9-frame canvas from this conversation).

Positioning line: "I build the layer under the app: native bindings, delivery pipelines, and the Flutter apps on top."

Success metrics:

- Lighthouse 95+ on performance, accessibility, best practices and SEO for every route
- Every project in `projects.json` appears on /work with no code change
- Every headline number links to a source
- Featured case study (native-api-bindgen) reachable in one click from the home page

Non-goals: a CMS, a blog engine with comments, user accounts, Flutter web for the site shell, and third-party GitHub stats cards.

## Scope: pages and routes

Nine frames, eight routes plus a mobile breakpoint. Frame numbers match `portfolio-designs.html`.

| Frame | Page | Route | Data source |
| --- | --- | --- | --- |
| 01 | Home | `/` | `site.ts` metrics + top 4 of `projects.json` |
| 02 | Work index | `/work` | `projects.json` (all) |
| 03 | Case study | `/work/[slug]` | MDX in `src/content/work/` |
| 04 | Open source | `/open-source` | `packages.json` (pub.dev publisher lkrjangid.tech) |
| 05 | Writing | `/writing` | MDX in `src/content/writing/` |
| 06 | About and résumé | `/about` | `site.ts` + `/resume.pdf` |
| 07 | Contact | `/contact` | Form to Formspree or a Cloudflare Worker |
| 08 | 404 | `/404` | Static |
| 09 | Home, mobile | `/` at 390px | Same as 01 |

Also generate `/rss.xml`, `/sitemap.xml`, and `/og/[slug].png` (one social image per page).

## Tech stack and architecture

Astro 5 static output, TypeScript strict, plain CSS with custom properties, no UI framework. Islands only where the page needs JS: the Work filter and the case-study benchmark chart.

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Astro (static) | Zero JS by default, MDX content collections |
| Styling | CSS variables in `tokens.css` | Mirrors the design file one to one |
| Icons | Tabler icons (SVG, tree-shaken) | Same set as the design |
| Charts | Hand-rolled SVG component | No chart library for two bars |
| Islands | Vanilla TS or Preact | Filter and search on /work |
| Hosting | GitHub Pages or Cloudflare Pages | Free, custom domain, HTTPS |
| Domain | lkrjangid.dev (open question: confirm) | Replaces the Weebly subdomain |

```text
src/
  components/   Nav, Footer, Hero, MetricCard, ProjectCard, FilterChips,
                CaseStudyBlock, BenchmarkBars, CodeBlock, PackageRow, Timeline
  content/
    work/       native-api-bindgen.mdx, organic-chemistry-map.mdx, ...
    writing/    *.mdx
  data/
    site.ts     name, positioning, metrics with sourceUrl
    projects.ts fetch + normalize projects.json at build time
  layouts/      Base.astro (head, OG tags, theme)
  pages/        index, work/index, work/[slug], open-source, writing,
                about, contact, 404
  styles/       tokens.css, global.css
public/         resume.pdf, favicon.svg
```

## Data model: projects.json

Projects load at build time from `https://raw.githubusercontent.com/lkrjangid1/lkrjangid1/main/projects.json`, so the site stays static and indexable. A scheduled rebuild (see Deployment) picks up edits to the JSON within 24 hours.

Open question: the real field names in `projects.json` were not readable from GitHub during design. Claude Code must open the file first and adjust the normalizer below to match it exactly.

```ts
// src/data/projects.ts
export type Category = 'production' | 'tooling' | 'mobile' | 'web' | 'backend' | 'archive' | 'other';
export interface Project {
  slug: string; title: string; description: string;
  tags: string[]; category: Category;
  url?: string; repo?: string; live?: string; image?: string;
  year?: number; featured?: boolean; metric?: string;
}
const SRC = 'https://raw.githubusercontent.com/lkrjangid1/lkrjangid1/main/projects.json';
const arr = (v: unknown) => Array.isArray(v) ? v.map(String)
  : typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : [];
export function normalize(p: any): Project {
  const title = String(p.title ?? p.name ?? p.projectName ?? 'Untitled');
  return {
    slug: String(p.slug ?? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')),
    title,
    description: String(p.description ?? p.desc ?? p.summary ?? ''),
    tags: arr(p.tags ?? p.tech ?? p.stack ?? p.technologies),
    category: String(p.category ?? p.type ?? 'other').toLowerCase() as Category,
    url: p.url ?? p.link, repo: p.github ?? p.repo, live: p.live ?? p.demo,
    image: p.image ?? p.thumbnail, year: p.year ? Number(p.year) : undefined,
    featured: Boolean(p.featured), metric: p.metric,
  };
}
export async function getProjects(): Promise<Project[]> {
  const res = await fetch(SRC);
  if (!res.ok) throw new Error(`projects.json ${res.status}`); // fail the build, never ship empty
  const d = await res.json();
  const list = Array.isArray(d) ? d : (d.projects ?? d.data ?? d.items ?? []);
  return list.map(normalize)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || (b.year ?? 0) - (a.year ?? 0));
}
```

Rules: a project with an `.mdx` file of the same slug in `src/content/work/` gets a case-study link; others link straight to `live`, then `repo`, then `url`. Category `archive` renders only in the collapsed archive list. Validate with a Zod schema and log, not crash, on unknown fields.

## Design system

Flat, hairline-bordered, one accent color, light and dark from day one. No gradients, glows, or drop shadows; the design file is the reference for every value.

```css
/* src/styles/tokens.css */
:root {
  --surface-0: #f6f5f1; --surface-1: #faf9f5; --surface-2: #ffffff;
  --text-primary: #141413; --text-secondary: #5f5e5a; --text-muted: #888780;
  --border: rgba(20,20,19,.12); --border-strong: rgba(20,20,19,.22);
  --accent: #185FA5; --bg-accent: #E6F1FB; --text-accent: #0C447C;
  --success: #3B6D11;
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  --radius: 8px; --radius-card: 12px;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;
}
@media (prefers-color-scheme: dark) {
  :root {
    --surface-0: #141413; --surface-1: #1c1c1b; --surface-2: #232322;
    --text-primary: #f1efe8; --text-secondary: #b4b2a9; --text-muted: #888780;
    --border: rgba(241,239,232,.12); --border-strong: rgba(241,239,232,.22);
    --accent: #85B7EB; --bg-accent: #0C447C; --text-accent: #B5D4F4;
  }
}
```

| Role | Size / weight | Use |
| --- | --- | --- |
| Display | 48px / 500, 40px on tablet, 28px on mobile | Hero claim only |
| H1 | 32px / 500 | Page titles |
| H2 | 22px / 500 | Section titles |
| Body | 17px / 400, line-height 1.7 | Prose, max 68ch |
| Small | 14px / 400 | Card descriptions |
| Label | 12px / 400, muted | Metric labels, meta |
| Mono | 13px | CLI samples, package names |

Layout: 1200px max container, 12-column grid, 24px gutter. Breakpoints at 390, 768, and 1200px. Two weights only (400, 500), sentence case everywhere, borders 1px at `--border`, the featured card alone uses a 2px `--accent` border.

## Page specs

Layer names match the labels in the design file, so a review note like "Frame 03 / benchmark-chart" maps to one component.

| Frame | Layer | Content and behaviour |
| --- | --- | --- |
| 01 Home | nav | Name left; Work, Open source, Writing, About; "Get in touch" button right. Sticky, 64px, hairline bottom border |
| 01 Home | hero | Eyebrow role line, positioning claim (display size), one sub-line on the current flagship, two buttons: See work, Résumé |
| 01 Home | proof-metrics | 4 metric cards from `site.ts`: 350K+ downloads, \~1 µs native call, ₹14L/yr saved, 12 packages. Each links to `sourceUrl` |
| 01 Home | featured | native-api-bindgen card, 2px accent border, links to its case study |
| 01 Home | selected-work | First 4 of `getProjects()` (featured first) as ProjectCards, then "All work" link |
| 01 Home | footer | Copyright, GitHub, LinkedIn, X, email. No "powered by" |
| 02 Work | page-header | Title + count line: "N projects" |
| 02 Work | search + filters | Text search over title, description, tags; chips generated from the categories present. State kept in the URL (`?c=web&q=flutter`) |
| 02 Work | project-grid | Auto-fit grid, min 260px cards; empty state "No projects match. Try another filter." Archive in a closed `<details>` below |
| 03 Case study | breadcrumb | Work / title |
| 03 Case study | title-block | Title, role, year, stack pills |
| 03 Case study | problem / approach / result | Three cards, one or two sentences each |
| 03 Case study | benchmark-chart | BenchmarkBars SVG: bindgen 1.80 ms vs MethodChannel 9.02 ms (1 MB round trip), axis labelled in ms |
| 03 Case study | code-sample | Mono block with copy button |
| 03 Case study | next-project | Link to the next project with a case study |
| 04 Open source | package-list | Rows: package name (mono), one-line purpose, version, pub.dev link. Contributions line below |
| 05 Writing | post-list | Title, reading time, date; newest first. Imported FlutDev posts keep a canonical link to the original |
| 06 About | bio, timeline, skills | Avatar initials, 2-sentence bio, 4-stage timeline, grouped skill pills (no ratings), PDF résumé download |
| 07 Contact | form, availability | Name, email, message; inline validation; success and error states; availability line |
| 08 404 | — | `why-skipped` joke heading, one line, "Back to work" button |
| 09 Mobile | all | Nav collapses to a menu button; metrics 2×2; hero claim 28px; cards one column |

## Components

Eleven components cover every frame; each takes typed props and has no page-specific styling.

| Component | Props | Used on |
| --- | --- | --- |
| `Nav` | `current: string` | All |
| `Footer` | — | All |
| `Hero` | `eyebrow, claim, sub, actions[]` | 01, 09 |
| `MetricCard` | `label, value, note, sourceUrl` | 01, 09 |
| `ProjectCard` | `Project`, `variant: 'default' \| 'featured'` | 01, 02 |
| `FilterChips` | `options[], value, onChange` (island) | 02 |
| `CaseStudyBlock` | `title, body` | 03 |
| `BenchmarkBars` | `rows: {label, value, unit}[]` | 03 |
| `CodeBlock` | `code, lang, copy?: boolean` | 03 |
| `PackageRow` | `name, purpose, version, url` | 04 |
| `Timeline` | `items: {label, period}[]` | 06 |

Every interactive element needs visible focus (2px accent outline, 2px offset), hover, and pressed states.

## SEO, performance, accessibility

Every route ships 15 KB of JS or less and passes WCAG 2.2 AA; these fixes target the specific failures of the current Weebly site.

| Area | Budget or rule |
| --- | --- |
| JS per route | ≤ 15 KB gzipped (0 KB on pages without islands) |
| LCP | ≤ 1.5 s on Moto G4 / slow 4G profile |
| CLS | ≤ 0.02 (fixed card heights, `width`/`height` on images) |
| Fonts | 2 files max, `font-display: swap`, self-hosted, preloaded |
| Images | AVIF/WebP via `astro:assets`, lazy below the fold |
| Meta | Unique `<title>` and description per route; canonical URL |
| Social | Generated 1200×630 OG image per route (replaces the blank Weebly placeholder and the dark-mode-only SVG) |
| Structured data | `Person` on /, `SoftwareSourceCode` on case studies, `BlogPosting` on posts |
| Projects | Rendered into HTML at build time so crawlers see them (the current /projects.html renders empty to crawlers) |
| Contrast | 4.5:1 body, 3:1 large text and UI, in both themes |
| Keyboard | Full tab order, skip link, filter chips are buttons with `aria-pressed` |
| Motion | Respect `prefers-reduced-motion`; no motion is required to use the site |

## Deployment and CI

GitHub Actions builds and deploys on every push to `main`, on a daily schedule, and whenever `projects.json` changes in the profile repo.

```yaml
# .github/workflows/deploy.yml
on:
  push: { branches: [main] }
  schedule: [{ cron: '30 0 * * *' }]   # 06:00 IST daily, picks up projects.json edits
  repository_dispatch: { types: [projects-updated] }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run check      # astro check + tsc + eslint
      - run: npm run build
      - run: npx lhci autorun   # fails under the budgets above
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    permissions: { pages: write, id-token: write }
    environment: github-pages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

In the `lkrjangid1/lkrjangid1` repo, add a small workflow that sends `repository_dispatch` (`projects-updated`) to the site repo when `projects.json` changes. Keep the Weebly site live until the new domain resolves, then put a link to the new site on its home page.

## Content migration and cleanup

Some of these are code tasks for Claude Code; the ones marked (Lokesh) need you. Do them before launch.

- [ ] (Lokesh) Pick one download figure and its source: the current site says 150K, 350K+, and 600K+ (Libgen) in different places
- [ ] (Lokesh) Write case studies for the Scalper chart engine and self-hosted code push: problem, constraint, build, result
- [ ] (Lokesh) Export the résumé from OneDrive to `public/resume.pdf`
- [ ] (Lokesh) Remove `telegram-index-api` or recreate it as a GitHub fork crediting odysseusmax/tg-index; its README is the original author's
- [ ] (Lokesh) Fix or remove the guitar course link (lkrjangid1.github.io/guitarcourse returns 404)
- [ ] Add a description, website, and topics to Organic-Chemistry-Map and fcm\_admin on GitHub
- [ ] Mark fcm\_admin "in progress" on the site until its frontend ships
- [ ] Tag `wh-clone`, `mysql-flutter`, `flask-basic-rest-api` as category `archive` in `projects.json`
- [ ] Import selected FlutDev posts as MDX with `canonical` pointing at the Blogspot original
- [ ] Build `packages.json` from the pub.dev publisher page (12 packages)
- [ ] Drop Hacktoberfest images, Holopin, and GitHub stats cards from the home page; keep one line on /open-source

## Acceptance criteria

The site ships when every box below is ticked on the deployed URL, not on localhost.

- [ ] All 8 routes render and match their frames in `portfolio-designs.html` at 390, 768, and 1440px
- [ ] Adding an entry to `projects.json` and pushing makes it appear on /work after the dispatch build, with no site code change
- [ ] A malformed `projects.json` fails the build instead of deploying an empty grid
- [ ] /work filter and search work without JS reloads; URL `?c=&q=` restores the state
- [ ] Lighthouse 95+ in all four categories on /, /work, and one case study (CI enforced)
- [ ] No console errors; no requests to Weebly, vercel.app stats, or OneDrive
- [ ] Every metric card links to a source; every project card links somewhere that returns 200
- [ ] Dark mode follows the system and passes contrast checks
- [ ] Contact form sends, shows success, and shows a clear error when offline
- [ ] OG image previews correctly on LinkedIn and X (checked with each platform's post inspector)

## Claude Code execution plan

Run six milestones in order, one Claude Code session each, committing at the end of each. Put this TRD in the repo as `docs/TRD.md` and the design canvas as `docs/portfolio-designs.html` first.

1. Scaffold: `npm create astro@latest`, TypeScript strict, ESLint, Prettier, `tokens.css`, `Base.astro`, Nav, Footer
2. Data: open the real `projects.json`, fit `normalize()` to its fields, add the Zod schema and unit tests for the normalizer
3. Pages 01, 02, 09: Home and Work with ProjectCard, MetricCard, FilterChips island, URL state
4. Pages 03 to 08: case study MDX collection, BenchmarkBars, CodeBlock, Open source, Writing, About, Contact, 404
5. SEO and quality: OG image generation, sitemap, RSS, structured data, Lighthouse CI budgets
6. Deploy: GitHub Pages workflow, `repository_dispatch` hook in the profile repo, custom domain

Starter prompt for session 1:

```text
Read docs/TRD.md and open docs/portfolio-designs.html. Build milestone 1 only.
Match tokens, type scale and layer names exactly. Ask before adding any
dependency not listed in the TRD. When done, run npm run check and npm run
build, fix every error, and summarize what changed and what is next.
```

For later sessions, swap "milestone 1" for the next number and add: "Compare each page against its frame at 390 and 1440px and list any differences before committing."

Full design source to save as `docs/portfolio-designs.html`: portfolio-designs.html
