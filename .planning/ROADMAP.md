# Roadmap: Raptor Roofing Website

## Overview

Eight phases build a deployed Next.js pitch site from scaffolding to a shareable Vercel preview URL. The build runs dependency-first — foundation before components, components before pages, pages before SEO audit, everything before deploy, deploy before QA. The pitch artifact is the URL itself: an Omaha homeowner opens it and trusts Raptor Roofing over every competitor within 10 seconds.

## Phases

**Phase Numbering:**
- Integer phases (1–8): Planned milestone work
- Decimal phases (e.g., 2.1): Urgent insertions (marked INSERTED)

- [x] **Phase 1: Foundation** ✓ — Scaffold, brand tokens, content model, helpers, layout shells (completed 2026-04-14)
- [x] **Phase 2: Global Components** ✓ — Header, Footer, StickyMobileCTA, TrustStrip (completed 2026-04-14)
- [x] **Phase 3: Homepage** ✓ — Full homepage compose with all sections and schema (completed 2026-04-14)
- [ ] **Phase 4: Service Pages** — Four dedicated service pages from shared template
- [ ] **Phase 5: About + Contact** — About narrative, contact form, API handler, end-to-end test
- [ ] **Phase 6: SEO + Performance + Accessibility** — Sitewide audit, sitemap/robots, schema validation, a11y pass
- [ ] **Phase 7: Deploy** — GitHub repo, Vercel link, env vars, preview URL verification
- [ ] **Phase 8: Manual QA + Handoff** — Live device testing, Lighthouse audit, signoff, handoff docs

---

## Phase Details

### Phase 1: Foundation
**Goal**: The project runs locally, tokens are set, content data files are loaded, and every subsequent phase can import from a stable, typed base without revisiting scaffolding decisions.
**Depends on**: Nothing (first phase)
**Requirements**: FND-01, FND-02, FND-03, FND-04, FND-05, FND-06, FND-07, FND-08, FND-09, FND-10, FND-11
**Success Criteria** (what must be TRUE):
  1. Andrew can run `npm run dev` and see a blank page at localhost:3000 with no TypeScript or ESLint errors
  2. Brand color tokens in the Tailwind `@theme` block are sampled from the Raptor logo (slate-teal primary, crimson accent, black neutral, wood-brown warm neutral) — no placeholder colors; apply correctly to a test element
  3. `src/content/` files exist with typed exports for site info, services, testimonials, FAQs, and service areas — importable with full IntelliSense
  4. `buildMetadata()` and all schema factory functions are importable from `src/lib/` and produce valid-shaped objects
  5. The `(marketing)` route group layout shell renders without errors (even if Header/Footer are stubs)
**Plans**: 3 plans

Plans:
- [x] 01-01: Scaffold Next.js 16 App Router project (TypeScript, Tailwind v4, ESLint flat config, src/ dir) and configure `@theme` brand tokens ✓
- [x] 01-02: Create `src/content/` typed data files (site.ts, services.ts, testimonials.ts, faqs.ts, service-areas.ts) ✓
- [x] 01-03: Create `src/lib/metadata.ts` + `src/lib/schema.tsx` helpers, configure `app/layout.tsx` + `app/(marketing)/layout.tsx`, set globals.css baseline styles ✓

---

### Phase 2: Global Components
**Goal**: Header, Footer, StickyMobileCTA, and TrustStrip are built and wired into the marketing layout so every page — from the first Vercel deploy forward — looks production-ready with a visible phone number, trust signals, and correct NAP.
**Depends on**: Phase 1
**Requirements**: GLB-01, GLB-02, GLB-03, GLB-04, GLB-05, GLB-06, GLB-07
**Success Criteria** (what must be TRUE):
  1. Opening any page shows the Raptor logo, nav links, and click-to-call phone number in the header at all viewport widths — including when the mobile nav is collapsed
  2. Scrolling down any page keeps the phone number visible in the sticky header with no layout shift
  3. On a mobile viewport, a bottom-pinned bar shows call and estimate buttons that meet the 48×48px tap target requirement
  4. The Trust Strip renders review stars, license/bonded/insured, years in business, and manufacturer cert badges immediately below the hero (once composed)
  5. Every phone number on the page is a `tel:` link with a tap target no smaller than 48×48px
**Plans**: 2 plans

Plans:
- [x] 02-01: Build `Header` (sticky, click-to-call, mobile-safe) and `Footer` (NAP, hours, service areas, license, schema anchor) ✓
- [x] 02-02: Build `StickyMobileCTA` (mobile-only bottom bar) and `TrustStrip` (badges row); wire all into `(marketing)/layout.tsx` ✓

---

### Phase 3: Homepage
**Goal**: A visitor opening the homepage preview URL sees the full Raptor Roofing story — anti-chaser hero, trust strip, service grid, insurance walkthrough, testimonials, FAQs, lead form, and financing callout — all above reproach for FTC compliance, all wired to schema.
**Depends on**: Phase 2
**Requirements**: HME-01, HME-02, HME-03, HME-04, HME-05, HME-06, HME-07, HME-08, HME-09, HME-10, HME-11, HME-12, HME-13, HME-14, HME-15, HME-16
**Success Criteria** (what must be TRUE):
  1. The hero loads a single static real-photo image with a dark overlay, locality-first headline, micro-trust line, and exactly two CTAs (call + estimate) — no urgency copy, no carousel
  2. Every placeholder testimonial card shows a visible amber [PLACEHOLDER] banner — no fake review appears without disclosure
  3. The FAQ accordion expands/collapses correctly, and the FAQPage JSON-LD is injected inline
  4. The lead form accepts Name, Phone, Service, and ZIP — Phone is the primary required field — and trust signals are adjacent to the form
  5. The insurance carrier logo row and financing callout are both visible with [PLACEHOLDER] labels on financing amount
**Plans**: 4 plans

Plans:
- [x] 03-01: Build `Hero` section (static photo, dark overlay, headline, micro-trust line, dual CTAs, priority image load) ✓
- [x] 03-02: Build `ServiceGrid`/`ServiceCard`, `WhyNotChaser` section, and insurance claim 3-step visual ✓
- [x] 03-03: Build `TestimonialCarousel` (5+ items, [PLACEHOLDER] banners), `FaqAccordion` + FAQPage JSON-LD, insurance logo row, financing callout ✓
- [x] 03-04: Build `LeadForm` section (4 fields, trust signals adjacent), compose all sections into `app/(marketing)/page.tsx` (LocalBusiness JSON-LD already mounted in Footer from Phase 2 — not re-mounted) ✓

---

### Phase 4: Service Pages
**Goal**: All four service pages (Roofing, Siding, Gutters, Emergency Tarping) exist at their final URLs with service-specific copy, unique metadata, Service JSON-LD, internal links, lead form paths, and before/after placeholder slots — none duplicating content across pages.
**Depends on**: Phase 3
**Requirements**: SVC-01, SVC-02, SVC-03, SVC-04, SVC-05, SVC-06, SVC-07, SVC-08, SVC-09, SVC-10
**Success Criteria** (what must be TRUE):
  1. Visiting `/services/roofing`, `/services/siding`, `/services/gutters`, and `/services/emergency-tarping` each loads a distinct page with service-specific hero, problem description, and process steps
  2. Each service page has a unique title tag, meta description, H1, and canonical URL — no two pages share the same metadata
  3. Each service page links to at least 2 other services and the homepage
  4. The emergency tarping page displays the 24/7 phone number prominently and uses urgency-appropriate copy (within anti-chaser guidelines)
  5. Before/after image placeholder slots are visible and labeled [PLACEHOLDER] on every service page
**Plans**: 3 plans

Plans:
- [ ] 04-01: Build `ServicePageTemplate` component and `ServiceSchema` JSON-LD factory; implement `/services/roofing` as the authoritative template
- [ ] 04-02: Adapt template for `/services/siding` and `/services/gutters` with service-specific copy
- [ ] 04-03: Implement `/services/emergency-tarping` with 24/7 phone prominence; apply `buildMetadata()` and `Service` JSON-LD to all four pages; verify no near-duplicate copy

---

### Phase 5: About + Contact
**Goal**: The About page tells the full family-owned anti-chaser narrative. The Contact page provides a working lead form that routes submissions through the chosen free-tier handler and delivers email to Andrew's Gmail Primary inbox before the pitch demo.
**Depends on**: Phase 4
**Requirements**: ABT-01, ABT-02, ABT-03, ABT-04, CNT-01, CNT-02, CNT-03, CNT-04, CNT-05, CNT-06, CNT-07, CNT-08
**Success Criteria** (what must be TRUE):
  1. The About page renders the 15-year family-owned story, no-subcontractors explainer, anti-chaser positioning section, trust strip, and testimonials with [PLACEHOLDER] banners
  2. The Contact page displays the lead form, NAP block, business hours, embedded Google Map, and service area list
  3. Submitting the form with real test data results in an email arriving in Andrew's Gmail Primary inbox (not Spam) within 5 minutes
  4. The form success state shows the "We'll call you within 2 hours" callback timeline copy
  5. reCAPTCHA v3 invisible is active — no image challenge appears during form submission
**Plans**: 3 plans

Plans:
- [ ] 05-01: Build `/about` page with narrative sections, trust strip, testimonials, `LocalBusiness` JSON-LD, and `buildMetadata()`
- [ ] 05-02: Build `ContactForm` Client Component (Name/Phone/Service/ZIP, labels, error states, reCAPTCHA v3, success state) and `app/api/contact/route.ts` (n8n webhook or Formspree — decision at plan time)
- [ ] 05-03: Build `/contact` page (form + NAP block + hours + Google Map + service areas + `BreadcrumbList` JSON-LD + metadata); run end-to-end test submission, drag to Gmail Primary

---

### Phase 6: SEO + Performance + Accessibility
**Goal**: Every page passes a sitewide technical audit — unique metadata, valid schema, correct robots rules, sitemap generated, WCAG AA contrast, keyboard navigation, and Core Web Vitals targets met. No noindex left anywhere. No accessibility failure visible to Andrew on a real device.
**Depends on**: Phase 5
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06, SEO-07, SEO-08, SEO-09, A11Y-01, A11Y-02, A11Y-03, A11Y-04, A11Y-05, A11Y-06, PRF-01, PRF-02, PRF-03, PRF-04, PRF-05, PRF-06, PRF-07, PRF-08
**Success Criteria** (what must be TRUE):
  1. `app/sitemap.ts` and `app/robots.ts` are present; visiting `/sitemap.xml` returns all indexable pages; `/robots.txt` shows `Allow: /` with no noindex remnants
  2. Every page passes Google Rich Results Test with zero errors for all injected schema types
  3. Tabbing through any page reaches every interactive element with a visible focus ring — skip-to-main link fires correctly
  4. Lighthouse mobile report on homepage shows Performance, Accessibility, Best Practices, and SEO all at 90 or above (run locally before deploy)
  5. Total JS bundle per route is under 200KB gzipped; hero image has `priority` set; no `"use client"` on section wrapper components
**Plans**: 3 plans

Plans:
- [ ] 06-01: Generate `app/sitemap.ts` and `app/robots.ts`; audit every page for unique title/description/H1/canonical; add `BreadcrumbList` to all inner pages; confirm `robots: { index: true, follow: true }` in root layout
- [ ] 06-02: Accessibility pass — verify 4.5:1 contrast on all text, add skip-to-main link, audit form labels, verify focus-visible states, check tap targets, confirm hero overlay contrast
- [ ] 06-03: Performance pass — verify `priority` on hero images, lazy loading on below-fold images, `next/font/google` usage, client component scope, bundle size check; run Lighthouse mobile and hit 90+ targets

---

### Phase 7: Deploy
**Goal**: The Raptor Roofing pitch site is live at a shareable Vercel preview URL with all environment variables scoped correctly, automatic deploys on push, Vercel Analytics enabled, and the Rich Results Test passing against the live URL.
**Depends on**: Phase 6
**Requirements**: DPL-01, DPL-02, DPL-03, DPL-04, DPL-05, DPL-06, DPL-07, DPL-08
**Success Criteria** (what must be TRUE):
  1. A dedicated GitHub repo exists for this project (not the parent workspace); `main` branch is pushed with full commit history
  2. The Vercel project is linked to the GitHub repo; every push to `main` triggers an automatic deploy
  3. The preview URL is shareable with no authentication gate — opening it on a phone shows the Raptor site
  4. All environment variables (form handler key, reCAPTCHA keys) are scoped to Preview and Production — form submission works on the preview URL, not just localhost
  5. Vercel Analytics is enabled; Google Rich Results Test passes against the live preview URL with zero errors
**Plans**: 2 plans

Plans:
- [ ] 07-01: Create dedicated GitHub repo, push `main` branch; link Vercel project with automatic deploy; scope all env vars to Preview + Production
- [ ] 07-02: Enable Vercel Analytics; verify preview URL is accessible without auth; run Google Rich Results Test against live URL; confirm URL is NOT submitted to Google Search Console

---

### Phase 8: Manual QA + Handoff
**Goal**: Andrew tests the live preview URL on real devices, signs off on pitch readiness, and the project ships with complete handoff documentation so Raptor can replace every placeholder the moment they sign.
**Depends on**: Phase 7
**Requirements**: QA-01, QA-02, QA-03, QA-04, QA-05, QA-06, QA-07, HDF-01, HDF-02, HDF-03, HDF-04
**Success Criteria** (what must be TRUE):
  1. Andrew opens the preview URL on an iPhone (Safari) and an Android device (Chrome) — homepage loads without layout shift and the phone tap-to-call works on both
  2. Every service page, the About page, and the Contact page load and pass keyboard navigation; form submission delivers to Gmail Primary
  3. Every Lighthouse mobile audit (all pages) returns Performance, Accessibility, Best Practices, and SEO all at 90+
  4. Every placeholder testimonial is visibly labeled — no unlabeled fake review remains anywhere on the site
  5. `HANDOFF.md`, `FUTURE_DIRECTIONS.md`, and `README.md` are committed to the repo; every placeholder item in the codebase is tagged `// PLACEHOLDER:` for batch replacement
**Plans**: 2 plans

Plans:
- [ ] 08-01: Manual QA checklist — real device testing (QA-01 through QA-06), Storm-Chaser Copy Audit on all headlines and CTAs, placeholder audit
- [ ] 08-02: Handoff documentation — write `HANDOFF.md`, `FUTURE_DIRECTIONS.md`, `README.md`; audit codebase for `// PLACEHOLDER:` tags; Andrew signs off (QA-07)

---

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 3/3 | ✓ Complete | 2026-04-14 |
| 2. Global Components | 2/2 | ✓ Complete | 2026-04-14 |
| 3. Homepage | 4/4 | ✓ Complete | 2026-04-14 |
| 4. Service Pages | 0/3 | Not started | - |
| 5. About + Contact | 0/3 | Not started | - |
| 6. SEO + Performance + Accessibility | 0/3 | Not started | - |
| 7. Deploy | 0/2 | Not started | - |
| 8. Manual QA + Handoff | 0/2 | Not started | - |
