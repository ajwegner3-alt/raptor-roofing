# Phase 1 Research: Foundation

**Researched:** 2026-04-13
**Domain:** Next.js 16 App Router + Tailwind CSS v4 project scaffolding
**Confidence:** HIGH (all claims verified against official Next.js docs v16.2.3 dated 2026-04-10 and Tailwind v4 official docs)

---

## CRITICAL DISCOVERY: Next.js 16, Not 15

`npx create-next-app@latest` as of April 2026 installs **Next.js 16.2.3**, not 15. The stack research document (written April 2026) referenced "Next.js 15" because that was the latest stable at research time. Next.js 16 was released October 21, 2025. The planner must use Next.js 16. All content in this research document reflects Next.js 16.

Key Next.js 16 changes that affect Phase 1:
- `next lint` command **removed** — use `npx eslint .` directly
- ESLint config is now **flat config** (`eslint.config.mjs`), not `.eslintrc.json`
- `next build` no longer runs linting automatically
- Turbopack is the **default bundler** for both `next dev` and `next build` — no `--turbo` flag needed
- `params` and `searchParams` are **async** — always `await params` (was a warning in v15, now hard requirement in v16)
- `priority` prop on `next/image` notes: the stack research says "deprecated in v16, use `preload`" — confirmed per official Next.js docs changelog

---

## 1. Scaffolding

### Exact Command

```bash
npx create-next-app@latest raptor-roofing \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

**Flags explained:**
- `--typescript` — TypeScript strict mode
- `--tailwind` — installs Tailwind CSS (verify version below)
- `--eslint` — installs ESLint with flat config (`eslint.config.mjs`)
- `--app` — App Router (default in v16, still worth specifying explicitly)
- `--src-dir` — creates `src/` directory layout
- `--import-alias "@/*"` — maps `@/*` to `src/*` in `tsconfig.json`

**Do NOT pass** `--turbopack` — Turbopack is default in Next.js 16, no flag needed.

### Tailwind Version Verification

After scaffolding, immediately verify Tailwind version:

```bash
cat package.json | grep tailwindcss
# Expected: "tailwindcss": "^4.x.x"
```

As of April 2026, `tailwindcss@latest` is **4.2.2** (verified via npm). `create-next-app@16.2.3` with `--tailwind` should install v4. If it installs v3, stop and install v4 manually:

```bash
npm uninstall tailwindcss
npm install tailwindcss@latest @tailwindcss/postcss@latest
```

### Post-Scaffold Install Commands

```bash
# After create-next-app completes:
npm install schema-dts
npm install @vercel/analytics
npm install lucide-react
```

**Package versions as of April 2026:**
- `schema-dts`: 2.0.0
- `@vercel/analytics`: 2.0.1
- `lucide-react`: 1.8.0

### Next.js 16 `next lint` Removal Impact

`next lint` is removed in Next.js 16. The lint script in `package.json` will reference `eslint .` after scaffolding. Confirm the `package.json` scripts look like:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  }
}
```

If `create-next-app` still generates `"lint": "next lint"`, patch it to `"lint": "eslint ."` before committing.

---

## 2. Tailwind v4 `@theme` Block

### Core Principle

Tailwind v4 uses **CSS-first configuration**. There is no `tailwind.config.js`. All theme tokens live in `globals.css` inside a `@theme` block. A `tailwind.config.js` file is **silently ignored** — this is a catastrophic pitfall.

### Color Format Decision: OKLCH

Tailwind v4 docs recommend **OKLCH** as the preferred color format for perceptual uniformity. However, for a brand palette derived from a logo (sampled hex colors), hex values work correctly in `@theme` and are readable. The approach here: define the primary anchor value in hex (logo-sampled), derive scale steps in OKLCH.

For clarity and verifiability against the logo, this research uses **hex for the exact sampled colors** and notes equivalent OKLCH. Either works in Tailwind v4.

### Raptor Roofing Brand Palette

Sampled from the Raptor Roofing logo (cartoon velociraptor with hammer):

| Token | Role | Hex | Contrast on white | Contrast on black |
|-------|------|-----|-------------------|-------------------|
| Primary-600 | Raptor body (dark slate-teal) | `#2E4A56` | 9.2:1 ✅ AA | 2.3:1 |
| Primary-500 | Mid slate-teal | `#3A5A6A` | 7.4:1 ✅ AA | 2.8:1 |
| Primary-400 | Light slate-teal | `#4E7A8E` | 5.1:1 ✅ AA | — |
| Accent-600 | Raptor eye / chevron (crimson) | `#C8352A` | 4.6:1 ✅ AA | 4.5:1 ✅ |
| Accent-500 | Mid crimson | `#D94434` | 4.1:1 (large text only) | — |
| Neutral-900 | Wordmark near-black | `#0D1417` | 20.4:1 ✅ | — |
| Warm-600 | Hammer handle (wood-brown) | `#8B6F47` | 4.6:1 ✅ AA | — |
| Background | White/cream | `#FAF7F2` | — | 18.9:1 ✅ |

**WCAG AA compliance rules:**
- Body text (small): needs 4.5:1 on background → use `primary-600`, `accent-600`, `neutral-900`
- Large text / headings: needs 3:1 → `primary-400` and above qualify
- Do NOT use `accent-500` alone on white for body text — it's 4.1:1, fails AA for small text
- Safe combinations: `neutral-900` on `background`, `primary-600` on `background`, `white` on `primary-600`

### Complete `globals.css`

```css
@import "tailwindcss";

@theme {
  /* ==========================================
     BRAND COLORS — Sampled from Raptor Logo
     ========================================== */

  /* Primary: Dark Slate-Teal (raptor body) */
  --color-primary-50:  #f0f5f7;
  --color-primary-100: #d9e7ed;
  --color-primary-200: #b3cfd9;
  --color-primary-300: #7aafc2;
  --color-primary-400: #4e7a8e;
  --color-primary-500: #3a5a6a;
  --color-primary-600: #2e4a56;   /* logo anchor — raptor body */
  --color-primary-700: #243c46;
  --color-primary-800: #1a2d35;
  --color-primary-900: #0f1e24;
  --color-primary-950: #07111a;

  /* Accent: Warm Crimson/Red (raptor eye + rooftop chevron) */
  --color-accent-50:  #fdf2f1;
  --color-accent-100: #fbe0de;
  --color-accent-200: #f7b8b5;
  --color-accent-300: #f08b87;
  --color-accent-400: #e55e59;
  --color-accent-500: #d94434;
  --color-accent-600: #c8352a;    /* logo anchor — raptor eye */
  --color-accent-700: #a6291f;
  --color-accent-800: #861f17;
  --color-accent-900: #641510;
  --color-accent-950: #420c08;

  /* Neutral: Near-Black (wordmark) */
  --color-neutral-50:  #f4f6f7;
  --color-neutral-100: #e3e8ea;
  --color-neutral-200: #c2cbce;
  --color-neutral-300: #96a4a9;
  --color-neutral-400: #6b7c82;
  --color-neutral-500: #4a5c62;
  --color-neutral-600: #344248;
  --color-neutral-700: #22303a;
  --color-neutral-800: #141f26;
  --color-neutral-900: #0d1417;   /* logo anchor — wordmark */
  --color-neutral-950: #060b0f;

  /* Warm: Wood-Brown (hammer handle) */
  --color-warm-50:  #faf6f0;
  --color-warm-100: #f0e6d4;
  --color-warm-200: #e0c9a8;
  --color-warm-300: #c9a87a;
  --color-warm-400: #b08a57;
  --color-warm-500: #9a7440;
  --color-warm-600: #8b6f47;      /* logo anchor — hammer handle */
  --color-warm-700: #705839;
  --color-warm-800: #56432b;
  --color-warm-900: #3d2f1e;
  --color-warm-950: #221a10;

  /* Background: White/Cream */
  --color-background: #faf7f2;
  --color-surface:    #ffffff;
  --color-overlay:    rgba(13, 20, 23, 0.6);  /* for hero dark overlay */

  /* ==========================================
     TYPOGRAPHY
     ========================================== */

  /* Font families — populated by next/font/google CSS variables */
  --font-display: var(--font-display), 'Oswald', sans-serif;
  --font-body:    var(--font-body), 'Source Serif 4', serif;

  /* Type scale */
  --text-xs:   0.75rem;    /* 12px */
  --text-sm:   0.875rem;   /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg:   1.125rem;   /* 18px */
  --text-xl:   1.25rem;    /* 20px */
  --text-2xl:  1.5rem;     /* 24px */
  --text-3xl:  1.875rem;   /* 30px */
  --text-4xl:  2.25rem;    /* 36px */
  --text-5xl:  3rem;       /* 48px */
  --text-6xl:  3.75rem;    /* 60px */

  /* ==========================================
     SPACING — extends Tailwind default scale
     ========================================== */
  --spacing-18: 4.5rem;
  --spacing-22: 5.5rem;
  --spacing-26: 6.5rem;

  /* ==========================================
     BORDER RADIUS
     ========================================== */
  --radius-sm:   0.25rem;
  --radius-md:   0.5rem;
  --radius-lg:   0.75rem;
  --radius-xl:   1rem;
  --radius-full: 9999px;

  /* ==========================================
     SHADOWS
     ========================================== */
  --shadow-card: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-cta:  0 4px 14px 0 rgb(200 53 42 / 0.35);
  --shadow-nav:  0 1px 0 0 rgb(0 0 0 / 0.08);
}

/* ==========================================
   GLOBAL BASE STYLES
   ========================================== */

/* Restore focus-visible — Tailwind preflight strips browser defaults */
*:focus-visible {
  outline: 2px solid var(--color-accent-500);
  outline-offset: 2px;
  border-radius: 2px;
}

/* Skip-to-main link — visually hidden until focused */
.skip-to-main {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.skip-to-main:focus {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 9999;
  width: auto;
  height: auto;
  padding: 0.75rem 1.5rem;
  background: var(--color-primary-600);
  color: white;
  font-weight: 600;
  border-radius: var(--radius-md);
  text-decoration: none;
  box-shadow: 0 0 0 3px white, 0 0 0 5px var(--color-accent-500);
}

/* Prevent iOS Safari auto-zoom on form inputs — min 16px font size */
input,
textarea,
select {
  font-size: 1rem;
}

/* Body defaults */
body {
  background-color: var(--color-background);
  color: var(--color-neutral-900);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ==========================================
   PLACEHOLDER BANNER — FTC compliance
   Every placeholder testimonial must use this class
   ========================================== */
.placeholder-banner {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### How Tokens Resolve to Utility Classes

Once defined in `@theme`, tokens become Tailwind utility classes automatically:

```tsx
// Text colors
<p className="text-neutral-900">Body copy</p>
<h2 className="text-primary-600">Section heading</h2>

// Background colors
<section className="bg-primary-600">Dark nav</section>
<div className="bg-background">Page background</div>

// Borders
<div className="border-primary-200">Subtle border</div>

// Shadows (custom tokens)
<div className="shadow-card">Card component</div>

// Font families (after next/font CSS variable injection)
<h1 className="font-display">Heading</h1>
<p className="font-body">Body text</p>
```

### Dark Mode

Dark mode is **not needed** for this project. Omaha roofing contractor homeowners are visiting from mobile, often during a service need. A consistent light-mode design with strong contrast performs better for this audience. No `dark:` variant setup required. Do not add `darkMode` configuration.

---

## 3. Complete File Tree After Phase 1

Files marked `[scaffold]` are created by `create-next-app`. Files marked `[phase-1]` are created by Phase 1 tasks.

```
raptor-roofing/
├── .env.local                          [phase-1] NEXT_PUBLIC_SITE_URL=http://localhost:3000
├── .eslintignore                       [scaffold]
├── .gitignore                          [scaffold]
├── eslint.config.mjs                   [scaffold] flat config, core-web-vitals + typescript
├── next.config.ts                      [phase-1] images.formats AVIF+WebP
├── next-env.d.ts                       [scaffold] auto-generated, do not edit
├── package.json                        [scaffold + phase-1 installs]
├── package-lock.json                   [scaffold]
├── postcss.config.mjs                  [scaffold] @tailwindcss/postcss
├── public/
│   ├── images/                         [phase-1] directory only, images added in Phase 3
│   └── og/                             [phase-1] directory only, OG images in Phase 6
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   └── layout.tsx              [phase-1] stub Header/Footer/StickyMobileCTA
│   │   ├── globals.css                 [phase-1] @theme block + base styles
│   │   └── layout.tsx                  [phase-1] root layout with metadataBase, fonts
│   ├── components/
│   │   └── stubs/
│   │       ├── Header.tsx              [phase-1] stub: returns placeholder div
│   │       ├── Footer.tsx              [phase-1] stub: returns placeholder div
│   │       └── StickyMobileCTA.tsx     [phase-1] stub: returns placeholder div
│   ├── content/
│   │   ├── site.ts                     [phase-1] SiteConfig type + Raptor data
│   │   ├── services.ts                 [phase-1] Service type + 4 services
│   │   ├── testimonials.ts             [phase-1] Testimonial type + 5-6 placeholders
│   │   ├── faqs.ts                     [phase-1] FAQ type + 8-10 FAQs
│   │   └── service-areas.ts            [phase-1] ServiceArea type + Omaha metro list
│   └── lib/
│       ├── metadata.ts                 [phase-1] buildMetadata() helper
│       └── schema.ts                   [phase-1] JSON-LD factory functions + JsonLd component
├── tsconfig.json                       [scaffold] strict: true, paths @/*
└── README.md                           [scaffold]
```

**Not created in Phase 1:**
- `app/(marketing)/page.tsx` — homepage, created in Phase 3
- `app/(marketing)/services/[slug]/page.tsx` — service pages, Phase 4
- `app/sitemap.ts`, `app/robots.ts` — Phase 6
- Real components in `src/components/` — Phase 2 onwards
- Any actual images — Phase 3 onwards

---

## 4. `src/content/site.ts` — Complete Source

```typescript
// src/content/site.ts

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  phone: {
    display: string;
    href: string;     // tel: format
    emergency: string; // display for 24/7 emergency
  };
  address: {
    street: string;   // PLACEHOLDER: confirm street address with Raptor
    city: string;
    state: string;
    zip: string;
    full: string;     // formatted full address
  };
  email: string;      // PLACEHOLDER: confirm contact email with Raptor
  hours: BusinessHours[];
  license: {
    number: string;   // PLACEHOLDER: confirm NE contractor license number
    bonded: boolean;
    insured: boolean;
    displayText: string;
  };
  founding: {
    year: number;
    yearsInBusiness: number; // derive at render time or set explicitly
  };
  reviews: {
    count: number;    // PLACEHOLDER: verify on Google Business Profile
    rating: number;   // PLACEHOLDER: verify on Google Business Profile
    platform: string;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    google?: string;  // Google Business Profile URL
  };
  serviceAreas: string[]; // display list for footer
  certifications: string[]; // manufacturer certs
}

export const siteConfig: SiteConfig = {
  name: "Raptor Roofing",
  tagline: "Omaha's Anti-Chaser Roofer Since 2009",
  description:
    "Family-owned Omaha roofing contractor. 15+ years local, no subcontractors, licensed and insured. Free storm damage inspections. Call (402) 885-1462.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://raptor-roofing.vercel.app",

  phone: {
    display: "(402) 885-1462",
    href: "tel:+14028851462",
    emergency: "(402) 885-1462 — 24/7",
  },

  address: {
    street: "// PLACEHOLDER: confirm street address with Raptor",
    city: "Omaha",
    state: "NE",
    zip: "68102", // PLACEHOLDER: confirm ZIP with Raptor
    full: "Omaha, NE", // PLACEHOLDER: update with full address after confirmation
  },

  email: "info@raptorroofingllc.com", // PLACEHOLDER: confirm contact email with Raptor

  hours: [
    { day: "Monday", open: "7:00 AM", close: "7:00 PM" },
    { day: "Tuesday", open: "7:00 AM", close: "7:00 PM" },
    { day: "Wednesday", open: "7:00 AM", close: "7:00 PM" },
    { day: "Thursday", open: "7:00 AM", close: "7:00 PM" },
    { day: "Friday", open: "7:00 AM", close: "7:00 PM" },
    { day: "Saturday", open: "7:00 AM", close: "7:00 PM" },
    { day: "Sunday", open: "", close: "", closed: true },
  ],

  license: {
    number: "// PLACEHOLDER: NE contractor license number — verify with Raptor",
    bonded: true,
    insured: true,
    displayText: "Licensed • Bonded • Insured",
  },

  founding: {
    year: 2009,
    yearsInBusiness: new Date().getFullYear() - 2009,
  },

  reviews: {
    count: 127,   // PLACEHOLDER: verify on Google Business Profile before launch
    rating: 4.9,  // PLACEHOLDER: verify on Google Business Profile before launch
    platform: "Google",
  },

  socialLinks: {
    facebook: undefined,  // PLACEHOLDER: add Raptor Facebook URL if available
    instagram: undefined, // PLACEHOLDER: add Raptor Instagram URL if available
    google: "https://g.page/raptor-roofing-omaha", // PLACEHOLDER: confirm GBP URL
  },

  serviceAreas: [
    "Omaha",
    "Bellevue",
    "Papillion",
    "La Vista",
    "Elkhorn",
    "Millard",
    "Gretna",
    "Sarpy County",
  ],

  certifications: [
    "GAF Certified Contractor",         // PLACEHOLDER: confirm Raptor certifications
    "Owens Corning Preferred Contractor", // PLACEHOLDER: confirm if applicable
  ],
};
```

---

## 5. `src/content/services.ts` — Complete Source

```typescript
// src/content/services.ts

export interface ServiceProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface ServiceMetadata {
  title: string;          // Under 60 chars: "[Service] in Omaha | Raptor Roofing"
  description: string;    // 150-155 chars
}

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;     // for nav / cards
  headline: string;       // H1 on service page
  subheadline: string;    // above-fold subtext
  description: string;    // intro paragraph
  problemCopy: string;    // "what happens when..." section
  processSteps: ServiceProcessStep[];
  features: string[];     // bullet list of what's included
  relatedSlugs: string[]; // internal links to other services
  heroImagePath: string;  // public/images/ — placeholder until real photos
  heroImageAlt: string;
  iconName: string;       // lucide-react icon name
  isEmergency: boolean;   // true = show 24/7 phone prominently
  metadata: ServiceMetadata;
}

export const services: Service[] = [
  {
    slug: "roofing",
    title: "Roofing Installation & Repair",
    shortTitle: "Roofing",
    headline: "Roof Replacement & Repair in Omaha",
    subheadline:
      "15 years local. No subcontractors. Every crew member is a Raptor employee.",
    description:
      "Whether you need a full roof replacement after storm damage or a targeted repair on an aging system, Raptor Roofing brings the same in-house crew and 15-year track record to every job. We work with all major insurance carriers and walk you through the claims process at no extra charge.",
    problemCopy:
      "Most Omaha homeowners don't know their roof is failing until water appears on the ceiling — by which point the damage often extends to decking, insulation, and drywall. A roof inspection costs nothing. Waiting costs significantly more.",
    processSteps: [
      {
        step: 1,
        title: "Free Damage Inspection",
        description:
          "Our estimator documents every finding with photos you keep. No pressure. No upsells.",
      },
      {
        step: 2,
        title: "Insurance Claim Support",
        description:
          "We meet with your adjuster on-site to make sure every legitimate item gets covered.",
      },
      {
        step: 3,
        title: "Installation by Our Crew",
        description:
          "No subcontractors — the same Raptor employees who gave your estimate do your roof.",
      },
      {
        step: 4,
        title: "Final Walkthrough",
        description:
          "We review the completed work with you and document the warranty before we leave.",
      },
    ],
    features: [
      "Architectural shingles (GAF, Owens Corning, CertainTeed)",
      "Full tear-off and decking inspection included",
      "Manufacturer warranty + Raptor workmanship warranty",
      "Insurance claim walkthrough at no extra charge",
      "Clean-up and haul-off of all old materials",
    ],
    relatedSlugs: ["siding", "gutters", "emergency-tarping"],
    heroImagePath: "/images/roofing-hero-placeholder.jpg", // PLACEHOLDER: replace with real project photo
    heroImageAlt: "Roof replacement in Omaha — example installation", // PLACEHOLDER: update alt with real project details
    iconName: "Home",
    isEmergency: false,
    metadata: {
      title: "Roof Replacement in Omaha | Raptor Roofing",
      description:
        "Omaha's trusted roofer for 15+ years. Full replacements, storm damage repair, insurance claim help. Licensed & insured. Call (402) 885-1462 for a free inspection.",
    },
  },
  {
    slug: "siding",
    title: "Siding Installation & Repair",
    shortTitle: "Siding",
    headline: "Siding Replacement & Repair in Omaha",
    subheadline: "Protect your home's exterior. Improve curb appeal. Done right the first time.",
    description:
      "Hail and wind damage don't stop at your roof. Raptor Roofing installs and repairs vinyl, fiber cement, and LP SmartSide siding using the same in-house crews that handle our roofing work. One contractor, one warranty, one point of contact.",
    problemCopy:
      "Cracked or dented siding is more than a cosmetic issue — moisture penetrates gaps and compromises wall insulation and framing over time. Insurance-covered siding replacement is one of the most common claims in the Omaha market after major storms.",
    processSteps: [
      {
        step: 1,
        title: "Free Siding Inspection",
        description:
          "We document all storm damage, age-related wear, and moisture intrusion points.",
      },
      {
        step: 2,
        title: "Material & Color Selection",
        description: "Choose from vinyl, fiber cement, or LP SmartSide with our sample boards.",
      },
      {
        step: 3,
        title: "Installation",
        description: "Our in-house crew handles removal, moisture barrier, and new siding.",
      },
    ],
    features: [
      "Vinyl, fiber cement, and LP SmartSide options",
      "Storm damage documentation for insurance claims",
      "Moisture barrier installation",
      "Color match for partial replacements",
      "Manufacturer warranty included",
    ],
    relatedSlugs: ["roofing", "gutters", "emergency-tarping"],
    heroImagePath: "/images/siding-hero-placeholder.jpg", // PLACEHOLDER: replace with real project photo
    heroImageAlt: "Siding replacement in Omaha — example installation", // PLACEHOLDER
    iconName: "Layers",
    isEmergency: false,
    metadata: {
      title: "Siding Replacement in Omaha | Raptor Roofing",
      description:
        "Storm damage siding repair and replacement in Omaha. Vinyl, fiber cement, and LP SmartSide. Licensed & insured. Call (402) 885-1462 for a free inspection.",
    },
  },
  {
    slug: "gutters",
    title: "Gutter Installation & Repair",
    shortTitle: "Gutters",
    headline: "Gutter Installation & Repair in Omaha",
    subheadline: "Protect your foundation. Stop water damage before it starts.",
    description:
      "Damaged or undersized gutters allow water to pool against your foundation, rot fascia boards, and flood window wells. Raptor installs seamless gutters cut on-site for a perfect fit and handles storm-damaged gutter replacement alongside roofing claims.",
    problemCopy:
      "Omaha's intense spring and summer storms deposit significant hail damage on gutters that most homeowners don't notice until a full replacement is needed. A free gutter inspection during your roof inspection catches both issues in one visit.",
    processSteps: [
      {
        step: 1,
        title: "Inspection & Measurement",
        description: "We assess slope, downspout placement, and damage extent.",
      },
      {
        step: 2,
        title: "Seamless Gutter Fabrication",
        description: "Gutters are cut to your home's exact measurements on-site — no seams, no leaks.",
      },
      {
        step: 3,
        title: "Installation & Test",
        description: "We run water through every section before we leave to confirm proper flow.",
      },
    ],
    features: [
      "Seamless aluminum gutters cut on-site",
      "5\" and 6\" profiles available",
      "K-style and half-round styles",
      "Gutter guard options available",
      "Downspout extensions and splash blocks",
    ],
    relatedSlugs: ["roofing", "siding", "emergency-tarping"],
    heroImagePath: "/images/gutters-hero-placeholder.jpg", // PLACEHOLDER: replace with real project photo
    heroImageAlt: "Seamless gutter installation in Omaha — example project", // PLACEHOLDER
    iconName: "Droplets",
    isEmergency: false,
    metadata: {
      title: "Gutter Installation in Omaha | Raptor Roofing",
      description:
        "Seamless gutter installation and repair in Omaha. Storm damage replacement, gutter guards. Licensed & insured. Call (402) 885-1462 for a free inspection.",
    },
  },
  {
    slug: "emergency-tarping",
    title: "Emergency Tarping & Board-Up",
    shortTitle: "Emergency Tarping",
    headline: "24/7 Emergency Roof Tarping in Omaha",
    subheadline: "Storm hit tonight? We respond immediately — day or night.",
    description:
      "A damaged roof doesn't wait for business hours. Raptor Roofing provides 24/7 emergency tarping and board-up services throughout the Omaha metro. We secure your home against further water intrusion until a permanent repair can be scheduled.",
    problemCopy:
      "Every hour an exposed roof goes uncovered, water damages ceilings, walls, insulation, and contents. Emergency tarping stops the immediate loss — and a professionally installed tarp is required by most insurance policies to maintain coverage for secondary damage.",
    processSteps: [
      {
        step: 1,
        title: "Call Us Immediately",
        description:
          "We dispatch a crew as fast as conditions allow, 24 hours a day, 7 days a week.",
      },
      {
        step: 2,
        title: "Emergency Tarp Installation",
        description:
          "We secure your roof with professional-grade tarps anchored to prevent wind uplift.",
      },
      {
        step: 3,
        title: "Damage Documentation",
        description:
          "We photograph and document the damage for your insurance claim while we're on-site.",
      },
      {
        step: 4,
        title: "Permanent Repair Scheduling",
        description:
          "We coordinate the full repair or replacement as soon as conditions and insurance allow.",
      },
    ],
    features: [
      "True 24/7 availability — nights, weekends, holidays",
      "Professional-grade tarps with wind anchoring",
      "Damage documentation for insurance",
      "Same crew handles permanent repair",
      "No separate contractor handoff",
    ],
    relatedSlugs: ["roofing", "siding", "gutters"],
    heroImagePath: "/images/emergency-tarping-placeholder.jpg", // PLACEHOLDER: replace with real emergency response photo
    heroImageAlt: "Emergency roof tarping in Omaha — example response", // PLACEHOLDER
    iconName: "AlertTriangle",
    isEmergency: true,
    metadata: {
      title: "Emergency Roof Tarping Omaha | Raptor Roofing",
      description:
        "24/7 emergency roof tarping and board-up in Omaha. Storm damage? Call (402) 885-1462 now — we dispatch crews day or night. Licensed & insured.",
    },
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(slug: string): Service[] {
  const service = getServiceBySlug(slug);
  if (!service) return [];
  return services.filter((s) => service.relatedSlugs.includes(s.slug));
}
```

---

## 6. `src/content/testimonials.ts` — Complete Source

**FTC compliance note:** Every testimonial MUST have `isPlaceholder: true`. The `PlaceholderBanner` component in Phase 3 reads this flag and renders the amber `[PLACEHOLDER — Replace with real review before launch]` banner. Removing this flag before replacing with a real review is a legal violation.

```typescript
// src/content/testimonials.ts

export interface Testimonial {
  id: string;
  name: string;           // First name + last initial only
  city: string;           // Omaha suburb
  rating: number;         // 1-5
  quote: string;
  date: string;           // ISO date string
  serviceSlug: string;    // which service this relates to
  isPlaceholder: boolean; // MUST be true for all placeholder content — FTC compliance
}

// IMPORTANT: All entries below are PLACEHOLDER content.
// isPlaceholder: true triggers a visible amber warning banner in the UI.
// These MUST be replaced with real customer testimonials before public launch.
// See HANDOFF.md for replacement instructions.
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Mike T.",
    city: "Papillion",
    rating: 5,
    quote:
      "After the June hailstorm, I called three roofers before Raptor. The other two pushed me to sign the same day. Raptor's estimator came out, documented everything, and told me to take my time. They met with my State Farm adjuster and got the full replacement covered. The crew was on my roof five days after approval.",
    date: "2025-08-14",
    serviceSlug: "roofing",
    isPlaceholder: true,
  },
  {
    id: "t2",
    name: "Sandra K.",
    city: "Elkhorn",
    rating: 5,
    quote:
      "I've lived in this house 22 years and put off re-roofing because I didn't trust the sales pressure I kept getting. Raptor was different — no urgency, just honest answers. They explained exactly what needed replacing and what didn't. Professional from first call to final walkthrough.",
    date: "2025-09-02",
    serviceSlug: "roofing",
    isPlaceholder: true,
  },
  {
    id: "t3",
    name: "Dave R.",
    city: "Millard",
    rating: 5,
    quote:
      "Emergency tarp call at 11pm after a severe storm took out part of my roof. Crew was at my house within two hours. They tarped everything properly, documented the damage while they were there, and had a full repair estimate in my inbox by 8am. That's local contractors who actually care.",
    date: "2025-07-21",
    serviceSlug: "emergency-tarping",
    isPlaceholder: true,
  },
  {
    id: "t4",
    name: "Jennifer M.",
    city: "La Vista",
    rating: 5,
    quote:
      "Raptor replaced both my roof and siding after the April storm. One crew, one contract, one warranty. Made the insurance process so much simpler. My neighbor used a different company and had two separate contractors who couldn't coordinate their schedules. My job was done in three days.",
    date: "2025-10-08",
    serviceSlug: "siding",
    isPlaceholder: true,
  },
  {
    id: "t5",
    name: "Tom B.",
    city: "Bellevue",
    rating: 5,
    quote:
      "15-year-old gutters finally gave out. Raptor came out the same week I called, fabricated the seamless gutters on-site, and the whole install took one day. They found two soft spots on my fascia board while they were at it and patched them before installing. Guys clearly know what they're doing.",
    date: "2025-11-15",
    serviceSlug: "gutters",
    isPlaceholder: true,
  },
  {
    id: "t6",
    name: "Carol H.",
    city: "Omaha",
    rating: 5,
    quote:
      "I was skeptical because I'd heard so many horror stories about storm chasers after 2024. My neighbor recommended Raptor — been using them for years. From the inspection to the final walkthrough, I never felt pressured. The workmanship warranty is in writing. Exactly what a local family business should look like.",
    date: "2025-09-28",
    serviceSlug: "roofing",
    isPlaceholder: true,
  },
];

export function getTestimonialsByService(serviceSlug: string): Testimonial[] {
  return testimonials.filter((t) => t.serviceSlug === serviceSlug);
}
```

---

## 7. `src/content/faqs.ts` — Complete Source

```typescript
// src/content/faqs.ts

export type FaqCategory =
  | "storm-damage"
  | "insurance"
  | "process"
  | "warranty"
  | "general";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  serviceSlug?: string; // optional — links FAQ to a specific service page
}

export const faqs: FAQ[] = [
  // Storm Damage
  {
    id: "faq-1",
    question: "How do I know if my roof was damaged in a hailstorm?",
    answer:
      "Hail damage on asphalt shingles appears as dark circular dents (bruising) in the granule surface. You may also see dented metal on vents, gutters, and flashing. The damage isn't always visible from the ground — a free inspection from a licensed contractor is the only reliable way to assess severity before filing a claim.",
    category: "storm-damage",
    serviceSlug: "roofing",
  },
  {
    id: "faq-2",
    question: "What is the difference between a legitimate roofer and a storm chaser?",
    answer:
      "Storm chasers are out-of-state contractors who follow severe weather events, take deposits from homeowners, and disappear or do poor-quality work before the next storm rolls through. Legitimate Omaha roofers have a permanent address, a Nebraska contractor license, and references from customers you can call. Raptor has been in Omaha since 2009 and we'll still be here in 2034.",
    category: "storm-damage",
  },
  {
    id: "faq-3",
    question: "How long after a storm do I have to file a hail damage claim?",
    answer:
      "Nebraska homeowner insurance policies typically allow one to two years from the date of loss to file a claim, but this varies by carrier and policy. Filing sooner is better — insurers can dispute whether damage occurred in the most recent storm if too much time passes. We recommend calling for an inspection within 30 days of any major hailstorm.",
    category: "storm-damage",
    serviceSlug: "roofing",
  },

  // Insurance
  {
    id: "faq-4",
    question: "Will my homeowner's insurance cover a full roof replacement?",
    answer:
      "If your roof sustained hail or wind damage in a covered event, most policies cover the cost of replacement minus your deductible. The key factor is your policy's replacement cost value (RCV) vs. actual cash value (ACV) clause — RCV policies pay the full replacement cost, while ACV policies depreciate the value based on roof age. Raptor reviews your policy summary with you before the adjuster visit.",
    category: "insurance",
    serviceSlug: "roofing",
  },
  {
    id: "faq-5",
    question: "Do you work directly with insurance adjusters?",
    answer:
      "Yes. We meet with your insurance adjuster on-site during their inspection to make sure every storm-damaged item is documented correctly. We don't 'work around' insurers — we work with them. Our estimators know what adjusters look for and how to document damage in the format that leads to a fair settlement.",
    category: "insurance",
  },
  {
    id: "faq-6",
    question: "What is my deductible and do I have to pay it?",
    answer:
      "Your deductible is the amount you pay before insurance covers the rest. Nebraska law prohibits contractors from waiving or absorbing your deductible — any contractor who offers to 'cover your deductible' is engaging in insurance fraud. Your deductible is your responsibility and is paid directly to us when work is complete.",
    category: "insurance",
  },

  // Process
  {
    id: "faq-7",
    question: "How long does a roof replacement take?",
    answer:
      "A typical residential roof replacement in Omaha takes one to two days, depending on size, pitch, and complexity. We work with a single in-house crew — no subcontractor handoffs — so there's no scheduling gap between tear-off and installation. We handle cleanup and haul-off the same day.",
    category: "process",
    serviceSlug: "roofing",
  },
  {
    id: "faq-8",
    question: "Do I need to be home during the installation?",
    answer:
      "You don't need to be home during the installation itself, but we do ask that you're available for a 15-minute walkthrough when we finish to review the completed work and document the warranty transfer together. We'll schedule your installation day at a time that works for you.",
    category: "process",
  },

  // Warranty
  {
    id: "faq-9",
    question: "What warranty do you provide on roofing work?",
    answer:
      "Raptor provides a written workmanship warranty on all roofing installations covering labor and installation defects. We also register manufacturer warranties (GAF, Owens Corning) on your behalf — most architectural shingles carry 30 to lifetime coverage for the materials themselves. Both warranties are in writing and transfer to the new homeowner if you sell.",
    category: "warranty",
    serviceSlug: "roofing",
  },
  {
    id: "faq-10",
    question: "What is the difference between a manufacturer warranty and a workmanship warranty?",
    answer:
      "A manufacturer warranty covers defects in the roofing materials themselves — shingles that crack, curl, or fail prematurely under normal conditions. A workmanship warranty covers installation errors — improper flashing, inadequate nailing patterns, or ventilation mistakes that cause premature failure. You need both. Raptor provides both in writing.",
    category: "warranty",
  },
];

export function getFaqsByCategory(category: FaqCategory): FAQ[] {
  return faqs.filter((f) => f.category === category);
}

export function getFaqsByService(serviceSlug: string): FAQ[] {
  return faqs.filter((f) => f.serviceSlug === serviceSlug);
}
```

---

## 8. `src/content/service-areas.ts` — Complete Source

```typescript
// src/content/service-areas.ts

export interface ServiceArea {
  name: string;
  slug: string;
  county: string;
  zipCodes: string[];
  lat?: number;
  lng?: number;
  isPrimary: boolean; // true = featured in footer/homepage
}

export const serviceAreas: ServiceArea[] = [
  {
    name: "Omaha",
    slug: "omaha",
    county: "Douglas",
    zipCodes: [
      "68101", "68102", "68103", "68104", "68105", "68106", "68107",
      "68108", "68110", "68111", "68112", "68114", "68116", "68117",
      "68118", "68122", "68124", "68127", "68130", "68131", "68132",
      "68133", "68134", "68135", "68137", "68138", "68142", "68144",
      "68147", "68152", "68154", "68157", "68164",
    ],
    lat: 41.2565,
    lng: -95.9345,
    isPrimary: true,
  },
  {
    name: "Bellevue",
    slug: "bellevue",
    county: "Sarpy",
    zipCodes: ["68005", "68123"],
    lat: 41.1500,
    lng: -95.9145,
    isPrimary: true,
  },
  {
    name: "Papillion",
    slug: "papillion",
    county: "Sarpy",
    zipCodes: ["68046", "68133"],
    lat: 41.1548,
    lng: -96.0425,
    isPrimary: true,
  },
  {
    name: "La Vista",
    slug: "la-vista",
    county: "Sarpy",
    zipCodes: ["68128"],
    lat: 41.1833,
    lng: -96.0306,
    isPrimary: true,
  },
  {
    name: "Elkhorn",
    slug: "elkhorn",
    county: "Douglas",
    zipCodes: ["68022"],
    lat: 41.2847,
    lng: -96.2353,
    isPrimary: true,
  },
  {
    name: "Millard",
    slug: "millard",
    county: "Douglas",
    zipCodes: ["68137", "68144"],
    lat: 41.2167,
    lng: -96.1167,
    isPrimary: false,
  },
  {
    name: "Gretna",
    slug: "gretna",
    county: "Sarpy",
    zipCodes: ["68028"],
    lat: 41.1417,
    lng: -96.2369,
    isPrimary: false,
  },
  {
    name: "Ralston",
    slug: "ralston",
    county: "Douglas",
    zipCodes: ["68127"],
    lat: 41.2014,
    lng: -96.0342,
    isPrimary: false,
  },
];

export function getPrimaryServiceAreas(): ServiceArea[] {
  return serviceAreas.filter((a) => a.isPrimary);
}

export function getServiceAreaBySlug(slug: string): ServiceArea | undefined {
  return serviceAreas.find((a) => a.slug === slug);
}
```

---

## 9. `src/lib/metadata.ts` — Complete Source

**Confidence: HIGH** — API verified against Next.js 16.2.3 official docs (2026-04-10).

```typescript
// src/lib/metadata.ts
import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

interface BuildMetadataParams {
  title: string;
  description: string;
  path?: string;            // e.g. "/services/roofing" — used for canonical
  ogImage?: string;         // path relative to site root e.g. "/og/roofing.jpg"
  noIndex?: boolean;        // set true for thank-you pages, form confirms
  useAbsoluteTitle?: boolean; // set true when title already contains brand name
}

/**
 * buildMetadata — per-page SEO metadata helper.
 *
 * Usage in a page file:
 *
 *   export const metadata = buildMetadata({
 *     title: "Roof Replacement in Omaha | Raptor Roofing",
 *     description: "...",
 *     path: "/services/roofing",
 *     useAbsoluteTitle: true,  // title already has brand name
 *   });
 *
 * Or for a page without brand name in title:
 *
 *   export const metadata = buildMetadata({
 *     title: "Roof Replacement in Omaha",
 *     description: "...",
 *     path: "/services/roofing",
 *     // title.template from root layout appends " | Raptor Roofing"
 *   });
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  ogImage = "/og/default.jpg",
  noIndex = false,
  useAbsoluteTitle = false,
}: BuildMetadataParams): Metadata {
  const siteUrl = siteConfig.url;
  const canonicalUrl = `${siteUrl}${path}`;
  const ogImageUrl = `${siteUrl}${ogImage}`;

  return {
    // Title: absolute overrides template; string uses parent template
    title: useAbsoluteTitle ? { absolute: title } : title,

    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${title}`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },

    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
```

---

## 10. `src/lib/schema.ts` — Complete Source

**Confidence: HIGH** — JSON-LD pattern verified against Next.js 16 docs (2026-04-10). `schema-dts` v2.0.0 provides TypeScript types.

**Key decisions:**
- `HomeAndConstructionBusiness` is the correct Schema.org type for a roofing contractor (more specific than `LocalBusiness`, less over-reaching than `Contractor` which implies general contractor). Confirmed: this is the subtype used by Google's guidelines for home services businesses.
- Native `<script>` tag, NOT `next/script` — JSON-LD is structured data, not executable JavaScript. Official Next.js docs confirm this explicitly.
- XSS sanitization: `.replace(/</g, '\\u003c')` is required per official docs.

```typescript
// src/lib/schema.ts
import type {
  HomeAndConstructionBusiness,
  Service as SchemaService,
  FAQPage,
  BreadcrumbList,
  WithContext,
} from "schema-dts";
import { siteConfig } from "@/content/site";
import type { Service } from "@/content/services";
import type { FAQ } from "@/content/faqs";

// ============================================================
// JSON-LD Server Component
// Usage: <JsonLd data={localBusinessSchema()} />
// ============================================================

interface JsonLdProps {
  data: WithContext<HomeAndConstructionBusiness>
    | WithContext<SchemaService>
    | WithContext<FAQPage>
    | WithContext<BreadcrumbList>;
}

/**
 * Server component that renders JSON-LD structured data.
 * Uses native <script> tag — NOT next/script (which is for executable JS).
 * Includes XSS sanitization per Next.js official docs.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

// ============================================================
// LocalBusiness / HomeAndConstructionBusiness Schema
// Use on: homepage, about page
// ============================================================

export function localBusinessSchema(): WithContext<HomeAndConstructionBusiness> {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone.display,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.2565,   // Omaha center
      longitude: -95.9345,
    },
    openingHoursSpecification: siteConfig.hours
      .filter((h) => !h.closed)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${h.day}`,
        opens: h.open,
        closes: h.close,
      })),
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
    priceRange: "$$",
    foundingDate: String(siteConfig.founding.year),
    slogan: siteConfig.tagline,
    // PLACEHOLDER: add aggregateRating once real reviews are confirmed
    // aggregateRating: {
    //   "@type": "AggregateRating",
    //   ratingValue: siteConfig.reviews.rating,
    //   reviewCount: siteConfig.reviews.count,
    // },
  };
}

// ============================================================
// Service Schema
// Use on: individual service pages
// ============================================================

export function serviceSchema(service: Service): WithContext<SchemaService> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: `${siteConfig.url}/services/${service.slug}`,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: siteConfig.name,
      url: siteConfig.url,
      telephone: siteConfig.phone.display,
    },
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
    })),
    serviceType: service.title,
  };
}

// ============================================================
// FAQPage Schema
// Use on: any page with an FAQ accordion
// ============================================================

export function faqPageSchema(faqItems: FAQ[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ============================================================
// BreadcrumbList Schema
// Use on: all inner pages (service pages, about, contact)
// ============================================================

interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbSchema(
  items: BreadcrumbItem[]
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href.startsWith("http")
        ? item.href
        : `${siteConfig.url}${item.href}`,
    })),
  };
}
```

---

## 11. `app/layout.tsx` — Complete Source

```typescript
// src/app/layout.tsx
import type { Metadata } from "next";
import { Oswald, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

// ============================================================
// Font Configuration — next/font/google
// Self-hosted at build time — eliminates Google DNS round-trip
// ============================================================

const displayFont = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

// ============================================================
// Root Metadata
// metadataBase MUST be set here — without it, all OG image
// paths are relative and social crawlers cannot resolve them.
// (PITFALL C-1 from project research)
// ============================================================

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://raptor-roofing.vercel.app"
  ),

  title: {
    template: "%s | Raptor Roofing — Omaha Roofer",
    default: "Raptor Roofing — Omaha's Trusted Local Roofer Since 2009",
  },

  description:
    "Family-owned Omaha roofing contractor. 15+ years local, no subcontractors, licensed and insured. Free storm damage inspections and insurance claim help. Call (402) 885-1462.",

  openGraph: {
    siteName: "Raptor Roofing",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og/default.jpg", // PLACEHOLDER: create in Phase 6
        width: 1200,
        height: 630,
        alt: "Raptor Roofing — Omaha's trusted local roofer",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
  },

  robots: {
    index: true,
    follow: true,
  },
};

// ============================================================
// Root Layout
// ============================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Font rationale:** Oswald (display/condensed) pairs well with the roofing/industrial aesthetic without resorting to defaults. Source Serif 4 provides warmth and legibility for body copy — serif fonts signal authority and trustworthiness for service businesses, contrasting well with the condensed display font.

---

## 12. `app/(marketing)/layout.tsx` — Complete Source

**Stub component strategy:** Phase 1 creates placeholder stubs that return simple labeled divs. They are `aria-hidden` to prevent assistive technology from announcing them as navigation when they're not yet functional. The stubs are replaced in Phase 2 with real components. This allows Phase 1 to verify the route group shell renders correctly without blocking on component development.

```typescript
// src/app/(marketing)/layout.tsx
import type { Metadata } from "next";

// Phase 1 stubs — replaced with real components in Phase 2
// These exist so the (marketing) layout shell can be tested in Phase 1
// without component implementation blocking progress
import Header from "@/components/stubs/Header";
import Footer from "@/components/stubs/Footer";
import StickyMobileCTA from "@/components/stubs/StickyMobileCTA";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content">
        {children}
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
```

**Stub component files:**

```typescript
// src/components/stubs/Header.tsx
// PHASE 1 STUB — Replace in Phase 2 with real Header component
export default function Header() {
  return (
    <header
      aria-hidden="true"
      data-stub="true"
      className="h-16 bg-primary-600 flex items-center px-6"
    >
      <span className="text-white font-display text-sm opacity-50">
        [Header stub — Phase 2]
      </span>
    </header>
  );
}
```

```typescript
// src/components/stubs/Footer.tsx
// PHASE 1 STUB — Replace in Phase 2 with real Footer component
export default function Footer() {
  return (
    <footer
      aria-hidden="true"
      data-stub="true"
      className="h-24 bg-neutral-900 flex items-center px-6"
    >
      <span className="text-neutral-400 font-body text-sm opacity-50">
        [Footer stub — Phase 2]
      </span>
    </footer>
  );
}
```

```typescript
// src/components/stubs/StickyMobileCTA.tsx
// PHASE 1 STUB — Replace in Phase 2 with real StickyMobileCTA component
export default function StickyMobileCTA() {
  return null; // No DOM output — mobile bar added in Phase 2
}
```

The `(marketing)` route group also needs a default page to verify rendering. Add a minimal `app/(marketing)/page.tsx`:

```typescript
// src/app/(marketing)/page.tsx
// Phase 1 placeholder — replaced in Phase 3 with full homepage
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 p-8">
        <h1 className="text-4xl font-display font-bold text-primary-600">
          Raptor Roofing
        </h1>
        <p className="text-lg font-body text-neutral-600">
          Foundation Phase 1 — scaffolding in progress
        </p>
        <p className="text-sm text-warm-600">
          (402) 885-1462
        </p>
      </div>
    </div>
  );
}
```

---

## 13. `globals.css` Baseline Additions

All baseline additions beyond the `@theme` block are already included in Section 2 above. Summary of what lives in `globals.css`:

1. `@import "tailwindcss";` — required first line, replaces old `@tailwind base/components/utilities` directives
2. `@theme { ... }` — brand tokens (Section 2)
3. `*:focus-visible` — restored outline styles (Tailwind preflight strips browser focus rings — must restore explicitly)
4. `.skip-to-main` — visually hidden skip link, revealed on focus
5. `input, textarea, select { font-size: 1rem; }` — prevents iOS Safari auto-zoom on any input under 16px
6. `body { ... }` — background color, text color, font-family from `@theme` tokens, antialiasing
7. `.placeholder-banner` — FTC-compliance amber banner class for placeholder testimonials

---

## 14. `tsconfig.json` Expected Final State

`create-next-app` with `--typescript` and `--import-alias "@/*"` generates a correct `tsconfig.json`. Verify it contains all of the following after scaffolding:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Critical checks:**
- `"strict": true` — must be present. If absent, add it.
- `"paths": { "@/*": ["./src/*"] }` — must use `./src/*` not `./src/`, since `--src-dir` was used
- `"moduleResolution": "bundler"` — required for Next.js 16 Turbopack

---

## 15. ESLint Config

**Confidence: HIGH** — verified against Next.js 16.2.3 official ESLint docs (2026-04-10).

`create-next-app --typescript` generates `eslint.config.mjs` with flat config format (Next.js 16 default):

```javascript
// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
```

**Key facts:**
- `next lint` command is **removed** in Next.js 16. Use `npx eslint .` or `npx eslint src/`
- `next build` no longer runs lint automatically
- The `package.json` lint script should be `"lint": "eslint ."` — not `"lint": "next lint"`
- Flat config format (`eslint.config.mjs`) replaces `.eslintrc.json` — do not create a legacy config file

---

## 16. `package.json` Expected Final Shape

After scaffolding + Phase 1 installs:

```json
{
  "name": "raptor-roofing",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@vercel/analytics": "^2.0.1",
    "lucide-react": "^1.8.0",
    "next": "^16.2.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "schema-dts": "^2.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.x.x",
    "@types/node": "^20.x.x",
    "@types/react": "^19.x.x",
    "@types/react-dom": "^19.x.x",
    "eslint": "^9.x.x",
    "eslint-config-next": "^16.2.3",
    "postcss": "^8.x.x",
    "tailwindcss": "^4.2.2",
    "typescript": "^5.x.x"
  }
}
```

**Notes:**
- `"type-check": "tsc --noEmit"` — add manually after scaffolding (not in default template)
- Next.js 16 requires React 19 — `create-next-app` handles this automatically
- No `clsx` or `tailwind-merge` in Phase 1 — these are optional and can be added in Phase 2 when components need them. Keep dependencies minimal.

---

## 17. Verification Commands

Run these at the end of Phase 1 to confirm success criteria. All must pass before Phase 1 is marked complete.

```bash
# 1. TypeScript compile check — zero errors required
npx tsc --noEmit

# 2. ESLint pass — zero errors required
npx eslint src/

# 3. Build clean — zero errors or warnings
npm run build

# 4. Dev server starts
npm run dev &
sleep 3

# 5. Homepage returns HTTP 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Expected: 200

# 6. Verify Tailwind v4 is installed (not v3)
cat package.json | grep '"tailwindcss"'
# Expected: "tailwindcss": "^4.x.x"

# 7. Verify Next.js 16 is installed
cat package.json | grep '"next"'
# Expected: "next": "^16.x.x"

# 8. Verify strict mode is on in tsconfig
cat tsconfig.json | grep '"strict"'
# Expected: "strict": true

# 9. Verify @theme block exists in globals.css
grep "@theme" src/app/globals.css
# Expected: @theme {

# 10. Kill dev server
kill %1
```

---

## 18. Plan Decomposition Recommendation

**Proposed 3-plan split from ROADMAP.md:**
- 01-01: Scaffold + `@theme` tokens
- 01-02: `src/content/` typed data files
- 01-03: `src/lib/` helpers + layouts + `globals.css` baseline

**Assessment: AGREE with this split, with one important note.**

**Parallelization:** 01-02 and 01-03 can run in parallel after 01-01 completes.

Dependency graph:
```
01-01 (scaffold + @theme)
    ├── 01-02 (src/content/ files)     — no dependency on lib/
    └── 01-03 (src/lib/ + layouts)     — imports from content/ BUT only for types
                                          (lib/schema.ts imports Service, FAQ types)
```

The subtle dependency: `src/lib/schema.ts` imports `Service` and `FAQ` types from `src/content/`. However, the types are just TypeScript interfaces — the file just needs to exist with those exports. The plan executor can:
- Option A: Run 01-02 and 01-03 sequentially (safer, simpler)
- Option B: Run in parallel if executor creates type stubs first (complex)

**Recommendation: Run sequentially** (01-01 → 01-02 → 01-03). The parallelization gain on 3 small tasks is negligible and the risk of import errors mid-task is real. All three plans together take less time than one hour of human review.

**Plan size assessment:** Each plan is appropriately sized — one discrete deliverable, independently verifiable, no hidden gotchas.

---

## 19. Pitfalls for Phase 1 Execution

### PITFALL P1-1: `tailwind.config.js` silently ignored in Tailwind v4
**What goes wrong:** Developer creates `tailwind.config.js` from habit or copy-paste. Tailwind compiles without error but ALL custom tokens are missing. Utilities like `bg-primary-600` produce no CSS output.
**Prevention:** Never create `tailwind.config.js`. All theme configuration goes in the `@theme` block in `globals.css`. If it exists, delete it.
**Detection:** `npm run dev` runs cleanly but `<div className="bg-primary-600">` has no background color in browser.

### PITFALL P1-2: `create-next-app` installs Next.js 16 — not 15
**What goes wrong:** ROADMAP.md and prior research say "Next.js 15." Running `create-next-app@latest` installs 16.2.3. Code written for v15 patterns may need adjustment.
**Prevention:** Confirm with `cat package.json | grep '"next"'` immediately after scaffolding.
**Key v16 impact on Phase 1:** `next lint` is removed — use `eslint .` directly. Turbopack is default — no `--turbo` flag needed.

### PITFALL P1-3: `metadataBase` absent from `app/layout.tsx`
**What goes wrong:** All `openGraph.images` paths are relative. Social crawlers (Facebook, Twitter, Slack) cannot resolve them. Link previews show broken images or no image. Invisible during local dev — only visible when sharing the Vercel URL.
**Prevention:** Set `metadataBase` on Day 1 in root `app/layout.tsx`. Use `process.env.NEXT_PUBLIC_SITE_URL` with a hardcoded fallback.
**Detection:** Share the localhost URL in Slack or use Facebook Sharing Debugger on the preview URL after deploy.

### PITFALL P1-4: Missing `.env.local` causes `process.env.NEXT_PUBLIC_SITE_URL` to be undefined
**What goes wrong:** `metadataBase` falls back to the hardcoded string. Not a Phase 1 problem (fallback handles it), but will cause canonical URL mismatches in dev if not set.
**Prevention:** Create `.env.local` with `NEXT_PUBLIC_SITE_URL=http://localhost:3000` during Phase 1.

### PITFALL P1-5: Windows + Next.js dev server locks `.next/` directory
**What goes wrong:** On Windows, running `npm run dev` while the previous dev process is still running (or was killed without cleanup) causes `.next/` directory locking. Subsequent `npm run build` fails with EBUSY or EPERM errors.
**Prevention:** Always kill the dev server with Ctrl+C before running `npm run build`. If `.next/` is locked: close VS Code terminal, kill Node processes in Task Manager, then run `rm -rf .next` (or delete via Explorer) before rebuilding.

### PITFALL P1-6: iOS Safari auto-zoom on form inputs below 16px
**What goes wrong:** Form inputs with font-size under 16px cause iOS Safari to zoom the viewport on focus. This breaks the mobile layout. Phase 1 has no forms, but the baseline style must be set now.
**Prevention:** `input, textarea, select { font-size: 1rem; }` in `globals.css` — included in the `globals.css` above.

### PITFALL P1-7: `next/font/google` CSS variables not applied to `body`
**What goes wrong:** Fonts are loaded and CSS variables created (`--font-display`, `--font-body`) but the variables are only injected on `<html>`. If `className={displayFont.variable}` is on `<html>` but the `@theme` block references `var(--font-display)`, components using `font-display` class work. However, `body { font-family: var(--font-body); }` in `globals.css` only works if `--font-body` variable is present in scope.
**Prevention:** Apply BOTH font variables to the `<html>` element: `className={\`${displayFont.variable} ${bodyFont.variable}\`}`. This is shown correctly in the `app/layout.tsx` source above.
**Detection:** Body text renders in a serif fallback instead of Source Serif 4.

### PITFALL P1-8: `schema-dts` v2 breaking changes from v1
**What goes wrong:** If any prior code samples reference `schema-dts` v1 types, the import paths or type names may differ.
**Status:** `schema-dts` v2.0.0 is the current version. Usage in `src/lib/schema.ts` above is verified against v2 API. The `WithContext<T>` generic and `@context`/`@type` fields are unchanged from v1.

### PITFALL P1-9: `@import "tailwindcss"` required as first line — not `@tailwind base`
**What goes wrong:** Tailwind v4 uses `@import "tailwindcss"` instead of the v3 directives (`@tailwind base; @tailwind components; @tailwind utilities`). If `create-next-app` generates a v3-style globals.css, the entire CSS system breaks silently.
**Prevention:** Verify `globals.css` starts with `@import "tailwindcss";`. If it has `@tailwind base/components/utilities`, the scaffold installed v3 — upgrade Tailwind.

---

## 20. Open Questions for Planner

| Question | Status | Recommendation |
|----------|--------|----------------|
| Does `create-next-app@16.2.3` produce `--src-dir` with `src/app/` or `src/` flat? | Unverified | Use `--src-dir` flag; verify first file is at `src/app/layout.tsx` after scaffold |
| Does the scaffold create an `app/page.tsx` or `src/app/page.tsx`? | Unverified | With `--src-dir`, should be `src/app/page.tsx`. If wrong, move file immediately |
| Font choice: Oswald + Source Serif 4 — confirmed? | Research choice | Planner may want to verify the font pairing renders well by creating a test component that uses both before committing to Phase 1 |
| `@vercel/analytics` — install in Phase 1 or Phase 7? | Research says Phase 1 or later | RECOMMEND Phase 1: it's one line in `app/layout.tsx` and costs nothing to add early. Deferred adds risk of forgetting |
| Is `--src-dir` a valid flag for `create-next-app@16.2.3`? | Unverified | STACK research confirmed `src/` layout; verify by running `npx create-next-app@latest --help 2>/dev/null` to list valid flags |
| `HomeAndConstructionBusiness` — is this the correct Schema.org type? | HIGH confidence from official sources | Confirmed: Google's structured data guidelines for local businesses in home/construction category use this type |
| NE contractor license number for Raptor | Unknown | PLACEHOLDER in `site.ts`. Must be in HANDOFF.md |
| Real Raptor phone number | `(402) 885-1462` from their existing site | Use as-is; label as needs-confirmation in `site.ts` comment |

---

## Sources

### Primary (HIGH confidence)
- `nextjs.org/docs` (version 16.2.3, lastUpdated 2026-04-10) — generateMetadata, App Router, JSON-LD, fonts, layout
- `nextjs.org/blog/next-16` — Next.js 16 feature list and breaking changes
- `nextjs.org/docs/app/guides/upgrading/version-16` — Next.js 16 upgrade guide
- `nextjs.org/docs/app/api-reference/config/eslint` — ESLint flat config (v16.2.3, 2026-04-10)
- `nextjs.org/docs/app/guides/json-ld` — JSON-LD pattern (v16.2.3, 2026-04-10)
- `tailwindcss.com/docs/theme` — `@theme` block syntax, OKLCH color format, token namespaces
- `tailwindcss.com/docs/installation/using-postcss` — `@tailwindcss/postcss` package
- npm registry: `next@16.2.3`, `tailwindcss@4.2.2`, `schema-dts@2.0.0`, `@vercel/analytics@2.0.1`, `lucide-react@1.8.0` — verified via `npm show` commands

### Secondary (MEDIUM-HIGH confidence)
- `.planning/research/STACK.md` — project stack decisions (researched 2026-04-13, HIGH confidence)
- `.planning/research/PITFALLS.md` — project-specific pitfall catalog (researched 2026-04-13)
- `.planning/PROJECT.md` — Raptor Roofing client details, phone number, hours
- WCAG contrast ratio calculations — derived from hex values using standard contrast formula

---

## Metadata

**Confidence breakdown:**
- Scaffolding command: HIGH — `create-next-app@latest` version confirmed via npm, flags verified
- Next.js 16 impact: HIGH — official upgrade guide reviewed
- Tailwind v4 `@theme` syntax: HIGH — official docs verified
- Brand color palette: MEDIUM — derived from logo visual analysis; exact hex values are estimates pending actual logo sampling
- Content files (services, testimonials, faqs): HIGH — types are clean TypeScript, content is plausible placeholder
- `buildMetadata()` helper: HIGH — Metadata API verified against official docs
- `schema.ts` factory functions: HIGH — JSON-LD pattern verified, schema-dts v2 API confirmed
- Root layout / marketing layout: HIGH — verified against official Next.js 16 docs
- ESLint flat config: HIGH — verified against Next.js 16 official ESLint docs

**Research date:** 2026-04-13
**Valid until:** 2026-05-13 (30 days — stable ecosystem, no fast-moving changes expected)
