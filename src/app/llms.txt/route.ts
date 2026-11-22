import { BASE, SKILL_COUNT, DETECTOR_COUNT, GUIDELINE_COUNT } from "@/lib/seo";
import { RADS_REGISTRY } from "@/lib/rads/registry";

// Served at /llms.txt as a static text file (Next.js route handler, Non-UI Response).
export const dynamic = "force-static";

export function GET() {
  const radsLines = RADS_REGISTRY.map(
    (r) => `- [${r.name} calculator](${BASE}/en/rads/${r.slug}): ${r.blurb}`,
  ).join("\n");

  const body = `# Aperivue

> Aperivue builds free, educational radiology tools and content: RADS scoring calculators
> with structured, PACS-ready report generation, plus a medical-AI blog and open-source skills.
> Created by Yoojin Nam, M.D., a radiologist. These tools are for education and research only
> and are not medical devices; they do not replace professional clinical judgment.

## RADS calculators
${radsLines}

## Sections
- [RADS portal](${BASE}/en/rads): Index of all radiology reporting and data system (RADS) calculators.
- [Blog](${BASE}/en/blog): Articles on medical AI and radiology.
- [Skills](${BASE}/en/skills): MedSci Skills, described in the next section.
- [About](${BASE}/en/about): Yoojin Nam, M.D. — radiologist and medical-AI researcher.
- [Lectures](${BASE}/en/lectures): Talks and teaching material.

## MedSci Skills
MedSci Skills is a set of Agent Skills for clinical research: literature and references, study design, statistics, figures, manuscript drafting, reporting-guideline checks and journal submission, plus a lane for building and validating medical-imaging AI models. It has ${SKILL_COUNT} skills, ${GUIDELINE_COUNT} reporting guidelines and risk-of-bias tools, and ${DETECTOR_COUNT} deterministic detectors.
- For: physicians and biomedical or medical-engineering researchers who work in Claude Code, Codex, Cursor or GitHub Copilot.
- Limits: not a diagnostic tool and not an autonomous author. The skills draft and check, bundled scripts recompute what can be recomputed, and every output needs review by a qualified researcher. Do not give an agent identifiable patient data.
- Install: \`npx medsci-skills install\` (needs Node 18+ and Python 3.9+; a no-terminal installer is described in the repository's docs/install.md)
- Repository: https://github.com/Aperivue/medsci-skills (MIT license; some bundled material carries its own terms)
- Cite: https://doi.org/10.5281/zenodo.20155321 (this DOI always resolves to the latest release; cite the version you used)
- Page: ${BASE}/en/skills
Stages and skills:
- Project & Workflow: author-strategy, find-cohort-gap, intake-project, ma-scout, manage-project, orchestrate
- Literature & References: fulltext-retrieval, lit-sync, manage-refs, obsidian-paper-vault, search-lit, verify-refs
- Data & Study Design: calc-sample-size, clean-data, define-variables, deidentify, design-ai-benchmarking, design-study, generate-codebook, version-dataset
- Analysis & Figures: analyze-stats, batch-cohort, cross-national, make-figures, meta-analysis, replicate-study
- Model Engineering & Validation: imaging-data, mllm-eval, model-assessment, model-card, model-scaffold, model-selection, radiomics-ml
- Writing & Manuscript: academic-aio, humanize, polish-language, review-paper, revise, write-paper, write-protocol
- Review & Compliance: check-reporting, peer-review, self-review
- Submission & Journals: add-journal, fill-icmje-coi, fill-protocol, find-journal, grant-builder, sync-submission
- Presentation & Tooling: contribute, present-paper, publish-skill, render-pdf-doc, setup-medsci

## Notes
- Korean (한국어) versions of every page are served at the same path with /ko in place of /en
  (for example ${BASE}/ko/rads/orads).
- The canonical language is English; x-default resolves to the /en paths above.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
