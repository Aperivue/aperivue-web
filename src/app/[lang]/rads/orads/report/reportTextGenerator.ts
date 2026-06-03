import type { OradsReportState, ScoredOradsLesion } from "./types";
import { ORADS_INDICATIONS, ORADS_LATERALITY } from "./types";

export function generateOradsReportText(
  state: OradsReportState,
  scored: ScoredOradsLesion[],
): string {
  const isUs = state.system === "us";
  const lines: string[] = [];

  lines.push(isUs ? "PELVIC ULTRASOUND — O-RADS US v2022" : "PELVIC MRI — O-RADS MRI 2022");
  lines.push("");
  lines.push(
    isUs
      ? "TECHNIQUE: Transvaginal ± transabdominal pelvic ultrasound with color Doppler."
      : "TECHNIQUE: Pelvic MRI including T2-weighted, diffusion-weighted, and dynamic contrast-enhanced sequences.",
  );

  const ind = formatIndication(state);
  if (ind) lines.push(`CLINICAL INDICATION: ${ind}`);
  if (state.clinicalInfo.menopausal) {
    lines.push(`MENOPAUSAL STATUS: ${state.clinicalInfo.menopausal === "pre" ? "Premenopausal" : "Postmenopausal"}.`);
  }
  lines.push(
    state.clinicalInfo.comparison
      ? `COMPARISON: ${state.clinicalInfo.comparison}`
      : "COMPARISON: None available.",
  );

  lines.push("");
  lines.push("FINDINGS:");
  lines.push("");
  lines.push("Adnexal lesions:");
  if (scored.length === 0) {
    lines.push("No discrete adnexal lesion identified.");
  } else {
    scored.forEach((sn, idx) => lines.push(formatLesionLine(sn, idx + 1)));
  }
  lines.push("");

  if (state.otherFindings.trim()) {
    lines.push(`Other Findings: ${state.otherFindings.trim()}`);
    lines.push("");
  }

  lines.push("IMPRESSION:");
  lines.push(state.impressionOverride ?? generateAutoImpression(state, scored));

  return lines.join("\n");
}

export function generateAutoImpression(
  state: OradsReportState,
  scored: ScoredOradsLesion[],
): string {
  const items: string[] = [];
  let num = 1;

  // Per ACR Governing Concepts, management is driven by the lesion with the
  // highest O-RADS score; ties broken by larger size.
  const sorted = [...scored]
    .filter((s) => s.result)
    .sort((a, b) => {
      if (b.result!.score !== a.result!.score) return b.result!.score - a.result!.score;
      return (b.sizeCmNum ?? 0) - (a.sizeCmNum ?? 0);
    });

  if (sorted.length === 0) {
    return "No categorizable lesion. Complete the lexicon descriptors to assign an O-RADS score.";
  }

  sorted.forEach((sn, i) => {
    const where = locationText(sn);
    const r = sn.result!;
    const indexTag = i === 0 && sorted.length > 1 ? " (highest score — drives management)" : "";
    items.push(`${num}. ${sn.lesion.label}${where ? ` (${where})` : ""}${indexTag}: ${r.category}, ${r.riskCategory} (${r.riskPercent} risk of malignancy). ${r.management}`);
    num++;
    if (r.note) {
      items.push(`   Note: ${r.note}`);
    }
  });

  items.push(
    `${num}. O-RADS is a risk-stratification category; management should be individualized per clinical context, symptoms, and institutional protocol.`,
  );
  return items.join("\n");
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatIndication(state: OradsReportState): string {
  const { indication, customIndication } = state.clinicalInfo;
  if (!indication) return "";
  if (indication === "other") return customIndication || "Other";
  return ORADS_INDICATIONS.find((i) => i.value === indication)?.label ?? indication;
}

function formatLesionLine(sn: ScoredOradsLesion, num: number): string {
  const where = locationText(sn);
  const header = `${num}. ${sn.lesion.label}${where ? ` (${where})` : ""}:`;
  const parts = [header];
  if (sn.featureDescription) parts.push(`   ${sn.featureDescription}.`);
  if (sn.result) {
    parts.push(`   ${sn.result.category}, ${sn.result.riskCategory} (${sn.result.riskPercent}).`);
    parts.push(`   Rationale: ${sn.result.rationale}`);
    if (sn.result.note) parts.push(`   Note: ${sn.result.note}`);
    parts.push(`   Management: ${sn.result.management}`);
  } else {
    parts.push("   Incomplete input — select the lesion type and required descriptors to categorize.");
  }
  return parts.join("\n");
}

function locationText(sn: ScoredOradsLesion): string {
  const lat = ORADS_LATERALITY.find((l) => l.value === sn.lesion.laterality)?.label;
  const size = sn.sizeCmNum ? `${sn.sizeCmNum} cm` : "";
  return [lat && lat !== "Not specified" ? lat : "", size].filter(Boolean).join(", ");
}
