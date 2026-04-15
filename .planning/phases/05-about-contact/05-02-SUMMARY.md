---
phase: 05-about-contact
plan: 02
subsystem: api
tags: [nodemailer, gmail-smtp, recaptcha-v3, react-google-recaptcha-v3, resend, email, forms, api-route, next-app-router]

# Dependency graph
requires:
  - phase: 03-homepage
    provides: LeadForm component with PHASE 5 TODO stub that this plan replaced
  - phase: 04-service-pages
    provides: Service pages that render LeadForm
provides:
  - src/lib/email/ — full @nsi/email-sender tool (nodemailer Gmail SMTP + Resend, 4 templates)
  - /api/contact POST handler — Node.js runtime, field validation, reCAPTCHA v3 verify, Gmail SMTP send
  - ContactForm Client Component — self-wrapped in GoogleReCaptchaProvider, full state machine
  - LeadForm upgraded — real fetch POST to /api/contact (no reCAPTCHA, intentional)
affects:
  - 05-03-contact-page (uses ContactForm, end-to-end Gmail test)
  - 05-01-about-page (may use siteConfig patterns)
  - future phases using email delivery

# Tech tracking
tech-stack:
  added:
    - nodemailer@^8.0.5 (Gmail SMTP transport)
    - resend@^6.11.0 (Resend provider, kept for post-launch swap)
    - "@types/nodemailer@^8.0.0" (TypeScript types for nodemailer)
    - react-google-recaptcha-v3 (reCAPTCHA v3 provider + hook)
  patterns:
    - Node.js runtime declaration (export const runtime = 'nodejs') mandatory for nodemailer routes
    - Email tool copied wholesale from canonical tool — no forking, fix at source first
    - reCAPTCHA provider wraps only ContactForm (not layout) — per-page script loading
    - LeadForm intentionally omits reCAPTCHA — service pages must not load reCAPTCHA script
    - sendEmail() never wrapped in try/catch — email-sender handles errors internally
    - Single env var flip (EMAIL_PROVIDER=resend) enables post-launch Resend upgrade, no code changes

key-files:
  created:
    - src/lib/email/index.ts
    - src/lib/email/types.ts
    - src/lib/email/utils.ts
    - src/lib/email/providers/gmail.ts
    - src/lib/email/providers/resend.ts
    - src/lib/email/templates/base.ts
    - src/lib/email/templates/notification.ts
    - src/lib/email/templates/welcome.ts
    - src/lib/email/templates/lead-magnet.ts
    - src/app/api/contact/route.ts
    - src/components/sections/ContactForm.tsx
    - .env.local.example
  modified:
    - src/components/sections/LeadForm.tsx
    - package.json
    - package-lock.json

key-decisions:
  - "Node.js runtime REQUIRED in /api/contact — nodemailer uses net/tls which are Node builtins unavailable on Edge"
  - "reCAPTCHA score threshold 0.3 (permissive) — minimizes false positives on roofing form, per CONTEXT.md"
  - "LeadForm has NO reCAPTCHA — service pages/homepage must not load the 35KB reCAPTCHA script + badge"
  - "ContactForm wraps itself in GoogleReCaptchaProvider — reCAPTCHA only loads on /contact page"
  - "Resend provider kept in src/lib/email/ — single env var swap enables post-launch upgrade"
  - ".env.local.example force-added to git (gitignore has .env* glob) — documentation for Andrew"

patterns-established:
  - "API route runtime lock: first export after imports in any nodemailer route must be export const runtime = 'nodejs'"
  - "Error card pattern: role=alert + tel: link + Try again button for all forms on this site"
  - "Success card pattern: role=status aria-live=polite + phone call CTA for all forms on this site"

# Metrics
duration: 7min
completed: 2026-04-15
---

# Phase 5 Plan 02: Email Backend Summary

**Gmail SMTP form backend via nodemailer — /api/contact Node.js route with reCAPTCHA v3, ContactForm Client Component, and upgraded LeadForm replacing PHASE 5 TODO stub**

## Performance

- **Duration:** 7 min
- **Started:** 2026-04-15T12:35:37Z
- **Completed:** 2026-04-15T12:42:18Z
- **Tasks:** 4
- **Files modified:** 13 (12 created, 1 modified)

## Accomplishments

- Copied @nsi/email-sender wholesale into src/lib/email/ (9 files: index, types, utils, 2 providers, 4 templates)
- Built /api/contact POST handler with Node.js runtime lock, field validation, reCAPTCHA v3 verify (score >= 0.3), Gmail SMTP delivery, structured JSON responses
- Built ContactForm Client Component with full idle/loading/success/error state machine, reCAPTCHA v3, accessible fields (aria-invalid/aria-describedby/role), self-wrapping GoogleReCaptchaProvider
- Upgraded LeadForm PHASE 5 TODO stub to real async fetch POST — loading/error states, error card with tel: fallback, intentionally no reCAPTCHA

## Task Commits

Each task was committed atomically:

1. **Task 1: Copy email-sender tool + install deps** — `503f81c` (chore)
2. **Task 2: Build /api/contact route handler** — `290ee2a` (feat)
3. **Task 3: Build ContactForm Client Component** — `a166a82` (feat)
4. **Task 4: Upgrade LeadForm stub to fetch POST** — `ac20bf2` (feat)

**Plan metadata:** (docs commit pending)

## Files Created/Modified

- `src/lib/email/index.ts` — sendEmail() quick-send + createEmailClient() factory + templates bundle
- `src/lib/email/types.ts` — EmailOptions, EmailResult, EmailClient, EmailClientConfig interfaces
- `src/lib/email/utils.ts` — escapeHtml(), stripHtml() utilities
- `src/lib/email/providers/gmail.ts` — Nodemailer Gmail SMTP transport
- `src/lib/email/providers/resend.ts` — Resend SDK provider (kept for post-launch swap)
- `src/lib/email/templates/base.ts` — Base branded email layout (header/content/footer shell)
- `src/lib/email/templates/notification.ts` — Admin notification template (key-value table) — used by /api/contact
- `src/lib/email/templates/welcome.ts` — Welcome/confirmation template
- `src/lib/email/templates/lead-magnet.ts` — Lead magnet delivery template
- `src/app/api/contact/route.ts` — POST handler, Node.js runtime, validation, reCAPTCHA, email send
- `src/components/sections/ContactForm.tsx` — Client Component, GoogleReCaptchaProvider, state machine
- `.env.local.example` — All Phase 5 env vars documented (force-committed, gitignore has .env*)
- `src/components/sections/LeadForm.tsx` — MODIFIED: stub replaced with real fetch POST

## Decisions Made

- **Node.js runtime mandatory:** `export const runtime = 'nodejs'` is first export in route.ts after imports. Vercel Edge Runtime lacks `net`/`tls` Node builtins that nodemailer requires — omitting this causes silent runtime failure.
- **reCAPTCHA threshold 0.3:** Permissive score (per CONTEXT.md) to minimize false positives on roofing form. Bots with score < 0.3 are silently failed (no disclosure to user).
- **LeadForm has no reCAPTCHA:** Intentional. Service pages and homepage must not load the 35KB reCAPTCHA JS bundle + visual badge. Only /contact loads reCAPTCHA. /api/contact gracefully skips verify when no token present.
- **ContactForm is self-contained:** Wraps itself in GoogleReCaptchaProvider so the page that renders it doesn't need to know about reCAPTCHA.
- **.env.local.example force-committed:** gitignore has `.env*` glob which caught `.env.local.example`. Used `git add -f` to force-add it since it's documentation Andrew needs in the repo.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

- `.env.local.example` was caught by `.gitignore` (`.env*` glob). Resolved by using `git add -f` to force-add. This is correct behavior — the example file is documentation that belongs in the repo.
- A stale `next build` lock was present from a prior session. Killed node processes before running the verification build.

## User Setup Required

Before the end-to-end test in plan 05-03, Andrew must populate `.env.local` with all Phase 5 env vars. Reference `.env.local.example` at the project root.

### Env Vars to Set in `.env.local`

| Variable | Value | How to Get |
|---|---|---|
| `EMAIL_PROVIDER` | `gmail` | Static value |
| `GMAIL_USER` | your Gmail address | Your Google account email |
| `GMAIL_APP_PASSWORD` | 16-char app password | Google Account → Security → 2-Step Verification → App passwords |
| `GMAIL_FROM_NAME` | `Raptor Roofing Website` | Static value |
| `NOTIFICATION_EMAIL` | your Gmail address | Where leads are delivered (Andrew's inbox until Raptor signs) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Site key from reCAPTCHA console | [recaptcha.google.com/admin/create](https://www.google.com/recaptcha/admin/create) — register v3, add localhost + vercel domain |
| `RECAPTCHA_SECRET_KEY` | Secret key from reCAPTCHA console | Same console, secret key tab |

### Pre-requisites

1. **Gmail App Password**: 2FA must be enabled on your Google account first. Go to `myaccount.google.com/apppasswords`, create a new app password named "Raptor Roofing Website".

2. **reCAPTCHA v3 registration**: Register at `https://www.google.com/recaptcha/admin/create`. Select **reCAPTCHA v3** (NOT v2). Add both `localhost` and `raptor-roofing.vercel.app` (or final domain) as allowed domains.

### Expected Dev Behavior (without env vars)

- POST `/api/contact` with valid payload → `{"success":false,"error":"Server misconfiguration"}` — correct, NOTIFICATION_EMAIL not set
- POST `/api/contact` with invalid payload → 400 with missing field names

This is the expected fallback. The actual end-to-end test is in plan 05-03.

## Next Phase Readiness

- `/api/contact` route is live and ready for end-to-end Gmail testing (plan 05-03)
- `ContactForm` component is ready to be placed on the `/contact` page (plan 05-03)
- `LeadForm` on all service pages + homepage now submits to the real backend
- All 4 service pages + homepage LeadForms will produce Gmail notifications once env vars are set
- CNT-02, CNT-03, CNT-04, CNT-05 are covered by this plan
- CNT-01, CNT-06, CNT-07, CNT-08 belong to plan 05-03

---
*Phase: 05-about-contact*
*Completed: 2026-04-15*
