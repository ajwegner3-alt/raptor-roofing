---
phase: 05-about-contact
plan: 01
subsystem: ui
tags: [nextjs, react, tailwind, seo, schema-dts, breadcrumb, about-page]

# Dependency graph
requires:
  - phase: 02-global-components
    provides: TrustStrip, TestimonialCarousel, layout chrome, Footer (owns LocalBusiness JSON-LD)
  - phase: 01-foundation
    provides: buildMetadata, breadcrumbSchema, JsonLd, siteConfig, schema.tsx

provides:
  - /about page (7 sections, static, Server Component)
  - AboutHero Server Component (5-layer visual stack, single-column, no form)
  - BreadcrumbList JSON-LD on /about
  - Educational storm-awareness section (no "chaser" word, homeowner-educational framing)
  - "Every Crew Is Raptor" no-subcontractors narrative section

affects:
  - Phase 8 handoff (4x [PLACEHOLDER] tags to swap: founding year x3, founder name x1, founding area x1)
  - Phase 5 plan 02 (contact page — reuses same structural patterns)
  - Phase 6 sitemap (must include /about route)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Single-column About hero reusing ServiceHero's 5-layer visual stack constants verbatim
    - BreadcrumbList-only JSON-LD pattern for inner pages (no LocalBusiness duplication)
    - End CTA block with tel: + Link to /contact (no embedded form) for non-form pages

key-files:
  created:
    - src/components/sections/AboutHero.tsx
    - src/app/(marketing)/about/page.tsx
  modified: []

key-decisions:
  - "AboutHero is a NEW component (not ServiceHero reuse) — ServiceHero requires Service prop and always renders right-column form/card; About page needs single-column, no form"
  - "BreadcrumbList JSON-LD only on /about — Footer already renders HomeAndConstructionBusiness schema globally on every marketing page; no duplication"
  - "Anti-chaser section framed as homeowner education ('What to Watch For After a Storm') — word 'chaser' absent from all visible text"
  - "End CTA block uses Link to /contact (not embedded form) — per CONTEXT.md: no lead form on About page"
  - "[PLACEHOLDER] tags are rendered as visible literal strings in page content so Phase 8 handoff grep finds them"

patterns-established:
  - "About-style inner pages: AboutHero + content sections + TrustStrip + TestimonialCarousel + end CTA (no form)"
  - "5-layer visual stack constants (OVERLAY_STYLE, NOISE_STYLE) can be copied verbatim to any new hero component"

# Metrics
duration: ~15min
completed: 2026-04-15
---

# Phase 5 Plan 01: About Page Summary

**Family-narrative /about page with no-subcontractors + storm-education sections, BreadcrumbList-only JSON-LD, and [PLACEHOLDER] tags for Phase 8 fact-swap**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-15T12:34:50Z
- **Completed:** 2026-04-15T12:49:00Z
- **Tasks:** 2
- **Files modified:** 2 (created)

## Accomplishments

- Built `AboutHero` Server Component with 5-layer visual stack (identical overlay/noise/divider constants to ServiceHero), single-column layout, no LeadForm, no service prop, `[PLACEHOLDER: founding year]` literal in micro-trust line
- Built `/about` page as Server Component composing 7 required sections in order: hero, story, every-crew, storm-education, TrustStrip, TestimonialCarousel, end CTA
- All hard gates passed: zero `localBusinessSchema`, `chaser`, `LeadForm` matches in page file; 4x PLACEHOLDER tags present; `npm run build` succeeds with `/about` in route table

## Task Commits

1. **Task 1: Build AboutHero component** - `f870607` (feat)
2. **Task 2: Build /about page Server Component** - `cd6ea12` (feat)

**Plan metadata:** (docs commit follows this summary)

## Files Created/Modified

- `src/components/sections/AboutHero.tsx` — Server Component, 5-layer hero, single CTA, no form
- `src/app/(marketing)/about/page.tsx` — About page, 7 sections, BreadcrumbList JSON-LD, metadata export

## Decisions Made

- **AboutHero is a distinct new component.** ServiceHero requires a `Service` prop and always puts a LeadForm or call card in the right column. A clean separation avoids leaking service-page concerns onto About.
- **BreadcrumbList only, no LocalBusiness.** Footer.tsx calls `localBusinessSchema()` and renders it on every marketing-layout page. Duplicating it on /about would create structured-data ambiguity per RESEARCH.md Pitfall 4. Comment in page.tsx explains this for future contributors.
- **Storm-education section avoids the word "chaser."** Five homeowner-facing tips are framed around observable red flags (no local address, no license number on request, full upfront payment, pressure tactics, no local history). Informative and legally clean.
- **End CTA = tel: + `/contact` Link.** No embedded form on About. The CTA block is explicit about this with a code comment.

## Deviations from Plan

None — plan executed exactly as written.

The only notable micro-adjustment: JSX comments initially contained the words "LocalBusiness" and "chaser" which would have caused plan hard-gate grep failures. Those comments were rephrased before committing (plain comment cleanup, not a behavior change).

## Issues Encountered

None.

## [PLACEHOLDER] Tags Phase 8 Must Swap

The following literal `[PLACEHOLDER: ...]` strings appear in the shipped files and must be replaced before public launch:

| File | Tag | Notes |
|------|-----|-------|
| `src/components/sections/AboutHero.tsx` | `[PLACEHOLDER: founding year]` | In micro-trust line beneath subheadline |
| `src/app/(marketing)/about/page.tsx` | `[PLACEHOLDER: founding year]` | In story section para 1 + metadata description (2 occurrences) |
| `src/app/(marketing)/about/page.tsx` | `[PLACEHOLDER: founder name]` | In story section para 1 |
| `src/app/(marketing)/about/page.tsx` | `[PLACEHOLDER: founding neighborhood/area]` | In story section para 2 |

Grep command for Phase 8 sweep:
```bash
grep -rn "PLACEHOLDER" src/components/sections/AboutHero.tsx src/app/\(marketing\)/about/page.tsx
```

## User Setup Required

None — no external service configuration required for the About page.

## Next Phase Readiness

- `/about` is complete and statically prerendered. Ready for Phase 5 plan 02 (`/contact` page).
- The same structural pattern (AboutHero → content → TrustStrip → TestimonialCarousel → end CTA) can inform the Contact page layout decisions.
- Phase 6 sitemap (06-01) must add `/about` to `app/sitemap.ts` when that plan executes.
- Concern: `/images/about-hero.webp` does not exist yet — Next.js Image with `fill` will render a broken image in the browser until Phase 8 provides the real asset. The build succeeds because Next.js Image does not validate src paths at build time. This is expected and documented.

---
*Phase: 05-about-contact*
*Completed: 2026-04-15*
