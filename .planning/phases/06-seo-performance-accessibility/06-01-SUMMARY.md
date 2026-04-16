---
phase: 06-seo-performance-accessibility
plan: 01
subsystem: seo
tags: [next.js, sitemap, robots, metadata, canonical, seo, crawlability]

# Dependency graph
requires:
  - phase: 05-about-contact
    provides: all 7 indexable pages exist (/, /about, /contact, 4 service pages)
provides:
  - src/app/sitemap.ts — MetadataRoute.Sitemap with 7 routes, env-guarded absolute URLs
  - src/app/robots.ts — MetadataRoute.Robots allowing all crawlers, referencing sitemap
  - Verified: all 7 pages call buildMetadata({ path }) with explicit path arguments
  - Verified: root layout robots: { index: true, follow: true } already set
  - Verified: alternates.canonical wired in buildMetadata() via siteConfig.url + path
  - Verified: zero noindex remnants anywhere in src/
affects: [07-deployment, 08-brand-assets-handoff]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "sitemap.ts: top-level throw guard pattern — env var checked at module load, not inside function"
    - "robots.ts: ?? fallback pattern — low-stakes file, no throw needed"
    - "NEXT_PUBLIC_SITE_URL as single source of truth for all absolute URL construction"

key-files:
  created:
    - src/app/sitemap.ts
    - src/app/robots.ts
  modified: []

key-decisions:
  - "sitemap.ts reads process.env.NEXT_PUBLIC_SITE_URL DIRECTLY — does NOT import siteConfig (which has silent fallback) — throw guard at module top-level ensures build fails if env var unset"
  - "robots.ts uses ?? fallback (not throw) — /robots.txt is low-stakes; sitemap.ts hard-guard catches missing env first"
  - "Task 3 was read-only — all canonical/robots/noindex checks passed with zero code changes"
  - "metadata.ts index: false on line 82 is conditional (noIndex param), not a remnant — no page passes noIndex: true"

patterns-established:
  - "Env-guard pattern: const X = process.env.VAR; if (!X) throw new Error('[project] ...') at module top-level"
  - "sitemap.ts + robots.ts live at src/app/ root (NOT inside (marketing) route group) — Next.js serves them at /sitemap.xml and /robots.txt"

# Metrics
duration: 2min
completed: 2026-04-16
---

# Phase 06 Plan 01: SEO Infrastructure Summary

**sitemap.xml (7 routes) + robots.txt (Allow: /) added via Next.js App Router MetadataRoute with NEXT_PUBLIC_SITE_URL env-guard that fails the build loudly if unset**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-16T00:51:21Z
- **Completed:** 2026-04-16T00:52:46Z
- **Tasks:** 3 (2 file-creation + 1 read-only verification)
- **Files created:** 2

## Accomplishments

- Created `src/app/sitemap.ts` with build-time throw guard on NEXT_PUBLIC_SITE_URL, enumerating all 7 indexable routes as absolute URLs
- Created `src/app/robots.ts` with `Allow: /` for all user agents and sitemap link
- Verified all pre-existing SEO metadata (canonical, robots, noindex audit) passes with zero violations — no code changes needed in Task 3

## Task Commits

1. **Task 1: Create app/sitemap.ts with build-time env guard** — `be97071` (feat)
2. **Task 2: Create app/robots.ts allowing all crawlers** — `672682e` (feat)
3. **Task 3: Verify existing canonical + robots metadata** — no commit (read-only, no changes)

## Files Created/Modified

- `src/app/sitemap.ts` — MetadataRoute.Sitemap with 7 routes, direct env read, top-level throw guard
- `src/app/robots.ts` — MetadataRoute.Robots, Allow: /, sitemap link

## Decisions Made

- **sitemap.ts reads `process.env.NEXT_PUBLIC_SITE_URL` directly** — NOT `siteConfig.url` (which has a silent `?? "https://raptor-roofing.vercel.app"` fallback that would defeat the throw guard). Direct env read + throw = Phase 7 domain flip is a single env var change with zero code edits, and forgetting to set it fails the build loudly.
- **robots.ts uses `??` fallback** — /robots.txt is low-stakes; if env var is missing, defaulting to preview URL is acceptable. The sitemap.ts throw catches missing env vars first anyway.
- **Task 3 was fully read-only** — RESEARCH.md had pre-confirmed canonical and robots metadata were already in place. All verification greps confirmed:
  - `buildMetadata()` in `src/lib/metadata.ts` sets `alternates.canonical` on lines 53–54
  - All 7 pages call `buildMetadata({ path: '...' })` with explicit unique paths
  - `src/app/layout.tsx` root metadata has `robots: { index: true, follow: true }`
  - `grep -rn "noindex" src/` matched only `metadata.ts:82` which is a conditional ternary (not a remnant) — no page passes `noIndex: true`

## Verification Grep Results (Task 3 Audit Trail)

| Check | Command | Result |
|-------|---------|--------|
| Canonical wired | `grep -n "alternates" src/lib/metadata.ts` | Lines 53–55: `alternates: { canonical: canonicalUrl }` |
| 7 buildMetadata calls | `grep -rn "buildMetadata(" src/app/` | 7 call sites, all with explicit `path:` argument |
| Root layout robots | `grep -n "robots" src/app/layout.tsx` | Line 65: `robots: { index: true, follow: true }` |
| noindex sitewide | `grep -rn "noindex\|index: false" src/` | 1 match: metadata.ts:82 (guarded by noIndex param — no page triggers it) |

## Build Verification

- `npm run build` succeeded with `/sitemap.xml` and `/robots.txt` listed as static routes
- Env-guard smoke test: `NEXT_PUBLIC_SITE_URL= npx next build` failed with `[raptor-roofing] NEXT_PUBLIC_SITE_URL is not set` message

## SEO Requirements Closed

| Req | Description | Status |
|-----|-------------|--------|
| SEO-01 | /sitemap.xml returns all indexable pages | Closed |
| SEO-02 | /robots.txt shows Allow: / | Closed |
| SEO-04 | Every page has self-canonical via buildMetadata({ path }) | Verified (already shipped) |
| SEO-09 | Zero noindex remnants anywhere in src/ | Verified (already shipped) |

## Deviations from Plan

None — plan executed exactly as written. Task 3 was read-only as planned; no violations found.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required. NEXT_PUBLIC_SITE_URL is already set in .env.local.

## Next Phase Readiness

- /sitemap.xml and /robots.txt are live and will deploy automatically via Vercel on next push
- Phase 7 (deployment) one-task change: set NEXT_PUBLIC_SITE_URL to the production domain in Vercel env vars — sitemap.ts will then emit production URLs in the sitemap automatically
- Phase 6 can continue with remaining plans (performance, accessibility, OG images)

---
*Phase: 06-seo-performance-accessibility*
*Completed: 2026-04-16*
