---
phase: 06-seo-performance-accessibility
plan: 03
subsystem: assets
tags: [images, webp, hero, og-card, performance, lcp, placeholder, phase8-handoff]

requires:
  - phase: 01-foundation
    provides: public/ directory scaffold, Next.js Image component available
  - phase: 02-global-components
    provides: Hero.tsx referencing /images/hero-placeholder.jpg
  - phase: 04-service-pages
    provides: services.ts with 4 service hero image paths
  - phase: 05-about-contact
    provides: AboutHero.tsx already referencing /images/about-hero.webp

provides:
  - 7 placeholder image files: 6 WebP hero images + 1 OG card JPEG
  - public/images/SOURCES.md with Unsplash license docs + Phase 8 handoff checklist
  - Hero.tsx + services.ts code paths updated to actual file names (no more -placeholder.jpg)
  - Zero *-placeholder.jpg references remain in src/
  - npm run build passes clean (13 static pages, TypeScript OK)

affects:
  - phase: 07-deployment-prep
    note: OG card (public/og/default.jpg) now exists — og:image meta resolves at deploy
  - phase: 08-handoff
    note: All 7 placeholder files in public/images/SOURCES.md MUST be replaced with real Raptor photos before public launch

tech-stack:
  added: []
  patterns:
    - Unsplash Imgix URL params for server-side format/size/crop control (no local tooling needed)
    - Single-source photo + crop params as pitch-phase image variety strategy

key-files:
  created:
    - public/images/hero.webp
    - public/images/about-hero.webp
    - public/images/roofing-hero.webp
    - public/images/siding-hero.webp
    - public/images/gutters-hero.webp
    - public/images/emergency-tarping-hero.webp
    - public/og/default.jpg
    - public/images/SOURCES.md
  modified:
    - src/components/sections/Hero.tsx (line 36: src path)
    - src/content/services.ts (lines 87, 140, 192, 253: 4 service hero paths)
  deleted:
    - public/images/hero-placeholder.jpg
    - public/images/HERO_CREDIT.txt

decisions:
  - id: D-06-03-01
    decision: Single Unsplash photo reused for all 6 WebP hero slots via Imgix crop params
    rationale: >
      Training data cutoff pre-August 2025 means Claude cannot predict which additional
      Unsplash photo slugs are valid without risking 404s. The one verified slug
      (photo-1604709177225-055f99402ea3, confirmed present in hero-placeholder.jpg from
      prior Task 1 audit) was reused. Imgix crop variants (top/bottom/left/right/center)
      produce different frame positions from the same source. Phase 8 handoff replaces
      all 7 with real Raptor job-site photos.
    alternatives-considered:
      - Guess additional Unsplash slugs — rejected (high 404 risk)
      - Leave files missing — rejected (broken <img> renders in build, affects LCP audit)
      - Copy hero-placeholder.jpg 6x as JPG — rejected (OG card needed exact 1200x630 crop,
        WebP format required for LCP targets)

  - id: D-06-03-02
    decision: Final WebP params w=1280 q=50 (not w=1920 q=75 as originally specified)
    rationale: >
      This roofing/shingles photo has high-frequency texture detail that resists WebP
      compression. q=75 at w=1920 produced 281 KB; q=60 produced 192 KB; q=60 at w=1600
      produced 136 KB. Only w=1280 q=50 landed under the 100 KB budget at ~70 KB per file.
      Visual quality at q=50 is acceptable for a pitch build behind Next.js Image's
      automatic srcset optimization. Phase 8 handoff: encode real photos at q=75 or higher.
    files-affected:
      - All 6 WebP hero files recompressed

metrics:
  duration: ~8 min
  completed: 2026-04-15
---

# Phase 6 Plan 03: Image Assets Summary

**One-liner:** 7 Unsplash placeholder images (6 WebP heroes + 1 OG card) sourced autonomously,
code paths updated, build verified — Phase 8 swaps all with real Raptor photos.

## What Was Built

### Image files shipped

| File | Format | Dimensions | Size | Crop |
|---|---|---|---|---|
| public/images/hero.webp | WebP | 1280px wide | 70 KB | center (default) |
| public/images/about-hero.webp | WebP | 1280px wide | 70 KB | top |
| public/images/roofing-hero.webp | WebP | 1280px wide | 70 KB | bottom |
| public/images/siding-hero.webp | WebP | 1280px wide | 70 KB | left |
| public/images/gutters-hero.webp | WebP | 1280px wide | 70 KB | right |
| public/images/emergency-tarping-hero.webp | WebP | 1280px wide | 70 KB | center |
| public/og/default.jpg | JPEG | 1200x630 | 105 KB | center (fit=crop) |

All sourced from Unsplash photo `photo-1604709177225-055f99402ea3` (residential roofing scene).
License: Unsplash License — free for commercial use, no attribution required.

### Code paths updated

| File | Old path | New path |
|---|---|---|
| src/components/sections/Hero.tsx:36 | /images/hero-placeholder.jpg | /images/hero.webp |
| src/content/services.ts:87 | /images/roofing-hero-placeholder.jpg | /images/roofing-hero.webp |
| src/content/services.ts:140 | /images/siding-hero-placeholder.jpg | /images/siding-hero.webp |
| src/content/services.ts:192 | /images/gutters-hero-placeholder.jpg | /images/gutters-hero.webp |
| src/content/services.ts:253 | /images/emergency-tarping-placeholder.jpg | /images/emergency-tarping-hero.webp |

Note: `src/components/sections/AboutHero.tsx` already referenced `/images/about-hero.webp`
(no change needed — file now exists). `src/app/layout.tsx` + `src/lib/metadata.ts` already
referenced `/og/default.jpg` (no change needed — file now exists).

### Files removed

- `public/images/hero-placeholder.jpg` — superseded by hero.webp
- `public/images/HERO_CREDIT.txt` — content migrated to SOURCES.md

## Strategy: Single-Photo Pitch Images (Why, Not a Design Choice)

This is a deliberate technical limitation of the autonomous execution, NOT a design choice:

Claude's training data cuts off before August 2025. Unsplash photo slugs are not stable
or predictable from training knowledge — any guessed slug risks returning a 404 or
wrong-subject image. Rather than ship broken `<img>` tags across 6 pages, the one
verified-working slug from the existing `hero-placeholder.jpg` was reused with different
Imgix `crop=` params to produce 6 distinct image frames.

This is appropriate for a pitch build. The site will never go to production with these
placeholder images — Phase 8 handoff supplies real Raptor crew photos.

## Verification

- `npm run build` passed clean: 13 static pages generated, TypeScript OK, zero errors
- All 7 files verified via Node magic-byte check (WebP: RIFF+WEBP header, JPEG: ff d8)
- Zero `*-placeholder.jpg` references remain in src/ (grep confirmed)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Compression iteration required to meet 100 KB budget**

- **Found during:** Task 1 (photo download)
- **Issue:** Target photo has high-frequency shingle texture that resists WebP compression.
  q=75 at w=1920 produced 281 KB. q=60 at w=1920 produced 192 KB. q=60 at w=1600
  produced 136 KB. Three retries were needed.
- **Fix:** Final params: w=1280 q=50 → 70 KB per file (within budget)
- **Files modified:** All 6 WebP hero files
- **Decision:** See D-06-03-02

**2. [Context] SOURCES.md Unsplash URL format adjusted**

- **Found during:** Writing SOURCES.md
- **Issue:** The canonical Unsplash photo page URL format changed between training data
  and current Unsplash routing. SOURCES.md uses photo slug in the URL but notes
  "TODO (look up on Unsplash)" for photographer name — Phase 8 handoff should verify.

## Phase 8 Handoff Actions (Critical Before Public Launch)

All 7 files in `public/images/` and `public/og/` are placeholder Unsplash images.
Phase 8 MUST replace them before any public Google indexing or client delivery.

| Priority | File | Replacement needed |
|---|---|---|
| HIGH | hero.webp | Raptor crew on a job site or aerial roof photo |
| HIGH | about-hero.webp | Owner/team portrait or crew on a job |
| HIGH | og/default.jpg | Branded OG card: Raptor logo + tagline + photo at 1200x630 |
| MED | roofing-hero.webp | Completed roof replacement project photo |
| MED | siding-hero.webp | Completed siding installation photo |
| MED | gutters-hero.webp | Seamless gutter installation photo |
| MED | emergency-tarping-hero.webp | Emergency tarp crew in action |

After supplying real photos, re-encode at w=1920 q=75 (WebP) — the original target.
Real photos will likely compress better than the uniform-texture stock image used here.

## Git Commits

| Commit | Hash | Description |
|---|---|---|
| 1 | 3223ad9 | chore(06-03): add 7 placeholder hero photos from Unsplash |
| 2 | e5456ba | chore(06-03): remove legacy hero-placeholder.jpg and HERO_CREDIT.txt |
| 3 | fbaeb07 | fix(06-03): update hero image paths to new webp files |
| 4 | (metadata) | docs(06-03): complete image assets plan |

## Next Phase Readiness

Phase 7 (deploy) is unblocked:
- OG card exists at /og/default.jpg — og:image meta will resolve
- All hero images exist — no broken image renders in prod
- Build passes clean — deployable to Vercel now

No blockers introduced.
