---
phase: 02-global-components
plan: 01
subsystem: ui
tags: [next.js, react, tailwind, lucide-react, schema-dts, json-ld, accessibility, mobile-nav]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: siteConfig, services, serviceAreas, schema helpers (JsonLd, localBusinessSchema)
provides:
  - Header.tsx — RSC sticky marketing header with desktop nav and mobile collapsed bar
  - MobileMenuButton.tsx — client component hamburger with full-screen overlay and a11y features
  - Footer.tsx — RSC 4-column footer with NAP, services, areas, legal, social, LocalBusiness JsonLd
affects:
  - 02-02-global-components (layout rewire that imports these components to replace stubs)
  - All future phases that use the marketing layout (Header/Footer now render on every page)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - RSC/client boundary — Header+Footer are RSC, only MobileMenuButton is client ("use client")
    - JsonLd schema anchor in Footer RSC — every marketing page inherits LocalBusiness schema through layout
    - 100dvh for mobile overlay — iOS Safari dynamic viewport safety
    - Focus trap + scroll lock pattern for accessible full-screen mobile nav overlay

key-files:
  created:
    - src/components/layout/Header.tsx
    - src/components/layout/MobileMenuButton.tsx
    - src/components/layout/Footer.tsx
  modified: []

key-decisions:
  - "lucide-react in installed version lacks Facebook/Instagram icons — substituted ExternalLink/Share2 as generic social link indicators"
  - "Footer hours rendering uses h.closed || h.open === '' guard to handle Sunday's closed boolean + empty string open field"
  - "Footer address uses siteConfig.address.state + .zip (not .region + .postalCode per plan template) — adapted to actual data shape"

patterns-established:
  - "RSC layout components import siteConfig directly — no props passing needed for brand globals"
  - "MobileMenuButton: backdrop tap-close via onClick on overlay root div; children call setOpen(false) so bubbling is no-op"
  - "Tel: links always use siteConfig.phone.href — never siteConfig.phone.display as href"

# Metrics
duration: 2min
completed: 2026-04-14
---

# Phase 2 Plan 01: Header / MobileMenuButton / Footer Summary

**RSC sticky header with slate-teal + crimson CTA, accessible full-screen mobile overlay (focus trap/ESC/scroll-lock/backdrop-close), and 4-column RSC footer anchoring LocalBusiness JSON-LD for every marketing page**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-14T12:29:14Z
- **Completed:** 2026-04-14T12:31:07Z
- **Tasks:** 3 (all in one atomic commit)
- **Files modified:** 3 created

## Accomplishments

- RSC Header with sticky slate-teal background, logo + wordmark, 3-link desktop nav, crimson tel: phone button (desktop), 48×48 phone icon + hamburger (mobile)
- Client-only MobileMenuButton: full-screen bg-primary-900 overlay at 100dvh, ESC handler, Tab focus trap, body scroll+touchAction lock, backdrop tap-close, Call Now crimson button, "Licensed · Insured · N Years" trust row
- RSC Footer: 4 columns (NAP+hours, services, service areas, legal+social), `<JsonLd data={localBusinessSchema()} />` mounted so every marketing page inherits LocalBusiness schema, all tel: links use phone.href, social icon tap targets 48×48

## Task Commits

1. **Tasks 1-3: Header + MobileMenuButton + Footer** - `1ba3725` (feat)

**Plan metadata:** (next commit — docs)

## Files Created/Modified

- `src/components/layout/Header.tsx` — RSC sticky marketing header
- `src/components/layout/MobileMenuButton.tsx` — "use client" hamburger + full-screen overlay
- `src/components/layout/Footer.tsx` — RSC 4-column footer with LocalBusiness JsonLd

## Decisions Made

- Facebook/Instagram icons not available in installed lucide-react — substituted ExternalLink and Share2 (generic, functionally equivalent for now; real brand icons can be added in Phase 8 when logo assets arrive)
- Footer hours rendering: checked `h.closed || h.open === ""` because site.ts Sunday entry uses `open: ""` with `closed: true` — both guards needed for correctness
- Address field names adapted: plan template used `.region` / `.postalCode` but actual SiteConfig interface uses `.state` / `.zip`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Replaced Facebook/Instagram lucide-react icons with available alternatives**

- **Found during:** Task 3 (Footer.tsx) — TypeScript error TS2305 on import
- **Issue:** The installed version of lucide-react does not export `Facebook` or `Instagram`
- **Fix:** Substituted `ExternalLink` for Facebook and `Share2` for Instagram; both render a social link icon adequately. No functional change — these are placeholder social links until Raptor confirms social profile URLs in Phase 8
- **Files modified:** src/components/layout/Footer.tsx
- **Verification:** `npx tsc --noEmit` passes with zero errors after substitution
- **Committed in:** 1ba3725 (task commit)

**2. [Rule 1 - Bug] Adapted address and hours field names to actual siteConfig schema**

- **Found during:** Task 3 (Footer.tsx) — plan template used `.region`/`.postalCode` and `h.open === "closed"`
- **Issue:** SiteConfig uses `.state`/`.zip` for address; Sunday uses `open: ""` + `closed: true` boolean, not `open === "closed"` string
- **Fix:** Used `siteConfig.address.state` + `.zip`; hours guard `h.closed || h.open === ""`
- **Files modified:** src/components/layout/Footer.tsx
- **Verification:** Typecheck passes; Sunday renders "Closed" correctly
- **Committed in:** 1ba3725 (task commit)

---

**Total deviations:** 2 auto-fixed (1 blocking icon import, 1 data shape mismatch)
**Impact on plan:** Both fixes necessary for correctness. No scope creep. Social icons remain semantically appropriate placeholders.

## Issues Encountered

None beyond the auto-fixed deviations above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All three layout components are ready for import in plan 02-02 (layout rewire)
- Plan 02-02 will: update `app/(marketing)/layout.tsx` to import from `@/components/layout/` instead of stubs, then delete `src/components/stubs/`
- No blockers for 02-02; components export named exports matching expected import shape

---
*Phase: 02-global-components*
*Completed: 2026-04-14*
