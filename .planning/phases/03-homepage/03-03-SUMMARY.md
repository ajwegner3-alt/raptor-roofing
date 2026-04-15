---
phase: 03-homepage
plan: 03
subsystem: ui
tags: [react, nextjs, tailwind, testimonials, faq, insurance, financing, placeholder, ftc, accessibility]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: globals.css with .placeholder-banner class, Tailwind v4 brand tokens
  - phase: 01-foundation
    provides: src/content/testimonials.ts (6 placeholder entries) and src/content/faqs.ts (10 entries)
provides:
  - TestimonialCarousel — client component, single-card view, prev/next arrows, 6 dot indicators, placeholder-banner on all 6 cards
  - FaqAccordion — pure RSC, native details/summary, accepts faqs prop, rotating chevron
  - InsuranceLogos — pure RSC, 5 inline SVG carrier placeholders, grayscale row, placeholder disclosure
  - FinancingCallout — pure RSC, amber placeholder-banner on dollar figure, bg-warm-50 section
affects:
  - 03-04 (homepage composition) — must pass faqs prop to FaqAccordion; all 4 components compose into page.tsx
  - 08-handoff — placeholder-banner on all 4 components drives handoff checklist items

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client island isolation: only TestimonialCarousel uses 'use client' in this plan, all others are RSC"
    - "Native HTML accordion: <details>/<summary> for zero-JS expand/collapse in FaqAccordion"
    - "Inline SVG placeholders: carrier logos as SVG text rects, no external image deps"
    - "Prop-driven curation: FaqAccordion accepts faqs: FAQ[] so page.tsx controls which 6 items render and FAQPage JSON-LD uses the same slice"

key-files:
  created:
    - src/components/sections/TestimonialCarousel.tsx
    - src/components/sections/FaqAccordion.tsx
    - src/components/sections/InsuranceLogos.tsx
    - src/components/sections/FinancingCallout.tsx
  modified: []

key-decisions:
  - "TestimonialCarousel: absolute-position + opacity crossfade prevents card height jitter on index change"
  - "FaqAccordion: prop-driven (faqs: FAQ[]) so FAQPage JSON-LD in page.tsx uses identical slice — avoids Rich Results mismatch"
  - "InsuranceLogos: inline SVG with <text> element vs. <Image> tags pointing to non-existent files"
  - "FaqAccordion allows multiple FAQ items open simultaneously (native <details> behavior) — CONTEXT.md marks this acceptable"

patterns-established:
  - "Placeholder disclosure pattern: every component with placeholder content uses className='placeholder-banner' on a visible element"
  - "RSC default: components without interactive state ship as RSC; 'use client' is an explicit opt-in"
  - "Prop curation: section components accept curated arrays as props rather than importing full content arrays directly"

# Metrics
duration: 3min
completed: 2026-04-15
---

# Phase 03 Plan 03: Proof Stack Components Summary

**FTC-safe testimonial carousel, native HTML FAQ accordion, insurance carrier logo row, and financing callout — 4 section components ready for 03-04 homepage composition**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-04-15T00:14:44Z
- **Completed:** 2026-04-15T00:17:09Z
- **Tasks:** 4
- **Files created:** 4

## Accomplishments

- TestimonialCarousel: single-card-visible client component with prev/next arrows, 6 dot indicators, and amber placeholder-banner on all 6 cards (HME-10, HME-11 satisfied)
- FaqAccordion: pure RSC using native `<details>`/`<summary>` with zero client JS, accepts `faqs: FAQ[]` prop for page.tsx curation (HME-12 ready)
- InsuranceLogos: 5 carrier placeholder rects (State Farm, Allstate, American Family, Farmers, Liberty Mutual) with grayscale treatment and placeholder disclosure (HME-15 satisfied)
- FinancingCallout: dedicated `bg-warm-50` section with `placeholder-banner` on the dollar figure — no real rate shown (HME-16 satisfied)

## Task Commits

Each task committed atomically:

1. **Task 1: TestimonialCarousel** - `d0e8790` (feat)
2. **Task 2: FaqAccordion** - `6d9a72e` (feat)
3. **Task 3: InsuranceLogos** - `0b54ce1` (feat)
4. **Task 4: FinancingCallout** - `67e2c2a` (feat)

**Plan metadata:** (committed with plan + summary)

## Files Created

- `src/components/sections/TestimonialCarousel.tsx` — `"use client"`, useState for active index, 6 testimonials from content/testimonials.ts, placeholder-banner on every card, prev/next arrow buttons with aria-label, dot indicators with aria-selected
- `src/components/sections/FaqAccordion.tsx` — RSC, native `<details>`/`<summary>`, `faqs: FAQ[]` prop interface, ChevronDown with group-open:rotate-180, no "use client", no direct content import, no JsonLd
- `src/components/sections/InsuranceLogos.tsx` — RSC, 5 inline SVG placeholder rects, grayscale opacity-80 wrapper, placeholder-banner disclosure
- `src/components/sections/FinancingCallout.tsx` — RSC, bg-warm-50, `<span className="placeholder-banner">$[PLACEHOLDER]/mo</span>`

## Decisions Made

- FaqAccordion allows multiple items open simultaneously (native `<details>` default) — CONTEXT.md explicitly marks either behavior acceptable
- Absolute positioning + opacity transition used in TestimonialCarousel rather than conditional rendering, to prevent card container height from collapsing between cards
- InsuranceLogos uses inline SVG `<text>` elements rather than `<Image>` components pointing to non-existent carrier logo files

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

All 4 components ready for import in 03-04 (homepage composition):

```tsx
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { InsuranceLogos } from "@/components/sections/InsuranceLogos";
import { FinancingCallout } from "@/components/sections/FinancingCallout";
```

03-04 must:
- Pass a curated 6-item slice to `<FaqAccordion faqs={homepageFaqs} />`
- Mount `<JsonLd data={faqPageSchema(homepageFaqs)} />` as a sibling before `<FaqAccordion>` (NOT inside FaqAccordion)
- LocalBusiness JSON-LD already mounted in Footer (Phase 2) — do NOT re-mount on homepage

---
*Phase: 03-homepage*
*Completed: 2026-04-15*
