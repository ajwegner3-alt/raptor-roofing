# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-13)

**Core value:** Omaha homeowner trusts Raptor Roofing over every competitor within 10 seconds of landing
**Current focus:** Phase 5 — Lead Forms & Backend (Phase 4 complete — all 4 service pages live)

## Current Position

Phase: 4 of 8 (Service Pages) — COMPLETE
Plan: 3 of 3 in Phase 4 — 04-01 ✓, 04-02 ✓, 04-03 ✓ (emergency-tarping + Phase 4 final audit)
Status: Phase 4 complete; all 4 service pages built and pushed; SVC-01 through SVC-10 all PASS; anti-chaser hard-gate PASSED
Last activity: 2026-04-15 — Completed 04-03-PLAN.md (emergency-tarping route + Phase 4 SVC audit)

Progress: [█████░░░░░] 33% (8/24 plans complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 3
- Average duration: ~15 min
- Total execution time: ~0.75 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 1 (Foundation) | 3/3 | ~45 min | ~15 min |
| Phase 2 (Global Components) | 2/2 | ~30 min | ~15 min |

**Recent Trend:**
- Last 5 plans: 01-01 (13 min), 01-02 (18 min), 01-03 (parallel), 02-01 (~18 min), 02-02 (~12 min)
- Trend: Consistent ~15 min/plan

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Phase 2: next/link Link required for all internal page navigation — raw `<a>` on page routes triggers @next/next/no-html-link-for-pages lint error
- Phase 2: env(safe-area-inset-bottom) for fixed bottom bars must use inline style, not Tailwind arbitrary value
- Phase 2: --sticky-cta-height defined on :root (plain CSS), NOT in @theme (not a Tailwind token)
- Phase 2: TrustStrip authored in Phase 2 but NOT mounted in marketing layout — homepage page.tsx renders it (Phase 3)
- Phase 2: StickyMobileCTA is RSC (no 'use client') — no state needed, static siteConfig values
- Phase 2: lucide-react installed version lacks Facebook/Instagram icons — use ExternalLink/Share2 as social placeholders until Phase 8 brand asset pass
- Phase 2: SiteConfig address fields are .state + .zip (not .region + .postalCode) — adapt footer/any component consuming address accordingly
- Phase 2: Sunday hours entry uses open: "" + closed: true boolean — hours guard must check h.closed || h.open === ""
- Phase 1: **Next.js 16.2.3** (not 15) App Router + Tailwind v4.2.2 — confirmed via create-next-app@latest on 2026-04-14
- Phase 1: Tailwind v4 CSS-first config in globals.css `@theme` block — no tailwind.config.js
- Phase 1: ESLint flat config (eslint.config.mjs) — `next lint` removed in Next.js 16, lint script = `eslint .`
- Phase 1: Scaffold strategy = sibling temp dir (cp -rn) due to non-empty project root
- Phase 1: schema.tsx (not .ts) — JsonLd component uses JSX syntax, requires .tsx extension
- Phase 1: schema-dts v2 DayOfWeek cast — must cast h.day as DayOfWeek type (short form "Monday" accepted)
- Phase 1: metadataBase fallback is https://raptor-roofing.vercel.app (not localhost) for absolute OG URLs
- Phase 5: Form handler choice (n8n webhook vs Formspree) deferred to Phase 5 planning — resolve at 05-02 plan time
- Phase 7: Deploy target is Vercel preview URL only; do NOT submit to Google Search Console during pitch
- Phase 4: Static route folders (services/roofing/page.tsx) not [slug] dynamic route — four known pages, no generateStaticParams needed
- Phase 4: ServicePageTemplate faqs+testimonials passed from page file so JSON-LD schema factories receive same data as rendered component
- Phase 4: Emergency hero right column = large tel: tap-to-call card (NOT LeadForm) — LeadForm still in section 11
- Phase 4: TestimonialCarousel section skipped entirely in template if testimonials.length === 0 (no empty widget)

### Pending Todos

- Phase 2 COMPLETE — all 5 layout components built and committed (Header, MobileMenuButton, Footer, StickyMobileCTA, TrustStrip)
- Phase 3 COMPLETE — Homepage live with all sections, pushed to GitHub for Vercel deployment
- Phase 4 COMPLETE — all 4 service pages built: /services/roofing, /services/siding, /services/gutters, /services/emergency-tarping
- Phase 5 NEXT — Lead form backend (n8n webhook vs Formspree decision deferred to 05-02 plan time)
- Phase 6 (06-01): Add app/sitemap.ts + app/robots.ts — must include all 4 service routes
- 22 PLACEHOLDER tags in src/content/ must be resolved before public launch (Phase 8 handoff audit)

### Post-Phase-2 layout-chrome SEO + Conversion audit (2026-04-14)

Audit of shipped Phase 1+2 chrome. Phase 3 content NOT yet assessed (doesn't exist).

SEO gaps flagged (non-blocking for Phase 3, owned by later phases):
- Phase 6 (06-01): Add app/sitemap.ts + app/robots.ts — currently missing, Google has no crawl map
- Phase 3+: Every page metadata MUST set alternates.canonical via buildMetadata() — critical for duplicate-content prevention on service-area pages (canonical helper may need to be added to @/lib/metadata if not present)
- Phase 8 handoff: Header logo is currently a placeholder "R" div, not a real logo file with alt text — replace with real Raptor logo asset
- Phase 7 deploy gate: If client buys a real domain, update NEXT_PUBLIC_SITE_URL before indexing (currently defaults to raptor-roofing.vercel.app)

Conversion observations:
- Three redundant paths to phone are working (header icon, mobile menu Call Now, sticky CTA) — phone reachability is the site's strongest conversion feature
- Free Estimate button href="/#estimate-form" is a forward reference — the anchor target does NOT exist until Phase 3 ships LeadForm with id="estimate-form". Tapping Free Estimate before Phase 3 = no-op scroll. Self-resolves in Phase 3.
- No "Open now / Closed now" live indicator in Footer hours — intentionally omitted, conflicts with anti-chaser no-urgency stance. Leave as-is.

### Blockers/Concerns

- Open question: NE contractor license number unknown — use placeholder in site.ts, add to HANDOFF.md (Phase 2)
- Open question: Real Google review count and rating unknown — placeholder "4.9 stars / 127 reviews", label clearly (Phase 2)
- Open question: Financing partner unknown — "as low as $X/mo" placeholder with [PLACEHOLDER] label (Phase 3)
- RESOLVED: Tailwind v4 version assumption — confirmed v4.2.2 installed (was listed as "^4" in package.json)
- RESOLVED: BBB accreditation — CONFIRMED A- rating by client on 2026-04-14. Hero displays an inline-SVG BBB seal approximation (teal #00607B torch + BBB wordmark + A- badge) as a visual stand-in. Phase 8 handoff must swap this for the OFFICIAL seal art downloaded from Raptor's accredited business dashboard on BBB.org — only accredited members can legally use the real trademarked mark. Grep `role="img" aria-label="BBB` in src/components/sections/Hero.tsx to find the swap point.
- FTC risk: Every placeholder testimonial MUST display amber [PLACEHOLDER] banner — no exceptions (Phase 3 onward)

## Session Continuity

Last session: 2026-04-15T01:45:10Z
Stopped at: Completed 04-03-PLAN.md (emergency-tarping route + Phase 4 SVC-01–SVC-10 final audit — Phase 4 COMPLETE)
Resume file: None
