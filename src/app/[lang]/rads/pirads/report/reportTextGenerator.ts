import type { PiradsReportState, ScoredPiradsLesion } from "./types";
import { PIRADS_INDICATIONS } from "./types";
import { PROSTATE_SIDES, PROSTATE_LEVELS } from "@/lib/rads/pirads";

export function generatePiradsReportText(
  state: PiradsReportState,
  scored: ScoredPiradsLesion[],
): string {
  const lines: string[] = [];

  lines.push("MULTIPARAMETRIC MRI OF THE PROSTATE — PI-RADS v2.1");
  lines.push("");
  lines.push("TECHNIQUE: Multiparametric MRI (T2-weighted, diffusion-weighted, and dynamic contrast-enhanced imaging).");

  const ind = formatIndication(state);
  if (ind) lines.push(`CLINICAL INDICATION: ${ind}`);
  const psaLine = formatPsa(state);
  if (psaLine) lines.push(psaLine);
  lines.push(
    state.clinicalInfo.comparison
      ? `COMPARISON: ${state.clinicalInfo.comparison}`
      : "COMPARISON: None available.",
  );

  lines.push("");
  lines.push("FINDINGS:");
  lines.push("");
  lines.push("Prostate lesions:");
  if (scored.length === 0) {
    lines.push("No discrete lesion identified.");
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
  state: PiradsReportState,
  scored: ScoredPiradsLesion[],
): string {
  const items: string[] = [];
  let num = 1;

  // Index lesion = highest PI-RADS; ties broken by extraprostatic extension,
  // then by larger size (PI-RADS reporting guidance).
  const sorted = [...scored]
    .filter((s) => s.result)
    .sort((a, b) => {
      if (b.result!.score !== a.result!.score) return b.result!.score - a.result!.score;
      const ae = a.lesion.epe ? 1 : 0;
      const be = b.lesion.epe ? 1 : 0;
      if (be !== ae) return be - ae;
      return (b.sizeMmNum ?? 0) - (a.sizeMmNum ?? 0);
    });

  // Index-lesion tagging follows PI-RADS reporting guidance, which centers on
  // findings scoring ≥3; do not tag an index lesion when all findings are <3.
  const significant = sorted.filter((s) => s.result!.score >= 3).length;

  sorted.forEach((sn, i) => {
    const where = locationText(sn);
    const r = sn.result!;
    const indexTag = i === 0 && sorted.length > 1 && significant > 0 ? " (index lesion)" : "";
    const epeTag = sn.lesion.epe ? ", EPE present" : "";
    items.push(`${num}. ${sn.lesion.label}${where ? ` (${where}${epeTag})` : epeTag ? ` (${epeTag.slice(2)})` : ""}${indexTag}: ${r.category}. ${r.clinicalNote}`);
    num++;
  });

  if (items.length === 0) {
    return "No categorizable lesion. Complete the dominant-sequence scores to assign PI-RADS.";
  }

  if (significant > 4) {
    items.push(
      `${num}. PI-RADS recommends reporting up to four findings with a score ≥3; ${significant} such findings were entered — confirm prioritization.`,
    );
    num++;
  }

  items.push(
    `${num}. PI-RADS is a risk category for clinically significant cancer; biopsy decisions are made clinically.`,
  );
  return items.join("\n");
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatIndication(state: PiradsReportState): string {
  const { indication, customIndication } = state.clinicalInfo;
  if (!indication) return "";
  if (indication === "other") return customIndication || "Other";
  return PIRADS_INDICATIONS.find((i) => i.value === indication)?.label ?? indication;
}

function formatPsa(state: PiradsReportState): string {
  const { psa, prostateVolumeMl } = state.clinicalInfo;
  const parts: string[] = [];
  if (psa) parts.push(`PSA ${psa} ng/mL`);
  if (prostateVolumeMl) parts.push(`prostate volume ${prostateVolumeMl} mL`);
  const psaNum = parseFloat(psa);
  const volNum = parseFloat(prostateVolumeMl);
  if (!isNaN(psaNum) && !isNaN(volNum) && volNum > 0) {
    parts.push(`PSA density ${(psaNum / volNum).toFixed(2)} ng/mL²`);
  }
  return parts.length ? `CLINICAL: ${parts.join(", ")}.` : "";
}

function formatLesionLine(sn: ScoredPiradsLesion, num: number): string {
  const where = locationText(sn);
  const header = `${num}. ${sn.lesion.label}${where ? ` (${where})` : ""}:`;
  const parts = [header];
  if (sn.featureDescription) parts.push(`   ${sn.featureDescription}.`);
  if (sn.result) {
    parts.push(`   ${sn.result.category}. ${sn.result.risk}`);
    if (sn.lesion.epe) parts.push("   Extraprostatic extension present.");
    parts.push(`   Rationale: ${sn.result.rationale}`);
    parts.push(`   Clinical note: ${sn.result.clinicalNote}`);
  } else {
    parts.push("   Incomplete input — select zone and the dominant-sequence score to categorize.");
  }
  return parts.join("\n");
}

function locationText(sn: ScoredPiradsLesion): string {
  const side = PROSTATE_SIDES.find((s) => s.value === sn.lesion.side)?.label;
  const level = PROSTATE_LEVELS.find((l) => l.value === sn.lesion.level)?.label;
  const zone = sn.lesion.zone === "pz" ? "peripheral zone" : sn.lesion.zone === "tz" ? "transition zone" : "";
  const size = sn.sizeMmNum ? `${sn.sizeMmNum} mm` : "";
  return [side && level ? `${side} ${level.toLowerCase()}` : side || level || "", zone, size]
    .filter(Boolean)
    .join(", ");
}
