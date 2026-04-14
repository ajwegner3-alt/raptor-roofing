# Stack Research — Raptor Roofing Next.js Site

**Project:** Raptor Roofing — local trade contractor marketing site, Omaha NE
**Researched:** 2026-04-13
**Overall confidence:** HIGH (all major picks verified against official Next.js docs updated 2026-04-10)

---

## Framework

### Next.js

**Use: Next.js 15 (latest stable as of April 2026)**
**Confidence: HIGH** — verified via nextjs.org/blog/next-15 (official release post)

Version 15 ships with React 19 support, Turbopack stable in dev, faster static generation, and App Router maturity. The docs themselves are versioned 16.2.3 as of 2026-04-10, which is the docs versioning — Next.js 15 remains the current stable framework release.

**Router: App Router**

Use App Router, not Pages Router. For a greenfield static marketing site in 2026, Pages Router is legacy. App Router gives:
- Native `generateMetadata` API for per-page SEO (title, description, OG, canonical, robots) — cleaner than `<Head>` juggling
- Built-in `sitemap.ts` and `robots.ts` file conventions
- Server Components by default (zero JS sent for static sections = better LCP)
- `layout.js` lets you place JSON-LD schema once per template type

The tradeoff is that App Router has more boilerplate ceremony for simple things. For a marketing site with 8-10 pages all statically generated, this is a non-issue. Every page will be static — no `useSearchParams`, no auth, no dynamic routes except service/area slug pages, all of which use `generateStaticParams`.

**Do not use Pages Router** — `getStaticProps`, `getStaticPaths`, and `<Head>` from `next/head` are the old pattern. New work should not start there in 2026.

---

### Tailwind CSS

**Use: Tailwind CSS v4**
**Confidence: HIGH** — verified via tailwindcss.com/docs/upgrade-guide (official docs)

Tailwind v4 is the correct choice for a new project starting in April 2026:

- CSS-first configuration via `@theme` directive — no more `tailwind.config.js` required
- Oxide engine (Rust-based): full rebuilds in under 100ms vs 3.5s in v3
- Built-in container queries, 3D transforms, `@starting-style`
- Native CSS variables replace the JS config layer
- GA since early 2025, production-ready, ecosystem has had 12+ months to catch up

Browser support requires Safari 16.4+, Chrome 111+, Firefox 128+. The Raptor Roofing target audience (Omaha homeowners on mobile) is overwhelmingly on modern iOS/Android — this is a non-issue.

**Do not use Tailwind v3** for new projects. v3 is not receiving new features. The only reason to stay on v3 is existing codebases with v3-specific plugins or legacy browser requirements — neither applies here.

---

### TypeScript

**Use: TypeScript — yes**
**Confidence: HIGH**

Use TypeScript for the entire project. Rationale:
- `next.config.ts` is now first-class in Next.js 15
- `MetadataRoute.Sitemap` and `MetadataRoute.Robots` types prevent schema errors
- `schema-dts` gives type safety for JSON-LD objects (see SEO section)
- `generateStaticParams` return types catch slug bugs at build time, not in production

No meaningful overhead for a small marketing site. The type safety pays for itself immediately on SEO metadata, which is a complex nested object structure.

---

## Styling and Components

### Component Library

**Use: None — custom components only**
**Confidence: HIGH**

Do not install shadcn/ui, Radix, Chakra, or any component library. Rationale:

- Contractor sites need trust-signaling design that looks human-crafted, not UI kit defaults
- shadcn/ui ships with Inter font and neutral-gray defaults that produce the exact "AI slop" look to avoid
- Component libraries add bundle weight even with tree-shaking
- Tailwind v4 + custom components gives full visual control with zero runtime overhead

The only components needed: `<Image>`, custom form elements, a mobile nav toggle. All trivially buildable with Tailwind utilities.

### Icon Strategy

**Use: lucide-react (selectively) + inline SVGs for hero/brand icons**
**Confidence: MEDIUM**

lucide-react has 1,500+ icons, 29M weekly downloads, ESM-first, fully tree-shakeable. At the scale of a contractor site (20-30 icons max), bundle impact is negligible when imported individually (`import { Phone } from 'lucide-react'` — never `import * from 'lucide-react'`).

The project CLAUDE.md calls for inline SVGs for contractor sites. Honor that for:
- Brand marks (logo, trust badges, certifications)
- Hero section icons (custom shield/roof graphics)
- Any icon that needs pixel-level control or animation

Use lucide-react for utility icons (checkmarks, arrows, phone, map pin, clock) where consistent stroke-weight matters more than customization.

**Do not use react-icons** — the bundle is enormous and tree-shaking is unreliable. A common mistake that adds 100KB+ to the client bundle.

### Font Loading

**Use: next/font/google — self-hosted, never CDN link tags**
**Confidence: HIGH** — verified via Next.js official docs and corroborated by multiple 2026 performance guides

`next/font/google` downloads and self-hosts Google Fonts at build time. Benefits:
- Eliminates external DNS lookup + TLS handshake to Google's servers (saves 100-300ms LCP)
- Automatically generates `font-display: swap` fallback metrics — zero CLS from font swap
- Fonts are served from the same origin as the app (Vercel CDN edge)
- GDPR-safe: no request ever leaves the user's browser to Google's servers

CDN `<link rel="stylesheet">` tags for fonts are a Core Web Vitals anti-pattern in 2026. They add a render-blocking round-trip and a third-party connection that blocks LCP.

Example usage:

```ts
// app/layout.tsx
import { Oswald, Source_Serif_4 } from 'next/font/google'

const heading = Oswald({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-heading' })
const body = Source_Serif_4({ subsets: ['latin'], weight: ['400'], variable: '--font-body' })
```

---

## Performance

### Image Optimization

**Use: next/image with static imports for all above-the-fold images**
**Confidence: HIGH** — verified via Next.js docs v16.2.3 (2026-04-10)

Key findings from the official docs:

**For LCP hero image (critical path):**
- Use `preload={true}` — new in Next.js 16.0.0, replaces the deprecated `priority` prop
- Set `fetchPriority="high"` explicitly
- Use `loading="eager"` (not lazy)
- The `priority` prop is **deprecated as of Next.js 16.0.0** — use `preload` instead
- Static import (`import hero from './hero.jpg'`) gives automatic dimensions and blur placeholder

```tsx
import heroImage from '@/public/images/omaha-roof-storm-damage.jpg'

<Image
  src={heroImage}
  alt="Storm-damaged roof in Omaha before Raptor Roofing replacement"
  preload={true}
  fetchPriority="high"
  loading="eager"
  sizes="100vw"
  quality={80}
  placeholder="blur"
/>
```

**AVIF vs WebP:**
- Next.js default is WebP only: `formats: ['image/webp']`
- AVIF is 20% smaller than WebP but takes 50% longer to encode on first request
- For a contractor site with real photography, enable both: `formats: ['image/avif', 'image/webp']`
- AVIF serves for modern Chrome/Firefox, WebP fallback for Safari 14-16, original format as final fallback
- Note: this doubles cached storage on Vercel. Acceptable for a small site.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

**For art-direction (different hero on mobile vs desktop):**
- Cannot use `preload` or `loading="eager"` — both images would load
- Use `fetchPriority="high"` only (per official docs)

**Sharp:**
- Next.js 15 automatically uses Sharp when running `next start` or standalone output
- No manual `npm install sharp` needed for Vercel deployment
- Sharp handles AVIF encoding server-side

### Core Web Vitals Targets and How to Hit Them

| Metric | Target | Primary Lever |
|--------|--------|---------------|
| LCP | < 2.5s | Hero image `preload + fetchPriority="high"`, next/font self-hosting, static generation |
| CLS | < 0.1 | Always set `width` and `height` on `<Image>` (or use `fill` with sized parent), `font-display: swap` with size-adjust via next/font |
| INP | < 200ms | Minimal client JS — Server Components for all static content, no heavy client-side libraries |

The biggest LCP risk on a roofing site is the hero photograph. With `preload={true}` + AVIF format + Vercel edge CDN, a 1400px wide hero should deliver in 400-700ms on mobile LTE. Keep hero images under 150KB post-optimization (quality=80 AVIF).

---

## SEO

### Metadata API (title, description, OG, canonical, robots)

**Use: Next.js App Router generateMetadata — no next-seo library needed**
**Confidence: HIGH** — verified via official Next.js docs

The App Router's `generateMetadata` function handles all per-page SEO. Use it in every `page.tsx`:

```ts
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Roof Replacement in Omaha | Raptor Roofing',
    description: 'Omaha\'s trusted storm damage roofer. Free inspections, insurance claim help. Call (402) 555-0123.',
    alternates: { canonical: 'https://raptor-roofing.vercel.app/services/roof-replacement' },
    openGraph: {
      title: 'Roof Replacement in Omaha | Raptor Roofing',
      description: '...',
      images: [{ url: '/og/roof-replacement.jpg', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true },
  }
}
```

**Do not install next-seo.** It was essential in the Pages Router era to manage `<Head>` tags. The App Router's Metadata API replaces it entirely and is first-party, maintained by Vercel.

### Schema.org / JSON-LD

**Use: Inline `<script>` tag in Server Components with XSS-safe stringify**
**Confidence: HIGH** — verified via nextjs.org/docs/app/guides/json-ld (last updated 2026-04-10)

The official Next.js pattern for JSON-LD in App Router:

```tsx
// app/page.tsx (homepage)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Raptor Roofing',
  telephone: '(402) 555-0123',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '...',
    addressLocality: 'Omaha',
    addressRegion: 'NE',
    postalCode: '68102',
  },
  // ...
}

return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
    {/* page content */}
  </>
)
```

Key notes:
- Use the `.replace(/</g, '\\u003c')` XSS sanitization — official recommendation
- Use `schema-dts` npm package for TypeScript types on the JSON-LD object
- Do NOT use `next/script` for JSON-LD — it is structured data, not executable code; a native `<script>` tag is correct
- Place in `layout.tsx` for schema that applies to all pages (Organization), in `page.tsx` for page-specific schema (Service, FAQPage, BreadcrumbList)

Schema types needed for Raptor Roofing:
- Homepage: `LocalBusiness` + `HomeAndConstructionBusiness`
- Service pages: `Service`
- Any page with reviews: `AggregateRating`
- FAQ sections: `FAQPage`
- All pages: `BreadcrumbList`

### Sitemap

**Use: Built-in `app/sitemap.ts` — no next-sitemap package**
**Confidence: HIGH** — verified via nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap (2026-04-10)

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://raptor-roofing.vercel.app', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://raptor-roofing.vercel.app/services/roofing', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    // ... all pages
  ]
}
```

For a ~10 page marketing site, a static sitemap.ts is perfect. No need for next-sitemap's configuration overhead. The built-in approach is typed, zero-dependency, and serves `sitemap.xml` automatically.

**next-sitemap is unnecessary here.** It adds value for CMS-driven sites with hundreds of dynamically generated pages. For a static contractor site, it's over-engineering.

### robots.txt

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://raptor-roofing.vercel.app/sitemap.xml',
  }
}
```

---

## Forms and Lead Capture

### Recommended: n8n Cloud Webhook (free, already in Andrew's stack)

**Confidence: MEDIUM** — n8n Cloud webhook functionality verified; free tier limits require validation against current n8n.io pricing

This is the strongest option given the project constraints because:
- Andrew already has n8n Cloud — no new service to set up
- A Raptor Roofing lead form submission can trigger: email notification to client, Google Sheets row append (CRM), optional Slack alert
- Webhook URL is the POST target of the Next.js form handler (a Route Handler at `app/api/contact/route.ts`)
- Free tier of n8n Cloud includes webhook triggers
- No vendor lock-in — n8n is self-hostable if Andrew ever moves off Cloud

Implementation: Next.js Route Handler POSTs the form data to n8n webhook URL. n8n workflow routes to email + Sheets. This keeps the form behavior invisible to the end-user and gives complete control over the lead pipeline.

```ts
// app/api/contact/route.ts
export async function POST(req: Request) {
  const data = await req.json()
  await fetch(process.env.N8N_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return Response.json({ ok: true })
}
```

The n8n webhook URL is stored as a Vercel environment variable — never in source code.

### Runner-up: Formspree (free tier, 50 submissions/month)

**Confidence: HIGH** — free tier limits verified via multiple 2026 sources; 50 submissions/month, email notifications, 30-day history retention

Formspree works with no backend: POST the form directly to `https://formspree.io/f/{id}`. Email notifications included on free tier. No webhook access on free tier (paid only).

Use Formspree if n8n Cloud is unavailable or if Andrew wants a simpler fallback with no n8n dependency.

Limitation: 50 submissions/month. A warm-lead pitch site likely stays well under that. But if the site goes live and gets real traffic, this cap is a concern.

### Other Options Evaluated

| Option | Free Tier | Verdict |
|--------|-----------|---------|
| Netlify Forms | Free on Netlify hosting only | Not applicable — project deploys to Vercel |
| Vercel Serverless + Resend | Resend free = 100 emails/day | Viable but requires setting up Resend account; more moving parts than n8n |
| Google Sheets webhook (Apps Script) | Fully free | Works but fragile; script deployment and CORS handling is error-prone |
| Basin.co | 100 submissions/month free | Viable alternative to Formspree, comparable limits |

### Anti-Patterns for Forms

- **Do not use Netlify Forms on a Vercel deployment.** It requires Netlify's HTML injection step which only happens on Netlify's build pipeline. Forms will silently fail.
- **Do not use email-only forms** (no phone number field). Contractors need a phone number — always make `tel` the primary required field.
- **Do not POST form data to a third-party endpoint from the browser directly** if the endpoint URL contains a secret key. Use a Next.js Route Handler as the intermediary and store keys in environment variables.

---

## Analytics

### Recommended: Vercel Web Analytics + manual call tracking note

**Confidence: HIGH** — Vercel free tier limits verified (2,500 events/month)

For a Vercel-hosted preview pitch site, Vercel Web Analytics is the right starting point:
- Zero config: enable with one npm package and two lines of code
- Free tier: 2,500 events/month — more than sufficient for a pitch/warm-lead site
- No cookie banner required (privacy-preserving by design)
- Shows pageviews, referrers, top pages, geography, device type

```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Call tracking**: Vercel Analytics does not track phone clicks by default. Add a custom event on the CTA phone link:

```tsx
import { track } from '@vercel/analytics'

<a href="tel:4025550123" onClick={() => track('phone_click', { page: 'homepage_hero' })}>
  (402) 555-0123
</a>
```

**Form submission tracking**: fire a custom event from the form success handler.

### What NOT to Use for this Phase

**GA4**: Overkill for a pitch site. Setup overhead (property creation, data stream, cookie consent) is not justified. If the client converts and the site goes live for real, GA4 is the right long-term answer. Start with Vercel Analytics and migrate later.

**Plausible**: $19/month. Zero-budget constraint eliminates it. Plausible is the right answer if budget opens up — better privacy story, better UX, more detailed than Vercel Analytics.

### What to Instrument

At minimum, track these events:
- `phone_click` — phone number CTA clicks (header, hero, sticky bar)
- `form_submit` — contact form submissions
- `form_error` — validation errors (tells you what's confusing users)
- `cta_click` — "Get Free Inspection" button clicks

---

## Deployment

### Vercel Config

**Confidence: HIGH** — verified via Vercel docs

For a preview-URL-only deploy (no custom domain), the setup is minimal:

1. Create GitHub repo (one repo per project — Andrew's preference)
2. Connect repo to Vercel (import project in Vercel dashboard)
3. Vercel auto-detects Next.js and sets build command (`next build`) and output dir (`.next`)
4. Every push to `main` triggers a production build at `https://[project-name].vercel.app`
5. Every push to a branch triggers a preview deploy at `https://[project-name]-[hash]-[team].vercel.app`

No custom `vercel.json` is needed for a standard Next.js App Router site. The framework preset handles everything.

**Environment variables**: Set in Vercel dashboard under Project Settings > Environment Variables. Required for this project:
- `N8N_WEBHOOK_URL` — form submission target
- `NEXT_PUBLIC_SITE_URL` — used in canonical tags and sitemap (set to the `.vercel.app` URL)

**Build settings that matter:**
```
Framework Preset: Next.js (auto-detected)
Build Command: next build (default)
Output Directory: .next (default)
Install Command: npm install (default)
Node.js Version: 20.x (matches Next.js 15 minimum of 18.18.0+)
```

**Turbopack in development (optional):**
```json
// package.json
"dev": "next dev --turbo"
```
Turbopack is stable in dev as of Next.js 15 and provides significantly faster HMR.

### GitHub Integration

```bash
# Initialize repo
git init
git add .
git commit -m "feat: initial Next.js 15 setup for Raptor Roofing"
git branch -M main
git remote add origin https://github.com/[andrew-username]/raptor-roofing.git
git push -u origin main
```

Then connect in Vercel dashboard: New Project > Import Git Repository > Select `raptor-roofing`.

Vercel auto-deploys on every push to `main`. Preview deploys on pull request branches.

---

## What NOT to Use

| Technology | Reason to Avoid |
|------------|----------------|
| Pages Router | Legacy pattern; `getStaticProps`, `<Head>`, and `next/head` all have App Router equivalents that are cleaner |
| next-seo | Replaced entirely by App Router `generateMetadata` API. Adding it creates duplicate metadata management |
| next-sitemap | Over-engineering for a 10-page static site. Built-in `sitemap.ts` is sufficient and typed |
| shadcn/ui | Defaults (Inter font, neutral grays) produce exactly the generic UI-kit look that kills trust-signal design for contractors |
| react-icons | Tree-shaking is unreliable; bundle cost is high. Use lucide-react with specific named imports |
| GA4 (for pitch phase) | Setup overhead not justified for a preview pitch site |
| Plausible | $19/month minimum, not free-tier compliant |
| Netlify Forms | Only works on Netlify infrastructure — will silently fail on Vercel |
| CDN Google Fonts link tags | Third-party DNS/TLS adds 100-300ms to LCP. Use next/font/google instead |
| Tailwind v3 | No new features; use v4 for all new projects |
| `priority` prop on next/image | Deprecated in Next.js 16.0.0. Use `preload={true}` instead |
| `next/script` for JSON-LD | JSON-LD is structured data, not executable JS. Use a native `<script>` tag |
| Supabase / any database | No backend required for this site — pure marketing pages + form webhook |
| TypeScript `strict: false` | No reason to disable strict mode on a greenfield project; catch schema errors early |

---

## Installation

```bash
# Bootstrap
npx create-next-app@latest raptor-roofing --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

# When asked "Would you like to use Turbopack for next dev?" → Yes

# Schema type safety for JSON-LD
npm install schema-dts

# Analytics
npm install @vercel/analytics

# Icons (install only, import individually)
npm install lucide-react

# Types for lucide (included with package, no separate @types needed)
```

Tailwind v4 is included when using the latest `create-next-app` with `--tailwind`. Verify it installed v4 after scaffolding (`cat package.json | grep tailwind`).

---

## Confidence Notes

| Item | Confidence | Basis | Caveat |
|------|------------|-------|--------|
| Next.js 15, App Router | HIGH | Official blog post, docs dated 2026-04-10 | Docs show version 16.2.3 in metadata but this appears to be docs version, not framework version |
| Tailwind v4 for new projects | HIGH | Official upgrade guide + multiple corroborating sources | No outstanding issues found in 2026 ecosystem |
| next/font over CDN fonts | HIGH | Official docs + 2026 Core Web Vitals guides | Consensus is clear and consistent |
| `preload` replaces `priority` on next/image | HIGH | Official Next.js docs changelog: deprecated in v16.0.0 | If using Next.js 15 (not 16), `priority` still works — but write new code with `preload` to be forward-compatible |
| AVIF + WebP in next.config | HIGH | Official docs | Minor: AVIF encoding is slower on first request; acceptable tradeoff |
| n8n webhook for forms | MEDIUM | n8n docs confirm webhook trigger; free tier confirmed generally | Exact n8n Cloud free tier webhook limits should be verified before final implementation |
| Formspree 50 submissions/month | HIGH | Multiple 2026 pricing sources agree | Free tier changed from 100 to 50 submissions; verify at formspree.io/plans at project start |
| Vercel Analytics 2,500 events free | HIGH | Vercel official pricing docs | Sufficient for pitch site; would hit limits if site goes live with real traffic |
| JSON-LD via inline script | HIGH | Official Next.js docs (2026-04-10) | XSS sanitization (`.replace(/</g, '\\u003c')`) is required, not optional |
| Built-in sitemap.ts vs next-sitemap | HIGH | Official docs verified; community consensus confirmed | For >500 pages a CMS-driven approach would reconsider |
| lucide-react over heroicons | MEDIUM | Community benchmark data; WebSearch-sourced | Neither is wrong; lucide has better icon coverage and higher adoption |
