# Assets

Optimized assets for the portfolio. Originals stay in `raw_assets/` (not committed); everything here is WebP or SVG, sized for the site. Astro's image pipeline resizes these further at build time.

## Portrait
| File | Size | Source |
|---|---|---|
| `portrait.webp` | 943×1268, 67 KB, transparent | `raw_assets/profile_image.png`, subject lifted on-device with Apple Vision (`VNGenerateForegroundInstanceMaskRequest`), trimmed |

## App icons (`icons/`)
| File | Size | Source |
|---|---|---|
| `univest.webp` | 512 | Play Store listing icon (`com.univest.capp`) |
| `scalper.svg` | vector | Redrawn from `raw_assets/scalper_icon.png` (36×48 original) |
| `pushpatch.svg` | vector | `raw_assets/push_patch.svg` |
| `incognito-vault.webp` | 400 | `raw_assets/incognito_vault.webp` |
| `libgen.webp` | 512 | Play Store listing icon (`com.yaaratech.libgen`); matches `raw_assets/libgen.webp` |
| `quillshelf.webp` | **64 only** | libgen-d4497.web.app; needs a 512 px original |
| `remote-jobs.webp` | 512 | `raw_assets/remote_jobs.png` |
| `mbm-e-learning.webp` | 512 | Play Store listing icon (`com.mbm.elereaning.mbmecj`) |
| `searchly.webp` | 512 | Play Store listing icon (`com.yaaratech.x1337`) |
| `seedfuel.svg` | vector | lkrjangid1.github.io/seedfuel favicon |

No icon exists yet for native-api-bindgen, Buckrate (text logo only), OI Visualizer, Raksha, FinSight AI, research assistant, Greenhouse or Weblm. These use the monogram squircle from the design system.

## Screenshots (`shots/`)
| Folder | Files | Source |
|---|---|---|
| `libgen/` | home, search, book-details, download-links, library, reader, reader-settings, streak, magazines (900×~2000) | v3 screens from libgen-d4497.web.app |
| `searchly/` | feature (1024×500), light, dark, search, bookmark, settings (1080×1920, store-framed) | Play Store listing |
| `remote-jobs/` | home, search, bookmark (288×512, store-framed) | `raw_assets/remote_jobs_*.png`; low resolution |
| `buckrate/` | site (1440×900) | Capture of buckrate.com hero, Oct 2026 |

All other project screenshots still load from `projects.json` (`screen_shots/` in the lkrjangid1 profile repo) and are optimized at build time.

## Files
| File | Source |
|---|---|
| `public/resume.pdf` | Weebly upload `lkrjangid_multi.pdf` (3 pages) |

## Open-source contributions (`oss/`)
| File | Size | Source |
|---|---|---|
| `hacktoberfest-2020-2021.webp` | 1067×800, 102 KB | Weebly upload `chatgpt-image-aug-2-2026-09-54-24-am_orig.png` (designed graphic of 2020 and 2021 swag) |
| `holopin-board.webp` | 2428×764, 102 KB | https://holopin.me/lkrjangid, captured Oct 17, 2026 with 6 badges. Re-download it when new badges arrive. |
