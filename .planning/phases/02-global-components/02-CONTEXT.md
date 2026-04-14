# Phase 2: Global Components - Context

**Gathered:** 2026-04-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Build four persistent marketing-chrome components — `Header`, `Footer`, `StickyMobileCTA`, `TrustStrip` — and wire them into `app/(marketing)/layout.tsx`. These components appear on every marketing page and establish the "production-ready" look with visible phone, trust signals, and correct NAP from the first deploy forward.

Scope is the components themselves and their layout wiring. Homepage composition, service pages, and lead form UX belong to later phases.

</domain>

<decisions>
## Implementation Decisions

### Header anatomy

- **Desktop nav links:** `Services`, `About`, `Contact` — minimal 3-link nav. No dropdown in Phase 2; Services is a single link to a services index (or the homepage services section) until Phase 4 adds the real service pages.
- **Phone treatment:** Large filled crimson button on the right side of the header showing the full phone number as a `tel:` link. This is the loudest element in the header — hardest to miss on desktop.
- **Scroll behavior:** Static height, always opaque. No shrinking, no transparent-over-hero fade. Header renders with a solid slate-teal background from load so there's zero layout shift risk.
- **Logo area:** Full Raptor logo mark + "Raptor Roofing" wordmark side-by-side on the left. No tagline in the logo area (positioning lives in hero copy).
- **Sticky:** Yes — the header remains pinned to the top of the viewport at all times and the phone number must stay visible while scrolling (roadmap success criterion #2).

### Mobile nav pattern

- **Menu style:** Full-screen overlay. Tapping the hamburger opens a menu that covers the entire viewport so the nav links are large, tappable, and impossible to misfire.
- **Collapsed mobile header bar:** Shows three elements — logo on the left, phone icon (tappable `tel:` link, 48×48px target) in the middle-right, hamburger on the far right. The phone icon is independent of the hamburger so one-tap calling never requires opening the menu.
- **Open menu contents:** Nav links (Services, About, Contact) at the top, a prominent crimson "Call Now" button below the links, then a small trust mini-badges row ("Licensed · Insured · 15 Years") at the bottom. Trust reinforcement happens even mid-navigation.
- **Backdrop behavior:** Overlay with a dim semi-transparent backdrop over the page. Tapping the backdrop (or an X button) closes the menu. Page content stays where it was — no push/shift animation.

### Sticky mobile CTA

- **Buttons:** Dual — "Call Now" (tel:) and "Free Estimate" side-by-side as equal-weight buttons. Free Estimate scrolls to the homepage lead form on the homepage and links to `/contact` on all other pages.
- **Visibility trigger:** Always visible on mobile from the moment the page loads. We accept the ~64px of permanent bottom screen real estate as the cost of maximum conversion coverage.
- **Visual treatment:** Solid crimson background bar with white button text. Loudest option — this is the money-maker for mobile and should be unmissable.
- **Page coverage:** Shows on every marketing page (homepage, all service pages, about, contact). No per-page exclusions in Phase 2 — if we decide later that contact needs to suppress it, that's a one-line change.
- **Layout safety:** Must pad `main` or the layout body by the sticky CTA height so no content is hidden underneath it on mobile.

### Footer + TrustStrip

- **TrustStrip location:** Below the header and above the hero on the homepage only. Service pages, About, and Contact do NOT render the TrustStrip (Phase 2 wires it so it can be slotted per-page rather than unconditionally in the marketing layout).
- **TrustStrip badges (5 items):** Reviews ("4.9★ · 127 reviews" with [PLACEHOLDER] label), License ("Licensed NE #[PLACEHOLDER]"), Bonded & Insured, 15 Years in Omaha, GAF / Owens Corning Certified. Horizontal row on desktop, wrap-or-scroll on mobile.
- **Footer structure:** 4-column rich footer on desktop; stacks vertically on mobile.
  - Column 1: NAP (business name, address, phone as tel:) + business hours
  - Column 2: Services list (Roofing, Siding, Gutters, Emergency Tarping) — links are placeholder anchors in Phase 2, real paths in Phase 4
  - Column 3: Service areas list (from `src/content/service-areas.ts`)
  - Column 4: Legal + social (license, insurance statement, BBB logo, privacy link, social icons)
- **Required trust/legal items in footer:** NE License # (placeholder line, clearly labeled), "Bonded & Insured" statement, BBB logo/badge, copyright line with current year.
- **Schema anchor:** Footer is the mounting point for the `LocalBusiness` JSON-LD via `<JsonLd data={localBusinessSchema()} />` from `@/lib/schema` — so every marketing page inherits the schema automatically through the layout.

### Claude's Discretion

- Exact pixel heights, padding, and typographic scale for header and footer
- Animation details (menu open/close transitions, focus ring styling)
- How the 5-badge TrustStrip wraps on narrow mobile widths (horizontal scroll vs 2-row wrap)
- Hamburger → X icon transition
- Hover/focus states for nav links and buttons
- ARIA labelling details for the mobile menu, sticky CTA, and tel: links (must meet a11y bar but exact wording is Claude's call)

</decisions>

<specifics>
## Specific Ideas

- Trust-reinforcement pattern inside mobile menus is deliberate: Andrew wants visitors to re-encounter "Licensed · Insured · 15 Years" even while navigating, not just on content pages.
- Phone number must be reachable in one tap from any mobile screen state: collapsed header (phone icon), open menu (Call Now button), bottom of viewport (sticky CTA). Three redundant paths to a call.
- Header uses slate-teal as its solid background so the crimson phone button pops against it — this is the primary color contrast pair for the brand.
- TrustStrip is homepage-only because on service pages the hero itself will carry service-specific trust copy; a second trust row would crowd the layout.

</specifics>

<deferred>
## Deferred Ideas

- **Services dropdown on desktop header** — Deferred to Phase 4 when the four service pages exist. Phase 2 ships with a flat "Services" link.
- **Per-page suppression of sticky mobile CTA** (e.g., hide on /contact) — Can be added later as a one-line prop if it becomes a problem; not needed for Phase 2.
- **Top utility bar** (tiny strip above the main header with hours or address) — Not in Phase 2 scope; would be its own decision later.
- **Reviews count placeholder** (4.9★ · 127 reviews) — Real number TBD, must carry [PLACEHOLDER] label per project FTC rules. Resolution lives in the Phase 8 handoff audit.
- **License number** — Real NE contractor license # still unknown; Phase 2 uses the [PLACEHOLDER] line already captured in `site.ts`.
- **BBB accreditation** — If Raptor is NOT BBB-accredited, the BBB logo must be swapped for a different trust element at handoff. Flag in HANDOFF.md.

</deferred>

---

*Phase: 02-global-components*
*Context gathered: 2026-04-14*
