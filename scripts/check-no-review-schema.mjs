#!/usr/bin/env node
// Regression guard: no Review or AggregateRating JSON-LD may ship while
// placeholder testimonials exist. See .planning/phases/06-seo-performance-accessibility/06-CONTEXT.md
// "Schema + FTC/placeholder handling".
//
// Usage:
//   npm run check:schema
//   node scripts/check-no-review-schema.mjs
//
// Exit 0 = clean (safe to ship)
// Exit 1 = forbidden schema found (block commit/deploy)
//
// To add to a pre-commit hook later:
//   echo "npm run check:schema" >> .husky/pre-commit

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const SOURCE_DIR = "src";

// Forbidden patterns — checked against non-comment lines in .ts / .tsx files
const FORBIDDEN = [
  { label: "Review JSON-LD",          regex: /"@type"\s*:\s*"Review"/ },
  { label: "AggregateRating JSON-LD", regex: /"@type"\s*:\s*"AggregateRating"/ },
  { label: "reviewBody field",        regex: /reviewBody/ },
  { label: "itemReviewed field",      regex: /itemReviewed/ },
];

/** Recursively collect all .ts / .tsx files under a directory */
function collectFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      collectFiles(full, files);
    } else if (stat.isFile() && [".ts", ".tsx"].includes(extname(entry))) {
      files.push(full);
    }
  }
  return files;
}

/** Return true if a source line is a comment (leading // * or /* after trim) */
function isCommentLine(line) {
  const trimmed = line.trim();
  return (
    trimmed.startsWith("//") ||
    trimmed.startsWith("*") ||
    trimmed.startsWith("/*")
  );
}

let failed = false;
const allFiles = collectFiles(SOURCE_DIR);

for (const file of allFiles) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isCommentLine(line)) continue; // skip comment-only lines

    for (const { label, regex } of FORBIDDEN) {
      if (regex.test(line)) {
        console.error(`\n[FAIL] FORBIDDEN SCHEMA FOUND -- ${label}:`);
        console.error(`   ${file}:${i + 1}: ${line.trim()}`);
        failed = true;
      }
    }
  }
}

if (failed) {
  console.error(
    "\nThese schema types must NOT be emitted while placeholder testimonials exist."
  );
  console.error(
    "See .planning/phases/06-seo-performance-accessibility/06-CONTEXT.md > Schema + FTC handling."
  );
  console.error(
    "When real customer reviews are verified and FTC-compliant, remove this guard and re-enable aggregateRating."
  );
  process.exit(1);
}

console.log("[OK] check-no-review-schema: no Review/AggregateRating JSON-LD emitted");
