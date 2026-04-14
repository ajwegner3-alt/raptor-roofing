# Phase 2 Research: Global Components

**Researched:** 2026-04-13
**Domain:** Next.js 16 App Router RSC/Client boundary, Tailwind v4, accessibility
**Confidence:** HIGH (all findings from direct file reads + verified Next.js App Router knowledge)

---

## Existing Project Surface

### Brand Tokens (globals.css @theme block)

| Token | Value | Use in Phase 2 |
|-------|-------|----------------|
| `--color-primary-600` | `#2e4a56` | Header background (slate-teal) |
| `--color-primary-700` | `#243c46` | Header hover states, footer background |
| `--color-primary-900` | `#0f1e24` | Footer deep background |
| `--color-accent-600` | `#c8352a` | Crimson phone button, sticky CTA bar, focus rings |
| `--color-accent-500` | `#d94434` | Button hover, focus-visible outline (already global) |
| `--color-neutral-900` | `#0d1417` | Footer text, wordmark color |
| `--color-background` | `#faf7f2` | Page background |
| `--color-overlay` | `rgba(13,20,23,0.6)` | Mobile menu backdrop |
| `--shadow-cta` | `0 4px 14px 0 rgb(200 53 42 / 0.35)` | Phone button shadow |
| `--shadow-nav` | `0 1px 0 0 rgb(0 0 0 / 0.08)` | Header bottom border |
| `--font-display` | `var(--font-display), 'Oswald'` | Nav links, phone button text |
| `--font-body` | `var(--font-body), 'Source Serif 4'` | Footer body copy |

Tailwind v4 class usage: `bg-primary-600`, `bg-accent-600`, `text-accent-500`, etc.
The `@theme` block maps custom tokens directly — no tailwind.config.js exists.

**Skip-to-main is already implemented** in globals.css and app/layout.tsx. The `.skip-to-main` class targets `#main-content`, which already exists in marketing layout. Phase 2 does NOT need to add this.

**focus-visible** is already globally configured in globals.css using `--color-accent-500`. Phase 2 components get this automatically — just don't override it.

---

### Content Exports Phase 2 Components Consume

**`src/content/site.ts`** — import `siteConfig`
- `siteConfig.phone.display` → `"(402) 885-1462"` — header button label
- `siteConfig.phone.href` → `"tel:+14028851462"` — all tel: links
- `siteConfig.phone.emergency` → `"(402) 885-1462 — 24/7"` — emergency pages
- `siteConfig.name` → `"Raptor Roofing"` — footer brand name, aria-labels
- `siteConfig.address.city/state/zip/full` — footer NAP
- `siteConfig.email` → footer contact
- `siteConfig.hours` → footer hours table (`BusinessHours[]` with `.closed` flag)
- `siteConfig.license.number/bonded/insured/displayText` → footer legal, TrustStrip
- `siteConfig.founding.yearsInBusiness` → TrustStrip "15 Years in Omaha"
- `siteConfig.reviews.count/rating` → TrustStrip "4.9★ · 127 reviews"
- `siteConfig.socialLinks.facebook/instagram/google` — footer social icons (all undefined/placeholder now)
- `siteConfig.certifications` → TrustStrip badges array
- `siteConfig.serviceAreas` → footer column 3 (plain string array)

**`src/content/service-areas.ts`** — import `serviceAreas` or `getPrimaryServiceAreas()`
- Footer col 3 should use `getPrimaryServiceAreas()` (returns 5 isPrimary=true areas)
- Each `ServiceArea` has `.name` and `.slug` for link paths like `/service-areas/${slug}`

**`src/content/services.ts`** — import `services`
- Footer col 2 services list uses `services.map(s => ({ shortTitle: s.shortTitle, slug: s.slug }))`
- 4 services: roofing, siding, gutters, emergency-tarping

**`src/lib/schema.tsx`** — import `{ JsonLd, localBusinessSchema }`
- `JsonLd` is a **Server Component** (renders `<script>` tag via dangerouslySetInnerHTML)
- `localBusinessSchema()` returns `WithContext<HomeAndConstructionBusiness>`
- Footer mounts: `<JsonLd data={localBusinessSchema()} />`
- CRITICAL: `JsonLd` must stay in a Server Component. Do not place inside a Client Component.

---

### Current Layout Wiring (marketing layout)

```
app/(marketing)/layout.tsx
├── <Header />           ← stub at src/components/stubs/Header.tsx
├── <main id="main-content">{children}</main>
├── <Footer />           ← stub at src/components/stubs/Footer.tsx
└── <StickyMobileCTA />  ← stub returns null
```

`TrustStrip` has NO stub and is NOT in the marketing layout — correct per CONTEXT.md (homepage-only slot).

---

### Installed Dependencies Relevant to Phase 2

- `lucide-react@^1.8.0` — icon library. Use for hamburger (Menu), close (X), phone (Phone), social icons (Facebook, Instagram, Star). Available icon names match lucide.dev.
- `next@16.2.3`, `react@19.2.4` — React 19 + Next 16 App Router
- `tailwindcss@^4` — CSS-first, no config file
- No animation library installed — transitions must use CSS/Tailwind utilities only

---

## Component Architecture Recommendations

### RSC vs Client Component Boundaries

**Rule:** Push `"use client"` as far down the tree as possible. The goal is one narrow Client Component for interactivity, everything else stays RSC.

#### Header — SPLIT: RSC shell + Client interactive island

```
Header (RSC — src/components/layout/Header.tsx)
└── NavLinks (RSC — static links, no state)
└── PhoneButton (RSC — anchor tag, no state)
└── MobileMenuButton (Client — src/components/layout/MobileMenuButton.tsx)
    └── MobileMenuOverlay (Client — same file or child, owns open/close state)
```

**Why split:** The hamburger button and full-screen overlay need `useState` for open/closed and a `useEffect` for scroll-lock and ESC key listener. The rest of the header (logo, nav links, phone button) is pure RSC.

**Scroll-lock implementation:** In the Client Component's effect, toggle `document.body.style.overflow = 'hidden'` when menu opens. Clean up on close and unmount. This does NOT require making the whole layout client-side.

**Sticky header:** CSS `position: sticky; top: 0; z-index: 50` — pure Tailwind, zero JS needed. Always opaque from load (CONTEXT decision) means no scroll listener required.

#### Footer — Pure RSC

All data comes from `siteConfig`, `getPrimaryServiceAreas()`, `services` — no interactivity. `JsonLd` server component renders inside Footer with no issues.

#### StickyMobileCTA — Client Component

Needs no state but uses `useEffect` to measure its own height and set `--sticky-cta-height` CSS variable on `:root` (for padding-bottom on layout). Alternatively: hardcode the height as a CSS custom property in globals.css and skip the measurement effect entirely (simpler, recommended).

#### TrustStrip — Pure RSC

Badge data from siteConfig. No interactivity. Rendered from homepage `page.tsx`, not from layout.

---

## Implementation Patterns

### Tailwind v4 Responsive Breakpoints

No config file — breakpoints are Tailwind defaults built-in:
- `sm`: 640px, `md`: 768px, `lg`: 1024px, `xl`: 1280px

**Desktop/mobile split pattern for header:**
```
<nav className="hidden lg:flex ...">   <!-- desktop nav -->
<button className="lg:hidden ...">    <!-- hamburger -->
```

Use `lg:` as the breakpoint — gives sufficient header space for logo + links + phone button without crowding.

### Sticky Header (CSS only)

```
<header className="sticky top-0 z-50 bg-primary-600 shadow-nav">
```

`z-50` = z-index 1000 in Tailwind v4 (maps to `z-index: 50` in CSS, but mobile overlay needs higher). Mobile overlay should use `z-[100]` or `z-[9999]` to sit above the sticky header.

**iOS Safari sticky gotcha:** `position: sticky` fails inside overflow:hidden containers. The marketing layout must NOT have `overflow: hidden` on the body or any ancestor of the header. Currently layout.tsx is clean — no overflow set.

### Full-Screen Mobile Overlay

Pattern: fixed overlay, full viewport, high z-index, fade in.

```
<div
  className="fixed inset-0 z-[100] bg-primary-900 flex flex-col p-6"
  role="dialog"
  aria-modal="true"
  aria-labelledby="mobile-nav-title"
>
```

The `inset-0` ensures coverage on all viewport sizes. `bg-primary-900` (`#0f1e24`) for dark overlay.

**Backdrop (semi-transparent dim behind overlay):** Given the menu IS the full-screen overlay, a separate backdrop is only needed if the menu doesn't cover full viewport. Per CONTEXT.md: full viewport overlay. No separate backdrop component needed — the overlay itself is the backdrop.

### Body Scroll-Lock

```typescript
// In MobileMenuButton Client Component
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none'; // iOS Safari
  } else {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }
  return () => {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  };
}, [isOpen]);
```

`touchAction: 'none'` prevents iOS Safari from scrolling the body behind the overlay.

### Sticky Mobile CTA Height Padding

**Recommended approach: CSS custom property in globals.css**

```css
/* in globals.css */
:root {
  --sticky-cta-height: 64px; /* adjust to actual rendered height */
}

/* Applied to marketing layout body padding */
```

In `app/(marketing)/layout.tsx`:
```
<main id="main-content" className="pb-[var(--sticky-cta-height)] md:pb-0">
```

The `md:pb-0` removes padding on tablet+ where the sticky CTA is hidden.

**Safe area inset for iPhone notch:**

```
<div className="fixed bottom-0 left-0 right-0 z-40 bg-accent-600
                pb-[env(safe-area-inset-bottom)]">
```

`env(safe-area-inset-bottom)` is CSS native — no Tailwind plugin needed. Tailwind v4 supports arbitrary CSS values with square bracket syntax. The bar's content padding should be separate from the safe-area padding so the crimson color extends behind the home indicator.

### tel: Link Pattern

```html
<a
  href="tel:+14028851462"
  aria-label="Call Raptor Roofing at (402) 885-1462"
  className="min-h-[48px] min-w-[48px] flex items-center justify-center"
>
  (402) 885-1462
</a>
```

Never use `siteConfig.phone.display` as the `href` — always use `siteConfig.phone.href` (`tel:+14028851462`).

### TrustStrip Slot Pattern (Homepage-Only)

**Correct pattern: render from page.tsx, not layout.**

```typescript
// src/app/(marketing)/page.tsx
import TrustStrip from "@/components/layout/TrustStrip";

export default function HomePage() {
  return (
    <>
      <TrustStrip />
      {/* hero section below */}
    </>
  );
}
```

This is the standard App Router approach — no layout slots, no parallel routes needed. TrustStrip simply sits as the first child of the homepage, above the hero. Service pages don't import it.

---

## Accessibility Requirements

### Mobile Menu Focus Trap

Requirements (WCAG 2.1 AA, CONTEXT.md marks ARIA as Claude's discretion):

1. When menu opens: move focus to first focusable element inside overlay (the X button or first nav link).
2. Tab and Shift+Tab must cycle only within the overlay while open.
3. ESC key closes the menu and returns focus to the hamburger button.
4. Implement with a manual focus trap effect — no external library needed for this simple case.

```typescript
// Focus trap pattern in Client Component
useEffect(() => {
  if (!isOpen) return;
  const focusableSelectors = 'a, button, [tabindex]:not([tabindex="-1"])';
  const container = overlayRef.current;
  if (!container) return;
  const focusables = Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
  focusables[0]?.focus();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { closeMenu(); hamburgerRef.current?.focus(); }
    if (e.key === 'Tab') {
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isOpen]);
```

### ARIA Attributes

**Mobile menu overlay:**
```
role="dialog"
aria-modal="true"
aria-labelledby="mobile-nav-heading"
```
Include a visually-hidden `<h2 id="mobile-nav-heading">Navigation</h2>` inside the overlay.

**Hamburger button:**
```
aria-expanded={isOpen}
aria-controls="mobile-nav-overlay"
aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
```

**Sticky CTA buttons:**
```
<a href="tel:+14028851462" aria-label="Call Raptor Roofing at (402) 885-1462">
<a href="#estimate-form" aria-label="Get a free roofing estimate">  <!-- homepage -->
<a href="/contact" aria-label="Get a free roofing estimate">         <!-- other pages -->
```

**Phone icon in collapsed mobile header:**
```
<a href="tel:+14028851462" aria-label="Call Raptor Roofing">
  <PhoneIcon aria-hidden="true" />
</a>
```

### Tap Target Sizes

CONTEXT.md requires 48x48px minimum. Pattern: wrap smaller icons in a `min-h-[48px] min-w-[48px] flex items-center justify-center` container.

The phone button in the desktop header is a full-width button with text — naturally meets 48px height with standard padding.

---

## Pitfalls to Avoid

### iOS Safari Sticky Header

1. **`overflow: hidden` on ancestor kills sticky.** Verify marketing layout and root layout have no `overflow: hidden`. Current layouts are clean but future developers could break this.
2. **`position: fixed` inside a `transform`ed ancestor breaks stacking context.** StickyMobileCTA uses `position: fixed` — ensure no ancestor has `transform`, `filter`, `perspective`, or `will-change` CSS applied.
3. **`-webkit-overflow-scrolling: touch` containers** on older iOS can trap sticky elements. Not in current codebase but warn if added.
4. **Address bar resize jitter:** On iOS, the address bar collapse changes `100vh`. Use `100dvh` (dynamic viewport height) for full-screen menu overlay instead of `100vh`.

### Mobile Menu Focus Management

1. **Don't rely on `autofocus` attribute** — inconsistent behavior across screen readers.
2. **`aria-modal="true"` alone does not trap focus** — requires JS focus trap implementation.
3. **Backdrop click must close menu** — CONTEXT.md specifies this. Since this is a full-screen overlay, "tap outside" means tapping the overlay itself outside the nav content area.

### JSON-LD in Client Components

`JsonLd` uses `dangerouslySetInnerHTML` which works in both RSC and Client Components, BUT:
- If Footer is accidentally marked `"use client"`, `JsonLd` still renders. However, it becomes part of the client bundle unnecessarily.
- Footer must remain RSC. If any Footer sub-component needs interactivity (e.g., social link tracking), extract that sub-component to its own `"use client"` file, not the whole Footer.

### Tailwind v4 Class Gotchas

1. **No `tailwind.config.js` `safelist`** — dynamic class strings like `` `bg-${color}-600` `` will be purged. All classes must appear as complete strings in source.
2. **`@apply` in v4 works differently** — for complex component styles, use CSS classes in globals.css with `@apply` rather than inline Tailwind strings, if needed. But for these components, inline Tailwind is fine.
3. **`env()` in Tailwind v4 arbitrary values:** Use `pb-[env(safe-area-inset-bottom)]`. Verified working syntax in v4.

### StickyMobileCTA Coverage Overlap

Without padding-bottom on `<main>`, the last content element on any page will be hidden under the 64px sticky bar on mobile. Apply `pb-[var(--sticky-cta-height)]` to `<main>` in the marketing layout, and set the CSS variable in globals.css.

---

## Recommended File Structure

```
src/components/
└── layout/
    ├── Header.tsx              # RSC shell — logo, desktop nav, phone button
    ├── MobileMenuButton.tsx    # "use client" — hamburger + full-screen overlay
    ├── Footer.tsx              # RSC — NAP, hours, links, schema anchor
    ├── StickyMobileCTA.tsx     # "use client" — bottom fixed bar, mobile only
    └── TrustStrip.tsx          # RSC — badge row, rendered from page.tsx
```

**No barrel export (index.ts) needed for Phase 2.** Import directly by path. Barrel exports add complexity and can defeat tree-shaking.

**Stub removal:** Phase 2 replaces imports in `app/(marketing)/layout.tsx`:
- `@/components/stubs/Header` → `@/components/layout/Header`
- `@/components/stubs/Footer` → `@/components/layout/Footer`
- `@/components/stubs/StickyMobileCTA` → `@/components/layout/StickyMobileCTA`

The stub files in `src/components/stubs/` can be deleted after replacement.

**TrustStrip** is imported in `src/app/(marketing)/page.tsx` only — not in layout.

---

## Open Questions for Planner

1. **`Free Estimate` button behavior on non-homepage pages:** CONTEXT.md says "links to /contact elsewhere." The `/contact` route does not exist yet (Phase 4 or 5). Plan must decide: use `href="/contact"` and accept 404 until that phase, or use `href="/#estimate-form"` as a fallback on all pages until contact page exists.

2. **Services nav link target:** CONTEXT.md says "Services is a single link" in Phase 2. Should it link to `/services` (does not exist until Phase 4) or `/#services` (scroll anchor on homepage)? Plan should specify the `href` value to use so it doesn't break until Phase 4.

3. **Stub file cleanup:** Should `src/components/stubs/` be deleted as part of Phase 2 plan, or left for potential future stub use?

4. **Header height as CSS variable:** The sticky CTA padding relies on knowing the sticky CTA height. For `--sticky-cta-height`, should the plan hardcode a value in globals.css (simpler), or use a measurement effect in the Client Component (more accurate but adds JS)?

---

## Sources

### Primary (HIGH confidence)
- Direct file reads: `src/content/site.ts`, `src/content/service-areas.ts`, `src/content/services.ts`, `src/lib/schema.tsx`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/(marketing)/layout.tsx`, `src/components/stubs/*`, `package.json`
- Next.js 16 App Router RSC/Client boundary patterns — verified against Next.js docs knowledge
- Tailwind v4 CSS-first config patterns — verified against project's existing globals.css usage
- WCAG 2.1 AA focus trap and ARIA dialog patterns — standard, verified

### Secondary (MEDIUM confidence)
- iOS Safari sticky + fixed positioning caveats — well-documented browser behavior
- `env(safe-area-inset-bottom)` in Tailwind v4 arbitrary value syntax — consistent with v4 syntax rules

---

## Metadata

**Confidence breakdown:**
- Existing project surface: HIGH — all from direct file reads
- Component architecture: HIGH — based on actual project constraints
- Tailwind v4 patterns: HIGH — globals.css already demonstrates v4 usage
- Accessibility patterns: HIGH — WCAG standard patterns
- iOS Safari pitfalls: MEDIUM — browser behavior, well-known but not formally verified against current Safari

**Research date:** 2026-04-13
**Valid until:** 2026-07-13 (stable stack — Next 16, Tailwind v4, React 19)
