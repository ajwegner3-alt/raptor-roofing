# Phase 3: Homepage - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Compose the full Raptor Roofing homepage at `src/app/(marketing)/page.tsx`. This phase builds every section component the homepage needs (Hero, ServiceGrid/ServiceCard, WhyNotChaser, Insurance3Step, TestimonialCarousel, InsuranceLogos, FaqAccordion, FinancingCallout, LeadForm), renders them in order inside `page.tsx`, wires `LocalBusiness` + `FAQPage` JSON-LD via `@/lib/schema`, and exports `generateMetadata` using `buildMetadata()` from `@/lib/metadata`. Also renders the already-built `TrustStrip` component (from Phase 2) in its homepage slot immediately below the hero.

The Header, Footer, StickyMobileCTA are already inherited from `(marketing)/layout.tsx` — not in scope.

Every piece of visible content is Phase 1 `src/content/*` data plus [PLACEHOLDER] disclosures where data is not yet real. Service pages, About, and Contact belong to later phases.

</domain>

<decisions>
## Implementation Decisions

### Section order (top to bottom on the homepage)

1. **Hero** (full-viewport, image + overlay + headline + CTAs)
2. **TrustStrip** (already built in Phase 2 — render from `page.tsx` as the first post-hero row)
3. **ServiceGrid** (4 service cards: Roofing, Siding, Gutters, Emergency Tarping)
4. **WhyNotChaser** (side-by-side comparison: Storm chasers vs Raptor)
5. **Insurance3Step** (horizontal numbered cards: Inspect → Document → Coordinate)
6. **TestimonialCarousel** (single-card-visible, manual arrows + dot indicators)
7. **InsuranceLogos** (grayscale carrier logo row with heading)
8. **FaqAccordion** (6 questions, practical homeowner tone, `FAQPage` JSON-LD)
9. **FinancingCallout** (dedicated section with big `[PLACEHOLDER]` amber banner)
10. **LeadForm** (dedicated section near bottom, slate-teal bg, white form card)
11. Footer (already wired from layout, not in scope)

The WhyNotChaser → ServiceGrid → Testimonials flow was considered. User picked: **Services first**, then anti-chaser differentiator + process together, then proof stack. This gives: "here's what we do" → "here's why we're different + how we run claims" → "here's proof" → "here's objection handling (FAQ + financing)" → "here's how to buy (form)."

### Hero

- **Headline angle:** Direct value prop — _"The Family-Owned Roofer Omaha Calls Back."_ (exact copy is Claude's discretion — leans into family + responsiveness; must not make unverifiable ranking claims)
- **Subheadline:** Short supporting line about the anti-chaser positioning (1 sentence, Claude's discretion)
- **Hero photo:** Real photograph of a crew on a roof working on an Omaha-style suburban home. Action + authenticity, not stock illustration. Phase 3 must use a real image (placeholder file path is fine — real asset is a Phase 8 handoff item, but file MUST be a real photo, not an SVG illustration). Use `next/image` with `priority` + `fetchPriority="high"`.
- **Image treatment:** Single static photo with dark overlay for headline legibility. No carousel. No autoplay video. No motion.
- **Trust signals placement:** Single micro-trust line IN the hero, directly below the headline/subheadline — small text like `"Licensed NE #[PLACEHOLDER] · 15 Years in Omaha · 4.9★ 127 reviews [PLACEHOLDER]"`. Keep it subtle, on the hero background. The full 5-badge TrustStrip lives separately as its own row below the hero (do not duplicate the badge row inside the hero).
- **CTAs:** Two buttons side-by-side directly under the trust line. Both equal weight visually but crimson hierarchy: `Call (402) 885-1462` (crimson filled, tel: link) on the left, `Request a Free Estimate` (slate-outline or ghost) on the right that scrolls to `#estimate-form`. Both meet 48x48 tap target. Stack vertically on narrow mobile.
- **No urgency copy.** No "24 hours only", no "limited time", no "storm damage emergency — call now or lose coverage" — anti-chaser principles forbid panic language.
- **Hero extends full viewport.** Use `min-h-[calc(100vh-header)]` or similar — first visible impression fills the screen.

### Anti-chaser story

- **WhyNotChaser format:** Two-column side-by-side comparison. Left column = "Storm chaser crews" with 4–5 negative checkpoints (out-of-state, subcontracted labor, gone after the claim, pressure tactics, unfamiliar with NE code). Right column = "Raptor Roofing" with matching positive checkpoints (Omaha-owned, no subcontractors, here after the claim, no door-knock pressure, local codes expert). Uses red ✗ icons on left, green ✓ icons on right (or equivalent brand-token replacements). Stacks mobile.
- **Insurance3Step visual:** Horizontal numbered cards (3 cards left-to-right on desktop, stack vertical on mobile). Each card: a large numeral (1 / 2 / 3), icon, title, one-sentence explanation.
- **Insurance3Step content:** Inspect → Document → Coordinate.
  - **1. Inspect:** "We come out at no cost and walk your roof for storm damage."
  - **2. Document:** "We photograph and itemize every damaged area for your insurance carrier."
  - **3. Coordinate:** "We work directly with your adjuster so you never have to relay messages."
  - (exact copy is Claude's discretion, must stay within anti-chaser guidelines — no "call us before the insurance company!" panic)
- **Order:** WhyNotChaser comes BEFORE Insurance3Step. But per decision 1 (section order), the ServiceGrid sits between TrustStrip and WhyNotChaser — so the actual sequence in `page.tsx` is TrustStrip → ServiceGrid → WhyNotChaser → Insurance3Step. The two anti-chaser sections are back-to-back so they read as one unified narrative.

### Proof stack

- **TestimonialCarousel mechanics:** Manual arrows + dot indicators only. One card visible at a time on desktop and mobile. NO auto-advance. No motion loops. This is FTC-safe + accessibility-safe. Minimum 5 cards pulled from `src/content/testimonials.ts`.
- **Every testimonial card MUST display the amber [PLACEHOLDER] banner** (top-right or top-full-width of the card). This is non-negotiable — FTC risk per STATE.md. The banner text: `[PLACEHOLDER] Sample testimonial — will be replaced with real customer review before launch`. Use `--color-accent-500` or a brand-safe amber variant.
- **FAQ count and tone:** 6 questions, practical homeowner tone. Covers: how long does a roof install take, do you work with my insurance carrier, what warranty do you offer, are you licensed and insured in Nebraska, do you use subcontractors, what's the process from estimate to install. Content comes from `src/content/faqs.ts` (may need to be expanded in this phase if fewer than 6 exist). One or two answers can subtly reinforce anti-chaser positioning (e.g., subcontractor question) without leading with it.
- **FaqAccordion behavior:** Standard expand/collapse, only one open at a time (or allow multiple — Claude's discretion, both are acceptable). Renders inline `FAQPage` JSON-LD via `@/lib/schema` factory. Keyboard-accessible (Space/Enter toggles, focus-visible ring).
- **Insurance carrier logo row:** Grayscale logos arranged in a horizontal row with a heading like `"Works with every major insurance carrier"`. Grayscale treatment keeps it subtle and avoids visual endorsement claims. Use [PLACEHOLDER] image files — real carrier logos to be sourced in Phase 8. Minimum 5 carriers shown. On mobile, wrap or scroll horizontally.
- **FinancingCallout:** Full-width dedicated section with a large amber `[PLACEHOLDER]` banner. Copy: `"Financing available — as low as $[PLACEHOLDER]/mo"` with the entire section visibly flagged so no visitor mistakes the dollar amount for a real offer. Rendered as its own row between FAQ and LeadForm.

### Lead form

- **Placement:** Single dedicated section near the bottom of the homepage (just before the footer inherits from layout). No duplicate compact form in the upper half.
- **Visual wrap:** Section has `bg-primary-600` (slate-teal) background. The form itself sits inside a white card with shadow and rounded corners, creating visual contrast against the dark section bg.
- **Fields (required per roadmap HME and Phase 5 spec):** Name, Phone (primary — this is the ask), Service (select from the 4 services), ZIP. Email is NOT a primary field. Phone is the required anchor.
- **Phase 3 form behavior:** The actual POST handler (n8n webhook or Formspree) is deferred to Phase 5. Phase 3 ships the form UI with client-side validation and a visible "We'll call you within 2 hours" callback promise copy block. Submission in Phase 3 can be a no-op or log-only — document this clearly in the component so Phase 5 knows to wire the POST.
- **Trust signals adjacent to form:** Single line ABOVE the form: `"Licensed NE #[PLACEHOLDER] · Bonded & Insured"`. Single line BELOW the form: `"Prefer to talk? Call (402) 885-1462"` as a tel: link. Both give visitors a credential reassurance above and an alternate path below.
- **Anchor target:** The form's wrapping section must have `id="estimate-form"` so the hero "Request a Free Estimate" CTA can scroll to it, and so the StickyMobileCTA "Free Estimate" button also lands here.

### Schema + Metadata

- Homepage exports `generateMetadata` using `buildMetadata()` from `@/lib/metadata` — title "Omaha Roofing Services | Raptor Roofing" (or similar under 60 chars), description 150–155 chars including "call for a free estimate" CTA per project SEO rules.
- Homepage mounts `<JsonLd data={localBusinessSchema()} />` at the top of the component tree (or inside the Footer's existing mount — plan can decide, but Phase 2 already anchored it in Footer so the homepage does NOT re-mount LocalBusiness; skip duplication).
- Homepage mounts `<JsonLd data={faqPageSchema(faqs)} />` inside or near the FaqAccordion section. FAQPage factory should exist in `@/lib/schema` — if not, Phase 3 adds it.
- `robots: { index: true, follow: true }` is already set at the root layout — nothing to do at page level.

### Claude's Discretion

- Exact headline and subheadline copy (within the Direct value prop angle, anti-chaser boundaries, no urgency)
- Exact WhyNotChaser checkpoint wording (must be factual, brand-consistent, non-defamatory toward other contractors in general — attacks "storm chasers" as a behavior pattern, not any named business)
- Exact FAQ question/answer copy beyond the topic list
- Hero photo file path / placeholder asset name (must be a real photo format — JPG/WEBP/AVIF — not an SVG)
- Typographic scale, section padding, spacing rhythm
- Loading states / skeletons if any
- Whether FaqAccordion allows one-open or multiple-open
- Icon choices for ServiceCards, WhyNotChaser check/x, Insurance3Step (use lucide-react, respecting the v1.8.0 export limitations from Phase 2 STATE)
- TestimonialCarousel swipe-gesture support on touch (optional polish)
- Where `FAQPage` JSON-LD factory lives (add to `@/lib/schema` if missing)

</decisions>

<specifics>
## Specific Ideas

- **Three redundant paths to Free Estimate:** Hero CTA "Request a Free Estimate" → scrolls to `#estimate-form`. StickyMobileCTA "Free Estimate" button → `/#estimate-form`. LeadForm section itself. Visitors can reach the form no matter where they are on the page.
- **Every [PLACEHOLDER] must be visible.** Not a code comment, not a muted tag — an actual amber banner or label that an Omaha homeowner reading the live site would notice. This is an FTC insurance policy during the pitch.
- **Anti-chaser is the differentiator.** The homepage's emotional beat is: "a reliable local roofer that won't vanish after the storm." Every section should reinforce that positioning without restating it.
- **No urgency language anywhere on the homepage.** No "act now", no "limited time", no "don't wait — insurance deadlines apply". This is a core anti-chaser principle from PROJECT.md.
- **Hero photo cannot be SVG illustration.** A real photo of a real crew on a real roof — even if it's a placeholder stock image pulled from Unsplash for the pitch, it MUST be a photograph.
- **Section padding + rhythm should feel premium-contractor, not Silicon-Valley-startup.** Generous whitespace, serious typography, no playful animations.

</specifics>

<deferred>
## Deferred Ideas

- **Real LeadForm submission handler** — n8n webhook vs Formspree decision is Phase 5 (05-02 plan). Phase 3 ships the UI with validation but no POST.
- **Real testimonial content** — Phase 8 handoff replaces [PLACEHOLDER] testimonials with real Raptor customer quotes.
- **Real insurance carrier logos** — Phase 8 handoff replaces placeholder logo files with actual carrier brand assets.
- **Real hero photo** — Phase 8 handoff replaces placeholder with Raptor's actual crew photo. Phase 3 uses a stock photograph to prove layout.
- **Real financing terms** — Phase 8 handoff replaces `$[PLACEHOLDER]/mo` with actual partner program. Phase 3 banner is explicitly a placeholder.
- **Video testimonials / before-after sliders / project gallery** — Out of scope for Phase 3. If the client wants them, they're future-milestone work.
- **Blog / content hub** — Out of scope entirely.
- **Real Google review count and rating** — Phase 8. Phase 3 uses [PLACEHOLDER] treatment.
- **Compact secondary form in the upper half** — Considered but rejected. One form, dedicated section, late in the page.

</deferred>

---

*Phase: 03-homepage*
*Context gathered: 2026-04-14*
