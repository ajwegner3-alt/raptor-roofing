# Raptor Roofing Website

## What This Is

A production-quality Next.js 15 pitch site for Raptor Roofing, a family-operated roofing contractor in Omaha, NE. Built as a warm-lead pitch by North Star Integrations — the deployed Vercel preview URL at https://raptor-roofing.vercel.app is the pitch artifact itself, designed to win Raptor as a client by demonstrably outperforming their existing site at raptorroofingllc.com.

The v1.0 milestone shipped on 2026-04-18 with 8 phases, 24 plans, 6,449 lines of TypeScript/TSX, and 185 files. All 98 v1 requirements delivered. Full handoff documentation (HANDOFF.md, FUTURE_DIRECTIONS.md, README.md) committed and ready for post-sign production launch.

## Core Value

An Omaha homeowner — whether they have urgent storm damage or a planned re-roof — sees this site and trusts Raptor Roofing over every other option in the Omaha market within 10 seconds of landing.

## Requirements

### Validated (✓ v1.0)

<!-- Shipped and confirmed valuable. All 98 v1 requirements delivered. -->

- ✓ v1.0 Homepage that converts both storm-damage and planned-project visitors on the same scroll
- ✓ v1.0 Dedicated service page for Roofing (install + repair)
- ✓ v1.0 Dedicated service page for Siding
- ✓ v1.0 Dedicated service page for Gutters
- ✓ v1.0 Dedicated service page for 24/7 Emergency Tarping
- ✓ v1.0 About page telling the family-owned, no-subcontractors, anti-chaser story
- ✓ v1.0 Contact page with form, phone, hours, and service area map
- ✓ v1.0 8 service area pages (/service-areas/[slug]) with genuinely localized content — Omaha, Bellevue, Papillion, Elkhorn, Millard, La Vista, Gretna, Ralston
- ✓ v1.0 Click-to-call phone number persistent in header (sticky on mobile)
- ✓ v1.0 Lead capture form: name, phone, service needed, zip (phone-primary, not email-primary)
- ✓ v1.0 Trust signals visible on every page: BBB Accredited, founded 2025, Omaha-local, 9 reviews (5.0 stars)
- ✓ v1.0 Google review carousel replacing placeholder testimonials (FTC compliant, real review data)
- ✓ v1.0 Anti-storm-chaser brand positioning — "Family-Owned Businesses Care More Than Storm Chasers" comparison section, Storm-Chaser Copy Audit passed
- ✓ v1.0 Full SEO: unique title tags, meta descriptions, schema, OG tags, canonical, sitemap, robots
- ✓ v1.0 LocalBusiness + Service + FAQPage + BreadcrumbList + AggregateRating schema on appropriate pages
- ✓ v1.0 Google Rich Results Test: 3/3 URLs zero errors
- ✓ v1.0 Lighthouse: 28/28 scores ≥90
- ✓ v1.0 Mobile-first responsive — verified iPhone Safari + Android Chrome
- ✓ v1.0 Header Services + Service Areas dropdown navigation
- ✓ v1.0 Mid-page FinalCTA components on all service pages
- ✓ v1.0 UrgencyBar scroll-triggered component (dismissible, sessionStorage)
- ✓ v1.0 Demo calendar booking UI on lead form success state
- ✓ v1.0 Deployed to Vercel preview URL — https://raptor-roofing.vercel.app
- ✓ v1.0 HANDOFF.md, FUTURE_DIRECTIONS.md, README.md committed — all 38 // PLACEHOLDER: tags searchable

### Active

<!-- Current scope. Building toward these. -->

(None — v1.0 milestone complete. Next milestone TBD.)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Real project gallery with before/after photos — no real project photos available yet; placeholder slots exist
- Blog/content marketing scaffold — defer until post-sign
- Live chat / chatbot — adds friction and maintenance, contractors convert on calls
- Supabase backend or database — form submissions go to email via handler, no auth, no user accounts
- Custom domain setup — deployed to Vercel preview URL only; domain handoff happens post-signing
- Contacting the real Raptor Roofing for assets or approval — this is a warm-lead pitch, not a signed engagement
- Analytics dashboard implementation — CLAUDE.md specifies building scaffolding; document the integration path, don't build the full dashboard

## Context

**Client snapshot (Raptor Roofing, raptorroofingllc.com):**
- Omaha, NE — family-operated, founded 2025, LLC
- Licensed, insured, and bonded — no subcontractors, all in-house crews
- Phone: (402) 885-1462
- Hours: Mon–Sat 7am–7pm, closed Sundays
- Services: roofing install/repair, siding, gutters, 24/7 emergency tarping
- Free estimates, financing available
- Reviews: 9 reviews, 5.0 stars (real data as of 2026-04-15)
- BBB Accredited (confirmed badge)
- Logo: cartoon velociraptor holding a hammer — dark slate-teal (primary), warm crimson/red (accent), black (wordmark), wood-brown (warm neutral), white/cream (background)

**Tech stack:**
- Next.js 15 App Router + Tailwind v4 + TypeScript
- Vercel hosting (preview URL, auto-deploy on push to master)
- GitHub repo: github.com/ajwegner3-alt/raptor-roofing
- Vercel Web Analytics enabled (free tier)
- Demo-mode form stubs — email delivery wired via Gmail SMTP in code but zero env vars deployed (graceful degradation for pitch)

**Live URL:** https://raptor-roofing.vercel.app

**v1.0 stats:**
- 6,449 lines of TypeScript/TSX
- 185 files created/modified
- 8 phases, 24 plans, 5 days (2026-04-13 → 2026-04-18)
- Git range: cb6a988 → 201c32c

**Omaha roofing market dynamics:**
- Nebraska sits in the hail belt — storm damage and insurance claims drive the highest search volume
- Market is saturated with out-of-state "storm chasers" who do sloppy work and disappear after storms
- Local homeowners are actively skeptical of roofers who lead with urgency/storm-damage copy — it signals chaser
- The winning positioning is **trust-led storm response**: use Raptor's actual differentiators (local, family-owned, no subs, bonded/insured) to position them as the anti-chaser, then offer storm inspections and financing as action paths
- This works for BOTH audiences: storm victims who've been burned by chasers want trust before urgency; planned-project homeowners want the same proof points

**Workflow integration:**
- This project's CLAUDE.md defines a Discovery → Audit → 5 Iterations → Combine → Finalize workflow
- GSD wrapped this workflow — Discovery (done) → phases 1-8 → Manual QA phase — all complete
- FUTURE_DIRECTIONS.md committed per Andrew's global instructions

## Constraints

- **Tech stack**: Next.js (App Router) + Tailwind CSS — matches Andrew's standard stack, required for Vercel deployment and proper SEO metadata
- **Hosting**: Vercel preview deployment — free tier, no custom domain needed for pitch
- **Budget**: $0 — free-tier tools only, no paid services or APIs
- **Typography**: Google Fonts via CDN — variety across iterations, no system fonts
- **Assets**: Logo provided; all other imagery must be licensed stock or AI-generated with clear labeling
- **Photos**: No real project photos, no real testimonials, no real team photos — everything is plausible placeholder content clearly marked for replacement
- **Accessibility**: WCAG AA minimum — contractors' customers include older homeowners on mobile
- **Performance**: LCP < 2.5s, CLS < 0.1, INP < 200ms — required by project CLAUDE.md and mobile conversion reality
- **Repo**: Dedicated GitHub repo — github.com/ajwegner3-alt/raptor-roofing
- **Content**: No "Lorem ipsum" — all placeholder copy realistic and specific to Omaha roofing
- **Testing**: Live testing only — push to GitHub → Vercel auto-deploy → verify on preview URL
- **Manual QA phase**: Mandatory final phase per Andrew's global instructions — signed off 2026-04-15

## Key Decisions

<!-- Decisions that constrain future work. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tech stack: Next.js App Router + Tailwind | Matches Andrew's standard stack, Vercel deploy, best SEO story, image optimization built-in | Delivered — all 28 Lighthouse scores ≥90 |
| Scope: homepage + service pages + about + contact | Real SEO play without bloating pitch scope | Delivered — plus 8 service area pages added in Phase 6 as off-roadmap scope expansion |
| Positioning: trust-led storm response (anti-chaser) | Captures biggest search driver (storm/hail) while using Raptor's actual differentiators | Delivered — Storm-Chaser Copy Audit passed, "Family-Owned Businesses Care More Than Storm Chasers" section live |
| Content strategy: realistic placeholders clearly marked | Pitch needs to feel real to convert; explicit labeling prevents misrepresentation | Delivered — 38 // PLACEHOLDER: tags, all testimonials use Google review data with attribution |
| No service area sub-pages in v1 (original) | Defer city-specific pages until client signs | REVISED in Phase 6 — 8 service area pages built as off-roadmap scope expansion with genuinely localized content |
| No booking / chat / Supabase backend | Contractors convert on phone calls; form is backup; no backend complexity for a pitch site | Delivered — demo calendar booking added Phase 8 as pitch demo feature (UI only) |
| Build workflow: GSD wraps CLAUDE.md's 5-iteration flow | Iterations become GSD phases; one unified roadmap instead of two competing plans | Delivered |
| Deployment target: Vercel preview URL only | Pitch artifact is the URL itself; custom domain happens after Raptor signs | Delivered — https://raptor-roofing.vercel.app |
| Zero env vars policy | Prevents build crashes on Vercel; all env vars optional with graceful degradation | Delivered — sitemap.ts uses silent fallback, form stubs return success UI without email delivery |
| Google review carousel over placeholder testimonials | FTC compliance + real credibility signals for pitch | Delivered Phase 8 — 9 reviews (5.0 stars) sourced from real Google data |
| Demo calendar booking on form success | Shows full lead-to-booking flow during pitch demo | Delivered Phase 8 — Calendly-style UI stub on success state |
| 2-hour response promise softened | "Respond fast — often same day" reduces operational risk before Raptor confirms SLA | Delivered Phase 8 |

---
*Last updated: 2026-04-18 — v1.0 milestone complete, all 98 requirements validated*
