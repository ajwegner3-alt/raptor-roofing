# Lighthouse Mobile Audit — Phase 6 Gate

**Audited:** 2026-04-15 21:15 CDT
**Target:** https://raptor-roofing.vercel.app (LIVE Vercel preview URL — NOT localhost, per RESEARCH.md Q12 lock)
**Commit:** c13efc7
**Lighthouse version:** 13.1.0
**Form factor:** mobile, simulated throttling
**Extraction method:** deterministic JSON parsing via scripts/extract-lighthouse-scores.mjs

## Scores — hard gate 90+ on every cell

| Route | Performance | Accessibility | Best Practices | SEO | Status |
|---|---|---|---|---|---|
| home | 93 | 97 | 100 | 92 | PASS |
| about | 96 | 97 | 100 | 100 | PASS |
| contact | 96 | 97 | 100 | 100 | PASS |
| services-roofing | 92 | 94 | 100 | 92 | PASS |
| services-siding | 91 | 94 | 100 | 92 | PASS |
| services-gutters | 94 | 94 | 100 | 92 | PASS |
| services-emergency-tarping | 94 | 94 | 100 | 92 | PASS |

**28 scores total. Gate: every cell must be ≥90.**

**Overall:** PASS — all 28 ≥90

## Notes

### Inline Fixes Applied During This Audit

**Fix 1: Google Maps facade on /contact**
- **Issue:** /contact Performance score was 68 (FAIL) due to Google Maps iframe loading ~300 kB of Maps API JavaScript on initial page load
- **Fix:** Replaced eager Google Maps iframe with `MapFacade` client component (src/components/sections/MapFacade.tsx). Shows a static placeholder with "View Map" + "Get Directions" buttons. The iframe only loads when the user clicks "View Map" — eliminating Maps API from the critical path entirely.
- **Result:** /contact Performance improved from 68 → 96
- **Commit:** c13efc7

**Fix 2: robots.txt trailing newline in NEXT_PUBLIC_SITE_URL**
- **Issue:** Lighthouse reported robots.txt as invalid (line 5: Sitemap URL was split across two lines by a trailing newline). This was caused by using `echo "URL" | vercel env add` which piped a URL with a trailing `\n` into the env var value.
- **Fix:** Removed and re-added `NEXT_PUBLIC_SITE_URL` using `printf "URL"` (no trailing newline). Re-deployed.
- **Result:** robots.txt now correctly outputs `Sitemap: https://raptor-roofing.vercel.app/sitemap.xml` on one line. /about and /contact SEO scores improved from 92 → 100 (robots.txt validation passed).

### Deployment Context

The Vercel production URL had not been deployed since early Phase 5 work — the GitHub → Vercel auto-deploy was not triggering for new commits because `NEXT_PUBLIC_SITE_URL` was missing from Vercel's environment variables, causing the build to fail (sitemap.ts throws at build time if the env var is unset). Fixed by adding `NEXT_PUBLIC_SITE_URL` as a Vercel production environment variable and triggering a fresh deployment via Vercel CLI.

### Lighthouse CLI Note

Lighthouse CLI on Windows 11 consistently throws `EPERM` on temp directory cleanup (`lighthouse.XXXXXXXX` folder in `%TEMP%`). This is a known Lighthouse/chrome-launcher Windows limitation. The audit itself completes successfully before the cleanup error occurs — all 7 HTML + JSON report files were generated and contain valid data.

### reCAPTCHA Exception

reCAPTCHA v3 loads on /contact as a 35 kB script (CONTEXT.md accepted cost). With the Maps facade in place, reCAPTCHA is no longer the dominant performance factor. All 4 pillars on /contact pass ≥90. No reCAPTCHA exception needed to invoke.
