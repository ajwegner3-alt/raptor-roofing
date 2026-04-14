---
phase: 01-foundation
plan: "03"
subsystem: ui
tags: [nextjs, tailwind, typescript, next-font, schema-dts, vercel-analytics, seo, json-ld, app-router]

# Dependency graph
requires:
  - phase: 01-01
    provides: Next.js scaffold, Tailwind v4 @theme tokens, globals.css, package.json with schema-dts + @vercel/analytics
  - phase: 01-02
    provides: siteConfig from @/content/site (consumed by schema.tsx and metadata.ts), Service type from @/content/services, FAQ type from @/content/faqs

provides:
  - Root layout with Oswald + Source Serif 4 fonts via next/font/google, metadataBase, OG defaults, robots index/follow, Vercel Analytics
  - buildMetadata() helper in src/lib/metadata.ts for per-page typed Metadata objects
  - JSON-LD factory functions in src/lib/schema.tsx: localBusinessSchema, serviceSchema, faqPageSchema, breadcrumbSchema
  - JsonLd server component for rendering structured data
  - (marketing) route group shell with stub Header/Footer/StickyMobileCTA
  - Placeholder homepage at src/app/(marketing)/page.tsx (HTTP 200, brand tokens visible)

affects:
  - Phase 2 (components) — replaces stub Header/Footer/StickyMobileCTA in src/components/stubs/
  - Phase 3 (homepage) — replaces (marketing)/page.tsx with full homepage, uses buildMetadata() and JsonLd
  - Phase 4 (service pages) — uses serviceSchema(), buildMetadata() in each page's generateMetadata
  - Phase 5 (contact/forms) — uses buildMetadata() with noIndex=true for thank-you pages
  - Phase 6 (SEO) — metadataBase already set; OG images in /og/ resolve correctly

# Tech tracking
tech-stack:
  added:
    - next/font/google (Oswald display font, Source Serif 4 body font)
    - "@vercel/analytics/react" (Analytics server component)
    - schema-dts v2 (WithContext<T> types for JSON-LD)
  patterns:
    - "Route group (marketing) isolates marketing layout from root layout"
    - "buildMetadata() centralizes per-page SEO metadata generation"
    - "JsonLd server component renders JSON-LD via native <script> (not next/script)"
    - "Stub components in src/components/stubs/ with PHASE 1 STUB comments for easy Phase 2 replacement"
    - "Both font CSS variables applied to <html> element to satisfy Tailwind @theme var() references"
    - "type-only imports from @/content/* in schema.tsx for wave-2 parallel execution safety"

key-files:
  created:
    - src/lib/metadata.ts
    - src/lib/schema.tsx
    - src/app/(marketing)/layout.tsx
    - src/app/(marketing)/page.tsx
    - src/components/stubs/Header.tsx
    - src/components/stubs/Footer.tsx
    - src/components/stubs/StickyMobileCTA.tsx
  modified:
    - src/app/layout.tsx
  deleted:
    - src/app/page.tsx

key-decisions:
  - "schema.tsx renamed from .ts to .tsx because JsonLd component uses JSX syntax (<script /> element)"
  - "DayOfWeek cast as DayOfWeek type (not URL string) to satisfy schema-dts v2 strict union types"
  - "metadataBase fallback: https://raptor-roofing.vercel.app (not localhost) so build output OG URLs are absolute"
  - "StickyMobileCTA returns null in stub phase — no DOM noise from incomplete component"
  - "Skip-to-main link lives in root layout (not marketing layout) so it's the first focusable element in page source"

patterns-established:
  - "Pattern 1: All page metadata generated via buildMetadata() from src/lib/metadata.ts"
  - "Pattern 2: JSON-LD added to pages via <JsonLd data={...Schema()} /> server component"
  - "Pattern 3: Stub components committed with PHASE X STUB comment — grep target for replacement"
  - "Pattern 4: Font CSS variables always applied to <html>, never split across <html> and <body>"

# Metrics
duration: 35min
completed: 2026-04-14
---

# Phase 1 Plan 03: App Shell + Metadata/Schema Helpers Summary

**App Router shell with Oswald/Source Serif 4 fonts, metadataBase, JSON-LD factories via schema-dts v2, and (marketing) route group — all gates green (tsc, eslint, build, HTTP 200)**

## Performance

- **Duration:** ~35 min
- **Started:** 2026-04-14T03:00:00Z (approximate)
- **Completed:** 2026-04-14T03:35:00Z (approximate)
- **Tasks:** 5 (including full verification gate)
- **Files modified:** 8 (7 created, 1 modified, 1 deleted)

## Accomplishments

- Root layout fully wired: Oswald (display) + Source Serif 4 (body) via next/font/google with CSS variables on `<html>` element, metadataBase set from env var (Pitfall C-1 fix), OG/Twitter defaults, robots index/follow, Vercel Analytics, skip-to-main link
- `buildMetadata()` helper provides typed Metadata objects with canonical URL, OG, Twitter, and per-page robots override for all subsequent phases
- `localBusinessSchema()`, `serviceSchema()`, `faqPageSchema()`, `breadcrumbSchema()`, and `<JsonLd>` component provide complete JSON-LD coverage for Phase 3+ pages using `schema-dts` v2 `WithContext<T>` types
- `(marketing)` route group shell renders Header/Footer/StickyMobileCTA stubs with `id="main-content"` skip-link target — HTTP 200 verified

## Task Commits

Each task was committed atomically:

1. **Task 1: Delete placeholder page + create (marketing) route group + stubs** - `75419a3` (chore)
2. **Task 2: Root layout with fonts, metadataBase, analytics** - `a3fc542` (feat)
3. **Task 3: src/lib/metadata.ts buildMetadata helper** - `09444f5` (feat)
4. **Task 4: src/lib/schema.tsx JSON-LD factories + JsonLd component** - `d0ed1c1` (feat)
5. **Task 5: Full verification gate** - no separate commit (verification only)

**Note:** schema.tsx rename + DayOfWeek type fix landed in commit `b6321bb` (labeled phase-1-02 due to execution interleaving — the fix is to 01-03's file).

## Files Created/Modified

- `src/app/layout.tsx` — Replaced Geist fonts with Oswald + Source Serif 4, added metadataBase, OG defaults, Vercel Analytics, skip-to-main link
- `src/lib/metadata.ts` — buildMetadata() helper returning typed Metadata with canonical, OG, Twitter, robots
- `src/lib/schema.tsx` — JSON-LD factories: localBusinessSchema, serviceSchema, faqPageSchema, breadcrumbSchema + JsonLd server component
- `src/app/(marketing)/layout.tsx` — Marketing route group layout with stub Header/Footer/StickyMobileCTA, `<main id="main-content">`
- `src/app/(marketing)/page.tsx` — Placeholder homepage (Phase 3 will replace this with full homepage)
- `src/components/stubs/Header.tsx` — PHASE 1 STUB: labeled header with bg-primary-600
- `src/components/stubs/Footer.tsx` — PHASE 1 STUB: labeled footer with bg-neutral-900
- `src/components/stubs/StickyMobileCTA.tsx` — PHASE 1 STUB: returns null
- `src/app/page.tsx` — DELETED (route conflict prevention with (marketing)/page.tsx)

## Decisions Made

- **schema.tsx not schema.ts:** The JsonLd component uses JSX (`<script />` element). TypeScript requires `.tsx` extension for files with JSX. Renamed during Task 4.
- **DayOfWeek cast:** `schema-dts` v2 `DayOfWeek` type is a strict union. `h.day` (string) needs explicit cast to `DayOfWeek` (accepts short form like `"Monday"`).
- **metadataBase fallback is Vercel URL:** Using `https://raptor-roofing.vercel.app` as fallback instead of `http://localhost:3000` ensures OG image URLs in built output are absolute even before real domain is set.
- **StickyMobileCTA returns null:** Avoids any DOM noise or layout issues in Phase 1. Real component wires in Phase 2.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Renamed schema.ts to schema.tsx for JSX compatibility**

- **Found during:** Task 4 (schema.ts JSON-LD factories) + Task 5 (typecheck)
- **Issue:** TypeScript error TS1005 "expected '>'" on line 33 — file had `.ts` extension but contained JSX syntax in the `JsonLd` component (`<script ... />`)
- **Fix:** Renamed to `schema.tsx` via `git mv src/lib/schema.ts src/lib/schema.tsx`
- **Files modified:** `src/lib/schema.tsx`
- **Verification:** `npx tsc --noEmit` passes
- **Committed in:** `d0ed1c1` (schema factory commit) + `b6321bb` (DayOfWeek fix by 01-02 execution)

**2. [Rule 1 - Bug] Fixed DayOfWeek type cast for schema-dts v2**

- **Found during:** Task 5 (typecheck gate after 01-02 landed)
- **Issue:** TS2322 — `dayOfWeek: \`https://schema.org/${h.day}\`` template literal string is not assignable to `SchemaValue<DayOfWeek|IdReference>`. schema-dts v2 requires explicit `DayOfWeek` union type.
- **Fix:** Imported `DayOfWeek` type from `schema-dts`, cast `h.day as DayOfWeek` (schema-dts accepts short form like `"Monday"`)
- **Files modified:** `src/lib/schema.tsx`
- **Verification:** `npx tsc --noEmit` passes, `npx eslint .` passes
- **Committed in:** `b6321bb` (labeled phase-1-02 due to execution interleaving)

---

**Total deviations:** 2 auto-fixed (both Rule 1 - Bug)
**Impact on plan:** Both fixes necessary for TypeScript compliance. No scope creep. The file naming issue (`.ts` vs `.tsx`) is a research doc oversight; the fix is trivial.

## Verification Results

| Gate | Result |
|------|--------|
| `npx tsc --noEmit` | PASS — clean |
| `npx eslint .` | PASS — clean |
| `npm run build` | PASS — clean, no metadataBase warning, route `/` shows under `(marketing)` |
| Dev server HTTP 200 | PASS — `curl localhost:3007` returns 200 |
| Stub Header rendered | PASS — "Header stub" text in HTML confirms (marketing) layout chain |
| No noindex in HTML | PASS — robots index/follow confirmed |
| metadataBase confirmed | PASS — `grep "metadataBase: new URL" src/app/layout.tsx` |
| Fonts on `<html>` | PASS — both `displayFont.variable` and `bodyFont.variable` on `<html>` className |

## User Setup Required

None - no external service configuration required for this plan.
All environment variables (`NEXT_PUBLIC_SITE_URL`) were already set in `.env.local` by 01-01.

## Next Phase Readiness

**Phase 2 (Components):**
- Stub components live in `src/components/stubs/` — grep for `PHASE 1 STUB` to find all three
- Replace with real Header/Footer/StickyMobileCTA, then delete the `stubs/` directory
- `id="main-content"` is the skip-link target — keep this on `<main>` in the real marketing layout

**Phase 3 (Homepage):**
- Replace `src/app/(marketing)/page.tsx` placeholder with full homepage
- Call `buildMetadata({ title, description, path: "/", useAbsoluteTitle: true })` in page's `export const metadata`
- Add `<JsonLd data={localBusinessSchema()} />` to homepage for LocalBusiness structured data
- Use `<JsonLd data={faqPageSchema(faqs)} />` in any page with an FAQ section

**Phase 4+ (Service pages):**
- Call `serviceSchema(service)` for each service page's JSON-LD
- Call `breadcrumbSchema([...])` on all inner pages
- Both functions are ready in `src/lib/schema.tsx`

**Handoff note:**
- `buildMetadata()` is imported from `@/lib/metadata` — NOT from `next`
- `JsonLd` is a server component — it can be used directly in page.tsx and layout.tsx files without `"use client"` wrapper
- `localBusinessSchema()` reads from `siteConfig` at runtime — no arguments needed

---

*Phase: 01-foundation*
*Completed: 2026-04-14*
