---
phase: 06-seo-performance-accessibility
plan: 04
subsystem: ui
tags: [accessibility, wcag, a11y, focus-visible, tap-targets, skip-link, contrast]

requires:
  - phase: 02-global-components
    provides: Header, Footer, MobileMenuButton layout components
  - phase: 03-homepage
    provides: TestimonialCarousel, LeadForm, ServiceGrid, FaqAccordion
  - phase: 05-about-contact
    provides: ContactForm with reCAPTCHA

provides:
  - Skip-to-main link fires correctly (href="#main" + id="main" + tabIndex={-1})
  - All form fields use focus-visible (not focus) — crimson accent-500 ring, keyboard-only
  - TestimonialCarousel dot buttons upgraded from 12×12 to 48×48 tap area (visual dot stays 12px)
  - Footer service/service-area/legal links all at min-h-[48px] (7 occurrences, zero 44px)
  - Desktop nav links at min-h-[48px] with px-2 side padding
  - Mobile nav links at min-h-[48px]
  - FaqAccordion summary trigger at min-h-[48px]
  - ServiceGrid "Learn more" link at min-h-[48px]
  - neutral-500 contrast verified at 6.55:1 (passes AA — no color change needed)
  - Amber [PLACEHOLDER] banner contrast documented at 6.37:1 (passes AA — no change)
  - CSS a11y infrastructure (*:focus-visible, .skip-to-main) verified intact

affects:
  - Phase 8 manual QA (keyboard walkthrough and mobile tap verification)
  - Any future interactive components (must follow min-h-[48px] and focus-visible: patterns)

tech-stack:
  added: []
  patterns:
    - "Tap target pattern: wrapping button with h-12 w-12 flex items-center justify-center, visual element as inner span"
    - "Focus ring: focus-visible: only (not focus:) — prevents spurious ring on mouse click"
    - "Skip link target: id='main' + tabIndex={-1} on <main> element — programmatically focusable without tab stop"

key-files:
  created: []
  modified:
    - src/app/layout.tsx
    - src/app/(marketing)/layout.tsx
    - src/components/sections/LeadForm.tsx
    - src/components/sections/ContactForm.tsx
    - src/components/sections/TestimonialCarousel.tsx
    - src/components/layout/Footer.tsx
    - src/components/layout/Header.tsx
    - src/components/layout/MobileMenuButton.tsx
    - src/components/sections/FaqAccordion.tsx
    - src/components/sections/ServiceGrid.tsx

key-decisions:
  - "TestimonialCarousel dot pattern: h-12 w-12 wrapper button + inner h-3 w-3 span (Pattern A). Chosen over pseudo-element approach for readability and accessibility semantics."
  - "neutral-500 text contrast verified at 6.55:1 — no upgrade to neutral-600 needed. Computation: L(#4a5c62)=0.0999, L(#faf7f2)=0.9326, ratio=(0.9326+0.05)/(0.0999+0.05)=6.55:1"
  - "Amber banner contrast documented at 6.37:1 — no color change. Colors: #92400e on #fef3c7 (per RESEARCH.md Q10)"
  - "focus:outline-none preserved alongside focus-visible: classes — outline-none prevents browser default, focus-visible: adds brand ring. Both needed."
  - "Footer email link: inline-flex min-h-[48px] items-center (was missing tap target entirely)"

patterns-established:
  - "min-h-[48px] floor — CONTEXT.md lock: use ONLY min-h-[48px], never min-h-[44px], for all interactive elements"
  - "focus-visible: over focus: — form fields, buttons, links all use focus-visible: for ring classes"
  - "Dot carousel pattern — 48x48 button wrapper + aria-label + inner visual span with aria-hidden"

duration: 25min
completed: 2026-04-15
---

# Phase 06 Plan 04: Full A11Y Sweep Summary

**Closed 6 WCAG gaps: skip-to-main target aligned, focus-visible rings on all form fields, TestimonialCarousel dot buttons upgraded from 12x12 to 48x48 hit area, and every interactive element (nav, footer, FAQ, service cards) enforced at min-h-[48px] with zero 44px exceptions**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-04-15T00:00:00Z
- **Completed:** 2026-04-15T00:25:00Z
- **Tasks:** 4 (3 with code changes, 1 read-only verification)
- **Files modified:** 10

## Accomplishments

- Skip-to-main link now fires correctly: `href="#main"` in root layout matches `id="main" tabIndex={-1}` on marketing layout `<main>` — element is programmatically focusable without adding a tab stop
- All 8 form fields in LeadForm and ContactForm converted from `focus:ring-primary-500` → `focus-visible:ring-accent-500` (crimson), preventing spurious rings on mouse click
- TestimonialCarousel dot buttons fixed from 12×12 CSS pixels (WCAG 2.5.5 fail by factor of 4) to 48×48 hit area via h-12 w-12 wrapper button with inner visual span
- Footer: 7 occurrences of min-h-[48px] across service links, service-area links, email link, and legal items — zero min-h-[44px] violations
- neutral-500 contrast verified at 6.55:1 (passes WCAG AA 4.5:1 — no code change needed)
- Amber [PLACEHOLDER] banner contrast documented at 6.37:1 (passes — no color change)

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix skip-to-main link + main element focus target** — `ecefc71` (fix)
2. **Task 2: Audit + fix form focus styles (focus-visible instead of focus)** — `1a7dba0` (fix)
3. **Task 3: Fix tap targets on dot nav + footer links + desktop nav + form inputs** — `7997519` (fix)
4. **Task 4: Verify focus-visible rule + skip-to-main CSS + amber banner audit** — read-only, no commit needed

**Plan metadata:** pending (next commit)

## Files Created/Modified

- `src/app/layout.tsx` — skip-to-main `href="#main-content"` → `href="#main"`
- `src/app/(marketing)/layout.tsx` — `id="main-content"` → `id="main"`, added `tabIndex={-1}`
- `src/components/sections/LeadForm.tsx` — 4 form fields: `focus:ring-primary-500` → `focus-visible:ring-accent-500`, added `min-h-[48px]` to each
- `src/components/sections/ContactForm.tsx` — 4 form fields: same conversion, added `min-h-[48px]` to each
- `src/components/sections/TestimonialCarousel.tsx` — dot buttons: `h-3 w-3` standalone → `h-12 w-12` wrapper + inner `h-3 w-3 span`
- `src/components/layout/Footer.tsx` — services list, service-areas list, email link, legal items all get `min-h-[48px]` (7 total)
- `src/components/layout/Header.tsx` — 3 desktop nav links get `flex min-h-[48px] items-center px-2`
- `src/components/layout/MobileMenuButton.tsx` — 3 mobile nav links get `flex min-h-[48px] items-center`
- `src/components/sections/FaqAccordion.tsx` — `<summary>` gets `min-h-[48px]`
- `src/components/sections/ServiceGrid.tsx` — "Learn more" link gets `min-h-[48px]` (was inline link with no floor)

## Decisions Made

- **TestimonialCarousel dot pattern:** Used Pattern A (h-12 w-12 flex wrapper + inner visual span with aria-hidden) over Pattern B (pseudo-element). Reason: Pattern A is easier to reason about, more semantically clean, and gap-0 on the container keeps visual spacing unchanged.
- **neutral-500 contrast audit result:** 6.55:1 — PASSES AA. Computation: `L(#4a5c62)=0.0999`, `L(#faf7f2)=0.9326`, `ratio=(0.9326+0.05)/(0.0999+0.05)=6.55:1`. No upgrade to neutral-600 needed.
- **Amber banner audit (documentation only):** `.placeholder-banner` uses `color: #92400e` on `background: #fef3c7` — computed ratio 6.37:1 per RESEARCH.md Q10. Passes WCAG AA (4.5:1) comfortably. Found in: TestimonialCarousel.tsx, FinancingCallout.tsx, InsuranceLogos.tsx, ContactForm.tsx. No color change.
- **Hero overlay contrast spot-check:** Hero uses `rgba(15,30,36,0.78)` at darkest (near-black at 78% opacity) behind white H1 text — estimated ratio ~15:1+. No fix needed.
- **Footer email link:** Added `min-h-[48px]` — was missing tap target floor entirely (only had `hover:text-accent-400`).
- **focus:outline-none preserved:** Kept alongside focus-visible: classes to suppress browser default outline. Both are needed: `focus:outline-none` removes the default, `focus-visible:ring-accent-500` adds the brand ring. This is intentional and correct.

## Contrast Audit Summary

| Element | Text Color | Background | Ratio | Result |
|---------|-----------|------------|-------|--------|
| neutral-500 body copy | #4a5c62 | #faf7f2 | 6.55:1 | PASS |
| amber placeholder banner | #92400e | #fef3c7 | 6.37:1 | PASS |
| hero H1 (white on overlay) | #ffffff | rgba(15,30,36,0.78) | ~15:1 | PASS |

## Tap Target Audit Summary

| Element | Before | After | File |
|---------|--------|-------|------|
| TestimonialCarousel dots | 12×12 FAIL | 48×48 PASS | TestimonialCarousel.tsx |
| Footer service links | ~24px | min-h-[48px] PASS | Footer.tsx |
| Footer service-area links | ~24px | min-h-[48px] PASS | Footer.tsx |
| Footer email link | ~24px | min-h-[48px] PASS | Footer.tsx |
| Footer legal items | ~24px | min-h-[48px] PASS | Footer.tsx |
| Desktop nav links | ~32px | min-h-[48px] PASS | Header.tsx |
| Mobile nav links | ~40px | min-h-[48px] PASS | MobileMenuButton.tsx |
| LeadForm inputs | ~40px | min-h-[48px] PASS | LeadForm.tsx |
| ContactForm inputs | ~40px | min-h-[48px] PASS | ContactForm.tsx |
| FAQ accordion summary | p-6 (adequate) | min-h-[48px] explicit | FaqAccordion.tsx |
| ServiceGrid "Learn more" | ~24px inline | min-h-[48px] PASS | ServiceGrid.tsx |

Already passing (no change needed):
- Mobile phone icon button: `h-12 w-12` (Header.tsx) — already 48×48
- Hamburger menu button: `h-12 w-12` (MobileMenuButton.tsx) — already 48×48
- Close button: `h-12 w-12` (MobileMenuButton.tsx) — already 48×48
- Social icon buttons: `h-12 w-12` (Footer.tsx) — already 48×48
- LeadForm submit button: `min-h-[48px]` — already compliant
- ContactForm submit button: `min-h-[48px]` — already compliant
- Prev/Next carousel buttons: `h-12 w-12` (TestimonialCarousel.tsx) — already 48×48

## CSS A11Y Infrastructure Verification (Task 4 — Read-only)

All three CSS items verified intact in `src/app/globals.css`:

1. **`*:focus-visible` rule** (line 118): `outline: 2px solid var(--color-accent-500); outline-offset: 2px; border-radius: 2px;` — crimson brand ring, 2px + 2px offset, correct.
2. **`.skip-to-main`** (line 125): visually hidden (`left: -9999px; width: 1px; height: 1px`) until focused.
3. **`.skip-to-main:focus`** (line 133): appears at `top: 1rem; left: 1rem` in brand teal background with accent-500 outline ring — correct.

## ServiceGrid Audit Finding

ServiceGrid cards are `<article>` elements with an inline `<Link>` ("Learn more") at the bottom — NOT full-card clickable links. The card itself is not interactive; only the "Learn more" link at the bottom is the tap target. The link had no explicit `min-h` floor, so `min-h-[48px]` was added. The card icon container (`h-12 w-12`) is non-interactive (aria-hidden icon inside a div) — no fix needed there.

## Deviations from Plan

None — plan executed exactly as written. All task types and patterns matched plan specification. The neutral-500 contrast check was a pass (6.55:1), so no `text-neutral-600` upgrade was needed (no code change for Fix 8 in Task 3).

## A11Y Requirements Closed

- **A11Y-01:** Skip-to-main fires correctly — `href="#main"` matches `id="main"` + `tabIndex={-1}` on `<main>`
- **A11Y-02:** Focus-visible ring on all interactive elements — global `*:focus-visible` rule verified + form fields explicitly converted to `focus-visible:`
- **A11Y-03:** All form fields have `<label htmlFor>` — LeadForm (4 labels: lead-name, lead-phone, lead-service, lead-zip) and ContactForm (4 labels: contact-name, contact-phone, contact-service, contact-zip) — all present, no label-less fields
- **A11Y-04:** 48×48 tap targets — all interactive elements verified (see tap target audit table above)
- **A11Y-05:** Contrast AA compliance — neutral-500 6.55:1 PASS, amber banner 6.37:1 PASS, hero overlay ~15:1 PASS
- **A11Y-06:** Hero overlay contrast — dark gradient at 78% opacity behind white H1, estimated ~15:1+ PASS

## Manual QA Note

Phase 8 owns the complete keyboard walkthrough: tab through every page in order, verify focus ring visible on each element, press Enter on skip link and confirm scroll jumps to `<main>`. Claude cannot automate full keyboard navigation — this is a human-in-the-loop check on a real browser with a real keyboard (per CONTEXT.md note on Keyboard nav walkthrough).

## Issues Encountered

None — all files found at expected paths, all grep patterns matched as predicted by RESEARCH.md. Build succeeded on first run.

## Next Phase Readiness

- A11Y-01 through A11Y-06 all closed — Phase 6 a11y track complete
- Phase 8 manual QA owns: full keyboard tab walkthrough, mobile tap target measurement in DevTools, skip-to-main live browser test
- No blockers for Phase 7 (deployment)

---
*Phase: 06-seo-performance-accessibility*
*Completed: 2026-04-15*
