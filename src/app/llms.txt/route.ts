import { BASE } from "@/lib/seo";
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
- [Skills](${BASE}/en/skills): Open-source MedSci Skills for Claude Code.
- [About](${BASE}/en/about): Yoojin Nam, M.D. — radiologist and medical-AI researcher.
- [Lectures](${BASE}/en/lectures): Talks and teaching material.

## Notes
- Korean (한국어) versions of every page are served at the same path with /ko in place of /en
  (for example ${BASE}/ko/rads/orads).
- The canonical language is English; x-default resolves to the /en paths above.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
