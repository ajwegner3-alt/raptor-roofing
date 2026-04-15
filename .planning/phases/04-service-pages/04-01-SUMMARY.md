---
phase: 04-service-pages
plan: "01"
subsystem: ui
tags: [nextjs, react, tailwind, service-pages, json-ld, schema, seo, lead-form, components]

# Dependency graph
requires:
  - phase: 03-homepage
    provides: LeadForm, TestimonialCarousel, FaqAccordion, TrustStrip, Hero pattern, buildMetadata, schema.tsx factories, globals.css @theme tokens
  - phase: 01-foundation
    provides: services.ts, faqs.ts, testimonials.ts, site.ts, metadata.ts, schema.tsx
  - phase: 02-global-components
    provides: TrustStrip, Header, Footer (LocalBusiness JSON-LD already in Footer)
provides:
  - problemChecklist field on Service interface (all 4 services populated)
  - 12 new service-specific FAQs (4 each for siding, gutters, emergency-tarping)
  - LeadForm defaultService prop for pre-selected service dropdown
  - TestimonialCarousel testimonials prop for scoped subsets
  - ServiceBreadcrumb component (Home / Services / [Service] trail with aria attributes)
  - ServiceHero component (5-layer stack, dual CTAs, isEmergency branch)
  - ServiceCTABand component (mid-page CTA band)
  - BeforeAfterGallery component (2-4 PLACEHOLDER slots)
  - RelatedServicesBlock component (3-card grid linking to sibling services)
  - ServicePageTemplate (11-section shared template)
  - /services/roofing static route with full metadata, 3 JSON-LD blocks, all 11 sections
affects:
  - 04-02 (siding, gutters pages — reuse ServicePageTemplate as-is)
  - 04-03 (emergency-tarping page — reuse ServicePageTemplate with isEmergency branch)
  - 06-seo (sitemap.ts needs to include /services/roofing and future service pages)
  - 08-handoff (PLACEHOLDER items catalogued below)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "ServicePageTemplate receives (service, faqs, testimonials, relatedServices) — page file controls which items appear, matches JSON-LD passed to schema factories"
    - "Static route folders per service (/services/roofing/page.tsx) not [slug] dynamic route"
    - "isEmergency boolean on Service controls insurance documentation block and hero right-column branch — no conditional imports in page files"
    - "LeadForm defaultService prop initializes useState — homepage <LeadForm /> usage unchanged (defaults to empty string)"
    - "TestimonialCarousel testimonials prop falls back to allTestimonials import if undefined — carousel skipped in template if length === 0"

key-files:
  created:
    - src/components/sections/ServiceHero.tsx
    - src/components/sections/ServiceBreadcrumb.tsx
    - src/components/sections/ServiceCTABand.tsx
    - src/components/sections/BeforeAfterGallery.tsx
    - src/components/sections/RelatedServicesBlock.tsx
    - src/components/templates/ServicePageTemplate.tsx
    - src/app/(marketing)/services/roofing/page.tsx
  modified:
    - src/content/services.ts
    - src/content/faqs.ts
    - src/components/sections/LeadForm.tsx
    - src/components/sections/TestimonialCarousel.tsx

key-decisions:
  - "Static route folders (services/roofing/page.tsx) not [slug] dynamic route — four known pages, no generateStaticParams needed, explicit JSON-LD per file"
  - "ServicePageTemplate: faqs and testimonials are passed explicitly from the page file so JSON-LD schema factories receive the same data the component renders (no duplication risk)"
  - "Emergency-tarping hero right column: large tel: tap-to-call card (not LeadForm) — LeadForm appears in section 11 as on all pages"
  - "TestimonialCarousel: if testimonials.length === 0 the section is skipped entirely rather than rendering an empty widget"
  - "Anti-chaser guardrail: 'don't wait on pre-cut materials' in gutters FAQ-18 is a logistics statement not urgency copy — confirmed acceptable"

patterns-established:
  - "Service page schema pattern: serviceSchema + breadcrumbSchema + faqPageSchema injected at page level, localBusinessSchema NOT duplicated (Footer owns it)"
  - "Problem section order: problemCopy prose intro first, then problemChecklist ul with lucide Check icons"
  - "Roof-peak SVG divider fill = #f4f6f7 (neutral-50) to match TrustStrip background — copied from Hero.tsx"

# Metrics
duration: 7min
completed: 2026-04-15
---

# Phase 4 Plan 01: Service Pages Foundation + Roofing Template Summary

**Shared 11-section ServicePageTemplate built using problemChecklist + per-service FAQ data; /services/roofing ships with Service + BreadcrumbList + FAQPage JSON-LD, dual CTAs, and buildMetadata canonical**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-04-15T01:32:05Z
- **Completed:** 2026-04-15T01:38:28Z
- **Tasks:** 3/3
- **Files modified:** 11 (4 modified, 7 created)

## Accomplishments

- Closed all content gaps: `problemChecklist` added to Service interface and populated for all 4 services; 12 new service-specific FAQs (4 each for siding/gutters/emergency-tarping); `LeadForm` and `TestimonialCarousel` accept optional props without breaking homepage
- Built 5 new section components (ServiceHero, ServiceBreadcrumb, ServiceCTABand, BeforeAfterGallery, RelatedServicesBlock) and the shared ServicePageTemplate rendering all 11 sections in Problem→Process→Proof→Form order
- Shipped `/services/roofing` static route with 3 JSON-LD blocks (serviceSchema, breadcrumbSchema, faqPageSchema), unique metadata/canonical, breadcrumbs, and all 11 template sections — builds successfully via `npm run build`

## Task Commits

Each task was committed atomically:

1. **Task 1: Close content gaps** - `e8be00d` (feat)
2. **Task 2: Build ServiceHero, ServicePageTemplate, and supporting sections** - `7ded38c` (feat)
3. **Task 3: Ship /services/roofing page** - `240d4b2` (feat)

## Files Created/Modified

**Modified:**
- `src/content/services.ts` — Added `problemChecklist: string[]` to Service interface; populated 5-6 symptom bullets per service for all 4 services
- `src/content/faqs.ts` — Added 12 new FAQs (faq-11 through faq-22) for siding (4), gutters (4), and emergency-tarping (4)
- `src/components/sections/LeadForm.tsx` — Added `defaultService?: string` prop initializing service state
- `src/components/sections/TestimonialCarousel.tsx` — Added `testimonials?: Testimonial[]` prop with `allTestimonials` fallback

**Created:**
- `src/components/sections/ServiceHero.tsx` — 5-layer stack hero with service.heroImagePath bg, H1 from service.headline, micro-trust line, dual CTAs (tel: + #estimate-form anchor), isEmergency tap-to-call branch for right column
- `src/components/sections/ServiceBreadcrumb.tsx` — Home / Services / [Service] breadcrumb trail with `aria-label="Breadcrumb"` and `aria-current="page"` on active item
- `src/components/sections/ServiceCTABand.tsx` — Full-width mid-page CTA band (bg-primary-900), Call Now + Free Estimate, no urgency language
- `src/components/sections/BeforeAfterGallery.tsx` — 2-4 slot PLACEHOLDER gallery grid (4:3 aspect ratio), amber [PLACEHOLDER] banners, neutral captions
- `src/components/sections/RelatedServicesBlock.tsx` — 3-card grid linking to sibling services via next/link with hover states
- `src/components/templates/ServicePageTemplate.tsx` — 11-section template + isEmergency insurance documentation block (contains "document" and "insurance" at least once each)
- `src/app/(marketing)/services/roofing/page.tsx` — Static route with buildMetadata, 3 JsonLd injections, ServicePageTemplate composition

## Decisions Made

- **Static route folders over [slug]:** Four known services, explicit metadata exports per file, simpler build with no `generateStaticParams` required
- **faqs and testimonials passed from page file:** JSON-LD schema factories receive the same data the component renders — no risk of mismatch
- **Emergency hero right column = tap-to-call card:** LeadForm still appears in section 11 for emergency-tarping, but the hero prioritizes the phone number
- **Skip testimonials section if length === 0:** Prevents empty carousel widget rather than showing a broken UI
- **Anti-chaser check:** "don't wait on pre-cut materials" (FAQ-18, gutters) is a logistics statement not urgency copy — confirmed acceptable by context

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- The anti-chaser grep pattern `don.t wait` (`.` matches any char in regex) matched "don't wait on pre-cut materials" in FAQ-18 — a false positive. Individual-pattern checks confirmed no actual anti-chaser urgency language present. Content is clean.

## Placeholders to Resolve Before Launch (Phase 8)

- All 4 `heroImagePath` fields in services.ts point to placeholder images — real project photos needed
- FAQ-11: siding cost range needs `[PLACEHOLDER]` resolved once material costs confirmed
- FAQ-14: siding warranty years `[PLACEHOLDER]` — confirm with manufacturer
- FAQ-22: emergency tarping cost range `[PLACEHOLDER]` — confirm once current pricing locked

## Next Phase Readiness

**Ready for 04-02 (siding + gutters pages):**
- ServicePageTemplate: import and pass (service, faqs, testimonials, relatedServices) — no modification needed
- `problemChecklist` populated for siding and gutters
- ≥4 FAQs per service already in faqs.ts
- `getServiceBySlug`, `getRelatedServices`, `getFaqsByService`, `getTestimonialsByService` all work

**Ready for 04-03 (emergency-tarping page):**
- `service.isEmergency === true` activates insurance documentation block and tap-to-call hero
- ≥4 emergency-tarping FAQs in faqs.ts
- Anti-chaser guardrails verified clean on all content written

**Known concern for 06-seo:**
- `sitemap.ts` will need `/services/roofing` (and sibling pages) added when it's created

---
*Phase: 04-service-pages*
*Completed: 2026-04-15*
