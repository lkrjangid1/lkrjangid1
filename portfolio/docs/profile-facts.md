# Profile facts for the final site

Collected Oct 16, 2026 from the résumé (`public/resume.pdf`), Play Store listings, the Libgen, SeedFuel and Buckrate websites, and the old Weebly site. Use these values when building the final pages; anything marked **Check** disagrees between sources and needs Lokesh's call.

## Identity
- **Name:** Lokesh Jangid
- **Title:** Senior Mobile Engineer (résumé), Senior Software Engineer at Univest
- **Location:** Gurgaon, India
- **Email:** lkrjangid1@gmail.com
- **Phone:** in the résumé PDF only; not shown on the site
- **Links:** linkedin.com/in/lkrjangid · github.com/lkrjangid1 · pub.dev/publishers/lkrjangid.tech · flutdev.blogspot.com · x.com/lkrjangid · g.dev/lkrjangid
- **Summary line:** Senior Mobile Engineer with 4+ years shipping high-scale consumer apps across Flutter, native Android (Kotlin) and native iOS (Swift/SwiftUI).

## Experience
| Role | Company | Dates | Place |
|---|---|---|---|
| Senior Software Engineer | Univest Communication Pvt. Ltd. | 04/2024 – present | Gurgaon |
| Software Developer | Timemarks Examiner Pvt. Ltd. | 02/2021 – 03/2024 | Jaipur |

**Univest highlights:** brokerage order placement and management (9M+ users); binary-encrypted WebSocket streaming; crash-free 70% → 95%; mutual funds end to end on BSE (3K+ orders, ₹1.06 Cr+); Juspay headless module across 4 flows; cold start 5.5s → 2.0s (64%); API calls −50%; app size −10% (6 MB+); CMS-driven runtime page builder; dynamic ads widget; custom dynamic links and AppsFlyer OneLink; Scalper (+12%, then +8% with 2.0, ~20% combined); FinSight AI native Kotlin and SwiftUI; self-hosted code push (days → minutes, ₹14L+/yr); CI/CD from zero (3 Android flavors, Slack distribution); Appium E2E; mentored 2 junior engineers.

**Timemarks highlights (new for the site):** early engineer at a bootstrapped EdTech startup, led 4 interns, 6 products.
- **Studyem:** white-label Flutter LMS for ~5 institutes and 1,000+ students; RabbitMQ chat with video calling; Firebase collaborative whiteboard; live quiz with ~400 peak concurrent users; API usage −70% with SQLite caching; Razorpay; AI chatbot.
- **Studyem Web:** the LMS as an installable Flutter Web PWA with white-label theming.
- **Timevictor:** fantasy-style edu-gaming with real-time contests.
- **Buckrate:** Flutter Web livestock marketplace with an AI weight estimator built on image segmentation.
- **WhatsApp commerce bot:** pywa and Flask.

## Education
- **B.E. Electrical**, MBM University, Jodhpur. 2019 – 2023, CGPA 8.28.
- **MCA**, Uttaranchal University, Dehradun. 2024 – 2026 (pursuing).

## Achievements
- Winner, Incubation & Funding Round, IIIT Surat, for Raksha
- Hacktoberfest 2020 and 2021
- 600K+ cumulative downloads across self-published Play Store apps

## New and updated projects

### Searchly (new)
- **Play:** https://play.google.com/store/apps/details?id=com.yaaratech.x1337
- **Store title:** "Searchly | Torrent search"
- **Tagline:** "Fast & powerful file search engine. Find torrent, files, books, movies & more."
- **Facts:** 1K+ installs · 4.0★ · updated Jul 30, 2026 · light and dark themes, bookmarks
- **Assets:** `src/assets/icons/searchly.webp`, `src/assets/shots/searchly/*`

### Libgen v3 and Quillshelf
- **Site:** https://libgen-d4497.web.app/ — "Libgen for Android and Quillshelf for iPhone: search many book sources at once, import EPUB and PDF files, and read with themes, highlights and daily goals."
- **Play:** 500K+ installs · 4.0★ · updated Oct 15, 2026
- **Assets:** 9 v3 screenshots in `src/assets/shots/libgen/`, plus the Quillshelf icon (64 px only)

### Buckrate (new site)
- **Site:** https://buckrate.com/ — "Digital infrastructure for the entire mutton supply chain": India's first goat and sheep intelligence platform with satellite agronomy, AI weight estimation, disease risk, carbon footprint and market pricing.
- **Asset:** `src/assets/shots/buckrate/site.webp`
- The old link calculator.buckrate.com no longer responds; use https://buckrate.com/.

### SeedFuel
- **Site:** http://lkrjangid1.github.io/seedfuel — dry fruit and seed laddus, no added sugar, 500 g to 3 kg packs
- **Asset:** `src/assets/icons/seedfuel.svg`

## Check: numbers that disagree
| Fact | Sources disagree | Suggested |
|---|---|---|
| Univest users | Résumé summary 7M+; résumé body and projects.json 9M+ | 9M+ (fix the résumé summary) |
| Libgen downloads | projects.json and résumé 600K+; Play shows 500K+; résumé projects section says "600+" | 600K+ as "cumulative", or 500K+ to match Play |
| MBM downloads | projects.json and résumé 15K+; Play shows 10K+ | 10K+ to match Play |
| pub.dev packages | Résumé 11; pub.dev publisher lists 24 (14 are native_api_*) | 24 |
| FlutDev articles | Résumé 125+; blog feed reports 177 | 177 |
| Remote Jobs | Play listing returns 404 | Hide the link, or relaunch |

## projects.json changes (done in commit "projects: add Searchly…")
- **Searchly:** added after Libgen, with 4 screenshots in `screen_shots/searchly_*.webp`. **Check:** its `role` ("Personal project · Android") and `tech` (Flutter, Web Scraping) are guesses based on Libgen, which has the same `com.yaaratech` publisher.
- **Libgen:** website link and a Quillshelf point added; screenshots switched to `libgen_v3_*.webp`. The old JPEGs remain in the folder.
- **Remote Jobs:** screenshots switched to `remote_jobs_v2_*.webp`. The 404 Play link is unchanged until decided.
- **Buckrate:** link changed to https://buckrate.com/. The old screenshot stays because it's unclear whether Lokesh built the new site.
- **Not changed:** any of the disputed numbers above.

## Other data in this repo
- `recommendations.json` holds 6 LinkedIn recommendations (Univest ×2, TecoNico, Studyem ×3), loaded by `src/data/recommendations.ts` for a testimonials section. **Check:** the TecoNico recommendation mentions a Flutter role on a smart-home project that isn't on the résumé.
- `pub_packages.json` is synced daily from pub.dev by `.github/workflows/update-pub-packages.yml`.
