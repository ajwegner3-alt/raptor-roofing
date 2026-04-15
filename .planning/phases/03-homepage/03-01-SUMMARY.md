---
phase: 03-homepage
plan: 01
subsystem: ui
tags: [next/image, react-server-component, hero, lcp, tailwind, lucide-react]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: siteConfig shape (phone.href, reviews, founding, license)
  - phase: 01-foundation
    provides: globals.css brand tokens including --color-overlay and font-display/font-body
  - phase: 02-global-components
    provides: Header h-16/lg:h-20 sticky height (used in hero min-h calc)
provides:
  - RSC Hero section component at src/components/sections/Hero.tsx
  - Real JPEG hero photograph at public/images/hero-placeholder.jpg (1920x1280, 322KB)
  - Attribution file at public/images/HERO_CREDIT.txt
affects: [03-02, 03-03, 03-04, 04-service-pages]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "sections/ directory established for homepage section components (RSC pattern)"
    - "named export: export function Hero() — matches Phase 2 layout component style"
    - "next/image fill + priority + fetchPriority='high' pattern for LCP optimization"
    - "Dark overlay via --color-overlay CSS var sibling div (not filter/mix-blend)"
    - "100dvh not 100vh for iOS Safari address-bar safety"

key-files:
  created:
    - src/components/sections/Hero.tsx
    - public/images/hero-placeholder.jpg
    - public/images/HERO_CREDIT.txt
  modified: []

key-decisions:
  - "Used Unsplash fallback #2 (photo-1604709177225): primary + fallback #1 returned HTTP 404"
  - "Micro-trust license rendered as literal 'Licensed NE #[PLACEHOLDER]' — siteConfig.license.number contains ugly comment string, plan specified cleaner static literal"
  - "sections/ directory created fresh — did not exist before this plan"
  - "Named export (not default) to match Phase 2 layout component import style"

patterns-established:
  - "Section components live in src/components/sections/ and are named exports"
  - "Hero is RSC (no use client) — no interactivity needed, all values from siteConfig"
  - "fetchPriority='high' on next/image is mandatory for above-fold images"

# Metrics
duration: 2min
completed: 2026-04-15
---

# Phase 3 Plan 01: Hero Section Summary

**RSC hero section with real 1920x1280 JPEG photograph, dark overlay, locked family-owned headline, micro-trust line, and dual crimson/slate CTAs; passes tsc + eslint.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-15T00:13:48Z
- **Completed:** 2026-04-15T00:15:15Z
- **Tasks:** 2
- **Files modified:** 3 created, 0 modified

## Accomplishments

- Downloaded real JPEG photograph (1920x1280, 322KB) from Unsplash to `public/images/` for LCP-safe local serving
- Built full-viewport RSC Hero with `next/image` `priority` + `fetchPriority="high"` for LCP optimization
- Implemented locked copy ("The Family-Owned Roofer Omaha Calls Back."), dual CTAs meeting 48px tap target, and micro-trust line from siteConfig

## Task Commits

1. **Task 1: Download hero photograph** — `bb252c9` (chore)
2. **Task 2: Build Hero.tsx RSC section component** — `91d3c9e` (feat)

**Plan metadata:** (to follow in final commit)

## Files Created/Modified

- `src/components/sections/Hero.tsx` — Full-viewport RSC hero section (72 lines)
- `public/images/hero-placeholder.jpg` — 1920x1280 JPEG, Unsplash photo-1604709177225, 322KB
- `public/images/HERO_CREDIT.txt` — Source URL + Unsplash License attribution

## Decisions Made

- **Unsplash fallback used:** Primary URL (photo-1632759145355-8b8f0c6b7f3e) returned HTTP 404. Fallback #1 (photo-1632759145355-92c48ba1f9df) also 404'd. Fallback #2 (photo-1604709177225) returned HTTP 200 with valid 1920x1280 JPEG.
- **License number rendered as literal placeholder:** `siteConfig.license.number` contains a code comment string. Plan specified rendering the cleaner static text `Licensed NE #[PLACEHOLDER]` instead of the raw comment value — applied as instructed.
- **Named export pattern:** Used `export function Hero()` (not default export) to match the Phase 2 layout component import convention.

## Deviations from Plan

None — plan executed exactly as written. Unsplash URL fallback was within the plan's documented fallback sequence (not a deviation).

## Issues Encountered

- Primary and first fallback Unsplash photo IDs returned HTTP 404 (likely expired or removed from CDN). Resolved by using the second fallback URL from the plan's explicit fallback list.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `Hero.tsx` is importable as `{ Hero }` from `@/components/sections/Hero` — ready for `page.tsx` composition in 03-04
- `public/images/hero-placeholder.jpg` is committed to repo; `next/image` will serve it without a 404 at runtime
- No blocking concerns for downstream plans (03-02 ServiceGrid, 03-03 LeadForm, 03-04 page composition)
- The `#estimate-form` anchor target referenced by the hero CTA does not exist until 03-04 ships LeadForm — scroll is a no-op until then, which is expected and documented in STATE.md

---
*Phase: 03-homepage*
*Completed: 2026-04-15*
