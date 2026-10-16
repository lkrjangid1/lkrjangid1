# Content contract — design/home.html

Every piece of content on the showcase page, where it comes from, and what's still missing. The Astro port reads the same sources through the existing data layer (`src/data/*`), so nothing here should be hard-coded twice.

Sources:
- **pj** = `projects.json` (https://raw.githubusercontent.com/lkrjangid1/lkrjangid1/refs/heads/main/projects.json)
- **site** = `src/data/site.ts`
- **repos** = `src/data/repos.ts`
- **pub** = pub.dev API, publisher `lkrjangid.tech` (fetched at build time by `src/data/packages.ts`)
- **blog** = FlutDev feed (https://flutdev.blogspot.com)

## 1. Nav and hero

| Element | Source | Notes |
|---|---|---|
| Name, role, intro | site `name`, `role`, `sub` | Intro rewritten in first person for v2 |
| "Open to …" pill | site `availability` | |
| Local time | Browser, `Asia/Kolkata` | |
| Portrait | `design/assets/portrait.webp` | **Gap:** not provided yet; silhouette placeholder |
| "Currently" rotator | pj `Univest.role`, repos `native-api-bindgen`, pj `PushPatch` | |
| Résumé link | Weebly PDF for now | **Gap:** host at `/resume.pdf` |

## 2. App dock and proof

| Element | Source | Notes |
|---|---|---|
| Dock icons | Monograms coloured by `--app-*` tokens | **Gap:** real 512 px app icons |
| 9M+ users, 10M+ downloads | pj `Univest.metrics` | |
| 600K+ Libgen | pj `Libgen.metrics` | |
| 24 packages | pub (count of publisher packages) | Shown as a count-up; computed at build time in the port |
| 177+ articles | blog `openSearch$totalResults` | Fetch at build time in the port |
| Marquee wins | pj `Univest.points`, `Scalper.metrics`, `Self-Hosted Code Push.metrics`; repos `native-api-bindgen` | |

## 3. Now shipping reel

| Product | Copy | Visual | Links |
|---|---|---|---|
| Univest | pj `points` (condensed) | pj `screenshots`: order_form, order_form_basket | pj `links` (Play, App Store) |
| Scalper | pj `points`, `metrics` | pj `screenshots` (6 of 8 cycle) | none in pj |
| PushPatch | pj `points`; code-push origin from pj `Self-Hosted Code Push` | pj `screenshots` (3, laptop frame) | pj `links` + FlutDev part 1 |
| native-api-bindgen | repos + README benchmarks | Terminal (static text, real numbers) | Docs, GitHub, pub.dev |
| Incognito Vault | pj `points` | pj `screenshots` 1–4 (browser frame) | pj `links` (Chrome, Mac App Store) |

## 4. Lineup bento

All tiles come from pj (`title`, `points[0]`, `metrics`, `links`, `screenshots`). The tiles are Libgen, Remote Jobs, MBM E-Learning, OI Visualizer, Raksha, Buckrate, AI research assistant, SeedFuel, Greenhouse IoT, FinSight AI and Weblm.

**Gap:** Libgen, MBM, Raksha and Remote Jobs screenshots are ~117×260 px in the source repo and need re-exporting at 1080 px wide.

## 5. Open source

| Element | Source |
|---|---|
| native_api_* family (14) | pub |
| 7 package rows + versions | pub (versions as of Oct 2026, live in the port) |
| Repo strip with status | repos `status` |
| Hacktoberfest line | site |

## 6. Writing

| Element | Source |
|---|---|
| Shorebird 4-part series | site `writing` (series = "Shorebird internals") |
| Recent posts | site `writing` |

## 7. About and contact

| Element | Source | Notes |
|---|---|---|
| Bio | site `bio` | |
| Skills chips | site `skills` (condensed) | |
| Timeline | site `timeline` | **Gap:** confirm the Timemarks title and dates, and when platform tooling started |
| Hire me card | LinkedIn | **Gap:** public email |
| Consulting card | `/contact` (v1 form → Gmail function) | Doesn't work from `file://`; works once ported |
| Testimonials | — | **Gap:** omitted until real quotes are supplied |
