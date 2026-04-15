# Phase 4: Service Pages - Research

**Researched:** 2026-04-14
**Domain:** Next.js 16 App Router static service pages — content-driven, schema-injecting, lead-capturing
**Confidence:** HIGH — all findings based on direct codebase inspection

---

## Summary

Phase 4 builds four service pages using a shared template component and the existing content, schema, and UI infrastructure from Phases 1-3. The codebase is well-prepared: `services.ts` already has all the data fields Phase 4 needs (with gaps noted below), `schema.tsx` already has `serviceSchema()` and `breadcrumbSchema()` factories ready to use, `buildMetadata()` already supports canonical via `alternates.canonical`, and `LeadForm` just needs a `defaultService` prop added.

The main implementation work is: (1) decide static vs dynamic routes (research recommends static folders), (2) build `ServicePageTemplate` with the right props shape, (3) extend `LeadForm` with `defaultService`, (4) extend `services.ts` with per-service FAQs and problem checklist arrays, (5) build a `ServiceHero` component (homepage `Hero` is not reusable — it is hardcoded), and (6) apply correct JSON-LD on each page.

**Primary recommendation:** Use static route folders (`app/(marketing)/services/roofing/page.tsx` etc.), not a dynamic `[slug]` route. Each page is a unique, independently-deployable unit with its own metadata export and JSON-LD — no runtime slug resolution needed.

---

## Research Goal 1: File Structure — Static Folders vs Dynamic Route

### Recommendation: Static Route Folders

**Use:**
```
src/app/(marketing)/services/
  roofing/page.tsx
  siding/page.tsx
  gutters/page.tsx
  emergency-tarping/page.tsx
```

**Do NOT use:** `app/(marketing)/services/[slug]/page.tsx`

**Rationale (all HIGH confidence, verified by inspection):**

1. **`metadata` must be a static export** — Next.js 16 App Router requires `export const metadata = ...` or `export async function generateMetadata()` at the file level. A dynamic route with `generateMetadata({ params })` works but adds indirection. Since there are exactly four known services with unique metadata, static exports per file are simpler, more explicit, and eliminate any risk of param-resolution bugs.

2. **No `generateStaticParams()` needed** — With static folders, Next.js renders each page at build time automatically. With `[slug]`, you must export `generateStaticParams` returning all four slugs or each build attempt may fail. Static folders eliminate this requirement entirely.

3. **JSON-LD per page is explicit** — Each page file calls `serviceSchema(service)` and `faqPageSchema(faqs)` independently with no conditional logic. With a dynamic route, every page calls the same function — which works but makes it harder to verify page-specific JSON-LD at code review.

4. **Emergency Tarping has structural divergence** — The emergency-tarping page requires a giant phone number display and an insurance documentation block not present on the other three pages. With static files, these extensions are trivially added to that one file. With a dynamic `[slug]` route, they require conditional branching inside the template.

5. **`[slug]` offers no real benefit here** — Dynamic routes help when you have unknown or many pages (e.g., 50 service-area pages). Four known pages gain nothing from it and lose clarity.

**The `/services` index route is NOT required by the plan** but can be added later as a `app/(marketing)/services/page.tsx` that lists all four services using `<ServiceGrid />`.

---

## Research Goal 2: ServicePageTemplate Component Design

### Verified: Hero component is NOT reusable

`src/components/sections/Hero.tsx` (lines 1-248) is **completely hardcoded** — the background image is a literal string `/images/hero-placeholder.jpg`, the H1 is hardcoded as "The Family-Owned Roofer Omaha Calls Back.", the trust signals are hardcoded SVGs, and `LeadForm` is embedded directly. There is no props interface on `Hero`. **Phase 4 must create a new `ServiceHero` component.**

### ServicePageTemplate Props Shape

The template receives one `Service` object (from `services.ts`) plus page-level config. Based on what the sections need:

```typescript
// src/components/templates/ServicePageTemplate.tsx

interface ServicePageTemplateProps {
  service: Service;                   // from @/content/services — contains slug, title, headline,
                                      // subheadline, heroImagePath, heroImageAlt, processSteps,
                                      // relatedSlugs, isEmergency, features
  faqs: FAQ[];                        // per-service FAQ array passed from page file
  testimonials: Testimonial[];        // subset filtered by serviceSlug (use getTestimonialsByService)
  relatedServices: Service[];         // use getRelatedServices(service.slug) from services.ts
}
```

The `service` object already carries everything except FAQs (see Goal 4 below). FAQs and testimonials are passed explicitly so the page file controls which items appear and the JSON-LD injected in the page file matches exactly what the component renders — this is the pattern used on the homepage (homepageFaqs feeds both `<FaqAccordion>` and `faqPageSchema()`).

### Emergency Tarping Extension Pattern

The `service.isEmergency` boolean (already in `Service` interface, already `true` for emergency-tarping) controls conditional sections inside the template:

```typescript
// Inside ServicePageTemplate
{service.isEmergency && (
  <EmergencyPhoneBlock />   // giant 48px+ tel: link card
)}
{service.isEmergency && (
  <InsuranceDocBlock />     // "we document damage before we tarp" reassurance
)}
```

This avoids conditional imports in the page files — the template handles it internally based on the flag.

### Sections the Template Renders (in scroll order per CONTEXT.md)

1. `<ServiceBreadcrumb>` — visible breadcrumbs, receives `service.title` and `service.slug`
2. `<ServiceHero>` — new component (see Goal 7), receives `service`
3. Problem section — renders `service.problemChecklist` (array, not yet in services.ts — see Goal 4)
4. Process section — renders `service.processSteps` (already in services.ts)
5. Mid-page CTA band — static template section with phone + estimate CTA
6. `<TrustStrip />` — import as-is from `@/components/layout/TrustStrip`, no props needed
7. Before/after gallery — 2-4 `[PLACEHOLDER]` labeled slots (no props needed at this stage)
8. `<TestimonialCarousel testimonials={testimonials} />` — needs prop (see Goal 3-adjacent note below)
9. `<FaqAccordion faqs={faqs} />` — already accepts `faqs: FAQ[]` prop, ready to use
10. Related Services grid — 3 cards, receives `relatedServices`
11. `<LeadForm defaultService={service.slug} />` — needs new prop (see Goal 3)

**Important:** `TestimonialCarousel` currently reads `testimonials` directly from `@/content/testimonials` (hardcoded import, line 6 of TestimonialCarousel.tsx). It accepts no props. To render a service-scoped subset, either: (a) add a `testimonials` prop to `TestimonialCarousel`, or (b) create a thin wrapper `ServiceTestimonialCarousel` that filters and passes a subset. Option (a) is simpler — add `testimonials?: Testimonial[]` prop with fallback to the full array.

---

## Research Goal 3: LeadForm — defaultService Prop

### Current State (verified by inspection of LeadForm.tsx lines 1-242)

- `LeadForm` is a **client component** (`"use client"` at line 1)
- Component signature: `export function LeadForm()` — **no props at all**
- Service state initialized as: `const [service, setService] = useState("")` — always starts empty
- The `<select>` renders options from `services` array: `services.map((s) => <option key={s.slug} value={s.slug}>{s.shortTitle}</option>)`
- The component has `id="estimate-form"` on its wrapper div (line 43)
- The `scroll-mt-20 lg:scroll-mt-24` classes handle header offset for anchor scrolling

### Required Change

Add a single optional prop `defaultService?: string` and use it to initialize the service state:

```typescript
// BEFORE
export function LeadForm() {
  const [service, setService] = useState("");

// AFTER
interface LeadFormProps {
  defaultService?: string;
}

export function LeadForm({ defaultService = "" }: LeadFormProps) {
  const [service, setService] = useState(defaultService);
```

That is the **only change needed** to LeadForm. The `id="estimate-form"` stays on the wrapper so the hero's "Free Estimate" anchor link resolves correctly on service pages too.

**Do not fork the component.** The CONTEXT.md decision is clear: same component, `defaultService` prop only.

**Homepage usage stays unchanged** — `<LeadForm />` with no props continues to work because `defaultService` defaults to `""`.

---

## Research Goal 4: services.ts — Gap Analysis

### What Already Exists (HIGH confidence — verified by inspection)

All four services exist with these fields populated and correct:
- `slug`, `title`, `shortTitle` — ready to use
- `headline` — formatted as `[Service] in Omaha, NE` per CONTEXT.md decision (verified: "Roof Replacement & Repair in Omaha", "Siding Replacement & Repair in Omaha", etc.)
- `subheadline` — present for all four
- `description` — present, used for Service JSON-LD description
- `problemCopy` — **present as a prose string**, not a checklist array (see gap below)
- `processSteps: ServiceProcessStep[]` — present and fully populated for all four services (roofing has 4 steps, others have 3 steps, emergency-tarping has 4 steps)
- `features: string[]` — present (4-5 items per service)
- `relatedSlugs: string[]` — present for all four (3 siblings each)
- `heroImagePath` — present as placeholder paths (e.g., `/images/roofing-hero-placeholder.jpg`)
- `heroImageAlt` — present
- `iconName` — present (`"Home"`, `"Layers"`, `"Droplets"`, `"AlertTriangle"`)
- `isEmergency: boolean` — present; `true` only for emergency-tarping
- `metadata.title` and `metadata.description` — present and correctly formatted for all four

Helper functions already exported:
- `getServiceBySlug(slug)` — returns `Service | undefined`
- `getRelatedServices(slug)` — returns `Service[]` (filters by `relatedSlugs`)

### What Is Missing (Phase 4 Must Add)

**Gap 1: `problemCopy` is a prose string, not a checklist array**

The CONTEXT.md decision specifies a "symptom-led checklist (homeowner-observable signs)" — a scannable bullet list. The current `problemCopy` field is a prose paragraph (e.g., "Most Omaha homeowners don't know their roof is failing..."). This field cannot be rendered as a checklist without modification.

**Required action:** Add `problemChecklist: string[]` field to the `Service` interface and populate it for all four services. The existing `problemCopy` prose string can remain as the section intro paragraph above the checklist, or be replaced. Do NOT rename/remove `problemCopy` — check if anything currently consumes it (ServiceGrid does not; it uses `description`).

**Gap 2: No per-service FAQ arrays**

The `faqs.ts` file has `serviceSlug?: string` on each FAQ and exports `getFaqsByService(serviceSlug)`. However, `services.ts` has no reference to FAQs — service pages must call `getFaqsByService(service.slug)` from `faqs.ts` at the page level.

Current FAQ coverage by service (verified by inspection of faqs.ts):
- `roofing`: faq-1, faq-3, faq-4, faq-5 (but faq-4 and faq-5 don't have serviceSlug), faq-7, faq-9
- Only faq-1 (`serviceSlug: "roofing"`), faq-3 (`serviceSlug: "roofing"`), faq-7 (`serviceSlug: "roofing"`), faq-9 (`serviceSlug: "roofing"`) are actually tagged
- `siding`, `gutters`, `emergency-tarping`: **ZERO** service-specific FAQs exist in faqs.ts

**Required action:** Phase 4 must add 3-5 service-specific FAQs per service to `faqs.ts` for siding, gutters, and emergency-tarping. Roofing has 4 tagged FAQs (faq-1, faq-3, faq-7, faq-9) which satisfies the 3-5 minimum, but 1-2 more roofing FAQs may be desired. All new FAQs must follow the existing `FAQ` interface with `serviceSlug` populated.

**Gap 3: No before/after gallery data**

No `beforeAfterImages` or similar field exists in `Service`. Phase 4 specifies 2-4 `[PLACEHOLDER]` labeled slots — these should be hardcoded in the template (not data-driven) since they are all placeholders for Phase 8 real photos. No data model change needed.

**Summary of services.ts changes needed:**
1. Add `problemChecklist: string[]` to `Service` interface
2. Populate `problemChecklist` for all 4 services
3. Add service-specific FAQs to `faqs.ts` for siding, gutters, emergency-tarping (and optionally more for roofing)

---

## Research Goal 5: BreadcrumbList + Service JSON-LD

### Current State (HIGH confidence — verified by inspection of schema.tsx lines 1-165)

Both factories already exist and are fully implemented:

**`serviceSchema(service: Service)`** (lines 99-118) — Returns `WithContext<SchemaService>`:
```typescript
// Already complete. Uses service.title, service.description,
// service.slug for URL construction, and siteConfig for provider.
// Output includes: name, description, url, provider, areaServed, serviceType
export function serviceSchema(service: Service): WithContext<SchemaService>
```

**`breadcrumbSchema(items: BreadcrumbItem[])`** (lines 150-165) — Returns `WithContext<BreadcrumbList>`:
```typescript
interface BreadcrumbItem {
  name: string;
  href: string;  // absolute or relative — function handles both
}
export function breadcrumbSchema(items: BreadcrumbItem[]): WithContext<BreadcrumbList>
```

**`faqPageSchema(faqItems: FAQ[])`** (lines 125-138) — Already used on homepage, ready to reuse.

**`JsonLd` server component** (lines 31-40) — Already typed to accept all three schema types via union in `JsonLdProps`. No changes needed to schema.tsx.

### How to Use on Service Pages

Each service page injects three JSON-LD blocks:

```typescript
// In each service page file:
<JsonLd data={serviceSchema(service)} />
<JsonLd data={breadcrumbSchema([
  { name: "Home", href: "/" },
  { name: "Services", href: "/#services" },
  { name: service.shortTitle, href: `/services/${service.slug}` },
])} />
<JsonLd data={faqPageSchema(serviceFaqs)} />
```

**Note on `href` for "Services" breadcrumb:** The site has no `/services` index page yet — use `/#services` (anchor to homepage ServiceGrid). If a `/services` index page is added later, update this.

**Note on LocalBusiness:** It is already mounted in `Footer.tsx` via `<JsonLd data={localBusinessSchema()} />`. Do NOT add it again in service pages.

---

## Research Goal 6: buildMetadata() Canonical Support

### Current State (HIGH confidence — verified by inspection of metadata.ts lines 1-85)

`buildMetadata()` **already supports canonical URLs** via `alternates.canonical`. Line 53:

```typescript
alternates: {
  canonical: canonicalUrl,  // = `${siteUrl}${path}`
},
```

The `path` parameter defaults to `"/"` and accepts any string. This was NOT missing — the flag in STATE.md was incorrect or from an earlier draft. No extension needed.

**Correct usage for service pages:**

```typescript
// In app/(marketing)/services/roofing/page.tsx
export const metadata = buildMetadata({
  title: service.metadata.title,           // "Roof Replacement in Omaha | Raptor Roofing"
  description: service.metadata.description,
  path: `/services/${service.slug}`,       // sets canonical to full URL
  useAbsoluteTitle: true,                  // title already includes brand name
});
```

The `metadata.title` and `metadata.description` fields are already populated for all four services in `services.ts`.

**OG image note:** `buildMetadata()` accepts `ogImage?: string` defaulting to `"/og/default.jpg"`. Service-specific OG images are a Phase 6 concern. Phase 4 should omit `ogImage` (use default) or pass a service-specific path that may not exist yet (acceptable — Vercel will serve a 404 for the image, not crash the page).

---

## Research Goal 7: Hero Component Reusability

### Verdict: NOT Reusable — Must Create ServiceHero

`Hero.tsx` (lines 1-248) is **entirely hardcoded**. It:
- Hardcodes `/images/hero-placeholder.jpg` as the background photo
- Hardcodes the H1 text
- Hardcodes all trust signals as inline JSX with no props
- Embeds `<LeadForm />` directly (right column of the 2-column grid)

The 5-layer visual stack (background photo, gradient overlay, noise texture, SVG divider, content) is the design pattern to preserve, but the content is not parameterized.

### ServiceHero Props Design

```typescript
// src/components/sections/ServiceHero.tsx (new file)

interface ServiceHeroProps {
  service: Service;
  // service.heroImagePath  — background photo
  // service.heroImageAlt   — background photo alt
  // service.headline       — H1 text (format: "[Service] in Omaha, NE")
  // service.subheadline    — micro-trust / subtext line
  // service.slug           — for "Free Estimate" anchor href="#estimate-form"
  // service.isEmergency    — controls whether giant phone number replaces/supplements form column
}
```

**Structural differences from homepage Hero:**

1. **Background photo:** Parameterized via `service.heroImagePath` instead of hardcoded. Use `next/image` with `fill`, `priority`, `sizes="100vw"` — same pattern as homepage Hero.

2. **Right column on non-emergency pages:** Same `<LeadForm defaultService={service.slug} />` pattern as homepage, but with the new `defaultService` prop pre-selecting the current service.

3. **Right column on emergency-tarping:** Replace the form column with a large phone tap-to-call card (48px+ text, prominent `tel:` link). The form still appears later on the page (bottom LeadForm section).

4. **No BBB SVG / trust signals column:** The homepage Hero has an elaborate trust signals list in the left column. Service heroes should have a simpler micro-trust line below the subheadline (e.g., "Licensed NE • Bonded & Insured • 15 Years Local") rather than reproducing the full badge list — the TrustStrip immediately below the hero carries those signals.

5. **Dual CTAs:** Primary "Call Now" (`tel:` link, `bg-accent-600`) + secondary "Free Estimate" (anchor to `#estimate-form`). Same button pattern as homepage.

6. **SVG divider:** Reuse the roof-peak SVG from homepage Hero (copy the `aria-hidden` div). The `fill` color must match the section immediately below — if TrustStrip is next, use `#f4f6f7` (matches `bg-neutral-50` on TrustStrip — confirmed from homepage Hero line 243).

---

## Research Goal 8: Anti-Chaser Grep Targets for Emergency Tarping

### Forbidden Strings (grep-testable, case-insensitive)

These must NOT appear anywhere in the emergency-tarping page source or content:

```bash
# Run against: src/app/(marketing)/services/emergency-tarping/page.tsx
# AND: src/content/services.ts (emergency-tarping entry)
# AND: src/components/templates/ServicePageTemplate.tsx

grep -ri "limited time" .
grep -ri "act now" .
grep -ri "don.t wait" .
grep -ri "countdown" .
grep -ri "expires" .
grep -ri "deadline" .
grep -ri "free roof" .
grep -ri "insurance will pay" .
grep -ri "insurance pays" .
grep -ri "zero out of pocket" .
grep -ri "no cost to you" .
grep -ri "canvass" .
grep -ri "door.to.door" .
grep -ri "door to door" .
grep -ri "storm chaser" .   # EXCEPTION: anti-chaser page (WhyNotChaser) is fine;
                              # emergency-tarping page should not reference storm chasers at all
```

**Note on "storm chaser":** The `WhyNotChaser` component is on the homepage and is fine. On the emergency-tarping page specifically, do not import or reference it — the emergency page positions Raptor by capability and availability, not by comparison to chasers.

### Required Strings (grep-testable)

These MUST appear in the emergency-tarping page:

```bash
grep -i "24/7" src/app/(marketing)/services/emergency-tarping/page.tsx
grep -i "document" src/app/(marketing)/services/emergency-tarping/page.tsx  # "document damage"
grep "tel:" src/app/(marketing)/services/emergency-tarping/page.tsx          # tel: link present
grep -i "insurance" src/app/(marketing)/services/emergency-tarping/page.tsx  # insurance reassurance block
```

**Content guardrails for copy (not grep-testable, for human review):**

- Tone must be "calm, capable, available" — not fear-inducing
- Before/after captions must not imply fear (no "catastrophic damage," no emotional before language)
- Phone number must be rendered at 48px+ font size (check via Tailwind class `text-4xl` or `text-5xl` minimum)
- Insurance block copy must say we DOCUMENT damage (what we do), not promise any insurance outcome

---

## Research Goal 9: Tailwind v4 + Next.js 16 Patterns for Service Pages

### Confirmed Patterns (HIGH confidence — verified in codebase)

**Tailwind v4 CSS-first config:** Project uses `@import "tailwindcss"` + `@theme {}` block in `globals.css`. There is no `tailwind.config.js`. All custom tokens (`--color-primary-*`, `--color-accent-*`, `--color-background`, `--color-surface`, `--shadow-card`, `--shadow-cta`) are defined in `@theme {}` and available as Tailwind utilities (e.g., `bg-primary-600`, `shadow-[var(--shadow-card)]`).

**New components must use the same token names** — do not introduce new inline hex colors or new CSS variables without adding them to `@theme {}`.

**`next/image` for hero photos:** Use `fill` + `priority` + `sizes="100vw"` for full-bleed hero background images. Use `lazy` (default) + explicit `width`/`height` for smaller images. This pattern is already used in `Hero.tsx` lines 35-43.

**No `tailwind.config.js` means no `safelist`** — Tailwind v4 purges based on static string detection. Do not construct class names dynamically (e.g., `bg-${color}-600`). All class names in template components must appear as complete strings.

**Server vs client components:** Service page files (`page.tsx`) are server components — they can call content functions, build metadata, inject JSON-LD, and pass data as props to client components. `ServicePageTemplate` can be a server component. `LeadForm` must remain a client component (`"use client"`) because it uses `useState`. `TestimonialCarousel` is also a client component. Keep client component tree minimal — push data down as props rather than having client components fetch content.

**Static generation:** With static route folders, Next.js automatically generates each page at build time. No `generateStaticParams` needed. No dynamic data fetching. The content files (`services.ts`, `faqs.ts`, `testimonials.ts`) are imported at build time.

**Breadcrumb accessibility:** Wrap visible breadcrumbs in `<nav aria-label="Breadcrumb">` with an `<ol>` list. The current page (`aria-current="page"`) on the last item. This is standard ARIA pattern — no component exists for it yet, can be inline JSX in `ServicePageTemplate` or a small `Breadcrumb` component.

**`scroll-mt` for anchor targets:** `#estimate-form` on the LeadForm wrapper already has `scroll-mt-20 lg:scroll-mt-24` (LeadForm.tsx line 43). The hero "Free Estimate" button href `#estimate-form` will scroll correctly. Do not remove this.

---

## Research Goal 10: Files to Create vs Files to Modify

### Files to CREATE (new)

| File | Purpose |
|------|---------|
| `src/components/sections/ServiceHero.tsx` | New parameterized hero for service pages |
| `src/components/templates/ServicePageTemplate.tsx` | Shared template for all 4 service pages |
| `src/app/(marketing)/services/roofing/page.tsx` | /services/roofing route |
| `src/app/(marketing)/services/siding/page.tsx` | /services/siding route |
| `src/app/(marketing)/services/gutters/page.tsx` | /services/gutters route |
| `src/app/(marketing)/services/emergency-tarping/page.tsx` | /services/emergency-tarping route |

**Optional but useful:**
| File | Purpose |
|------|---------|
| `src/components/sections/ServiceBreadcrumb.tsx` | Visible breadcrumb trail (reusable) |
| `src/components/sections/RelatedServicesBlock.tsx` | 3-card related services grid |
| `src/components/sections/ServiceCTABand.tsx` | Mid-page CTA band (phone + estimate) |
| `src/components/sections/BeforeAfterGallery.tsx` | Placeholder gallery slots |

### Files to MODIFY (existing)

| File | Change Required |
|------|----------------|
| `src/content/services.ts` | Add `problemChecklist: string[]` to `Service` interface; populate for all 4 services |
| `src/content/faqs.ts` | Add 3-5 service-specific FAQs for siding, gutters, emergency-tarping (roofing may need 1-2 more) |
| `src/components/sections/LeadForm.tsx` | Add `defaultService?: string` prop; initialize service state from it |
| `src/components/sections/TestimonialCarousel.tsx` | Add `testimonials?: Testimonial[]` prop with fallback to full array |

### Files that do NOT need modification

| File | Why |
|------|-----|
| `src/lib/schema.tsx` | `serviceSchema()`, `breadcrumbSchema()`, `faqPageSchema()` all ready to use |
| `src/lib/metadata.ts` | `buildMetadata()` already supports canonical via `path` param |
| `src/app/layout.tsx` | Root metadata template works for service pages |
| `src/app/(marketing)/layout.tsx` | Header/Footer/StickyMobileCTA automatically wrap all service pages |
| `src/content/site.ts` | No changes needed |
| `src/content/testimonials.ts` | `getTestimonialsByService()` already exported; no new testimonial data needed for Phase 4 |
| All layout components | TrustStrip, Header, Footer, StickyMobileCTA need no changes |

---

## Code Examples

### Service Page File Pattern (roofing)

```typescript
// src/app/(marketing)/services/roofing/page.tsx
import { buildMetadata } from "@/lib/metadata";
import { JsonLd, serviceSchema, breadcrumbSchema, faqPageSchema } from "@/lib/schema";
import { getServiceBySlug, getRelatedServices } from "@/content/services";
import { getFaqsByService } from "@/content/faqs";
import { getTestimonialsByService } from "@/content/testimonials";
import { ServicePageTemplate } from "@/components/templates/ServicePageTemplate";

const service = getServiceBySlug("roofing")!;
const faqs = getFaqsByService("roofing");           // returns FAQ[] where serviceSlug === "roofing"
const relatedServices = getRelatedServices("roofing");

export const metadata = buildMetadata({
  title: service.metadata.title,
  description: service.metadata.description,
  path: "/services/roofing",
  useAbsoluteTitle: true,
});

export default function RoofingPage() {
  const testimonials = getTestimonialsByService("roofing");
  return (
    <>
      <JsonLd data={serviceSchema(service)} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", href: "/" },
        { name: "Services", href: "/#services" },
        { name: service.shortTitle, href: "/services/roofing" },
      ])} />
      <JsonLd data={faqPageSchema(faqs)} />
      <ServicePageTemplate
        service={service}
        faqs={faqs}
        testimonials={testimonials}
        relatedServices={relatedServices}
      />
    </>
  );
}
```

### LeadForm Modification (minimal)

```typescript
// src/components/sections/LeadForm.tsx — only change

// ADD interface before component:
interface LeadFormProps {
  defaultService?: string;
}

// CHANGE function signature from:
export function LeadForm() {
  const [service, setService] = useState("");

// TO:
export function LeadForm({ defaultService = "" }: LeadFormProps) {
  const [service, setService] = useState(defaultService);
```

### services.ts Interface Extension

```typescript
// Add to Service interface in src/content/services.ts:
export interface Service {
  // ... existing fields ...
  problemChecklist: string[];  // ADD: homeowner-observable symptom bullets
}

// Example for roofing:
problemChecklist: [
  "Dark circular dents or bruising on shingles (hail impact)",
  "Missing, curling, or cracked shingles visible from the yard",
  "Granules collecting in gutters or downspout splash areas",
  "Water stains or dark spots on attic ceiling or insulation",
  "Daylight visible through attic boards",
  "Sagging roof deck in any area",
],
```

### Breadcrumb Accessible Markup Pattern

```typescript
// Visible breadcrumb — can be inline in ServicePageTemplate or extracted to ServiceBreadcrumb.tsx
<nav aria-label="Breadcrumb" className="bg-neutral-50 border-b border-neutral-200">
  <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
    <ol className="flex items-center gap-2 font-body text-sm text-neutral-600">
      <li><Link href="/" className="hover:text-accent-600">Home</Link></li>
      <li aria-hidden="true">/</li>
      <li><Link href="/#services" className="hover:text-accent-600">Services</Link></li>
      <li aria-hidden="true">/</li>
      <li aria-current="page" className="text-primary-900 font-semibold">{service.shortTitle}</li>
    </ol>
  </div>
</nav>
```

---

## Architecture Patterns

### Recommended Project Structure After Phase 4

```
src/
├── app/(marketing)/
│   ├── layout.tsx                    [EXISTS — no change]
│   ├── page.tsx                      [EXISTS — no change]
│   └── services/
│       ├── roofing/page.tsx          [CREATE]
│       ├── siding/page.tsx           [CREATE]
│       ├── gutters/page.tsx          [CREATE]
│       └── emergency-tarping/        [CREATE]
│           └── page.tsx
├── components/
│   ├── layout/                       [EXISTS — no changes]
│   ├── sections/
│   │   ├── LeadForm.tsx              [MODIFY — add defaultService prop]
│   │   ├── TestimonialCarousel.tsx   [MODIFY — add testimonials prop]
│   │   ├── ServiceHero.tsx           [CREATE]
│   │   └── ...
│   └── templates/
│       └── ServicePageTemplate.tsx   [CREATE — new directory]
├── content/
│   ├── services.ts                   [MODIFY — add problemChecklist]
│   └── faqs.ts                       [MODIFY — add service-specific FAQs]
└── lib/
    ├── metadata.ts                   [NO CHANGE]
    └── schema.tsx                    [NO CHANGE]
```

**Note:** `src/components/templates/` does not exist yet — create the directory when creating `ServicePageTemplate.tsx`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| Per-service FAQs | Custom FAQ component | `<FaqAccordion faqs={faqs} />` — already accepts `FAQ[]` prop |
| Service JSON-LD | Manual schema object | `serviceSchema(service)` from `schema.tsx` |
| Breadcrumb JSON-LD | Manual schema object | `breadcrumbSchema(items)` from `schema.tsx` |
| FAQ JSON-LD | Manual schema object | `faqPageSchema(faqs)` from `schema.tsx` |
| Per-page canonical | Manual `<link>` tag | `buildMetadata({ path: "/services/slug" })` |
| Related services lookup | Array filter | `getRelatedServices(slug)` from `services.ts` |
| Testimonial filtering | Array filter | `getTestimonialsByService(slug)` from `testimonials.ts` |
| Service lookup | Find-by-slug | `getServiceBySlug(slug)` from `services.ts` |
| Layout wrap | Header/Footer in page | Already in `(marketing)/layout.tsx` — automatic |

---

## Common Pitfalls

### Pitfall 1: JSON-LD FAQ Mismatch
**What goes wrong:** If the FAQ array passed to `faqPageSchema()` differs from the array passed to `<FaqAccordion>`, Google's Rich Results Test flags a mismatch between the page content and structured data.
**How to avoid:** Define `const faqs = getFaqsByService(slug)` once per page file and pass the same variable to both `JsonLd` and `ServicePageTemplate` (which passes it to `FaqAccordion`). Never filter or slice in two different places.

### Pitfall 2: Forgetting `useAbsoluteTitle: true`
**What goes wrong:** If `useAbsoluteTitle` is omitted, the root layout's title template (`%s | Raptor Roofing — Omaha Roofer`) appends, producing double-branded titles like "Roof Replacement in Omaha | Raptor Roofing | Raptor Roofing — Omaha Roofer".
**How to avoid:** All service page `buildMetadata()` calls use `useAbsoluteTitle: true` because `service.metadata.title` already includes "| Raptor Roofing".

### Pitfall 3: LocalBusiness JSON-LD Duplication
**What goes wrong:** Adding `localBusinessSchema()` on service pages duplicates the schema already mounted in Footer. Google may flag duplicate LocalBusiness entities.
**How to avoid:** Service pages inject ONLY `serviceSchema()`, `breadcrumbSchema()`, and `faqPageSchema()`. Never `localBusinessSchema()` on inner pages.

### Pitfall 4: Dynamic Tailwind Class Construction
**What goes wrong:** Tailwind v4 CSS-first mode detects class names statically. A pattern like `className={`bg-${service.colorToken}-600`}` will not generate the CSS for that class.
**How to avoid:** All Tailwind classes in components must appear as complete literal strings. For service-specific styling variations (if any), use a lookup object: `const colorMap = { roofing: "bg-primary-600", ... }`.

### Pitfall 5: `isEmergency` not driving Emergency Tarping differentiation
**What goes wrong:** Building emergency-tarping as a pure copy of the other three service pages without activating its special treatment.
**How to avoid:** The template must branch on `service.isEmergency`. Verify at code review: does the rendered emergency-tarping page show the giant phone number block? Does it omit the in-hero LeadForm column in favor of the phone CTA?

### Pitfall 6: `#estimate-form` anchor not resolving
**What goes wrong:** If the hero "Free Estimate" button links to `#estimate-form` but the LeadForm wrapper `id` is absent or different on service pages, the scroll anchor fails silently.
**How to avoid:** `LeadForm` already has `id="estimate-form"` on line 43. Do not change this id. Do not wrap LeadForm in an additional div that changes the anchor target.

---

## State of the Art

| Old Approach | Current Approach | Impact on Phase 4 |
|--------------|------------------|-------------------|
| Dynamic `[slug]` routes for small page sets | Static route folders per page | Use static folders |
| `tailwind.config.js` for custom tokens | `@theme {}` block in CSS (Tailwind v4) | No config file — extend globals.css |
| Manual `<link rel="canonical">` | `buildMetadata({ path })` sets `alternates.canonical` | Already handled |
| Separate JSON-LD per type | Single `JsonLd` component handles all schema types | Use existing component |

---

## Open Questions

1. **`serviceSlug` coverage for roofing FAQs** — `getFaqsByService("roofing")` currently returns only faq-1, faq-3, faq-7, faq-9 (4 items). That satisfies the 3-5 range minimum. If the planner wants 5, one more roofing FAQ needs `serviceSlug: "roofing"`. Decision can be made at plan-write time.

2. **`services.ts` function `getTestimonialsByService`** — This helper is in `testimonials.ts`, not `services.ts`. The planner should import it from the correct source: `import { getTestimonialsByService } from "@/content/testimonials"`.

3. **`/services` index page** — No `/services/page.tsx` exists. The Header nav links to `/#services` (anchor on homepage). Phase 4 does not require a `/services` index. If one is added (future phase), the breadcrumb "Services" link should update from `/#services` to `/services`.

4. **`TestimonialCarousel` testimonials prop** — The carousel currently shows ALL testimonials (the full 6-item array). There are at least 1 testimonial per service in the current data (roofing: t1, t2, t6; emergency-tarping: t3; siding: t4; gutters: t5). Adding a `testimonials` prop to `TestimonialCarousel` is a one-line change but requires the component signature to change — this is a client component modification. Alternative: create `ServiceTestimonialCarousel` that accepts the subset.

---

## Sources

### Primary (HIGH confidence — direct codebase inspection)
- `src/components/sections/LeadForm.tsx` — complete implementation, no defaultService prop exists
- `src/components/sections/Hero.tsx` — confirmed hardcoded, not reusable for service pages
- `src/content/services.ts` — confirmed all fields, confirmed gaps (no problemChecklist, no FAQ array)
- `src/content/faqs.ts` — confirmed serviceSlug coverage; siding/gutters/emergency-tarping have zero tagged FAQs
- `src/content/testimonials.ts` — confirmed serviceSlug coverage and `getTestimonialsByService` export
- `src/lib/schema.tsx` — confirmed all three factory functions exist and are fully implemented
- `src/lib/metadata.ts` — confirmed `alternates.canonical` already present; no extension needed
- `src/app/layout.tsx` — confirmed title template behavior for `useAbsoluteTitle`
- `src/app/(marketing)/layout.tsx` — confirmed automatic Header/Footer/StickyMobileCTA wrapping
- `src/app/(marketing)/page.tsx` — confirmed JSON-LD + component composition pattern to replicate
- `src/app/globals.css` — confirmed Tailwind v4 CSS-first config, all token names verified
- `package.json` — confirmed Next.js 16.2.3, schema-dts 2.0.0, Tailwind 4, React 19

### Secondary (MEDIUM confidence)
- Next.js 16 App Router docs — static export metadata pattern well-established; dynamic `[slug]` route is valid but adds complexity for this use case

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all dependencies verified in package.json and codebase
- Architecture (static vs dynamic routes): HIGH — recommendation is grounded in component inspection showing emergency-tarping divergence
- LeadForm gap: HIGH — inspected actual component, confirmed no props
- services.ts gaps: HIGH — inspected file, confirmed missing fields
- schema.tsx readiness: HIGH — all three factories verified complete
- buildMetadata canonical: HIGH — code inspected, confirmed present
- Pitfalls: HIGH — derived from direct code inspection, not speculation

**Research date:** 2026-04-14
**Valid until:** 2026-05-14 (stable codebase; no external dependencies to rotate)
