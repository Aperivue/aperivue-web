import type { LiradsReportState, ScoredLiradsObservation } from "./types";
import { LIRADS_INDICATIONS, LIRADS_APPLICABLE_CONTEXTS } from "./types";
import { CONTRAST_AGENTS, LIRADS_SEGMENTS, categoryRank } from "@/lib/rads/lirads";

export function generateLiradsReportText(
  state: LiradsReportState,
  scored: ScoredLiradsObservation[],
): string {
  const lines: string[] = [];

  const modalityLabel = state.modality === "ct" ? "CT" : "MRI";
  lines.push(`CONTRAST-ENHANCED ${modalityLabel} OF THE LIVER — LI-RADS v2018`);
  lines.push("");

  // TECHNIQUE — modality + contrast agent (required line). Diagnostic adequacy
  // is per observation; an LR-NC observation explains its own inadequacy below.
  const agent = CONTRAST_AGENTS.find((a) => a.value === state.contrastAgent);
  lines.push(`TECHNIQUE: Multiphase ${modalityLabel} with ${agent?.label ?? state.contrastAgent}.`);

  // CLINICAL CONTEXT — applicability statement (required line / warning)
  lines.push(applicabilityLine(state));

  const ind = formatIndication(state);
  if (ind) lines.push(`CLINICAL INDICATION: ${ind}`);
  lines.push(
    state.clinicalInfo.comparison
      ? `COMPARISON: ${state.clinicalInfo.comparison}`
      : "COMPARISON: None available.",
  );

  lines.push("");
  lines.push("FINDINGS:");
  lines.push("");
  lines.push("Liver observations:");
  if (scored.length === 0) {
    lines.push("No LI-RADS observations identified.");
  } else {
    scored.forEach((sn, idx) => lines.push(formatObservationLine(sn, idx + 1)));
  }
  lines.push("");

  if (state.otherFindings.trim()) {
    lines.push(`Other Findings: ${state.otherFindings.trim()}`);
    lines.push("");
  }

  lines.push("IMPRESSION:");
  const impression = state.impressionOverride ?? generateAutoImpression(state, scored);
  lines.push(impression);

  return lines.join("\n");
}

// ── Auto-impression ─────────────────────────────────────────────────────────

export function generateAutoImpression(
  state: LiradsReportState,
  scored: ScoredLiradsObservation[],
): string {
  const items: string[] = [];
  let num = 1;

  if (state.clinicalInfo.applicableContext === "not_applicable") {
    items.push(
      `${num}. LI-RADS does not apply to this patient (not an LI-RADS high-risk context); categories below are provisional only.`,
    );
    num++;
  }

  // Highest-concern observation first.
  const sorted = [...scored]
    .filter((s) => s.result)
    .sort((a, b) => categoryRank(b.result!.category) - categoryRank(a.result!.category));

  sorted.forEach((sn) => {
    const where = locationText(sn);
    const r = sn.result!;
    items.push(`${num}. ${sn.observation.label}${where ? ` (${where})` : ""}: ${r.category}. ${r.management}`);
    num++;
  });

  if (items.length === 0) {
    return "No categorizable LI-RADS observation. Correlate with clinical findings and complete the observation inputs.";
  }
  return items.join("\n");
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function applicabilityLine(state: LiradsReportState): string {
  const ctx = state.clinicalInfo.applicableContext;
  if (ctx === "not_applicable") {
    return "CLINICAL CONTEXT: LI-RADS does not apply — patient does not meet LI-RADS high-risk criteria. Categories are provisional only.";
  }
  if (!ctx) {
    return "CLINICAL CONTEXT: LI-RADS applicable high-risk context assumed (specify cirrhosis, chronic HBV, or current/prior HCC).";
  }
  const label = LIRADS_APPLICABLE_CONTEXTS.find((c) => c.value === ctx)?.label ?? ctx;
  return `CLINICAL CONTEXT: LI-RADS applicable clinical context assumed — ${label}.`;
}

function formatIndication(state: LiradsReportState): string {
  const { indication, customIndication } = state.clinicalInfo;
  if (!indication) return "";
  if (indication === "other") return customIndication || "Other";
  return LIRADS_INDICATIONS.find((i) => i.value === indication)?.label ?? indication;
}

function formatObservationLine(sn: ScoredLiradsObservation, num: number): string {
  const where = locationText(sn);
  const header = `${num}. ${sn.observation.label}${where ? ` (${where})` : ""}:`;
  const parts = [header];
  if (sn.featureDescription) parts.push(`   ${sn.featureDescription}.`);
  if (sn.result) {
    parts.push(`   LI-RADS category: ${sn.result.category}.`);
    parts.push(`   Rationale: ${sn.result.rationale}`);
    parts.push(`   Recommendation: ${sn.result.management}`);
  } else {
    parts.push("   Incomplete input — select APHE and enter size to categorize.");
  }
  return parts.join("\n");
}

function locationText(sn: ScoredLiradsObservation): string {
  const seg = segmentLabel(sn.observation.segment);
  const size = sn.sizeMmNum ? `${sn.sizeMmNum} mm` : "";
  return [seg, size].filter(Boolean).join(", ");
}

function segmentLabel(seg: string): string {
  return LIRADS_SEGMENTS.find((s) => s.value === seg)?.label ?? "";
}
