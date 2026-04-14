---
phase: 02-global-components
plan: 02
subsystem: ui
tags: [next.js, tailwind, lucide-react, react-server-components, sticky-cta, trust-strip]

# Dependency graph
requires:
  - phase: 02-01
    provides: Header.tsx, Footer.tsx, MobileMenuButton.tsx from @/components/layout/
  - phase: 01-foundation
    provides: siteConfig in @/content/site, globals.css @theme tokens, (marketing)/layout.tsx stub

provides:
  - StickyMobileCTA component (fixed bottom bar, mobile-only, Call Now + Free Estimate)
  - TrustStrip component (RSC 5-badge row, homepage-only — NOT in layout)
  - --sticky-cta-height: 64px CSS variable on :root
  - Marketing layout wired to real Header/Footer/StickyMobileCTA (stubs deleted)

affects: [03-homepage, 04-service-pages, 05-contact, 08-launch-prep]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "next/link Link component for all internal href navigation (never raw <a> for page routes)"
    - "env(safe-area-inset-bottom) via inline style for iPhone notch safe area on fixed elements"
    - "CSS custom property --sticky-cta-height on :root (plain CSS, not @theme Tailwind token)"
    - "TrustStrip authored at phase boundary, NOT mounted in layout — homepage (Phase 3) renders it"

key-files:
  created:
    - src/components/layout/StickyMobileCTA.tsx
    - src/components/layout/TrustStrip.tsx
  modified:
    - src/app/globals.css
    - src/app/(marketing)/layout.tsx
  deleted:
    - src/components/stubs/Header.tsx
    - src/components/stubs/Footer.tsx
    - src/components/stubs/StickyMobileCTA.tsx

key-decisions:
  - "StickyMobileCTA uses RSC (no 'use client') — no state required, href and phone.href are static"
  - "Free Estimate href = /#estimate-form on all pages — fallback anchor until Phase 5 wires /contact"
  - "TrustStrip NOT imported in marketing layout — homepage page.tsx will render it (Phase 3)"
  - "next/link Link used for internal navigation instead of <a> — satisfies @next/next/no-html-link-for-pages lint rule"

patterns-established:
  - "All internal page navigation: use next/link Link, never raw <a>"
  - "Fixed-position mobile bars: use inline style for env() safe area values"

# Metrics
duration: ~12min
completed: 2026-04-14
---

# Phase 2 Plan 02: Sticky CTA + Trust Strip + Layout Wiring Summary

**Mobile sticky CTA bar (crimson, 64px, md:hidden) + 5-badge TrustStrip RSC + full marketing layout wiring with stubs deleted**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-04-14T~00:00Z
- **Completed:** 2026-04-14T~00:12Z
- **Tasks:** 3
- **Files modified:** 7 (3 created, 2 modified, 3 deleted)

## Accomplishments

- StickyMobileCTA: fixed bottom bar with crimson bg, Call Now (tel: link) + Free Estimate (/#estimate-form), hidden md+, safe-area-inset-bottom support
- TrustStrip: RSC 5-badge row (star rating, NE license, bonded & insured, years in Omaha, GAF/Owens Corning certs) consuming siteConfig live data
- Marketing layout wired: real Header + Footer + StickyMobileCTA replace Phase 1 stubs, `<main>` gains `pb-[var(--sticky-cta-height)] md:pb-0` and preserves `id="main-content"`
- stubs directory fully deleted — zero codebase references remain
- Dev server boots clean; homepage renders real chrome + LocalBusiness JSON-LD

## Task Commits

Each task was committed atomically:

1. **Task 1: StickyMobileCTA + TrustStrip + CSS variable** - `3f61088` (feat)
2. **Task 2: Rewrite marketing layout** - `39ae8f9` (feat)
3. **Task 3: Delete stubs + fix lint** - `bb53452` (chore)

**Plan metadata:** (pending — docs commit after this summary)

## Files Created/Modified

- `src/components/layout/StickyMobileCTA.tsx` — Fixed bottom bar, mobile-only, crimson bg, Call Now + Free Estimate
- `src/components/layout/TrustStrip.tsx` — RSC 5-badge trust row; homepage renders this in Phase 3
- `src/app/globals.css` — Added `:root { --sticky-cta-height: 64px }` before `@theme` block
- `src/app/(marketing)/layout.tsx` — Rewired from stubs to real @/components/layout/* imports; `<main>` gains sticky-cta padding
- `src/components/stubs/{Header,Footer,StickyMobileCTA}.tsx` — DELETED

## Decisions Made

- StickyMobileCTA is RSC (no "use client") — no interactivity needed; static config values
- `/#estimate-form` is the Free Estimate href on all marketing pages until Phase 5 /contact exists
- TrustStrip NOT imported in marketing layout per CONTEXT.md — homepage-only component
- Used `next/link` Link for the Free Estimate button (lint rule `no-html-link-for-pages` requires this for internal routes)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Replaced `<a href="/#estimate-form">` with `next/link` Link**
- **Found during:** Task 3 (lint gate)
- **Issue:** Plan code used raw `<a>` for the Free Estimate internal link; ESLint rule `@next/next/no-html-link-for-pages` flags this as an error for page routes
- **Fix:** Added `import Link from "next/link"` and changed `<a href="/#estimate-form">` to `<Link href="/#estimate-form">` in StickyMobileCTA.tsx
- **Files modified:** `src/components/layout/StickyMobileCTA.tsx`
- **Verification:** `npm run lint` passes after fix
- **Committed in:** `bb53452` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - lint bug)
**Impact on plan:** Required for lint gate compliance. No scope creep.

## Issues Encountered

- Pre-existing dev server instances occupied ports 3000 and 3007 — dev server auto-assigned port 3003/3007. Smoke test used the available port. No code impact.

## Phase 3 Consumption Guide

**For Phase 3 homepage (`src/app/(marketing)/page.tsx`):**

```tsx
// TrustStrip — render below hero section on homepage only
import { TrustStrip } from "@/components/layout/TrustStrip"
// Then in JSX:
<TrustStrip />
```

TrustStrip is RSC — no client boundary needed. Place it directly after the hero section.

**StickyMobileCTA is already in the marketing layout** — no import needed from page.tsx.

## Next Phase Readiness

- All Phase 2 components complete: Header, MobileMenuButton, Footer, StickyMobileCTA, TrustStrip
- Marketing layout fully wired — every marketing page gets real chrome from first render
- Phase 3 (Homepage Composition) can begin immediately
- TrustStrip import path for Phase 3: `@/components/layout/TrustStrip`
- No blockers for Phase 3

---
*Phase: 02-global-components*
*Completed: 2026-04-14*
