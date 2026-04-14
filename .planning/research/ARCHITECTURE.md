# Architecture Research — Raptor Roofing Site

**Domain:** Next.js 15 App Router marketing site for a roofing contractor
**Researched:** 2026-04-13
**Confidence:** HIGH (all patterns verified against official Next.js docs, lastUpdated 2026-04-10)

---

## Recommended File Structure

This layout uses the `src/` convention (separates app code from root config files), the `(marketing)` route group pattern (official Next.js recommendation for organizing site sections without affecting URLs), and colocated page-specific components via private `_components` folders.

```
raptor-roofing/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   │   ├── hero-storm-damage.webp        # Homepage storm-damage hero
│   │   │   ├── hero-planned-project.webp     # Homepage planned-project variant
│   │   │   └── hero-[service].webp           # One per service page
│   │   ├── team/
│   │   │   └── owner-portrait.webp
│   │   └── og/
│   │       └── og-default.jpg                # 1200x630 OG fallback image
│   ├── favicon.ico
│   └── icon.png
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                        # Root layout: html, body, metadataBase, global schema
│   │   ├── not-found.tsx                     # 404 page
│   │   ├── sitemap.ts                        # Auto-generates /sitemap.xml
│   │   ├── robots.ts                         # Auto-generates /robots.txt
│   │   │
│   │   ├── (marketing)/                      # Route group — all public pages share one layout
│   │   │   ├── layout.tsx                    # Marketing layout: Header + StickyMobileCTA + Footer
│   │   │   │
│   │   │   ├── page.tsx                      # / — Homepage
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── roofing/
│   │   │   │   │   └── page.tsx              # /services/roofing
│   │   │   │   ├── siding/
│   │   │   │   │   └── page.tsx              # /services/siding
│   │   │   │   ├── gutters/
│   │   │   │   │   └── page.tsx              # /services/gutters
│   │   │   │   └── emergency-tarping/
│   │   │   │       └── page.tsx              # /services/emergency-tarping
│   │   │   │
│   │   │   ├── about/
│   │   │   │   └── page.tsx                  # /about
│   │   │   │
│   │   │   └── contact/
│   │   │       └── page.tsx                  # /contact
│   │   │
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts                  # POST /api/contact — form submission handler
│   │
│   ├── components/
│   │   ├── global/                           # Used on every page via layout.tsx
│   │   │   ├── Header.tsx                    # Nav + click-to-call + sticky on mobile
│   │   │   ├── Footer.tsx                    # Service areas, hours, links
│   │   │   └── StickyMobileCTA.tsx           # Fixed bottom bar: call + form link (mobile only)
│   │   │
│   │   ├── shared/                           # Used on 2+ pages but not all
│   │   │   ├── Hero.tsx                      # Accepts variant prop for storm-damage vs planned
│   │   │   ├── ServiceCard.tsx               # Single card used in ServiceGrid
│   │   │   ├── ServiceGrid.tsx               # Grid of ServiceCards
│   │   │   ├── TrustStrip.tsx                # License/insured/15-years/rating bar
│   │   │   ├── TestimonialCarousel.tsx       # Client component (carousel interaction)
│   │   │   ├── FaqAccordion.tsx              # Client component + FAQ schema injection
│   │   │   ├── ContactForm.tsx               # Client component — lead capture form
│   │   │   └── Breadcrumb.tsx                # Schema-aware breadcrumb nav
│   │   │
│   │   └── schema/                           # JSON-LD generator components (server components)
│   │       ├── LocalBusinessSchema.tsx
│   │       ├── ServiceSchema.tsx
│   │       └── FaqSchema.tsx
│   │
│   ├── content/                              # All editable copy lives here — NO JSX
│   │   ├── site.ts                           # Business name, phone, address, hours, service area
│   │   ├── services.ts                       # Array of service objects (slug, title, description, etc.)
│   │   ├── testimonials.ts                   # Array of testimonial objects
│   │   └── faqs.ts                           # Array of FAQ objects per page
│   │
│   ├── lib/
│   │   ├── metadata.ts                       # buildMetadata() helper — shared OG/Twitter defaults
│   │   └── schema.ts                         # buildLocalBusiness(), buildService() JSON-LD factories
│   │
│   └── styles/
│       └── globals.css                       # Tailwind base + custom tokens
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── .env.local                                # RESEND_API_KEY, SITE_URL
```

**Why this layout:**
- `(marketing)` route group lets all public pages share a single Header/Footer layout without affecting URLs. If a future admin section is needed, it gets its own route group with a completely different layout.
- `src/content/` separates data from markup. Raptor can hand edits to a non-developer who knows TypeScript basics, or the files can be swapped for a CMS later without touching components.
- `src/lib/` holds pure functions — no JSX, no side effects. Metadata and schema helpers live here.
- Static service pages (`services/roofing/`, `services/siding/`, etc.) are preferred over a dynamic `[slug]` route for this pitch. The slug count is fixed and known; static routes get better TypeScript autocompletion, are easier to verify at build time, and avoid the `generateStaticParams` ceremony for a 4-page section. If Raptor signs and adds 10+ services later, migrating to `[slug]` is a one-refactor job.

---

## Component Inventory

### Global (rendered on every page via `(marketing)/layout.tsx`)

| Component | Type | Key Props / Notes |
|-----------|------|-------------------|
| `Header` | Server | `siteData` from `content/site.ts`; phone number as `tel:` link; sticky via CSS `position: sticky top-0`; mobile hamburger is a Client Component island |
| `Footer` | Server | Service area list, hours, nav links, license number |
| `StickyMobileCTA` | Client | Fixed to bottom on mobile only (`md:hidden`); two buttons: Call Now + Free Estimate; dismissible via sessionStorage |

### Shared (2+ pages)

| Component | Type | Key Props / Notes |
|-----------|------|-------------------|
| `Hero` | Server | `variant: 'storm' \| 'planned' \| 'service'`; `headline`, `subheadline`, `cta`; background image via `priority` next/image |
| `ServiceCard` | Server | `service: ServiceData`; links to service page |
| `ServiceGrid` | Server | `services: ServiceData[]`; renders grid of ServiceCards |
| `TrustStrip` | Server | License badge, insured badge, years-in-business, star rating — pulled from `content/site.ts` |
| `TestimonialCarousel` | **Client** | `testimonials: Testimonial[]`; needs `'use client'` for swipe/autoplay |
| `FaqAccordion` | **Client** | `faqs: Faq[]`; needs `'use client'` for expand/collapse; parent server component injects `FaqSchema` |
| `ContactForm` | **Client** | `'use client'`; React state for field values + validation; submits to `/api/contact` |
| `Breadcrumb` | Server | `items: {label, href}[]`; renders `BreadcrumbList` schema inline |

### Page-Specific (colocated if needed)

For this 7-page pitch site, no page-specific components are expected. If a page grows complex enough to need them (e.g., an emergency tarping page with an urgency timeline), add a `_components/` folder adjacent to that `page.tsx`.

### Schema Components (`src/components/schema/`)

These are thin server components that render a `<script type="application/ld+json">` tag. They accept typed props and delegate JSON construction to `src/lib/schema.ts`.

| Component | Schema Type | Used On |
|-----------|-------------|---------|
| `LocalBusinessSchema` | `LocalBusiness` + `HomeAndConstructionBusiness` | Homepage, About |
| `ServiceSchema` | `Service` | Each service page |
| `FaqSchema` | `FAQPage` | Any page with FAQ section |

---

## Content Model

**Recommendation: TypeScript data files in `src/content/`.**

For this pitch site (and post-signing v1), keeping copy in TypeScript files is the right call. Here is why each alternative was considered and rejected:

| Approach | Verdict | Reason |
|----------|---------|--------|
| Inline JSX copy | Rejected | Tightly couples content to markup; every copy edit requires touching a component |
| TypeScript data files | **Recommended** | Easy to edit, type-safe, zero build overhead, no external dependency |
| MDX | Over-engineered for pitch | Adds remark/rehype pipeline complexity; best for blog content with custom components, not service page copy |
| Headless CMS (Contentful, Sanity) | Overkill until signed | Adds API dependency, auth, and cost for a pitch with placeholder content |

### Data shape examples

```typescript
// src/content/site.ts
export const SITE = {
  name: 'Raptor Roofing',
  phone: '(402) 885-1462',
  phoneHref: 'tel:+14028851462',
  address: {
    street: '...',        // Placeholder until Raptor provides
    city: 'Omaha',
    state: 'NE',
    zip: '...',
  },
  hours: 'Mon–Sat 7am–7pm',
  licenseNumber: '...',   // Placeholder
  serviceArea: ['Omaha', 'Bellevue', 'Papillion', 'Elkhorn', 'Gretna', 'La Vista'],
  googleRating: 4.9,
  reviewCount: 127,       // Placeholder — mark clearly
} as const

// src/content/services.ts
export type ServiceData = {
  slug: string
  title: string
  shortDescription: string
  longDescription: string
  heroImage: string       // Path relative to public/
  features: string[]
  emergencyService: boolean
}

export const SERVICES: ServiceData[] = [
  {
    slug: 'roofing',
    title: 'Roofing Installation & Repair',
    shortDescription: '...',
    // ...
  },
  // siding, gutters, emergency-tarping
]
```

**Handoff path:** When Raptor signs, replace placeholder strings in these files. If the client later wants non-developer content editing, migrate `src/content/` to Contentful or Sanity — the components already accept typed props so the switch is a data-layer swap, not a rewrite.

---

## SEO & Metadata Pattern

**Pattern: `title.template` in root layout + static `metadata` export per page. Use `buildMetadata()` helper for shared OG defaults.**

This is the official Next.js recommendation (verified against docs lastUpdated 2026-04-10).

### Root layout sets the template

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import { SITE } from '@/content/site'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? 'https://raptor-roofing.vercel.app'),
  title: {
    template: '%s | Raptor Roofing',
    default: 'Roofing in Omaha, NE | Raptor Roofing',
  },
  description: 'Family-owned roofing contractor in Omaha, NE. 15+ years, no subcontractors, free estimates. Call (402) 885-1462.',
  openGraph: {
    siteName: 'Raptor Roofing',
    images: [{ url: '/og/og-default.jpg', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}
```

### Helper to reduce per-page boilerplate

```typescript
// src/lib/metadata.ts
import type { Metadata } from 'next'

export function buildMetadata(page: {
  title: string
  description: string
  path: string
  ogImage?: string
}): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.path,
    },
    openGraph: {
      title: `${page.title} | Raptor Roofing`,
      description: page.description,
      url: page.path,
      images: page.ogImage
        ? [{ url: page.ogImage, width: 1200, height: 630 }]
        : undefined,
    },
  }
}
```

### Per-page usage (static — no async needed for this site)

```typescript
// src/app/(marketing)/services/roofing/page.tsx
import { buildMetadata } from '@/lib/metadata'

export const metadata = buildMetadata({
  title: 'Roofing in Omaha',
  description: 'Expert roofing installation and repair in Omaha, NE. Licensed, insured, free estimates. Call Raptor Roofing.',
  path: '/services/roofing',
})
```

**Output:** `<title>Roofing in Omaha | Raptor Roofing</title>` — the template appends automatically.

**Canonical:** `alternates.canonical` is set on every page via `buildMetadata()`, preventing duplicate content penalties.

**robots:** All pages default to `index, follow` via Next.js default. The thank-you / form confirmation state is handled client-side (no separate route), so no `noindex` pages needed for v1.

---

## Structured Data Pattern

**Pattern: Thin `<SchemaName>` server components that call factory functions in `src/lib/schema.ts`. Injected directly in `page.tsx` above the page content.**

Official Next.js docs (verified 2026-04-10) recommend a native `<script type="application/ld+json">` tag rather than `next/script`, because JSON-LD is structured data not executable code.

### Factory function (no JSX dependency)

```typescript
// src/lib/schema.ts
import { SITE } from '@/content/site'

export function buildLocalBusiness() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    name: SITE.name,
    telephone: SITE.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.zip,
    },
    openingHours: 'Mo-Sa 07:00-19:00',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: SITE.googleRating,
      reviewCount: SITE.reviewCount,
    },
  }
}

export function buildService(service: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    description: service.description,
    provider: { '@type': 'LocalBusiness', name: SITE.name },
    areaServed: { '@type': 'City', name: 'Omaha' },
    url: service.url,
  }
}
```

### Schema component (thin wrapper)

```typescript
// src/components/schema/LocalBusinessSchema.tsx
import { buildLocalBusiness } from '@/lib/schema'

export function LocalBusinessSchema() {
  const schema = buildLocalBusiness()
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  )
}
```

### Usage in page

```typescript
// src/app/(marketing)/page.tsx
import { LocalBusinessSchema } from '@/components/schema/LocalBusinessSchema'

export default function HomePage() {
  return (
    <>
      <LocalBusinessSchema />
      <Hero variant="storm" />
      {/* rest of page */}
    </>
  )
}
```

The `.replace(/</g, '\\u003c')` sanitization is the official Next.js recommendation to prevent XSS via JSON-LD payloads.

---

## Sitemap and Robots

Both are built into Next.js App Router — no `next-sitemap` package needed for a static site of this size.

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next'

const BASE = process.env.SITE_URL ?? 'https://raptor-roofing.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                                  priority: 1.0,  changeFrequency: 'monthly' },
    { url: `${BASE}/services/roofing`,            priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/services/siding`,             priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/services/gutters`,            priority: 0.8,  changeFrequency: 'monthly' },
    { url: `${BASE}/services/emergency-tarping`,  priority: 0.9,  changeFrequency: 'monthly' },
    { url: `${BASE}/about`,                       priority: 0.7,  changeFrequency: 'yearly'  },
    { url: `${BASE}/contact`,                     priority: 0.8,  changeFrequency: 'yearly'  },
  ]
}
```

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${process.env.SITE_URL ?? 'https://raptor-roofing.vercel.app'}/sitemap.xml`,
  }
}
```

When service area pages are added later, they are appended to the `sitemap()` array — no configuration change elsewhere.

---

## Form Submission Flow

**Pattern: Client Component form → `fetch` POST to `/api/contact` → Vercel serverless Route Handler → Resend email API → Andrew's inbox (or Raptor's after handoff).**

No database. No auth. The form data goes straight to email. Leads are captured in the inbox and (optionally) forwarded to Google Sheets via n8n later.

```
[ContactForm.tsx]              [/api/contact/route.ts]        [Resend API]
Client Component               Vercel Edge/Node Function      Email delivery
─────────────────              ───────────────────────────    ────────────────
1. User fills form             3. Validate body               5. Send formatted
   name, phone,                   (name, phone, service,         HTML email to
   service, zip                    zip required)                  NOTIFY_EMAIL

2. fetch POST                  4. Call Resend SDK              6. Return 200
   /api/contact                   resend.emails.send()            {success: true}
   {name, phone,
    service, zip}
                                                               7. ContactForm shows
                                                                  success state
```

### Route Handler skeleton

```typescript
// src/app/api/contact/route.ts
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { name, phone, service, zip } = await req.json()

  if (!name || !phone || !service) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  await resend.emails.send({
    from: 'leads@yourdomain.com',    // Must be a Resend-verified domain
    to: process.env.NOTIFY_EMAIL!,
    subject: `New Lead: ${name} — ${service}`,
    html: `<p><strong>${name}</strong> | ${phone} | ${service} | Zip: ${zip}</p>`,
  })

  return NextResponse.json({ success: true })
}
```

**Environment variables required:**
- `RESEND_API_KEY` — from Resend dashboard
- `NOTIFY_EMAIL` — email address to receive leads
- `SITE_URL` — production URL for canonical/sitemap resolution

**Resend free tier:** 100 emails/day, 3,000/month — more than sufficient for a contractor pitch site.

**Alternative if Resend is not desired:** POST to an n8n webhook URL instead of a Resend SDK call. Same route handler, different line 4. This requires no package install and lets n8n handle routing to Google Sheets + email simultaneously.

---

## Image Architecture

**Pattern: Static imports for critical images (hero), `public/images/` for everything else. Always use `next/image` with `priority` on the above-the-fold hero.**

| Scenario | Approach | Reason |
|----------|----------|--------|
| Hero image (LCP critical) | Static import OR `priority` prop with `public/` path | Next.js generates `<link rel="preload">` automatically; prevents LCP failures |
| Service page heroes | `public/images/hero/[service].webp` + `priority` prop | Below-the-fold on homepage but above-fold on service pages |
| Team photos | `public/images/team/` | Moderate importance, lazy-load acceptable |
| Testimonial avatars | Inline SVG placeholder or tiny `public/images/` WebP | Small, low-priority |

### Static import pattern (highest LCP performance)

```typescript
import Image from 'next/image'
import heroImage from '@/public/images/hero/hero-storm-damage.webp'

export function Hero() {
  return (
    <Image
      src={heroImage}
      alt="Storm-damaged roof in Omaha being assessed by Raptor Roofing crew"
      priority               // Generates preload link, skips lazy load
      placeholder="blur"     // Static import provides blurDataURL automatically
      fill                   // Or fixed dimensions — avoid CLS
      sizes="100vw"
    />
  )
}
```

**Static import advantages:**
- Next.js extracts `width`, `height`, and `blurDataURL` at build time — no manual sizing
- `placeholder="blur"` is available for free with no extra config
- Bundle analyzes the import at build time, enabling aggressive optimization

**`public/images/` path advantages:**
- Simpler for content that will be replaced with real Raptor photos post-signing
- No need to re-import when swapping files at the same path
- Recommended for images that are CMS-managed or frequently updated

**Recommendation for Raptor pitch:** Use `public/images/` paths (not static imports) for all images. The photos are placeholder stock/AI images that will be replaced — static imports would require code changes for every image swap. Use `priority` prop on heroes and `sizes` on all images to hit LCP targets without needing static imports.

**File naming convention:** Descriptive, lowercase, hyphenated, WebP format.
- `hero-storm-damage-omaha.webp`
- `roofing-install-crew-omaha.webp`
- `siding-cedar-shake-before-after.webp`

---

## Suggested Build Order

The order is driven by three dependency rules:
1. Global layout must exist before any page can render correctly
2. Content types must be defined before components consume them
3. Shared components must exist before pages compose them

### Phase 1 — Foundation (no visible output yet, but nothing works without this)

1. `npx create-next-app@latest` with TypeScript + Tailwind + App Router + `src/` dir
2. `tailwind.config.ts` — design tokens: brand colors, type scale, spacing
3. `src/content/site.ts`, `services.ts`, `testimonials.ts`, `faqs.ts` — all content types defined with placeholder data
4. `src/lib/metadata.ts` and `src/lib/schema.ts` — helper functions
5. `src/app/layout.tsx` — root layout with `metadataBase` and title template
6. `src/app/(marketing)/layout.tsx` — shell with Header placeholder, Footer placeholder

**Why first:** Every subsequent step imports from content and lib. The layout establishes the HTML structure that everything else lives inside.

### Phase 2 — Global Components

7. `Header.tsx` — logo, nav links, click-to-call phone number, mobile hamburger
8. `Footer.tsx` — service areas, hours, license, nav links
9. `StickyMobileCTA.tsx` — bottom bar on mobile
10. `TrustStrip.tsx` — license/insured/years/rating badge row

**Why second:** These appear on every page. Building them early means every subsequent page render looks production-ready from the first preview.

### Phase 3 — Homepage

11. `Hero.tsx` (storm variant)
12. `ServiceGrid.tsx` + `ServiceCard.tsx`
13. `TestimonialCarousel.tsx`
14. `FaqAccordion.tsx` + `FaqSchema.tsx`
15. `LocalBusinessSchema.tsx`
16. `src/app/(marketing)/page.tsx` — compose all of the above

**Why third:** The homepage is the highest-value page for the pitch. Build it to completion before any service pages so the first Vercel preview URL is impressive.

### Phase 4 — Service Pages

17. `ServiceSchema.tsx`
18. `src/app/(marketing)/services/roofing/page.tsx`
19. `src/app/(marketing)/services/siding/page.tsx`
20. `src/app/(marketing)/services/gutters/page.tsx`
21. `src/app/(marketing)/services/emergency-tarping/page.tsx`

**Why fourth:** These follow a repeating pattern. Build roofing first as the template, then copy-adapt for the other three. Per-page metadata is set with `buildMetadata()`.

### Phase 5 — About and Contact

22. `src/app/(marketing)/about/page.tsx` — the anti-chaser story, 15 years, no subcontractors
23. `ContactForm.tsx` (Client Component)
24. `src/app/api/contact/route.ts` — Resend or webhook handler
25. `src/app/(marketing)/contact/page.tsx`

**Why fifth:** About and Contact require the least shared infrastructure and can be built quickly once the patterns are established.

### Phase 6 — SEO Polish

26. `src/app/sitemap.ts`
27. `src/app/robots.ts`
28. Breadcrumb schema on service pages and about
29. `alternates.canonical` audit across all pages (verify `buildMetadata()` is applied everywhere)
30. OG image verification (check og-default.jpg dimensions, verify meta tags in browser devtools)

**Why last:** SEO polish has zero impact on the visual pitch but is a signal of professionalism. Do it after all pages are built and content is finalized.

---

## Scalability

The structure above is designed so these future additions are incremental, not rewrites.

### Service Area Pages

Add `src/app/(marketing)/service-areas/[city]/page.tsx` with `generateStaticParams()`:

```typescript
// src/content/serviceAreas.ts  (new file)
export const SERVICE_AREAS = [
  { slug: 'bellevue', name: 'Bellevue', county: 'Sarpy' },
  { slug: 'papillion', name: 'Papillion', county: 'Sarpy' },
  // ...
]

// src/app/(marketing)/service-areas/[city]/page.tsx
export function generateStaticParams() {
  return SERVICE_AREAS.map(area => ({ city: area.slug }))
}
```

Add the new routes to `sitemap.ts` in the same pass. No changes to existing components.

### Project Gallery

Add `src/content/projects.ts` with typed project objects (title, before/after images, service, location, date). Create a `Gallery` shared component. Add `src/app/(marketing)/projects/page.tsx`. No changes to existing pages.

### Blog

Add `src/app/(marketing)/blog/` with MDX support (`@next/mdx` or Contentlayer). Blog posts live in `src/content/posts/` as `.mdx` files. The existing shared components (Hero, TrustStrip, ContactForm) can be imported in MDX files. Add `BlogPosting` schema to post pages. No changes to existing pages.

### CMS Migration

If Raptor wants non-developer content editing after signing:
1. Replace `src/content/*.ts` data sources with API calls to Contentful, Sanity, or similar
2. Components accept the same TypeScript prop shapes — no component rewrites
3. `generateMetadata()` fetches from CMS instead of `content/site.ts`
4. Service pages shift from static routes to `[slug]` dynamic routes with `generateStaticParams()`

The key architectural decision that enables this: content types are defined in `src/content/` as TypeScript types, and components accept those types as props. The components do not know where the data comes from.

---

## Sources

- [Next.js Project Structure — Official Docs](https://nextjs.org/docs/app/getting-started/project-structure) (lastUpdated 2026-04-10)
- [generateMetadata API Reference](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) (lastUpdated 2026-04-10)
- [JSON-LD in Next.js — Official Guide](https://nextjs.org/docs/app/guides/json-ld) (lastUpdated 2026-04-10)
- [Next.js Image Optimization](https://nextjs.org/docs/app/getting-started/images)
- [Resend with Next.js](https://resend.com/docs/send-with-nextjs)
- [sitemap.ts and robots.ts conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
