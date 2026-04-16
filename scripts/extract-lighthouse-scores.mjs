#!/usr/bin/env node
// Extract Lighthouse scores from all *.report.json files in the reports dir.
// Deterministic — reads JSON directly from lhr.categories, no grep on HTML, no stdin piping.
// Usage: node scripts/extract-lighthouse-scores.mjs
//
// Exit codes:
//   0 = all routes pass gate (every pillar ≥ 90)
//   1 = gate failed (one or more routes have a pillar < 90)
//   2 = no report JSON files found
//   3 = JSON parse error
//   4 = missing expected category in a report

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPORTS_DIR =
  ".planning/phases/06-seo-performance-accessibility/lighthouse-reports";
const PILLARS = ["performance", "accessibility", "best-practices", "seo"];
const GATE = 90;

// ─── Find JSON reports ────────────────────────────────────────────────────────
let files;
try {
  files = readdirSync(REPORTS_DIR)
    .filter((f) => f.endsWith(".report.json"))
    .sort();
} catch (err) {
  console.error(`[extract-scores] Could not read reports directory: ${REPORTS_DIR}`);
  console.error(`Error: ${err.message}`);
  console.error("Run the Lighthouse sweep first (Task 3 Step 3).");
  process.exit(2);
}

if (files.length === 0) {
  console.error(`[extract-scores] No *.report.json files found in ${REPORTS_DIR}`);
  console.error("Run the Lighthouse sweep first (Task 3 Step 3).");
  process.exit(2);
}

console.log(
  `[extract-scores] Reading ${files.length} Lighthouse JSON report(s) from ${REPORTS_DIR}\n`
);

// ─── Parse each report ────────────────────────────────────────────────────────
const rows = [];
let failCount = 0;

for (const file of files) {
  const raw = readFileSync(join(REPORTS_DIR, file), "utf8");
  let lhr;
  try {
    lhr = JSON.parse(raw);
  } catch (err) {
    console.error(`[extract-scores] Could not parse ${file}: ${err.message}`);
    process.exit(3);
  }

  // Strip the "lighthouse-" prefix and ".report.json" suffix for a clean label
  const routeLabel = file
    .replace(/^lighthouse-/, "")
    .replace(/\.report\.json$/, "");

  const scores = {};
  for (const pillar of PILLARS) {
    const cat = lhr.categories?.[pillar];
    if (!cat || cat.score == null) {
      console.error(
        `[extract-scores] ${file} is missing category "${pillar}". ` +
          `Ensure you used --only-categories=performance,accessibility,best-practices,seo when running Lighthouse.`
      );
      process.exit(4);
    }
    scores[pillar] = Math.round(cat.score * 100);
  }

  const allPass = PILLARS.every((p) => scores[p] >= GATE);
  if (!allPass) failCount++;

  rows.push({ route: routeLabel, ...scores, status: allPass ? "PASS" : "FAIL" });
}

// ─── Print markdown table ─────────────────────────────────────────────────────
const tableHeader =
  "| Route | Performance | Accessibility | Best Practices | SEO | Status |";
const tableDivider = "|---|---|---|---|---|---|";
const tableRows = rows.map(
  (r) =>
    `| ${r.route} | ${r.performance} | ${r.accessibility} | ${r["best-practices"]} | ${r.seo} | ${r.status} |`
);

console.log(tableHeader);
console.log(tableDivider);
for (const row of tableRows) {
  console.log(row);
}
console.log("");

// ─── Gate result ─────────────────────────────────────────────────────────────
if (failCount > 0) {
  console.error(
    `[extract-scores] GATE FAILED — ${failCount} of ${rows.length} route(s) have at least one pillar below ${GATE}.`
  );
  console.error("Failing routes:");
  for (const r of rows.filter((r) => r.status === "FAIL")) {
    const pillarsBelow = PILLARS.filter((p) => r[p] < GATE);
    console.error(
      `  ${r.route}: ${pillarsBelow.map((p) => `${p}=${r[p]}`).join(", ")}`
    );
  }
  process.exit(1);
}

console.log(
  `[extract-scores] GATE PASSED — all ${rows.length} routes have every pillar ≥ ${GATE}.`
);
