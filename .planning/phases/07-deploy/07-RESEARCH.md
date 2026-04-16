# Phase 7: Deploy — Research

**Researched:** 2026-04-15
**Domain:** Vercel Analytics, form stub, Rich Results Test, deploy verification
**Confidence:** HIGH (all findings from direct file inspection + package.json)

---

## Summary

Phase 7 is almost entirely already done. The three remaining tasks are small and surgical:

1. **Vercel Analytics** — `@vercel/analytics@2.0.1` is already installed in `package.json` AND `<Analytics />` is already imported and mounted in `src/app/layout.tsx` (line 5 import, line 90 mount). The only remaining step is toggling Analytics on in the Vercel Project dashboard. Zero code changes needed.

2. **Form stub (option a)** — Both `ContactForm.tsx` and `LeadForm.tsx` make a `fetch('/api/contact')` call, check `data.success`, and branch to either a success card or an error card. The surgical fix is identical in both files: change the branch condition so success is shown regardless of the API response. Two-line edit per file.

3. **Rich Results Test** — Manual step. Navigate to `https://search.google.com/test/rich-results`, paste the live URL, run the test, confirm zero errors (warnings are fine). No code interaction. Capture results as a text note in the phase summary.

**Primary recommendation:** Start with the form stub (code change + push), then do the Vercel Analytics dashboard toggle, then run the Rich Results Test against the freshly-deployed build.

---

## Standard Stack

No new dependencies needed. Everything is already installed.

| Package | Version in package.json | Status |
|---------|--------------------------|--------|
| `@vercel/analytics` | `^2.0.1` | Installed in node_modules, already in layout.tsx |

---

## Task 1: Vercel Analytics

### What's already done

- `package.json` line 16: `"@vercel/analytics": "^2.0.1"` — installed.
- `src/app/layout.tsx` line 5: `import { Analytics } from "@vercel/analytics/react";`
- `src/app/layout.tsx` line 90: `<Analytics />` — mounted inside `<body>`, after `{children}`.

### What remains

**One manual step in Vercel dashboard:**
1. Go to vercel.com → raptor-roofing project → Analytics tab
2. Click "Enable" (free tier, no config needed)

The `<Analytics />` component is a no-op until the Vercel project has Analytics enabled. Once toggled, it starts collecting page views automatically. No `npm install` needed, no layout changes needed.

### Confidence
HIGH — verified by reading the actual files.

---

## Task 2: Form Stub (Option A — Client-Side Always-Success)

### ContactForm.tsx

**File:** `src/components/sections/ContactForm.tsx`

**Current logic (lines 122–140 in `handleSubmit`):**
```
const data = await res.json() as { success: boolean; ... };
if (data.success) {
  setSubmittedName(name);
  setStatus('success');
} else {
  console.error('[ContactForm] submit failed', data.error);
  setStatus('error');
}
```

**Surgical edit — replace lines 130–135:**
```typescript
// DEMO MODE: always show success regardless of API response
// TODO: revert when Raptor provides real SMTP credentials
setSubmittedName(name);
setStatus('success');
// Original: if (data.success) { ... } else { setStatus('error') }
```

The `catch` block at lines 137–140 still sets `status = 'error'` on network failure (fetch itself throws). That's fine — a network error in a pitch demo is not a realistic scenario. Leave the catch block alone.

**Line range to modify:** Lines 130–135 (the `if (data.success)` branch inside the `try` block).

### LeadForm.tsx

**File:** `src/components/sections/LeadForm.tsx`

**Current logic (lines 49–56 in `handleSubmit`):**
```
const data = await res.json() as { success: boolean; error?: string };
if (data.success) {
  setStatus("success");
} else {
  console.error('[LeadForm] submit failed', data.error);
  setStatus("error");
}
```

**Surgical edit — replace lines 50–56:**
```typescript
// DEMO MODE: always show success regardless of API response
// TODO: revert when Raptor provides real SMTP credentials
setStatus("success");
// Original: if (data.success) { ... } else { setStatus("error") }
```

Same pattern: leave the `catch` block (lines 57–60) untouched.

**Line range to modify:** Lines 50–56 (the `if (data.success)` branch inside the `try` block).

### What the demo will show

After the stub:
- User fills form, hits submit
- Button shows "Sending…" while fetch is in-flight
- Success card renders: "Thanks, [name]!" + "Call (402) 885-1462" button
- DevTools will show `POST /api/contact 200` with body `{success: false, error: "Server misconfiguration"}` — this is fine for a pitch demo

### Confidence
HIGH — verified by reading the actual source files.

---

## Task 3: Rich Results Test

### Procedure

1. Open `https://search.google.com/test/rich-results` in browser
2. Enter `https://raptor-roofing.vercel.app` and click Test URL
3. Wait for Google to crawl and parse the page (10–30 seconds)
4. Review results

### What "zero errors" means

- **Errors** = required fields missing from a schema type that Google detected. These prevent rich results from showing.
- **Warnings** = optional fields missing (e.g., `AggregateRating` fields, `priceRange`). Warnings are acceptable per CONTEXT.md.
- Pass criterion: the Errors count = 0. Warnings can be non-zero.

### Next.js App Router gotcha

Google's Rich Results Test fetches the URL as a standard HTTP GET. Next.js App Router renders JSON-LD via `<script type="application/ld+json">` tags in the HTML. The test reads those directly. No SSR/hydration issue — it parses raw HTML, not a headless browser.

If structured data was injected via `generateMetadata()` or a `<Script>` component with `strategy="afterInteractive"`, Google's crawler would miss it. Verify schema is in `<script type="application/ld+json">` in a Server Component (not a client-side inject). This is the standard pattern used in the project; no change needed unless a schema bug surfaces.

### Pages to test

Per CONTEXT.md decisions:
- Homepage (`/`) — **mandatory**
- One service page (e.g., `/services/roof-replacement`) — spot-check
- One service area page (e.g., `/service-areas/omaha`) — spot-check
- Skip `/contact` and `/about`

### Capturing results

Save a brief text summary in the phase SUMMARY.md (no screenshot required for a pitch site). Format:
```
Homepage: PASS — 0 errors, N warnings
/services/roof-replacement: PASS — 0 errors, N warnings
/service-areas/omaha: PASS — 0 errors, N warnings
```

If any page shows errors, note the specific schema type and missing field — those are actionable bugs to fix before the pitch.

### Confidence
HIGH — Rich Results Test procedure is stable and well-documented. The Next.js SSR/JSON-LD behavior is verified by project conventions already in place.

---

## Verification Checklist for "Already Done" Items

These are quick confirms, not deep audits:

| Item | How to Verify | Expected |
|------|--------------|---------|
| GitHub repo exists | `git remote -v` | `origin https://github.com/ajwegner3-alt/raptor-roofing.git` |
| Latest code is pushed | `git status` + `git log origin/master..HEAD` | Clean status, no unpushed commits |
| Vercel auto-deploy | Check `https://raptor-roofing.vercel.app` loads | Site renders, no auth gate |
| Preview URL public | Open in incognito window | No Vercel authentication prompt |
| Sitemap fallback | `curl https://raptor-roofing.vercel.app/sitemap.xml` | Returns XML with raptor-roofing.vercel.app URLs |

Current state as of research: `git status` shows only `.gitignore` modified (not staged). Git remote is confirmed at `https://github.com/ajwegner3-alt/raptor-roofing.git`. Latest commit is `b464f02 docs(07): capture phase context`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Analytics install | Don't add manual tracking scripts | `@vercel/analytics` already in layout |
| Analytics dashboard | Don't build admin page | Vercel Project → Analytics tab |
| Schema validation | Don't write a custom validator | Google Rich Results Test UI |

---

## Common Pitfalls

### Pitfall 1: Thinking `@vercel/analytics` needs install
`@vercel/analytics` is already in `package.json` and `node_modules`. The only remaining step is the Vercel dashboard toggle. Running `npm install @vercel/analytics` again is harmless but unnecessary.

### Pitfall 2: Thinking layout.tsx needs edits
`<Analytics />` is already imported and mounted in `src/app/layout.tsx`. No code changes needed for analytics.

### Pitfall 3: Modifying the `catch` block in form components
The `catch` block handles genuine network errors (fetch throws). Leave it returning `status = 'error'` — a network failure during a pitch demo is not a scenario worth stubbing. Only modify the `if (data.success)` branch inside `try`.

### Pitfall 4: Rich Results Test on localhost
Must run against the live Vercel URL (`https://raptor-roofing.vercel.app`), not localhost. The tool does an actual HTTP fetch — it cannot reach localhost.

### Pitfall 5: Submitting to Google Search Console
Explicitly out of scope per project policy. Do NOT submit the sitemap or request indexing during Phase 7.

---

## Open Questions

None. All research domains resolved with HIGH confidence from direct file inspection.

---

## Sources

### Primary (HIGH confidence)
- Direct file read: `src/app/layout.tsx` — Analytics already imported and mounted
- Direct file read: `package.json` — `@vercel/analytics@^2.0.1` in dependencies
- Direct file read: `src/components/sections/ContactForm.tsx` — exact lines for stub edit
- Direct file read: `src/components/sections/LeadForm.tsx` — exact lines for stub edit
- Direct file read: `git remote -v` output — confirms GitHub repo URL

### Secondary (MEDIUM confidence)
- Rich Results Test URL and behavior: https://search.google.com/test/rich-results — standard Google tool, stable for years

---

## Metadata

**Confidence breakdown:**
- Vercel Analytics task: HIGH — package installed, component mounted, only dashboard toggle remains
- Form stub task: HIGH — exact lines identified in both files
- Rich Results Test task: HIGH — standard procedure, no code interaction
- Verification checklist: HIGH — confirmed from git commands

**Research date:** 2026-04-15
**Valid until:** 2026-05-15 (stable stack)
