#!/usr/bin/env node
/**
 * Refresh the vendored skills catalog snapshot from the medsci-skills repo.
 *
 * The storefront sync gate (src/content/data/skills_catalog_sync.test.ts) runs
 * OFFLINE against a committed snapshot so Vercel builds stay deterministic.
 * This script is the only network step — opt-in — to pull a fresh snapshot when
 * the repo adds/removes a skill.
 *
 * Usage:
 *   node scripts/refresh-skills-catalog.mjs                 # fetch from main
 *   node scripts/refresh-skills-catalog.mjs --ref v4.0.0    # fetch a pinned tag
 *   node scripts/refresh-skills-catalog.mjs --from <path>   # copy a local file
 *
 * After refreshing, update src/content/data/skills.{en,ko}.json to add/remove the
 * matching marketing objects, then run `npm test` (the gate must pass).
 */
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../src/content/data/skills_catalog.snapshot.json");
const COUNTS_OUT = resolve(__dirname, "../src/content/data/catalog_counts.snapshot.json");

const args = process.argv.slice(2);
const getOpt = (name) => {
  const i = args.indexOf(name);
  return i !== -1 && i + 1 < args.length ? args[i + 1] : null;
};
const ref = getOpt("--ref") ?? "main";
const fromPath = getOpt("--from");

function validate(json) {
  const c = JSON.parse(json);
  if (!Array.isArray(c.skills) || typeof c.skill_count !== "number") {
    throw new Error("not a skills_catalog.json (missing skills[]/skill_count)");
  }
  if (c.skills.length !== c.skill_count) {
    throw new Error(`skill_count ${c.skill_count} != skills.length ${c.skills.length}`);
  }
  return c;
}

async function main() {
  let raw;
  if (fromPath) {
    raw = readFileSync(resolve(process.cwd(), fromPath), "utf8");
    console.log(`Read local ${fromPath}`);
  } else {
    const url = `https://raw.githubusercontent.com/Aperivue/medsci-skills/${ref}/metadata/skills_catalog.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`);
    raw = await res.text();
    console.log(`Fetched ${url}`);
  }
  const c = validate(raw);
  // Normalize to 2-space JSON + trailing newline so the diff is clean.
  writeFileSync(OUT, JSON.stringify(c, null, 2) + "\n");
  console.log(`Wrote snapshot: ${c.skill_count} skills, ${c.categories?.length ?? "?"} categories.`);

  // The counts SSOT (skills / detectors / guidelines). The site interpolates these rather than
  // printing them in prose, so a repo release cannot leave the storefront quietly wrong.
  let countsRaw;
  if (fromPath) {
    const local = resolve(process.cwd(), fromPath, "..", "catalog_counts.json");
    countsRaw = readFileSync(local, "utf8");
    console.log(`Read local ${local}`);
  } else {
    const url = `https://raw.githubusercontent.com/Aperivue/medsci-skills/${ref}/metadata/catalog_counts.json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`);
    countsRaw = await res.text();
    console.log(`Fetched ${url}`);
  }
  const counts = JSON.parse(countsRaw);
  for (const k of ["skills", "reporting_guidelines", "integrity_detectors"]) {
    if (typeof counts[k] !== "number") throw new Error(`catalog_counts.json: missing ${k}`);
  }
  writeFileSync(COUNTS_OUT, JSON.stringify(counts, null, 2) + "\n");
  console.log(
    `Wrote counts: ${counts.skills} skills, ${counts.integrity_detectors} detectors, ${counts.reporting_guidelines} guidelines.`,
  );

  console.log("Next: update src/content/data/skills.{en,ko}.json then run `npm test`.");
}

main().catch((e) => {
  console.error(`refresh failed: ${e.message}`);
  process.exit(1);
});
