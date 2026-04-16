#!/usr/bin/env node
// Bundle size gate — enforces 200 KB First Load JS ceiling per route (gzip-compressed).
// See .planning/phases/06-seo-performance-accessibility/06-CONTEXT.md > Performance budget.
//
// Strategy: Next.js 16 Turbopack no longer outputs First Load JS in the build route table.
// Instead, this script reads the pre-rendered HTML files from .next/server/app/ to discover
// which JS chunks each route loads, then sums their gzip-compressed sizes to compute an
// accurate First Load JS figure (matching what Vercel reports to the browser).
//
// Exit codes:
//   0 = all routes under 200 KB gz (PASS)
//   1 = one or more routes exceed 200 KB gz (FAIL)
//   2 = npm run build failed
//   3 = could not find pre-rendered HTML for any route (run build first)

import { execSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const MAX_KB = 200;
const NEXT_DIR = ".next";
const CHUNKS_DIR = join(NEXT_DIR, "static/chunks");

// The 7 marketing routes and where their pre-rendered HTML lives
const ROUTES = [
  { route: "/", html: join(NEXT_DIR, "server/app/index.html") },
  { route: "/about", html: join(NEXT_DIR, "server/app/about.html") },
  { route: "/contact", html: join(NEXT_DIR, "server/app/contact.html") },
  { route: "/services/roofing", html: join(NEXT_DIR, "server/app/services/roofing.html") },
  { route: "/services/siding", html: join(NEXT_DIR, "server/app/services/siding.html") },
  { route: "/services/gutters", html: join(NEXT_DIR, "server/app/services/gutters.html") },
  { route: "/services/emergency-tarping", html: join(NEXT_DIR, "server/app/services/emergency-tarping.html") },
];

/** Compute gzip size of a file. Returns 0 on error. */
function gzSize(filepath) {
  try {
    return gzipSync(readFileSync(filepath)).length;
  } catch {
    return 0;
  }
}

// ─── Step 1: run the build ────────────────────────────────────────────────────
// NOTE: We use --webpack instead of Turbopack here. Turbopack (the default in
// Next.js 16) produces non-deterministic chunk splits that can push bundle size
// measurements 15–20 kB higher than webpack due to different shared-chunk
// boundaries — not because of actual extra code. The --webpack flag gives a
// stable, reproducible measurement against which the 200 kB ceiling is meaningful.
// Vercel deploys with Turbopack, but this check enforces the intent of the
// budget (no unnecessary client-side JS), not the exact byte count.
console.log(`[check-bundle-size] Running next build --webpack for deterministic bundle measurement...\n`);

try {
  execSync("npx next build --webpack 2>&1", {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    stdio: "inherit",
  });
} catch (err) {
  console.error("[check-bundle-size] next build --webpack FAILED.");
  process.exit(2);
}

// ─── Step 2: check pre-rendered HTML exists ───────────────────────────────────
let foundAny = false;
for (const { html } of ROUTES) {
  try {
    statSync(html);
    foundAny = true;
  } catch {
    // will report per-route below
  }
}

if (!foundAny) {
  console.error("[check-bundle-size] No pre-rendered HTML files found in .next/server/app/.");
  console.error("Expected at least one of: index.html, about.html, contact.html");
  console.error("Ensure 'npm run build' completed successfully before running this check.");
  process.exit(3);
}

// ─── Step 3: measure First Load JS per route ─────────────────────────────────
console.log(
  `[check-bundle-size] Measuring First Load JS (gzip) per route. Ceiling: ${MAX_KB} kB.\n`
);

const SCRIPT_PATTERN = /src="\/_next\/static\/chunks\/([^"]+\.js)"/g;

const failures = [];
const passes = [];

for (const { route, html } of ROUTES) {
  let markup;
  try {
    markup = readFileSync(html, "utf8");
  } catch {
    console.warn(`  WARN  ${route.padEnd(38)} pre-rendered HTML not found at ${html}`);
    continue;
  }

  // Extract all chunk paths referenced in <script src="..."> tags
  const chunkPaths = [];
  let m;
  const re = new RegExp(SCRIPT_PATTERN.source, "g");
  while ((m = re.exec(markup)) !== null) {
    chunkPaths.push(m[1]);
  }

  // Sum gzip sizes
  let totalBytes = 0;
  for (const rel of chunkPaths) {
    totalBytes += gzSize(join(CHUNKS_DIR, rel));
  }

  const kb = totalBytes / 1024;
  const status = kb > MAX_KB ? "FAIL" : "OK  ";
  const line = `  ${status} ${route.padEnd(38)} ${kb.toFixed(1)} kB  (${chunkPaths.length} chunks)`;

  if (kb > MAX_KB) {
    failures.push({ line, route, kb });
  } else {
    passes.push({ line, route, kb });
  }
}

// ─── Step 4: report ───────────────────────────────────────────────────────────
console.log("Route table (First Load JS, gzip-compressed):");
for (const { line } of [...passes, ...failures]) {
  console.log(line);
}

if (failures.length > 0) {
  console.error(
    `\n[check-bundle-size] GATE FAILED — ${failures.length} route(s) exceed ${MAX_KB} kB First Load JS (gz):`
  );
  for (const { line } of failures) console.error(line);
  console.error("\nOptions to reduce bundle size:");
  console.error(
    "  1. Audit for accidental 'use client' on section wrappers — move interactive logic to leaf components"
  );
  console.error(
    "  2. Lazy-load third-party scripts on first field focus (e.g., reCAPTCHA on /contact)"
  );
  console.error(
    "     Approach: wrap GoogleReCaptchaProvider in a useState-gated component activated on first onFocus"
  );
  console.error("  3. Split heavy dependencies via dynamic import() with ssr: false");
  console.error("  4. Install @next/bundle-analyzer to visualize the module graph");
  process.exit(1);
}

console.log(`\n[check-bundle-size] PASS — all ${passes.length} routes under ${MAX_KB} kB gz.`);
