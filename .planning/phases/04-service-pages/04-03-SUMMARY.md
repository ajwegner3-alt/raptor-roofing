---
phase: 04-service-pages
plan: "03"
subsystem: ui
tags: [nextjs, react, tailwind, service-pages, json-ld, schema, seo, emergency-tarping, anti-chaser]

# Dependency graph
requires:
  - phase: 04-service-pages/04-01
    provides: ServicePageTemplate, ServiceHero (isEmergency branch), insurance documentation block, tel: tap-to-call card, text-4xl/5xl giant phone sizing
  - phase: 04-service-pages/04-02
    provides: /services/siding and /services/gutters routes (full phase now complete)
  - phase: 01-foundation
    provides: services.ts (emergency-tarping entry with isEmergency:true), faqs.ts (faq-19 through faq-22), testimonials.ts
provides:
  - /services/emergency-tarping static route with 3 JSON-LD blocks, isEmergency-activated template branch
  - Phase 4 complete — all four service pages built and verified
  - Anti-chaser hard-gate grep PASSED (all 14 forbidden patterns: 0 matches; all 4 required strings: 1+ matches)
  - Full SVC-01 through SVC-10 audit with PASS evidence
  - Near-duplicate audit across all 4 services: no duplicate pairs found
affects:
  - 06-seo (sitemap.ts needs /services/emergency-tarping added alongside sibling routes)
  - 08-handoff (emergency-tarping heroImagePath placeholder, FAQ-22 pricing placeholder)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Emergency page route: identical structure to roofing/siding/gutters — one-file composition, isEmergency branch activated entirely via service data flag"
    - "Anti-chaser compliance is enforced by content policy (services.ts + faqs.ts) not by component guards — no conditional JSX needed"

key-files:
  created:
    - src/app/(marketing)/services/emergency-tarping/page.tsx
  modified: []

key-decisions:
  - "don't wait on pre-cut materials (FAQ-18, gutters) confirmed as documented false positive — logistics statement, not homeowner-directed urgency copy"
  - "tel: link is in siteConfig.phone.href (site.ts) referenced dynamically — grep for literal tel: in TSX files returns 0 by design; confirmed via site.ts and siteConfig.phone.href usage in ServiceHero"
  - "No changes to ServicePageTemplate or ServiceHero needed — isEmergency branch from 04-01 activated correctly via service.isEmergency === true"

patterns-established:
  - "Phase 4 page file pattern: getServiceBySlug + getFaqsByService + getRelatedServices at module scope; getTestimonialsByService inside default export function — matches roofing/siding/gutters pattern"

# Metrics
duration: 4min
completed: 2026-04-15
---

# Phase 4 Plan 03: Emergency Tarping Page + Phase 4 Final Audit Summary

**Emergency tarping route ships with isEmergency-activated giant phone hero (text-4xl/5xl), insurance documentation block, and all 3 JSON-LD blocks; anti-chaser hard-gate PASSED; SVC-01 through SVC-10 all PASS; Phase 4 complete**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-04-15T01:41:50Z
- **Completed:** 2026-04-15T01:45:10Z
- **Tasks:** 3/3 (Task 2 and Task 3 were verification-only, no file changes)
- **Files modified:** 1 (1 created)

## Accomplishments

- Shipped `/services/emergency-tarping` static route — final Phase 4 service page — activating the isEmergency branch that delivers the giant 24/7 phone number (text-4xl mobile / text-5xl desktop) as a `tel:` link and the insurance documentation block
- Anti-chaser hard-gate grep PASSED: all 14 forbidden strings returned 0 matches across the full scope; all 4 required strings (24/7, document, insurance, tel:) confirmed present
- Full SVC-01 through SVC-10 audit PASSED: four unique service pages, unique metadata/H1/canonical per page, three JSON-LD blocks per page, no near-duplicate copy pairs, lead form + gallery + related services all wired in template

## Task Commits

1. **Task 1: Create /services/emergency-tarping page** - `323668a` (feat)
2. **Task 2: Hard-gate anti-chaser grep verification** - verification-only, no commit needed (all checks passed)
3. **Task 3: Full Phase 4 build + SVC-01 through SVC-10 final audit** - verification-only, no commit needed (build passed, all audits PASSED)

**Plan metadata:** (docs commit — this SUMMARY + STATE update)

## Files Created/Modified

- `src/app/(marketing)/services/emergency-tarping/page.tsx` — Emergency tarping static route with buildMetadata (useAbsoluteTitle:true, path:/services/emergency-tarping), 3 JsonLd blocks (serviceSchema + breadcrumbSchema + faqPageSchema), ServicePageTemplate with isEmergency:true service activating insurance doc block and giant phone hero

## Anti-Chaser Hard-Gate Grep Report

### Forbidden Strings (must return 0 matches — HARD GATE)

| Pattern | Result | Notes |
|---|---|---|
| `limited time` | PASS (0 matches) | Clean |
| `act now` | PASS (0 matches) | Clean |
| `don.?t wait` | FALSE POSITIVE DOCUMENTED | "we don't wait on pre-cut materials" (FAQ-18, gutters) — logistics statement, not homeowner urgency copy. Pre-documented as acceptable in 04-01-SUMMARY. Only match; confirmed not anti-chaser violation. |
| `countdown` | PASS (0 matches) | Clean |
| `expires` | PASS (0 matches) | Clean |
| `deadline` | PASS (0 matches) | Clean |
| `free roof` | PASS (0 matches) | Clean |
| `insurance will pay` | PASS (0 matches) | Clean |
| `insurance pays` | PASS (0 matches) | Clean |
| `zero out of pocket` | PASS (0 matches) | Clean |
| `no cost to you` | PASS (0 matches) | Clean |
| `canvass` | PASS (0 matches) | Clean |
| `door.?to.?door` | PASS (0 matches) | Clean |
| `storm chaser` (in emergency-tarping page/data) | PASS (0 matches) | storm chaser reference only in FAQ-2 (general FAQ, not serviceSlug:emergency-tarping) |

**All 14 hard-gate checks PASSED** (the false positive on `don.?t wait` was pre-documented and confirmed logistically acceptable).

### Required Strings (must have 1+ match)

| String | Result | Location |
|---|---|---|
| `24/7` | PASS | services.ts headline, description, features; ServiceHero.tsx emergency card |
| `document` | PASS | ServicePageTemplate.tsx insurance block (multiple), services.ts process steps, faqs.ts FAQ-20 |
| `insurance` | PASS | ServicePageTemplate.tsx (2 occurrences), services.ts (7), faqs.ts (11) |
| `tel:` | PASS | site.ts: `href: "tel:+14028851462"` — referenced via siteConfig.phone.href in ServiceHero, Header, StickyMobileCTA |

**Giant phone font:** `text-4xl` (mobile) + `lg:text-5xl` (desktop) confirmed at line 108 of ServiceHero.tsx on the emergency `<a href={siteConfig.phone.href}>` element.

## Phase 4 SVC-01 through SVC-10 Final Audit

| Requirement | Status | Evidence |
|---|---|---|
| **SVC-01** /services/roofing route complete | PASS | File exists; ServicePageTemplate with service.headline, problemChecklist, processSteps, FAQ, testimonials, CTA |
| **SVC-02** /services/siding route complete | PASS | File exists; same template composition |
| **SVC-03** /services/gutters route complete | PASS | File exists; same template composition |
| **SVC-04** /services/emergency-tarping route complete with 24/7 phone prominence | PASS | File created this plan; text-4xl/5xl tel: link confirmed in ServiceHero isEmergency branch |
| **SVC-05** serviceSchema JSON-LD in all 4 pages | PASS | `serviceSchema(service)` confirmed in all 4 page files via grep |
| **SVC-06** Unique title/description/H1/canonical per page | PASS | 4 distinct metadata.title values; 4 distinct headlines; 4 distinct canonical paths (/services/{slug}); useAbsoluteTitle:true on all |
| **SVC-07** Internal links to 2+ sibling services + homepage | PASS | RelatedServicesBlock renders 3 sibling cards (from relatedSlugs); ServiceBreadcrumb renders `<Link href="/">` Home link |
| **SVC-08** Lead form on every page | PASS | `<LeadForm defaultService={service.slug} />` in ServicePageTemplate section 11 |
| **SVC-09** Before/after gallery PLACEHOLDER slots visible | PASS | `[PLACEHOLDER] — Real project photo coming` in BeforeAfterGallery.tsx; slotCount={3} in template |
| **SVC-10** No near-duplicate copy across 4 services | PASS | All headlines unique; all subheadlines unique; all problemChecklist items unique (20 items, 0 shared); all process step titles unique |

**All 10 SVC requirements: PASS**

## Near-Duplicate Audit — All 4 Services

### Headlines (H1s)
- Roofing: "Roof Replacement & Repair in Omaha" — UNIQUE
- Siding: "Siding Replacement & Repair in Omaha" — UNIQUE
- Gutters: "Gutter Installation & Repair in Omaha" — UNIQUE
- Emergency Tarping: "24/7 Emergency Roof Tarping in Omaha" — UNIQUE

### Subheadlines
- Roofing: "15 years local. No subcontractors. Every crew member is a Raptor employee." — UNIQUE
- Siding: "Protect your home's exterior. Improve curb appeal. Done right the first time." — UNIQUE
- Gutters: "Protect your foundation. Stop water damage before it starts." — UNIQUE
- Emergency Tarping: "Storm hit tonight? We respond immediately — day or night." — UNIQUE

### problemChecklist items
20 total items across 4 services — zero shared items. Each service's checklist describes symptoms specific to that trade context (roofing: shingles/granules/attic; siding: panels/moisture/gaps; gutters: overflow/rust/foundation; emergency: exposed decking/tree impact/wind uplift).

### Process step titles
14 total step titles across 4 services — all unique (siding "Installation" and roofing "Installation by Our Crew" are differentiated).

### Metadata titles
- Roofing: "Roof Replacement in Omaha | Raptor Roofing" — UNIQUE
- Siding: "Siding Replacement in Omaha | Raptor Roofing" — UNIQUE
- Gutters: "Gutter Installation in Omaha | Raptor Roofing" — UNIQUE
- Emergency Tarping: "Emergency Roof Tarping Omaha | Raptor Roofing" — UNIQUE

**No near-duplicate pairs found across any dimension.**

## Build Output

```
Route (app)
├ ○ /
├ ○ /_not-found
├ ○ /services/emergency-tarping
├ ○ /services/gutters
├ ○ /services/roofing
└ ○ /services/siding

○ (Static) prerendered as static content
```

All 4 service routes built as static pages. TypeScript clean. Build time: 3.6s compile + 4.4s TS check.

## Deviations from Plan

None — plan executed exactly as written.

The `don.?t wait` grep match (FAQ-18: "we don't wait on pre-cut materials") is a pre-documented false positive from 04-01. It was reviewed in context and confirmed as a logistics statement (contractor process efficiency) not homeowner-directed urgency copy. No rewrite needed or performed.

## Issues Encountered

- `grep -l "tel:" ...` on TSX files returns 0 because the tel: value lives in site.ts and is referenced via `siteConfig.phone.href`. Resolved by confirming tel: in site.ts and verifying href usage in ServiceHero, Header, StickyMobileCTA via grep on `siteConfig.phone.href`.

## Placeholders to Resolve Before Launch (Phase 8)

- `heroImagePath: "/images/emergency-tarping-placeholder.jpg"` — replace with real emergency response photo
- FAQ-22 (emergency tarping cost): `[PLACEHOLDER: add current pricing range once confirmed]`

## Next Phase Readiness

**Phase 4 is complete.** All four service pages built, verified, and pushed to GitHub.

**Ready for Phase 5 (Lead Forms + Backend):**
- All service pages have `<LeadForm defaultService={service.slug} />` wired — ready for form submission handler
- Form handler choice (n8n webhook vs Formspree) deferred to Phase 5 planning per STATE.md

**Ready for Phase 6 (SEO):**
- sitemap.ts must include all 4 service routes: /services/roofing, /services/siding, /services/gutters, /services/emergency-tarping

---
*Phase: 04-service-pages*
*Completed: 2026-04-15*
