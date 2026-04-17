# Phase 8: Manual QA + Handoff — Research

**Researched:** 2026-04-15
**Domain:** QA audit, placeholder resolution, handoff documentation
**Confidence:** HIGH (direct code inspection) / LOW (real business data — see notes)

---

## Summary

This phase is documentation and audit work, not feature development. The primary work product is three files: HANDOFF.md, FUTURE_DIRECTIONS.md, and README.md. Secondary work is running a Storm-Chaser Copy Audit on all headlines and CTAs, resolving any placeholders that can be filled without Raptor's input, and tagging the rest with `// PLACEHOLDER:` comments.

The codebase was inspected directly. All placeholder markers have been inventoried with file paths and line numbers. Real-world data for Raptor Roofing was searched online: BBB profile confirms the phone number, address zip (68116), and BBB A- accreditation, but no contractor license number is publicly available without accessing the Nebraska DOL database directly. The founding year "15+ years" on the real website does not confirm the "2009" date used in site.ts. Google review count/rating could not be confirmed from web search alone.

The demo stub revert path is fully documented from code inspection. Both form components (ContactForm.tsx, LeadForm.tsx) share the same stub pattern and require identical changes to go live.

**Primary recommendation:** Inline all placeholder inventory into HANDOFF.md (no separate file). The Storm-Chaser Copy Audit should be a pass/fail checklist per section, not per page — the copy is strong overall, with two borderline items flagged below.

---

## Complete Placeholder Inventory

### Category 1: Business Identity — Requires Raptor's Input

| File | Line | What | Resolvable Without Raptor? |
|------|------|------|---------------------------|
| `src/content/site.ts` | 67 | Street address | NO — not publicly available |
| `src/content/site.ts` | 70 | ZIP code (currently 68102 placeholder) | PARTIAL — BBB confirms 68116, but verify |
| `src/content/site.ts` | 71 | Full address string | NO — depends on street |
| `src/content/site.ts` | 74 | Email (info@raptorroofingllc.com) | PARTIAL — plausible but unconfirmed |
| `src/content/site.ts` | 87 | NE contractor license number | NO — DOL database requires manual lookup |
| `src/content/site.ts` | 99 | Google review count (127) | NO — GBP access needed |
| `src/content/site.ts` | 100 | Google review rating (4.9) | NO — GBP access needed |
| `src/content/site.ts` | 105 | Facebook URL | NO |
| `src/content/site.ts` | 106 | Instagram URL | NO |
| `src/content/site.ts` | 107 | Google Business Profile URL | PARTIAL — placeholder URL used, real one unknown |
| `src/content/site.ts` | 122 | GAF Certified Contractor status | NO — needs verification |
| `src/content/site.ts` | 123 | Owens Corning Preferred Contractor | NO — needs verification |
| `src/app/(marketing)/about/page.tsx` | 22 | Founding year in meta description | NO — "2009" in site.ts is unconfirmed |
| `src/app/(marketing)/about/page.tsx` | 64 | Founding year in copy | NO |
| `src/app/(marketing)/about/page.tsx` | 68 | Founder name | NO |
| `src/app/(marketing)/about/page.tsx` | 80 | Founding neighborhood/area | NO |
| `src/components/sections/AboutHero.tsx` | 92 | Founding year in micro-trust line | NO |

### Category 2: License Number in UI — Same Source, Multiple Surfaces

The license number placeholder appears in four UI locations and one content location. All are sourced from `siteConfig.license.number` EXCEPT where hardcoded:

| File | Line | Pattern | Notes |
|------|------|---------|-------|
| `src/content/site.ts` | 87 | `"// PLACEHOLDER: NE contractor license..."` | Source of truth |
| `src/components/sections/ContactForm.tsx` | 287 | `Licensed NE #[PLACEHOLDER]` | Hardcoded string, NOT reading from siteConfig |
| `src/components/sections/LeadForm.tsx` | 274 | `Licensed NE #[PLACEHOLDER]` | Hardcoded string, NOT reading from siteConfig |
| `src/components/sections/FinalCTA.tsx` | 67 | `Licensed NE #{siteConfig.license.number}` | Dynamic — renders the site.ts string verbatim |
| `src/components/sections/ServiceCTABand.tsx` | 40 | `Licensed NE #{siteConfig.license.number}` | Dynamic — same issue |

**CRITICAL NOTE:** ContactForm.tsx and LeadForm.tsx have the license number hardcoded as `[PLACEHOLDER]` strings, not reading from `siteConfig`. When the real number arrives, BOTH the `siteConfig.license.number` value AND these hardcoded strings need updating — it's not a single-source fix.

### Category 3: Testimonials — All 6 Are Placeholder

| File | Lines | Count | UI Treatment |
|------|-------|-------|--------------|
| `src/content/testimonials.ts` | 18–85 | 6 entries, all `isPlaceholder: true` | Amber warning banner visible to every visitor |

The `isPlaceholder` flag is consumed by `TestimonialCarousel.tsx` (line 43-44) which renders a visible `[PLACEHOLDER] Sample testimonial — will be replaced with real review before launch` banner on every card. This is FTC-compliant and intentional. No code change needed for the pitch — but HANDOFF.md must make clear that all 6 must be replaced with verbatim real reviews before public launch.

### Category 4: Hero Images — Present But Generic

All service hero images exist in `/public/images/` and are `.webp` format. They are generic stock-style images, not real Raptor project photos.

| File | Line | Current Value | Replace With |
|------|------|---------------|--------------|
| `src/content/services.ts` | 87 | `/images/roofing-hero.webp` | Real project photo |
| `src/content/services.ts` | 88 | Alt text "example installation" | Real project description |
| `src/content/services.ts` | 140 | `/images/siding-hero.webp` | Real project photo |
| `src/content/services.ts` | 141 | Alt text "example installation" | Real project description |
| `src/content/services.ts` | 192 | `/images/gutters-hero.webp` | Real project photo |
| `src/content/services.ts` | 193 | Alt text "example project" | Real project description |
| `src/content/services.ts` | 253 | `/images/emergency-tarping-hero.webp` | Real response photo |
| `src/content/services.ts` | 254 | Alt text "example response" | Real photo description |
| `src/components/sections/AboutHero.tsx` | 6 | `/images/about-hero.webp` | Real crew/family photo |

Additionally: `public/og/default.jpg` exists (the PLACEHOLDER comment in layout.tsx at line 53 is stale — the file was created).

### Category 5: Placeholder UI Banners — Visible to Visitors

These are rendered as amber banners in the live UI. They inform visitors that content is placeholder. All are intentional and should remain through the pitch but be documented for removal.

| File | Line | Banner Text | Context |
|------|------|-------------|---------|
| `src/components/sections/BeforeAfterGallery.tsx` | 47 | `[PLACEHOLDER] — Real project photo coming` | 3 gallery slots |
| `src/components/sections/InsuranceLogos.tsx` | 57-59 | `[PLACEHOLDER] Carrier logos are stand-ins...` | Insurance carrier section |
| `src/components/sections/FinancingCallout.tsx` | 16 | `$[PLACEHOLDER]/mo` | Financing section |
| `src/content/testimonials.ts` via `TestimonialCarousel.tsx` | 43-44 | `[PLACEHOLDER] Sample testimonial...` | All 6 testimonial cards |
| `src/app/(marketing)/contact/page.tsx` | 128 | `[PLACEHOLDER: confirm street address...]` | Contact page NAP block |

### Category 6: FAQ Content — Partial Placeholders

Three FAQ answers have inline `[PLACEHOLDER]` text that needs real data:

| File | Line | FAQ | Data Needed |
|------|------|-----|-------------|
| `src/content/faqs.ts` | 107 | Siding cost ranges | Current material pricing |
| `src/content/faqs.ts` | 131 | Fiber cement / LP SmartSide warranty years | Manufacturer specs |
| `src/content/faqs.ts` | 199 | Emergency tarping cost range | Current pricing |

### Category 7: Schema — AggregateRating Commented Out

| File | Line | Status |
|------|------|--------|
| `src/lib/schema.tsx` | 85–90 | `AggregateRating` block is commented out pending real review data |

This is intentional. Uncomment when real review count/rating is confirmed.

### Total Placeholder Count Summary

| Category | Count | Resolvable Without Raptor |
|----------|-------|--------------------------|
| Business identity (address, email, founders) | 8 | 0 |
| License number (source) | 1 | 0 |
| License number (hardcoded UI) | 2 | 0 (same dependency) |
| Social links | 3 | 0 |
| Certifications | 2 | 0 |
| Google reviews count/rating | 2 | 0 |
| Testimonials (all 6 are placeholder) | 6 | 0 |
| Hero images (generic stock) | 9 | 0 |
| Financing monthly payment | 1 | 0 |
| FAQ partial content | 3 | 0 |
| AggregateRating (commented out) | 1 | 0 |
| **TOTAL** | **38** | **0** |

**Finding:** No placeholders can be confidently resolved without Raptor's direct input. The ZIP code could be updated from 68102 to 68116 based on BBB data, but that should be flagged as "needs Raptor confirmation" rather than asserted as fact.

---

## Raptor Roofing Real Data Search Results

**Researched sources:** raptorroofingllc.com, BBB profile, Google search results

### Confirmed Data (HIGH confidence)
- **Phone:** (402) 885-1462 — confirmed on their own website and BBB
- **BBB Status:** A- rating, accredited since 1/20/2026
- **Business entity:** "Raptor Roofing, LLC"
- **Hours:** Mon–Sat 7:00 AM – 7:00 PM, Closed Sunday — matches site.ts
- **ZIP area:** BBB shows 68116-6142 (different from the 68102 placeholder in site.ts)
- **Services:** Roofing, siding, gutters, emergency tarping — confirmed
- **No-subcontractor claim:** Confirmed on their website
- **Owners named on BBB:** Karen Colin Jaimes and Homero Flores

### Unconfirmed / Not Found (LOW confidence)
- **Contractor license number:** Not in BBB profile, not on their website. Must be looked up at https://dol.nebraska.gov/conreg/Search by business name.
- **Founding year:** Their website says "15+ years" but does not state a specific year. BBB shows the LLC was formally registered 6/30/2025 (a recently formed LLC entity — the "15+ years experience" likely refers to the owners' experience, not an LLC founding date). The "2009" in site.ts is editorial/marketing, not confirmed.
- **Google review count and rating:** Not findable from web search. Must check Google Maps or GBP directly.
- **GAF/Owens Corning certifications:** Not mentioned on their website. The 2025 website mentions "Atlas Briarwood Pro" shingles (Atlas brand, not GAF or Owens Corning). Certifications in site.ts are likely wrong.
- **Facebook/Instagram URLs:** BBB profile links to Facebook (created December 2024 per snippet), but the URL was not captured. Nextdoor page exists.
- **Google Business Profile URL:** The `https://g.page/raptor-roofing-omaha` in site.ts is a placeholder guess, not a confirmed URL.

### Critical Finding on Certifications
The real raptorroofingllc.com website references Atlas shingles specifically, not GAF or Owens Corning. The certifications listed in `siteConfig.certifications` (GAF Certified Contractor, Owens Corning Preferred Contractor) are both marked `// PLACEHOLDER` and should be treated as unconfirmed. Do not display them as facts without Raptor confirming which manufacturer programs they are actually enrolled in.

### ZIP Code Discrepancy
- `site.ts` ZIP: `68102` (a placeholder)
- BBB profile ZIP: `68116`
- 68116 is West Omaha near 144th Street — consistent with an Omaha roofing company's office location
- **Recommendation:** Update ZIP comment to note BBB shows 68116, but flag as needing Raptor confirmation rather than asserting it

---

## Storm-Chaser Copy Audit Baseline

### Audit Methodology
Anti-chaser positioning is Raptor's brand core. The copy must be checked against one question: "Does any headline or CTA imply the kind of urgency or pressure that storm-chaser companies use?" Secondary question: "Does the copy make claims we can't substantiate (15 years, specific certifications, review counts)?"

### Section-by-Section Audit

**Homepage Hero (src/components/sections/Hero.tsx)**
- H1: "The Family-Owned Roofer Omaha Calls Back." — PASS. Relational, not urgent.
- Subhead: "Fifteen years in the neighborhood. Same crew from estimate to final walkthrough. No subcontractors, no pressure, no disappearing act after the storm." — PASS. Anti-chaser framing is explicit and appropriate.
- CTA: "Call (402) 885-1462" — PASS. Direct, no manufactured urgency.
- Trust line: "4.9 · 127 Google Reviews [Placeholder]" — FLAG. "[Placeholder]" is visible to visitors. Acceptable for pitch but must be replaced before launch.
- Trust line: "Licensed & Insured · NE # [Placeholder]" — FLAG. Same issue.

**WhyNotChaser Section (src/components/sections/WhyNotChaser.tsx)**
- H2: "Why We're Not a Storm Chaser" — PASS. Accurate.
- Storm chaser items: "Door-knocking pressure: 'Sign today before the adjuster arrives'" — PASS. Accurately describes chaser tactics without Raptor using the same tactics.
- Raptor items: "No pressure, no deposits — we wait for your insurance estimate" — PASS. Strong anti-chaser language.
- Overall: This section is the strongest copy on the site. No changes recommended.

**ServiceCTABand (src/components/sections/ServiceCTABand.tsx)**
- Eyebrow: "Ready to get started?" — PASS. Neutral.
- H2: "We answer the phone. You get a straight answer." — PASS. Trustworthy, not urgent.
- Body: "No automated systems, no call centers. A real Raptor estimator picks up and gives you an honest assessment — no obligation." — PASS. Excellent anti-chaser positioning.

**FinalCTA (src/components/sections/FinalCTA.tsx)**
- Default heading: "Ready to Get Started?" — PASS. Neutral.
- Default subheading: "Call us or request a free estimate — a real Raptor crew member will follow up within 2 hours." — BORDERLINE. "Within 2 hours" is a response-time promise. This is not storm-chaser language, but Andrew should confirm the 2-hour promise is operationally realistic. If Raptor can't reliably answer within 2 hours, this claim should be softened.

**Emergency Tarping Service Page Hero**
- H1: "24/7 Emergency Roof Tarping in Omaha" — PASS. Factual, not manufactured urgency.
- Subhead: "Storm hit tonight? We respond immediately — day or night." — BORDERLINE. "Respond immediately" is an ambitious promise. Real response depends on crew availability and weather. Consider softening to "We respond as quickly as conditions allow" — which already appears in the process steps copy on that page. **Inconsistency:** The process step (step 1) says "We dispatch a crew as fast as conditions allow, 24 hours a day" — this is more accurate than the hero subhead. The hero subhead should match.

**Contact Page (src/app/(marketing)/contact/page.tsx)**
- H1: "Get a Free Estimate from Raptor Roofing" — PASS. Clear, no urgency.
- Subhead: "Family-owned. Locally crewed. We answer every call within 2 hours during business hours." — BORDERLINE. Same 2-hour promise as FinalCTA. Confirm with Raptor.

**About Page Hero (src/components/sections/AboutHero.tsx)**
- Title: "Built on a Family Name. Backed by Our Own Crews." — PASS. Excellent positioning.
- Subtitle: "We're a family-owned roofing company rooted in Omaha..." — PASS.
- Micro-trust: "Family-Owned Since [PLACEHOLDER: founding year]" — FLAG. Placeholder visible. Needs real year.

**About Page Story (src/app/(marketing)/about/page.tsx)**
- Section: "What to Watch For After a Storm" — PASS. Educational content with appropriate tone. The five warning signs accurately describe storm chaser behavior without being alarmist.
- CTA: "Talk to the Crew Behind the Name" — PASS.

**FinancingCallout (src/components/sections/FinancingCallout.tsx)**
- H2: "Financing Available" — PASS.
- Body: "We partner with trusted home improvement lenders..." — PASS. Soft language appropriate for financing.
- "$[PLACEHOLDER]/mo" — FLAG. Visible placeholder, no amount filled in.

**InsuranceLogos (src/components/sections/InsuranceLogos.tsx)**
- H2: "Works with every major insurance carrier" — PASS. Accurate claim.
- Placeholder banner: visible to visitors. Acceptable for pitch.

### Storm-Chaser Copy Audit Summary

| Section | Status | Action |
|---------|--------|--------|
| Homepage Hero | PASS | None |
| WhyNotChaser | PASS | None — strongest copy on site |
| ServiceCTABand | PASS | None |
| FinalCTA "2-hour" promise | BORDERLINE | Confirm with Raptor before launch |
| Emergency Tarping subhead | BORDERLINE | Soften to match process step copy |
| About Hero | PASS (with placeholder flag) | Fill founding year |
| About story | PASS | None |
| Contact page | PASS | Confirm 2-hour promise |

**Flagged items requiring action:**
1. Emergency Tarping hero subhead: "We respond immediately" is inconsistent with the more careful process step language. Should be softened to match.
2. Two-hour response promise appears in FinalCTA and Contact page — verify with Raptor that this is operationally accurate before launch.

---

## Demo Stub Revert Path

### What the Demo Stubs Do

Both `ContactForm.tsx` and `LeadForm.tsx` implement the same pattern. After validation passes and the API call completes, the actual API response (`data`) is discarded and the form always shows the success card:

```typescript
// DEMO MODE: always show success regardless of API response.
// Reason: zero-env-vars policy means /api/contact returns {success:false}
// without NOTIFICATION_EMAIL. Remove this stub before real deploy.
void data;
setSubmittedName(name);  // ContactForm only
setStatus('success');
```

### What "Reverting" Means

To make forms actually deliver leads to email, three things must happen (post-sign, not Phase 8):

1. **Set env vars in Vercel dashboard:**
   - `NOTIFICATION_EMAIL` — where leads are delivered (Raptor's Gmail or NSI handoff email)
   - `RESEND_API_KEY` — for the Resend email sender (`src/lib/email/` uses Resend)
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` — reCAPTCHA v3 site key
   - `RECAPTCHA_SECRET_KEY` — reCAPTCHA v3 secret key
   - `NEXT_PUBLIC_SITE_URL` — production domain URL

2. **Remove the demo stub in `ContactForm.tsx` (lines 130–135):**

   Remove:
   ```typescript
   // DEMO MODE: always show success regardless of API response.
   // Reason: zero-env-vars policy means /api/contact returns {success:false}
   // without NOTIFICATION_EMAIL. Remove this stub before real deploy.
   void data;
   setSubmittedName(name);
   setStatus('success');
   ```
   Replace with:
   ```typescript
   if (data.success) {
     setSubmittedName(name);
     setStatus('success');
   } else {
     setStatus('error');
   }
   ```

3. **Remove the demo stub in `LeadForm.tsx` (lines 51–54):**

   Remove:
   ```typescript
   // DEMO MODE: always show success regardless of API response.
   // Reason: zero-env-vars policy means /api/contact returns {success:false}
   // without NOTIFICATION_EMAIL. Remove this stub before real deploy.
   void data;
   setStatus("success");
   ```
   Replace with:
   ```typescript
   if (data.success) {
     setStatus("success");
   } else {
     setStatus("error");
   }
   ```

### Email Infrastructure Already Built

The `/api/contact/route.ts` API route is fully implemented. It validates input, runs reCAPTCHA verification (gracefully skipped if no token), checks for `NOTIFICATION_EMAIL` env var, and sends via the Resend library. The `src/lib/email/` module handles actual sending. When env vars are set, the production email flow works without any code changes — only the demo stubs in the two form components need to be removed.

### reCAPTCHA Fallback Behavior

`ContactForm.tsx` checks for `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` at render time. If absent, it renders the form without `GoogleReCaptchaProvider` (no reCAPTCHA script loads). The API route at `/api/contact` receives no `recaptchaToken` and logs a warning but continues. For the pitch demo, this means: no reCAPTCHA, no email delivery, but the success card still shows. Post-sign, setting the site key wires the reCAPTCHA provider automatically.

---

## Project Structure for README

```
raptor-roofing/
├── src/
│   ├── app/
│   │   ├── (marketing)/          # All public-facing pages
│   │   │   ├── page.tsx          # Homepage
│   │   │   ├── about/page.tsx    # About page
│   │   │   ├── contact/page.tsx  # Contact + form
│   │   │   ├── services/
│   │   │   │   └── [slug]/page.tsx  # Dynamic service pages (4 services)
│   │   │   └── service-areas/
│   │   │       └── [slug]/page.tsx  # Dynamic service area pages (8 cities)
│   │   ├── api/contact/route.ts  # Lead capture API (Resend + reCAPTCHA)
│   │   ├── layout.tsx            # Root layout (fonts, analytics, OG)
│   │   ├── robots.ts             # robots.txt generation
│   │   └── sitemap.ts            # sitemap.xml generation
│   ├── components/
│   │   ├── layout/               # Header, Footer, Nav, UrgencyBar, TrustStrip
│   │   ├── sections/             # Hero, ServiceHero, LeadForm, ContactForm, etc.
│   │   └── templates/            # No templates yet (reserved)
│   ├── content/
│   │   ├── site.ts               # Business config (phone, address, reviews, license)
│   │   ├── services.ts           # 4 service definitions
│   │   ├── service-areas.ts      # 8 service area definitions
│   │   ├── testimonials.ts       # 6 placeholder testimonials
│   │   └── faqs.ts               # FAQ content (22 FAQs)
│   └── lib/
│       ├── email/                # Resend email sender (copied from NSI tools)
│       ├── metadata.ts           # buildMetadata helper
│       └── schema.tsx            # JSON-LD schema builders
├── public/
│   ├── images/                   # Hero images (webp, generic stock)
│   └── og/default.jpg            # OG share image
├── scripts/
│   ├── check-bundle-size.mjs     # Bundle size enforcement
│   └── check-no-review-schema.mjs # Verifies AggregateRating stays commented
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind v4 config
└── package.json                  # npm scripts: dev, build, start, lint, type-check
```

### Key npm Scripts

| Script | Command | Use |
|--------|---------|-----|
| Dev server | `npm run dev` | Local development at localhost:3000 |
| Build | `npm run build` | Production build check |
| Lint | `npm run lint` | ESLint (2 pre-existing errors — see Tech Debt) |
| Type check | `npm run type-check` | TypeScript validation |
| Schema check | `npm run check:schema` | Verifies AggregateRating stays disabled |
| Bundle check | `npm run check:bundle` | Verifies bundle size limits |

### Environment Variables Required for Production

| Variable | Where Set | Purpose |
|----------|-----------|---------|
| `NOTIFICATION_EMAIL` | Vercel | Lead notification destination |
| `RESEND_API_KEY` | Vercel | Resend email API key |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Vercel | reCAPTCHA v3 site key |
| `RECAPTCHA_SECRET_KEY` | Vercel | reCAPTCHA v3 secret key |
| `NEXT_PUBLIC_SITE_URL` | Vercel | Production domain URL |

None of these are set in the current Vercel deployment. The site runs in demo-mode without them.

---

## Known Tech Debt

### Pre-Existing Lint Errors (2 errors, NOT introduced by Claude)

Both are `react-hooks/set-state-in-effect` violations:

**1. `src/components/layout/MobileMenuButton.tsx` (line 78)**
```typescript
useEffect(() => {
  if (!open) {
    hamburgerRef.current?.focus();
    setServicesOpen(false);  // ERROR: setState in effect body
    setAreasOpen(false);      // ERROR: setState in effect body
  }
}, [open]);
```
Fix: Move the state resets into a cleanup or restructure the effect to use `useLayoutEffect` / restructure to avoid setState.

**2. `src/components/layout/UrgencyBar.tsx` (line 17)**
```typescript
useEffect(() => {
  if (sessionStorage.getItem(SESSION_KEY) === "1") {
    setDismissed(true);  // ERROR: setState in effect body
    return;
  }
  // ...
}, []);
```
Fix: Initialize `dismissed` state from `sessionStorage` lazily: `useState(() => sessionStorage?.getItem(SESSION_KEY) === "1")` — eliminates the effect entirely.

**Impact:** These are errors but do not prevent build or deployment. The site runs correctly. They do appear in `npm run lint` output and should be cleaned up before production.

### 2 Lint Warnings (non-blocking)
- `scripts/check-bundle-size.mjs` line 61: `'err' is defined but never used`
- `scripts/extract-lighthouse-scores.mjs` line 13: `'writeFileSync' is defined but never used`

### OG Image Stale Comment
`src/app/layout.tsx` line 53 has `// PLACEHOLDER: create in Phase 6` comment next to `/og/default.jpg`. The file exists at `public/og/default.jpg`. The comment should be removed — it's stale.

### AggregateRating Intentionally Disabled
`src/lib/schema.tsx` lines 85–90: The `AggregateRating` schema block is commented out with a placeholder note. A guard script at `scripts/check-no-review-schema.mjs` enforces this stays disabled until real reviews are confirmed. Do not uncomment until Raptor provides actual review data.

### README.md Is a Next.js Template
The current `README.md` is the boilerplate Next.js create-next-app README, not project-specific. Phase 8 replaces this entirely.

---

## Architecture Patterns

No new patterns needed for this phase. Phase 8 is pure documentation and audit. Key patterns already established:

- **Single source of truth:** `src/content/site.ts` is the content authority for all business data. Most placeholders are centralized here — changing `siteConfig` propagates everywhere except the two hardcoded license number strings in forms.
- **Demo mode isolation:** Both form components use `void data` + unconditional `setStatus('success')` as the stub. Reverting requires finding these two specific sections.
- **Placeholder CSS class:** The `.placeholder-banner` CSS class is used on visible placeholder UI elements. Searching for this class name finds all consumer-facing placeholder banners.

---

## Open Questions

1. **Founding year accuracy:** site.ts says 2009. Their website says "15+ years." BBB shows LLC registered 6/30/2025. These three facts are inconsistent. The "15+ years" could refer to owner experience rather than the company. The planner should create a HANDOFF.md task to clarify this with Raptor before launch — the meta description and About page both reference the founding year.

2. **Certifications mismatch:** Site uses GAF Certified and Owens Corning Preferred as certifications, but their real website references Atlas shingles. These may all be wrong. Needs direct Raptor confirmation.

3. **Two-hour response promise:** Appears twice (FinalCTA and Contact page). If Raptor can't guarantee this operationally, it should be softened to "within the same business day" or similar. Flag for Raptor to confirm.

4. **ZIP code:** BBB shows 68116, site.ts has 68102 (placeholder). Updating the ZIP can be done with high confidence from BBB data, but only Andrew can decide whether to trust BBB data without direct Raptor confirmation.

---

## Sources

### Primary (HIGH confidence — direct code inspection)
- `src/content/site.ts` — all PLACEHOLDER comments, line numbers documented above
- `src/content/testimonials.ts` — 6 placeholder testimonials confirmed
- `src/content/services.ts` — hero image paths confirmed as placeholder
- `src/components/sections/ContactForm.tsx` — demo stub exact code documented
- `src/components/sections/LeadForm.tsx` — demo stub exact code documented
- `src/app/(marketing)/about/page.tsx` — founding year/name placeholders confirmed
- `npm run lint` output — 2 pre-existing errors documented

### Secondary (MEDIUM confidence — web sources)
- BBB Profile (https://www.bbb.org/us/ne/omaha/profile/roofing-contractors/raptor-roofing-llc-0714-1000072338) — BBB A- rating, accreditation date, ZIP 68116, owner names
- raptorroofingllc.com — phone, hours, "no subcontractors" confirmed, Atlas shingles referenced

### Tertiary (LOW confidence — web search only)
- Google review count/rating: NOT found. Cannot be confirmed from search results.
- Contractor license number: NOT found. Nebraska DOL database lookup required (https://dol.nebraska.gov/conreg/Search).
- Social media URLs: Facebook page exists (per BBB link), Instagram unknown.

---

## Metadata

**Confidence breakdown:**
- Placeholder inventory: HIGH — direct code inspection, all files read
- Demo stub revert path: HIGH — exact code documented
- Real business data: LOW — phone confirmed, ZIP 68116 MEDIUM, all other business specifics unconfirmed
- Copy audit findings: HIGH — direct code read, judgments are opinion but grounded in the anti-chaser brief

**Research date:** 2026-04-15
**Valid until:** 2026-05-15 (stable codebase, no expected changes)
