# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-13)

**Core value:** Omaha homeowner trusts Raptor Roofing over every competitor within 10 seconds of landing
**Current focus:** Phase 1 — Foundation

## Current Position

Phase: 1 of 8 (Foundation)
Plan: 3 of 3 in current phase — PHASE 1 COMPLETE
Status: Phase complete — ready for Phase 2 (Component Library)
Last activity: 2026-04-14 — Completed 01-03-PLAN.md (app shell + metadata/schema helpers)

Progress: [██░░░░░░░░] 12% (3/24 plans complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 3
- Average duration: ~15 min
- Total execution time: ~0.75 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 1 (Foundation) | 3/3 | ~45 min | ~15 min |

**Recent Trend:**
- Last 5 plans: 01-01 (13 min), 01-02 (18 min), 01-03 (parallel)
- Trend: Consistent ~15 min/plan

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

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

- Phase 1 foundation COMPLETE — Phase 2 (Component Library) can now begin
- src/content/* types available for import by all downstream components
- Stub components in src/components/stubs/ must be replaced in Phase 2 (grep "PHASE 1 STUB")
- (marketing)/page.tsx placeholder must be replaced in Phase 3 with full homepage
- Use buildMetadata() from @/lib/metadata for all page generateMetadata exports (Phase 3+)
- Use <JsonLd data={localBusinessSchema()} /> in homepage (Phase 3)
- 22 PLACEHOLDER tags in src/content/ must be resolved before public launch (Phase 8 handoff audit)

### Blockers/Concerns

- Open question: NE contractor license number unknown — use placeholder in site.ts, add to HANDOFF.md (Phase 2)
- Open question: Real Google review count and rating unknown — placeholder "4.9 stars / 127 reviews", label clearly (Phase 2)
- Open question: Financing partner unknown — "as low as $X/mo" placeholder with [PLACEHOLDER] label (Phase 3)
- RESOLVED: Tailwind v4 version assumption — confirmed v4.2.2 installed (was listed as "^4" in package.json)
- FTC risk: Every placeholder testimonial MUST display amber [PLACEHOLDER] banner — no exceptions (Phase 3 onward)

## Session Continuity

Last session: 2026-04-14
Stopped at: Completed 01-03-PLAN.md (app shell + metadata/schema helpers, all gates green)
Resume file: None
