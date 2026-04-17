# Raptor Roofing — Future Directions & Limitations Report

**Project:** Raptor Roofing LLC — Omaha roofing contractor pitch demo site  
**Build date:** April 2026  
**Current status:** Pitch demo (not public-facing production)  
**Live URL:** https://raptor-roofing.vercel.app

---

## 1. Known Limitations

These are things the current build cannot do or does poorly. All are intentional trade-offs made to prioritize pitch demo readiness over backend depth.

### Forms Do Not Deliver Leads

Both the Contact page form (`ContactForm.tsx`) and the inline lead capture form (`LeadForm.tsx`) use demo stubs that discard the API response and always show the success card. Real lead delivery requires setting 5 environment variables in Vercel and reverting 4–5 lines in each form component. The API route (`/api/contact/route.ts`) is fully implemented and will work without further code changes once env vars are set.

### No Bot Protection

reCAPTCHA v3 is integrated in the code but inactive. Without `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` set, the form renders without the reCAPTCHA provider and no token is sent to the API. The API route gracefully skips verification and continues. This means the contact endpoint is unprotected against bots for as long as the pitch URL is accessible. The site is not publicly advertised, reducing actual risk, but this must be resolved before any SEO-driven traffic arrives.

### All Testimonials Are Placeholder

All 6 testimonial cards in `TestimonialCarousel.tsx` display a visible amber warning banner indicating placeholder status. These are FTC-safe for the pitch but constitute a meaningful credibility gap. No real Raptor reviews are displayed anywhere on the site.

### No Analytics Depth

Vercel Web Analytics is enabled (free tier, no cookies). There is no GA4, no GTM, no event tracking, no form submission conversion tracking, and no call tracking. The site can report page views but not leads generated, scroll depth, or which pages drive calls.

### Hero Images Are Generic Stock

Nine images across service pages and the About page are generic stock-quality photos not related to real Raptor projects. These undermine authenticity on the pages where social proof matters most — service-specific pages where a prospect is evaluating real work quality.

### AggregateRating Schema Disabled

The JSON-LD `AggregateRating` schema is intentionally commented out in `src/lib/schema.tsx`. A guard script enforces this. Google cannot display star ratings in search results for Raptor until real review data is confirmed and the schema is enabled.

### No Blog / Content Marketing

The site has no blog section. A roofing contractor in Omaha competing for organic search traffic needs topical content: storm damage guides, seasonal maintenance articles, insurance claim walkthroughs. This is the largest structural SEO gap — service and service area pages alone are not enough to rank for informational queries.

### No Call Tracking

There is no call tracking integration (CallRail, WhatConverts, or similar). Clicks on the phone number tap target are not measured. This means there is no data on which pages drive the most calls — the highest-value conversion event for a roofing contractor.

### No Custom Domain

The site is deployed on Vercel's subdomain. Google cannot index a production site ranking for local queries until a custom domain is configured and search engines are notified.

---

## 2. Assumptions and Constraints

Decisions made during the build due to time, scope, or pitch-first priorities that may need revisiting before production.

### Demo-First Priority Throughout

The entire build operated under a "pitch demo over backend" constraint. Every decision that would have required real credentials, production accounts, or a live Raptor engagement was deferred. The architectural choices are correct for production — only the content and configuration layers need updating.

### Placeholder Data Based on Research, Not Client Interviews

Business data (founding year 2009, review count 127, rating 4.9, GAF/Owens Corning certifications, social URLs) was filled with editorial estimates based on competitor research and the anti-chaser positioning brief — not direct interviews with Raptor. All of this data must be verified and replaced before public launch.

### Certifications Are Likely Wrong

The site lists GAF Certified Contractor and Owens Corning Preferred Contractor. Raptor's own website references Atlas shingles. These certifications may be entirely incorrect. Do not launch without Raptor confirming which manufacturer programs they are actually enrolled in.

### Resend Chosen for Email (Free Tier)

The email infrastructure uses Resend (100 emails/day free tier). For a roofing contractor receiving fewer than 100 web leads per day, this is sufficient. If lead volume exceeds free tier, upgrade to Resend Pro ($20/month). No code changes required for the upgrade — only the API key changes.

### reCAPTCHA v3 Chosen (Invisible)

Invisible reCAPTCHA was chosen over v2 (checkbox) to avoid user friction. v3 scores each submission silently. The threshold is currently set to 0.5 in the API route — submissions scoring below 0.5 are rejected. Adjust this threshold in `src/app/api/contact/route.ts` if legitimate leads are being blocked.

### Content Based on Competitor Research, Not Raptor Interviews

The WhyNotChaser positioning, FAQ content, service descriptions, and hero copy were developed from competitor analysis and the anti-chaser brief provided in discovery. Raptor may have different service process details, warranty terms, or pricing structures. Treat all copy as a solid draft, not final.

### Founding Year Is Editorial

The "2009" founding year in `src/content/site.ts` is an editorial placeholder. The LLC was registered in June 2025. The owners' personal roofing experience may go back further. Verify with Raptor before the About page goes live.

### No Automated Tests

There are no unit tests, integration tests, or end-to-end tests in this codebase. Quality assurance was manual. Lighthouse scores (all 28 >= 90) and Rich Results Test (3/3 URLs passing) were the primary quality gates. This is acceptable for a pitch demo but is a liability for a production site under active development.

---

## 3. Future Improvements

Prioritized from highest immediate ROI to longer-term growth work.

### Immediate (Post-Sign, Before Public Launch)

These must be completed before the site is shown to anyone outside the pitch context:

1. **Replace all 38 placeholders** — Real business data from Raptor. See HANDOFF.md for the complete inventory and ready-to-paste Claude Code prompt.
2. **Revert demo stubs** — 4–5 lines per form component. Forms go live. See HANDOFF.md Section 4.
3. **Configure env vars** — All 5 in Vercel dashboard. See HANDOFF.md Section 5.
4. **Set up custom domain** — Point Raptor's domain to Vercel. Update `NEXT_PUBLIC_SITE_URL`. No code changes required.
5. **Fix hardcoded license number** — Update `ContactForm.tsx` and `LeadForm.tsx` directly (not just `site.ts`). See HANDOFF.md Section 3, Category 2.
6. **Enable AggregateRating schema** — Uncomment in `src/lib/schema.tsx` once real review count/rating is confirmed.

### Short-Term (First 30 Days Live)

These turn the pitch site into an actively optimized lead generator:

7. **Replace hero images with real project photos** — Most impactful single content change. Real photos of real Omaha roofs convert better than any copy improvement.
8. **Replace placeholder testimonials with real Google reviews** — All 6. Removes amber warning banners, adds FTC-compliant social proof.
9. **Submit to Google Search Console** — Index the site, monitor for crawl errors, begin tracking keyword positions.
10. **Claim and optimize Google Business Profile** — Confirm the GBP URL, add photos, respond to reviews. GBP is the primary local SEO driver for roofing contractors.
11. **Set up GA4 + GTM** — Add GTM container to `src/app/layout.tsx`. Configure GA4 property. Set up goal tracking for form submissions and phone link clicks.
12. **Set up CallRail (or similar) for call tracking** — Replace the `tel:` link with a tracked number. Know which pages and search terms drive calls.

### Medium-Term (3–6 Months)

These extend the site's reach and deepen competitive moat:

13. **Launch a blog** — Target 2 posts/month on seasonal Omaha roofing topics: hail damage signs, spring inspection checklist, insurance claim process, choosing a Omaha roofer. Each post should target a specific informational keyword and link to the relevant service page.
14. **Automated review generation workflow** — Post-job email/SMS to happy customers asking for a Google review. Use n8n Cloud to automate the ask. Target: move from current placeholder count to 50+ verified reviews within 6 months.
15. **Before/after gallery with real projects** — The `BeforeAfterGallery.tsx` component is scaffolded but currently has 3 amber placeholder banners. Real photos of hail damage repairs, full replacements, and siding projects would convert at high rates.
16. **Service area page expansion** — Currently 8 cities. Expand to 15–20 with genuinely localized content for each. Each new page is a new keyword ranking opportunity (e.g., "roofing contractor Bellevue NE").
17. **Seasonal landing pages** — Storm season landing page (May–September), spring inspection landing page (March–April), winter damage landing page (January–February). These capture high-intent seasonal traffic that service pages don't fully address.

### Long-Term (6+ Months)

These require either significant content effort or additional infrastructure investment:

18. **Client dashboard for lead tracking** — Integrate with the Google Sheets CRM. Give Raptor a simple view of leads received, follow-up status, and jobs booked.
19. **Automated follow-up sequences** — n8n workflow: lead submits form → confirmation email to lead → notification to Raptor → 24-hour follow-up if no contact logged → 72-hour check-in. Converts more leads without additional ad spend.
20. **Video testimonials** — Homeowner video reviews embedded on service pages. These are the highest-trust social proof format for contractor services.
21. **Financing integration** — If Raptor signs with a financing partner (GreenSky, Hearth, etc.), embed the application directly in the site rather than just linking out. Eliminates drop-off.
22. **Multi-location expansion** — If Raptor grows to Lincoln or Kansas City, the content architecture supports new city hubs. The `service-areas.ts` pattern scales cleanly.

---

## 4. Technical Debt

Shortcuts and known issues to clean up before or shortly after production launch.

### Pre-Existing Lint Errors (2 errors — non-blocking but should be fixed)

Both are `react-hooks/set-state-in-effect` violations introduced before Phase 8:

**`src/components/layout/MobileMenuButton.tsx` (line 78):**

The two `set*Open(false)` calls were moved from a `useEffect` (lint error) to the close handler in Phase 8-01. The errors are now fixed. If they resurface, verify the close handler pattern is intact.

**`src/components/layout/UrgencyBar.tsx` (line 17):**

The `setDismissed(true)` call was moved to a lazy `useState` initializer in Phase 8-01. The error is fixed. If it resurfaces, verify the lazy initializer pattern is intact:
```typescript
const [dismissed, setDismissed] = useState(
  () => typeof window !== 'undefined' && sessionStorage?.getItem(SESSION_KEY) === '1'
);
```

### Lint Warnings in Scripts (2 warnings — non-blocking)

- `scripts/check-bundle-size.mjs` line 61: `'err' is defined but never used`
- `scripts/extract-lighthouse-scores.mjs` line 13: `'writeFileSync' is defined but never used`

These do not affect the site or builds. Fix by removing the unused variable declarations.

### Hardcoded License Number in Form Components

`ContactForm.tsx` (~line 287) and `LeadForm.tsx` (~line 274) have the license number as a hardcoded string `"Licensed NE #[PLACEHOLDER]"` rather than reading from `siteConfig.license.number`. This means changing `site.ts` alone does not fully update the license display — the two form components also need manual updates. Ideally, refactor both components to import from `siteConfig`:

```typescript
import { siteConfig } from '@/content/site';
// ...
<span>Licensed NE #{siteConfig.license.number}</span>
```

### No Automated Test Suite

There are no unit tests, integration tests, or end-to-end tests. The site was QA'd manually. Recommend adding at minimum:
- Playwright e2e test: homepage loads, phone link works, form submits and shows success card
- Unit test for the `buildMetadata` helper in `src/lib/metadata.ts`
- Schema snapshot test to catch accidental JSON-LD regressions

### No CI/CD Beyond Vercel Auto-Deploy

There is no GitHub Actions pipeline. The only quality gates are the pre-commit manual runs of `npm run lint`, `npm run type-check`, `npm run check:schema`, and `npm run check:bundle`. A basic CI workflow would run these automatically on every push and PR.

### Stale `check-no-review-schema.mjs` Guard

When the `AggregateRating` schema is intentionally enabled (post-sign, once real review data arrives), the guard script at `scripts/check-no-review-schema.mjs` will fail. Either update the script to expect the AggregateRating block, or remove it entirely once it has served its purpose.

### OG Image Is Generic

`public/og/default.jpg` exists and is used as the default Open Graph image. It is a generic placeholder. Before the site ranks or gets shared on social, replace it with a real branded image (Raptor logo + "Omaha's Family-Owned Roofer" on a clean background).

---

*Report generated: 2026-04-15*  
*Project: Raptor Roofing LLC pitch demo*  
*Built by: North Star Integrations (NSI)*
