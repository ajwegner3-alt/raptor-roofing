---
phase: 08-manual-qa-handoff
plan: 01
subsystem: qa
tags: [copy-audit, lint, placeholder, accessibility, device-testing]

# Dependency graph
requires:
  - phase: 07-deploy
    provides: live Vercel deploy, Rich Results Test pass, Lighthouse 28/28 scores >=90
provides:
  - Storm-Chaser Copy Audit completed — 1 fix applied, 1 item flagged for handoff
  - Emergency tarping hero subhead softened to match process step copy
  - 2 pre-existing lint errors fixed (UrgencyBar lazy init, MobileMenuButton close handler)
  - Stale OG placeholder comment removed from layout.tsx
  - 26 placeholder locations tagged with // PLACEHOLDER: comments in src/
  - 6/6 testimonial cards confirmed with visible amber [PLACEHOLDER] banners
  - Andrew device test confirmed on iPhone Safari + Android Chrome
affects:
  - 08-02-PLAN (HANDOFF.md content — 2-hour promise flag, placeholder inventory, demo stub revert path)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Lazy useState initializer pattern for sessionStorage SSR-safe initialization"
    - "Close-handler reset pattern — accordion state resets on close, not in effect"

key-files:
  created: []
  modified:
    - src/content/services.ts
    - src/components/layout/UrgencyBar.tsx
    - src/components/layout/MobileMenuButton.tsx
    - src/app/layout.tsx
    - src/components/sections/ContactForm.tsx
    - src/components/sections/LeadForm.tsx
    - src/content/faqs.ts

key-decisions:
  - "Emergency tarping subhead changed from 'respond immediately' to 'as fast as conditions allow' — matches process step copy"
  - "2-hour response promise NOT changed — flagged for Raptor operational confirmation in HANDOFF.md"
  - "UrgencyBar lint fix uses lazy useState initializer, eliminates the setState-in-effect entirely"
  - "MobileMenuButton lint fix moves accordion state resets into the close handler, not the open-state effect"
  - "26 // PLACEHOLDER: tags added — 0 new placeholders, existing ones made grep-discoverable"

patterns-established:
  - "All placeholder locations in src/ tagged with // PLACEHOLDER: for batch discovery via grep"

# Metrics
duration: ~30min
completed: 2026-04-15
---

# Phase 8 Plan 01: Storm-Chaser Copy Audit + QA Fixes Summary

**Copy audit passed (1 subhead fix + 2-hour promise flagged), 2 lint errors resolved, 26 placeholder tags applied, 6/6 testimonial banners verified, Andrew confirmed device test on iPhone Safari and Android Chrome**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-04-15
- **Completed:** 2026-04-15
- **Tasks:** 4 (Tasks 1-3 auto, Task 4 human-action checkpoint)
- **Files modified:** 7

## Accomplishments

- Storm-Chaser Copy Audit completed across all 8 sections — 7 PASS, 1 FIX (emergency tarping subhead softened), 1 FLAGGED for Raptor confirmation (2-hour response promise)
- Pre-existing lint errors eliminated: UrgencyBar now uses lazy `useState` initializer for sessionStorage (SSR-safe, no setState in effect); MobileMenuButton accordion state resets moved into close handler
- All placeholder locations in `src/` tagged with `// PLACEHOLDER:` comments (26 tags across site.ts, services.ts, faqs.ts, ContactForm.tsx, LeadForm.tsx) — a single `grep -rn "// PLACEHOLDER:" src/` now finds the complete inventory
- Andrew confirmed live site loads cleanly on both iPhone Safari and Android Chrome with no layout issues or broken tap targets

## Storm-Chaser Copy Audit Results

| Section | Status | Action |
|---------|--------|--------|
| Homepage Hero | PASS | None |
| WhyNotChaser | PASS | None — strongest copy on site |
| ServiceCTABand | PASS | None |
| FinalCTA "2-hour" promise | BORDERLINE | Flagged for Raptor confirmation in HANDOFF.md |
| Emergency Tarping subhead | FIX APPLIED | Softened "respond immediately" → "as fast as conditions allow" |
| About Hero | PASS (placeholder flag) | Founding year needs Raptor input |
| About story | PASS | None |
| Contact page "2-hour" promise | BORDERLINE | Same as FinalCTA — flagged for HANDOFF.md |

**2-hour promise note:** The phrase "a real Raptor crew member will follow up within 2 hours" appears in both FinalCTA and the Contact page subhead. This is not storm-chaser language, but it is an operational promise Raptor must be able to keep. Documented for HANDOFF.md — do not remove from copy without Raptor's input.

## Task Commits

Each task was committed atomically:

1. **Task 1: Storm-Chaser Copy Audit + Emergency Tarping Fix** - `cfded84` (fix)
   - `src/content/services.ts` — emergency tarping hero subhead softened
2. **Task 2: Fix Lint Errors + Stale Comment + Placeholder Tag Audit** - `ba3fafd` (fix)
   - `src/components/layout/UrgencyBar.tsx` — lazy useState initializer
   - `src/components/layout/MobileMenuButton.tsx` — accordion reset moved to close handler
   - `src/app/layout.tsx` — stale OG comment removed
   - `src/components/sections/ContactForm.tsx` — // PLACEHOLDER: tag added
   - `src/components/sections/LeadForm.tsx` — // PLACEHOLDER: tag added
   - `src/content/faqs.ts` — // PLACEHOLDER: tags added
3. **Task 3: Verify Testimonial Placeholder Banners** - `e5c90a0` (verification only)
   - No code changes — confirmed 6/6 `isPlaceholder: true` and amber banner render
4. **Task 4: Real Device Visual Check** — human action, no commit
   - Andrew confirmed iPhone Safari + Android Chrome pass

**Plan metadata:** (this commit — docs(08-01))

## Files Created/Modified

- `src/content/services.ts` — Emergency tarping hero subhead changed from "We respond immediately — day or night" to "Storm hit tonight? We dispatch a crew as fast as conditions allow — day or night"
- `src/components/layout/UrgencyBar.tsx` — Replaced `useEffect` + `setDismissed(true)` with lazy `useState(() => typeof window !== 'undefined' && sessionStorage?.getItem(SESSION_KEY) === '1')` initializer; eliminates the `react-hooks/set-state-in-effect` violation
- `src/components/layout/MobileMenuButton.tsx` — Moved `setServicesOpen(false)` and `setAreasOpen(false)` calls from the `open`-watching `useEffect` into the close handler function; eliminates the `react-hooks/set-state-in-effect` violation
- `src/app/layout.tsx` — Removed stale `// PLACEHOLDER: create in Phase 6` comment (file now exists at `public/og/default.jpg`)
- `src/components/sections/ContactForm.tsx` — Added `// PLACEHOLDER:` tag to hardcoded `Licensed NE #[PLACEHOLDER]` string (line ~287)
- `src/components/sections/LeadForm.tsx` — Added `// PLACEHOLDER:` tag to hardcoded `Licensed NE #[PLACEHOLDER]` string (line ~274)
- `src/content/faqs.ts` — Added `// PLACEHOLDER:` tags to 3 FAQ answers with inline `[PLACEHOLDER]` content (siding cost ranges, warranty years, emergency tarping cost)

## Placeholder Tag Inventory

After Task 2, `grep -rn "// PLACEHOLDER:" src/` returns 26 tags covering:

| Location | Tags | What |
|----------|------|------|
| `src/content/site.ts` | ~20 | Address, ZIP, email, license #, review count/rating, social URLs, certifications |
| `src/content/services.ts` | ~1 | Hero image alt text |
| `src/content/faqs.ts` | 3 | Siding costs, warranty years, emergency tarping cost |
| `src/components/sections/ContactForm.tsx` | 1 | Hardcoded `Licensed NE #[PLACEHOLDER]` string |
| `src/components/sections/LeadForm.tsx` | 1 | Hardcoded `Licensed NE #[PLACEHOLDER]` string |

**Critical note for HANDOFF.md:** ContactForm.tsx and LeadForm.tsx have the license number hardcoded (not reading from `siteConfig`). When the real license number arrives, THREE locations need updating: `siteConfig.license.number` in site.ts, plus both hardcoded strings in the form components.

## Testimonial Banner Verification

All 6 testimonials confirmed `isPlaceholder: true` in `src/content/testimonials.ts`. The `TestimonialCarousel.tsx` component renders a visible amber `[PLACEHOLDER] Sample testimonial — will be replaced with real review before launch` banner on every card. QA-06 verified — no code changes needed.

## Decisions Made

- Emergency tarping subhead softened to match the more careful language already used in the service page process steps — this eliminates a copy inconsistency and reduces FTC/operational risk
- 2-hour response promise deliberately NOT changed — it is not storm-chaser language, but it needs Raptor's operational confirmation. Documented in HANDOFF.md scope (Plan 08-02)
- Lint errors fixed surgically without changing component logic — lazy initializer and close-handler patterns are more correct React patterns anyway
- Script warnings in `scripts/check-bundle-size.mjs` and `scripts/extract-lighthouse-scores.mjs` left as-is — they are non-blocking and out of scope for this plan

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. All tasks completed without unexpected blockers.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 08-01 complete: codebase is clean, copy is audited, lint is clean, placeholders are tagged
- Ready for 08-02: HANDOFF.md, README.md, FUTURE_DIRECTIONS.md creation
- 08-02 inputs confirmed available: demo stub revert path documented in 08-RESEARCH.md, placeholder inventory complete, 2-hour promise flagged for inclusion in HANDOFF.md
- One concern: 38 total placeholders (0 resolvable without Raptor) — HANDOFF.md must make the prioritization clear so Raptor knows what to tackle first vs. what can wait

---
*Phase: 08-manual-qa-handoff*
*Completed: 2026-04-15*
