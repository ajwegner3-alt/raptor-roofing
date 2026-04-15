# Phase 4: Service Pages - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Four dedicated service pages (Roofing, Siding, Gutters, Emergency Tarping) at `/services/{slug}` URLs. Each page sells one service, links to siblings, feeds the sitewide lead form, and injects Service + BreadcrumbList JSON-LD. No content duplication across pages.

**Out of scope:** About page, Contact page, sitemap/robots, Lighthouse pass, deploy — all downstream phases.

</domain>

<decisions>
## Implementation Decisions

### Template anatomy (applies to all four pages)
- **Baseline sections, in this scroll order:**
  1. Visible breadcrumbs (Home / Services / [Service])
  2. Service hero — unique real-photo background, H1, micro-trust line, dual CTAs
  3. Problem section — symptom-led checklist (homeowner-observable signs)
  4. Process section — service-specific 3 steps (not universal)
  5. Mid-page CTA band (Call + Free Estimate)
  6. TrustStrip (reuse sitewide component)
  7. Before/after gallery — 2–4 labeled `[PLACEHOLDER]` slots
  8. Testimonials slice (reuse homepage TestimonialCarousel content or scoped subset — all with amber `[PLACEHOLDER]` banners)
  9. Service-specific FAQ (3–5 unique FAQs per service) + FAQPage JSON-LD
  10. Related Services card block (3 cards linking to sibling services)
  11. LeadForm section (reuse homepage LeadForm, Service dropdown pre-selected to current page)
- **Section order rule:** Problem → Process → Proof → Form. Empathy first, confidence second, evidence third, capture last.
- **H1 format:** `[Service] in Omaha, NE` — tight, keyword-led, local SEO proven. No value-led/clever headlines on service pages.
- **Hero CTAs:** Same dual-CTA pattern as homepage — primary "Call Now" (tel:) + secondary "Free Estimate" (anchor to in-page form id). No service-specific CTA label variations.
- **CTA repetition:** Hero + mid-page CTA band + end-of-page lead form. Plus sitewide sticky header and mobile bottom bar. Three in-page touchpoints minimum.

### Service differentiation
- **Divergence depth:** Copy + unique hero photo per service. Same template, same sections, same structure — only headlines, problem copy, process steps, FAQs, and hero photo change per page.
- **Hero photos:** Each service gets a distinct real-photo background (roof tear-off, siding install, gutter work, storm tarping). All four staged as `[PLACEHOLDER]` photo slots labeled for Phase 8 asset handoff.
- **Process steps:** Service-specific bespoke 3 steps per service — NOT a universal template.
  - Roofing: e.g., Tear-off → Decking inspection → Install
  - Siding: e.g., Prep → Install → Trim/finish
  - Gutters: e.g., Measure → Fabricate → Hang
  - Emergency Tarping: e.g., Safety check → Document damage → Tarp secure
- **Problem framing:** Symptom-led checklist — "Is your roof showing these signs?" with homeowner-observable bullets (curling shingles, granules in gutters, daylight in attic, etc.). Scannable, not narrative.
- **FAQs:** 3–5 unique, service-specific FAQs per page (cost range, timeline, warranty, permit, process). Each drafted by Claude as realistic content — any unknowns (license #, warranty terms, exact pricing) get `[PLACEHOLDER]` tags. FAQPage JSON-LD injected on each page.

### Emergency Tarping — tone and positioning
- **Urgency style:** Calm, capable, available. No countdowns, no fear copy, no storm-damage scare tactics. "We answer the phone 24/7 after storms. Same-day tarp-ups across Omaha." Availability itself IS the trust signal.
- **Phone prominence on this page:** Giant hero phone number as a 48px+ `tel:` link + secondary "Tap to call" card in the hero. Free Estimate button stays as a calmer secondary CTA. This is the ONLY service page with outsized phone treatment.
- **Insurance handling:** Prominent reassurance block — dedicated section titled something like "We document damage for your claim before we tarp." Reinforces anti-chaser positioning by contrasting with roofers who pressure homeowners into signing before the insurance adjuster arrives.
- **Anti-chaser copy guardrails (hard rules — apply to this page, also audited on all service pages):**
  - NO "limited time", deadlines, countdowns, or manufactured urgency language
  - NO "free roof" / "your insurance will pay for this" / windfall promises (illegal + predatory)
  - NO door-to-door or canvassing references framed neutrally — Raptor explicitly positions AGAINST door-knockers
  - NO before/after captions that imply worst-case or fear outcomes

### Internal linking
- **Sibling linking pattern:** "Related Services" card block — explicit 3-card grid near the bottom of each page (above the lead form), each linking to a sibling service with a short blurb. Cards-only approach; no requirement for contextual inline links (though Claude may add them if natural).
- **Breadcrumbs:** Visible breadcrumb trail above the H1 on every service page (`Home / Services / [Service]`) + BreadcrumbList JSON-LD injected. Both visible UI and structured data — do NOT defer to Phase 6.

### Lead form on service pages
- **Reuse strategy:** Same LeadForm component as homepage — no new component. The Service dropdown is pre-selected to the current page's service via a prop (e.g., `<LeadForm defaultService="roofing" />`). User can change it if they want, but the default matches the page they're on.
- **Form ID:** Each service page's form anchor must resolve the hero's "Free Estimate" button target (e.g., `#estimate-form`). Reuse the same anchor ID pattern as the homepage.

### Claude's Discretion
- Exact hero photo composition and overlay opacity (match homepage pattern)
- Exact testimonial subset shown on service pages vs homepage (can reuse all or filter)
- Before/after gallery count per page (2–4 slots — pick per service)
- Mid-page CTA band copy and visual treatment
- Whether to add contextual inline sibling links in addition to the card block
- Exact process step copy (as long as it's service-specific, not generic)

</decisions>

<specifics>
## Specific Ideas

- **Roofing is the authoritative template.** Build `ServicePageTemplate` + `/services/roofing` first (plan 04-01), then siding/gutters reuse it with copy swaps (04-02), then emergency-tarping extends with the urgency/insurance treatment (04-03).
- **Every placeholder must be visible.** Testimonials wear amber `[PLACEHOLDER]` banners. Before/after slots are labeled. Any unknown FAQ answer (cost, warranty length, NE license #) gets a `[PLACEHOLDER]` inline tag.
- **Emergency Tarping is the page most at risk of FTC/legal scrutiny.** Treat the anti-chaser rules as non-negotiable — they are a hard-gate grep target, not a style preference.
- **The homepage LeadForm is the canon.** Do not fork it. Pass a `defaultService` prop; do not rebuild form state or validation.
- **No "pricing from $X" language** anywhere on service pages — pricing questions deferred to the form/call. Homepage financing callout is the only pricing touchpoint and already carries `[PLACEHOLDER]`.

</specifics>

<deferred>
## Deferred Ideas

- **Service-area pages** (`/service-areas/[city]`) — mentioned in CLAUDE.md SEO guidance but NOT in Phase 4 scope. Belongs in a future phase or Phase 6 SEO extension.
- **Interactive cost estimator or calculator** — explicit scope creep; belongs in a future milestone if Raptor ever wants it.
- **Live chat or SMS lead capture** — out of scope; phone + form are the only channels for the pitch site.
- **Video content on service pages** — no video in Phase 4; photos only. Revisit after real assets arrive.
- **Financing application embedded on service pages** — homepage callout is the only financing touchpoint for now; deeper integration deferred to a post-launch phase.

</deferred>

---

*Phase: 04-service-pages*
*Context gathered: 2026-04-14*
