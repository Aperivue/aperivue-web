import { describe, it, expect } from "vitest";
import skillsEn from "./skills.en.json";
import skillsKo from "./skills.ko.json";
import snapshot from "./skills_catalog.snapshot.json";

/**
 * Storefront ↔ repo catalog sync gate (offline).
 *
 * `skills_catalog.snapshot.json` is a vendored copy of medsci-skills
 * `metadata/skills_catalog.json` (the generated SSOT of which skills exist).
 * This test fails if the homepage skill list drifts from that catalog — the
 * exact bug v4.0 fixes (the site showed 40 skills while the repo shipped 43).
 *
 * Refresh the snapshot with `npm run skills:refresh` when the repo adds/removes
 * a skill, then add/remove the matching marketing object in skills.{en,ko}.json.
 */

const enSlugs = new Set(skillsEn.skills.map((s) => s.name));
const koSlugs = new Set(skillsKo.skills.map((s) => s.name));
const catalogSlugs = new Set(snapshot.skills.map((s) => s.slug));

const sorted = (s: Set<string>) => [...s].sort();

describe("skills catalog sync (storefront ↔ repo SSOT)", () => {
  it("English catalog covers exactly the repo skill set", () => {
    expect(sorted(enSlugs)).toEqual(sorted(catalogSlugs));
  });

  it("Korean catalog mirrors the English catalog (i18n parity)", () => {
    expect(sorted(koSlugs)).toEqual(sorted(enSlugs));
  });

  it("skill count matches the vendored snapshot", () => {
    expect(skillsEn.skills.length).toBe(snapshot.skill_count);
    expect(skillsKo.skills.length).toBe(snapshot.skill_count);
  });

  it("every skill declares a category that exists in the snapshot", () => {
    const catBySlug = new Map(snapshot.skills.map((s) => [s.slug, s.category]));
    for (const s of skillsEn.skills) {
      expect(s, `${s.name} missing category`).toHaveProperty("category");
      // Homepage category must agree with the repo's canonical category.
      expect(s.category, `${s.name} category drift`).toBe(catBySlug.get(s.name));
    }
  });
});
