# Phase 7: Deploy — Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Ship the Raptor Roofing pitch site to a shareable Vercel preview URL with the bare minimum infrastructure needed to show a prospect on their phone. Most of this phase is already done — GitHub repo exists, Vercel is auto-deploying, site is live. What remains: enable Vercel Analytics, run Rich Results Test, and confirm the deploy story is clean enough to show a client.

This phase does NOT include: real email delivery (stubbed for demo), env var configuration (zero env vars policy), custom domain setup (deferred until client signs), or Google Search Console submission (explicitly excluded per project policy).

</domain>

<decisions>
## Implementation Decisions

### Env var strategy — Zero env vars for the demo

- **No env vars set in Vercel Project Settings.** Not `NEXT_PUBLIC_SITE_URL`, not Gmail SMTP creds, not reCAPTCHA keys. Nothing.
- **Why:** Env vars are the #1 source of demo-day crashes (already proven — the `throw new Error` guard in sitemap.ts crashed Vercel earlier this session).
- **Consequence for sitemap.ts:** already resolved — uses silent fallback to `https://raptor-roofing.vercel.app`
- **Consequence for `/api/contact`:** the route handler will return `{success: false, error: "Server misconfiguration"}` when NOTIFICATION_EMAIL is unset. The ContactForm and LeadForm should still show success UI to the user regardless — Phase 7 planner must decide whether to:
  (a) client-side stub: ignore API response, always show success card after any submit
  (b) modify `/api/contact` to return `{success: true}` when no env vars present (explicit demo mode)
  (c) keep the current behavior and accept that the form shows an error card in the demo
  **Recommendation: option (a)** — simplest, zero backend risk, the demo shows a polished success flow. Document as a temporary demo-only hack that reverts when Raptor signs and provides real credentials.
- **reCAPTCHA:** no site key set → GoogleReCaptchaProvider renders without a provider (the Phase 5 dev fallback). The form works without bot protection during the demo, which is fine since it's not publicly advertised.

### Vercel Analytics — Enable free tier

- **Enable Vercel Web Analytics.** Free tier, zero-config, no code changes needed — toggle in Vercel Project → Analytics.
- **Do NOT enable Speed Insights.** Keep it to one toggle for the demo; Speed Insights is nice-to-have but not demo-critical.
- **Why:** Shows the prospect "analytics is built in" without requiring GA4/GTM setup. Free tier is sufficient for pitch-window traffic (handful of visits while Andrew is pitching).
- **Consequence:** The `@vercel/analytics` package needs to be installed and the `<Analytics />` component mounted in the root layout. Planner handles the install + mount.

### Rich Results Test — Run in Phase 7

- **Run Google Rich Results Test against the live Vercel URL during Phase 7 execution, not deferred to Phase 8.**
- **Why:** Phase 8 is device testing + handoff docs. Schema validation belongs with deploy verification so any schema bugs are caught before the pitch.
- **Pass criterion:** Zero errors on homepage. Warnings are acceptable (Rich Results Test flags missing-but-optional fields as warnings — e.g., AggregateRating is optional).
- **Pages to test:** Homepage is mandatory. Spot-check 1-2 service pages and 1 service area page. Skip /contact and /about if time-pressed.
- **Do NOT submit to Google Search Console.** Explicit project policy from STATE.md — pitch URL only, not indexed via GSC.

### Claude's Discretion

- Exact placement of `<Analytics />` in root layout
- How to structure the Rich Results Test results (save to phase dir as RICH_RESULTS.md? or just screenshot + pass/fail note in SUMMARY?)
- Whether to run a final `npm run build` + `git push` before Rich Results Test to ensure the latest code is what gets validated
- Whether to add a `DEMO_MODE` constant in the codebase to mark the form-stub behavior explicitly

</decisions>

<specifics>
## Specific Ideas

- **Current state of deploy infrastructure (already done, verify in planning):**
  - GitHub repo: https://github.com/ajwegner3-alt/raptor-roofing
  - Vercel auto-deploy: confirmed working (Lighthouse already ran against the live URL)
  - Preview URL: https://raptor-roofing.vercel.app — no auth gate, public

- **Demo reality check:** The pitch is about the UI/SEO quality of the site, not whether forms deliver email. The client sees a polished site on their phone and decides "yes, I want this for Raptor Roofing." Everything else (real email, env vars, analytics setup) happens post-sign when they provide their own credentials.

- **Form-stub decision trade-off:** Andrew said demo forms should "look like they work." Pure client-side stub is fastest and safest. The only downside is DevTools shows a 200 response with `{success: false}` — but nobody in a pitch demo is going to open DevTools.

</specifics>

<deferred>
## Deferred Ideas

- **Custom domain setup** — Phase 7 uses the Vercel preview URL only. Custom domain (e.g., raptorroofing.com) happens after client signs and provides domain credentials. Planner should NOT include domain DNS or Vercel domain linking in this phase.
- **Env var wiring for real email delivery** — explicitly deferred. When client signs and provides their Gmail App Password + real NOTIFICATION_EMAIL, flip a single env var in Vercel and the pipeline already built in Phase 5 activates.
- **Google Search Console submission** — explicitly excluded per project policy. Pitch URL must not be indexed via GSC.
- **Speed Insights, GA4, GTM integration** — not in Phase 7 scope. Post-launch additions when there's real traffic.
- **Rich Results Test for every page** — only homepage is mandatory in Phase 7. Full-site schema validation is deferred to Phase 8 QA or post-launch.
- **Vercel Team/Org features** — stays on Andrew's personal Vercel account for the pitch. Post-sign consideration.

</deferred>

---

*Phase: 07-deploy*
*Context gathered: 2026-04-15*
