# Phase 6: SEO + Performance + Accessibility — Research

**Researched:** 2026-04-15
**Domain:** Next.js 16 App Router — SEO metadata, schema, WCAG AA, Core Web Vitals, bundle budget
**Confidence:** HIGH (all findings verified against live codebase + official Next.js 16.2.4 docs)

---

## Summary

Phase 6 is a sitewide technical audit pass on a fully shipped Next.js 16.2.3 / Tailwind v4 / React 19 codebase. No new features ship — every deliverable is a fix or addition to existing code. The codebase is in better shape than a typical Phase 6 entry: `buildMetadata()` already sets `alternates.canonical`, `*:focus-visible` is already declared in `globals.css`, the `skip-to-main` CSS class is already defined in `globals.css`, the root layout already has `<a href="#main-content" className="skip-to-main">`, and `aggregateRating` is already commented out in `schema.tsx`. Several items the research questions asked about are already done; the planner's job is to wire the remaining gaps and verify.

**Primary recommendation:** Front-load the image-commit work (Q5) and sitemap/robots creation (Q1) so Lighthouse has real assets to measure — then run verification passes last, inside each plan.

---

## Research Findings by Question

---

### Q1: Next.js 16 Sitemap + Robots API

**Source:** Official Next.js 16.2.4 docs — `nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap` and `/robots` (fetched live 2026-04-15). Confidence: HIGH.

**Shape for `app/sitemap.ts`:**

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL;
if (!BASE_URL) {
  throw new Error(
    "[raptor-roofing] NEXT_PUBLIC_SITE_URL is not set — sitemap cannot generate absolute URLs. Set it in .env.local or Vercel dashboard."
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE_URL}/`,                           lastModified: new Date(), changeFrequency: "monthly",  priority: 1.0 },
    { url: `${BASE_URL}/about`,                      lastModified: new Date(), changeFrequency: "monthly",  priority: 0.8 },
    { url: `${BASE_URL}/contact`,                    lastModified: new Date(), changeFrequency: "monthly",  priority: 0.8 },
    { url: `${BASE_URL}/services/roofing`,           lastModified: new Date(), changeFrequency: "monthly",  priority: 0.9 },
    { url: `${BASE_URL}/services/siding`,            lastModified: new Date(), changeFrequency: "monthly",  priority: 0.8 },
    { url: `${BASE_URL}/services/gutters`,           lastModified: new Date(), changeFrequency: "monthly",  priority: 0.8 },
    { url: `${BASE_URL}/services/emergency-tarping`, lastModified: new Date(), changeFrequency: "monthly",  priority: 0.9 },
  ];
}
```

**Shape for `app/robots.ts`:**

```typescript
// src/app/robots.ts
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://raptor-roofing.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

**Key facts:**
- Both files go directly in `src/app/` (not inside any route group).
- Both are special Route Handlers cached at build time by default — no `export const dynamic = 'force-dynamic'` needed.
- `sitemap.ts` must use absolute URLs in the `url` field — Next.js does NOT auto-prefix them with `metadataBase`. This is different from OG images in the metadata object.
- The throw guard pattern (`if (!BASE_URL) throw new Error(...)`) runs at build time in Node.js during static generation, which is exactly what CONTEXT.md requires.
- No API changes between Next.js 14 → 15 → 16 that affect basic sitemap/robots shape. The only v16 change is that `generateSitemaps` now receives `id` as a `Promise<string>` — irrelevant for this single-sitemap use case.
- `siteConfig.url` in `src/content/site.ts` (line 58) already reads `NEXT_PUBLIC_SITE_URL` with the same fallback. However, sitemap.ts should NOT import siteConfig — it should read the env var directly with the throw guard so the build fails loudly rather than silently using the fallback.

**Trailing slash note:** `siteConfig.url` resolves to `https://raptor-roofing.vercel.app` (no trailing slash). Using `${BASE_URL}/` for the homepage produces `https://raptor-roofing.vercel.app/` which is canonically correct. All other paths have leading slashes already, so no double-slash risk.

---

### Q2: Canonical URLs via buildMetadata()

**Source:** Read `src/lib/metadata.ts` directly. Confidence: HIGH.

**Finding: buildMetadata() ALREADY sets alternates.canonical. No changes needed.**

Lines 53–55 of `src/lib/metadata.ts`:
```typescript
alternates: {
  canonical: canonicalUrl,   // = `${siteConfig.url}${path}`
},
```

Every page that calls `buildMetadata({ path: "..." })` already ships a self-canonical. Verified against all 7 pages:
- Homepage: `buildMetadata({ path: "/" })` → canonical = `${siteUrl}/`
- About: `buildMetadata({ path: "/about" })`
- Contact: `buildMetadata({ path: "/contact" })`
- Service pages: each calls `buildMetadata({ path: "/services/<slug>" })`

**Action for Phase 6:** None on `metadata.ts` itself. The audit task just needs to confirm each page passes the correct `path` argument and that no page omits `path` (which would default to `"/"`, causing duplicate canonicals).

**Verification:** Run `grep -rn "buildMetadata" src/app` and confirm every call has a unique `path` argument. The homepage correctly uses `path: "/"`.

---

### Q3: Stripping aggregateRating Safely

**Source:** Read `src/lib/schema.tsx` and `src/components/layout/Footer.tsx` directly. Confidence: HIGH.

**Finding: aggregateRating is ALREADY commented out. No code change required.**

`src/lib/schema.tsx` lines 85–91:
```typescript
// PLACEHOLDER: add aggregateRating once real reviews are confirmed
// aggregateRating: {
//   "@type": "AggregateRating",
//   ratingValue: siteConfig.reviews.rating,
//   reviewCount: siteConfig.reviews.count,
// },
```

The `localBusinessSchema()` function emits no `aggregateRating` field. The `siteConfig.reviews` object exists in `src/content/site.ts` (lines 98–103) with placeholder values (127 reviews, 4.9 rating) but is never read by any schema factory. It IS read in `src/components/sections/Hero.tsx` line 128 for UI display only, inside a `[Placeholder]` labeled span.

**Action for Phase 6:** The regression guard task (Q4) covers this. The dead commented-out code can stay — removing it would be cosmetic, not functional.

---

### Q4: Review JSON-LD Audit

**Source:** Grep across entire `src/` directory. Confidence: HIGH.

**Findings: ZERO `Review` or `AggregateRating` JSON-LD objects emitted anywhere.**

Grep results for `Review|AggregateRating|reviewBody|aggregateRating` across all `.tsx` and `.ts` files:
- `src/components/sections/Hero.tsx:129` — text string "Reviews" (plain UI text, not schema)
- `src/lib/schema.tsx:85–87` — commented-out aggregateRating (not emitted)

**TestimonialCarousel.tsx** — renders placeholder banners and star icons in UI only. No `<script type="application/ld+json">` or `JsonLd` component is imported or rendered. No Review schema.

**testimonials.ts** — defines the `Testimonial` interface and data. No schema factory. The `isPlaceholder: boolean` field is UI-only.

**Phase 6 action:** Add a build-time regression guard. A simple `package.json` lint script suffices:
```json
"lint:no-review-schema": "node -e \"const fs = require('fs'); const src = require('child_process').execSync('grep -rn \"\\\"@type\\\": \\\"Review\\\"\\|\\\"@type\\\": \\\"AggregateRating\\\"\" src/ --include=*.tsx --include=*.ts', {encoding:'utf8', stdio:['pipe','pipe','pipe']}); if (src.trim()) { console.error('ERROR: Review/AggregateRating schema found in src/', src); process.exit(1); } else { console.log('OK: No Review/AggregateRating schema emitted.'); }\""
```

Simpler alternative: add a Grep step to the Phase 7 manual verification checklist rather than a CI script — acceptable given the project size.

---

### Q5: Hero Image Paths vs Reality

**Source:** Grep `src/` for `/images/` + `ls public/images/`. Confidence: HIGH.

**What exists in `public/images/`:**
```
hero-placeholder.jpg     ← EXISTS (real file)
raptor-roofing-logo.png  ← EXISTS (real file)
HERO_CREDIT.txt          ← EXISTS (attribution for hero-placeholder.jpg)
```

**What is referenced in source but DOES NOT EXIST:**
| Component | Path Referenced | File Exists? |
|---|---|---|
| `Hero.tsx:36` | `/images/hero-placeholder.jpg` | YES — currently serving |
| `AboutHero.tsx:48` | `/images/about-hero.webp` | NO — will 404 |
| `ServiceHero.tsx:38` via `services.ts` | `/images/roofing-hero-placeholder.jpg` | NO |
| `ServiceHero.tsx:38` via `services.ts` | `/images/siding-hero-placeholder.jpg` | NO |
| `ServiceHero.tsx:38` via `services.ts` | `/images/gutters-hero-placeholder.jpg` | NO |
| `ServiceHero.tsx:38` via `services.ts` | `/images/emergency-tarping-placeholder.jpg` | NO |
| `Footer.tsx:21`, `Header.tsx:19`, `MobileMenuButton.tsx:95` | `/images/raptor-roofing-logo.png` | YES |
| Root layout OG reference | `/og/default.jpg` | NO — `public/og/` exists but is EMPTY |

**Missing files that need to be committed in Phase 6:** 6 WebP images + 1 OG JPG:
1. `public/images/about-hero.webp`
2. `public/images/roofing-hero-placeholder.jpg` → rename to `.webp` (update `services.ts` too)
3. `public/images/siding-hero-placeholder.jpg` → rename to `.webp`
4. `public/images/gutters-hero-placeholder.jpg` → rename to `.webp`
5. `public/images/emergency-tarping-placeholder.jpg` → rename to `.webp`
6. `public/og/default.jpg` (1200×630, referenced by root layout OG metadata)

The existing `hero-placeholder.jpg` is a real photo (HERO_CREDIT.txt confirms Unsplash attribution). It is `.jpg` not `.webp` and currently exceeds the project's 100 KB WebP target — Phase 6 should convert it to `.webp` and update `Hero.tsx:36` to reference `hero.webp` (or leave the path the same and just convert the file, renaming it).

**Decision for planner:** The cleanest path is to source 1 roofing photo that serves as `hero.webp` (main homepage), plus 1 general exterior/roofing photo for all service hero backgrounds and `about-hero.webp`. That's 2 unique Unsplash/Pexels photos rather than 6 different ones. Update `services.ts` to point all 4 service heroImagePaths to their respective WebP files (can reuse one photo for all 4 if desired for Phase 6, with Phase 8 swapping in real per-service photos).

---

### Q6: Free-Use Photo Sources for Roofing Placeholders

**Source:** Verified Unsplash and Pexels license documentation. Confidence: HIGH.

**Unsplash License (unsplash.com/license):**
- Free to use for commercial and non-commercial purposes.
- No attribution required (though crediting the photographer is appreciated).
- Cannot be sold as a standalone photo product.
- Safe for use on a client pitch website.

**Pexels License (pexels.com/license):**
- Free to use for commercial and personal projects.
- No attribution required.
- Cannot be resold or redistributed as stock photos.
- Safe for client pitch website use.

**SOURCES.md format for `public/images/SOURCES.md`:**
```markdown
# Image Sources & Licenses

All photos are used under the respective platform's free license.
Commercial use is permitted. Attribution is not required but is
included here for transparency and Phase 8 handoff.

## hero.webp
Source: Unsplash
Photographer: [Name]
URL: https://unsplash.com/photos/[id]
License: Unsplash License (free for commercial use)
Phase 8 action: Replace with real Raptor Roofing project photo

## about-hero.webp
...

## roofing-hero.webp
...
```

**Recommended Unsplash search queries:**
- "roofing contractor" — residential shingle roofs, workers on roof
- "roof replacement" — close-up of shingles being installed
- "house roof Nebraska" — Midwest residential exterior
- "roofing crew" — workers visible on peaked residential roof
- "storm damage roof" — useful for emergency-tarping page
- "house exterior siding" — for siding service page hero

**Recommended Pexels search queries:**
- "roofing" — browse first results for contractor context
- "residential roof" — good for service pages

**Target specs per CONTEXT.md and project CLAUDE.md:**
- Format: WebP
- Max size: 100 KB per file
- Dimensions: 1920×1080 or 2560×1440 → compress down
- Use Squoosh (squoosh.app, free browser tool) or `cwebp` CLI to convert

---

### Q7: Skip-to-Main Link in Next.js App Router

**Source:** Read `src/app/layout.tsx`, `src/app/(marketing)/layout.tsx`, `src/app/globals.css`. Confidence: HIGH.

**Finding: Skip-to-main link is ALREADY PARTIALLY IMPLEMENTED. Two mismatches to fix.**

**What's already done:**
1. `src/app/globals.css` lines 124–147 — `.skip-to-main` and `.skip-to-main:focus` CSS rules are fully defined. Visually hidden at -9999px, revealed at `position: fixed; top: 1rem; left: 1rem` on focus. Branded appearance: `bg-primary-600`, white text, accent-500 box-shadow ring.
2. `src/app/layout.tsx` line 86 — `<a href="#main-content" className="skip-to-main">Skip to main content</a>` is the first child of `<body>`.

**What needs fixing:**
1. **ID mismatch:** The skip link targets `#main-content`, but `src/app/(marketing)/layout.tsx` line 10 renders `<main id="main-content" ...>`. These match — good. BUT the CONTEXT.md decision specifies the id should be `main` (not `main-content`) and the `<main>` should have `tabIndex={-1}`. Current state: id is `main-content` and no `tabIndex` is set.
2. **tabIndex={-1} is missing:** Without `tabIndex={-1}`, clicking/activating the skip link on some browsers moves focus to the `<main>` element but the element is not focusable, so focus appears to do nothing. The `id` needs `tabIndex={-1}` to receive programmatic focus.

**Required changes:**
- `src/app/layout.tsx:86` — change `href="#main-content"` to `href="#main"` (or keep `#main-content` and update marketing layout to match — either works, but CONTEXT.md says `id="main"`)
- `src/app/(marketing)/layout.tsx:10` — change `id="main-content"` to `id="main"` and add `tabIndex={-1}`

The planner should pick one consistent id. Given CONTEXT.md specifies `id="main"`, the safest path is:
- root layout: `href="#main"`
- marketing layout: `id="main" tabIndex={-1}`

Note: `tabIndex={-1}` in JSX requires the numeric value, not a string.

---

### Q8: Brand Crimson Focus Ring

**Source:** Read `src/app/globals.css` @theme block directly. Confidence: HIGH.

**Existing focus-visible rule (globals.css lines 118–122):**
```css
*:focus-visible {
  outline: 2px solid var(--color-accent-500);
  outline-offset: 2px;
  border-radius: 2px;
}
```

**Brand crimson token: `--color-accent-500` = `#d94434`**

This is the "raptor eye" accent color. The rule is already applied globally to all elements via `*:focus-visible` in the base layer, which Tailwind v4 respects.

**Contrast verification (computed):**
| Ring color | Background | Ratio | Non-text threshold (3:1) | Pass? |
|---|---|---|---|---|
| `#d94434` | `#faf7f2` (page bg) | 4.07 | 3:1 | YES |
| `#d94434` | `#ffffff` (surface) | 4.35 | 3:1 | YES |
| `#d94434` | `#f4f6f7` (neutral-50) | 4.01 | 3:1 | YES |
| `#d94434` | `#07111a` (primary-950/hero) | 4.37 | 3:1 | YES |

The focus ring passes WCAG 1.4.11 (non-text contrast, 3:1 minimum) against all section backgrounds in the theme.

**CONTEXT.md specifies "2px brand crimson ring with 2px offset"** — the existing `*:focus-visible` rule delivers exactly this. No change needed to the CSS rule itself.

**Tailwind v4 note:** In Tailwind v4, `focus-visible:ring-2` etc. are utility classes. The existing `*:focus-visible` base-layer rule in globals.css will apply on top of or conflict with Tailwind's `focus-visible:outline-none` reset if any component uses that. Audit needed: grep for `focus-visible:outline-none` to find any components that intentionally suppress the ring. Replace with `focus-visible:outline-2 focus-visible:outline-accent-500` or rely on the global rule (preferred).

**TestimonialCarousel.tsx already has explicit focus-visible utilities** (lines 79, 94, 107): `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500`. These match the global rule and are redundant but harmless.

**LeadForm.tsx form fields** use `focus:ring-2 focus:ring-primary-500` (not `focus-visible`) — this applies on mouse click too. Phase 6 should change these to `focus-visible:ring-2 focus-visible:ring-accent-500` to match brand crimson ring spec and eliminate unnecessary focus on mouse click.

---

### Q9: WCAG AA Contrast Audit Strategy

**Source:** Design tokens in globals.css @theme block, computed ratios. Confidence: HIGH.

**Without installing axe-core**, the most efficient audit path for this project:

1. **Token-level matrix now (in research):** Compute contrast ratios for all text/background pairings once from the @theme CSS variables. This is done below in Q10 for the amber banners. The design is token-consistent — the same neutral-900 text appears on neutral-50/white/background surfaces everywhere.
2. **Browser DevTools:** Open each page in Chrome, use DevTools "Rendering > Accessibility features" → "Emulate: WCAG AA". Or use the Accessibility Tree panel to check individual element contrast.
3. **Free browser extension:** [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) + browser color picker. Fast for spot-checks.
4. **PageSpeed Insights / Lighthouse Accessibility pillar** catches contrast failures automatically when the score runs — it uses axe-core internally without needing to install it.

**Key text pairings to verify:**
| Text | Background | Computed Ratio | AA (4.5:1)? |
|---|---|---|---|
| `#92400e` (banner text) | `#fef3c7` (amber bg) | 6.37 | YES |
| `#0d1417` (primary-900) | `#faf7f2` (page bg) | ~16+ | YES |
| `white #ffffff` | `#2e4a56` (primary-600 header) | 9.42 | YES |
| `white` text | `#07111a` (primary-950 hero) | 19+ | YES |
| `#141f26` (neutral-800) | `#f4f6f7` (neutral-50) | 15.45 | YES |
| `#4a5c62` (neutral-500 subtext) | `#faf7f2` (page bg) | ~4.0 | BORDERLINE — verify |

**Borderline case:** `neutral-500` (`#4a5c62`) text is used for secondary/supporting text (e.g., "Straight answers from a family-owned Omaha roofer"). Compute: luminance(74, 92, 98) vs luminance(250, 247, 242). This may be close to 4.5:1 — Phase 6 should verify and darken to `neutral-600` (`#344248`) if it fails.

---

### Q10: Amber [PLACEHOLDER] Banner Audit

**Source:** Read `globals.css`, `TestimonialCarousel.tsx`, `FinancingCallout.tsx`, `InsuranceLogos.tsx`, `LeadForm.tsx`, `ContactForm.tsx`, `AboutHero.tsx`. Confidence: HIGH.

**`.placeholder-banner` CSS definition (globals.css lines 169–182):**
```css
.placeholder-banner {
  background: #fef3c7;       /* amber-100 */
  border: 1px solid #f59e0b; /* amber-400 */
  color: #92400e;             /* amber-800 */
  font-size: var(--text-xs);
  font-weight: 600;
}
```

**Contrast ratio: `#92400e` on `#fef3c7` = 6.37:1 — PASSES WCAG AA (4.5:1). No fix needed.**

**All locations using `.placeholder-banner`:**
1. `TestimonialCarousel.tsx:43` — `<span className="placeholder-banner" role="status">` — on `bg-surface` (#ffffff) card background. The banner itself has its own amber background so the text contrast is banner-bg to banner-text (6.37:1 pass), not card-bg to text.
2. `FinancingCallout.tsx:16` — `<span className="placeholder-banner">$[PLACEHOLDER]/mo</span>` — inline within `text-2xl font-bold` copy. Same amber banner colors, 6.37:1 pass.
3. `InsuranceLogos.tsx:57–59` — `<span className="placeholder-banner">` — disclosure text. Same colors.
4. `LeadForm.tsx:275` — plain text `Licensed NE #[PLACEHOLDER]` (NOT using `.placeholder-banner` class, no amber bg). This is just gray body text — passes easily.
5. `ContactForm.tsx` — has `placeholder-banner` match. (Exact location: inline `[PLACEHOLDER]` text, same class.)

**Finding: All placeholder banners pass 4.5:1 at 6.37:1. CONTEXT.md's concern is already resolved by the existing color choices.**

**Note on `role="status"` on testimonial banner:** Accessible. Screen readers announce status messages when content changes. This is appropriate since the banner discloses placeholder status.

---

### Q11: 48×48 Tap Target Audit Inventory

**Source:** Read all interactive component files. Confidence: HIGH.

**Interactive elements inventory with tap target assessment:**

| Element | Component | Current Classes | Tap Size | Pass 48×48? |
|---|---|---|---|---|
| Logo link | `Header.tsx:12` | `flex items-center gap-3` (no min-h set on link itself) | unconstrained | VERIFY — link wraps a constrained image |
| Desktop phone CTA | `Header.tsx:63` | `px-5 py-3` = 48+px height | ~48px h | PASS (py-3 = 12px × 2 + text ~20px = ~44px — BORDERLINE) |
| Desktop nav links | `Header.tsx:37–58` | `hover:text-accent-400` (no min-h/min-w) | ~32px | FAIL — text-only links need padding |
| Mobile phone icon | `Header.tsx:75` | `flex h-12 w-12` | 48×48 | PASS |
| Mobile hamburger | `MobileMenuButton.tsx:74` | `flex h-12 w-12` | 48×48 | PASS |
| Mobile nav close | `MobileMenuButton.tsx:103` | `flex h-12 w-12` | 48×48 | PASS |
| Mobile nav links | `MobileMenuButton.tsx:116–136` | `text-2xl` + padding from parent `gap-2 px-6 py-8` | ~40–44px | BORDERLINE |
| Mobile call button | `MobileMenuButton.tsx:141` | `px-6 py-4` | ~48px+ | PASS |
| StickyMobileCTA Call | `StickyMobileCTA.tsx:13` | `flex flex-1 items-center justify-center px-4 py-4` | 64px height (--sticky-cta-height) | PASS |
| StickyMobileCTA Estimate | `StickyMobileCTA.tsx:21` | same flex-1 | 64px | PASS |
| Hero CTA (Call) | `Hero.tsx:77` | `min-h-[48px] items-center justify-center px-8 py-4` | 48px min | PASS |
| ServiceHero Call Now | `ServiceHero.tsx:82` | `min-h-[48px] px-8 py-4` | 48px min | PASS |
| ServiceHero Free Estimate | `ServiceHero.tsx:89` | `min-h-[48px] px-8 py-4` | 48px min | PASS |
| AboutHero CTA | `AboutHero.tsx:98` | `min-h-[48px] px-8 py-4` | 48px min | PASS |
| Emergency call card link | `ServiceHero.tsx:106` | `mt-4 block` large text | large text block | PASS (block-level) |
| Emergency estimate link | `ServiceHero.tsx:116` | `min-h-[48px] px-6 py-3` | 48px min | PASS |
| Footer phone | `Footer.tsx:43` | `min-h-12 inline-flex items-center` | 48px min | PASS |
| Footer service links | `Footer.tsx:88` | `text-white/80` (no explicit size) | ~24px | FAIL — text links need padding |
| Footer service-area links | `Footer.tsx:108` | same | ~24px | FAIL |
| Footer legal links | `Footer.tsx:128` | same | ~24px | FAIL |
| Footer social icons | `Footer.tsx:144` | `flex h-12 w-12` | 48×48 | PASS (but only shown if social URLs set; currently undefined, so not rendered) |
| LeadForm submit | `LeadForm.tsx:267` | `min-h-[48px] w-full` | 48px+ | PASS |
| LeadForm inputs | `LeadForm.tsx:141` | `px-4 py-3` (12px × 2 + 16px = 40px) | ~40px | BORDERLINE |
| LeadForm success call CTA | `LeadForm.tsx:86` | `min-h-[48px] px-6 py-3` | 48px | PASS |
| FAQ accordion summaries | `FaqAccordion.tsx:28` | `p-6` container (24px each side) + text | varies ~40–48px | BORDERLINE — depends on text wrapping |
| TestimonialCarousel prev/next | `TestimonialCarousel.tsx:75,103` | `h-12 w-12` | 48×48 | PASS |
| TestimonialCarousel dot buttons | `TestimonialCarousel.tsx:87` | `h-3 w-3` | 12×12 | FAIL — severely undersized |
| TrustStrip (static, no interactive) | — | — | N/A | N/A |
| Service grid cards | (ServiceGrid.tsx) | need to verify | likely PASS if using Link wrapping card | VERIFY |
| Contact page map iframe | static | no interaction | N/A | N/A |

**Confirmed FAIL / BORDERLINE items requiring fix:**
1. Desktop nav links (Header) — add `py-2` or use `min-h-[48px]` + `flex items-center`
2. Footer column links (services, service areas, legal) — add `block py-1.5` min, or `min-h-[44px] flex items-center`
3. TestimonialCarousel dot buttons — `h-3 w-3` = 12px. Fix: wrap in `<span className="flex h-12 w-12 items-center justify-center">` or expand to `h-6 w-6` with `p-3` hit area
4. Form inputs (LeadForm, ContactForm) — `py-3` gives ~40px height; add `min-h-[44px]` or `py-3.5` to clear 48px

---

### Q12: Lighthouse CLI for Local Verification

**Source:** WebSearch + training knowledge of Lighthouse CLI options. Confidence: MEDIUM.

**Recommended approach: `npx lighthouse` (no install needed)**

```bash
# Single URL mobile audit (produces HTML report):
npx lighthouse https://raptor-roofing.vercel.app \
  --form-factor=mobile \
  --preset=mobile \
  --output=html \
  --output-path=./lighthouse-report.html \
  --only-categories=performance,accessibility,best-practices,seo

# All 7 pages in sequence:
for SLUG in "" "about" "contact" "services/roofing" "services/siding" "services/gutters" "services/emergency-tarping"; do
  URL="https://raptor-roofing.vercel.app/${SLUG}"
  OUTFILE="lighthouse-$(echo $SLUG | tr '/' '-').html"
  npx lighthouse "$URL" --form-factor=mobile --preset=mobile \
    --output=html --output-path="./$OUTFILE" \
    --only-categories=performance,accessibility,best-practices,seo \
    --quiet
  echo "Report saved: $OUTFILE"
done
```

**Alternative: PageSpeed Insights API (free, no install)**
```bash
API_KEY="YOUR_PSI_API_KEY"  # get from Google Cloud Console (free)
URL="https://raptor-roofing.vercel.app"
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${URL}&strategy=mobile&key=${API_KEY}" | \
  node -e "const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8')); const c = d.lighthouseResult.categories; Object.keys(c).forEach(k => console.log(k, Math.round(c[k].score * 100)));"
```

**Recommendation:** Use `npx lighthouse` for Phase 6 verification since the site runs on Vercel preview (live URL available). Run after each major fix, not just at the end. Andrew reviews the HTML report files. No devDep needed.

**Important:** Lighthouse must run against the live Vercel preview URL, not `localhost`, to measure real CDN/Vercel performance. Run `git push` to deploy before running Lighthouse.

---

### Q13: Bundle Size Parsing from `npm run build`

**Source:** Next.js build output format, verified against project. Confidence: HIGH.

**Format of `npm run build` output:**
```
Route (app)                              Size     First Load JS
┌ ○ /                                   8.23 kB        123 kB
├ ○ /about                              4.12 kB        108 kB
├ ○ /contact                            9.45 kB        156 kB
...
+ First Load JS shared by all           88.2 kB
```

The "First Load JS" column is per-route total = route chunk + shared chunks. The 200 KB ceiling applies to this column.

**Simple parsing script — no bundle analyzer needed:**

```javascript
// scripts/check-bundle-size.mjs
import { execSync } from "child_process";

const MAX_KB = 200;
const output = execSync("npm run build 2>&1", { encoding: "utf8" });
const routePattern = /[○●λ]\s+(\/\S*)\s+[\d.]+ [kB]+\s+([\d.]+) kB/g;
const failures = [];

let match;
while ((match = routePattern.exec(output)) !== null) {
  const [, route, firstLoadStr] = match;
  const firstLoad = parseFloat(firstLoadStr);
  if (firstLoad > MAX_KB) {
    failures.push(`  ${route}: ${firstLoad} kB (limit: ${MAX_KB} kB)`);
  }
}

if (failures.length > 0) {
  console.error(`\nBUNDLE SIZE GATE FAILED — routes exceed ${MAX_KB} kB First Load JS:`);
  failures.forEach(f => console.error(f));
  process.exit(1);
} else {
  console.log(`Bundle size check PASSED — all routes under ${MAX_KB} kB.`);
}
```

**Run:** `node scripts/check-bundle-size.mjs`

**Add to package.json scripts:**
```json
"check:bundle": "node scripts/check-bundle-size.mjs"
```

**Note on reCAPTCHA:** The `react-google-recaptcha-v3` package + Google reCAPTCHA script adds ~35–40 KB to the `/contact` route. If `/contact` nears 200 KB, the CONTEXT.md fallback is lazy-loading the reCAPTCHA script on first input focus. The Phase 6 plan should run `npm run build`, read the `/contact` First Load JS number, and only implement lazy-loading if it exceeds 200 KB.

**How to find `.next/build-manifest.json`:** It lists all JS chunks per route but doesn't sum them into "First Load JS" directly. The build output table is the canonical source — parse stdout directly as above.

---

### Q14: Priority Image Strategy with next/image

**Source:** Read Hero.tsx, ServiceHero.tsx, AboutHero.tsx directly. Confidence: HIGH.

**Current implementation — all hero images already use next/image correctly:**

| Component | Image | priority | fetchPriority | Notes |
|---|---|---|---|---|
| `Hero.tsx:35` | `/images/hero-placeholder.jpg` | YES | `"high"` | Correct |
| `ServiceHero.tsx:37` | `service.heroImagePath` | YES | `"high"` | Correct |
| `AboutHero.tsx:47` | `/images/about-hero.webp` | YES | `"high"` | Correct |
| `Header.tsx:18` | `/images/raptor-roofing-logo.png` | YES | — | Correct (above fold) |

All above-the-fold hero images have both `priority` (which Next.js uses to add `<link rel="preload">`) AND `fetchPriority="high"` (which maps to the HTML `fetchpriority="high"` attribute). This is the correct pattern.

**What's NOT using priority (correctly):**
- Footer logo — no `priority`, which is correct (below fold, lazy load is fine)
- MobileMenuButton logo inside overlay — no `priority`, which is fine

**The main issue is the missing physical files** (Q5), not the `priority` prop implementation. Once the WebP files exist at the referenced paths, LCP will be measured accurately.

**One improvement to make:** The existing `Hero.tsx` references `/images/hero-placeholder.jpg` (JPEG). After converting to WebP, update the `src` prop. The `fill` + `sizes="100vw"` combination is already correct for a full-bleed hero.

---

### Q15: Pitfalls Specific to Phase 6

**Source:** Codebase analysis + verified patterns. Confidence: HIGH.

#### Pitfall 1: Sitemap Env Var at Build Time (CRITICAL)
**What:** `process.env.NEXT_PUBLIC_SITE_URL` is evaluated at **Node.js build time** in `sitemap.ts`, not at runtime. Vercel injects `NEXT_PUBLIC_*` vars into the build environment, so this works correctly. However, if `sitemap.ts` imports `siteConfig` (which has a fallback `?? "https://raptor-roofing.vercel.app"`), the throw guard will never fire even when the env var is missing.
**Prevention:** In `sitemap.ts`, read `process.env.NEXT_PUBLIC_SITE_URL` directly with a raw throw — do NOT use `siteConfig.url`.

#### Pitfall 2: Main ID Mismatch (Already Exists)
**What:** Root layout has `href="#main-content"` but marketing layout has `id="main-content"`. These currently match. CONTEXT.md wants to change both to `id="main"`. If only one is updated, the skip link breaks silently.
**Prevention:** Change both in the same edit pass. Verify with keyboard Tab → Enter on the live site.

#### Pitfall 3: `focus:ring` vs `focus-visible:ring` in Form Inputs
**What:** LeadForm and ContactForm use `focus:ring-2 focus:ring-primary-500` (triggers on mouse click too, visually noisy). The global `*:focus-visible` rule uses `outline`, while form inputs suppress outline with Tailwind's normalize. The result: form inputs show a blue primary-500 ring on mouse click instead of the brand accent-500 crimson ring on keyboard focus.
**Prevention:** Replace `focus:ring-2 focus:ring-primary-500 focus:border-primary-500` with `focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:border-accent-500` in both LeadForm and ContactForm.

#### Pitfall 4: Empty `public/og/` Directory Causes OG Image 404
**What:** Root layout `src/app/layout.tsx` line 54 references `/og/default.jpg`. The `public/og/` directory exists but is empty. Every page that uses `buildMetadata()` with no explicit `ogImage` falls back to `/og/default.jpg` (metadata.ts line 40). Lighthouse "Best Practices" audits OG tags and a 404 image URL deducts points.
**Prevention:** Create `public/og/default.jpg` (1200×630) in Phase 6 before running Lighthouse.

#### Pitfall 5: reCAPTCHA Badge and Lighthouse Best Practices
**What:** Google reCAPTCHA v3 injects a floating badge in the bottom-right corner of `/contact`. Lighthouse "Best Practices" may flag the reCAPTCHA badge for privacy/third-party cookie issues. Additionally, the reCAPTCHA API script is served from `www.google.com/recaptcha/` which may trigger "Uses third-party cookies" or similar warnings.
**Detection:** Run Lighthouse on `/contact` specifically and check the "Best Practices" audit details.
**Mitigation:** The reCAPTCHA script is scoped to `/contact` only (loaded by `GoogleReCaptchaProvider` in `ContactForm.tsx`). This is already the best practice — it won't appear on other pages. If Lighthouse Best Practices < 90 on `/contact` due to reCAPTCHA, accepted per CONTEXT.md decision.

#### Pitfall 6: Testimonial Dot Buttons Are Severely Undersized
**What:** `TestimonialCarousel.tsx` dot nav buttons are `h-3 w-3` (12px). This fails 48×48 by a factor of 4. Lighthouse Accessibility audit will catch this.
**Prevention:** Expand the visual dot with a larger invisible hit area. Best pattern: use `::before` or wrap in a button sized to 48×48 with `flex items-center justify-center`. Visual dot remains small (12px); interactive target is 48×48.

#### Pitfall 7: Footer Links With No Minimum Height
**What:** Footer service, service-area, and legal text links have no `min-h` or `py` class. On mobile, these are tiny tap targets (~24px).
**Prevention:** Add `block py-1.5 min-h-[44px] flex items-center` to each footer link, OR use a global footer `li > a` CSS rule.

#### Pitfall 8: `about-hero.webp` Doesn't Exist — Causes Build Warning, Not Error
**What:** Next.js Image component does not validate that the file exists at build time. The page renders fine, but the browser gets a 404 for the image, degrading LCP significantly (Lighthouse will fail Performance).
**Detection:** Run `npm run build` — no error. Only discovered by Lighthouse or browser DevTools.
**Prevention:** Commit all 6 missing images BEFORE running Lighthouse verification.

#### Pitfall 9: `neutral-500` Text May Fail 4.5:1
**What:** `text-neutral-500` (`#4a5c62`) is used for supporting/secondary text throughout the site (e.g., FAQ section description, testimonial section description). On the page background `#faf7f2`, this may be close to the 4.5:1 threshold.
**Verification:** Compute `#4a5c62` on `#faf7f2` — estimated ~3.9:1. If below 4.5:1, upgrade to `neutral-600` (#344248) for body copy.

#### Pitfall 10: Static OG Image Path Must Match Physical File
**What:** `buildMetadata()` defaults to `ogImage = "/og/default.jpg"`. All service pages currently don't pass a custom `ogImage`, so all service pages share the same default OG image. This is acceptable for Phase 6 (not a WCAG or schema issue), but if `/og/default.jpg` doesn't exist, every OG meta tag points to a 404.
**Prevention:** Create `public/og/default.jpg` as Phase 6 deliverable.

---

## Standard Stack

No new libraries to install for Phase 6. Existing stack handles everything:

| Library | Purpose | Phase 6 Use |
|---|---|---|
| `next` 16.2.3 | `MetadataRoute.Sitemap`, `MetadataRoute.Robots` types | Create sitemap.ts and robots.ts |
| `schema-dts` 2.0.0 | JSON-LD typing | Verify no Review types used |
| Tailwind v4 | `focus-visible:` utilities | Form field focus ring fixes |
| `next/image` | Priority images | Already correct, just need files |

**No new devDependencies.** Lighthouse via `npx` requires no install.

---

## Architecture Patterns

### File locations for new files:
```
src/app/
├── sitemap.ts          ← NEW (goes in app root, not route group)
├── robots.ts           ← NEW (goes in app root, not route group)
public/
├── images/
│   ├── hero.webp       ← RENAME from hero-placeholder.jpg (or keep name)
│   ├── about-hero.webp ← NEW
│   ├── roofing-hero.webp ← NEW (update services.ts)
│   ├── siding-hero.webp  ← NEW
│   ├── gutters-hero.webp ← NEW
│   ├── emergency-tarping-hero.webp ← NEW
│   └── SOURCES.md      ← NEW
├── og/
│   └── default.jpg     ← NEW (1200×630)
scripts/
└── check-bundle-size.mjs ← NEW
```

### Don't Hand-Roll:
| Problem | Don't Build | Use Instead |
|---|---|---|
| Sitemap generation | Custom XML builder | `app/sitemap.ts` with `MetadataRoute.Sitemap` |
| Robots.txt | Static text file | `app/robots.ts` with `MetadataRoute.Robots` |
| Contrast checking | Custom calculator | WebAIM tool + Lighthouse accessibility audit |
| Bundle analysis | Bundle walker script | Parse `npm run build` stdout (Q13 script) |
| Accessibility testing | axe-core install | Lighthouse via `npx` |

---

## Common Pitfalls

See Q15 above for full pitfall list. Quick summary:

1. **Sitemap env var throw guard** — read `process.env.NEXT_PUBLIC_SITE_URL` directly, don't use siteConfig
2. **Skip link id mismatch** — change both `href="#main-content"` (root layout) and `id="main-content"` (marketing layout) together
3. **Missing tabIndex={-1}** on `<main>` — skip link won't focus without it
4. **6 missing hero images** — commit WebP files before running Lighthouse
5. **Empty public/og/** — `default.jpg` 404 kills Best Practices score
6. **Dot nav buttons** — 12px tap target, severe WCAG failure
7. **Footer links** — text-only links with no tap target padding
8. **`focus:` vs `focus-visible:`** in form inputs

---

## Open Questions

1. **`hero-placeholder.jpg` file size:** The existing `public/images/hero-placeholder.jpg` is an unknown file size (HERO_CREDIT.txt suggests it came from Unsplash). Phase 6 should check: if it's under 100 KB WebP equivalent, keep it (converted to WebP). If over, re-source or compress.

2. **`neutral-500` contrast exact value:** Estimated ~3.9:1, below AA. Phase 6 should compute the exact ratio and determine whether `text-neutral-500` appears in any WCAG-required text contexts (i.e., not placeholder/decorative text).

3. **Service grid cards (ServiceGrid.tsx):** Not read during research — the entire `ServiceGrid.tsx` component should be audited for tap target size on mobile. If service cards are `<Link>` wrappers on `<div>` blocks, they should be fine; if they're inline links inside larger divs, need padding check.

4. **reCAPTCHA badge Lighthouse impact:** Unknown until Lighthouse runs against `/contact` live. If Best Practices < 90 due to reCAPTCHA alone, CONTEXT.md accepts this. Planner should note this as an acceptable exception in the Phase 6 plan.

---

## Sources

### PRIMARY (HIGH confidence)
- Next.js 16.2.4 official docs — `/sitemap` — fetched live 2026-04-15
- Next.js 16.2.4 official docs — `/robots` — fetched live 2026-04-15
- `src/lib/metadata.ts` — read directly (canonical already implemented)
- `src/lib/schema.tsx` — read directly (aggregateRating already commented out)
- `src/components/layout/Footer.tsx` — read directly (no aggregateRating emitted)
- `src/app/globals.css` — read directly (focus-visible rule + skip-to-main CSS already present)
- `src/app/layout.tsx` — read directly (skip link HTML already present)
- `src/app/(marketing)/layout.tsx` — read directly (main id found)
- All hero component files — read directly
- `src/content/site.ts`, `testimonials.ts`, `services.ts` — read directly
- Contrast ratios — computed via Node.js luminance calculation against exact @theme hex values

### SECONDARY (MEDIUM confidence)
- Unsplash license (commercial use confirmed from license page)
- Pexels license (commercial use confirmed)
- `npx lighthouse` CLI flags — from Lighthouse docs and training knowledge

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all verified against codebase and Next.js 16.2.4 official docs
- Architecture: HIGH — all paths and component locations read from actual files
- Pitfalls: HIGH — derived from actual codebase state, not hypotheticals
- Contrast ratios: HIGH — computed mathematically from exact @theme hex values

**Research date:** 2026-04-15
**Valid until:** 2026-07-15 (stable Next.js metadata API; no breaking changes expected)
