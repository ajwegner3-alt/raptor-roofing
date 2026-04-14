# Pitfalls Research — Raptor Roofing Site

**Domain:** Next.js 15 App Router marketing site for a local trade contractor  
**Researched:** 2026-04-13  
**Overall confidence:** HIGH (verified against Next.js official docs, Tailwind official docs, FTC official guidance, and multiple current sources)

---

## Catastrophic Pitfalls

Pitfalls in this section kill the pitch, create legal liability, or require a rebuild.

---

### Next.js / App Router

#### PITFALL C-1: Missing `metadataBase` — OG images 404 on every social share
**Severity:** Catastrophic  
**Warning signs:** When you share the Vercel preview URL on Slack/iMessage and the link preview shows no image, or shows a broken image icon. This is invisible during local dev.  
**Prevention:** Set `metadataBase` in `app/layout.tsx` root metadata export pointing to your Vercel deployment URL. For the preview deploy, use `NEXT_PUBLIC_SITE_URL` environment variable. Without this, all `openGraph.images` paths are relative and social crawlers cannot resolve them.

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://raptor-roofing.vercel.app'),
  // ...
}
```

**Phase:** Iteration build phases — add on page 1, do not defer.

---

#### PITFALL C-2: `"use client"` on a wrapper component silently disables server rendering for entire subtree
**Severity:** Catastrophic  
**Warning signs:** Page HTML source shows blank `<div>` shell instead of full content. PageSpeed Lighthouse shows poor FCP. Google Search Console shows "crawled but not indexed" for pages.  
**Prevention:** Keep `"use client"` boundary as close to the interactive leaf node as possible. A hero section's click-to-call button does not require the entire hero to be a client component — only the `<a tel:>` tracking wrapper needs it, if anything. Audit the component tree before each phase: server components can import client components, but client components cannot import server components.  
**Phase:** Iteration build phases — establish the boundary rule before writing any component.

---

#### PITFALL C-3: Exporting both static `metadata` and `generateMetadata` from the same file
**Severity:** Catastrophic — build error, site does not deploy  
**Warning signs:** Vercel build log shows `Error: You cannot export both 'metadata' and 'generateMetadata' from the same route.`  
**Prevention:** Decide per-page: static `metadata` export (fine for most pages on this site) OR `generateMetadata` (only needed if metadata depends on fetched data). Never both. For Raptor's static service pages, use static `metadata` objects everywhere.  
**Phase:** Iteration build phases — use a metadata template file to establish the pattern once.

---

#### PITFALL C-4: `params` and `searchParams` not awaited in Next.js 15 (breaks dynamic routes)
**Severity:** Catastrophic — runtime error on any page using route parameters  
**Warning signs:** TypeScript error: `Property 'slug' does not exist on type 'Promise<...>'`. Runtime error: `TypeError: Cannot read properties of undefined`. Works in Next.js 14 but breaks in 15.  
**Prevention:** In Next.js 15, `params` and `searchParams` are now async. Always `await` them:

```typescript
// Next.js 15 — correct pattern
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ...
}
```

**Phase:** Iteration build phases — if any service page uses a `[slug]` route.

---

### Placeholder Content

#### PITFALL C-5: Publishing fabricated testimonials that read as real customer reviews — FTC Rule violation
**Severity:** Catastrophic — legal liability  
**Warning signs:** Testimonials say things like "— Mike T., Omaha" with no indication they are placeholder content. Site is deployed, indexed, and a real consumer reads a fictional 5-star review as genuine.  
**Prevention:** The FTC's Consumer Reviews and Testimonials Rule (effective October 21, 2024) prohibits reviews that misrepresent whether the reviewer had a real experience with the service. Civil penalties up to $53,088 per violation. Enforcement letters started December 2025.

Two-layer mitigation required:
1. **On-page visual label:** Every placeholder testimonial card must display a visible banner: `[PLACEHOLDER — Replace with real review before launch]`. Use a bright color (amber/yellow) so it is unmissable during the pitch walkthrough — it signals to the prospect that you've planned for real content, not that you're faking.
2. **`noindex` the page if testimonials are the sole content:** If any page exists solely to showcase placeholder social proof, add `<meta name="robots" content="noindex">` until real content is live.
3. **Never use real-sounding full names + city + star rating without a disclosure.** A testimonial that reads "Sarah M., Omaha ★★★★★ — Best roofer in town!" is indistinguishable from a real review to Google's crawler and a casual visitor.

**Phase:** Every iteration and the final build — non-negotiable.

---

#### PITFALL C-6: Stock photos indexed with SEO-optimized alt text mislead searchers
**Severity:** Significant to Catastrophic (depending on degree of misrepresentation)  
**Warning signs:** A stock photo of a generic roof replacement is given alt text like `"Raptor Roofing crew replacing roof in Omaha, NE"` — implying it's Raptor's actual work.  
**Prevention:**
- Alt text for stock/AI-generated photos must not imply it depicts Raptor's actual work. Use: `"Roofing installation — placeholder image"` or `"Example of roof replacement work"`.
- Keep a handoff checklist (HANDOFF.md) that lists every stock image that needs replacing with real project photos post-signing.
- Do not submit the preview URL to Google Search Console during the pitch phase.

**Phase:** Every iteration — build the handoff checklist in the final production build phase.

---

### Storm-Chaser Positioning

#### PITFALL C-7: Copy that accidentally signals storm-chaser behavior to a skeptical Omaha homeowner
**Severity:** Catastrophic — kills the trust-led positioning that is Raptor's entire competitive advantage  
**Warning signs:** Any of the following appear in headlines, hero text, CTAs, or section headers:
- "Storm Damage? Call Now!" as a prominent headline (this is storm-chaser headline 101)
- "Limited time offer" or "act before insurance deadlines"
- "We work directly with insurance adjusters" as a primary CTA (sounds like fraud bait)
- "Free inspection after the storm" as the *only* hook (nothing else about the company)
- "DON'T let storm chasers take advantage of you" in the hero (ironic fear-bait)
- Hero imagery that is only hail damage, only roofs with tarps, only "DANGER" tape scenes
- Any countdown timer or "X hours only" urgency widget

**Prevention:** The brand voice rule: every claim of urgency must be anchored to Raptor's permanence. Correct pattern:
- BAD: "Storm hit? Call immediately."
- GOOD: "Omaha's local roofer since 2009 — here before the storm, here after. Free storm inspection."

Urgency is acceptable when it follows trust establishment. The trust beat must come first.  
The headline hierarchy should be: Who we are → Why trust us → What we can do for you → Act now.

**Phase:** Every iteration — design brief must include copy guardrails before writing a single headline.

---

## Significant Pitfalls

Pitfalls that hurt conversion, SEO, or performance meaningfully but are fixable without a rebuild.

---

### Next.js / App Router

#### PITFALL S-1: `searchParams` prop on a page component opts the entire route into dynamic rendering
**Severity:** Significant — breaks ISR/static generation for that page, adds server latency  
**Warning signs:** Build output shows `ƒ (Dynamic)` next to a page that should be `○ (Static)`. No explicit dynamic API was intentionally used.  
**Prevention:** Do not pass `searchParams` to a page component unless you explicitly need it. If you need it for a contact form UTM parameter, handle it client-side with `useSearchParams()` inside a `"use client"` wrapper, not in the page server component itself.  
**Phase:** Iteration build phases.

---

#### PITFALL S-2: Client component hydration mismatch from browser-only APIs
**Severity:** Significant — React throws hydration error, white flash on mobile  
**Warning signs:** Console shows `Warning: Text content does not match server-rendered HTML`. Flickering on first load. Error mentions `useEffect` or `window`.  
**Prevention:** Never read `window`, `localStorage`, `navigator`, or `Date.now()` during initial render in a component marked `"use client"`. If you need current year in a copyright footer, use it in a `useEffect` or accept the static value at build time. If you need geolocation or screen width, gate it behind `useEffect`.  
**Phase:** Iteration build phases.

---

### Core Web Vitals

#### PITFALL S-3: Hero image without `priority` prop tanks LCP
**Severity:** Significant — LCP commonly hits 4–6s without this, well above the 2.5s target  
**Warning signs:** Lighthouse LCP shows the hero image. PageSpeed shows `Preload Largest Contentful Paint image`. Network waterfall shows hero image starting to load after JS bundle.  
**Prevention:** The `<Image>` component in Next.js defaults to `loading="lazy"`. Every above-the-fold image — the hero background, the hero foreground photo — must have `priority` prop set. Do not add `priority` to below-fold images (it defeats the purpose and wastes preload budget).

```tsx
<Image src="/hero-roof.webp" alt="..." fill priority sizes="100vw" />
```

**Phase:** Every iteration — part of the hero component template.

---

#### PITFALL S-4: `<Image>` without `width`/`height` or `fill` + no parent container dimensions causes CLS
**Severity:** Significant — CLS score instantly fails the 0.1 threshold  
**Warning signs:** PageSpeed shows `Avoid large layout shifts`. Elements jump when images load. CLS > 0.1 in field data.  
**Prevention:** Every `<Image>` must either have explicit `width` and `height` props, or use `fill` with a parent container that has `position: relative` and an explicit `aspect-ratio` or fixed height. The browser needs to know the image slot size before the image loads, or the page reflows.  
**Phase:** Every iteration.

---

#### PITFALL S-5: Google Fonts loaded without `display=swap` causes invisible text during LCP window
**Severity:** Significant — LCP timing inflated, text not visible during slow connections  
**Warning signs:** Lighthouse flags `Ensure text remains visible during webfont load`. Text invisible for 1–3 seconds on slow 3G.  
**Prevention:** Use Next.js `next/font/google` (the preferred method) which automatically applies `display: swap` and self-hosts the font files, eliminating the third-party request entirely. Do not use raw `<link>` tags to Google Fonts CDN — they add a render-blocking round trip.

```typescript
import { Oswald } from 'next/font/google'
const oswald = Oswald({ subsets: ['latin'], display: 'swap' })
```

**Phase:** Iteration build phases — typography setup happens first.

---

#### PITFALL S-6: Heavy JavaScript animations (Framer Motion, GSAP) on marketing site cause INP failures
**Severity:** Significant on lower-end Android phones (typical contractor customer device)  
**Warning signs:** Lighthouse INP > 200ms. Long tasks visible in Performance tab. Animations stutter on mid-range Android.  
**Prevention:** For a contractor marketing site, animations should be CSS-based (transitions, keyframes) rather than JavaScript-driven wherever possible. If using Framer Motion, lazy-load it and limit animation to single elements, not entire sections. Never animate on scroll with a heavy `scroll` event listener — use CSS `@keyframes` with `animation-play-state` toggled by Intersection Observer instead.  
**Phase:** Iteration build phases.

---

#### PITFALL S-7: Sticky header causes CLS when it appears after scroll
**Severity:** Moderate — CLS score affected if header shifts content on appear  
**Warning signs:** PageSpeed CLS score ticks up. Layout visibly jumps when user scrolls past hero.  
**Prevention:** Reserve the sticky header's height in the layout at all times using a placeholder div or by setting a consistent `padding-top` on the page wrapper equal to the header height. If the header is always visible (not hide/show on scroll), this is not an issue. Never conditionally add height to the header based on scroll position.  
**Phase:** Every iteration.

---

### SEO

#### PITFALL S-8: `noindex` left in `layout.tsx` from development — entire site invisible to Google
**Severity:** Catastrophic if not caught before the pitch URL is shared; Significant if caught  
**Warning signs:** Google Search Console shows 0 indexed pages. Fetch as Google shows `X-Robots-Tag: noindex`. Browser DevTools shows `<meta name="robots" content="noindex">` in the `<head>`.  
**Prevention:** In Next.js App Router, the default `robots` metadata is `index: true` — but many developers add `robots: { index: false }` during development and forget to remove it. Add a Vercel deployment check: before sharing the preview URL, view source and search for `noindex`.

For the Raptor pitch, explicitly set `robots: { index: true, follow: true }` in `app/layout.tsx` so it is never accidentally inherited.  
**Phase:** Final production build phase — add to the pre-deploy checklist.

---

#### PITFALL S-9: Duplicate H1s across pages or multiple H1s on a single page
**Severity:** Significant — confuses crawlers about page topic, dilutes relevance signal  
**Warning signs:** Chrome DevTools accessibility tree shows multiple `<h1>` elements. The homepage H1 and the hero `<h2>` say nearly the same thing. Service page H1 is "Roofing Services" and the meta title is also "Roofing Services."  
**Prevention:** One H1 per page. The H1 should be different from the title tag (related but not identical). Service page pattern:
- Title tag: `Roofing Installation & Repair in Omaha | Raptor Roofing`
- H1: `Omaha's Trusted Roofing Contractor — Installs & Repairs Since 2009`

**Phase:** Every iteration — headline structure is part of the content template.

---

#### PITFALL S-10: OG image route missing from `next-sitemap` or manual sitemap
**Severity:** Moderate — social sharing broken, sitemap incomplete  
**Warning signs:** Screaming Frog or sitemap validator shows OG image URLs returning 404. Social card shows no preview image.  
**Prevention:** If using Next.js `opengraph-image.tsx` file-based OG images, they are automatically served at `/[route]/opengraph-image` but are not automatically added to sitemaps. Use `next-sitemap` package and confirm it includes all routes. Verify OG image URLs resolve before sharing the pitch link.  
**Phase:** Final production build phase.

---

#### PITFALL S-11: Canonical tags pointing to wrong URL (or missing) on service pages
**Severity:** Significant — duplicate content signal across similar service pages  
**Warning signs:** `<link rel="canonical">` points to the homepage. Two similar service pages (e.g., `roofing-repair` and `roof-replacement`) have identical canonicals. No canonical on any page.  
**Prevention:** In Next.js App Router, canonical is set via `alternates.canonical` in page metadata. Set it explicitly on every page to its own absolute URL. Do not inherit from layout — layout-level canonical applies to every page and is wrong for inner pages.

```typescript
export const metadata: Metadata = {
  alternates: { canonical: 'https://raptorroofing.vercel.app/services/roofing' }
}
```

**Phase:** Every iteration.

---

#### PITFALL S-12: Schema markup validation errors — LocalBusiness missing required fields
**Severity:** Significant — rich results eligibility lost  
**Warning signs:** Google Rich Results Test shows errors. Schema.org validator shows missing required properties. `telephone`, `address`, or `priceRange` missing from `LocalBusiness` schema.  
**Prevention:** Required fields for `LocalBusiness` schema: `name`, `url`, `telephone`, `address` (with `streetAddress`, `addressLocality`, `addressRegion`, `postalCode`, `addressCountry`). For `HomeAndConstructionBusiness` (the correct type for Raptor), also include `areaServed`. Validate with Google Rich Results Test before the pitch.  
**Phase:** Final production build phase — schema is the last SEO layer.

---

### Contractor Conversion

#### PITFALL S-13: Phone number buried — not in sticky header on mobile
**Severity:** Catastrophic for conversion — 60% of roofing searches are mobile  
**Warning signs:** Mobile user has to scroll past the hero, past services, past testimonials to find a phone number. The header on mobile shows only the logo and a hamburger.  
**Prevention:** On mobile, the sticky header must include either a visible `tel:` link or a "Call" button at all times. The minimum implementation: a `tel:` link in the top bar above the nav, visible even when the hamburger menu is collapsed. Target: phone number visible within 2 seconds of landing on any page, on any device, without scrolling.  
**Phase:** Every iteration — part of the header component spec.

---

#### PITFALL S-14: Form asks for email as the primary contact field
**Severity:** Significant — contractor customers expect to be called back, not emailed  
**Warning signs:** Form field order: Name → Email → Message. Email is the required field. No phone number field.  
**Prevention:** For a roofing contractor, phone is the primary lead capture field. Form field order: Name → Phone (required) → Service Needed (dropdown) → ZIP Code (optional). Email is optional or absent entirely. The submit button says "Request a Call Back" not "Send Message."  
**Phase:** Every iteration — part of the form component spec.

---

#### PITFALL S-15: Too many form fields — abandonment rate spikes above 4 fields
**Severity:** Significant — research shows forms over 4 fields see dramatically higher abandonment  
**Warning signs:** Form has: Name, Email, Phone, Address, Roof type, Age of roof, Insurance carrier, Message. User opens the form on mobile and closes it.  
**Prevention:** Maximum 4 fields for the primary lead form: Name, Phone, Service (dropdown), ZIP. Anything else goes into a follow-up call. If you need a message field, make it optional and put it last.  
**Phase:** Every iteration.

---

#### PITFALL S-16: Trust signals not adjacent to CTAs
**Severity:** Significant — conversion lift from trust signals is highest when proximate to the decision point  
**Warning signs:** Trust badges (licensed, bonded, insured) appear in the footer only. The CTA button is isolated without any nearby social proof.  
**Prevention:** Within 100px of every CTA button or form submit button, include at minimum: license/insured badge + star rating + years in business. The pattern: [CTA button] immediately followed by small icon row: ✓ Licensed & Insured  ✓ 15+ Years  ✓ Omaha-Local  ✓ 4.9 ★ (47 reviews).  
**Phase:** Every iteration.

---

#### PITFALL S-17: Vague CTA copy ("Submit", "Learn More", "Get Started")
**Severity:** Significant — unclear CTAs reduce conversion rate  
**Warning signs:** Primary CTA says "Submit." Hero CTA says "Get Started." Nav has a "Contact" link.  
**Prevention:** Every CTA must state what happens next from the user's perspective:
- "Get Your Free Roof Inspection" (not "Request Estimate")
- "Call (402) 885-1462 Now" (not "Contact Us")
- "Send My Request — We'll Call Back Within 2 Hours" (not "Submit Form")

**Phase:** Every iteration — write CTA copy before designing the button.

---

#### PITFALL S-18: Autoplay video in hero causes INP failures and mobile data drain
**Severity:** Significant on mobile  
**Warning signs:** Hero has a looping background video. Mobile users on LTE see a data warning. Lighthouse shows large network payloads.  
**Prevention:** No autoplay video. Use a high-quality static WebP hero image. If video is desired, load it lazily, muted, after user interaction. For a contractor pitch site, a strong photograph communicates trust more directly than a video loop.  
**Phase:** Every iteration — call this out in the hero design spec.

---

### Vercel Deploy

#### PITFALL S-19: Environment variables not scoped to Preview environment — form handler breaks on preview URL
**Severity:** Significant — the pitch URL's form doesn't work  
**Warning signs:** Vercel Preview URL serves the site correctly but form submissions fail silently. Network tab shows 500 on the API route. Local dev works fine.  
**Prevention:** Vercel has three environments: Production, Preview, Development. Environment variables must be explicitly scoped to each environment in the Vercel dashboard. For the Raptor pitch: set `NEXT_PUBLIC_SITE_URL` and any form API keys to all three environments (or at minimum Production + Preview). Check the variable scoping table in the Vercel dashboard before sharing the pitch URL.  
**Phase:** Deployment phase.

---

#### PITFALL S-20: `next/image` fails with unregistered external image domains
**Severity:** Significant — images from external URLs return 400 errors  
**Warning signs:** Console shows `Error: Invalid src prop ... hostname is not configured under images in your next.config.js`. All external images appear broken.  
**Prevention:** Any external hostname used with `<Image src="...">` must be declared in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: 'cdn.example.com' },
  ]
}
```

For this project, use local `/public/` images whenever possible to avoid this entirely.  
**Phase:** Iteration build phases.

---

#### PITFALL S-21: Vercel free tier serverless function timeout (10s) breaks on slow form API routes
**Severity:** Moderate  
**Warning signs:** Form submissions work locally but fail on Vercel with a 504 error after ~10 seconds. Vercel logs show `Function execution timed out after 10000ms`.  
**Prevention:** Keep form handler route handlers under 3 seconds of execution time. If using a third-party form service (Web3Forms, Formspree), the API call should complete well within this window. Do not do any database writes, email sending, or CRM sync inside the Next.js route handler — use the third-party service's own pipeline for delivery.  
**Phase:** Deployment phase.

---

### Form Handling

#### PITFALL S-22: Form submissions land in Gmail Promotions/Spam — prospect never sees the lead
**Severity:** Catastrophic for lead capture utility; Significant for the pitch (demo form should work)  
**Warning signs:** Test the form, submit it, and check Gmail — the notification email is in Spam or Promotions. Never arrives in Primary inbox.  
**Prevention:** Starting November 2025, Gmail enforces SPF, DKIM, and DMARC checks and actively rejects or delays non-compliant messages. Web3Forms and Formspree send from their own verified domains, so SPF/DKIM is handled — but Gmail's promotional classifier will still filter form notification emails unless the recipient marks them as Not Spam once.

Mitigation:
1. Use Web3Forms (free, 250 submissions/month) or Formspree free tier.
2. After setting up, send one test submission and manually drag the result to Primary inbox — this trains Gmail's classifier.
3. In the handoff doc, instruct Raptor to do the same step before launching.
4. Alternatively, use Resend or a transactional email service that handles SPF/DKIM setup — but this requires a verified sending domain (costs money or uses the free tier with their subdomain).

**Phase:** Deployment phase.

---

#### PITFALL S-23: No honeypot or CAPTCHA — form gets spam-bombed within days of deployment
**Severity:** Moderate for the pitch (short-lived preview URL), Significant for production  
**Warning signs:** 50+ form submissions from obviously fake emails within 48 hours of deployment. Inbox flooded.  
**Prevention:** Web3Forms and Formspree both include built-in spam filtering and honeypot field support. Enable it. For the pitch, a basic honeypot field (hidden input that bots fill but humans don't) is sufficient. Do not add visible CAPTCHA to the form — it directly reduces conversion rate and is particularly hostile to older mobile users.  
**Phase:** Deployment phase.

---

### Accessibility

#### PITFALL S-24: Low contrast text on hero image — fails WCAG AA 4.5:1 ratio
**Severity:** Significant — WCAG AA is a stated project requirement; also affects older homeowners (primary contractor customer)  
**Warning signs:** Chrome Accessibility audit shows contrast failures. Text appears readable on developer's high-quality monitor but fails on cheaper screens. Dark text on a medium-toned roof photo fails.  
**Prevention:** 83.6% of websites fail WCAG contrast requirements. Hero text over a photo must use one of:
1. A solid dark overlay (`bg-black/60` or similar) behind the text
2. A text shadow sufficient to guarantee contrast on any photo tone
3. Text placed in a solid-color region (e.g., dark panel alongside the photo)

Never rely on the photo itself to provide enough contrast — photos change with iteration, and the contrast guarantee disappears.  
Verify with Chrome DevTools contrast checker or the axe browser extension.  
**Phase:** Every iteration.

---

#### PITFALL S-25: Tailwind reset removes focus indicators — keyboard navigation breaks entirely
**Severity:** Significant — WCAG 2.4.7 Focus Visible is Level AA  
**Warning signs:** Tab through the page — no visible focus ring anywhere. Keyboard users cannot navigate. Chrome Accessibility audit shows `Elements must have discernible text` or `Interactive controls must be focusable`.  
**Prevention:** Tailwind's preflight reset (`outline: 2px solid transparent; outline-offset: 2px`) applied to interactive elements removes default browser focus rings. You must explicitly add focus styles. In Tailwind v4, use the `focus-visible:` variant:

```css
/* global base styles */
*:focus-visible {
  outline: 2px solid #0ea5e9; /* matches brand accent */
  outline-offset: 3px;
}
```

Do not add this only to buttons — add it to all focusable elements including links, inputs, and selects.  
**Phase:** Iteration build phases — part of the global CSS setup.

---

#### PITFALL S-26: Form inputs missing associated `<label>` elements
**Severity:** Significant — WCAG 1.3.1, also hurts mobile UX (label tap expands input target)  
**Warning signs:** Axe accessibility audit flags `Form elements must have labels`. Screen reader announces input as "edit text" with no context. Placeholder text used as the only label indicator.  
**Prevention:** Placeholder text is not a substitute for a `<label>`. Every form input must have either a visible `<label htmlFor="...">` or an `aria-label`. Placeholder text should be an example value (e.g., "555-867-5309"), not the field name.  
**Phase:** Every iteration — part of the form component spec.

---

#### PITFALL S-27: Skipped heading levels break screen reader navigation
**Severity:** Moderate  
**Warning signs:** Accessibility tree shows H1 → H3 (H2 missing). Screen reader user cannot navigate by headings. Chrome accessibility panel shows heading structure gaps.  
**Prevention:** Heading hierarchy must be linear: H1 (one per page) → H2 (section headers) → H3 (subsections). Never skip levels for visual styling — if an H3 visually looks right but an H2 is structurally correct, use H2 and restyle it. Design the heading structure as content architecture, not visual sizing.  
**Phase:** Every iteration.

---

### Mobile

#### PITFALL S-28: Sticky header consumes too much viewport — content obscured on small screens
**Severity:** Significant on phones with small viewports (iPhone SE, older Android)  
**Warning signs:** On a 375px-wide viewport, the sticky header is 80px tall. The hero CTA is cut off. Users see header + hero headline but no CTA without scrolling.  
**Prevention:** Mobile sticky header should be compact: logo + phone number + hamburger in 56–64px maximum height. If showing the full nav, it belongs in a slide-out drawer. Test on a real 375px viewport before finalizing any iteration.  
**Phase:** Every iteration.

---

#### PITFALL S-29: Phone number not wrapped in `tel:` link — mobile users cannot tap-to-call
**Severity:** Catastrophic for conversion — this is the primary lead capture mechanism for contractors  
**Warning signs:** Phone number appears as plain text. Tapping it on mobile does nothing. Chrome mobile shows it as selectable text but not a link.  
**Prevention:** Every phone number display — in header, hero, footer, contact page — must be an anchor tag with `href="tel:+14028851462"`. The display text can be formatted as `(402) 885-1462` but the href must use the stripped international format.  
**Phase:** Every iteration — enforce in the typography/link component.

---

#### PITFALL S-30: iOS form inputs with font-size under 16px trigger auto-zoom — disorients mobile users
**Severity:** Significant — Safari zooms the entire viewport into the focused field; user has to manually zoom out  
**Warning signs:** On an iPhone, tapping any form input zooms the page. The viewport shifts and the user loses context.  
**Prevention:** All form input elements must have `font-size: 16px` minimum. In Tailwind, apply `text-base` (16px) to all `<input>`, `<select>`, and `<textarea>` elements. This is not a styling suggestion — it is a Safari behavior constraint that cannot be overridden via viewport meta tags in iOS 10+.  
**Phase:** Every iteration — part of the form component base styles.

---

#### PITFALL S-31: Fixed-width images cause horizontal scroll on mobile
**Severity:** Moderate  
**Warning signs:** Mobile users can swipe horizontally. A 1200px-wide image overflows the viewport.  
**Prevention:** Never set absolute pixel widths on images. All images must use `width: 100%` or `max-width: 100%`, or use the Next.js `<Image>` component with `fill` or responsive `sizes` attribute. In Tailwind: apply `w-full` to all block-level images.  
**Phase:** Every iteration.

---

#### PITFALL S-32: Tap targets under 48x48px — links and buttons miss taps on touchscreens
**Severity:** Significant — WCAG 2.5.5 (Level AA in WCAG 2.2) requires 24x24px minimum; Google recommends 48x48px  
**Warning signs:** Lighthouse flags `Tap targets are not sized appropriately`. Small navigation links in the footer. Social media icon links at 24px. The "X" close button on a mobile menu.  
**Prevention:** All interactive elements — buttons, links, icon buttons — must have a minimum tap target of 48x48px even if the visible element is smaller. Use padding to expand the tap area without changing the visual size. In Tailwind: `p-3` or `p-4` on icon-only buttons.  
**Phase:** Every iteration.

---

## Minor Pitfalls

Polish issues that are fixable in the final production build phase or post-launch.

---

### Tailwind v4

#### PITFALL M-1: `bg-gradient-to-*` class names removed in Tailwind v4
**Severity:** Minor — build-time error, immediately visible  
**Warning signs:** Tailwind v4 silently ignores `bg-gradient-to-r` (v3 class). Gradients stop rendering. No TypeScript error.  
**Prevention:** In Tailwind v4, gradient utilities are renamed to follow CSS conventions: `bg-gradient-to-r` becomes `bg-linear-to-r`. Run the official `@tailwindcss/upgrade` codemod to catch ~90% of renames automatically.  
**Phase:** Project setup — establish Tailwind v4 conventions before writing components.

---

#### PITFALL M-2: Tailwind v4 config must be in CSS `@theme` — `tailwind.config.js` is ignored
**Severity:** Minor (if you know v4) — Significant if upgrading from v3 mid-project  
**Warning signs:** Custom colors, spacing, or fonts defined in `tailwind.config.js` have no effect. The file still exists, no error, just silently ignored.  
**Prevention:** In Tailwind v4, all theme customization moves to the CSS `@theme` block in your global CSS file. Do not create `tailwind.config.js` for a greenfield v4 project. Use CSS variables:

```css
@theme {
  --color-brand-teal: #1a5c5a;
  --font-display: 'Oswald', sans-serif;
}
```

**Phase:** Project setup.

---

#### PITFALL M-3: Default border color changed — all borders visually change between v3 and v4
**Severity:** Minor — visual regression  
**Warning signs:** After upgrading (or starting with v4 after v3 habits), borders that were `currentColor` (black/dark by default) now render as a light gray. Visible on cards, dividers, form inputs.  
**Prevention:** In Tailwind v4, the default border color is `--color-gray-200` (light gray) instead of v3's `currentColor`. For visible borders, always specify an explicit color: `border-gray-300` rather than relying on the default.  
**Phase:** Every iteration.

---

### Content Depth

#### PITFALL M-4: Service pages under ~400 words treated as thin content by Google
**Severity:** Significant for post-pitch SEO; Minor for the pitch itself (Google won't have indexed the preview URL)  
**Warning signs:** Service page has: a headline, 2 paragraphs of generic copy, a bulleted list, and a CTA. Total word count under 400. No unique local context.  
**Prevention:** Each service page should include:
1. What the service is and when a homeowner needs it
2. Raptor's specific approach (no subcontractors, warranty details, material options)
3. Local context (Nebraska hail seasons, insurance claim process in Omaha)
4. A FAQ section with 3–5 real questions
5. Trust signals specific to this service

Target: 600–800 words of substantive content per service page. This also gives schema `FAQPage` something meaningful to mark up.  
**Phase:** Production build phase — content depth is secondary to iteration speed.

---

#### PITFALL M-5: Keyword stuffing on service pages — exact-match repetition
**Severity:** Minor (Google filters it rather than penalizing hard) but signals low quality  
**Warning signs:** "Omaha roofing" appears 14 times in 500 words. "Raptor Roofing Omaha Nebraska roofing contractor" in the footer.  
**Prevention:** Target keyword appears naturally in: title tag, H1, first paragraph, one H2, one time in body, alt text of one image. That is sufficient. Write for a homeowner first — if a sentence exists only to contain the keyword, cut it.  
**Phase:** Production build phase.

---

#### PITFALL M-6: Homepage and service pages cannibalize each other for the same keyword
**Severity:** Significant for post-pitch SEO  
**Warning signs:** Homepage H1: "Omaha Roofing Contractor." Roofing service page H1: "Omaha Roofing Services." Both pages target the same primary keyword with similar content density.  
**Prevention:** The homepage targets the brand + general contractor keyword ("Raptor Roofing — Omaha's Trusted Roofer"). Each service page owns its specific keyword ("Roof Replacement in Omaha", "Siding Installation Omaha"). Internal links from the homepage to service pages should use keyword-rich anchor text so Google can distribute ranking equity.  
**Phase:** Production build phase — content architecture decision.

---

### Form Handling

#### PITFALL M-7: Free tier form service rate-limits spike during pitch demo
**Severity:** Minor — unlikely during a single demo, but worth noting  
**Warning signs:** Multiple test submissions in quick succession return 429 errors. Web3Forms temporarily blocks the IP.  
**Prevention:** Limit test submissions to one per minute during demo prep. Web3Forms free tier is 250 submissions/month — more than sufficient for a pitch site. If demonstrating the form live, submit once and wait for the email before submitting again.  
**Phase:** Deployment phase.

---

## Phase Assignment Summary

| Phase | Pitfalls to Address |
|-------|-------------------|
| Project setup (greenfield) | M-1, M-2 (Tailwind v4 config), S-5 (next/font setup) |
| Every iteration | C-1 (metadataBase), C-2 (use client boundary), C-5 (testimonial labels), C-7 (storm-chaser copy), S-3 (image priority), S-4 (image dimensions), S-7 (sticky header CLS), S-9 (heading structure), S-11 (canonical), S-13 (phone in header), S-14 (form fields), S-15 (form length), S-16 (trust near CTA), S-17 (CTA copy), S-18 (no autoplay video), S-24 (hero contrast), S-25 (focus indicators), S-26 (form labels), S-27 (heading levels), S-28 (mobile header height), S-29 (tel: links), S-30 (iOS font-size), S-31 (fixed-width images), S-32 (tap targets), M-3 (border color), C-6 (stock photo alt text) |
| Iteration build phases | C-3 (metadata conflict), C-4 (async params), S-1 (searchParams dynamic), S-2 (hydration), S-6 (JS animations), S-10 (OG image route), S-20 (image domains config) |
| Production build phase | M-4 (content depth), M-5 (keyword stuffing), M-6 (cannibalization) |
| Deployment phase | S-8 (noindex check), S-12 (schema validation), S-19 (env vars), S-21 (function timeout), S-22 (Gmail deliverability), S-23 (honeypot spam), M-7 (rate limit) |
| Every phase (ongoing) | C-5 (testimonial disclosure), C-7 (storm-chaser positioning) |

---

## Sources

- [Next.js Hydration Error docs](https://nextjs.org/docs/messages/react-hydration-error) — HIGH confidence
- [Next.js generateMetadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — HIGH confidence
- [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image) — HIGH confidence
- [Next.js App Router static-to-dynamic error](https://nextjs.org/docs/messages/app-static-to-dynamic-error) — HIGH confidence
- [Tailwind CSS v4 Upgrade Guide](https://tailwindcss.com/docs/upgrade-guide) — HIGH confidence
- [FTC Consumer Reviews and Testimonials Rule Q&A](https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers) — HIGH confidence
- [Vercel Environment Variables docs](https://vercel.com/docs/environment-variables) — HIGH confidence
- [Vercel Limits docs](https://vercel.com/docs/limits) — HIGH confidence
- [CSS-Tricks: 16px prevents iOS form zoom](https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/) — HIGH confidence
- [WebAIM: Contrast and Color Accessibility](https://webaim.org/articles/contrast/) — HIGH confidence
- [Web3Forms troubleshooting docs](https://docs.web3forms.com/getting-started/troubleshooting) — MEDIUM confidence
- [Pagepro: 10 Common Next.js Mistakes That Hurt Core Web Vitals](https://pagepro.co/blog/common-nextjs-mistakes-core-web-vitals/) — MEDIUM confidence
- [Nanocraft: Common Roofing Website Mistakes 2025](https://www.nanocraftsolutions.com/blog/common-roofing-website-mistakes-to-avoid) — MEDIUM confidence
- [Contractor Calls: 12 Website Conversion Tips for Roofing](https://contractorcalls.com/website-conversion-tips-roofing-industry/) — MEDIUM confidence
- [Vertical Solutions Roofing: What Is a Storm Chaser (2025)](https://verticalsolutionsroofing.com/2025/11/01/what-is-a-storm-chaser-and-why-you-should-avoid-them/) — MEDIUM confidence
- [FTC Fake Reviews Rule enforcement (December 2025)](https://criminaldefense.com/fake-reviews-and-testimonials-can-lead-to-substantial-penalties-under-new-ftc-rule/) — MEDIUM confidence (corroborated by FTC.gov primary source)
