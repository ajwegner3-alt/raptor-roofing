---
phase: 07-deploy
plan: 01
subsystem: ui
tags: [nextjs, react, forms, demo, vercel, deploy]

# Dependency graph
requires:
  - phase: 06-seo-perf-a11y
    provides: Forms built and live on /contact and service pages
provides:
  - ContactForm with demo-mode success stub (always shows success card)
  - LeadForm with demo-mode success stub (always shows success card)
  - Vercel auto-deploy triggered via push to origin/master
affects: [07-02, 08-manual-qa]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Demo-mode form stub: void data + unconditional setStatus('success') in try block, catch block untouched"

key-files:
  created: []
  modified:
    - src/components/sections/ContactForm.tsx
    - src/components/sections/LeadForm.tsx

key-decisions:
  - "Option-(a) client-side stub chosen: ignore API response, always show success — avoids any env var dependency"
  - "void data pattern used to consume unused const data reference without removing the await res.json() call"
  - "Catch blocks left untouched so true network errors still surface in demo"
  - "Pre-existing lint errors in MobileMenuButton and UrgencyBar are not regressions from this plan"

patterns-established:
  - "Demo stub pattern: three-line replacement (comment + void data + setStatus) in try block only"

# Metrics
duration: 8min
completed: 2026-04-15
---

# Phase 7 Plan 01: Demo-Mode Form Stubs Summary

**Client-side form success stub applied to ContactForm and LeadForm so pitch demo always shows success card regardless of /api/contact response, then pushed to origin/master triggering Vercel auto-deploy**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-04-16T03:11:00Z
- **Completed:** 2026-04-16T03:19:21Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Applied DEMO MODE comment + `void data` + unconditional `setStatus('success')` to ContactForm.tsx (lines 130-135)
- Applied DEMO MODE comment + `void data` + unconditional `setStatus("success")` to LeadForm.tsx (lines 50-54)
- TypeScript type check clean (zero errors)
- Both form files lint clean (zero issues in ContactForm or LeadForm)
- npm run build passed — 21 routes generated, TypeScript clean
- Pushed to origin/master (69ccc92..97124b2), Vercel auto-deploy triggered
- Live site and sitemap both returning HTTP 200 pre-push

## Task Commits

Each task was committed atomically:

1. **Task 1: Apply demo-mode form stubs to ContactForm and LeadForm** - `97124b2` (feat)
2. **Task 2: Verify deploy infrastructure, build locally, commit, push** - included in Task 1 commit per plan spec (no separate code commit — Task 2 IS the build + push step)

**Plan metadata:** (this summary commit)

## Files Created/Modified

- `src/components/sections/ContactForm.tsx` - DEMO MODE stub in try block lines 130-135; catch block untouched
- `src/components/sections/LeadForm.tsx` - DEMO MODE stub in try block lines 50-54; catch block untouched

## Decisions Made

- Used `void data` to consume the `const data = await res.json()` reference rather than removing the fetch call or renaming the variable — keeps the network round-trip intact and satisfies TypeScript/ESLint without suppression comments
- Left catch blocks completely untouched so genuine network failures (timeouts, DNS failures) still surface the error card — the stub is for the API returning `{success:false}` only
- Pre-existing lint errors in `MobileMenuButton.tsx` (react-hooks/set-state-in-effect) and `UrgencyBar.tsx` (react-hooks/set-state-in-effect) are pre-existing, unrelated to this plan, and did not block the build — documented here for awareness

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- `npm run lint` exits 1 due to two pre-existing `react-hooks/set-state-in-effect` errors in `MobileMenuButton.tsx` and `UrgencyBar.tsx`. These are not regressions from this plan. Both form files lint clean. Build passes (Next.js build uses its own TypeScript check, not ESLint --fail-on-warn). Documented as technical debt for Phase 8.

## User Setup Required

None - no external service configuration required. Vercel auto-deploy is triggered by the push.

## Next Phase Readiness

- Phase 7-02 (Rich Results Test + Analytics toggle) can now run against the freshly deployed code
- Raptor Roofing is live at https://raptor-roofing.vercel.app with demo-safe forms
- Two pre-existing lint errors (MobileMenuButton, UrgencyBar) should be addressed in Phase 8 Manual QA before client handoff
- DEMO MODE stubs in both forms must be removed before production/real deploy (marked with inline comments)

---
*Phase: 07-deploy*
*Completed: 2026-04-15*
