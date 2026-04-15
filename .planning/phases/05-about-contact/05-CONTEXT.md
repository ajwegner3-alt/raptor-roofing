# Phase 5: About + Contact - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Ship `/about` and `/contact` pages. The Contact page provides a working lead form that actually delivers email to Andrew's Gmail Primary inbox via the existing `@nsi/email-sender` tool (Gmail SMTP provider). End-to-end test submission must land before the pitch demo.

**Out of scope:** sitemap/robots (Phase 6), Lighthouse pass (Phase 6), deploy (Phase 7), real device QA (Phase 8), Google Sheets CRM integration (deferred post-launch), service-area pages (deferred).

</domain>

<decisions>
## Implementation Decisions

### About page — narrative
- **Story structure:** Chronological family story. Linear narrative from founding forward — "Founded in [year] by [founder]…" framing. Human-first, not values-list-first.
- **No-subcontractors explainer:** Standalone section with a dedicated heading ("Every Crew Is Raptor" or equivalent). 3–4 paragraphs explaining what it means and why it matters to homeowners. NOT a bullet, NOT a comparison table.
- **Anti-chaser positioning:** Educational without naming. "What to watch out for after a storm" framing — teaches homeowners to spot chasers without using the word "chaser" or naming competitors. Stays legal and classy. No "we don't knock doors" direct language on the About page — that belongs in HOW they're different, not WHAT they teach you.
- **Page length:** Short — 1 to 1.5 screens scroll. Hero + chronological story + no-subs section + educational anti-chaser block + TrustStrip + testimonials slice + end CTA. Fast, scannable, mobile-first.
- **Sections required on About:**
  1. About hero (reuse ServiceHero pattern or build a simple AboutHero) with H1 and family-owned micro-trust line
  2. Chronological story section
  3. "Every Crew Is Raptor" no-subcontractors section
  4. Educational anti-chaser section ("What to watch for after a storm")
  5. TrustStrip (reuse sitewide)
  6. Testimonials slice (reuse homepage TestimonialCarousel with [PLACEHOLDER] banners)
  7. End CTA block (Call + Free Estimate anchored to /contact)
- **Schema on About:** Reuse LocalBusiness JSON-LD mounted in Footer — do NOT duplicate on About page. About page ships BreadcrumbList JSON-LD only.
- **Metadata:** buildMetadata({ path: '/about', useAbsoluteTitle: true }) with unique title/description distinct from every other page.

### Form backend — `@nsi/email-sender` (Gmail SMTP)
- **Tool:** Use the existing `@nsi/email-sender` from `C:\Users\andre\OneDrive - Creighton University\Desktop\Claude-Code-Projects\tools-made-by-claude-for-claude\email-sender\`. Copy `src/` into `raptor-roofing/src/lib/email/` per the tool's Next.js integration pattern. Do NOT fork or rebuild — the tool is already tested, typed, and has the exact `templates.notification()` shape needed for a contact form.
- **Provider:** Gmail SMTP (not Resend).
  - Rationale: zero domain verification overhead, same-domain delivery to Andrew's Gmail Primary inbox natively, 100/day free forever, no API billing account needed. Emails visibly FROM @gmail.com is an acceptable trade-off for the pitch.
  - Env vars: `EMAIL_PROVIDER=gmail`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `GMAIL_FROM_NAME`, `NOTIFICATION_EMAIL` (Andrew's inbox). All scoped to Vercel Preview + Production in Phase 7.
  - Gmail App Password setup happens manually by Andrew before the end-to-end test in plan 05-03 — flag as a required manual step in HANDOFF.md.
- **Upgrade path to Resend:** Documented in HANDOFF.md as a post-signing option. The tool supports provider swap via a single env var change (`EMAIL_PROVIDER=resend` + `RESEND_API_KEY`) with zero code changes. No Phase 5 work required — the upgrade is purely an env var flip later.
- **API route:** `src/app/api/contact/route.ts` — Next.js App Router POST handler. Receives form submission, validates reCAPTCHA v3, calls `sendEmail()` from the copied email tool using the `templates.notification()` shape, returns `{ success, messageId?, error? }` shape back to the client.
- **Email template:** `templates.notification({ title: "New lead from Raptor Roofing website", fields: { Name, Phone, Service, ZIP, "Submitted": timestamp } })`. Subject line: `New lead from Raptor website — [Name]`. Reply-to set to submitter's phone number is NOT possible; leave reply-to default (Andrew's own Gmail). The phone field is the primary contact channel, not reply-to.
- **CRM logging:** Email-only for Phase 5. No Google Sheet row writing, no n8n webhook, no Supabase. Sheets CRM deferred to a post-launch phase once Raptor signs.

### Form UX — states and validation
- **Loading state:** Button spinner + text changes to "Sending..." + submit button disables. Other form inputs stay enabled (user can edit if they want, but submit is locked until the request resolves).
- **Success state:** Inline replace — form disappears and a success card replaces it in the same DOM position. Copy: "Got it, [Name]. We'll call you within 2 hours." Plus the phone number as a secondary tel: link in case they want to call sooner. NO redirect to a /thank-you page (keeps scroll context, simpler, no extra route).
- **Failure state:** Fail loud — if the email-sender returns `{ success: false }`, display an error card: "We couldn't send your request. Please call (402) 885-1462 — we'll answer within 2 hours." Plus a big tap-to-call `tel:` button. This keeps the lead alive even when the backend dies. NO silent retries — one attempt, then honest failure.
- **Validation timing:** On submit only. No mid-typing validation, no blur-triggered validation. Cleaner UX, less distracting. If the user submits with errors, all invalid fields light up at once.
- **Error style:** Red border on invalid fields + red error message directly beneath each invalid field. Standard, accessible pattern. Error messages are copy-focused ("Phone number required" not "Field invalid").
- **Required fields:** Name, Phone, Service, ZIP. All four required. Email optional (NOT asked — per CLAUDE.md contractor rule, phone is the primary field, not email).
- **reCAPTCHA v3:** Invisible, permissive 0.3 score threshold. Rationale: zero-client agency, every legitimate lead matters, false positives are costlier than occasional bot slippage. reCAPTCHA failure (score < 0.3) = silent server-side reject with the same "fail loud" error shown to the user — do NOT tell them they failed a bot check.

### Contact page extras
- **Google Map:** Static iframe embed from Google Maps Embed URL. No API key required, no billing account, loads on view. Zero setup cost.
- **Map target:** Specific business address (not service area polygon, not generic Omaha pin).
  - **OPEN QUESTION / BLOCKER:** `site.ts` currently holds a placeholder address. Either (a) Andrew gets the real Raptor street address before plan 05-03 ships the Contact page, OR (b) the Contact page ships with a `[PLACEHOLDER: confirm street address with Raptor]` label above the map iframe that Phase 8 handoff swaps. Do NOT invent an address.
- **NAP block:** Enriched version, distinct from Footer NAP. Larger type, prominent click-to-call, hours block visible, "Get directions" link next to the address (links to Google Maps directions URL). The Contact page NAP is the canonical NAP for the site.
- **Service area list:** Simple text list / pill tags. Comma-separated or pill-styled tags with city names — "Omaha, Bellevue, Papillion, La Vista, Gretna, Elkhorn, Millard, Ralston..." — pulled from `src/content/service-areas.ts`. NOT linked (service-area pages are deferred). NOT a card grid. NOT county-grouped.
- **Hours display:** Reuse the same hours data from `siteConfig.hours` that the Footer uses. No "Open now / Closed now" live indicator (conflicts with the anti-chaser no-urgency stance — consistent with Footer decision from Phase 2).
- **Schema on Contact:** BreadcrumbList JSON-LD + do NOT duplicate LocalBusiness (already in Footer).
- **Metadata:** buildMetadata({ path: '/contact', useAbsoluteTitle: true }) with unique title/description distinct from every other page.

### Claude's Discretion
- Exact About hero component — can reuse ServiceHero or build a new simple AboutHero, planner's call
- Exact About story copy and year numbers (all subject to [PLACEHOLDER] tags where facts are unknown — founder name, founding year, family size)
- Exact educational anti-chaser section copy (as long as it's educational, not naming competitors, not using "chaser" word)
- Exact success card visual treatment (inline replace)
- Exact error message copy details (as long as fail-loud + phone fallback is present)
- reCAPTCHA library choice (react-google-recaptcha-v3 vs direct `grecaptcha` script) — pick based on Next.js 16 App Router best practices during planning
- API route validation library (zod recommended but not required)
- Subject line format (as long as "New lead" appears and is recognizable in inbox)

</decisions>

<specifics>
## Specific Ideas

- **Email-sender tool is the spine of this phase.** Plan 05-02 MUST start by copying `src/` from the email-sender tool into `raptor-roofing/src/lib/email/` per the tool's README section "Using in Next.js Server Actions". Do not reinvent the provider abstraction, the result shape, or the templates. If something is broken in the tool, fix the tool at its canonical location first, then re-copy — do not fork.
- **The form is the site's only live backend.** Everything else in the project is static pages. This makes Phase 5 the highest-risk phase for deploy-time breakage (env vars, CORS, Gmail App Password format) — budget extra time for the end-to-end test in plan 05-03.
- **End-to-end test is a hard gate.** Plan 05-03 is not complete until a real test submission from the live dev server (or a vercel preview) results in an email landing in Andrew's Gmail Primary inbox — not Spam, not Promotions. If it hits Spam, that's a gap to close before moving on.
- **HANDOFF.md additions Phase 5 must stage:**
  - Gmail App Password creation steps (the tool's README already documents this — reference it)
  - Env var list to configure in Vercel (Preview + Production scope)
  - Provider upgrade path to Resend (single env var flip)
  - NOTIFICATION_EMAIL swap instructions for when Raptor signs and wants leads delivered to their own inbox
- **About page uses LocalBusiness schema indirectly.** Footer still owns the canonical LocalBusiness JSON-LD. About page is the correct place to link to in structured data for `foundingDate`, `founder`, etc. — but since LocalBusiness is in the Footer already, do NOT re-emit it. If foundingDate/founder fields need to be added to the LocalBusiness JSON-LD, edit the factory in `src/lib/schema.tsx` instead of emitting a duplicate schema on /about.
- **No financing callout on About or Contact.** That stays on the homepage only.
- **No lead form on About page.** About page uses end CTA block pointing to /contact, not an embedded form.

</specifics>

<deferred>
## Deferred Ideas

- **Google Sheet CRM logging** — email + Sheet row, deferred to a post-signing phase
- **Resend provider upgrade** — purely an env var flip, no Phase 5 code work, documented in HANDOFF.md
- **SMS lead capture / live chat** — out of scope; phone + form are the only channels
- **/thank-you dedicated page** — redundant with inline success card; only revisit if analytics conversion tracking becomes a priority
- **Service-area pages** (`/service-areas/[city]`) — already deferred from Phase 4
- **"Open now / Closed now" live hours indicator** — conflicts with anti-chaser stance, stays omitted
- **Founder bio / team photos on About** — out of scope unless Raptor provides real assets; short page stays short
- **Community involvement / charity section on About** — brochure territory, not pitch territory
- **Map API (JS or Static API with billing)** — iframe embed is sufficient for the pitch
- **Dynamic "hold on, we're sending..." copy polish, confetti animations, etc.** — not pitch-critical
- **Email-sender tool enhancements** (attachments, welcome template use, lead magnet delivery) — not needed for contact form scope

</deferred>

<open_questions>
## Open Questions / Blockers

- **Real Raptor street address** — Currently placeholder in `site.ts`. Either Andrew gets it from Raptor before plan 05-03 ships, OR the Contact page ships with a visible `[PLACEHOLDER: confirm street address with Raptor]` label above the map iframe. Do NOT invent an address.
- **Gmail App Password** — Andrew must generate one and add it to `.env.local` before the end-to-end test in plan 05-03. This is a manual step — flag it in the plan and HANDOFF.md.
- **Founding year / founder name** — Currently unknown. About chronological story ships with `[PLACEHOLDER: founding year]` and `[PLACEHOLDER: founder name]` tags. Phase 8 handoff swaps these.

</open_questions>

---

*Phase: 05-about-contact*
*Context gathered: 2026-04-14*
