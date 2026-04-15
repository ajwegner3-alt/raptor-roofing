---
phase: 05-about-contact
plan: 03
subsystem: ui
tags: [nextjs, react, tailwind, seo, schema-dts, breadcrumb, contact-page, google-maps, recaptcha-v3, email-pipeline, gmail-smtp]

# Dependency graph
requires:
  - phase: 05-about-contact
    plan: 02
    provides: ContactForm Client Component, /api/contact POST handler, Gmail SMTP email-sender tool

provides:
  - /contact page (Server Component, 4 visible sections + compact hero)
  - BreadcrumbList JSON-LD on /contact
  - Static Google Maps iframe embed (no API key, graceful city/zip fallback)
  - Enriched NAP block with tap-to-call, placeholder-labeled address, hours, get-directions link
  - Service area pill tags (all 8 cities, unlinked)
  - End-to-end Gmail SMTP delivery verified — real submission landed in Gmail Primary on first try

affects:
  - Phase 7 (deploy): All 7 Phase 5 env vars must be migrated to Vercel Project Settings before deploy
  - Phase 8 (handoff): 1x [PLACEHOLDER] tag on /contact must be swapped (street address)
  - Phase 6 sitemap (06-01): Must include /contact in app/sitemap.ts

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Google Maps iframe embed (no API key) using maps.google.com/maps?q= URL with output=embed
    - buildMapEmbedUrl() helper degrades to city/zip when address.street contains "placeholder" or starts with "//"
    - Form-above-NAP mobile stacking: ContactForm renders first in DOM (primary conversion path)
    - BreadcrumbList-only JSON-LD on inner pages — Footer owns HomeAndConstructionBusiness globally
    - Compact dark hero strip (not full ServiceHero) for non-service inner pages
    - Hours rendering with h.closed || h.open === '' guard (Sunday is closed: true)

key-files:
  created:
    - src/app/(marketing)/contact/page.tsx
  modified: []

key-decisions:
  - "Form above NAP on mobile — ContactForm renders first in the two-column grid (left on desktop, top on mobile) because the form is the primary conversion path; NAP is secondary"
  - "Map degrades to city/zip when street is placeholder — buildMapEmbedUrl() checks address.street for 'placeholder' or '//' prefix; maps to Omaha, NE 68102 until real street confirmed"
  - "BreadcrumbList only, no LocalBusiness — Footer.tsx already renders HomeAndConstructionBusiness schema globally on every marketing page; duplicating it on /contact would create structured-data ambiguity per RESEARCH.md Pitfall 4. Comment in page.tsx explains for future contributors."
  - "No 'Open now/Closed now' live indicator in hours block — intentionally omitted per anti-chaser no-urgency stance (CONTEXT.md)"
  - "tap-to-call rendered as styled button-like anchor (min-height 56px) exceeding CLAUDE.md 48x48px minimum tap target requirement"
  - "directionsUrl computed inline from siteConfig.address.full — no new field added to siteConfig"

patterns-established:
  - "Compact hero strip (bg-primary-950 py-14 lg:py-20) for inner pages that don't need a full ServiceHero"
  - "Enriched NAP block pattern: Phone CTA → Address (PLACEHOLDER label + address + get-directions) → Hours (closed guard)"

# Metrics
duration: ~10min (Task 1 build) + checkpoint pause (Task 2 human test)
completed: 2026-04-15
---

# Phase 5 Plan 03: Contact Page Summary

**Contact page with ContactForm, enriched NAP, static Google Maps iframe, service area pill tags, BreadcrumbList-only JSON-LD — end-to-end Gmail delivery verified in Gmail Primary on first try (approved 2026-04-15)**

## Performance

- **Duration:** ~10 min (automated build) + human checkpoint (email test)
- **Completed:** 2026-04-15
- **Tasks:** 2 (1 auto + 1 human-verify checkpoint)
- **Files modified:** 1 (created)

## Accomplishments

- Built `/contact` Server Component at `src/app/(marketing)/contact/page.tsx` (244 lines) composing:
  - Compact dark hero strip with H1 "Get a Free Estimate from Raptor Roofing"
  - Two-column main section: `<ContactForm />` (left/top on mobile) + enriched NAP block (right/below on mobile)
  - Static Google Maps iframe — no API key, `loading="lazy"`, accessible `title` attribute, city/zip fallback when street is placeholder
  - Service area pill tags for all 8 cities from `serviceAreas`, unlinked, with "Plus surrounding Douglas and Sarpy County communities" note
  - BreadcrumbList JSON-LD (Home → Contact) via `breadcrumbSchema()` + `<JsonLd>`
- Hard gates all passing: zero `localBusinessSchema`/`LocalBusiness` matches in page file; PLACEHOLDER tag visible; map iframe lazy + accessible; `ContactForm` imported and used; `buildMetadata()` + `breadcrumbSchema()` called
- **End-to-end email test passed on first try** — Andrew submitted the form at http://localhost:3000/contact, email arrived in Gmail Primary inbox within seconds. Andrew confirmed: "approved" (2026-04-15)

## Task Commits

1. **Task 1: Build /contact page Server Component** — `acd5256` (feat)
2. **Task 2: Manual end-to-end email submission test** — Human checkpoint. Passed: email landed in Gmail Primary on first try. No drag-from-Spam required.

**Plan metadata:** committed below

## Files Created/Modified

- `src/app/(marketing)/contact/page.tsx` — Contact page Server Component, 244 lines:
  - `export const metadata` via `buildMetadata({ path: '/contact', useAbsoluteTitle: true })`
  - `buildMapEmbedUrl()` helper function — Google Maps no-API embed URL, graceful city/zip degradation
  - Compact hero strip
  - Two-column form + NAP grid (mobile-first: form above NAP)
  - Google Maps `<iframe>` with `loading="lazy"` + `title="Raptor Roofing location map"`
  - Service area pill `<ul>` iterating all `serviceAreas`
  - `<JsonLd data={breadcrumbSchema([...])}>` — BreadcrumbList only

## Decisions Made

- **Form stacks above NAP on mobile.** The `<ContactForm />` div is first in the DOM grid. CSS `grid-cols-1` on mobile means it renders above the NAP block, placing the primary conversion action (form submit) before the secondary information block (phone/address/hours). On desktop they render side-by-side.
- **Map degrades to city/zip when street is placeholder.** `buildMapEmbedUrl()` inspects `address.street` for the string `"placeholder"` (case-insensitive) or a `//` prefix (the convention used in `site.ts` for placeholder values). When triggered, the query is `"Omaha, NE 68102"` — a valid map center without revealing a non-existent street address.
- **No LocalBusiness JSON-LD on /contact.** Footer.tsx calls `localBusinessSchema()` globally on every marketing layout page. Adding it here would create a duplicate structured-data block that Google's Rich Results parser treats as ambiguous. The pattern established in /about (BreadcrumbList-only) is carried forward consistently.
- **No "Open now/Closed now" indicator.** Intentionally omitted per CONTEXT.md anti-chaser no-urgency stance. Hours are shown as a static schedule only.
- **tap-to-call is styled as an accent button (min-height 56px).** Exceeds the 48x48px minimum tap target in CLAUDE.md. Uses `href="tel:4028851462"` with aria-label for screen readers.
- **directionsUrl computed inline** from `siteConfig.address.full` using `encodeURIComponent`. No new field added to `siteConfig`. Opens Google Maps directions in a new tab.

## End-to-End Email Test Result

**Status: PASSED — Gmail Primary, first try**

- Test performed: 2026-04-15
- Form URL tested: http://localhost:3000/contact
- Submission path: ContactForm → POST /api/contact → reCAPTCHA v3 verify (score >= 0.3) → nodemailer Gmail SMTP → `NOTIFICATION_EMAIL` inbox
- API response observed: `{ "success": true, "messageId": "..." }`
- Email destination: Andrew's Gmail Primary inbox
- Time to arrival: under 30 seconds
- Spam/Promotions drag required: No — landed in Primary on first try
- Andrew's confirmation: "approved" (no qualifications)

CNT-03 transitive verification (LeadForm on service pages via same /api/contact backend) was also optionally testable per the checkpoint instructions. The core end-to-end test is the hard gate; CNT-03 is exercised by the same route.

## Requirements Covered

| Req ID | Description | Status |
|--------|-------------|--------|
| CNT-01 | /contact page exists and renders | SATISFIED |
| CNT-06 | Enriched NAP block with tap-to-call, address, hours, directions | SATISFIED |
| CNT-07 | Static Google Maps iframe (no API key) | SATISFIED |
| CNT-08 | Service area cities displayed on /contact | SATISFIED |
| CNT-03 | LeadForm + /api/contact pipeline delivers email (transitive via same backend) | SATISFIED (backend verified end-to-end) |

## Deviations from Plan

None — plan executed exactly as written.

The `breadcrumbSchema()` call uses `{ name, href }` object shape (matching the existing schema.tsx signature discovered at plan time) rather than the `{ name, url }` shape shown in the plan pseudocode. This is not a deviation — it's adapting to the existing function signature, as the plan instructed: "Adjust to match the existing `<JsonLd>` rendering pattern."

## [PLACEHOLDER] Tags Phase 8 Must Swap

The following literal `[PLACEHOLDER: ...]` string appears in the shipped file and must be replaced before public launch:

| File | Tag | Section | Notes |
|------|-----|---------|-------|
| `src/app/(marketing)/contact/page.tsx` | `[PLACEHOLDER: confirm street address with Raptor]` | NAP block, above `<address>` | Rendered in amber text (`text-amber-500`) so it's visually obvious in the browser. Replace the entire `<p>` element once street address is confirmed with client. |

Grep command for Phase 8 sweep:
```bash
grep -n "PLACEHOLDER" "src/app/(marketing)/contact/page.tsx"
```

Combined Phase 5 PLACEHOLDER sweep (all three files):
```bash
grep -rn "PLACEHOLDER" src/components/sections/AboutHero.tsx "src/app/(marketing)/about/page.tsx" "src/app/(marketing)/contact/page.tsx"
```

## Env Vars: Phase 7 Vercel Migration Required

All seven env vars used by the Phase 5 email pipeline are currently in `.env.local` only. They **must be added to Vercel Project Settings → Environment Variables** before the Phase 7 deploy or form submissions on the live site will silently fail.

| Variable | Visibility | Required | Notes |
|----------|-----------|----------|-------|
| `EMAIL_PROVIDER` | Server-only | Yes | Set to `gmail` for now. Change to `resend` post-launch for better deliverability (single env var swap, no code changes). |
| `GMAIL_USER` | Server-only | Yes | The Gmail address used as SMTP sender. Must be the account the App Password was created for. |
| `GMAIL_APP_PASSWORD` | Server-only | Yes | 16-char Google App Password. Treat as a secret — never expose client-side. Regenerate at myaccount.google.com/apppasswords if revoked. |
| `GMAIL_FROM_NAME` | Server-only | Yes | Display name in the From field (e.g., `Raptor Roofing Website`). |
| `NOTIFICATION_EMAIL` | Server-only | Yes | Email address where lead notifications are delivered. Currently Andrew's Gmail; update to Raptor's address when client signs. |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | **Public — embedded in JS bundle** | Yes | `NEXT_PUBLIC_` prefix means Next.js inlines this value into client-side JS at build time. It is intentionally public (Google's design) — bots need the site key to generate tokens; Google's server validates the token against the secret key. |
| `RECAPTCHA_SECRET_KEY` | Server-only | Yes | Never expose client-side. Used only in `/api/contact` route to verify reCAPTCHA tokens against Google's servers. |

**Important:** `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set at **build time**. If you change it after a deploy, you must redeploy (not just update env vars) for the new value to take effect in client-side JS. The other six server-only vars take effect on the next cold start without a rebuild.

## User Setup Required

None for this plan — Andrew had already populated `.env.local` with all Phase 5 env vars before the Task 2 checkpoint (required for the Gmail App Password and reCAPTCHA keys to be present at test time).

For Phase 7 deploy: See "Env Vars: Phase 7 Vercel Migration Required" table above.

## Next Phase Readiness

- Phase 5 is **COMPLETE** — /about, /contact, and the full email pipeline are live and verified end-to-end
- Phase 6 (Technical SEO) is the next phase: `app/sitemap.ts`, `app/robots.ts`, and canonical URL infrastructure
  - Phase 6 sitemap must include `/contact` route (currently missing from the sitemap since sitemap.ts doesn't exist yet)
- Phase 7 (Deploy): Migrate all 7 env vars from `.env.local` to Vercel Project Settings before running `vercel --prod`
- Phase 8 (Handoff): 1x PLACEHOLDER on /contact + 4x PLACEHOLDER on /about + AboutHero must be resolved with real client data

---
*Phase: 05-about-contact*
*Completed: 2026-04-15*
