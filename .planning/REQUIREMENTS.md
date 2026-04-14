# Requirements: Raptor Roofing Website

**Defined:** 2026-04-13
**Core Value:** Omaha homeowner trusts Raptor over every competitor within 10 seconds of landing

---

## v1 Requirements

### Foundation (FND)

- [ ] **FND-01**: Next.js 15 App Router project scaffolded with TypeScript, Tailwind v4, ESLint, src/ directory
- [ ] **FND-02**: Tailwind v4 `@theme` block configured with brand tokens (colors, type scale, spacing, radii, shadows)
- [ ] **FND-03**: `next/font/google` configured with one display font and one body font, self-hosted at build time
- [ ] **FND-04**: `src/content/` directory created with typed data files: `site.ts`, `services.ts`, `testimonials.ts`, `faqs.ts`, `service-areas.ts`
- [ ] **FND-05**: `src/lib/metadata.ts` helper exporting `buildMetadata()` for per-page SEO metadata
- [ ] **FND-06**: `src/lib/schema.ts` factory functions for LocalBusiness, Service, FAQPage, BreadcrumbList JSON-LD
- [ ] **FND-07**: `app/layout.tsx` with `metadataBase`, title template, default OG tags, `robots: { index: true, follow: true }`
- [ ] **FND-08**: `app/(marketing)/layout.tsx` route group wrapping public pages with Header/Footer/StickyMobileCTA
- [ ] **FND-09**: Global `focus-visible` styles restored in `globals.css` (Tailwind preflight strips them)
- [ ] **FND-10**: Form input base styles set to 16px minimum font size (prevents iOS Safari auto-zoom)

### Global Components (GLB)

- [ ] **GLB-01**: `Header` component with logo, nav links, and click-to-call phone number visible at all viewports
- [ ] **GLB-02**: Header is sticky with no layout shift and phone number remains visible when mobile nav is collapsed
- [ ] **GLB-03**: `Footer` component with NAP, service areas, business hours, license number, social links, schema anchor
- [ ] **GLB-04**: `StickyMobileCTA` component with phone + "Get Estimate" buttons, mobile-only, pinned to viewport bottom
- [ ] **GLB-05**: `TrustStrip` component rendering review stars, BBB, license/bonded/insured, years in business, manufacturer cert badges
- [ ] **GLB-06**: All CTAs meet 48×48px minimum tap target
- [ ] **GLB-07**: Phone number uses `tel:` link with click-to-call and is never under 48px tap target

### Homepage (HME)

- [ ] **HME-01**: Single static real-photo hero (no carousel, no autoplay video) with priority/preload set
- [ ] **HME-02**: Hero headline that leads with locality + longevity, not urgency (anti-chaser copy rule)
- [ ] **HME-03**: Hero has dark overlay on photo ensuring 4.5:1 contrast on all text
- [ ] **HME-04**: Micro-trust line directly under headline: "15 Years Local · No Subs · Licensed & Insured"
- [ ] **HME-05**: Hero has exactly 2 primary CTAs: click-to-call phone + "Get a Free Estimate"
- [ ] **HME-06**: Trust Strip rendered immediately below hero, not in footer
- [ ] **HME-07**: Service grid with 4 cards (Roofing, Siding, Gutters, Emergency Tarping), each linking to its service page
- [ ] **HME-08**: "Why We're Not a Storm Chaser" dedicated section — anti-chaser narrative with 15yr story and no-subs explainer
- [ ] **HME-09**: 3-step insurance claim visual (Inspection → We Meet Your Adjuster → Repair)
- [ ] **HME-10**: Testimonial carousel with at least 5 testimonials, each showing name + city + quote + rating
- [ ] **HME-11**: Every placeholder testimonial displays a visible amber "[PLACEHOLDER — Replace with real review before launch]" banner (FTC compliance)
- [ ] **HME-12**: FAQ accordion with 6+ questions and `FAQPage` JSON-LD injected inline
- [ ] **HME-13**: Lead form section with 4 fields (Name, Phone, Service, ZIP) and trust signals adjacent
- [ ] **HME-14**: `LocalBusiness` JSON-LD injected in homepage head via schema helper
- [ ] **HME-15**: Insurance carrier logo row (State Farm, Allstate, Farmers, USAA)
- [ ] **HME-16**: Financing callout ("as low as $X/mo") with placeholder label near estimate CTA

### Service Pages (SVC)

- [ ] **SVC-01**: `/services/roofing` page with hero, problem description, process steps, FAQ section, testimonials, CTA
- [ ] **SVC-02**: `/services/siding` page following roofing template, siding-specific copy
- [ ] **SVC-03**: `/services/gutters` page following roofing template, gutters-specific copy
- [ ] **SVC-04**: `/services/emergency-tarping` page with 24/7 phone prominence and urgency-appropriate copy
- [ ] **SVC-05**: Each service page has its own `Service` JSON-LD via schema factory
- [ ] **SVC-06**: Each service page has unique title tag, meta description, H1, canonical via `buildMetadata()`
- [ ] **SVC-07**: Each service page internally links to at least 2 other services and the homepage
- [ ] **SVC-08**: Each service page has a lead form or clear path to contact page
- [ ] **SVC-09**: Before/after placeholder image slots with [PLACEHOLDER] labels
- [ ] **SVC-10**: No near-duplicate copy across service pages (prevents Google thin-content penalty)

### About (ABT)

- [ ] **ABT-01**: `/about` page with 15-year family-owned narrative, no-subs explainer, and meet-the-crew section (placeholder)
- [ ] **ABT-02**: About page includes trust strip, testimonials, and explicit anti-chaser positioning
- [ ] **ABT-03**: About page has `LocalBusiness` JSON-LD via schema factory
- [ ] **ABT-04**: About page has unique metadata via `buildMetadata()`

### Contact (CNT)

- [ ] **CNT-01**: `/contact` page with lead form, NAP block, hours, embedded Google Map, service area list
- [ ] **CNT-02**: `ContactForm` Client Component with Name/Phone/Service/ZIP fields, accessible labels, error messaging
- [ ] **CNT-03**: Form submission routes through `app/api/contact/route.ts` to the chosen free-tier handler (n8n webhook or Formspree; decision locked in Phase 5)
- [ ] **CNT-04**: Form success state shows callback timeline copy ("We'll call you within 2 hours")
- [ ] **CNT-05**: Form uses reCAPTCHA v3 invisible (no v2 image challenge)
- [ ] **CNT-06**: One end-to-end test submission routed to Gmail, dragged to Primary inbox before demo
- [ ] **CNT-07**: `BreadcrumbList` JSON-LD on contact page
- [ ] **CNT-08**: Contact page has unique metadata via `buildMetadata()`

### SEO (SEO)

- [ ] **SEO-01**: `app/sitemap.ts` generates sitemap for all indexable pages
- [ ] **SEO-02**: `app/robots.ts` allows crawling of all pages in production, explicit `robots: { index: true, follow: true }`
- [ ] **SEO-03**: Every page passes Google Rich Results Test for all injected schema types
- [ ] **SEO-04**: Every page has unique title (≤60 chars), meta description (150-155 chars), H1, canonical URL
- [ ] **SEO-05**: Every page has Open Graph + Twitter meta tags with default OG image
- [ ] **SEO-06**: Every image has meaningful alt text (no generic "image" or empty alts)
- [ ] **SEO-07**: `BreadcrumbList` schema on all inner pages
- [ ] **SEO-08**: Header hierarchy is valid (single H1 per page, no skipped levels)
- [ ] **SEO-09**: No `noindex` left anywhere in production

### Accessibility (A11Y)

- [ ] **A11Y-01**: All body text and CTAs meet WCAG 2.1 AA contrast (4.5:1 text, 3:1 large text)
- [ ] **A11Y-02**: Every interactive element is keyboard-reachable with visible focus indicator
- [ ] **A11Y-03**: Every form input has a proper `<label>` (placeholder is not a substitute)
- [ ] **A11Y-04**: Skip-to-main-content link at top of page
- [ ] **A11Y-05**: All buttons and links have descriptive, non-generic text ("Get a Free Estimate" not "Click here")
- [ ] **A11Y-06**: Images with text have sufficient overlay contrast (hero photo text)

### Performance (PRF)

- [ ] **PRF-01**: LCP under 2.5s on mobile (verified via Lighthouse)
- [ ] **PRF-02**: CLS under 0.1 (no layout shift from lazy-loaded images or fonts)
- [ ] **PRF-03**: INP under 200ms (no blocking client JS on interaction)
- [ ] **PRF-04**: Hero image uses `next/image` with priority/preload and explicit dimensions
- [ ] **PRF-05**: All below-fold images use lazy loading
- [ ] **PRF-06**: Fonts load via `next/font/google` (self-hosted, preloaded, zero CLS)
- [ ] **PRF-07**: Client components scoped to leaf interactive nodes only (no `"use client"` on section wrappers)
- [ ] **PRF-08**: Total JavaScript bundle per route under 200KB gzipped

### Deploy (DPL)

- [ ] **DPL-01**: Dedicated GitHub repo created for this project (not added to parent workspace repo)
- [ ] **DPL-02**: Repo pushed to GitHub `main` branch with initial commit history
- [ ] **DPL-03**: Vercel project linked to the GitHub repo with automatic deploys on push
- [ ] **DPL-04**: Preview URL working, shareable, no authentication gate
- [ ] **DPL-05**: All environment variables (form handler webhook/key, reCAPTCHA keys) scoped to Preview + Production
- [ ] **DPL-06**: Vercel Analytics enabled for the deployment
- [ ] **DPL-07**: Google Rich Results Test run against preview URL with zero errors
- [ ] **DPL-08**: Preview URL NOT submitted to Google Search Console during pitch phase (avoids indexing placeholder content)

### Manual QA (QA)

- [ ] **QA-01**: Homepage loads on real mobile device (iPhone Safari + Android Chrome), no layout shift, phone tap works
- [ ] **QA-02**: Every service page loads, passes keyboard navigation, form submits successfully
- [ ] **QA-03**: Form submission lands in Andrew's Gmail Primary inbox (not Spam/Promotions)
- [ ] **QA-04**: Every page audited with Lighthouse mobile, Performance/Accessibility/Best Practices/SEO all 90+
- [ ] **QA-05**: Storm-Chaser Copy Audit Checklist run against every headline, CTA, and hero subtext
- [ ] **QA-06**: Every placeholder testimonial visibly labeled; no unlabeled fake reviews remain
- [ ] **QA-07**: Andrew signs off on the pitch URL as ready to send to Raptor

### Handoff (HDF)

- [ ] **HDF-01**: `HANDOFF.md` listing every placeholder content item requiring replacement before real launch (testimonials, photos, license number, review count, financing partner, phone if inaccurate)
- [ ] **HDF-02**: `FUTURE_DIRECTIONS.md` with known limitations, assumptions, future improvements, and technical debt (per Andrew's global instructions)
- [ ] **HDF-03**: Project README with setup, run, and deploy instructions
- [ ] **HDF-04**: Every placeholder item in the codebase tagged with a searchable comment (`// PLACEHOLDER:`) for easy batch replacement

---

## v2 Requirements

Deferred to post-signing. Tracked but not in current roadmap.

### Service Area Pages
- **AREA-01**: `/service-areas/omaha` page with localized content
- **AREA-02**: `/service-areas/bellevue` page with localized content
- **AREA-03**: `/service-areas/papillion` page with localized content
- **AREA-04**: `/service-areas/elkhorn` page with localized content
- **AREA-05**: `/service-areas/millard` page with localized content
- **AREA-06**: `/service-areas/la-vista` page with localized content

### Project Gallery
- **GAL-01**: Real before/after project gallery with client-supplied photos
- **GAL-02**: Interactive before/after slider widget
- **GAL-03**: Gallery filterable by service type and neighborhood

### Blog Scaffold
- **BLG-01**: MDX-based blog scaffold for SEO content
- **BLG-02**: Blog post index page with category filters

### Dedicated Storm Page
- **STRM-01**: Standalone `/storm-damage` page for storm-specific search queries

### Analytics Dashboard
- **DASH-01**: Client-facing analytics dashboard per project CLAUDE.md spec

### Custom Domain
- **DOM-01**: Production domain linked to deployment with SSL

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Supabase / database backend | Pitch site has no user accounts, no stored data; form → webhook is sufficient |
| Live chat / chatbot | Breaks family-business authenticity; contractors convert on calls |
| Booking / scheduling integration | Phone-primary is correct for contractors; form submission suffices |
| Real project photos from client | No assets from Raptor yet; warm-lead pitch uses licensed stock or AI with clear labels |
| Real testimonials | No client data; placeholders with [PLACEHOLDER] banners used (FTC compliance) |
| Multi-language support | Omaha English-speaking market for v1 |
| E-commerce / online payment | Not applicable to contractor lead gen |
| Custom domain on pitch | Preview URL IS the pitch; domain work happens after signing |
| Google Search Console submission during pitch | Would index placeholder content; defer until real content replaces placeholders |
| 5-iteration design phase in separate files | GSD wraps the iteration workflow — iterations become phases in the roadmap, not 5 standalone HTML files |
| Emoji in UI or code | Per project guidelines, use SVG icons only |

---

## Traceability

Populated by `gsd-roadmapper` on 2026-04-13.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FND-01 | Phase 1: Foundation | Pending |
| FND-02 | Phase 1: Foundation | Pending |
| FND-03 | Phase 1: Foundation | Pending |
| FND-04 | Phase 1: Foundation | Pending |
| FND-05 | Phase 1: Foundation | Pending |
| FND-06 | Phase 1: Foundation | Pending |
| FND-07 | Phase 1: Foundation | Pending |
| FND-08 | Phase 1: Foundation | Pending |
| FND-09 | Phase 1: Foundation | Pending |
| FND-10 | Phase 1: Foundation | Pending |
| GLB-01 | Phase 2: Global Components | Pending |
| GLB-02 | Phase 2: Global Components | Pending |
| GLB-03 | Phase 2: Global Components | Pending |
| GLB-04 | Phase 2: Global Components | Pending |
| GLB-05 | Phase 2: Global Components | Pending |
| GLB-06 | Phase 2: Global Components | Pending |
| GLB-07 | Phase 2: Global Components | Pending |
| HME-01 | Phase 3: Homepage | Pending |
| HME-02 | Phase 3: Homepage | Pending |
| HME-03 | Phase 3: Homepage | Pending |
| HME-04 | Phase 3: Homepage | Pending |
| HME-05 | Phase 3: Homepage | Pending |
| HME-06 | Phase 3: Homepage | Pending |
| HME-07 | Phase 3: Homepage | Pending |
| HME-08 | Phase 3: Homepage | Pending |
| HME-09 | Phase 3: Homepage | Pending |
| HME-10 | Phase 3: Homepage | Pending |
| HME-11 | Phase 3: Homepage | Pending |
| HME-12 | Phase 3: Homepage | Pending |
| HME-13 | Phase 3: Homepage | Pending |
| HME-14 | Phase 3: Homepage | Pending |
| HME-15 | Phase 3: Homepage | Pending |
| HME-16 | Phase 3: Homepage | Pending |
| SVC-01 | Phase 4: Service Pages | Pending |
| SVC-02 | Phase 4: Service Pages | Pending |
| SVC-03 | Phase 4: Service Pages | Pending |
| SVC-04 | Phase 4: Service Pages | Pending |
| SVC-05 | Phase 4: Service Pages | Pending |
| SVC-06 | Phase 4: Service Pages | Pending |
| SVC-07 | Phase 4: Service Pages | Pending |
| SVC-08 | Phase 4: Service Pages | Pending |
| SVC-09 | Phase 4: Service Pages | Pending |
| SVC-10 | Phase 4: Service Pages | Pending |
| ABT-01 | Phase 5: About + Contact | Pending |
| ABT-02 | Phase 5: About + Contact | Pending |
| ABT-03 | Phase 5: About + Contact | Pending |
| ABT-04 | Phase 5: About + Contact | Pending |
| CNT-01 | Phase 5: About + Contact | Pending |
| CNT-02 | Phase 5: About + Contact | Pending |
| CNT-03 | Phase 5: About + Contact | Pending |
| CNT-04 | Phase 5: About + Contact | Pending |
| CNT-05 | Phase 5: About + Contact | Pending |
| CNT-06 | Phase 5: About + Contact | Pending |
| CNT-07 | Phase 5: About + Contact | Pending |
| CNT-08 | Phase 5: About + Contact | Pending |
| SEO-01 | Phase 6: SEO + Performance + Accessibility | Pending |
| SEO-02 | Phase 6: SEO + Performance + Accessibility | Pending |
| SEO-03 | Phase 6: SEO + Performance + Accessibility | Pending |
| SEO-04 | Phase 6: SEO + Performance + Accessibility | Pending |
| SEO-05 | Phase 6: SEO + Performance + Accessibility | Pending |
| SEO-06 | Phase 6: SEO + Performance + Accessibility | Pending |
| SEO-07 | Phase 6: SEO + Performance + Accessibility | Pending |
| SEO-08 | Phase 6: SEO + Performance + Accessibility | Pending |
| SEO-09 | Phase 6: SEO + Performance + Accessibility | Pending |
| A11Y-01 | Phase 6: SEO + Performance + Accessibility | Pending |
| A11Y-02 | Phase 6: SEO + Performance + Accessibility | Pending |
| A11Y-03 | Phase 6: SEO + Performance + Accessibility | Pending |
| A11Y-04 | Phase 6: SEO + Performance + Accessibility | Pending |
| A11Y-05 | Phase 6: SEO + Performance + Accessibility | Pending |
| A11Y-06 | Phase 6: SEO + Performance + Accessibility | Pending |
| PRF-01 | Phase 6: SEO + Performance + Accessibility | Pending |
| PRF-02 | Phase 6: SEO + Performance + Accessibility | Pending |
| PRF-03 | Phase 6: SEO + Performance + Accessibility | Pending |
| PRF-04 | Phase 6: SEO + Performance + Accessibility | Pending |
| PRF-05 | Phase 6: SEO + Performance + Accessibility | Pending |
| PRF-06 | Phase 6: SEO + Performance + Accessibility | Pending |
| PRF-07 | Phase 6: SEO + Performance + Accessibility | Pending |
| PRF-08 | Phase 6: SEO + Performance + Accessibility | Pending |
| DPL-01 | Phase 7: Deploy | Pending |
| DPL-02 | Phase 7: Deploy | Pending |
| DPL-03 | Phase 7: Deploy | Pending |
| DPL-04 | Phase 7: Deploy | Pending |
| DPL-05 | Phase 7: Deploy | Pending |
| DPL-06 | Phase 7: Deploy | Pending |
| DPL-07 | Phase 7: Deploy | Pending |
| DPL-08 | Phase 7: Deploy | Pending |
| QA-01 | Phase 8: Manual QA + Handoff | Pending |
| QA-02 | Phase 8: Manual QA + Handoff | Pending |
| QA-03 | Phase 8: Manual QA + Handoff | Pending |
| QA-04 | Phase 8: Manual QA + Handoff | Pending |
| QA-05 | Phase 8: Manual QA + Handoff | Pending |
| QA-06 | Phase 8: Manual QA + Handoff | Pending |
| QA-07 | Phase 8: Manual QA + Handoff | Pending |
| HDF-01 | Phase 8: Manual QA + Handoff | Pending |
| HDF-02 | Phase 8: Manual QA + Handoff | Pending |
| HDF-03 | Phase 8: Manual QA + Handoff | Pending |
| HDF-04 | Phase 8: Manual QA + Handoff | Pending |

**Coverage:**
- v1 requirements: 97 total (note: header previously said 93 — actual count is 97 across all 12 categories)
- Mapped to phases: 97
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-13*
*Last updated: 2026-04-13 — traceability populated by gsd-roadmapper*
