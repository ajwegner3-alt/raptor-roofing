# Phase 6: SEO + Performance + Accessibility — Context

**Gathered:** 2026-04-15
**Status:** Ready for research / planning

<domain>
## Phase Boundary

Sitewide technical audit of everything built in Phases 1–5. Every existing page (`/`, `/about`, `/contact`, `/services/roofing`, `/services/siding`, `/services/gutters`, `/services/emergency-tarping`) passes a Lighthouse mobile audit at 90+ on all four pillars, ships unique metadata + valid schema, meets WCAG AA contrast + keyboard navigation, and stays under a 200 KB First Load JS budget per route.

No new features. No service-area pages. No blog. No analytics dashboard. New capabilities belong in other phases.

Deliverables:
- `app/sitemap.ts` + `app/robots.ts`
- Root layout `metadata.robots` set correctly for the pitch window
- Stripped-down LocalBusiness schema (no fake ratings)
- Skip-to-main link + branded focus-visible ring
- Placeholder hero photo assets committed so Lighthouse can measure LCP honestly
- A11y contrast + tap target + keyboard nav audit with fixes applied
- Bundle size check via `npm run build` output

</domain>

<decisions>
## Implementation Decisions

### Indexability policy (pitch window)

- **`robots.txt` = `Allow: /`.** Fully open to crawlers on the Vercel preview URL. The pitch URL is not competing with any real domain, and if it happens to rank for anything while the pitch is live, that's a free bonus.
- **`app/sitemap.ts` generates a full sitemap** with all 7 routes: `/`, `/about`, `/contact`, `/services/roofing`, `/services/siding`, `/services/gutters`, `/services/emergency-tarping`. Absolute URLs are built from `NEXT_PUBLIC_SITE_URL`, which defaults to `https://raptor-roofing.vercel.app` today and will be swapped in the Phase 7 deploy step.
- **Root layout `metadata.robots` = `{ index: true, follow: true }`.** No noindex remnants anywhere. Matches Phase 6 success criterion 1 literally.
- **Flip to production-indexable happens in Phase 7.** When Phase 7 swaps `NEXT_PUBLIC_SITE_URL` to the real domain, every absolute URL in sitemap + canonical + OG updates automatically because they all read from the env var. Phase 6 does not gate or conditionalize anything on domain — it just ensures the env var is the single source of truth.
- **Consequence for sitemap.ts:** do NOT hard-code the base URL. Read `NEXT_PUBLIC_SITE_URL` and throw at build time if it's not set, so Phase 7 can't forget to set it.

### Schema + FTC/placeholder handling

- **Strip `aggregateRating` from the Footer's `HomeAndConstructionBusiness` JSON-LD entirely.** The placeholder "4.9 / 127 reviews" stays in the visible UI (still wrapped in its amber [PLACEHOLDER] banner — visible disclosure), but the JSON-LD emits zero review count and zero rating. Loses rich-snippet stars in SERPs — accepted, because fake ratings in schema are a Google structured-data policy violation + FTC 16 CFR 255 risk.
- **Zero `Review` JSON-LD objects are emitted anywhere on the site while placeholder testimonials exist.** The planner must verify Phase 3 did not emit any `Review` schema and add a test/grep that catches regressions. Testimonials remain UI-only structured content until Raptor provides real, attributable reviews in the Phase 8 handoff pass.
- **When real review data arrives post-handoff**, the path back is additive: add `verified: boolean` to `src/content/testimonials.ts`, add `reviewCount` + `ratingValue` to `siteConfig`, only then re-emit `aggregateRating` + `Review` objects. Phase 6 does NOT pre-build this scaffolding — YAGNI.
- **Schema validation tooling is deferred to Phase 7.** Phase 6 trusts `schema-dts` typing + static inspection. Phase 7 runs Google Rich Results Test against the live preview URL with zero errors as a deploy gate.
- **Canonicals are self-canonical on every page.** Every page's canonical URL points at itself via `buildMetadata({ alternates: { canonical: '...' } })`. No cross-page consolidation, no alternates. If `buildMetadata()` doesn't already set canonical, Phase 6 adds that support as part of the metadata audit.

### Accessibility rigor (no corners cut)

- **Skip-to-main link ships.** Invisible `<a href="#main">Skip to main content</a>` as the first focusable element in `<body>`, revealed on keyboard focus. Main content wrapper gets `id="main" tabIndex={-1}` so the target is focusable. Adds ~5 lines to the marketing layout, zero visual weight for sighted users.
- **Focus-visible ring = 2px brand crimson ring with 2px offset** on every interactive element (buttons, links, form fields, FAQ accordion triggers, nav toggles). Applied via `focus-visible:ring-2 focus-visible:ring-[crimson-token] focus-visible:ring-offset-2` as a Tailwind utility or base-layer rule. Must contrast against both light and dark section backgrounds — verify during the contrast audit.
- **Amber [PLACEHOLDER] testimonial banners get a real contrast audit.** Whatever amber value is in use must hit WCAG AA 4.5:1 text contrast against whatever background the banner appears on. If the current combination fails, fix it — darken text to near-black, shift the amber tone, or add a solid fill. Do NOT justify the banner as "decorative non-text 3:1" — it's a disclosure, not a decoration.
- **48×48 px tap target audit covers EVERY interactive element** — not just the Phase 2 conversion primitives. Header phone, StickyMobileCTA, all nav links, footer links, social icons, FAQ accordion headers, form fields + submit button, breadcrumb links, in-text anchor links, service grid cards. No exceptions. Elements that fail get padding added or hit-area expanded via `::before` pseudo-elements — never shrink the viewport or touch Phase 2 commitments.
- **Keyboard nav full-path walkthrough is part of the a11y plan.** Tab from top of any page to bottom, confirm every interactive element reaches focus in a sensible order, skip-link fires first, no focus traps. Manual check — Claude can't automate it.

### Performance budget + hero assets

- **Commit real placeholder roofing photos in Phase 6.** Pull 3–5 free-use roofing photos (Unsplash or Pexels — check license carefully for commercial use on a client site, document the source in a `public/images/SOURCES.md` file). Target paths: `/public/images/hero.webp`, `/public/images/about-hero.webp`, and any others components already reference. Resize + compress to <100 KB each, WebP format per project CLAUDE.md. Phase 8 handoff swaps them for real Raptor photos.
- **Lighthouse = HARD GATE, all 4 pillars ≥90 on all 7 pages.** Performance, Accessibility, Best Practices, SEO. 28 scores total. A single score below 90 on any page fails Phase 6 verification and triggers gap-closure planning. This is not negotiable — the whole point of Phase 6 is shipping audit-clean.
- **Bundle size = hard ceiling 200 KB First Load JS per route.** Enforcement mechanism is the `npm run build` route table — the planner builds a step that parses the build output and fails if any route exceeds 200 KB. No bundle analyzer tool installed (YAGNI), but the planner should document how Claude would add it later if a route needs debugging.
- **reCAPTCHA on `/contact` ships as-is.** The ~35 KB script + floating badge are accepted costs of the Phase 5 decision (invisible v3 scoped to `/contact` only, not sitewide). Phase 6 does NOT lazy-load the script on field focus and does NOT hide the badge with text disclosure. If `/contact`'s First Load JS exceeds 200 KB because of reCAPTCHA, that is a blocker that must be resolved — lazy-loading the script becomes a fallback in the gap-closure pass.
- **Hero image strategy: `priority` on above-the-fold images, `loading="lazy"` on everything below.** Use `next/image` everywhere. Homepage Hero + ServiceHero top images get `priority`. Map iframe on `/contact` is already `loading="lazy"` from Phase 5.

### Claude's Discretion

- Exact shade of crimson for the focus ring (uses existing brand token — pick the best contrast variant if multiple exist)
- Specific Unsplash/Pexels photos chosen for placeholder heroes (roofing-themed, NE/Midwest feel if possible)
- Whether to add a dev-time schema dump page or just static-inspect
- How to organize the a11y plan — one big plan vs split across 2–3 plans
- Exact format of the build-output bundle-size check script

</decisions>

<specifics>
## Specific Ideas

- **Real reasoning on indexability:** Andrew is fine letting the pitch URL be indexed because the real domain hasn't been bought yet, and any incidental traffic to the Vercel preview is either (a) zero, or (b) free. The Phase 7 flip swaps `NEXT_PUBLIC_SITE_URL` to the real domain, so sitemap.ts and every canonical update in one env var change.
- **Strict a11y is a brand-trust signal.** A contractor site that passes screen-reader testing cleanly reinforces the "we take things seriously" anti-chaser positioning. The whole reason the discussion picked the strict interpretation on all four a11y questions.
- **Hero placeholder photos must look plausible, not obviously fake.** A stock Unsplash roofing shot is fine. A 1×1 solid color is not — Lighthouse would pass but the pitch demo would be embarrassing. Photos also need to be committed as WebP under 100 KB per project CLAUDE.md.
- **Lighthouse hard gate drives the work order.** The plans should save Lighthouse-run verification for last in each plan, so any sub-90 score triggers a fix inside the same plan instead of waiting for phase verification.

</specifics>

<deferred>
## Deferred Ideas

- **Service area pages** (`/service-areas/omaha`, `/service-areas/papillion`, etc.) — NOT in Phase 6 scope. These are a separate future phase if/when the client prioritizes local SEO expansion. The existing service area pill tags on `/contact` are the whole footprint for now.
- **Analytics dashboard** (GSC + GA4 + call tracking) — belongs in a post-launch phase, not Phase 6.
- **Lazy-load reCAPTCHA on first input focus** — only activates as a fallback if `/contact` exceeds the 200 KB bundle budget during Phase 6 verification.
- **Schema dump `/dev/schema` route** — not building it in Phase 6. Deferred to Phase 7 if Rich Results Test catches anything unexpected.
- **Bundle analyzer (`@next/bundle-analyzer`)** — not installed in Phase 6. Install only if a specific bundle investigation demands it.
- **Verified-review scaffolding in testimonials.ts** — not pre-built. Added post-handoff when Raptor supplies real review data.
- **Post-launch Resend provider swap** — Phase 5 decision, already handled via `EMAIL_PROVIDER` env var flip. Not a Phase 6 concern.

</deferred>

---

*Phase: 06-seo-performance-accessibility*
*Context gathered: 2026-04-15*
