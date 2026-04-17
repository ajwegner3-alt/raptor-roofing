# Raptor Roofing — Post-Sign Handoff Guide

**Audience:** Andrew using Claude Code  
**Format:** Structured checklist + ready-to-paste mega-prompt  
**Purpose:** Take the pitch demo to a production-ready site after Raptor signs  
**Live pitch URL:** https://raptor-roofing.vercel.app

---

## Section 1: Project Status

### What Is Live Right Now

The pitch demo is deployed on Vercel at https://raptor-roofing.vercel.app.

| Area | Status |
|------|--------|
| All pages render | YES — homepage, about, contact, 4 service pages, 8 service area pages |
| Mobile responsive | YES — tested on iPhone Safari + Android Chrome |
| SEO / JSON-LD schema | YES — validated (Rich Results Test 3/3 PASS, Lighthouse 28/28 scores >= 90) |
| Forms | DEMO MODE — success card shows regardless of API response |
| Email delivery | NO — no env vars configured, leads go nowhere |
| reCAPTCHA | NO — site key not set, fallback mode active |
| Real business data | NO — 38 placeholders, all require Raptor input |
| Analytics | Vercel Web Analytics only (no GA4, no GTM) |
| Custom domain | NO — Vercel preview URL only |

### What Does NOT Work Yet

- **Form submissions do not deliver leads.** Both ContactForm.tsx and LeadForm.tsx use demo stubs that discard the API response and unconditionally show the success card. See Section 4 for the exact revert.
- **38 placeholders** are tagged with `// PLACEHOLDER:` comments across `src/`. Not one can be filled without Raptor's direct input. See Section 3 for the complete inventory.
- **AggregateRating JSON-LD schema is commented out** in `src/lib/schema.tsx` (lines 85–90). A guard script enforces this — do not uncomment until Raptor provides real Google review data.
- **Certifications shown in the footer and trust strip may be incorrect.** See Section 2, Critical Flag #1.

---

## Section 2: Critical Flags — Confirm With Raptor Before Launch

These three items require a direct conversation with Raptor. Do not launch without resolving them.

### Flag 1: Certifications Mismatch (HIGH PRIORITY)

**What the site says:** `siteConfig.certifications` in `src/content/site.ts` lists:
- GAF Certified Contractor
- Owens Corning Preferred Contractor

**What their real website says:** raptorroofingllc.com references Atlas Briarwood Pro shingles (Atlas brand, NOT GAF or Owens Corning).

**What to do:** Ask Raptor directly:
- Are you enrolled in the GAF Certified Contractor program?
- Are you enrolled in the Owens Corning Preferred Contractor program?
- If neither — what manufacturer programs (if any) are you actually certified under?

**File to update:** `src/content/site.ts` lines 120–130 (the `certifications` array).

If they hold no manufacturer certifications, remove that section from the UI entirely (the trust strip and footer both consume `siteConfig.certifications`).

---

### Flag 2: Founding Year Inconsistency (MEDIUM PRIORITY)

**Three conflicting data points:**
- `src/content/site.ts` says: `founded: 2009`
- Their real website says: "15+ years" (no specific year stated)
- BBB profile shows: LLC formally registered 6/30/2025 (very recently — the LLC entity is new)

**Likely explanation:** The owners have ~15+ years of personal roofing experience, but the LLC entity "Raptor Roofing, LLC" was registered in 2025. The "2009" figure in site.ts is editorial, not confirmed.

**Impact:** The founding year appears in:
- `src/app/(marketing)/about/page.tsx` lines 22, 64 (meta description + body copy)
- `src/components/sections/AboutHero.tsx` line 92 (micro-trust line "Family-Owned Since XXXX")

**What to do:** Ask Raptor: "When was the roofing business founded — not the LLC registration date, but when did you first start doing roofing work under this brand or similar?"

If they say 2015 (15 years back from 2030), adjust the founding year in `src/content/site.ts` and confirm the "15+ years" language tracks.

---

### Flag 3: 2-Hour Response Promise (MEDIUM PRIORITY)

**Where it appears:**
- `src/components/sections/FinalCTA.tsx` — default subheading: "a real Raptor crew member will follow up within 2 hours"
- `src/app/(marketing)/contact/page.tsx` — subhead: "We answer every call within 2 hours during business hours"

**Assessment:** This is not storm-chaser language. It is a legitimate service promise that differentiates Raptor. But it is an operational commitment they must be able to keep consistently.

**What to do:** Ask Raptor: "Can you reliably follow up with every web lead within 2 hours during business hours?" If yes, keep the copy. If no, soften to "same business day" or "within 4 hours."

**Do NOT change the copy without Raptor's answer.** The 2-hour promise is a strong conversion element — removing it without reason would weaken the site.

---

## Section 3: Complete Placeholder Inventory

Run `grep -rn "// PLACEHOLDER:" src/` at any time to find all tagged locations.

**Total count: 38 placeholders. Zero are resolvable without Raptor's direct input.**

---

### Category 1: Business Identity (8 items)

| File | Line | Current Placeholder | What Raptor Must Provide |
|------|------|---------------------|--------------------------|
| `src/content/site.ts` | 67 | Street address placeholder | Full street address |
| `src/content/site.ts` | 70 | ZIP `68102` (placeholder — BBB shows 68116, but needs confirmation) | Confirm ZIP code |
| `src/content/site.ts` | 71 | Full address string | Full formatted address |
| `src/content/site.ts` | 74 | `info@raptorroofingllc.com` (plausible but unconfirmed) | Confirm correct email |
| `src/app/(marketing)/about/page.tsx` | 22 | `[PLACEHOLDER: founding year]` in meta description | Founding year |
| `src/app/(marketing)/about/page.tsx` | 64 | `[PLACEHOLDER: founding year]` in body copy | Founding year |
| `src/app/(marketing)/about/page.tsx` | 68 | `[PLACEHOLDER: founder name]` | Owner name(s) for About page |
| `src/app/(marketing)/about/page.tsx` | 80 | `[PLACEHOLDER: neighborhood]` founding story | Founding neighborhood/area of Omaha |
| `src/components/sections/AboutHero.tsx` | 92 | `[PLACEHOLDER: founding year]` in micro-trust line | Founding year |

**Note on owners:** BBB profile lists Karen Colin Jaimes and Homero Flores as principals. Confirm these names with Raptor and ask how they want to be introduced on the About page.

---

### Category 2: License Number (3 surfaces — not single-source)

**CRITICAL:** The license number appears as a hardcoded string in TWO form components, NOT reading from `siteConfig`. When the real number arrives, update THREE locations:

| File | Line | Pattern | Notes |
|------|------|---------|-------|
| `src/content/site.ts` | 87 | `// PLACEHOLDER: NE contractor license number` | Source of truth (should be) |
| `src/components/sections/ContactForm.tsx` | ~287 | `"Licensed NE #[PLACEHOLDER]"` | HARDCODED — does not read from siteConfig |
| `src/components/sections/LeadForm.tsx` | ~274 | `"Licensed NE #[PLACEHOLDER]"` | HARDCODED — does not read from siteConfig |

FinalCTA.tsx (line 67) and ServiceCTABand.tsx (line 40) DO read dynamically from `siteConfig.license.number` — those will update automatically when site.ts is fixed.

**Where to find the license:** Nebraska Department of Labor contractor registration database: https://dol.nebraska.gov/conreg/Search — search by "Raptor Roofing."

---

### Category 3: Social Links (3 items)

| File | Line | Current Placeholder | What to Provide |
|------|------|---------------------|-----------------|
| `src/content/site.ts` | 105 | `https://facebook.com/raptorroofingomaha` (guess) | Real Facebook page URL |
| `src/content/site.ts` | 106 | `https://instagram.com/raptorroofingomaha` (guess) | Real Instagram handle/URL (may not exist) |
| `src/content/site.ts` | 107 | `https://g.page/raptor-roofing-omaha` (guess) | Real Google Business Profile URL |

**Note:** BBB profile confirms a Facebook page exists (created December 2024). Instagram presence is unknown. If they have no Instagram, set `instagram: null` in site.ts and the footer component will hide the icon.

---

### Category 4: Certifications (2 items — see Flag 1)

| File | Line | Current Placeholder | Notes |
|------|------|---------------------|-------|
| `src/content/site.ts` | 122 | `GAF Certified Contractor` | Unconfirmed — see Flag 1 |
| `src/content/site.ts` | 123 | `Owens Corning Preferred Contractor` | Unconfirmed — see Flag 1 |

---

### Category 5: Google Reviews (2 items — unlock schema when resolved)

| File | Line | Current Placeholder | What to Provide |
|------|------|---------------------|-----------------|
| `src/content/site.ts` | 99 | `127` (invented review count) | Actual Google review count |
| `src/content/site.ts` | 100 | `4.9` (invented rating) | Actual Google rating |

**Schema unlock:** When real review data is provided, uncomment the `AggregateRating` block in `src/lib/schema.tsx` (lines 85–90). The guard script at `scripts/check-no-review-schema.mjs` will fail until you do this deliberately. After uncommenting, update the script to expect the AggregateRating block.

---

### Category 6: Testimonials — All 6 Are Placeholder (FTC Risk)

| File | Lines | Count | Current State |
|------|-------|-------|---------------|
| `src/content/testimonials.ts` | 18–85 | 6 entries, all `isPlaceholder: true` | Amber warning banner visible to every visitor |

**FTC compliance note:** The `isPlaceholder: true` flag causes `TestimonialCarousel.tsx` to render a visible amber banner on every testimonial card reading `[PLACEHOLDER] Sample testimonial — will be replaced with real review before launch`. This is intentional and FTC-safe for the pitch. Before public launch, all 6 must be replaced with verbatim real reviews from Raptor's Google page.

**Format needed per testimonial:**
```typescript
{
  id: 'review-1',
  name: 'First Name L.',          // Last name initial only for privacy
  location: 'Omaha, NE',
  rating: 5,
  text: 'Exact verbatim text from the Google review.',
  service: 'Roofing',             // What service they received
  isPlaceholder: false,           // SET THIS TO FALSE
}
```

---

### Category 7: Hero Images — Generic Stock (9 items)

All images exist in `/public/images/` as `.webp` files. They are generic, not real Raptor project photos.

| File | Line | Current Image | Replace With |
|------|------|---------------|--------------|
| `src/content/services.ts` | 87 | `/images/roofing-hero.webp` | Real completed roof photo |
| `src/content/services.ts` | 88 | Alt: "example installation" | Real alt text |
| `src/content/services.ts` | 140 | `/images/siding-hero.webp` | Real siding project photo |
| `src/content/services.ts` | 141 | Alt: "example installation" | Real alt text |
| `src/content/services.ts` | 192 | `/images/gutters-hero.webp` | Real gutters photo |
| `src/content/services.ts` | 193 | Alt: "example project" | Real alt text |
| `src/content/services.ts` | 253 | `/images/emergency-tarping-hero.webp` | Real emergency response photo |
| `src/content/services.ts` | 254 | Alt: "example response" | Real alt text |
| `src/components/sections/AboutHero.tsx` | 6 | `/images/about-hero.webp` | Real crew or family photo |

**Image specs:** WebP format preferred. Minimum 1200px wide for hero use. Compress under 300KB. Descriptive filenames (e.g., `omaha-roof-replacement-2024.webp`).

---

### Category 8: FAQ Partial Placeholders (3 items)

| File | Line | FAQ Topic | Data Needed |
|------|------|-----------|-------------|
| `src/content/faqs.ts` | 107 | Siding cost ranges | Current material pricing (LP SmartSide vs vinyl price range) |
| `src/content/faqs.ts` | 131 | Fiber cement / LP SmartSide warranty years | Manufacturer warranty specs |
| `src/content/faqs.ts` | 199 | Emergency tarping cost range | Raptor's current pricing range |

---

### Category 9: Financing (1 item)

| File | Line | Current Placeholder | What to Provide |
|------|------|---------------------|-----------------|
| `src/components/sections/FinancingCallout.tsx` | 16 | `$[PLACEHOLDER]/mo` | Monthly payment example (e.g., "$89/mo for 12 months") or remove the financing callout if no partner yet |

---

### Category 10: AggregateRating Schema (1 item — intentionally disabled)

| File | Lines | Status |
|------|-------|--------|
| `src/lib/schema.tsx` | 85–90 | Commented out — do not enable without real review data |

---

## Section 4: Demo Stub Revert Instructions

### What the Stubs Do

Both ContactForm.tsx and LeadForm.tsx discard the API response and show the success card unconditionally:

```typescript
// DEMO MODE: always show success regardless of API response.
// Reason: zero-env-vars policy means /api/contact returns {success:false}
// without NOTIFICATION_EMAIL. Remove this stub before real deploy.
void data;
setSubmittedName(name);  // ContactForm only
setStatus('success');
```

### Step 1: Set Env Vars in Vercel Dashboard

Log in to Vercel, open the raptor-roofing project, go to Settings > Environment Variables. Add all five (see Section 5 for details).

### Step 2: Revert ContactForm.tsx (~lines 130–135)

**Remove this block:**
```typescript
// DEMO MODE: always show success regardless of API response.
// Reason: zero-env-vars policy means /api/contact returns {success:false}
// without NOTIFICATION_EMAIL. Remove this stub before real deploy.
void data;
setSubmittedName(name);
setStatus('success');
```

**Replace with:**
```typescript
if (data.success) {
  setSubmittedName(name);
  setStatus('success');
} else {
  setStatus('error');
}
```

### Step 3: Revert LeadForm.tsx (~lines 51–54)

**Remove this block:**
```typescript
// DEMO MODE: always show success regardless of API response.
// Reason: zero-env-vars policy means /api/contact returns {success:false}
// without NOTIFICATION_EMAIL. Remove this stub before real deploy.
void data;
setStatus("success");
```

**Replace with:**
```typescript
if (data.success) {
  setStatus("success");
} else {
  setStatus("error");
}
```

### Step 4: Verify Email Delivery

After pushing, submit a test form on the live site and confirm the notification email arrives in `NOTIFICATION_EMAIL` inbox within 60 seconds.

### Email Infrastructure Note

The `/api/contact/route.ts` API route is fully implemented. It validates input, handles reCAPTCHA verification (gracefully skipped if token absent), and sends via Resend. No code changes needed in the API route — only the two demo stubs in the form components need removal.

---

## Section 5: Environment Variables

All five must be set in the Vercel dashboard under Settings > Environment Variables. None are needed for local development — the site runs in demo mode without them.

| Variable | Purpose | Where to Get It |
|----------|---------|-----------------|
| `NOTIFICATION_EMAIL` | Email address where lead notifications are delivered | Andrew/Raptor decide — Raptor's Gmail or NSI relay |
| `RESEND_API_KEY` | API key for Resend email sender | https://resend.com — create free account, generate API key |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key (public, visible to browser) | https://www.google.com/recaptcha/admin — register site |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 secret key (server-side only) | Same Google reCAPTCHA admin dashboard |
| `NEXT_PUBLIC_SITE_URL` | Production domain URL (e.g., `https://raptorroofing.com`) | Raptor's domain — set up in Namecheap + Vercel |

**Set all 5 at once.** Partial configuration causes the API route to degrade silently.

---

## Section 6: Ready-to-Paste Claude Code Mega-Prompt

When Raptor signs and provides their real business data, paste the following into a new Claude Code session. Fill in the `RAPTOR_PROVIDED_DATA` block with their actual values before pasting.

````
# Raptor Roofing — Production Launch Session

## Context
This is the post-sign production launch for Raptor Roofing, an Omaha roofing contractor.
Pitch demo is live at https://raptor-roofing.vercel.app.
Read HANDOFF.md in the project root before starting — it contains the complete placeholder
inventory, demo stub revert instructions, and env var requirements.

## Raptor Provided Data

Fill in all values below with what Raptor gave you:

```
STREET_ADDRESS=                     # e.g., "5432 N 144th St"
ZIP_CODE=                           # e.g., "68116"
FULL_ADDRESS=                       # e.g., "5432 N 144th St, Omaha, NE 68116"
CONFIRMED_EMAIL=                    # e.g., "info@raptorroofingllc.com"
NE_LICENSE_NUMBER=                  # e.g., "NE-2024-00123"
FOUNDING_YEAR=                      # e.g., "2015"
FOUNDER_NAMES=                      # e.g., "Karen Colin Jaimes and Homero Flores"
FOUNDING_NEIGHBORHOOD=              # e.g., "West Omaha"
GOOGLE_REVIEW_COUNT=                # e.g., "89"
GOOGLE_REVIEW_RATING=               # e.g., "4.8"
FACEBOOK_URL=                       # e.g., "https://facebook.com/raptorroofingllc"
INSTAGRAM_URL=                      # e.g., "https://instagram.com/raptor_roofing" or "NONE"
GBP_URL=                            # e.g., "https://g.page/r/CdXXXXXXXXXX"
CERTIFICATIONS=                     # e.g., "Atlas Certified Contractor" or "NONE"
FINANCING_MONTHLY=                  # e.g., "$89/mo for 12 months" or "NONE"
REAL_TESTIMONIALS=                  # paste 6 verbatim Google reviews with reviewer first name, city
ROOFING_PHOTO_PATH=                 # local path to real roofing project photo (webp preferred)
SIDING_PHOTO_PATH=                  # local path to real siding project photo
GUTTERS_PHOTO_PATH=                 # local path to real gutters project photo
EMERGENCY_PHOTO_PATH=               # local path to real emergency tarping photo
ABOUT_PHOTO_PATH=                   # local path to crew or family photo
SIDING_COST_RANGE=                  # e.g., "$8–$14 per square foot installed"
LP_WARRANTY_YEARS=                  # e.g., "5/50 limited warranty"
EMERGENCY_TARPING_COST=             # e.g., "$300–$600 depending on roof size"
TWO_HOUR_PROMISE_CONFIRMED=         # "YES" or "NO - soften to [alternative]"
```

## Instructions for Claude Code

Execute the following tasks in order. Commit after each group.

### Task A: Replace All Placeholders in src/content/site.ts
Update every `// PLACEHOLDER:` tagged value with the provided real data:
- `address.street`, `address.zip`, `address.full`
- `email`
- `license.number`
- `social.facebook`, `social.instagram` (set to null if INSTAGRAM_URL is "NONE"), `social.gbp`
- `reviews.count`, `reviews.rating`
- `founded` year
- `certifications` array (clear and repopulate, or remove if CERTIFICATIONS is "NONE")
- Commit: `feat(launch): replace site.ts placeholders with real Raptor data`

### Task B: Fix Hardcoded License Number in Form Components
Update the hardcoded `Licensed NE #[PLACEHOLDER]` string in:
- `src/components/sections/ContactForm.tsx` (~line 287)
- `src/components/sections/LeadForm.tsx` (~line 274)

Replace `[PLACEHOLDER]` with the real license number from NE_LICENSE_NUMBER.
Commit: `fix(launch): replace hardcoded license number in form components`

### Task C: Update About Page Founder Content
- `src/app/(marketing)/about/page.tsx` lines 22, 64, 68, 80:
  - Replace founding year, founder names, founding neighborhood
- `src/components/sections/AboutHero.tsx` line 92:
  - Replace founding year in micro-trust line
- Commit: `feat(launch): fill About page founder and founding year content`

### Task D: Replace Testimonials
In `src/content/testimonials.ts`, replace all 6 placeholder entries with verbatim real reviews.
Set `isPlaceholder: false` on each.
Format: `{ id, name, location, rating, text, service, isPlaceholder: false }`
Commit: `feat(launch): replace placeholder testimonials with real reviews`

### Task E: Replace Hero Images
Copy the provided real project photos to `/public/images/` with descriptive webp filenames.
Update file paths and alt text in:
- `src/content/services.ts` lines 87–88, 140–141, 192–193, 253–254
- `src/components/sections/AboutHero.tsx` line 6
Commit: `feat(launch): replace stock hero images with real Raptor project photos`

### Task F: Fill FAQ Placeholders
In `src/content/faqs.ts` lines 107, 131, 199:
- Replace siding cost range with SIDING_COST_RANGE
- Replace LP SmartSide warranty with LP_WARRANTY_YEARS
- Replace emergency tarping cost with EMERGENCY_TARPING_COST
Commit: `feat(launch): fill FAQ pricing and warranty placeholders`

### Task G: Handle Financing Section
If FINANCING_MONTHLY is a real value:
- Update `src/components/sections/FinancingCallout.tsx` line 16 with the real monthly payment
If FINANCING_MONTHLY is "NONE":
- Remove or hide the FinancingCallout section from the homepage
Commit: `feat(launch): configure financing callout`

### Task H: Revert Demo Stubs (Forms Go Live)
Per HANDOFF.md Section 4:
- Remove the demo stub block from `src/components/sections/ContactForm.tsx` (~lines 130–135)
- Remove the demo stub block from `src/components/sections/LeadForm.tsx` (~lines 51–54)
- Replace each with the `if (data.success) / else` branch documented in HANDOFF.md
Commit: `fix(launch): revert demo stubs — forms now deliver leads via Resend`

### Task I: Unlock AggregateRating Schema (if review data provided)
If GOOGLE_REVIEW_COUNT and GOOGLE_REVIEW_RATING are real values:
- Uncomment the AggregateRating block in `src/lib/schema.tsx` lines 85–90
- Update the check-no-review-schema.mjs guard script to expect the AggregateRating (or remove the guard entirely)
Commit: `feat(launch): enable AggregateRating schema with real review data`

### Task J: Handle 2-Hour Promise Copy
If TWO_HOUR_PROMISE_CONFIRMED is "YES": no copy changes needed.
If TWO_HOUR_PROMISE_CONFIRMED is "NO - soften to [alternative]":
- Update `src/components/sections/FinalCTA.tsx` default subheading
- Update `src/app/(marketing)/contact/page.tsx` subhead
Commit: `fix(launch): adjust 2-hour response promise copy per Raptor input`

### Task K: Push and Verify
Run `npm run build` to verify no TypeScript errors.
Run `npm run lint` to verify lint clean.
Run `npm run check:schema` to verify schema guard passes.
Push to master. Confirm Vercel deploy succeeds.

After deploy, verify on the live URL:
- Forms actually send to NOTIFICATION_EMAIL
- Real testimonials display without amber placeholder banners
- Certifications section shows correct manufacturer programs (or is hidden)
- AggregateRating schema passes Rich Results Test (if enabled)
````

---

*Generated: 2026-04-15*  
*Placeholder count at time of writing: 38 (all requiring Raptor input)*  
*Demo stub pattern: void data + unconditional setStatus — see Section 4 for revert*
