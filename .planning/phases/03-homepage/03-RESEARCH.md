# Phase 3 Research: Homepage

**Researched:** 2026-04-14
**Domain:** Next.js 16 App Router homepage composition, section components, schema markup
**Confidence:** HIGH (all findings from direct file inspection of the live codebase)

---

## Existing Project Surface

### src/content/site.ts
- `siteConfig` exports: `name`, `tagline`, `description`, `url`, `phone.display/href/emergency`, `address.street/city/state/zip/full`, `email`, `hours[]`, `license.number/bonded/insured/displayText`, `founding.year/yearsInBusiness`, `reviews.count/rating/platform`, `socialLinks.facebook/instagram/google`, `serviceAreas[]`, `certifications[]`
- `address.state` (not `.region`) and `address.zip` (not `.postalCode`) — use these field names exactly
- Hours guard pattern confirmed in Footer: `h.closed || h.open === ""`
- `founding.yearsInBusiness` is computed at module init via `new Date().getFullYear() - 2009`

### src/content/services.ts
- 4 services: `roofing`, `siding`, `gutters`, `emergency-tarping`
- Shape: `slug`, `shortTitle`, `title`, `headline`, `iconName` (lucide-react name), `description`, `features[]`, `isEmergency`, `heroImagePath`, `heroImageAlt`, `metadata.title/description`, `processSteps[]`, `relatedSlugs[]`
- Icon names used: `Home` (roofing), `Layers` (siding), `Droplets` (gutters), `AlertTriangle` (emergency-tarping)
- All four icons confirmed present in lucide-react v1.8.0

### src/content/testimonials.ts
- `Testimonial` shape: `id`, `name`, `city`, `rating`, `quote`, `date`, `serviceSlug`, `isPlaceholder: boolean`
- **6 entries exist** (t1–t6) — all `isPlaceholder: true` — exceeds the minimum 5 for carousel
- No content gap here. Phase 3 does NOT need to add entries.
- FTC compliance: `isPlaceholder` flag drives the amber banner in UI

### src/content/faqs.ts
- `FAQ` shape: `id`, `question`, `answer`, `category: FaqCategory`, `serviceSlug?`
- **10 FAQ entries exist** (faq-1 through faq-10) — well above the 6 needed
- Phase 3 must select 6 for the homepage accordion. Recommended selection (covers all CONTEXT.md topics):
  - faq-7 (how long does replacement take — process)
  - faq-5 (work with insurance adjusters — insurance)
  - faq-9 (what warranty do you provide — warranty)
  - faq-2 (storm chaser vs legitimate roofer — anti-chaser differentiator)
  - faq-4 (will insurance cover replacement — insurance)
  - faq-8 (do I need to be home — process / reassurance)
- No content gap. Phase 3 curates from existing data, does not add entries.

### src/lib/metadata.ts — buildMetadata()
- **Canonical URL is already supported.** `alternates.canonical` is set to `${siteUrl}${path}` inside `buildMetadata()`.
- `path` param defaults to `"/"` — homepage call can omit `path` or pass `path: "/"` explicitly.
- `useAbsoluteTitle: true` bypasses the root title template. Use it for the homepage title since it should be the brand's primary statement.
- No changes needed to `metadata.ts` for Phase 3.

### src/lib/schema.tsx
- `JsonLd` RSC component: renders `<script type="application/ld+json">` with XSS sanitization. Accepts `WithContext<HomeAndConstructionBusiness | SchemaService | FAQPage | BreadcrumbList>`.
- `localBusinessSchema()` — already mounted in `Footer.tsx`. Homepage page.tsx must NOT mount it again.
- `faqPageSchema(faqItems: FAQ[])` — **already exists**. Takes `FAQ[]`, returns `WithContext<FAQPage>`. No addition needed.
- `serviceSchema()` and `breadcrumbSchema()` exist but are not used in Phase 3.

### src/app/(marketing)/page.tsx
- Currently a Phase 1 placeholder: one `<h1>`, no imports, no metadata export.
- Phase 3 fully replaces this file.

### src/app/(marketing)/layout.tsx
- Wraps `children` with `<Header>`, `<Footer>`, `<StickyMobileCTA>`.
- `<main id="main-content">` with `pb-[var(--sticky-cta-height)] md:pb-0` — the sticky CTA height is already accounted for.
- Homepage's `<section id="estimate-form">` must be inside `children` — the `id` anchor is correctly reachable.

### src/app/layout.tsx (root)
- `metadataBase` set to `process.env.NEXT_PUBLIC_SITE_URL ?? "https://raptor-roofing.vercel.app"`
- Title template: `"%s | Raptor Roofing — Omaha Roofer"` — if homepage uses `useAbsoluteTitle: true`, it bypasses template.
- `robots: { index: true, follow: true }` set at root — no need to repeat at page level.

### public/ directory
- `public/images/` — exists but empty (only `.gitkeep`). No placeholder photo assets exist yet.
- `public/og/` — exists but empty (only `.gitkeep`).
- Hero image path referenced in `services.ts` is `/images/roofing-hero-placeholder.jpg` — this file does NOT exist.

### Phase 2 components confirmed shipped
- `TrustStrip`, `Header`, `Footer`, `StickyMobileCTA`, `MobileMenuButton` — all in `src/components/layout/`
- No `src/components/sections/` directory exists yet — Phase 3 creates it.
- `TrustStrip` uses `Star`, `BadgeCheck`, `ShieldCheck`, `Calendar`, `Award` from lucide-react — all confirmed present.
- Footer uses `ExternalLink`, `Share2`, `Phone`, `Mail`, `MapPin`, `Clock` — all confirmed present.
- Footer `<h2>` tags exist in 4 columns (company name, Services, Service Areas, Trust & Legal). Phase 3 sections must use their own heading hierarchy without conflicting. Page `<h1>` is in the hero; section headers are `<h2>`; sub-items in sections can be `<h3>`. Footer `<h2>`s are inside `<footer>`, not `<main>`, so heading outline is clean.

### globals.css
- `.placeholder-banner` class already defined — amber background `#fef3c7`, border `#f59e0b`, text `#92400e`. Phase 3 testimonial cards use this class directly.
- `--color-overlay: rgba(13, 20, 23, 0.6)` defined — use for hero dark overlay.
- `--color-background: #faf7f2` and `--color-surface: #ffffff` defined.
- Tailwind v4 CSS-first: custom tokens are in `@theme` block, not `tailwind.config`. Dynamic class construction with string interpolation is unsafe — all class names must be static strings.

### next.config.ts
- Completely empty (`{}`). No `images.remotePatterns` configured.
- **Using a remote Unsplash URL as the hero `<Image>` src will fail at runtime** — Next.js Image requires remote domains to be explicitly whitelisted. Either (a) download placeholder to `/public/images/`, or (b) add `images.remotePatterns` to `next.config.ts`.
- Recommendation: download a single placeholder JPG to `/public/images/hero-placeholder.jpg` so no config change is needed and the file is committed with the project.

### Lucide-react v1.8.0 confirmed icons for Phase 3
All icons needed by Phase 3 components are present:
- `Home`, `Layers`, `Droplets`, `AlertTriangle` — ServiceGrid icon names from `services.ts`
- `CheckCircle`, `XCircle`, `Check`, `X` — WhyNotChaser check/cross marks
- `ChevronLeft`, `ChevronRight`, `ChevronDown` — carousel arrows, accordion chevron
- `FileSearch`, `Camera`, `Handshake` — Insurance3Step step icons (Inspect/Document/Coordinate)
- `Star` — testimonial rating stars
- `Phone` — LeadForm trust line and CTA
- `Shield`, `ShieldCheck`, `BadgeCheck` — trust signal icons
- `HardHat`, `Wrench`, `Hammer` — alternative service icons if needed

---

## Content Gaps

None blocking. Summary:
- `faqPageSchema()` — already exists in schema.tsx. No addition needed.
- `buildMetadata()` canonical — already supported via `alternates.canonical`. No change needed.
- Testimonials count — 6 entries, all `isPlaceholder: true`. Meets 5-card minimum.
- FAQ count — 10 entries. Phase 3 curates 6 for the accordion.
- Hero image — `/public/images/hero-placeholder.jpg` does NOT exist. Phase 3 plan must include a task to download/provide a real placeholder photograph (JPG/WEBP/AVIF) before the hero component can render. This is the only content gap.
- Insurance carrier logos — `/public/images/` has no logo files. Phase 3 InsuranceLogos component renders `<Image>` tags pointing to files that don't exist yet. Plan must either (a) use inline SVG placeholders, or (b) download 5 placeholder greyscale images. Inline SVG placeholder badges labeled "[PLACEHOLDER]" are the simpler path for Phase 3.

---

## Component Architecture Recommendations

### RSC vs Client split — one-line rule per component

| Component | Directive | Justification |
|-----------|-----------|---------------|
| `Hero.tsx` | RSC (no directive) | Static photo, static text, two `<a>` and `<Link>` elements — no interactivity |
| `ServiceGrid.tsx` | RSC | Maps over `services` array — pure data rendering |
| `ServiceCard.tsx` | RSC | Sub-component of ServiceGrid — display only |
| `WhyNotChaser.tsx` | RSC | Static two-column table — no state |
| `Insurance3Step.tsx` | RSC | Static numbered cards — no state |
| `TestimonialCarousel.tsx` | `"use client"` | Requires `useState` for active card index and arrow navigation |
| `InsuranceLogos.tsx` | RSC | Static logo row |
| `FaqAccordion.tsx` | `"use client"` | Requires `useState` for open item tracking |
| `FinancingCallout.tsx` | RSC | Static callout with placeholder banner |
| `LeadForm.tsx` | `"use client"` | `useState` for field values, validation state, and submission state |

The `page.tsx` itself remains RSC — it composes RSC sections and three client islands (`TestimonialCarousel`, `FaqAccordion`, `LeadForm`). `generateMetadata` export is also RSC-compatible.

### FAQPage JSON-LD placement
Mount `<JsonLd data={faqPageSchema(homepageFaqs)} />` inside `FaqAccordion.tsx` as a sibling to the accordion UI, not in `page.tsx`. This co-locates schema with the UI it describes and keeps `page.tsx` free of schema import sprawl. Because `JsonLd` is an RSC and `FaqAccordion` is a client component, the `JsonLd` call must be done either (a) in a thin RSC wrapper that renders both `<JsonLd>` and `<FaqAccordionClient>`, or (b) directly in `page.tsx` alongside the `<FaqAccordion>`. **Simpler: render `<JsonLd data={faqPageSchema(homepageFaqs)} />` in `page.tsx` immediately before `<FaqAccordion>`** — avoids needing an RSC wrapper pattern around a client component.

---

## Implementation Patterns

### Hero image with next/image
- Download one real stock photograph (roof crew on suburban house, landscape orientation, ≥1920px wide) to `/public/images/hero-placeholder.jpg`.
- `<Image src="/images/hero-placeholder.jpg" alt="..." fill priority fetchPriority="high" sizes="100vw" className="object-cover" />`
- The container `<section>` uses `relative` positioning; the Image receives absolute fill. Dark overlay is a sibling `<div className="absolute inset-0 bg-[var(--color-overlay)]" aria-hidden="true" />`. Content sits above overlay with `relative z-10`.
- Hero height: `min-h-[100dvh]` or `min-h-screen` with `lg:min-h-[90vh]` — `100dvh` is the modern mobile-safe unit that excludes browser chrome. No Tailwind arbitrary values with env() — the layout.tsx `main` already handles the sticky CTA offset via `pb-[var(--sticky-cta-height)]`.
- Hero section does NOT need `id` on its own; the `#estimate-form` anchor lives on the LeadForm section.

### FaqAccordion (no external library)
**Recommendation: `<details>`/`<summary>` native HTML.** Reasons:
1. Zero JS for expand/collapse — no `useState` needed — the component can stay RSC.
2. Natively keyboard accessible (Enter/Space on `<summary>`, no extra event handlers needed).
3. Focus-visible already handled by the global `*:focus-visible` rule in globals.css.
4. One-at-a-time behavior can be approximated with JS but is not required by CONTEXT.md (both behaviors acceptable per decisions).
5. FAQPage JSON-LD does not care about open/closed state — schema reflects all Q&A pairs regardless.

If the planner prefers animated expand (CSS `grid-rows` transition), a lightweight `"use client"` wrapper with `useState` tracking `openId: string | null` is acceptable. The `<details>` approach ships with zero bundle addition.

**`<details>`/`<summary>` pattern:**
```
// FaqAccordion.tsx — RSC, no "use client"
// Wrap in <section aria-label="Frequently Asked Questions">
// Each item: <details className="..."><summary className="...">Q</summary><p>A</p></details>
// Add ChevronDown icon in summary, rotated 180deg on [open] pseudo-class via CSS
// CSS: details[open] .faq-chevron { transform: rotate(180deg); }
```

### TestimonialCarousel (no external library)
**Recommendation: React state with CSS `translate` + `opacity` transitions, "use client".**

CSS scroll-snap is RSC-friendly but cannot enforce single-card-visible reliably across all viewports and doesn't support dot indicator sync without JS. React state with `useState(activeIndex)` is simpler, predictable, and easy to keep accessible.

Pattern:
- `const [active, setActive] = useState(0)` in client component
- Cards rendered in a `relative overflow-hidden` container; each card is `absolute inset-0 transition-opacity duration-300` with `opacity-0 pointer-events-none` when not active
- Prev/Next buttons: `<button onClick={() => setActive((a) => (a - 1 + n) % n)}>`
- Dots: `testimonials.map((_, i) => <button aria-label={...} aria-current={i === active}>)`
- Accessibility: button `aria-label="Previous testimonial"` / `"Next testimonial"`, dot buttons include `aria-label="Go to testimonial N"`, `aria-current={i === active ? 'true' : undefined}`
- Each card: `role="group"` with `aria-label={`Testimonial from ${t.name}, ${t.city}`}`
- Placeholder banner: `<span className="placeholder-banner" role="alert">` (uses pre-defined CSS class from globals.css, `role="alert"` ensures screen readers announce it)

### LeadForm stub (UI + client validation, no POST)
- `"use client"` component with `useState` for `{ name, phone, service, zip, status: 'idle'|'success' }`
- `<form onSubmit={handleSubmit}>` with `e.preventDefault()` — explicit prevent default avoids any accidental page reload
- React 19 form actions are NOT preferred here — they integrate with server actions which are Phase 5 territory. `onSubmit` handler is easier to port: Phase 5 just replaces the console.log with a fetch() call to the webhook.
- Phone validation: `type="tel"` + client check `value.replace(/\D/g,'').length >= 10`
- ZIP validation: `/^\d{5}$/.test(value)`
- Name validation: `value.trim().length >= 2`
- Service: `<select>` with `services.map(s => <option value={s.slug}>{s.shortTitle}</option>)`
- Submission in Phase 3: `console.log('[Phase 3 stub] form data:', data)` + `setStatus('success')` showing a success message. Add a `// TODO Phase 5: replace with fetch() to POST handler` comment.
- `<button type="submit">` with explicit type to prevent ambiguous form submission.

### Insurance carrier logos
- Phase 3 uses inline SVG placeholder blocks — 5 gray rounded rectangles with carrier name text (e.g., "State Farm", "Allstate", "Farmers", "USAA", "Liberty Mutual") — rather than real `<Image>` files. No `/public/images/carrier-*.jpg` files exist and creating them is a Phase 8 handoff item.
- Wrap each placeholder in `<div aria-label="[Carrier name] — logo placeholder">` for screen readers.
- Grayscale treatment: `filter: grayscale(1)` or Tailwind `grayscale` utility on the container.

### Anchor scroll for `#estimate-form`
- The LeadForm section `<section id="estimate-form">` gets `scroll-margin-top` to offset the sticky header (64px/80px on desktop).
- In Tailwind v4 with CSS-first, use `className="scroll-mt-16 lg:scroll-mt-20"` (maps to 4rem/5rem, matching header `h-16`/`h-20` from Header.tsx).
- StickyMobileCTA already uses `href="/#estimate-form"` (confirmed in StickyMobileCTA.tsx). Hero estimate CTA: `<Link href="/#estimate-form">` (or `href="#estimate-form"` if on the same page — both work in App Router for same-page navigation; prefer `href="#estimate-form"` for hero since it's on the same page to avoid a full navigation).

### FinancingCallout
- Full-width section with a large amber `[PLACEHOLDER]` banner. Use `.placeholder-banner` CSS class from globals.css.
- Copy: `"Financing available — as low as $[PLACEHOLDER]/mo"` with the entire dollar amount inside a `<span className="placeholder-banner">`.
- Section bg: `bg-warm-50` or `bg-neutral-50` — contrasts with the adjacent dark LeadForm section (bg-primary-600).

---

## SEO + Metadata Plan

### Homepage generateMetadata
```typescript
export const metadata = buildMetadata({
  title: "Omaha Roofing Services | Raptor Roofing",
  description: "Family-owned Omaha roofer since 2009. Roof replacement, siding, gutters, and 24/7 emergency tarping. No subcontractors, no pressure. Call (402) 885-1462 for a free estimate.",
  path: "/",
  useAbsoluteTitle: true,
});
```
- Title: 43 chars — under 60 limit.
- Description: 162 chars above — trim to ≤155: "Family-owned Omaha roofer since 2009. Roof replacement, siding, gutters & 24/7 emergency tarping. Licensed & insured. Call for a free estimate." = 144 chars. ✓
- `useAbsoluteTitle: true` bypasses the root template `"%s | Raptor Roofing — Omaha Roofer"` — avoids double-branding.
- `path: "/"` sets canonical to `https://raptor-roofing.vercel.app/`.

### Hero H1
- The hero `<h1>` is the page's only H1. Must not duplicate the title tag verbatim.
- Locked angle from CONTEXT.md: "The Family-Owned Roofer Omaha Calls Back." — natural, readable, distinct from the SEO title. Good.
- Section headings (`<h2>`) for: Services, Why Not a Storm Chaser, How We Handle Your Insurance Claim, What Our Customers Say, Frequently Asked Questions, Financing, Get a Free Estimate.

### FAQPage JSON-LD
- Render `<JsonLd data={faqPageSchema(homepageFaqs)} />` in `page.tsx` immediately before `<FaqAccordion faqs={homepageFaqs} />`.
- `homepageFaqs` is a curated `FAQ[]` slice — the same 6 items passed to both components must be identical, or Google's Rich Results test will find mismatch. Define `const homepageFaqs = [...]` once in `page.tsx` and pass it to both.
- Google validates that every `Question.name` in the JSON-LD has a matching visible `<details>` or `<div>` on the page. The `<details>`/`<summary>` approach makes this trivially true — Q is in `<summary>`, A is in the details body.

---

## Accessibility Requirements

### Form (LeadForm)
- Every `<input>` and `<select>` must have an explicit `<label htmlFor="...">` — not placeholder-only labeling.
- Error messages: `role="alert"` or `aria-live="polite"` on error containers so screen readers announce validation failures.
- Required fields: `required` attribute + `aria-required="true"`.
- Phone field: `type="tel"` + `inputMode="tel"` for mobile keyboard optimization.
- Submit button: `type="submit"` explicit. Disabled state during success: `aria-disabled="true"` rather than `disabled` (preserves focusability).

### Accordion (FaqAccordion with `<details>`)
- `<details>`/`<summary>` is natively accessible — no additional ARIA needed.
- Add `aria-label="Frequently Asked Questions"` on the section wrapper.
- Ensure `<summary>` contains only the question text + chevron icon with `aria-hidden="true"`.

### Carousel (TestimonialCarousel)
- Prev/Next buttons: `aria-label="Previous testimonial"` / `aria-label="Next testimonial"`, `type="button"`.
- Dot buttons: `aria-label="Go to testimonial {n} of {total}"`, `aria-current={active ? 'true' : undefined}`.
- Card container: `role="group"` with `aria-label`.
- Placeholder banner: `className="placeholder-banner"` with `role="status"` (not `alert` — it's informational, not urgent).
- Wrap carousel in `<section aria-label="Customer testimonials">`.

### Heading hierarchy in page.tsx
- `<h1>` in Hero (one only).
- `<h2>` for each section header (Services, Why Not a Chaser, Insurance Process, Testimonials, Insurance Partners, FAQ, Financing, Get an Estimate).
- `<h3>` for sub-items within sections (ServiceCard titles, WhyNotChaser column headers, Insurance3Step card titles, FAQ questions are in `<summary>` — not a heading).
- Footer `<h2>` tags live inside `<footer>`, outside `<main>` — they do not pollute the main content heading outline.

### Skip-link compatibility
- `<main id="main-content">` is set in marketing layout. The skip link in root `layout.tsx` targets `#main-content`. No action needed in Phase 3.

---

## Pitfalls to Avoid

1. **Hero image not marked `priority`** → LCP fails. The hero `<Image>` MUST have `priority` and `fetchPriority="high"`. Missing either causes a significant LCP penalty.

2. **Hero image src pointing to non-existent file** → Next.js returns 404 for `/images/hero-placeholder.jpg` because the file doesn't exist. Plan must include downloading a placeholder photo to `/public/images/` as the first task of 03-01.

3. **Remote Unsplash URL in `<Image>` without remotePatterns** → Next.js Image optimization will throw at build/runtime for unwhitelisted domains. Use a local file in `/public/`.

4. **`<button type="submit">` without `e.preventDefault()`** → Page reloads instead of running the JS handler. Always call `e.preventDefault()` in `onSubmit`.

5. **FAQPage JSON-LD questions don't match visible accordion content** → Google Rich Results test fails. The same `homepageFaqs` array must feed both `faqPageSchema()` and `<FaqAccordion>`.

6. **LocalBusiness JSON-LD re-mounted in page.tsx** → Duplicate structured data confuses Google. Footer already mounts it. Page.tsx must only mount `FAQPage` schema.

7. **`<section id="estimate-form">` missing `scroll-margin-top`** → Clicking "Free Estimate" scrolls the section under the sticky header (64px). Add `scroll-mt-16 lg:scroll-mt-20` to the section.

8. **Testimonial cards without visible placeholder banner** → FTC compliance risk. Every card where `isPlaceholder === true` must show the `.placeholder-banner` element — not just a code comment.

9. **Tailwind v4 dynamic class construction** → v4 CSS-first purging will strip classes not present as complete static strings. `bg-${color}-600` pattern breaks. All Tailwind class names in Phase 3 must be static strings.

10. **`<a href="/services/roofing">` on internal links** → Triggers ESLint `@next/next/no-html-link-for-pages`. Use `<Link href="/services/roofing">` for all internal navigation.

11. **ServiceCard links to `/services/{slug}` pages that don't exist yet** → These pages are built in Phase 4. In Phase 3, the links should still be `<Link href={`/services/${s.slug}`}>` — they will 404 until Phase 4 but that's expected during development. Do not use `<a>` tags.

12. **100vh on mobile** → iOS Safari's address bar causes `100vh` to overflow visible area. Use `min-h-screen` (which maps to `100dvh` in Tailwind v4) or explicit `min-h-[100dvh]`. Verify that Tailwind v4's `min-h-screen` uses `dvh` or fall back to explicit `min-h-[100dvh]`.

13. **Lucide icon not exported** → `HandShake` (camelCase) does not exist — `Handshake` does. Always verify exact export name before using.

14. **`<h2>` inside ServiceCard or Insurance3Step card** → If service card titles are `<h3>` nested inside a `<h2>`-headed section, that's correct. Do not accidentally assign `<h2>` to individual card titles — it breaks heading outline.

15. **FinancingCallout `[PLACEHOLDER]` copy rendered without the banner** → The dollar amount `$[PLACEHOLDER]/mo` MUST be wrapped in `.placeholder-banner` or similar visible marker — not just text with brackets.

---

## Recommended File Structure

All 10 new components go in `src/components/sections/` (directory does not exist — Phase 3 creates it).

| File | Plan | Directive |
|------|------|-----------|
| `src/components/sections/Hero.tsx` | 03-01 | RSC |
| `src/components/sections/ServiceGrid.tsx` | 03-02 | RSC |
| `src/components/sections/ServiceCard.tsx` | 03-02 | RSC (sub-component, may be inlined) |
| `src/components/sections/WhyNotChaser.tsx` | 03-02 | RSC |
| `src/components/sections/Insurance3Step.tsx` | 03-02 | RSC |
| `src/components/sections/TestimonialCarousel.tsx` | 03-03 | `"use client"` |
| `src/components/sections/InsuranceLogos.tsx` | 03-03 | RSC |
| `src/components/sections/FaqAccordion.tsx` | 03-03 | RSC (`<details>`) or `"use client"` |
| `src/components/sections/FinancingCallout.tsx` | 03-03 | RSC |
| `src/components/sections/LeadForm.tsx` | 03-04 | `"use client"` |
| `src/app/(marketing)/page.tsx` | 03-04 | RSC (replaces placeholder) |

Plan 03-04 also handles:
- `generateMetadata` export in `page.tsx` via `buildMetadata()`
- Composing all 10 section components in correct order
- Mounting `<JsonLd data={faqPageSchema(homepageFaqs)} />` in `page.tsx`
- Adding `scroll-mt-16 lg:scroll-mt-20` to the LeadForm section

### Hero placeholder asset task (belongs in 03-01)
- Download one landscape stock photo of a roofing crew on a suburban house to `/public/images/hero-placeholder.jpg`
- Minimum dimensions: 1200×800px, JPG format
- This is a prerequisite before `<Image src="/images/hero-placeholder.jpg">` works

---

## Open Questions for Planner

1. **Hero anchor navigation**: Should the hero "Request a Free Estimate" button use `href="#estimate-form"` (same-page hash) or `href="/#estimate-form"` (full path + hash)? On the homepage they're equivalent, but `#estimate-form` is cleaner and avoids a navigation event. The planner should standardize this and note it in the Hero task.

2. **FaqAccordion one-open vs multiple-open**: CONTEXT.md says "both are acceptable." The `<details>` RSC approach allows multiple open simultaneously (default `<details>` behavior). If one-open-at-a-time is desired (better UX), the planner must specify `"use client"` with `useState`. The planner should pick one and commit.

3. **ServiceCard links while Phase 4 is incomplete**: Cards link to `/services/{slug}` which 404 until Phase 4. Planner should note this is expected and acceptable during development.

4. **Insurance carrier logo strategy**: Inline SVG placeholder badges vs. `<Image>` pointing to `/public/images/` files that need to be created. Planner needs to decide which approach for 03-03.

5. **Hero photo source**: Planner must either (a) specify a concrete stock photo URL to download, or (b) defer to the implementer to find one. The constraint is: it must be a real JPG/WEBP photograph, not SVG, and must be in `/public/images/`. A task step should include this explicitly.

6. **`id="services"` on ServiceGrid section**: Header nav links to `/#services` (confirmed in Header.tsx). The ServiceGrid section should have `id="services"` to make that anchor work. The planner should specify this in the ServiceGrid task.

---

## Sources

### Primary (HIGH confidence — direct file inspection)
- `src/content/site.ts` — all field names and types verified
- `src/content/services.ts` — 4 services, all shapes confirmed
- `src/content/testimonials.ts` — 6 entries, `isPlaceholder: boolean` flag confirmed
- `src/content/faqs.ts` — 10 entries, shape confirmed
- `src/lib/metadata.ts` — `buildMetadata()` signature and canonical support confirmed
- `src/lib/schema.tsx` — `faqPageSchema()` exists, `JsonLd` RSC component shape confirmed
- `src/app/(marketing)/page.tsx` — placeholder state confirmed
- `src/app/(marketing)/layout.tsx` — `main#main-content` wrapper confirmed
- `src/app/layout.tsx` — root metadata, title template, metadataBase confirmed
- `src/components/layout/` — all Phase 2 components confirmed present
- `src/app/globals.css` — `.placeholder-banner`, `--color-overlay`, all tokens confirmed
- `next.config.ts` — empty config, no remotePatterns confirmed
- `public/` — directory structure, no image assets exist confirmed
- `node_modules/lucide-react` — all needed icon exports verified against v1.8.0

**Research date:** 2026-04-14
**Valid until:** Stable (all findings from committed code, not external docs)
