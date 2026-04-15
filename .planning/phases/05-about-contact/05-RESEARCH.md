# Phase 5: About + Contact — Research

**Researched:** 2026-04-14
**Domain:** Next.js 16 App Router pages, email delivery (Gmail SMTP / nodemailer), reCAPTCHA v3, Google Maps iframe embed
**Confidence:** HIGH (all key findings verified from actual codebase reads and official docs)

---

## Summary

Phase 5 ships two pages: `/about` (static narrative, no form) and `/contact` (live lead form with email delivery). The highest-risk element is the email pipeline — nodemailer + Gmail SMTP running inside a Next.js App Router POST route handler. All implementation decisions were locked in CONTEXT.md. This research documents the exact API surfaces, file trees, component reuse options, and gotchas the planner needs to produce executable task plans.

The `@nsi/email-sender` tool at the canonical path is fully inspected and ready to copy. Its `sendEmail()` and `templates.notification()` functions are well-typed, never throw, and work verbatim with Gmail SMTP. The copy-in approach (vs npm file reference) is confirmed viable and is the correct path.

The existing `LeadForm` component has a `// PHASE 5 TODO` stub in its submit handler — it must be upgraded to a real fetch POST, or a new `ContactForm` component must be introduced that shares LeadForm's visual shell. Given that LeadForm is already embedded in 4 service pages and the homepage, a new `ContactForm` is the safer choice for Phase 5.

**Primary recommendation:** Build a new `ContactForm` Client Component for `/contact` that mirrors LeadForm's visual style but adds real fetch/reCAPTCHA behavior. Then upgrade LeadForm's stub to POST to the same `/api/contact` endpoint, so all forms share the same backend. This keeps service pages unbroken and avoids duplicating the UI structure.

---

## 1. Email-Sender Tool Inspection

### Source File Tree

```
tools-made-by-claude-for-claude/email-sender/
├── README.md
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts              # Main exports + quick-send sendEmail()
    ├── types.ts              # All TypeScript interfaces
    ├── utils.ts              # escapeHtml(), stripHtml()
    ├── providers/
    │   ├── gmail.ts          # nodemailer Gmail SMTP client
    │   └── resend.ts         # Resend API client
    └── templates/
        ├── base.ts           # Branded HTML wrapper (header/footer shell)
        ├── notification.ts   # Admin notification table (what we need)
        ├── welcome.ts        # Welcome/confirmation (not needed Phase 5)
        └── lead-magnet.ts    # Lead magnet delivery (not needed Phase 5)
```

### Exported API Surface (from `src/index.ts`)

```typescript
// Types
export type {
  EmailOptions,
  EmailResult,
  EmailAttachment,
  EmailClient,
  EmailClientConfig,
  EmailProvider,
} from "./types";

// Template option types
export type { BaseTemplateOptions } from "./templates/base";
export type { NotificationTemplateOptions } from "./templates/notification";
export type { WelcomeTemplateOptions } from "./templates/welcome";
export type { LeadMagnetTemplateOptions } from "./templates/lead-magnet";

// Utilities
export { escapeHtml, stripHtml } from "./utils";

// Templates bundle
export const templates = {
  base: baseTemplate,
  leadMagnet: leadMagnetTemplate,
  notification: notificationTemplate,
  welcome: welcomeTemplate,
};

// Client factory (explicit config, no env vars)
export function createEmailClient(config: EmailClientConfig): EmailClient

// Quick-send (auto-detects provider from env vars)
export async function sendEmail(options: EmailOptions): Promise<EmailResult>
```

### `sendEmail()` Signature

```typescript
// Options shape
interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;           // auto-stripped from html if omitted
  from?: string;           // override default "from" address
  replyTo?: string;
  attachments?: EmailAttachment[];
  cc?: string | string[];
  bcc?: string | string[];
}

// Return shape — NEVER throws
interface EmailResult {
  success: boolean;
  messageId?: string;      // Provider message ID on success
  error?: string;          // Error message on failure
}
```

### `templates.notification()` Signature

```typescript
interface NotificationTemplateOptions extends Partial<BaseTemplateOptions> {
  title: string;                                  // H2 heading in the email
  fields: Record<string, string | undefined>;     // Key-value table rows
  note?: string;                                  // Optional footer note
}

// Returns: string (HTML email body)
function notificationTemplate(options: NotificationTemplateOptions): string
```

The `fields` object renders as a striped key-value table. Order of keys is preserved (Object.entries order). A `undefined` value renders as italic "Not provided". Keys named "email" are auto-linked with `mailto:`. No special treatment for phone — displays as plain text.

### Dependencies (must install in raptor-roofing)

```json
// From email-sender/package.json
"dependencies": {
  "nodemailer": "^6.9.0",
  "resend": "^4.0.0"
},
"devDependencies": {
  "@types/nodemailer": "^6.4.0"
}
```

**For raptor-roofing, install:**
```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```
The `resend` package can be skipped for Phase 5 since we are Gmail-only. However, if provider swap is planned (it is, as env var flip in post-launch), install resend too so the compiled code path works without reinstalling: `npm install nodemailer resend && npm install --save-dev @types/nodemailer`.

### Gmail Provider — Env Vars It Reads

From `src/providers/gmail.ts` and `src/index.ts` `getDefaultClient()`:

| Env Var | Required | Description |
|---------|----------|-------------|
| `EMAIL_PROVIDER` | No (defaults to `"resend"`) | Must be set to `"gmail"` |
| `GMAIL_USER` | Yes | Gmail address, e.g. `andrew@gmail.com` |
| `GMAIL_APP_PASSWORD` | Yes | 16-char App Password (`xxxx xxxx xxxx xxxx`) |
| `GMAIL_FROM_NAME` | No (defaults to `"Notification"`) | Display name in From header |

The `NOTIFICATION_EMAIL` env var is not read by the tool itself — the planner must pass it explicitly as `to: process.env.NOTIFICATION_EMAIL!` in the route handler.

### Gmail Provider — How App Password Works

The `gmail.ts` provider calls `nodemailer.createTransport({ service: "gmail", auth: { user, pass: appPassword } })`. The `pass` field is the App Password, not the regular Gmail password. Google generates App Passwords as 16-character strings formatted `xxxx xxxx xxxx xxxx` — spaces are accepted by nodemailer (it strips them).

### Gotchas

**Node.js runtime only.** nodemailer uses Node.js built-ins (`net`, `tls`, `crypto`). It will NOT work on Vercel Edge Runtime. The contact API route MUST declare `export const runtime = 'nodejs'`.

**Singleton client across hot reloads.** The `_defaultClient` module-level variable in `src/index.ts` persists across requests in the same Node.js worker. This is correct behavior — the transporter pool is reused. No issue for production serverless (each cold start creates a new client). In dev with `next dev`, the singleton resets on HMR.

**No top-level await.** The tool uses no top-level await. Safe to copy into Next.js without `experimental.topLevelAwait`.

**`sendEmail()` never throws.** All errors are caught internally and returned as `{ success: false, error: string }`. The API route does not need a try/catch around `sendEmail()` itself, but should still check `result.success`.

**baseTemplate defaults to NSI branding.** The `brandName`, `tagline`, and `footerHtml` defaults in `base.ts` reference North Star Integrations. The `notification()` call should override these with Raptor Roofing branding when sending lead emails:

```typescript
templates.notification({
  title: "New lead from Raptor Roofing website",
  brandName: "Raptor Roofing",
  tagline: "Omaha's Anti-Chaser Roofer Since 2009",
  headerBg: "#0f1e24",      // primary-950 from brand tokens
  accentColor: "#c8352a",   // accent-600
  footerHtml: "Raptor Roofing &bull; Omaha, NE &bull; (402) 885-1462",
  fields: {
    Name: name,
    Phone: phone,
    Service: service,
    ZIP: zip,
    Submitted: new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }),
  },
})
```

---

## 2. Copy-In vs npm Package

**Decision: Copy `src/` into `raptor-roofing/src/lib/email/`.**

The tool's own README documents this under "Using in Next.js Server Actions":
> "Copy the `src/` folder into your Next.js project (e.g., `src/lib/email/`) and import: `import { sendEmail, templates } from '@/lib/email'`"

**Why copy-in is correct here:**
- No npm package to install — zero lockfile churn
- Avoids `file:../../../` relative path resolution issues in TypeScript path aliases and Vercel builds
- The copied code is fully self-contained (no peer deps beyond nodemailer)
- Edits to the canonical tool don't accidentally break raptor-roofing
- The README explicitly recommends this pattern for Next.js

**Copy procedure:**
```bash
# From raptor-roofing project root:
mkdir -p src/lib/email
cp -r "C:/Users/andre/OneDrive - Creighton University/Desktop/Claude-Code-Projects/tools-made-by-claude-for-claude/email-sender/src/." src/lib/email/
```

After copying, the import path in the route handler is:
```typescript
import { sendEmail, templates } from "@/lib/email";
```

The `@/lib/email` path resolves to `src/lib/email/index.ts` via the existing `tsconfig.json` path alias `"@/*": ["./src/*"]`.

**One TypeScript gotcha:** The copied `src/providers/resend.ts` imports from the `resend` package. If `resend` is not installed, TypeScript will complain even if the code path is never reached in Gmail mode. Install `resend` (or add it to the unused-but-present dependencies) to avoid type errors. Alternatively, the planner can choose to delete `src/lib/email/providers/resend.ts` and remove its reference from `src/lib/email/index.ts` if the upgrade path is not a concern — but given CONTEXT.md says provider swap is a post-launch option, keeping resend in is cleaner.

---

## 3. Next.js 16 App Router API Route Shape

**Confirmed from official Next.js 16.2.3 docs (fetched live).**

### Exact File Path
```
src/app/api/contact/route.ts
```

No `(marketing)` route group needed — API routes live at `src/app/api/` directly.

### Runtime Declaration (REQUIRED for nodemailer)
```typescript
// MUST be first export in the file
export const runtime = 'nodejs';
```

Without this, Next.js may deploy the route to Edge Runtime on Vercel, which does not support Node.js built-ins (`net`, `tls`) that nodemailer requires. Default runtime behavior in Next.js 16 is Node.js for route handlers, but declaring it explicitly is defensive and required per project safety protocol.

### POST Handler Pattern

```typescript
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Read JSON body
  const body = await request.json();

  // ... validation and email logic ...

  // Return JSON response
  return Response.json({ success: true, messageId: "..." }, { status: 200 });
  // OR on error:
  return Response.json({ success: false, error: "..." }, { status: 500 });
}
```

### Reading JSON Body
```typescript
const body = await request.json();
// Destructure expected fields:
const { name, phone, service, zip, recaptchaToken } = body as {
  name: string;
  phone: string;
  service: string;
  zip: string;
  recaptchaToken: string;
};
```

### Returning Structured JSON
```typescript
// Success
return Response.json({ success: true, messageId: result.messageId }, { status: 200 });

// Validation error (400)
return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });

// reCAPTCHA reject (200 not 403 — client shows same fail-loud card either way)
return Response.json({ success: false, error: "Verification failed" }, { status: 200 });

// Email send failure (200 not 500 — client shows fail-loud with phone fallback)
return Response.json({ success: false, error: result.error }, { status: 200 });
```

**Note on status codes:** Per CONTEXT.md, the client shows the same "fail loud" card regardless of why the server returned `success: false`. Using 200 for reCAPTCHA rejects and email failures keeps the client logic simple — it only checks `result.success`, not the HTTP status.

### Zod Validation (recommended)
Zod is not currently installed. The planner may either install it or use manual validation. Manual validation is simpler for 4 fields:

```typescript
// Manual validation (no zod dependency needed)
const missing = [];
if (!name?.trim()) missing.push("name");
if (!phone?.replace(/\D/g, "").match(/^\d{10}$/)) missing.push("phone");
if (!service) missing.push("service");
if (!zip?.match(/^\d{5}$/)) missing.push("zip");
if (!recaptchaToken) missing.push("recaptchaToken");

if (missing.length > 0) {
  return Response.json({ success: false, error: `Missing: ${missing.join(", ")}` }, { status: 400 });
}
```

---

## 4. reCAPTCHA v3 Integration

### Library Recommendation: `react-google-recaptcha-v3`

**Confidence: HIGH** — confirmed by npm registry, GitHub project page, and multiple App Router examples.

**Current version:** 1.10.1 (last release December 2022 per GitHub; actively maintained for bug fixes, API stable)

**Install:**
```bash
npm install react-google-recaptcha-v3
```

**Why not `next-recaptcha-v3`:** Lower adoption, less documentation. The `react-google-recaptcha-v3` package has 200k+ weekly downloads and is the de facto standard.

**Why not `@next/third-parties`:** Does not support reCAPTCHA v3 as of April 2026.

**Why not raw `grecaptcha` script:** Requires manual script injection and window object typing. More boilerplate for no benefit in a TypeScript Next.js project.

### Provider Setup

The provider must wrap the component that uses `useGoogleReCaptcha`. Because the provider uses a script loader, it must be a Client Component or live inside a Client Component wrapper.

**Option A (recommended): Wrap only ContactForm in the provider**
```tsx
// src/components/sections/ContactForm.tsx
"use client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export function ContactFormWrapper() {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
      <ContactFormInner />
    </GoogleReCaptchaProvider>
  );
}
```

**Option B:** Hoist the provider to the marketing layout. This makes reCAPTCHA load on every page, which adds ~35KB of JS to pages that don't need it. Not recommended for this project.

Go with Option A — provider wraps only the ContactForm on the `/contact` page.

### Getting a Token (Client Side)

```typescript
"use client";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useCallback } from "react";

function ContactFormInner() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!executeRecaptcha) return; // guard: script not loaded yet

    const token = await executeRecaptcha("contact_form");
    // ... POST to /api/contact with token
  }, [executeRecaptcha]);
}
```

**Important:** Per the library docs, avoid creating the callback as an inline function to prevent re-verification on every render. Use `useCallback` with `executeRecaptcha` as a dependency.

### Server-Side Verification (in the API route)

```typescript
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secret}&response=${token}`,
  });
  const data = await res.json() as { success: boolean; score: number; action: string };
  // Permissive threshold per CONTEXT.md: reject below 0.3
  return data.success && data.score >= 0.3;
}
```

Google's siteverify response shape:
```json
{
  "success": true,
  "score": 0.9,
  "action": "contact_form",
  "challenge_ts": "2026-04-14T...",
  "hostname": "localhost"
}
```

**Score threshold per CONTEXT.md is 0.3** (permissive, to avoid losing real leads). If `data.score < 0.3`, return `{ success: false }` to the client — the fail-loud error card appears. Do NOT disclose to the user that they failed a bot check.

### Env Vars for reCAPTCHA

| Var | Scope | Description |
|-----|-------|-------------|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Public (client) | reCAPTCHA v3 site key from console.google.com |
| `RECAPTCHA_SECRET_KEY` | Secret (server only) | reCAPTCHA v3 secret key, never exposed to client |

**Note:** `NEXT_PUBLIC_` prefix is mandatory for the site key — it is embedded in the client bundle. The secret key must NOT have `NEXT_PUBLIC_` — it is only accessed in the API route.

---

## 5. LeadForm Component Analysis

**File:** `src/components/sections/LeadForm.tsx`
**Type:** `"use client"` (Client Component)
**Current submit behavior:** STUB — `console.log()` only, then sets status to `"success"`.

```typescript
function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const v = validate();
  setErrors(v);
  if (Object.keys(v).length > 0) return;

  // PHASE 5 TODO: replace with fetch() to POST handler (n8n webhook or Formspree)
  console.log("[Phase 3 stub] lead form data:", { name, phone, service, zip });
  setStatus("success");
}
```

**State management:** `useState` for each field + `errors` object + `status` enum (`"idle" | "success"`). Does NOT yet have `"loading"` or `"error"` status states.

**Success card:** Already implemented — shows "Thanks, {name}! We'll call you within 2 hours..." with a tel: CTA button.

**Error card:** NOT implemented — the current status enum only has `"idle"` and `"success"`. An `"error"` state and its card need to be added.

**Loading state:** NOT implemented — no spinner, no button disable during submit.

**reCAPTCHA:** NOT integrated.

### Recommended Strategy: New `ContactForm` + Upgrade `LeadForm`

The Contact page (plan 05-02) needs all the following that LeadForm lacks: real fetch POST, loading/error states, reCAPTCHA token, success card with the name from response, fail-loud error card with phone fallback.

**Two options:**

**Option A: Extend LeadForm in place**
- Adds `"loading" | "error"` to the Status type
- Adds reCAPTCHA provider wrapping around uses
- Problem: LeadForm is embedded in ServiceHero on 4 service pages. Adding reCAPTCHA provider to ServiceHero means reCAPTCHA loads on every service page — 35KB JS overhead, and reCAPTCHA badge appears on all pages. Not ideal.

**Option B (recommended): New `ContactForm` component + wire up LeadForm to same endpoint**
- Create `src/components/sections/ContactForm.tsx` as a new Client Component with full behavior (fetch, loading, error, reCAPTCHA, success/fail cards)
- Wrap it in `GoogleReCaptchaProvider` inside the `/contact` page only
- LeadForm still submits but its stub is upgraded to a real fetch POST to `/api/contact` (no token — reCAPTCHA v3 score of 0 for no-token should fail gracefully, or the API can skip reCAPTCHA for LeadForm submits using a different field)
- Alternative simpler approach: LeadForm adds a fetch POST but no reCAPTCHA (LeadForm submits route to the same `/api/contact` with `recaptchaToken: "SKIP"` or the API detects absence of token and still sends the email at a lower trust level)

**Best approach:** Build `ContactForm` with full reCAPTCHA integration. Upgrade `LeadForm` to fetch POST to `/api/contact` without reCAPTCHA (service pages are embedded-form submissions — the reCAPTCHA badge on every service page is undesirable). The API route handles missing `recaptchaToken` gracefully by skipping the score check (not rejecting). This keeps service pages lightweight and `/contact` fully protected.

**Visual sharing:** `ContactForm` can share the same Tailwind class strings as `LeadForm` since both use the same `@theme` tokens. No shared component abstraction is needed — the classes are identical and both files are small. Simply duplicate the field markup and adjust the submit handler.

### Service Page Impact Assessment

The 4 service pages (`/services/roofing`, `/services/siding`, `/services/gutters`, `/services/emergency-tarping`) each embed `<LeadForm>` via `<ServiceHero>` → `<LeadForm defaultService={service.slug} />`. When LeadForm's stub is upgraded to fetch POST, service page forms will also start submitting to the API and sending emails. This is correct behavior — the planner should treat this as expected.

---

## 6. Google Maps Iframe Embed

### URL Format (No API Key Required)

**Two formats work without an API key:**

**Format A — "share/embed" URL (copy from Google Maps UI):**
```
https://www.google.com/maps/embed?pb=!1m18!1m12!...
```
This URL is generated by Google Maps "Share → Embed a map" dialog. It contains an encoded `pb` parameter. This requires visiting Google Maps to generate the URL for the specific address. The generated `pb` URL is stable for a given location.

**Format B — Query string URL (constructable from address string):**
```
https://maps.google.com/maps?q=ENCODED+ADDRESS&output=embed
```
Example for a placeholder Omaha address:
```
https://maps.google.com/maps?q=Omaha,+NE+68102&output=embed
```
This format works without visiting the UI and can be constructed from `siteConfig.address`. **Use this format until the real street address is confirmed.**

**Format C — `maps/embed/v1/place` (REQUIRES API KEY — do not use):**
```
https://www.google.com/maps/embed/v1/place?key=API_KEY&q=...
```

### Recommended Implementation

Since `siteConfig.address.street` is a placeholder (`"// PLACEHOLDER: confirm street address with Raptor"`), the Contact page should use Format B with the city+zip as the query until the real address is set:

```tsx
// Builds map embed URL from site config — degrades gracefully to city pin
function buildMapEmbedUrl(address: typeof siteConfig.address): string {
  const hasRealStreet = !address.street.startsWith("//");
  const q = hasRealStreet
    ? `${address.street}, ${address.city}, ${address.state} ${address.zip}`
    : `${address.city}, ${address.state} ${address.zip}`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
}
```

### Accessibility Requirements

```tsx
<iframe
  src={buildMapEmbedUrl(siteConfig.address)}
  title="Raptor Roofing location map"  // required for screen readers
  loading="lazy"
  width="100%"
  height="300"
  style={{ border: 0 }}
  allowFullScreen
  referrerPolicy="no-referrer-when-downgrade"
/>
```

**`title` attribute is mandatory** — without it, the iframe has no accessible name. `loading="lazy"` defers the iframe until it enters the viewport, improving LCP.

---

## 7. `site.ts` Address and Hours Shape

**Confirmed from reading the actual file.**

### Current Shape

```typescript
address: {
  street: "// PLACEHOLDER: confirm street address with Raptor",
  city: "Omaha",
  state: "NE",
  zip: "68102",       // PLACEHOLDER: confirm ZIP with Raptor
  full: "Omaha, NE", // PLACEHOLDER: update with full address after confirmation
}

hours: BusinessHours[]  // Array of { day, open, close, closed? }
// Mon–Sat: 7:00 AM–7:00 PM
// Sun: closed: true
```

### Fields the Contact Page NAP Needs

The Contact page needs a "Get Directions" link. This does NOT exist in `site.ts` today. Two options:

**Option A:** Add `getDirectionsUrl` to `SiteConfig` and derive it at build time in `site.ts`:
```typescript
// Add to SiteConfig interface:
getDirectionsUrl: string;

// In siteConfig:
getDirectionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("Omaha, NE 68102")}`,
```

**Option B (simpler):** Build the URL inline in the Contact page component from existing `address` fields. No change to `site.ts`.

**Recommendation:** Option B — no new fields in `site.ts`, no interface change. Build directions URL inline in the Contact page NAP block using `siteConfig.address`. This keeps `site.ts` stable.

```typescript
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteConfig.address.full)}`;
```

### Hours Display

The Contact page hours block should reuse `siteConfig.hours` directly — same as Footer. The Footer's existing rendering pattern is correct:
```tsx
{siteConfig.hours.map((h) => (
  <li key={h.day}>
    <span className="inline-block w-20">{h.day}</span>
    <span>{h.closed || h.open === "" ? "Closed" : `${h.open}–${h.close}`}</span>
  </li>
))}
```

---

## 8. `service-areas.ts` Shape

**Confirmed from reading the actual file.**

The file exports:
```typescript
export interface ServiceArea {
  name: string;
  slug: string;
  county: string;
  zipCodes: string[];
  lat?: number;
  lng?: number;
  isPrimary: boolean;
}

export const serviceAreas: ServiceArea[];     // 8 cities total
export function getPrimaryServiceAreas(): ServiceArea[];  // returns isPrimary === true (6 cities)
export function getServiceAreaBySlug(slug: string): ServiceArea | undefined;
```

The 8 cities: Omaha, Bellevue, Papillion, La Vista, Elkhorn, Millard, Gretna, Ralston.

**For the Contact page pill tag list:** Use `serviceAreas` directly (not `getPrimaryServiceAreas`) to show all 8 cities. The planner can also choose `getPrimaryServiceAreas()` (6 cities) and add "and surrounding areas" — either is defensible. Since pill tags are lightweight, showing all 8 is more thorough.

**No helper needed.** The existing array provides `name` strings directly. The Contact page maps `serviceAreas.map((a) => a.name)` for pill tags.

---

## 9. Env Vars — Full List for Phase 5

### `.env.local` (dev — Andrew sets up before end-to-end test)

```env
# Already exists:
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Add for Phase 5:
EMAIL_PROVIDER=gmail
GMAIL_USER=andrew.wegner.nsi@gmail.com          # or whichever Gmail Andrew uses
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx           # 16-char App Password from Google Security
GMAIL_FROM_NAME=Raptor Roofing Website
NOTIFICATION_EMAIL=andrew.wegner.nsi@gmail.com  # where leads go — Andrew's inbox for now

NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Le...            # from console.cloud.google.com > reCAPTCHA
RECAPTCHA_SECRET_KEY=6Le...                      # secret key, same reCAPTCHA project
```

### Vercel Dashboard (Phase 7, but must document now)

Andrew must add these in Vercel → Project → Settings → Environment Variables, scoped to **Preview** AND **Production**:

| Variable | Scope | Value |
|----------|-------|-------|
| `EMAIL_PROVIDER` | Preview + Production | `gmail` |
| `GMAIL_USER` | Preview + Production | Gmail address |
| `GMAIL_APP_PASSWORD` | Preview + Production | Secret — App Password |
| `GMAIL_FROM_NAME` | Preview + Production | `Raptor Roofing Website` |
| `NOTIFICATION_EMAIL` | Preview + Production | Andrew's Gmail (swap to Raptor inbox post-signing) |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Preview + Production | Public — site key |
| `RECAPTCHA_SECRET_KEY` | Preview + Production | Secret — secret key |

**Setup order matters:**
1. Gmail App Password must exist BEFORE the end-to-end test (manual step in plan 05-03).
2. reCAPTCHA keys can be created in ~2 minutes at https://www.google.com/recaptcha/admin — site key goes in `.env.local` for dev testing first.
3. `NOTIFICATION_EMAIL` can be Andrew's Gmail initially — swap to Raptor's email post-signing (just an env var change in Vercel, no code change).

**SECRETS vs PUBLIC:**
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` — public, embedded in client JS bundle, safe to expose
- `RECAPTCHA_SECRET_KEY` — SECRET, server-only, must never start with `NEXT_PUBLIC_`
- `GMAIL_APP_PASSWORD` — SECRET, server-only

---

## 10. End-to-End Test Strategy

**The hard gate in plan 05-03:** A real test submission must land in Andrew's Gmail Primary inbox before the plan is marked complete.

### Recommended Approach: Manual Verification

1. Start `next dev` locally (or open the Vercel Preview URL after the plan 05-02 deploy)
2. Fill out the Contact form with real data (name, real phone, service, ZIP)
3. Submit the form — observe the success card appear inline
4. Open Gmail → check Primary inbox within 2–3 minutes
5. If it lands in Spam: drag to Primary (this one-time action trains Gmail's filter)
6. Verify subject line contains "New lead from Raptor website"
7. Verify the email body table shows all 4 fields correctly

**Why this is reliable:** The `sendEmail()` return value includes `messageId` on success. The API route returns `{ success: true, messageId: "..." }` to the client. The client can log this in the browser console as a secondary confirmation. If `success: true` but email doesn't arrive → provider-level issue (check spam, check Gmail App Password validity).

**Why not automated read-back via Gmail API:** Would require OAuth2 setup, a Google Cloud project, and significantly more infrastructure. Overkill for a one-time gate check.

**Gmail Primary vs Promotions/Spam:** Gmail delivering from the same `@gmail.com` address to itself (GMAIL_USER === NOTIFICATION_EMAIL, both Andrew's account) should land in Primary by default — Gmail recognizes self-to-self mail. If sending from Andrew's Gmail to a different Gmail inbox, the first delivery may go to Promotions. One drag-to-Primary fixes this permanently.

**HANDOFF.md requirement:** The plan must add a HANDOFF.md note that the Gmail App Password must be rotated if Andrew's Google account security settings change (App Passwords are revoked if 2FA is turned off or the app password is deleted).

---

## 11. Full File Tree — Create vs Modify

### Files to CREATE (new)

```
src/lib/email/                          # copied from email-sender tool
  index.ts
  types.ts
  utils.ts
  providers/
    gmail.ts
    resend.ts
  templates/
    base.ts
    notification.ts
    welcome.ts
    lead-magnet.ts

src/app/api/contact/
  route.ts                              # Next.js App Router POST handler

src/components/sections/
  ContactForm.tsx                       # NEW Client Component with full behavior
  AboutHero.tsx                         # OR reuse ServiceHero (see section 12)

src/app/(marketing)/about/
  page.tsx                              # /about page

src/app/(marketing)/contact/
  page.tsx                              # /contact page
```

### Files to MODIFY (existing)

```
src/components/sections/LeadForm.tsx   # Upgrade stub to real fetch POST
.env.local                             # Add EMAIL_*, RECAPTCHA_* vars
package.json                           # npm install nodemailer (+ resend + @types)
```

### Files NOT touched (by design)

```
src/lib/schema.tsx                     # BreadcrumbList factory already exists
src/lib/metadata.ts                    # buildMetadata() already complete
src/content/site.ts                    # No changes needed for Phase 5
src/content/service-areas.ts           # No changes needed
src/app/(marketing)/layout.tsx         # Header/Footer already wrap /about and /contact automatically
```

**No conflicts with existing work.** The new directories (`about/`, `contact/`, `api/contact/`) do not collide with any existing routes.

---

## 12. About Page Hero Reusability

**`ServiceHero.tsx` is NOT directly reusable for the About page.**

ServiceHero requires a `Service` object as its only prop (`{ service: Service }`). The `Service` type includes `heroImagePath`, `heroImageAlt`, `headline`, `subheadline`, `slug`, `isEmergency`, etc. — all service-specific fields. There is no generic "page hero" variant.

**Also:** ServiceHero always renders `<LeadForm>` in the right column (or the emergency call card). The About page should NOT have a form (per CONTEXT.md: "No lead form on About page").

**Recommendation: Build a new `AboutHero` component** (or compose sections directly without a named hero component).

`AboutHero` is a thin wrapper — it needs:
- The same 5-layer visual stack as ServiceHero (background photo + gradient overlay + noise + content + SVG divider)
- An H1 and subheadline specific to the About page
- A micro-trust line ("Family-Owned Since [year] · No Subcontractors · Omaha's Roofer")
- Single CTA (Call Now — no form, no "Free Estimate" anchor)
- NO right-column form

This is ~100 lines of JSX. It can copy the overlay/noise/divider constants from ServiceHero to maintain visual consistency.

**Alternative:** Compose sections directly in `app/(marketing)/about/page.tsx` without a named hero component. Given the About page is short (1–1.5 screens), this is also valid. The planner should decide based on whether a reusable `AboutHero` makes sense for a future "Team" or "Careers" page.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Gmail SMTP transport | Custom nodemailer wrapper | `@nsi/email-sender` (copy-in) | Already typed, tested, never-throw pattern |
| reCAPTCHA token generation | Raw window.grecaptcha | `react-google-recaptcha-v3` | Handles script loading, TypeScript types, provider pattern |
| reCAPTCHA verification | Custom scoring logic | Google `siteverify` endpoint | authoritative score from Google |
| Email HTML template | Custom HTML string | `templates.notification()` | Already styled, XSS-escaped, striped table |
| BreadcrumbList JSON-LD | Inline schema object | `breadcrumbSchema()` from `@/lib/schema` | Already exists, types from schema-dts |
| Metadata | Raw Next.js Metadata object | `buildMetadata()` from `@/lib/metadata` | Already handles canonical, OG, Twitter consistently |

---

## Common Pitfalls

### Pitfall 1: Edge Runtime with nodemailer
**What goes wrong:** Vercel deploys the API route to Edge Runtime, nodemailer throws at runtime because `net` and `tls` are not available in V8 isolates.
**How to avoid:** Add `export const runtime = 'nodejs';` as the FIRST line of `src/app/api/contact/route.ts`.
**Warning signs:** Build succeeds but form submissions throw "Module not found: Can't resolve 'net'" or similar at runtime.

### Pitfall 2: Gmail App Password Format
**What goes wrong:** Copying the App Password WITH spaces (`xxxx xxxx xxxx xxxx`) into the env var. Some shells or .env parsers mishandle the spaces.
**How to avoid:** Store without spaces in `.env.local`: `GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx`. Nodemailer accepts both, but the no-space version is safer in Vercel's env var UI.
**Alternative:** Wrap in quotes in `.env.local`: `GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"`.

### Pitfall 3: reCAPTCHA Site Key on Wrong Domain
**What goes wrong:** reCAPTCHA site key is registered for `raptor-roofing.vercel.app` but the dev test runs on `localhost`. The token generation fails silently or returns a low score.
**How to avoid:** When creating the reCAPTCHA key in Google Console, add BOTH `localhost` AND the Vercel domain to the allowed domains list.

### Pitfall 4: LocalBusiness Schema Duplication
**What goes wrong:** About page emits another `<JsonLd data={localBusinessSchema()} />`, creating duplicate structured data that confuses Google's Rich Results parser.
**How to avoid:** About page emits ONLY `<JsonLd data={breadcrumbSchema([...])} />`. The LocalBusiness schema is already in Footer which renders on every page via `(marketing)/layout.tsx`.

### Pitfall 5: LeadForm Success State Already Shows "Thanks, {name}"
**What goes wrong:** After wiring up the real API, the `name` variable in LeadForm's success card still works correctly — but if the form submits and the API returns `{ success: true }`, the component must be in the `"success"` state for the card to show. The current stub sets status to `"success"` synchronously. The real implementation must await the fetch and then set `setStatus("success")`.
**How to avoid:** In the fetch upgrade, `setStatus("success")` only inside the `if (result.success)` branch. Set `setStatus("error")` in the else branch (which currently doesn't exist in LeadForm and must be added).

### Pitfall 6: Missing `recaptchaToken` in LeadForm Breaks API Route
**What goes wrong:** The API route expects `recaptchaToken` in the body. LeadForm (on service pages) doesn't send one. If the API route hard-requires the token, all service page form submissions fail.
**How to avoid:** API route handles missing token gracefully — either skips reCAPTCHA check (and still sends the email) or treats missing token as score 0 (always below threshold, always rejects). Since service page forms are also important leads, the recommendation is: if `recaptchaToken` is absent, log a warning but still send the email (trusting that the form UI validation already ran).

### Pitfall 7: `NOTIFICATION_EMAIL` not set
**What goes wrong:** `process.env.NOTIFICATION_EMAIL` is undefined, `sendEmail({ to: undefined! })` sends to undefined address. nodemailer may not throw — it may silently fail or send to no recipient.
**How to avoid:** The API route must validate `NOTIFICATION_EMAIL` is present at startup or within the handler, and return `{ success: false, error: "Server misconfiguration" }` if missing.

---

## Architecture Patterns

### Recommended File Structure for Phase 5 Additions

```
src/
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts              # POST handler, Node runtime
│   └── (marketing)/
│       ├── about/
│       │   └── page.tsx              # Server Component page
│       └── contact/
│           └── page.tsx              # Server Component page
├── components/
│   └── sections/
│       ├── ContactForm.tsx           # "use client" — full form behavior
│       └── AboutHero.tsx             # Server Component (static hero)
└── lib/
    └── email/                        # copied from @nsi/email-sender
        ├── index.ts
        ├── types.ts
        ├── utils.ts
        ├── providers/
        │   ├── gmail.ts
        │   └── resend.ts
        └── templates/
            ├── base.ts
            ├── notification.ts
            ├── welcome.ts
            └── lead-magnet.ts
```

### API Route Pattern

```typescript
// src/app/api/contact/route.ts
export const runtime = 'nodejs';

export async function POST(request: Request) {
  // 1. Parse body
  const { name, phone, service, zip, recaptchaToken } = await request.json();

  // 2. Validate required fields (server-side)
  // ...

  // 3. Verify reCAPTCHA (if token present)
  if (recaptchaToken) {
    const passed = await verifyRecaptcha(recaptchaToken);
    if (!passed) {
      return Response.json({ success: false, error: "Verification failed" });
    }
  }

  // 4. Send email via email-sender
  const html = templates.notification({
    title: "New lead from Raptor Roofing website",
    brandName: "Raptor Roofing",
    // ...branding overrides
    fields: { Name: name, Phone: phone, Service: service, ZIP: zip, Submitted: timestamp },
  });

  const result = await sendEmail({
    to: process.env.NOTIFICATION_EMAIL!,
    subject: `New lead from Raptor website — ${name}`,
    html,
  });

  // 5. Return result to client
  return Response.json({ success: result.success, messageId: result.messageId, error: result.error });
}
```

### ContactForm State Machine

```
idle → (submit) → loading → (API success) → success (card replaces form)
                          → (API failure) → error (card replaces form, phone CTA)
                          → (network error) → error
```

---

## Code Examples

### ContactForm fetch submit (client side)

```typescript
// In handleSubmit, after reCAPTCHA token obtained:
setStatus("loading");
setSubmitButton(false); // disable button

try {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, service, zip, recaptchaToken }),
  });
  const data = await res.json() as { success: boolean; messageId?: string; error?: string };

  if (data.success) {
    setStatus("success");
  } else {
    setStatus("error");
  }
} catch {
  setStatus("error");
} finally {
  setSubmitButton(true); // re-enable button
}
```

### About page JSON-LD (BreadcrumbList only)

```typescript
// src/app/(marketing)/about/page.tsx
import { JsonLd, breadcrumbSchema } from "@/lib/schema";

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
      ])} />
      {/* sections... */}
    </>
  );
}
```

### Contact page JSON-LD (BreadcrumbList only)

```typescript
// src/app/(marketing)/contact/page.tsx
<JsonLd data={breadcrumbSchema([
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
])} />
```

### Service area pill tags

```typescript
import { serviceAreas } from "@/content/service-areas";

// In Contact page JSX:
<div className="flex flex-wrap gap-2 mt-4">
  {serviceAreas.map((area) => (
    <span
      key={area.slug}
      className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 font-body text-sm text-neutral-700"
    >
      {area.name}
    </span>
  ))}
</div>
```

---

## Open Questions

1. **Real Raptor street address**
   - What we know: Placeholder `"// PLACEHOLDER: confirm street address with Raptor"` in `site.ts`
   - What's unclear: The actual address
   - Recommendation: Contact page ships with a `[PLACEHOLDER: confirm street address with Raptor]` label above the map iframe. Plan 05-03 should note this as a Phase 8 handoff item.

2. **Gmail App Password**
   - What we know: Must be created by Andrew before end-to-end test
   - What's unclear: Andrew's Gmail address and whether 2FA is already enabled
   - Recommendation: Plan 05-03 includes a MANUAL STEP block: "Andrew: create Gmail App Password per email-sender README → add to `.env.local` → confirm before running end-to-end test"

3. **reCAPTCHA account creation**
   - What we know: Requires a Google account and ~2 minutes at console.google.com
   - What's unclear: Whether to use Andrew's personal Google account or a project account
   - Recommendation: Use Andrew's account. The reCAPTCHA keys are free and not tied to billing.

4. **Founder name and founding year**
   - What we know: `siteConfig.founding.year = 2009` (already in site.ts). Founder name unknown.
   - Recommendation: About page ships with `[PLACEHOLDER: founding year]` (or just uses `siteConfig.founding.year` — it's already 2009) and `[PLACEHOLDER: founder name]`. Phase 8 handoff swaps these.

---

## Sources

### Primary (HIGH confidence)
- Actual codebase reads: `src/components/sections/LeadForm.tsx`, `ServiceHero.tsx`, `TestimonialCarousel.tsx`, `TrustStrip.tsx`, `Footer.tsx`, `src/lib/schema.tsx`, `src/lib/metadata.ts`, `src/content/site.ts`, `src/content/service-areas.ts`, `src/app/globals.css`, `src/app/(marketing)/page.tsx`, all service page route files
- `tools-made-by-claude-for-claude/email-sender/src/` — all source files read directly
- `tools-made-by-claude-for-claude/email-sender/README.md` — copy-in pattern confirmed
- Next.js official docs (fetched live via WebFetch): `https://nextjs.org/docs/app/api-reference/file-conventions/route` — confirmed `export const runtime = 'nodejs'`, POST handler shape, `request.json()`, `Response.json()`

### Secondary (MEDIUM confidence)
- `react-google-recaptcha-v3` GitHub README — provider/hook API confirmed
- Google reCAPTCHA v3 docs (WebFetch) — siteverify URL and response shape confirmed
- WebSearch cross-referenced: Next.js 16 + nodemailer patterns consistent across multiple sources

### Tertiary (LOW confidence)
- Gmail deliverability to Primary inbox for same-account sends — not verifiable without running the test; based on known Gmail behavior for self-to-self mail

---

## Metadata

**Confidence breakdown:**
- Email-sender tool API surface: HIGH — read from actual source files
- Next.js App Router route shape: HIGH — fetched from official docs
- reCAPTCHA v3 library integration: HIGH — GitHub + npm confirmed
- Google Maps iframe without API key: HIGH — multiple sources agree on `maps.google.com/maps?q=...&output=embed`
- LeadForm component state: HIGH — read from actual file
- ServiceHero reusability for About: HIGH — read from actual file, incompatible type
- Gmail deliverability to Primary: LOW — not testable without running the test

**Research date:** 2026-04-14
**Valid until:** 2026-05-14 (stable stack; reCAPTCHA library API has been stable since 2022)
