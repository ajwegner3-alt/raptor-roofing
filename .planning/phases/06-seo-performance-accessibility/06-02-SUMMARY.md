---
phase: 06-seo-performance-accessibility
plan: 02
subsystem: testing
tags: [json-ld, schema-org, regression-guard, nodejs, esm, faq-compliance, ftc]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: src/lib/schema.tsx with commented-out aggregateRating block
provides:
  - scripts/check-no-review-schema.mjs — Node ESM guard that catches Review/AggregateRating JSON-LD emission
  - npm run check:schema — runnable verification command
affects: [phase-08-handoff, phase-07-deploy, any future plan touching schema.tsx or testimonials]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Node ESM fs/path builtins for cross-platform grep (avoids shell quoting issues with embedded double-quotes)"
    - "Comment-line filter: skip lines where trimmed content starts with //, *, or /*"

key-files:
  created:
    - scripts/check-no-review-schema.mjs
  modified:
    - package.json

key-decisions:
  - "Use Node fs/path builtins instead of execSync+grep — eliminates shell-quoting fragility when pattern contains double-quotes"
  - "Guard does NOT chain into build or lint automatically — runs as an explicit manual check per plan spec (YAGNI for husky hooks)"
  - "Exit 0 = clean, exit 1 = forbidden schema found — same convention as lint/type-check scripts"

patterns-established:
  - "Regression guard pattern: Node ESM script + npm script entry + comment-line filter for false-positive prevention"

# Metrics
duration: 12min
completed: 2026-04-15
---

# Phase 06 Plan 02: Schema Regression Guard Summary

**Node ESM regression guard (scripts/check-no-review-schema.mjs + npm run check:schema) that catches Review/AggregateRating JSON-LD emission on non-comment lines across all src/ TypeScript files**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-04-15T00:00:00Z
- **Completed:** 2026-04-15T00:12:00Z
- **Tasks:** 2 (Task 1 read-only, Task 2 created files + committed)
- **Files modified:** 2

## Accomplishments

- Task 1 (read-only): Confirmed src/lib/schema.tsx has aggregateRating inside comment block only; TestimonialCarousel.tsx is UI-only with zero JSON-LD emission; Footer.tsx mounts only localBusinessSchema() which is clean; zero `reviewBody`/`itemReviewed` matches across all of src/
- Task 2: Created scripts/check-no-review-schema.mjs using Node fs/path builtins (not execSync+grep) — avoids shell-quoting fragility with double-quote-containing patterns; added npm run check:schema to package.json
- Verified guard exits 0 on clean codebase, exits 1 with clear error message when injected regression is present, exits 0 again after test file removed; full build still succeeds

## Task 1 Verification Results

All greps executed against `src/`:

| Pattern | Result |
|---------|--------|
| `"@type": "Review"` | Zero matches |
| `"@type": "AggregateRating"` | One match in schema.tsx:87 — inside `//` comment block only |
| `aggregateRating` (any) | Two matches in schema.tsx:85-86 — both inside `//` comment lines |
| `reviewBody` | Zero matches |
| `itemReviewed` | Zero matches |
| `JsonLd` in TestimonialCarousel.tsx | Zero matches — UI-only component confirmed |

Codebase is clean. The CONTEXT.md lock ("zero Review JSON-LD + add regression grep") is satisfied.

## Task Commits

Each task was committed atomically:

1. **Task 1: Verify schema.tsx still has aggregateRating commented out** - read-only pass, no commit (per plan spec: "Task 1 commit: only if you make edits")
2. **Task 2: Write scripts/check-no-review-schema.mjs and wire into package.json** - `5ae4f24` (feat)

**Plan metadata:** committed with this summary

## Files Created/Modified

- `scripts/check-no-review-schema.mjs` — Node ESM regression guard; walks src/ recursively, tests each non-comment line against four forbidden regexes, exits 1 if any match found
- `package.json` — Added `"check:schema": "node scripts/check-no-review-schema.mjs"` to scripts block

## How to Run the Guard

```bash
npm run check:schema
# Expected: "[OK] check-no-review-schema: no Review/AggregateRating JSON-LD emitted"
# Failure: "[FAIL] FORBIDDEN SCHEMA FOUND -- Review JSON-LD: ..." with exit code 1
```

## How to Add to a Pre-Commit Hook Later

When Husky is added (Phase 8 or beyond):

```bash
echo "npm run check:schema" >> .husky/pre-commit
```

Do NOT implement this now — YAGNI at current project scale per plan spec.

## Decisions Made

- **fs/path builtins over execSync+grep:** The grep-based approach (from plan template) failed because the patterns contain double-quotes (`"@type"`) — interpolating them into a shell command string broke the grep invocation. Rewrote using Node's native `fs.readdirSync` + `fs.readFileSync` + regex, which is shell-quoting-free and equally readable. This is a Rule 1 bug fix (the plan's provided grep-string approach produced false negatives on the exact patterns it needed to catch).
- **Guard not chained into build/lint:** Per plan spec — runs as explicit `npm run check:schema`. No husky hooks added.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Replaced execSync+grep with Node fs/path builtins**
- **Found during:** Task 2 — verify step (regression injection test)
- **Issue:** The plan's template code used `execSync(`grep ... "${pattern}" src/`)`. When the pattern contains literal double-quotes (e.g., `"@type":\s*"Review"`), the double-quotes inside the shell string break the grep invocation — the shell strips them, producing a malformed pattern. The guard ran "successfully" but returned no matches even when forbidden schema was present (false negative — the worst possible failure mode for a security/compliance guard).
- **Fix:** Rewrote entirely using `fs.readdirSync` + `fs.readFileSync` + JavaScript `RegExp.test()`. No shell involvement, no quoting issues. Logic is identical: collect .ts/.tsx files, skip comment lines, test each code line against forbidden regexes, exit 1 on any match.
- **Files modified:** scripts/check-no-review-schema.mjs
- **Verification:** Injected `const test = { "@type": "Review" };` into src/_schema_guard_test.tsx — guard exited 1 with correct error. Removed file — guard exited 0.
- **Committed in:** 5ae4f24 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — Bug)
**Impact on plan:** Critical fix — the original shell-based approach produced false negatives on the exact pattern it needed to catch. Node-native rewrite delivers correct behavior with no scope creep.

## Issues Encountered

- execSync+grep approach in the plan's template code failed silently when patterns contained embedded double-quotes — detected immediately during regression injection test, fixed inline per Rule 1.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Phase 6 can continue: check:schema guard is wired and confirmed working
- Phase 8 handoff: before enabling real Review/AggregateRating schema (after real customer reviews are FTC-verified), run `npm run check:schema` to confirm the guard triggers, then remove or update the guard
- No blockers for 06-03 or any remaining Phase 6 plans

---
*Phase: 06-seo-performance-accessibility*
*Completed: 2026-04-15*
