# Project Research Summary

**Project:** Raptor Roofing — Warm-Lead Pitch Site
**Domain:** Local trade contractor marketing site (roofing, Omaha NE)
**Researched:** 2026-04-13
**Confidence:** HIGH (stack verified against official docs; features verified against live Omaha competitors; architecture confirmed from Next.js docs dated 2026-04-10; pitfalls cross-verified across framework, legal, and CRO sources)

---

## TL;DR

- **Trust, not speed, is the conversion lever.** Raptor's 15yr + no-subs + local-family story is the pitch. Every design and copy decision must surface that story above the fold — not bury it in an About page.
- **The anti-chaser positioning is a double-edged sword.** Used correctly it is the strongest differentiator in the Omaha market. Used carelessly (wrong copy, urgency-first tone, storm imagery), the site signals exactly the chaser behavior Raptor is positioned against.
- **Stack is fully locked and high-confidence.** Next.js 15 App Router + Tailwind v4 + TypeScript + Vercel. No component libraries. Content in `src/content/` TypeScript files for easy post-signing handoff.
- **FTC testimonial compliance is non-negotiable.** Fake placeholder reviews displayed as real reviews expose NSI and Raptor to civil penalties up to $53,088/violation (FTC rule effective October 2024). Every placeholder testimonial requires a visible [PLACEHOLDER] banner.
- **Six-phase build order is dependency-driven.** Foundation -> Global Components -> Homepage -> Service Pages -> About/Contact -> SEO Polish. First Vercel preview URL should be the completed homepage.

---

## Stack Decisions Locked In

All decisions are HIGH confidence, verified against official documentation.

| Technology | Role | Why |
|------------|------|-----|
| Next.js 15, App Router | Framework | generateMetadata, sitemap.ts, robots.ts native; Server Components eliminate JS for static sections; static generation by default |
| Tailwind CSS v4 | Styling | CSS-first @theme config; Oxide engine (100ms rebuilds); no tailwind.config.js needed |
| TypeScript (strict) | Language | schema-dts catches JSON-LD bugs at build time; MetadataRoute types prevent schema errors |
| next/font/google | Fonts | Self-hosts at build time; eliminates Google DNS round-trip (100-300ms LCP savings); zero CLS |
| lucide-react (named imports only) | Icons | Tree-shakeable; never import * from lucide-react |
| schema-dts | JSON-LD types | Type safety for structured data objects |
| @vercel/analytics | Analytics | Free (2,500 events/month); zero-config; no cookie banner; sufficient for pitch site |
| n8n Cloud webhook (primary) / Formspree (fallback) | Form handler | Andrew already has n8n; webhook routes to Google Sheets + email simultaneously. Formspree (50/mo free) is the fallback |
| Vercel | Hosting | Native Next.js support; preview URL per push; free tier |

**Confirmed exclusions:** No Pages Router, no next-seo, no next-sitemap, no shadcn/ui, no react-icons, no GA4, no Supabase/DB, no Netlify Forms, no CDN font link tags. Note: the `priority` prop on next/image is deprecated in v16 — use `preload={true}` for forward compatibility.

---

## Table Stakes Features

The non-negotiable feature list. All are absent or weak on the current raptorroofingllc.com.

**Hero / Above the Fold**
- Single real-photo static hero (no carousel, no video)
- Headline: problem-solve + location (not generic "Expert Roofing Solutions")
- Two and only two CTAs above fold: click-to-call phone + "Get Free Estimate"
- Micro-trust line directly under headline: "15 Years Local · No Subs · Licensed & Insured"
- Sticky header with phone number visible on mobile at all times

**Trust Strip (placement IS the feature — directly below hero, not buried in footer)**
- Google review count + star rating (screenshot or widget)
- BBB accreditation badge
- Manufacturer certification badges (GAF, Owens Corning, or similar)
- "Licensed, Bonded & Insured" with actual license number
- Years in business + "Family-Operated" + "No Subcontractors"

**Service Structure**
- Dedicated pages for: Roofing, Siding, Gutters, Emergency Tarping
- Before/after photo gallery on each service page (clearly labeled placeholders for pitch)
- Internal linking between services

**Lead Form (4-field max)**
- Fields: Name -> Phone (required, primary) -> Service Type (dropdown) -> ZIP
- Trust signals adjacent to form (license number, response time promise)
- Success message with callback timeline ("We'll call you within 2 hours")
- reCAPTCHA v3 invisible — not v2 image challenges

**SEO / Technical**
- LocalBusiness schema on homepage + About
- Service schema per service page
- FAQPage schema on pages with FAQ sections
- BreadcrumbList schema on all inner pages
- Canonical tags on every page via buildMetadata() helper
- Open Graph + Twitter meta tags on every page
- robots: { index: true, follow: true } explicitly set in root layout
- NAP in footer matching Google Business Profile exactly
- Service area list in footer (Omaha, Bellevue, Papillion, La Vista, Elkhorn, Millard, Sarpy County)
- Embedded Google Map on Contact page
- Localized alt text on project photos (e.g., "hail damage roof repair Millard NE")
- sitemap.ts and robots.ts via built-in Next.js App Router conventions

**Accessibility (WCAG 2.1 AA)**
- 4.5:1 minimum contrast on all body text (dark overlay required on hero photo text)
- 48x48px minimum tap targets on all CTAs and phone links
- 16px minimum font size on all form inputs (prevents iOS Safari auto-zoom)
- Skip-to-main-content link
- Descriptive alt text on all images
- Keyboard navigation + focus-visible states (Tailwind preflight strips them — restore explicitly in globals.css)
- Label element on every form input (placeholder text is not a substitute)

---

## High-Leverage Differentiators

Features in the top 10-15% of Omaha roofing sites. None require complex integrations. All fit pitch scope.

**Storm / Anti-Chaser Positioning (Raptor's core edge)**
- "Why We're Not a Storm Chaser" dedicated section — direct, named, 15yr permanence story
- Insurance claim walkthrough: 3-step visual (Inspection -> We Meet Your Adjuster -> Repair)
- "We Meet With Your Adjuster" as a distinct CTA/promise
- "No money upfront until insurance approves" reassurance text near storm CTAs
- Insurance carrier logo row (State Farm, Allstate, Farmers, USAA)
- Dedicated Storm Damage page (separate URL for storm-specific search queries)
- Emergency Tarping page with 24/7 phone display

**Project Proof**
- Before/after slider (JavaScript image comparison widget)
- Project gallery tagged by Omaha suburb (Elkhorn, Millard, Papillion)
- Photo-with-name testimonials: "John D. — Papillion, NE"

**Content Trust**
- "No-Subcontractor" explainer — educates homeowners on why this matters
- Warranty transparency section (workmanship vs manufacturer) — rare in Omaha market
- FAQ section with FAQPage schema

**UX**
- Mobile sticky CTA bar pinned to bottom of viewport (phone + estimate) — most Omaha competitors miss this
- Financing callout ("as low as $X/mo") near estimate CTA — reduces sticker shock on $10-20k jobs
- Static service area map

---

## Explicit Anti-Features

| Anti-Feature | Reason to Exclude |
|--------------|-------------------|
| Email-only contact form | Phone must be the primary required field |
| "How did you hear about us?" required field | +27% abandonment per extra field; use UTM params instead |
| Multi-step form (3+ pages) | High-intent leads will not complete it |
| Autoplay video with sound | Mobile bounce + data drain |
| Hero carousel / image slider | Lower CTR than single static hero |
| Aggressive popup within 3 seconds | Breaks "personal family business" promise |
| Generic stock photography | Destroys real-local-crew positioning |
| Differentiators buried in About page only | "No subs, 15 years" belong in hero + proof strip, not hidden behind a nav click |
| Live chat bot with 0.3s responses | Breaks family-business authenticity |
| reCAPTCHA v2 image challenge | Measurable form abandonment, especially on mobile |
| Footer-only phone number | Page has already failed if they reach the footer without calling |
| Thin city-swap service area pages | Google detects and penalizes duplicate content |
| 3+ CTAs competing above fold | Decision paralysis reduces overall conversion |

---

## Suggested Build Order

Derived from ARCHITECTURE.md dependency rules: global layout before pages, content types before components, shared components before pages compose them.

### Phase 1 — Foundation

create-next-app with TypeScript + Tailwind + App Router + src/ dir -> globals.css with @theme tokens (brand colors, type scale, spacing) -> src/content/ data files (site.ts, services.ts, testimonials.ts, faqs.ts) -> src/lib/ helpers (metadata.ts, schema.ts factories) -> app/layout.tsx with metadataBase + title template -> (marketing)/layout.tsx shell

**Why first:** Every subsequent file imports from content and lib. metadataBase must exist before any OG image path resolves. PITFALL C-1 prevented on Day 1.

### Phase 2 — Global Components

Header.tsx (sticky, click-to-call phone) -> Footer.tsx (NAP, service areas, hours, license) -> StickyMobileCTA.tsx (bottom bar, mobile only) -> TrustStrip.tsx (badges row)

**Why second:** Global components appear on every page. Building them early means every subsequent page preview looks production-ready from the first Vercel deploy.

### Phase 3 — Homepage

Hero.tsx (storm variant) -> ServiceGrid.tsx + ServiceCard.tsx -> TestimonialCarousel.tsx -> FaqAccordion.tsx + FaqSchema.tsx -> LocalBusinessSchema.tsx -> app/(marketing)/page.tsx (compose all)

**Why third:** Homepage is the highest-value page for the pitch. First shareable Vercel preview URL must be impressive. This is what the prospect opens.

### Phase 4 — Service Pages

ServiceSchema.tsx -> roofing page (full template) -> siding, gutters, emergency-tarping (copy-adapt from template) -> buildMetadata() applied per page

**Why fourth:** Service pages follow a repeating pattern. Build roofing as the authoritative template, then adapt. All 4 share the same component set.

### Phase 5 — About + Contact

About page (anti-chaser narrative, 15yr story, no-sub explainer) -> ContactForm.tsx (Client Component) -> app/api/contact/route.ts (n8n webhook or Formspree handler) -> Contact page (form + Google Map embed) -> form test submission + Gmail inbox training

**Why fifth:** Requires least shared infrastructure. Form handler choice (n8n vs Formspree) gets resolved here at Phase 5 planning time.

### Phase 6 — SEO Polish + Pre-Deploy Audit

sitemap.ts + robots.ts -> Breadcrumb schema on service/about pages -> Canonical audit (verify buildMetadata() everywhere) -> OG image verification -> robots: { index: true, follow: true } confirmed -> Schema validation via Google Rich Results Test -> Vercel env vars scoped to Preview environment

**Why last:** No visual impact on the pitch but signals professionalism. Run after all pages are finalized.

---

## Catastrophic Pitfalls to Design Around

**1. FTC placeholder testimonials (PITFALL C-5)**
Every fake testimonial must display a visible amber [PLACEHOLDER — Replace with real review before launch] banner. Combining a real-sounding full name + city + star rating + review text without this label is a potential civil violation up to $53,088/violation. Ship a HANDOFF.md listing every placeholder.

**2. Storm-chaser copy accidentally appearing (PITFALL C-7)**
Brand voice rule: Trust beat first, urgency second. Never reverse this order in above-fold copy. See the Storm-Chaser Copy Audit Checklist below.

**3. Missing metadataBase breaks all OG images (PITFALL C-1)**
Set in app/layout.tsx on Phase 1, Day 1. Without it, every social share preview shows a broken image — invisible locally but catastrophic for the pitch link.

**4. Phone not in sticky mobile header (PITFALL S-13)**
60% of roofing searches are mobile. Phone must be visible within 2 seconds of landing on any page, any device, without scrolling. Minimum: tel: link above the nav, visible when hamburger is collapsed.

**5. "use client" on a parent component silently kills server rendering for the entire subtree (PITFALL C-2)**
Affects FCP, LCP, and Google crawlability. Keep "use client" at the leaf node (the interactive element), never on a section wrapper.

**6. Hero image missing priority prop — LCP hits 4-6s (PITFALL S-3)**
Every above-the-fold image must have the priority prop. LCP target is under 2.5s. Without preload, hero images commonly hit 4-6s.

**7. Low contrast text on hero photo (PITFALL S-24)**
83.6% of websites fail WCAG contrast. Hero text over a roof photo requires a solid dark overlay (bg-black/60 or equivalent). Never rely on the photo itself for contrast.

**8. noindex left from development (PITFALL S-8)**
Before sharing the pitch URL: view source and search for noindex. Set robots: { index: true, follow: true } explicitly in root layout.

**Additional pitfalls to track during build:**
- PITFALL S-19: Vercel env vars not scoped to Preview — form handler breaks on pitch URL
- PITFALL S-22: Form notifications landing in Gmail Spam — send one test before the pitch demo
- PITFALL M-2: Tailwind v4 ignores tailwind.config.js silently — all theme config must go in @theme CSS block
- PITFALL S-25: Tailwind preflight removes focus indicators — restore focus-visible in globals.css
- PITFALL S-30: Form inputs under 16px trigger iOS Safari auto-zoom

---

## Storm-Chaser Copy Audit Checklist

Run against every headline, CTA label, hero subtext, section header, and button before each phase review.

**Never use these phrases:**
- "Storm Damage? Call Now!" as a hero headline (storm-chaser 101)
- "Act before insurance deadlines" / "Limited time offer"
- "We work directly with insurance adjusters" as a primary CTA
- "DON'T let storm chasers take advantage of you" (fear-bait in the hero)
- Any countdown timer or "X hours only" widget
- "Sign today and get [discount]"
- Hero imagery that is exclusively hail damage, tarps, or DANGER tape

**Copy sequence rule for any urgency copy:**
1. Permanence first: "Omaha's local roofer since 2009"
2. Trust: "We'll still be here in 10 years"
3. Offer: "Free storm inspection — no pressure, no timeline"
Never reverse this order above the fold.

**Approved CTA phrasing:**
- "Schedule a Free Damage Inspection" (not "File Your Claim Now")
- "We'll Walk Through Your Insurance Claim With You" (not "We'll handle everything")
- "Get Your Free Roof Inspection" (not "Request Estimate")
- "Call (402) 885-1462 — We're Local" (not "Call Now!")
- "Send My Request — We'll Call Back Within 2 Hours" (not "Submit Form")

---

## FTC / Placeholder Content Compliance

**Rule:** FTC Consumer Reviews and Testimonials Rule, effective October 21, 2024. Enforcement letters began December 2025. Penalties up to $53,088 per violation for fabricated reviews implying real customer experience.

**Required implementation for every placeholder testimonial:**

1. Visible amber/yellow banner on the card: [PLACEHOLDER — Replace with real review before launch]. Must be unmissable during the pitch walkthrough.
2. Never combine real-sounding full name + city attribution + star rating + review text without the disclosure label. Together they constitute a fabricated review.
3. Stock/AI photo alt text must not imply it depicts Raptor's actual work. Use: "Example roofing installation — placeholder image" not "Raptor Roofing crew replacing roof in Omaha, NE".
4. Do not submit the preview URL to Google Search Console during the pitch phase.
5. Ship HANDOFF.md in the project root listing every placeholder requiring replacement before launch.

**Pitch framing:** Visible [PLACEHOLDER] banners are a feature, not a bug. They signal NSI operates professionally and has planned for real content.

---

## Open Questions Carrying into Planning

| Question | Options | Recommendation | When to Resolve |
|----------|---------|----------------|-----------------|
| Form handler: n8n vs Formspree | n8n (more powerful, requires workflow setup) vs Formspree (simpler, 50/mo limit) | n8n if workflow set up in under 30 min; Formspree as fallback | Phase 5 planning |
| Tailwind v4 version confirmation | create-next-app should install v4 by default in 2026 | Run cat package.json after scaffolding to verify | Phase 1 Day 1 |
| priority vs preload on next/image | priority works in Next.js 15; preload={true} is v16 forward-compatible | Use priority now; add code comment for upgrade path | Phase 3 hero build |
| Real Raptor phone number | Current site shows (402) 885-1462 | Use this number; confirm or label placeholder | Phase 1 content setup |
| NE contractor license number | Unknown — placeholder needed in content/site.ts | Mark as placeholder; add to HANDOFF.md | Phase 2 trust strip |
| Financing partner | "as low as $X/mo" placeholder | Label [PLACEHOLDER — confirm with Raptor] | Phase 3 homepage |
| Real review count and rating | Placeholder: 4.9 stars / 127 reviews | Check GBP if accessible; otherwise label clearly | Phase 2 trust strip |
| Vercel env var scoping | Must scope N8N_WEBHOOK_URL to Preview environment | Set all env vars to Production + Preview + Development | Deployment phase |
| Gmail spam training | Form notification may land in Promotions | Send one test, drag to Primary inbox before pitch demo | Phase 5 deployment |

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All picks verified against official docs dated 2026-04-10. Only caveat: n8n free tier webhook limits need runtime confirmation |
| Features | MEDIUM-HIGH | Verified against 4 live Omaha competitors + authoritative CRO sources. Conversion impact confidence is MEDIUM (competitor analysis, not controlled testing) |
| Architecture | HIGH | File structure and patterns verified against official Next.js App Router docs |
| Pitfalls | HIGH | Cross-verified: Next.js pitfalls from official changelog; FTC rule from official FTC guidance; CWV from Lighthouse docs; WCAG from official spec |
| **Overall** | **HIGH** | Stack and architecture have no unresolved ambiguity. Gaps are data gaps (license number, financing partner), not research gaps |

**Gaps to address during planning:**
- Real license number, review count, and phone number must be confirmed or labeled as placeholders in src/content/site.ts
- Form handler choice (n8n vs Formspree) must be resolved in Phase 5 planning before implementation
- Tailwind v4 version assumption must be verified post-scaffolding

---

## Sources

### Primary (HIGH confidence)
- nextjs.org/docs (lastUpdated 2026-04-10) — App Router, generateMetadata, JSON-LD, Image, sitemap, robots
- nextjs.org/blog/next-15 — Next.js 15 feature confirmation
- tailwindcss.com/docs/upgrade-guide — Tailwind v4 CSS-first config, Oxide engine, class renames
- ftc.gov — Consumer Reviews and Testimonials Rule (effective October 21, 2024)
- vercel.com/docs — Analytics free tier, env var scoping, deployment

### Secondary (MEDIUM-HIGH confidence)
- raptorroofingllc.com — current site audit
- anchorroofing.com, mccoyroofing.com, preferredroofingomaha.com, gwileycontracting.com — Omaha competitor analysis
- roofingseo.services/roofing-website-design/best-roofing-websites-2026/ — industry feature benchmarks
- contractorcalls.com/website-conversion-tips-roofing-industry/ — CRO for roofing
- ventureharbour.com/how-form-length-impacts-conversion-rates/ — form abandonment research

### Tertiary (MEDIUM confidence)
- robbenmedia.com — roofing website conversion tips
- jobnimbusmarketing.com — local SEO for contractors
- formspree.io/plans — free tier limits (verify at project start)

---
*Research completed: 2026-04-13*
*Ready for roadmap: yes*
