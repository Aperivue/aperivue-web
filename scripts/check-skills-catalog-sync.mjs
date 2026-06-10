#!/usr/bin/env node
/**
 * Build-time storefront ↔ repo catalog sync gate (offline, no test deps).
 *
 * Runs as `prebuild`, so every Vercel deploy fails if the homepage skill list
 * drifts from the vendored medsci-skills catalog snapshot — the exact bug v4.0
 * fixes (site showed 40 while the repo had 43). The richer assertions (en==ko
 * parity, category agreement) live in skills_catalog_sync.test.ts for `npm test`;
 * this is the minimal, dependency-free guard for the production build.
 *
 * Refresh the snapshot with `npm run skills:refresh` when the repo changes.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const dir = dirname(fileURLToPath(import.meta.url));
const read = (p) => JSON.parse(readFileSync(resolve(dir, "../src/content/data", p), "utf8"));

const en = read("skills.en.json");
const snapshot = read("skills_catalog.snapshot.json");

const enSlugs = new Set(en.skills.map((s) => s.name));
const catSlugs = new Set(snapshot.skills.map((s) => s.slug));

const missing = [...catSlugs].filter((s) => !enSlugs.has(s)).sort();
const extra = [...enSlugs].filter((s) => !catSlugs.has(s)).sort();

if (missing.length || extra.length || en.skills.length !== snapshot.skill_count) {
  console.error("SKILLS_CATALOG_SYNC drift between storefront and repo catalog:");
  if (missing.length) console.error(`  missing from storefront: ${missing.join(", ")}`);
  if (extra.length) console.error(`  not in repo catalog:     ${extra.join(", ")}`);
  if (en.skills.length !== snapshot.skill_count)
    console.error(`  count: storefront ${en.skills.length} != snapshot ${snapshot.skill_count}`);
  console.error("Fix: `npm run skills:refresh` then update src/content/data/skills.{en,ko}.json.");
  process.exit(1);
}

console.log(`skills catalog sync OK: ${en.skills.length} skills match the vendored repo catalog.`);
