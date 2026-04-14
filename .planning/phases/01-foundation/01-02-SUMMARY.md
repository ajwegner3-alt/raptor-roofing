---
plan_id: 01-02
phase: 1
plan: 2
subsystem: content-data
completed: 2026-04-14
duration: ~18 min
tags: [typescript, content, data-layer, FTC-compliance, schema-dts]

dependency_graph:
  requires: ["01-01"]
  provides: ["src/content/*"]
  affects: ["01-03", "02-*", "03-*", "04-*", "05-*", "06-*"]

tech_stack:
  added: []
  patterns:
    - "Typed content data files as single source of truth for all Raptor data"
    - "PLACEHOLDER comment convention for handoff audit (grep-findable via 'PLACEHOLDER:')"
    - "isPlaceholder boolean field for FTC-compliant testimonial rendering"

key_files:
  created:
    - src/content/site.ts
    - src/content/services.ts
    - src/content/testimonials.ts
    - src/content/faqs.ts
    - src/content/service-areas.ts
  modified:
    - src/lib/schema.tsx  # Rule 1 bug fix: DayOfWeek type cast

decisions:
  - "Followed RESEARCH.md §4-§8 verbatim — no improvisation on content"
  - "Testimonials use FTC block comment convention (not per-field PLACEHOLDER tags)"
  - "service-areas.ts includes Ralston instead of Sarpy County (per research §8)"
  - "schema.tsx DayOfWeek fix: cast h.day as DayOfWeek (short form accepted by schema-dts)"
---

# Phase 1 Plan 02: Content Data Files Summary

**One-liner:** Five strongly-typed `src/content/*.ts` data files with 22 PLACEHOLDER audit tags and 6 FTC-flagged testimonials, all verified via cross-file aggregator typecheck.

---

## Execution Summary

All 5 content data files created from RESEARCH.md §4–§8 verbatim. Every unverified Raptor-specific value is tagged `// PLACEHOLDER:` for the Phase 8 handoff audit. All 6 testimonials carry `isPlaceholder: true` for FTC compliance rendering in Phase 5.

---

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create site.ts with SiteConfig type and Raptor data | 10bca9e | src/content/site.ts |
| 2a | Create services.ts with 4 service entries | e8cf817 | src/content/services.ts |
| 2b | Create faqs.ts with 10 FAQs | 9c7eec5 | src/content/faqs.ts |
| 2c | Create service-areas.ts with 8 Omaha metro entries | e5c2237 | src/content/service-areas.ts |
| 3 | Create testimonials.ts with 6 FTC-flagged placeholders | ea52369 | src/content/testimonials.ts |
| 4 | Cross-file aggregator typecheck + cleanup | (no commit needed) | __typecheck.ts created and deleted |

---

## PLACEHOLDER Tag Counts (for handoff audit)

| File | PLACEHOLDER count |
|------|-------------------|
| src/content/site.ts | 17 |
| src/content/services.ts | 5 |
| src/content/testimonials.ts | 0 (uses FTC block comment) |
| src/content/faqs.ts | 0 |
| src/content/service-areas.ts | 0 |
| **Total** | **22** |

**Key placeholders requiring Raptor confirmation before launch:**
- `siteConfig.address.street` — actual street address unknown
- `siteConfig.address.zip` — confirm ZIP code
- `siteConfig.email` — confirm contact email (currently `info@raptorroofingllc.com`)
- `siteConfig.license.number` — NE contractor license number
- `siteConfig.reviews.count` and `.rating` — verify against live GBP (currently 127 / 4.9)
- `siteConfig.socialLinks.google` — confirm GBP URL
- `siteConfig.certifications` — confirm GAF Certified and Owens Corning Preferred status
- `services[*].heroImagePath` — all 4 service hero images need real photos (Phase 3)

---

## FTC Compliance Confirmation

**All 6 testimonial entries have `isPlaceholder: true`:**

| ID | Name | City | Service | isPlaceholder |
|----|------|------|---------|---------------|
| t1 | Mike T. | Papillion | roofing | true |
| t2 | Sandra K. | Elkhorn | roofing | true |
| t3 | Dave R. | Millard | emergency-tarping | true |
| t4 | Jennifer M. | La Vista | siding | true |
| t5 | Tom B. | Bellevue | gutters | true |
| t6 | Carol H. | Omaha | roofing | true |

FTC block comment at top of testimonials.ts reads:
> "All entries below are PLACEHOLDER content. isPlaceholder: true triggers a visible amber warning banner in the UI. These MUST be replaced with real customer testimonials before public launch."

---

## Aggregator Typecheck Confirmation

Created `src/content/__typecheck.ts` using `satisfies` operator to verify:
- `siteConfig satisfies SiteConfig` — PASS
- `services satisfies Service[]` — PASS
- `testimonials satisfies Testimonial[]` — PASS
- `faqs satisfies FAQ[]` — PASS
- `serviceAreas satisfies ServiceArea[]` — PASS
- `BusinessHours` type import resolved — PASS

Aggregator deleted after verification. Final `npx tsc --noEmit` exits 0.

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed schema.tsx DayOfWeek type error blocking typecheck**

- **Found during:** Task 3 verification (typecheck gate)
- **File affected:** `src/lib/schema.tsx` (created by 01-03 wave)
- **Issue:** `openingHoursSpecification.dayOfWeek` was typed as `\`https://schema.org/${string}\`` template literal, which is not assignable to schema-dts `SchemaValue<DayOfWeek|IdReference>`. Also `"@type": "OpeningHoursSpecification"` lacked `as const` making it `string` type.
- **Fix:** Added `DayOfWeek` to schema-dts imports, cast `h.day as DayOfWeek` (schema-dts accepts short form "Monday"), added `as const` to `"@type"` field.
- **Commit:** b6321bb

**2. [Rule 3 - Blocking] Cleared stale `.next` cache that blocked initial typecheck**

- **Found during:** Task 2 first typecheck
- **Issue:** `.next/types/validator.ts` referenced `../../src/app/page.js` which no longer exists at that path (moved to `(marketing)/` in 01-01)
- **Fix:** `rm -rf .next` — stale Next.js type cache cleared
- **Impact:** None — `.next` is gitignored and regenerates on next `next build`

---

## Handoff Note for 01-03

Service and FAQ types are now importable from `@/content/services` and `@/content/faqs`. The schema.ts factories in `src/lib/schema.tsx` already import them correctly:

```typescript
import type { Service } from "@/content/services";
import type { FAQ } from "@/content/faqs";
```

Both type imports resolve cleanly as confirmed by the aggregator typecheck.

---

## Next Phase Readiness

Plan 01-02 is **complete**. No blockers for downstream phases.

All 5 content files are available for:
- Plan 01-03: `src/lib/schema.ts` factories (already consuming Service and FAQ types)
- Phase 2: Component library (Header, Footer, ServiceCard will import from content layer)
- Phase 3: Homepage assembly
- Phase 4: Individual service page generation from `services` array
- Phase 8: Handoff audit via `grep -r 'PLACEHOLDER:' src/content/`
