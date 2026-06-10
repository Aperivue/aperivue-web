/**
 * Canonical ordering of skill categories for the storefront filter and detail
 * pages. Keys mirror `category` in src/content/data/skills.{en,ko}.json, which
 * is itself derived from the medsci-skills generated catalog (owner_domain →
 * category). Human labels live in the dictionaries (`skills.categoryLabels`).
 */
export const CATEGORY_ORDER = [
  "literature_references",
  "data_study_design",
  "analysis_figures",
  "writing_manuscript",
  "review_compliance",
  "submission_journals",
  "project_workflow",
  "presentation_tooling",
] as const;

export type CategoryKey = (typeof CATEGORY_ORDER)[number];

/** Categories present in a skill list, in canonical order. */
export function orderedCategories(skills: { category: string }[]): string[] {
  const present = new Set(skills.map((s) => s.category));
  return CATEGORY_ORDER.filter((c) => present.has(c));
}
