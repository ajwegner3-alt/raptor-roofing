---
phase: 06-seo-performance-accessibility
plan: 05
subsystem: performance
tags: [lighthouse, bundle-size, performance, seo-audit]
---

# 06-05 Summary: Performance Audit + Lighthouse Gate

## Status: COMPLETE (checkpoint approved implicitly via redirect)

## What Was Built

### scripts/check-bundle-size.mjs (76442cd)
Node ESM script reads `npm run build` output, parses the route table, exits 1 if any route exceeds 200 KB First Load JS. Wired as `npm run check:bundle`.

### scripts/extract-lighthouse-scores.mjs (8389b85)
Node ESM script reads Lighthouse JSON report files, extracts `lhr.categories.<pillar>.score * 100`, produces SCORES.md table, exits 1 if any pillar < 90.

### Google Maps lazy facade (c13efc7)
/contact page's eager Google Maps iframe was loading ~300 KB of Maps API JS, causing Lighthouse Performance 68. Replaced with `MapFacade` client component that defers the iframe until user clicks "View Map". Performance improved to 96.

### Lighthouse reports (f1538f6)
7 HTML + 7 JSON reports generated against live Vercel URL. All 28 scores ≥90:

| Route | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| home | 93 | 97 | 100 | 92 |
| about | 96 | 97 | 100 | 100 |
| contact | 96 | 97 | 100 | 100 |
| services-roofing | 92 | 94 | 100 | 92 |
| services-siding | 91 | 94 | 100 | 92 |
| services-gutters | 94 | 94 | 100 | 92 |
| services-emergency-tarping | 94 | 94 | 100 | 92 |

## Post-Plan Work (off-roadmap, same session)

After the Lighthouse checkpoint, Andrew redirected to fix a Vercel build crash and add content gaps. These commits shipped AFTER 06-05's Lighthouse run:

- `68e19c3` — Removed sitemap.ts throw guard (was crashing Vercel builds without NEXT_PUBLIC_SITE_URL)
- `48b045a` — Added 8 service area pages at /service-areas/[slug]
- `4a0d283` — Header nav dropdowns for Services + Service Areas
- `2970b4c` — Enriched service area pages with neighborhoods, local challenges, housing context
- `3e3d41c` — FinalCTA mid-page/bottom CTAs on service pages + scroll-triggered UrgencyBar

## Decisions

- D-06-05-01: Lighthouse target = live Vercel URL (not localhost) per RESEARCH.md Q12
- D-06-05-02: Google Maps iframe replaced with lazy MapFacade to pass Performance gate
- D-06-05-03: sitemap.ts throw guard removed post-plan — silent fallback to vercel.app URL (Andrew's directive: no env var crashes on demo sites)
- D-06-05-04: reCAPTCHA exception not needed — MapFacade fix resolved /contact perf without lazy-loading reCAPTCHA

## Requirements Covered

PRF-01 through PRF-08 (performance budget, priority images, client component scope, Lighthouse gates)
