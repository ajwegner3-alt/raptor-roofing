# Raptor Roofing Website

## What This Is

A modern, conversion-optimized Next.js pitch site for Raptor Roofing, a family-operated roofing contractor in Omaha, NE. Built as a warm-lead pitch by North Star Integrations — the deployed preview URL is the pitch itself, designed to win Raptor as a client by demonstrably outperforming their existing site at raptorroofingllc.com.

## Core Value

An Omaha homeowner — whether they have urgent storm damage or a planned re-roof — sees this site and trusts Raptor Roofing over every other option in the Omaha market within 10 seconds of landing.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. -->

- [ ] Homepage that converts both storm-damage and planned-project visitors on the same scroll
- [ ] Dedicated service page for Roofing (install + repair)
- [ ] Dedicated service page for Siding
- [ ] Dedicated service page for Gutters
- [ ] Dedicated service page for 24/7 Emergency Tarping
- [ ] About page telling the 15-year family-owned, no-subcontractors, anti-chaser story
- [ ] Contact page with form, phone, hours, and service area map
- [ ] Click-to-call phone number persistent in header (sticky on mobile)
- [ ] Lead capture form: name, phone, service needed, zip (phone-primary, not email-primary)
- [ ] Trust signals visible on every page: license/bonded/insured, 15+ years, Omaha-local, review stars
- [ ] Realistic placeholder testimonials, clearly marked for replacement with real content
- [ ] Licensed stock or AI-generated roofing photography (no misrepresentation)
- [ ] Full SEO compliance per project CLAUDE.md (title tags, meta descriptions, schema, OG tags, canonical, sitemap)
- [ ] LocalBusiness + Service schema on appropriate pages
- [ ] Mobile-first responsive — tested on actual mobile viewport
- [ ] Page speed targets: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] 5 design iterations per project CLAUDE.md workflow, then combined final build
- [ ] Deployed to Vercel preview URL Andrew can send as the pitch
- [ ] Handoff doc listing every piece of placeholder content that needs real replacement before client launch

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Service area pages for every Omaha suburb (Bellevue, Papillion, Elkhorn, etc.) — defer until after Raptor signs as a client; homepage + service pages is enough to win the pitch
- Project gallery with real before/after photos — no real project photos available from the client yet; sample hero photography is sufficient for pitch
- Blog/content marketing scaffold — out of scope for a pitch site; add after sign-on
- Booking/scheduling integration — phone-primary is correct for contractors, form submission is enough for v1
- Live chat / chatbot — adds friction and maintenance, contractors convert on calls
- Supabase backend or database — form submissions go to email/Google Sheets via simple handler, no auth, no user accounts
- Custom domain setup — deployed to Vercel preview URL only; domain handoff happens post-signing
- Contacting the real Raptor Roofing for assets or approval — this is a warm-lead pitch, not a signed engagement
- Analytics dashboard implementation — CLAUDE.md specifies building scaffolding; document the integration path, don't build the full dashboard

## Context

**Client snapshot (Raptor Roofing, raptorroofingllc.com):**
- Omaha, NE — family-operated, 15+ years in business
- Licensed, insured, and bonded — no subcontractors, all in-house crews
- Phone: (402) 885-1462
- Hours: Mon–Sat 7am–7pm, closed Sundays
- Services: roofing install/repair, siding, gutters, 24/7 emergency tarping
- Free estimates, financing available
- Logo: cartoon velociraptor holding a hammer, dark teal/green body, bold black "RAPTOR ROOFING" wordmark

**Existing site weaknesses (from audit):**
- Repeated heading text suggesting poor implementation
- Minimal content depth — no real about section
- No customer testimonials despite claiming satisfaction
- No team member profiles or photos
- No project gallery beyond a single example
- Vague mission statement, no differentiation from competitors
- Limited brand personality in copy

**Omaha roofing market dynamics:**
- Nebraska sits in the hail belt — storm damage and insurance claims drive the highest search volume
- Market is saturated with out-of-state "storm chasers" who do sloppy work and disappear after storms
- Local homeowners are actively skeptical of roofers who lead with urgency/storm-damage copy — it signals chaser
- The winning positioning is **trust-led storm response**: use Raptor's actual differentiators (15 years local, family-owned, no subs, bonded/insured) to position them as the anti-chaser, then offer storm inspections and financing as action paths
- This works for BOTH audiences: storm victims who've been burned by chasers want trust before urgency; planned-project homeowners want the same proof points

**Workflow integration:**
- This project's CLAUDE.md defines a Discovery → Audit → 5 Iterations → Combine → Finalize workflow
- GSD wraps this workflow — Discovery (done) → Audit (done) → Iteration phases → Combine phase → Production build phase → Deploy phase → Manual QA phase
- Final phase is always Manual QA & Verification per Andrew's global instructions
- FUTURE_DIRECTIONS.md is required at project completion

## Constraints

- **Tech stack**: Next.js (App Router) + Tailwind CSS — matches Andrew's standard stack, required for Vercel deployment and proper SEO metadata
- **Hosting**: Vercel preview deployment — free tier, no custom domain needed for pitch
- **Budget**: $0 — free-tier tools only, no paid services or APIs
- **Typography**: Google Fonts via CDN — variety across iterations, no system fonts
- **Assets**: Logo provided (Screenshot file in project root, actually a raptor-with-hammer PNG); all other imagery must be licensed stock or AI-generated with clear labeling
- **Photos**: No real project photos, no real testimonials, no real team photos — everything is plausible placeholder content clearly marked for replacement
- **Accessibility**: WCAG AA minimum — contractors' customers include older homeowners on mobile, high contrast and tap targets matter
- **Performance**: LCP < 2.5s, CLS < 0.1, INP < 200ms — required by project CLAUDE.md and mobile conversion reality
- **Repo**: This project gets its own GitHub repo per Andrew's memory preference — not the parent `website-creation` workspace
- **Content**: No "Lorem ipsum" — all placeholder copy must be realistic and specific to Omaha roofing
- **Testing**: Live testing only — push to GitHub → Vercel auto-deploy → verify on preview URL
- **Manual QA phase**: Mandatory final phase per Andrew's global instructions, signoff required before project marked complete

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tech stack: Next.js App Router + Tailwind | Matches Andrew's standard stack, Vercel deploy, best SEO story, image optimization built-in | — Pending |
| Scope: homepage + service pages + about + contact | Real SEO play without bloating pitch scope; service area pages deferred until client signs | — Pending |
| Positioning: trust-led storm response (anti-chaser) | Captures biggest search driver (storm/hail) while using Raptor's actual differentiators; serves both storm-damage and planned-project audiences without splitting messaging | — Pending |
| Content strategy: realistic placeholders clearly marked | Pitch needs to feel real to convert; explicit labeling prevents misrepresentation and creates clean handoff checklist | — Pending |
| No service area sub-pages in v1 | Defer city-specific pages until client signs — pitch doesn't need 10+ pages to win, homepage story does the work | — Pending |
| No booking / chat / Supabase backend | Contractors convert on phone calls; form is backup; no backend complexity for a pitch site | — Pending |
| Build workflow: GSD wraps CLAUDE.md's 5-iteration flow | Iterations become GSD phases; one unified roadmap instead of two competing plans | — Pending |
| Deployment target: Vercel preview URL only | Pitch artifact is the URL itself; custom domain happens after Raptor signs | — Pending |

---
*Last updated: 2026-04-13 after initialization*
