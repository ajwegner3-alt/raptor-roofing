# Raptor Roofing LLC — Pitch Demo Site

**Client:** Raptor Roofing LLC — family-owned roofing contractor, Omaha NE  
**Built by:** North Star Integrations (NSI)  
**Stack:** Next.js 15 (App Router), Tailwind CSS v4, TypeScript  
**Live:** https://raptor-roofing.vercel.app  
**Status:** Pitch demo — NOT production. See [HANDOFF.md](./HANDOFF.md) for launch steps.

---

## Quick Start

```bash
git clone https://github.com/ajwegner3-alt/raptor-roofing.git
cd raptor-roofing
npm install
npm run dev    # opens at http://localhost:3000
```

No environment variables are required for local development. The site runs in demo mode without them — forms show success UI but do not deliver leads.

---

## Project Structure

```
raptor-roofing/
├── src/
│   ├── app/
│   │   ├── (marketing)/              # All public-facing pages (shared layout)
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── about/page.tsx        # About page
│   │   │   ├── contact/page.tsx      # Contact page + full form
│   │   │   ├── services/
│   │   │   │   └── [slug]/page.tsx   # 4 dynamic service pages (roofing, siding, gutters, emergency)
│   │   │   └── service-areas/
│   │   │       └── [slug]/page.tsx   # 8 dynamic service area pages (Omaha, Bellevue, etc.)
│   │   ├── api/contact/route.ts      # Lead capture API (Resend email + reCAPTCHA v3)
│   │   ├── layout.tsx                # Root layout (fonts, Vercel Analytics, OG meta)
│   │   ├── robots.ts                 # Auto-generates robots.txt
│   │   └── sitemap.ts               # Auto-generates sitemap.xml
│   ├── components/
│   │   ├── layout/                   # Header, Footer, MobileMenuButton, UrgencyBar, TrustStrip
│   │   └── sections/                 # Hero, ServiceHero, LeadForm, ContactForm, WhyNotChaser,
│   │                                 # TestimonialCarousel, BeforeAfterGallery, FinalCTA, etc.
│   ├── content/                      # Single source of truth for all business data
│   │   ├── site.ts                   # Business config: phone, address, reviews, license, social
│   │   ├── services.ts               # 4 service definitions (name, slug, hero, features, FAQs)
│   │   ├── service-areas.ts          # 8 service area definitions with localized content
│   │   ├── testimonials.ts           # 6 placeholder testimonials (isPlaceholder: true)
│   │   └── faqs.ts                   # 22 FAQs across 4 service categories
│   └── lib/
│       ├── email/                    # Resend email sender module
│       ├── metadata.ts               # buildMetadata() helper for page-level SEO
│       └── schema.tsx                # JSON-LD schema builders (LocalBusiness, Service, FAQ, etc.)
├── public/
│   ├── images/                       # Hero images (webp, generic stock — replace with real photos)
│   └── og/default.jpg                # Default Open Graph share image
├── scripts/
│   ├── check-bundle-size.mjs         # Enforces bundle size limits
│   └── check-no-review-schema.mjs    # Verifies AggregateRating stays disabled (no fake review data)
├── HANDOFF.md                        # Placeholder inventory + production launch checklist
├── FUTURE_DIRECTIONS.md              # Limitations + improvement roadmap
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS v4 configuration
└── package.json
```

---

## npm Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| Dev server | `npm run dev` | Local development at http://localhost:3000 |
| Production build | `npm run build` | Verify build compiles without errors |
| Lint | `npm run lint` | ESLint check (should be 0 errors) |
| Type check | `npm run type-check` | TypeScript validation |
| Schema check | `npm run check:schema` | Verifies AggregateRating schema stays disabled |
| Bundle check | `npm run check:bundle` | Verifies JS bundle size limits |

Run `npm run build && npm run lint && npm run type-check` before any push.

---

## Environment Variables

None are required for local development. Set these in Vercel (Settings > Environment Variables) for production:

| Variable | Purpose | Where to Get It |
|----------|---------|-----------------|
| `NOTIFICATION_EMAIL` | Lead notification destination email | Andrew/Raptor decide |
| `RESEND_API_KEY` | Resend email API key | https://resend.com |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key (public) | https://www.google.com/recaptcha/admin |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA v3 secret key (server) | Same reCAPTCHA admin dashboard |
| `NEXT_PUBLIC_SITE_URL` | Production domain URL | Raptor's domain after DNS setup |

Without these, the site runs in demo mode: forms always show success UI, reCAPTCHA is skipped, no emails are sent.

---

## Key Architecture Decisions

### `src/content/` is the single source of truth

All business data lives in `src/content/`. When Raptor provides real credentials:
- `site.ts` — phone, address, email, license, social URLs, review count/rating, certifications
- `services.ts` — hero images and alt text for each service
- `service-areas.ts` — service area definitions
- `testimonials.ts` — replace placeholders with verbatim real reviews
- `faqs.ts` — fill pricing and warranty placeholder values

Update these files, push, and the changes propagate site-wide.

**Exception:** `ContactForm.tsx` (~line 287) and `LeadForm.tsx` (~line 274) have a hardcoded `Licensed NE #[PLACEHOLDER]` string that does NOT read from `siteConfig`. Update these manually when the real license number is available. See HANDOFF.md Section 3, Category 2.

### `(marketing)` route group

All public pages are wrapped in a `(marketing)` route group at `src/app/(marketing)/`. This applies the shared `Header` + `Footer` layout to every public page without polluting the root layout, which is also used by the `/api/` routes.

### Demo stubs in forms

Both contact forms use a `void data + setStatus('success')` pattern that discards the API response and always shows the success card. This is the "demo mode" state. Grep for `// DEMO MODE:` to find both stubs. Removing these stubs and replacing them with a proper `if (data.success)` branch is the primary production activation step. See HANDOFF.md Section 4 for exact instructions.

### `// PLACEHOLDER:` tagging

All placeholder values in `src/` are tagged with `// PLACEHOLDER:` comments. To find everything that needs real data:

```bash
grep -rn "// PLACEHOLDER:" src/
```

Returns 26+ tagged locations across `site.ts`, `services.ts`, `faqs.ts`, `ContactForm.tsx`, and `LeadForm.tsx`.

### AggregateRating schema is intentionally disabled

`src/lib/schema.tsx` (lines 85–90) has the `AggregateRating` JSON-LD block commented out. A guard script (`npm run check:schema`) enforces this. Do not uncomment until Raptor provides real Google review count and rating — emitting fake review schema violates Google's policies.

### Service area pages use `generateStaticParams`

All 8 service area pages and 4 service pages are statically generated at build time via `generateStaticParams`. No dynamic server rendering at request time. This means page additions require a new entry in `service-areas.ts` or `services.ts` and a redeployment.

---

## Deployment

The project auto-deploys to Vercel on every push to `master`.

**For demo mode (current):** Push to master. No env vars needed. The site deploys and runs with placeholder data and demo form stubs.

**For production:** Configure env vars in Vercel dashboard first, then push. See HANDOFF.md for the complete production launch checklist.

To verify a deploy succeeded, check the Vercel dashboard or run:
```bash
curl -s https://raptor-roofing.vercel.app | grep -o "<title>.*</title>"
```

---

## Related Documents

| File | Purpose |
|------|---------|
| `HANDOFF.md` | Complete placeholder inventory, demo stub revert guide, env var table, Claude Code mega-prompt for post-sign launch |
| `FUTURE_DIRECTIONS.md` | Known limitations, assumptions, future improvements, technical debt |
| `.planning/STATE.md` | Project execution state (phase, plan, decisions, blockers) |
| `.planning/phases/` | Per-phase research, context, plan, and summary files |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |
| Email | Resend (free tier, 100/day) |
| Bot protection | Google reCAPTCHA v3 (inactive in demo mode) |
| Analytics | Vercel Web Analytics (free tier) |
| Hosting | Vercel (auto-deploy from GitHub master) |
| Images | WebP via Next.js `<Image>` component |
| Schema | JSON-LD via inline `<script type="application/ld+json">` |
