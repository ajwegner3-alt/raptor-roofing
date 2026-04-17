# Phase 8: Manual QA + Handoff — Context

**Gathered:** 2026-04-16
**Status:** Ready for planning

<domain>
## Phase Boundary

Andrew tests the live pitch site on real devices (iPhone + Android), runs a Storm-Chaser Copy Audit on all headlines and CTAs, audits and resolves placeholders where possible, then ships handoff documentation (HANDOFF.md, FUTURE_DIRECTIONS.md, README.md) so the project can transition from pitch demo to production when Raptor signs.

This phase does NOT include: wiring real email delivery, configuring env vars, setting up reCAPTCHA, custom domain, GA4/GTM, or Google Search Console submission. Those are post-sign tasks documented in HANDOFF.md.

</domain>

<decisions>
## Implementation Decisions

### Device testing scope — Quick visual check, not exhaustive

- **Both devices available:** Andrew has iPhone (Safari) and Android (Chrome) for testing.
- **Pass bar:** "Looks good, loads fast" — homepage loads without visible jank, phone number taps to call, images render. Quick visual check ~30 seconds per device. NOT a full page-by-page walkthrough.
- **Lighthouse re-run: SKIP.** Phase 6 already verified 90+ on all 28 scores against the live URL. No meaningful code changes since then (only demo-mode form stubs — no perf impact). Trust existing scores.
- **Keyboard navigation testing: SKIP.** Phase 6 a11y pass already addressed focus rings, skip-to-main, and tap targets. This is a pitch demo, not a public launch.
- **What to actually test on devices:** Homepage loads, phone tap-to-call works, images render, no visible layout shift. Quick scroll through 1-2 other pages. Done.

### Form testing realism — Keep demo stubs, no real email

- **Demo stubs stay.** Forms show success card regardless of API response. No env vars configured. Good enough for the pitch — nobody will check if email actually arrived.
- **reCAPTCHA stays in fallback mode.** No site key means no bot protection, but the pitch URL isn't publicly advertised. Configure post-sign.
- **Roadmap success criterion ("form submission delivers to Gmail Primary"):** Claude's discretion on how to handle this in documentation — likely note it as deferred to post-sign in HANDOFF.md and update the criterion to match demo reality.

### Handoff doc depth — Written for Claude Code, not humans

- **HANDOFF.md primary reader: Andrew using Claude Code.** The handoff doc should be structured as instructions a future Claude Code session can execute. NOT a human-readable narrative.
- **Format: Structured checklist + ready-to-paste mega-prompt.** Grouped sections (credentials, placeholders, config, demo stub removal) with specific file paths and what to change. Plus a single copy-paste prompt at the bottom that tells Claude Code: "Here are the real credentials, replace all placeholders, configure env vars, revert demo stubs, and push."
- **FUTURE_DIRECTIONS.md:** Claude's discretion on prioritization. Should cover the pitch-to-production transition — both business improvements (blog, GA4, call tracking, GBP, review generation) and technical cleanup (lint errors, demo stubs, real reCAPTCHA, missing tests). Claude judges the right balance.
- **README.md audience: Dev setup for Claude Code.** How to clone, install, run dev, build, deploy. Written so a future Claude Code session can onboard quickly. NOT a client-facing overview.

### Placeholder audit — Resolve what we can, tag the rest

- **Resolve resolvable placeholders.** If data can be found without Raptor's input (e.g., NE contractor license lookup, actual Google review count from their GBP if public), fill them in now. Tag everything else with `// PLACEHOLDER:` comments.
- **Storm-Chaser Copy Audit: RUN IT.** Anti-chaser positioning is Raptor's brand differentiator. Every headline, CTA, and hero subtext should be vetted against the anti-chaser guidelines. This is not optional — bad copy would undermine the pitch.
- **Placeholder audit output: Dev-facing in HANDOFF.md.** List every `// PLACEHOLDER:` tag with file path, line number, and what data is needed. This becomes the checklist for the post-sign Claude Code session. No separate client-facing list needed.

### Claude's Discretion

- How to structure the Storm-Chaser Copy Audit (checklist? pass/fail per page? inline fixes?)
- Whether to update ROADMAP.md success criteria to match demo reality (email delivery deferred)
- FUTURE_DIRECTIONS.md section ordering and priority weighting
- Whether README.md should include a "Project Status" section indicating pitch-demo vs production
- Exact format of the HANDOFF.md mega-prompt section
- Whether to create a separate PLACEHOLDER_INVENTORY.md or inline it in HANDOFF.md

</decisions>

<specifics>
## Specific Ideas

- Andrew said "Me, using Claude Code" when asked about HANDOFF.md reader — this is the strongest signal about format. The handoff doc is a Claude Code prompt template, not a human document.
- The "Both" answer on handoff format means the structured checklist serves as reference AND the mega-prompt serves as the one-shot execution path. They're complementary, not redundant.
- "Resolve what we can" on placeholders means Claude should actively try to find real data (web search for Raptor Roofing NE license, check Google Maps for review count, etc.) — not just passively tag everything.

</specifics>

<deferred>
## Deferred Ideas

- Real email delivery testing — post-sign when Raptor provides Gmail App Password
- reCAPTCHA configuration — post-sign when Raptor provides site key
- Custom domain setup — post-sign when Raptor provides domain credentials
- GA4/GTM integration — post-sign when there's real traffic to track
- Google Search Console submission — explicitly excluded until production
- Blog section — identified as SEO gap, post-milestone work
- Client-facing "What We Need From You" checklist — Andrew can create this from HANDOFF.md if needed

</deferred>

---

*Phase: 08-manual-qa-handoff*
*Context gathered: 2026-04-16*
