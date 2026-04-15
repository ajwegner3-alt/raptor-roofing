---
phase: 04-service-pages
verified: 2026-04-14T00:00:00Z
status: passed
score: 14/14 must-haves verified
human_verification:
  - test: Visit all 4 service pages on a real device and confirm all 11 sections render in order
    expected: Breadcrumbs above H1; check-icon problem checklist; 3 amber PLACEHOLDER gallery slots; 3 sibling RelatedServicesBlock cards; LeadForm at bottom
    why_human: Visual layout and responsive behavior cannot be verified via file inspection
  - test: Open /services/emergency-tarping on mobile and confirm giant phone number and insurance doc block
    expected: Phone number at 48px+ rendered size; We answer 24/7 copy visible without scrolling; insurance documentation block immediately below hero
    why_human: Font size rendering and visual hierarchy require browser confirmation
  - test: Click Free Estimate CTA on any service page hero; confirm scroll to LeadForm with service pre-selected
    expected: Smooth scroll to LeadForm; Service dropdown reads current service by default; form functional
    why_human: Anchor scroll behavior and React state initialization must be tested live
  - test: Click RelatedServicesBlock cards from each service page
    expected: Each card navigates to correct /services/{slug} URL with no 404s
    why_human: Next.js Link routing must be exercised in a real browser
---

# Phase 4: Service Pages Verification Report

**Phase Goal:** All four service pages (Roofing, Siding, Gutters, Emergency Tarping) exist at their final URLs with service-specific copy, unique metadata, Service JSON-LD, internal links, lead form paths, and before/after placeholder slots, none duplicating content across pages.

**Verified:** 2026-04-14
**Status:** PASSED
**Re-verification:** No, initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | All 4 service page files exist at correct static route paths | VERIFIED | All 4 files at src/app/(marketing)/services/{slug}/page.tsx confirmed |
| 2 | Each page has service-specific hero, problem checklist, and process steps | VERIFIED | 4 unique headlines; 5-6 distinct symptom bullets per service; 4 distinct processStep title sets |
| 3 | Each page has unique title tag, meta description, H1, and canonical URL | VERIFIED | 4 distinct metadata titles; 4 distinct canonical paths via buildMetadata; H1 from service.headline field |
| 4 | Each page ships serviceSchema + breadcrumbSchema + faqPageSchema; none ships localBusinessSchema | VERIFIED | 3 JsonLd blocks per page confirmed; 0 localBusinessSchema matches on service pages |
| 5 | Each page links to at least 2 siblings and the homepage | VERIFIED | relatedSlugs has 3 entries per service; ServiceBreadcrumb Home and Services links |
| 6 | Emergency tarping displays 24/7 phone prominently with urgency-appropriate copy | VERIFIED | isEmergency branch: text-4xl/5xl tel link; We answer 24/7 copy in hero card |
| 7 | Before/after PLACEHOLDER slots visible and labeled on every service page | VERIFIED | BeforeAfterGallery renders slotCount=3 slots with amber PLACEHOLDER banner text confirmed |
| 8 | Anti-chaser forbidden strings return 0 matches | VERIFIED | All 13 forbidden patterns: 0 matches. dont wait match is pre-documented false positive in FAQ-18 gutters logistics |
| 9 | Anti-chaser required strings present | VERIFIED | 24/7 in services.ts; document and insurance in ServicePageTemplate isEmergency block; tel: in site.ts via siteConfig.phone.href |
| 10 | LeadForm pre-selected to current service | VERIFIED | ServicePageTemplate section 11 passes defaultService={service.slug}; LeadForm id=estimate-form at line 46 |
| 11 | No near-duplicate copy across all 4 services | VERIFIED | Headlines, subheadlines, problemChecklist nouns, processStep titles, FAQ questions all verified unique |
| 12 | RelatedServicesBlock renders 3 sibling service cards per page | VERIFIED | All services have 3 relatedSlugs; RelatedServicesBlock maps relatedServices to Link cards |
| 13 | BeforeAfterGallery renders PLACEHOLDER slots | VERIFIED | Amber PLACEHOLDER banner confirmed; neutral captions; no fear language |
| 14 | ServicePageTemplate renders all 11 sections with isEmergency conditional branch | VERIFIED | Template 192 lines; all section imports present; isEmergency block with document and insurance strings; problemChecklist and processSteps both mapped |

**Score:** 14/14 truths verified

### Required Artifacts

| Artifact | Status | Details |
|----------|--------|---------|
| src/content/services.ts | VERIFIED | problemChecklist field + 5-6 bullets per service; isEmergency:true on emergency-tarping only; 4 unique headlines and metadata titles |
| src/content/faqs.ts | VERIFIED | roofing: 5 FAQs, siding: 4, gutters: 4, emergency-tarping: 4; all anti-chaser guardrails clean |
| src/components/sections/LeadForm.tsx | VERIFIED | defaultService prop at interface + destructure + useState; id=estimate-form at line 46 |
| src/components/sections/TestimonialCarousel.tsx | VERIFIED | testimonials optional prop with allTestimonials fallback; homepage usage unchanged |
| src/components/sections/ServiceHero.tsx | VERIFIED (148 lines) | 5-layer stack; service.heroImagePath bg; H1 from service.headline; dual CTAs; isEmergency text-4xl/5xl phone branch |
| src/components/sections/ServiceBreadcrumb.tsx | VERIFIED (32 lines) | aria-label=Breadcrumb; aria-current=page on active item; Home and Services as next/link elements |
| src/components/sections/ServiceCTABand.tsx | VERIFIED (45 lines) | No urgency language; tel: + #estimate-form CTAs; service-neutral copy |
| src/components/sections/BeforeAfterGallery.tsx | VERIFIED (78 lines) | PLACEHOLDER banner per slot; neutral captions; slotCount default 3 |
| src/components/sections/RelatedServicesBlock.tsx | VERIFIED (62 lines) | 3-card grid; next/link to /services/{slug}; returns null if array empty |
| src/components/templates/ServicePageTemplate.tsx | VERIFIED (192 lines) | All 11 sections in correct order; isEmergency insurance block; defaultService={service.slug} to LeadForm |
| src/app/(marketing)/services/roofing/page.tsx | VERIFIED (38 lines) | 3 JsonLd blocks; buildMetadata path /services/roofing + useAbsoluteTitle |
| src/app/(marketing)/services/siding/page.tsx | VERIFIED (38 lines) | 3 JsonLd blocks; buildMetadata path /services/siding + useAbsoluteTitle |
| src/app/(marketing)/services/gutters/page.tsx | VERIFIED (38 lines) | 3 JsonLd blocks; buildMetadata path /services/gutters + useAbsoluteTitle |
| src/app/(marketing)/services/emergency-tarping/page.tsx | VERIFIED (38 lines) | 3 JsonLd blocks; buildMetadata path /services/emergency-tarping + useAbsoluteTitle |

### Key Link Verification

| From | To | Via | Status |
|------|----|-----|--------|
| service page files | ServicePageTemplate | import + JSX | WIRED |
| service page files | schema.tsx factories | JsonLd + serviceSchema + breadcrumbSchema + faqPageSchema | WIRED, all 3 factories per page |
| ServicePageTemplate | LeadForm | defaultService={service.slug} | WIRED |
| ServiceHero | estimate-form anchor | href=#estimate-form | WIRED; id=estimate-form at LeadForm line 46 |
| ServiceHero | siteConfig.phone.href | href={siteConfig.phone.href} | WIRED; tel:+14028851462 in site.ts |
| RelatedServicesBlock | sibling service URLs | Link href=/services/{related.slug} | WIRED; all 4 services have 3 relatedSlugs |
| ServiceBreadcrumb | homepage | Link href=/ | WIRED |
| ServicePageTemplate | isEmergency block | service.isEmergency conditional | WIRED; emergency-tarping isEmergency:true in services.ts |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| SVC-01 /services/roofing route | SATISFIED | None |
| SVC-02 /services/siding route | SATISFIED | None |
| SVC-03 /services/gutters route | SATISFIED | None |
| SVC-04 /services/emergency-tarping 24/7 phone | SATISFIED | None |
| SVC-05 serviceSchema on all 4 pages | SATISFIED | None |
| SVC-06 Unique title/description/H1/canonical | SATISFIED | None |
| SVC-07 Internal links to 2+ siblings + homepage | SATISFIED | None |
| SVC-08 Lead form on every page | SATISFIED | None |
| SVC-09 Before/after PLACEHOLDER visible | SATISFIED | None |
| SVC-10 No near-duplicate copy | SATISFIED | None |

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| src/content/faqs.ts line 165 | dont wait on pre-cut materials matches regex | Pre-documented false positive | None; gutters FAQ logistics, not homeowner urgency copy |
| src/content/faqs.ts FAQ-2 | storm chaser in general FAQ (no serviceSlug binding) | Intentional | Anti-chaser educational content; not in emergency-tarping scope |
| faqs.ts FAQ-11 FAQ-14 FAQ-22; services.ts heroImagePath comments | [PLACEHOLDER] tags | Info, by design | Required per 04-CONTEXT.md; deferred to Phase 8 |

No blocker anti-patterns found.

### Human Verification Required

#### 1. Full-page visual rendering, all 4 service pages

**Test:** Navigate to each of /services/roofing, /services/siding, /services/gutters, /services/emergency-tarping on desktop and mobile.

**Expected:** All 11 sections render in scroll order; breadcrumbs appear above H1; problem checklist renders with check icons; 3 PLACEHOLDER gallery slots display amber banners; RelatedServicesBlock shows 3 sibling cards; LeadForm appears at bottom.

**Why human:** Visual layout and responsive behavior cannot be verified via file inspection.

#### 2. Emergency tarping phone prominence

**Test:** Open /services/emergency-tarping on mobile.

**Expected:** Giant phone number dominates the hero right column at 48px+ rendered size; We answer 24/7 copy visible without scrolling; insurance documentation block appears immediately after the hero.

**Why human:** CSS rendering and visual hierarchy require browser confirmation.

#### 3. Free Estimate anchor resolution

**Test:** On any service page, click the Free Estimate secondary CTA in the hero.

**Expected:** Page scrolls to in-page LeadForm; Service dropdown defaults to the current page service.

**Why human:** Anchor scroll behavior and React state initialization must be tested live.

#### 4. RelatedServicesBlock navigation

**Test:** From each service page, click each of the 3 sibling service cards.

**Expected:** Each card navigates to the correct /services/{slug} URL with no 404s.

**Why human:** Next.js Link routing must be exercised in a real browser.

## Gaps Summary

No gaps. All 14 must-haves verified in the codebase. Anti-chaser hard gates pass with 0 false violations. Required strings (24/7, document, insurance, tel:) all confirmed present in emergency-tarping scope. Phase 4 goal is achieved.

Human verification items are deferred to Phase 8 manual QA per project conventions. They are visual and behavioral checks that require a live browser.

---

*Verified: 2026-04-14*
*Verifier: Claude (gsd-verifier)*
