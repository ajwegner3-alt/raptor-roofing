---
phase: 03-homepage
plan: 04
subsystem: ui
tags: [nextjs, react, tailwind, leadform, homepage, seo, schema, json-ld, faq, rsc]

# Dependency graph
requires:
  - phase: 03-01
    provides: Hero section component (named export)
  - phase: 03-02
    provides: ServiceGrid, WhyNotChaser, Insurance3Step section components
  - phase: 03-03
    provides: TestimonialCarousel, FaqAccordion, InsuranceLogos, FinancingCallout section components
  - phase: 02-02
    provides: TrustStrip layout component
  - phase: 01-02
    provides: faqs.ts, services.ts, site.ts content data
  - phase: 01-03
    provides: buildMetadata, faqPageSchema, JsonLd helpers

provides:
  - LeadForm client component (4-field form with client validation and success state)
  - Full homepage at / composing all 10 sections in CONTEXT.md locked order
  - generateMetadata (static const) for homepage SEO with canonical path="/"
  - FAQPage JSON-LD mounted on homepage using same 6-FAQ array as accordion
  - Anchor targets id="estimate-form" and id="services" resolving Header + StickyMobileCTA hrefs

affects:
  - Phase 4 (service pages) — pattern for buildMetadata usage established
  - Phase 5 (form wiring) — LeadForm has PHASE 5 TODO stub ready for n8n/Formspree POST
  - Phase 6 (sitemap/robots) — homepage canonical URL set at /
  - Phase 7 (deploy) — full homepage ready for Vercel preview verification

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "LeadForm: client component with noValidate + JS error state (4 fields, success toggle)"
    - "FAQ curation: HOMEPAGE_FAQ_IDS const + hard-fail throw at module init if id missing"
    - "FAQPage JSON-LD and FaqAccordion share exact same homepageFaqs array (no drift possible)"
    - "page.tsx uses static export const metadata (not async generateMetadata) — simpler for known values"
    - "useAbsoluteTitle: true bypasses root layout title template to prevent double-branding"

key-files:
  created:
    - src/components/sections/LeadForm.tsx
  modified:
    - src/app/(marketing)/page.tsx

key-decisions:
  - "static export const metadata (not async generateMetadata) — title/description known at build time"
  - "homepageFaqs curated once at module level, passed to both faqPageSchema() and FaqAccordion — single source of truth prevents JSON-LD vs UI drift"
  - "LocalBusiness JSON-LD NOT re-mounted in page.tsx — Footer already mounts it (Phase 2 decision)"
  - "Phase 5 deferred: LeadForm submit handler is e.preventDefault() + console.log stub with TODO comment"
  - "fetch() in TODO comment is in a comment only — no active fetch call in LeadForm"

patterns-established:
  - "Per-page SEO: export const metadata = buildMetadata({ path, useAbsoluteTitle, title, description })"
  - "FAQ pattern: curate ids → hard-fail map → pass same array to both JSON-LD and UI component"
  - "Client form pattern: 'use client', noValidate, FieldErrors type, validate() pure fn, success state toggle"

# Metrics
duration: 18min
completed: 2026-04-15
---

# Phase 03 Plan 04: LeadForm + Homepage Composition Summary

**`"use client"` LeadForm with 4-field client validation + RSC page.tsx composing all 10 homepage sections in CONTEXT.md order with FAQPage JSON-LD and buildMetadata canonical at /**

## Performance

- **Duration:** ~18 min
- **Started:** 2026-04-15T00:19:58Z
- **Completed:** 2026-04-15T00:38:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- LeadForm.tsx: "use client" form component, 4 labelled fields (Name, Phone/primary, Service select from services.ts, ZIP), client validation, success state "We'll call you within 2 hours", trust line above, tel: fallback below, id="estimate-form" with scroll-mt-16/20, bg-primary-600 section with white card — no fetch, no POST, no reCAPTCHA
- page.tsx rewrite: RSC homepage composing all 10 sections in CONTEXT.md locked order, static metadata export via buildMetadata(path="/", useAbsoluteTitle), 6-FAQ curation with module-init hard-fail, FAQPage JSON-LD from same array as FaqAccordion
- All checks pass: tsc --noEmit, npm run lint, npm run build, dev server curl verification

## Task Commits

1. **Task 1: LeadForm client component** - `f551b9e` (feat)
2. **Task 2: Homepage page.tsx composition** - `5d8e34e` (feat)

**Plan metadata:** (see final commit below)

## Files Created/Modified

- `src/components/sections/LeadForm.tsx` — "use client" form component; 4 required fields with htmlFor labels; client validation (10-digit phone strip, 5-digit ZIP regex); success state with "We'll call you within 2 hours"; trust line + tel: fallback; id="estimate-form"; bg-primary-600 section with white rounded card
- `src/app/(marketing)/page.tsx` — full RSC homepage; 10 imports + 10 renders in locked order; static metadata const; 6-FAQ hard-fail curation; FAQPage JSON-LD + FaqAccordion sharing same array

## Decisions Made

- **Static `export const metadata`** preferred over `export async function generateMetadata()` — title and description are compile-time constants, async form adds no value and disables static prerendering benefit
- **`homepageFaqs` at module level** (not inside the component) — ensures JSON-LD and accordion always consume identical data, never possible to pass different arrays
- **`fetch()` in PHASE 5 TODO comment** — plan template itself included `fetch()` in the comment text; verified no active fetch call exists; grep hit is comment-only
- **grep -c returns 2 for `faqPageSchema` and `buildMetadata`** — import statement + usage = 2 occurrences each, which is correct; plan verification intent was "feature is present and used" which passes

## Deviations from Plan

None — plan executed exactly as written. All 6 curated FAQ ids (faq-7, faq-5, faq-9, faq-2, faq-4, faq-8) existed in faqs.ts. No id substitutions needed.

## Curl Verification Output

Dev server started, homepage fetched at http://localhost:3000/, all required markers confirmed:

```
id="services"              ✓ (ServiceGrid anchor)
id="estimate-form"         ✓ (LeadForm anchor)
The Family-Owned Roofer Omaha Calls Back  ✓ (Hero h1 locked headline)
"@type":"FAQPage"          ✓ (FAQPage JSON-LD script)
"HomeAndConstructionBusiness"  ✓ (LocalBusiness from Footer)
Raptor Roofing             ✓ (brand name present)
```

Response size: 168,592 bytes. Dev server killed after verification.

## Build Output

```
✓ Compiled successfully in 2.5s
✓ Generating static pages (4/4)
Route (app)
┌ ○ /
└ ○ /_not-found
```

Homepage prerendered as static content (○). Zero build errors.

## Metadata Details

- **Title:** "Omaha Roofing Services | Raptor Roofing" — 40 chars (under 60 limit)
- **Description:** "Family-owned Omaha roofer since 2009. Roof replacement, siding, gutters & 24/7 emergency tarping. Licensed & insured. Call for a free estimate." — 143 chars (under 155 limit, includes "free estimate" CTA)
- **Canonical:** `${siteConfig.url}/` via `path: "/"` in buildMetadata
- **useAbsoluteTitle: true** — bypasses `%s | Raptor Roofing — Omaha Roofer` template to prevent double-brand

## FAQ Curation Verification

All 6 IDs verified present in faqs.ts before writing code:

| ID | Category | Question (excerpt) |
|----|----------|--------------------|
| faq-7 | process | How long does a roof replacement take? |
| faq-5 | insurance | Do you work directly with insurance adjusters? |
| faq-9 | warranty | What warranty do you provide on roofing work? |
| faq-2 | storm-damage | Legitimate roofer vs storm chaser? |
| faq-4 | insurance | Will homeowner's insurance cover replacement? |
| faq-8 | process | Do I need to be home during installation? |

## LocalBusiness JSON-LD Confirmation

`grep -c 'localBusinessSchema' src/app/(marketing)/page.tsx` returns **0** — confirmed not re-mounted. Footer (Phase 2) owns the LocalBusiness schema.

## Issues Encountered

None.

## Next Phase Readiness

- Phase 3 complete: all 10 sections composed and live at `/`
- id="estimate-form" anchor now resolves — Header "Free Estimate" button and StickyMobileCTA both scroll correctly
- Phase 5 form handler: LeadForm has stub comment at the exact insertion point — `// PHASE 5 TODO: replace with fetch()`
- Phase 4 (service pages): buildMetadata pattern is now demonstrated in page.tsx — copy and adapt per-service
- No blockers for orchestrator Phase 3 verification

---
*Phase: 03-homepage*
*Completed: 2026-04-15*
