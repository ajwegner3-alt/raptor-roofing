# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-13)

**Core value:** Omaha homeowner trusts Raptor Roofing over every competitor within 10 seconds of landing
**Current focus:** Phase 6 — Technical SEO (06-01 ✓ sitemap.xml + robots.txt live)

## Current Position

Phase: 6 of 8 (SEO + Performance + Accessibility) — In progress
Plan: 1 of N in Phase 6 — 06-01 ✓
Status: In progress — 06-01 complete (sitemap.xml + robots.txt + canonical + noindex audit)
Last activity: 2026-04-16 — Completed 06-01-PLAN.md (sitemap.ts + robots.ts created, all SEO metadata verified)

Progress: [█████░░░░░] 50% (12/24 plans complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 11
- Average duration: ~15 min
- Total execution time: ~2.75 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 1 (Foundation) | 3/3 | ~45 min | ~15 min |
| Phase 2 (Global Components) | 2/2 | ~30 min | ~15 min |
| Phase 3 (Homepage) | 1/1 | ~15 min | ~15 min |
| Phase 4 (Service Pages) | 3/3 | ~45 min | ~15 min |
| Phase 5 (About + Contact) | 3/3 | ~35 min | ~12 min (05-03 includes human checkpoint pause) |

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
- Phase 5: Form handler = Gmail SMTP via nodemailer (resolved at 05-02 plan time — n8n/Formspree both rejected in favor of email-sender tool)
- Phase 5: export const runtime = 'nodejs' MANDATORY in /api/contact — nodemailer uses net/tls, not available on Vercel Edge Runtime
- Phase 5: LeadForm has no reCAPTCHA intentionally — service pages must not load 35KB reCAPTCHA script; /api/contact skips verify gracefully when no token
- Phase 5: ContactForm wraps itself in GoogleReCaptchaProvider — reCAPTCHA only loads on /contact, not sitewide
- Phase 5: reCAPTCHA score threshold 0.3 (permissive) — minimizes false positives on roofing form submissions
- Phase 5: .env.local.example force-committed (git add -f) because .gitignore has .env* glob
- Phase 6 (06-01): sitemap.ts reads process.env.NEXT_PUBLIC_SITE_URL DIRECTLY with top-level throw — NOT siteConfig.url (silent fallback defeats the guard). Phase 7 domain flip = one env var change, zero code edits.
- Phase 6 (06-01): robots.ts uses ?? fallback (not throw) — /robots.txt is low-stakes; sitemap.ts throw guard catches missing env first
- Phase 7: Deploy target is Vercel preview URL only; do NOT submit to Google Search Console during pitch
- Phase 4: Static route folders (services/roofing/page.tsx) not [slug] dynamic route — four known pages, no generateStaticParams needed
- Phase 4: ServicePageTemplate faqs+testimonials passed from page file so JSON-LD schema factories receive same data as rendered component
- Phase 4: Emergency hero right column = large tel: tap-to-call card (NOT LeadForm) — LeadForm still in section 11
- Phase 4: TestimonialCarousel section skipped entirely in template if testimonials.length === 0 (no empty widget)
- Phase 5: AboutHero is a distinct Server Component (not ServiceHero reuse) — ServiceHero requires Service prop + always renders right-column form; About needs single-column no-form layout
- Phase 5: BreadcrumbList-only JSON-LD on /about — Footer owns HomeAndConstructionBusiness schema globally; no duplication per RESEARCH.md Pitfall 4
- Phase 5: /images/about-hero.webp does not exist yet — Next.js Image builds fine but renders broken image until Phase 8 provides real asset

### Pending Todos

- Phase 2 COMPLETE — all 5 layout components built and committed (Header, MobileMenuButton, Footer, StickyMobileCTA, TrustStrip)
- Phase 3 COMPLETE — Homepage live with all sections, pushed to GitHub for Vercel deployment
- Phase 4 COMPLETE — all 4 service pages built: /services/roofing, /services/siding, /services/gutters, /services/emergency-tarping
- Phase 5 COMPLETE — /about + /contact live, email pipeline verified end-to-end to Gmail Primary (approved 2026-04-15). 05-01 ✓, 05-02 ✓, 05-03 ✓
- Phase 6 IN PROGRESS — 06-01 ✓: app/sitemap.ts + app/robots.ts added. /sitemap.xml (7 routes) + /robots.txt (Allow: /) both live. All SEO metadata (canonical, robots, noindex audit) verified clean.
- Phase 6 NEXT — (06-02+): Remaining SEO/performance/accessibility plans
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
- RESOLVED: Form handler choice (n8n webhook vs Formspree vs custom) — RESOLVED at 05-02 plan time. Form handler = Gmail SMTP via @nsi/email-sender tool (not n8n webhook, not Formspree). Confirmed working end-to-end 2026-04-15. Single env var flip (EMAIL_PROVIDER=resend) enables post-launch Resend upgrade with no code changes.

## Session Continuity

Last session: 2026-04-16
Stopped at: Completed 06-01-PLAN.md — sitemap.ts + robots.ts created and committed. All SEO metadata verified. Ready for 06-02+.
Resume file: None
