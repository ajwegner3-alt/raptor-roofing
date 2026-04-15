---
phase: 04-service-pages
plan: "02"
subsystem: ui
tags: [nextjs, react, service-pages, json-ld, schema, seo, near-duplicate-audit]

# Dependency graph
requires:
  - phase: 04-01
    provides: ServicePageTemplate, ServiceHero, ServiceBreadcrumb, ServiceCTABand, BeforeAfterGallery, RelatedServicesBlock, services.ts with problemChecklist, faqs.ts with siding+gutters FAQs, buildMetadata, schema factories
provides:
  - /services/siding static route with serviceSchema + breadcrumbSchema + faqPageSchema JSON-LD
  - /services/gutters static route with serviceSchema + breadcrumbSchema + faqPageSchema JSON-LD
  - Verified SVC-10 compliance: roofing vs siding vs gutters copy is distinct (no near-duplicates)
affects:
  - 04-03 (emergency-tarping page — same pattern confirmed working for 3 services)
  - 06-seo (sitemap.ts needs /services/siding and /services/gutters added)
  - 08-handoff (placeholder heroImagePath for siding and gutters still needed)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Copy-only divergence pattern confirmed: slug swap + service data swap is sufficient for unique pages"
    - "Near-duplicate audit methodology: compare headline, subheadline, problemChecklist, processSteps, meta title, meta description, FAQ questions across all sibling routes"

key-files:
  created:
    - src/app/(marketing)/services/siding/page.tsx
    - src/app/(marketing)/services/gutters/page.tsx
  modified: []

key-decisions:
  - "No new components created — pure copy-driven divergence using existing ServicePageTemplate"
  - "SVC-10 near-duplicate audit passed: all three services have distinct headlines, subheadlines, problemChecklists (different symptom nouns: shingles vs panels vs downspouts), processSteps, and FAQ questions"

patterns-established:
  - "Wave 2 execution pattern: new service pages = 1 file, slug swap, audit — no component work"

# Metrics
duration: 5min
completed: 2026-04-15
---

# Phase 4 Plan 02: Siding + Gutters Service Pages Summary

**Two static service routes (/services/siding, /services/gutters) consuming ServicePageTemplate with copy-only divergence; SVC-10 near-duplicate audit passed across all three shipped service pages**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-04-15T01:41:14Z
- **Completed:** 2026-04-15T01:46:00Z
- **Tasks:** 3/3
- **Files modified:** 2 (both created)

## Accomplishments

- Created `/services/siding/page.tsx` and `/services/gutters/page.tsx` as near-clones of the roofing route, each with the correct service slug, unique buildMetadata canonical path, and all 3 JSON-LD blocks (serviceSchema + breadcrumbSchema + faqPageSchema) — no localBusinessSchema (lives in Footer)
- Performed full 3-way near-duplicate audit across roofing, siding, and gutters: headlines, subheadlines, problemChecklists, processSteps titles, meta titles, meta descriptions, and FAQ questions all verified distinct — SVC-10 passes with zero collisions
- `npm run build` succeeded cleanly with all 4 service routes appearing as static prerendered pages: /services/roofing, /services/siding, /services/gutters, /services/emergency-tarping

## Task Commits

Each task was committed atomically:

1. **Task 1: Create /services/siding page** - `4503ca8` (feat)
2. **Task 2: Create /services/gutters page** - `91916a8` (feat)
3. **Task 3: Near-duplicate audit** - (verification only, no commit — audit passed, no files modified)

## Files Created/Modified

**Created:**
- `src/app/(marketing)/services/siding/page.tsx` — Static route: buildMetadata (canonical /services/siding, useAbsoluteTitle), serviceSchema + breadcrumbSchema + faqPageSchema JSON-LD, ServicePageTemplate with getServiceBySlug("siding") data; 4 siding FAQs (faq-11 through faq-14)
- `src/app/(marketing)/services/gutters/page.tsx` — Static route: buildMetadata (canonical /services/gutters, useAbsoluteTitle), serviceSchema + breadcrumbSchema + faqPageSchema JSON-LD, ServicePageTemplate with getServiceBySlug("gutters") data; 4 gutters FAQs (faq-15 through faq-18)

## Near-Duplicate Audit Findings (SVC-10)

**Result: PASS — all copy is verifiably distinct**

| Field | Roofing | Siding | Gutters |
|-------|---------|--------|---------|
| H1/headline | "Roof Replacement & Repair in Omaha" | "Siding Replacement & Repair in Omaha" | "Gutter Installation & Repair in Omaha" |
| Subheadline | "15 years local. No subcontractors..." | "Protect your home's exterior..." | "Protect your foundation..." |
| Meta title | "Roof Replacement in Omaha \| Raptor Roofing" | "Siding Replacement in Omaha \| Raptor Roofing" | "Gutter Installation in Omaha \| Raptor Roofing" |
| Canonical | /services/roofing | /services/siding | /services/gutters |
| problemChecklist nouns | shingles, granules, decking, attic | panels, seams, wall cavity | gutters, fascia, downspouts, foundation |
| processStep 1 | "Free Damage Inspection" | "Free Siding Inspection" | "Inspection & Measurement" |
| processStep 2 | "Insurance Claim Support" | "Material & Color Selection" | "Seamless Gutter Fabrication" |
| processStep 3 | "Installation by Our Crew" | "Installation" | "Installation & Test" |
| FAQ questions | Hailstorm damage? Storm chasers? Claim timeline? Insurance coverage? | Cost? Materials? Timeline? Warranty? | 5" vs 6"? Seamless vs sectional? Guards? Storm replacement? |

All three services have distinct symptom nouns, failure mode descriptions, and process vocabulary. No FAQ question pair is a noun-swap duplicate.

## Decisions Made

- No new components created — 04-01 ServicePageTemplate is complete and sufficient for copy-only page variants
- SVC-10 audit methodology documented in patterns for future service page additions (Phase 8 handoff if more services are added)

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

**Ready for 04-03 (emergency-tarping page):**
- Same pattern confirmed working across 3 services
- `service.isEmergency === true` activates the insurance documentation block and tap-to-call hero branch
- 4 emergency-tarping FAQs already in faqs.ts (faq-19 through faq-22)
- Single route file following identical import and composition pattern

**Known concerns for 06-seo:**
- `sitemap.ts` will need `/services/siding` and `/services/gutters` added alongside `/services/roofing`

**Placeholders to resolve before launch (Phase 8):**
- `siding` and `gutters` heroImagePath fields still point to placeholder images

---
*Phase: 04-service-pages*
*Completed: 2026-04-15*
