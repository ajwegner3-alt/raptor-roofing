---
phase: 03-homepage
verified_at: 2026-04-14
status: human_needed
score: 5/5
---

# Phase 3: Homepage Verification Report

**Phase Goal:** A visitor opening the homepage preview URL sees the full Raptor Roofing story.
**Verified:** 2026-04-14
**Status:** HUMAN_NEEDED - all automated checks pass; visual/device checks deferred to Phase 8
**Re-verification:** No - initial verification

---

## Summary

All 10 sections are present, substantive, and wired correctly. Every hard gate grep passes. TypeScript (tsc --noEmit) and ESLint (npm run lint) both exit 0 with zero output. All 5 success criteria are verifiably met in code. The fetch() token in LeadForm appears only inside a comment on line 35 - not executable. Section composition matches the locked order exactly. All 6 placeholder testimonials carry isPlaceholder: true and the carousel renders a visible placeholder-banner span on every card. The faqPageSchema JSON-LD is mounted once in page.tsx and receives the same homepageFaqs array that FaqAccordion renders, preventing any mismatch between visible content and structured data.

---

## Must-Haves Check

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Hero: single static real-photo, dark overlay, locality-first H1, micro-trust line, exactly two CTAs, no urgency, no carousel | VERIFIED | Hero.tsx:13 single Image fill; :24 overlay div; :31 one h1; :52-67 two CTAs only; :9 uses 100dvh not 100vh; no urgency language |
| 2 | Every placeholder testimonial card has visible [PLACEHOLDER] banner | VERIFIED | testimonials.ts:28,39,50,61,72,83 all isPlaceholder:true; TestimonialCarousel.tsx:36-39 conditional placeholder-banner span fires on every card |
| 3 | FAQ accordion native expand/collapse + FAQPage JSON-LD injected inline | VERIFIED | FaqAccordion.tsx:24 uses native details/summary; page.tsx:54 mounts JsonLd with faqPageSchema(homepageFaqs); same array fed to FaqAccordion at page.tsx:63 |
| 4 | Lead form: Name, Phone, Service, ZIP; Phone primary required; trust signals adjacent | VERIFIED | LeadForm.tsx:95-229 four fields; :126 Phone labelled (required) with inputMode=tel; :55-57 trust copy directly above form; no executable fetch/axios |
| 5 | Insurance carrier logo row and financing callout both visible with [PLACEHOLDER] labels | VERIFIED | InsuranceLogos.tsx 5 carriers + placeholder-banner disclaimer at :57; FinancingCallout.tsx:16 placeholder-banner span on financing amount |

**Score: 5/5 truths verified**

---

## Build Gates

| Gate | Result |
|------|--------|
| npx tsc --noEmit | PASS - exits 0, zero output |
| npm run lint | PASS - exits 0, zero output |

---

## Section Composition

Verified at page.tsx lines 56-65, exact order:

1. Hero - line 56
2. TrustStrip - line 57
3. ServiceGrid - line 58
4. WhyNotChaser - line 59
5. Insurance3Step - line 60
6. TestimonialCarousel - line 61
7. InsuranceLogos - line 62
8. FaqAccordion faqs={homepageFaqs} - line 63
9. FinancingCallout - line 64
10. LeadForm - line 65

JsonLd with faqPageSchema(homepageFaqs) mounted at line 54. homepageFaqs is a curated 6-item slice of faqs from @/content/faqs, built at page.tsx:39-48 with a runtime throw guard if any ID is missing.

---

## Hard Gate Greps

| Grep | Result |
|------|--------|
| setInterval/setTimeout in TestimonialCarousel | PASS - 0 matches |
| localBusinessSchema in page.tsx | PASS - 0 matches (Footer mounts it) |
| fetch( or axios in LeadForm (executable) | PASS - comment only at line 35 |
| reCAPTCHA in LeadForm | PASS - 0 matches |
| id=services in ServiceGrid | PASS - line 17 |
| id=estimate-form in LeadForm | PASS - line 42 |
| use client in page.tsx | PASS - 0 matches (server component) |
| use client in 7 server-only sections | PASS - 0 matches in Hero, ServiceGrid, WhyNotChaser, Insurance3Step, FaqAccordion, InsuranceLogos, FinancingCallout |
| use client in TestimonialCarousel | PASS - line 1 |
| use client in LeadForm | PASS - line 1 |
| placeholder-banner count in TestimonialCarousel | PASS - 1 (conditional render covers all 6 cards) |
| placeholder-banner count in FinancingCallout | PASS - 1 |
| faqPageSchema + JsonLd in page.tsx | PASS - 2 matches (import + usage) |
| buildMetadata in page.tsx | PASS - lines 2, 19 |
| scroll-mt- in ServiceGrid | PASS - line 18 (scroll-mt-16 lg:scroll-mt-20) |
| scroll-mt- in LeadForm | PASS - line 44 (scroll-mt-16 lg:scroll-mt-20) |
| success copy present | PASS - HTML entity form at lines 52 and 69 |
| 100vh in Hero | PASS - 0 matches; uses 100dvh at line 9 |
| h1 count in Hero | PASS - exactly 1 at line 31 |

---

## Deviations Noted

1. services.ts token count: 7 slug: matches, only 4 are data entries (roofing, siding, gutters, emergency-tarping). Other 3 are TypeScript interface + utility function signatures. 4-card requirement met.
2. fetch() in LeadForm line 35: Appears in a comment, not executable. Gate passes. Comment is intentional.
3. Success copy grep: Searched for literal apostrophe; JSX uses HTML entity. Content is correct at lines 52 and 69.
4. placeholder-banner count = 1 in TestimonialCarousel: Single class reference inside conditional block that fires for all 6 cards (all have isPlaceholder: true). FTC requirement fully met.

---

## Artifacts Verified

| Artifact | Lines | Wired At | Status |
|----------|-------|----------|--------|
| src/app/(marketing)/page.tsx | 65 | root | VERIFIED |
| src/components/sections/Hero.tsx | 72 | page.tsx:6,56 | VERIFIED |
| src/components/sections/ServiceGrid.tsx | 62 | page.tsx:8,58 | VERIFIED |
| src/components/sections/WhyNotChaser.tsx | 94 | page.tsx:9,59 | VERIFIED |
| src/components/sections/Insurance3Step.tsx | 80 | page.tsx:10,60 | VERIFIED |
| src/components/sections/TestimonialCarousel.tsx | 109 | page.tsx:11,61 | VERIFIED |
| src/components/sections/FaqAccordion.tsx | 44 | page.tsx:13,63 with faqs prop | VERIFIED |
| src/components/sections/InsuranceLogos.tsx | 64 | page.tsx:12,62 | VERIFIED |
| src/components/sections/FinancingCallout.tsx | 24 | page.tsx:14,64 | VERIFIED |
| src/components/sections/LeadForm.tsx | 253 | page.tsx:15,65 | VERIFIED |
| public/images/hero-placeholder.jpg | 322KB JPEG 1920x1280 | Hero.tsx:14 | VERIFIED |
| public/images/HERO_CREDIT.txt | 314 bytes | attribution present | VERIFIED |
| src/lib/metadata.ts | - | page.tsx:2,19 | VERIFIED |
| src/lib/schema.tsx | - | page.tsx:3,54 | VERIFIED |
| src/content/faqs.ts | 6 IDs present | page.tsx:39 | VERIFIED |
| src/components/layout/TrustStrip.tsx | exists | page.tsx:7,57 | VERIFIED |

---

## Human Verification Required (Phase 8)

### 1. Hero overlay contrast on real device
**Test:** Load homepage on mobile in bright-light conditions.
**Expected:** White headline text clearly legible; overlay does not obscure all photo detail.
**Why human:** CSS var(--color-overlay) opacity cannot be evaluated from code.

### 2. Mobile viewport layout of all 10 sections
**Test:** View at 375px, 390px, and 430px widths.
**Expected:** No horizontal overflow, no clipped text, 48px tap targets, ServiceGrid single-column stack.
**Why human:** Responsive behavior requires a real viewport.

### 3. TestimonialCarousel arrow focus rings on keyboard
**Test:** Tab to carousel navigation buttons and activate.
**Expected:** Focus ring visible on prev/next buttons; aria-selected updates on dot indicators.
**Why human:** Focus ring rendering depends on browser/OS.

### 4. FAQ accordion expand/collapse behavior
**Test:** Click each FAQ summary element.
**Expected:** Details expands/collapses; ChevronDown rotates 180deg via group-open:rotate-180.
**Why human:** Native details animation varies by browser.

### 5. LeadForm validation error UX on real device
**Test:** Submit empty, then with invalid phone, then invalid ZIP.
**Expected:** Per-field errors appear; form does not advance to success state.
**Why human:** Touch keyboard behavior and error reflow need visual confirmation.

### 6. Scroll-to-anchor from hero Estimate CTA
**Test:** Click Request a Free Estimate in hero.
**Expected:** Page scrolls to LeadForm with sufficient offset to clear sticky header.
**Why human:** Smooth scroll plus sticky header clearance must be confirmed visually.

### 7. Hero LCP on real mobile Lighthouse
**Test:** Run Lighthouse on deployed URL, mobile profile.
**Expected:** LCP under 2.5s; hero image is LCP element.
**Why human:** Deferred to Phase 6 (performance audit).


---

_Verified: 2026-04-14_
_Verifier: Claude (gsd-verifier)_
