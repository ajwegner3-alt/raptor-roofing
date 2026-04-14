# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-13)

**Core value:** Omaha homeowner trusts Raptor Roofing over every competitor within 10 seconds of landing
**Current focus:** Phase 3 — Homepage Composition

## Current Position

Phase: 2 of 8 (Global Components) — ✓ COMPLETE (verified 17/17 must_haves)
Plan: 2 of 2 in current phase — 02-01 ✓, 02-02 ✓
Status: Phase 2 verified; Phase 3 (Homepage) ready to begin
Last activity: 2026-04-14 — gsd-verifier passed Phase 2 (VERIFICATION.md on disk)

Progress: [████░░░░░░] 21% (5/24 plans complete)

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

### Pending Todos

- Phase 2 COMPLETE — all 5 layout components built and committed (Header, MobileMenuButton, Footer, StickyMobileCTA, TrustStrip)
- Phase 3 (Homepage Composition) ready to begin
- (marketing)/page.tsx placeholder must be replaced in Phase 3 with full homepage
- Phase 3 homepage must import TrustStrip from @/components/layout/TrustStrip and render below hero
- Use buildMetadata() from @/lib/metadata for all page generateMetadata exports (Phase 3+)
- Use <JsonLd data={localBusinessSchema()} /> in homepage (Phase 3) — but note LocalBusiness is already mounted in Footer, do NOT duplicate
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
- FTC risk: Every placeholder testimonial MUST display amber [PLACEHOLDER] banner — no exceptions (Phase 3 onward)

## Session Continuity

Last session: 2026-04-14
Stopped at: Completed 02-02-PLAN.md (StickyMobileCTA + TrustStrip + layout wiring, stubs deleted)
Resume file: None
