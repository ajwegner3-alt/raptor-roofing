---
phase: 03-homepage
plan: 02
subsystem: ui
tags: [nextjs, react, rsc, lucide-react, tailwind, sections, homepage]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: services.ts content with 4 service entries and iconName fields
  - phase: 02-shell
    provides: globals.css brand tokens (primary-*, accent-*, neutral-*, bg-surface, bg-background)

provides:
  - ServiceGrid RSC — section#services with 4 cards mapped from services.ts, iconMap, next/link to /services/{slug}
  - WhyNotChaser RSC — two-column side-by-side comparison, 5 locked pairs, accent/primary column treatments
  - Insurance3Step RSC — 3 horizontal numbered cards (Inspect/Document/Coordinate) with lucide icons

affects:
  - 03-04 (page.tsx composition imports all 3 components)
  - Phase 4 service pages (ServiceGrid links forward to /services/{slug})

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Explicit iconMap const pattern for Tailwind v4 CSS-first safety (no dynamic class strings)"
    - "RSC-only sections — zero client bundle inflation for static content"
    - "as const + keyof typeof for type-safe icon lookup from string field"

key-files:
  created:
    - src/components/sections/ServiceGrid.tsx
    - src/components/sections/WhyNotChaser.tsx
    - src/components/sections/Insurance3Step.tsx
  modified: []

key-decisions:
  - "Used string slice (140 chars) for service card descriptions — deterministic, no plugin required"
  - "WhyNotChaser comparison array mapped twice (left/right) rather than split render — cleaner sync"
  - "Insurance3Step steps typed with LucideIcon interface rather than as const — allows Icon destructuring"
  - "accent-* (crimson) for chaser column, primary-* (slate-teal) for Raptor column — semantic color alignment"

patterns-established:
  - "iconMap const: explicit object with lucide components keyed by iconName string from content layer"
  - "RSC section pattern: aria-labelledby + h2 id for accessibility, no client directive"
  - "Comparison component: local const array mapped to both columns for parallel structure"

# Metrics
duration: 2min
completed: 2026-04-15
---

# Phase 3 Plan 02: Services / Why / Insurance Sections Summary

**Three RSC homepage sections — ServiceGrid (4 service cards with icon lookup map), WhyNotChaser (5-pair anti-chaser comparison), Insurance3Step (Inspect/Document/Coordinate numbered cards) — all passing tsc + lint, zero client bundle impact**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-15T00:14:12Z
- **Completed:** 2026-04-15T00:16:09Z
- **Tasks:** 3
- **Files modified:** 3 created

## Accomplishments

- ServiceGrid with `id="services"` + `scroll-mt-16 lg:scroll-mt-20` anchor target, 4 cards from services.ts via explicit iconMap, each card links to `/services/{slug}` via next/link
- WhyNotChaser with 5 locked comparison pairs — accent-tinted (crimson) chaser column with X/XCircle icons, primary-tinted (slate-teal) Raptor column with Check/CheckCircle icons; stacks mobile, 2-col lg+
- Insurance3Step with exactly 3 horizontal numbered cards (Inspect/Document/Coordinate) using FileSearch/Camera/Handshake icons; stacks mobile, md:grid-cols-3 desktop

## Task Commits

Each task was committed atomically:

1. **Task 1: Build ServiceGrid.tsx with 4 service cards** - `d92586e` (feat)
2. **Task 2: Build WhyNotChaser.tsx side-by-side comparison** - `ac4fa22` (feat)
3. **Task 3: Build Insurance3Step.tsx three horizontal numbered cards** - `e73450a` (feat)

**Plan metadata:** (pending)

## Files Created/Modified

- `src/components/sections/ServiceGrid.tsx` — RSC, section#services, 4 cards with iconMap, next/link to /services/{slug}
- `src/components/sections/WhyNotChaser.tsx` — RSC, 5-pair comparison table, crimson vs slate-teal columns
- `src/components/sections/Insurance3Step.tsx` — RSC, 3 numbered cards with FileSearch/Camera/Handshake icons

## Decisions Made

- **String slice for descriptions:** Service descriptions from services.ts are full paragraphs (200+ chars). Used `slice(0, 140).trimEnd() + "…"` — deterministic, no Tailwind plugin needed. Plan specified this approach.
- **LucideIcon type for steps array:** Insurance3Step uses `LucideIcon` interface type instead of `as const` because `as const` on objects with component references requires `typeof X` type extraction which is noisier. The `LucideIcon` interface cleanly types the Icon field.
- **Crimson = chaser, slate-teal = Raptor:** Semantic color assignment — accent (crimson) signals "danger/warning" for storm chaser behaviors; primary (slate-teal) signals trust/positive for Raptor. Consistent with brand token intent from globals.css.
- **WhyNotChaser maps same comparison array for both columns:** Rather than two separate arrays, one `comparison` array is mapped twice (once for left `.chaser`, once for right `.raptor`). This guarantees parallel structure and makes content editing trivial.

## Deviations from Plan

None — plan executed exactly as written.

All icons confirmed present in lucide-react v1.8.0 before implementation:
- ServiceGrid: Home, Layers, Droplets, AlertTriangle, ArrowRight — all confirmed
- WhyNotChaser: X, Check, XCircle, CheckCircle — all confirmed
- Insurance3Step: FileSearch, Camera, Handshake — all confirmed. Note: `Handshake` (correct) not `HandShake` (wrong) — verified.

Card grid breakpoints used:
- ServiceGrid: `sm:grid-cols-2 lg:grid-cols-4` (1 col → 2 col → 4 col)
- WhyNotChaser: `lg:grid-cols-2` (1 col → 2 col)
- Insurance3Step: `md:grid-cols-3` (1 col → 3 col)

WhyNotChaser attacks behaviors only — copy references "out-of-state crews" and "Storm chaser crews" generically. No named competitors. No specific business is referenced.

No files contain `"use client"`. All 3 are pure RSCs.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 3 components ready for import in 03-04 page.tsx composition
- ServiceGrid forward-references `/services/{slug}` — links will 404 until Phase 4 ships service pages (expected behavior)
- WhyNotChaser and Insurance3Step are fully static, no data dependencies

---
*Phase: 03-homepage*
*Completed: 2026-04-15*
