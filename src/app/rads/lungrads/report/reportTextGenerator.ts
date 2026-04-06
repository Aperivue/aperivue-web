import type { LungReportState, ScoredLungNodule } from "./types";
import { LUNG_INDICATIONS } from "./types";
import { LUNG_NODULE_LOCATIONS, SPECIAL_CATEGORIES, scoreLungRads } from "@/lib/rads/lungrads";

export function generateLungReportText(state: LungReportState, scored: ScoredLungNodule[]): string {
  const lines: string[] = [];

  lines.push("LOW-DOSE CHEST CT — LUNG CANCER SCREENING");
  lines.push("");

  // Clinical info
  const ind = formatIndication(state);
  if (ind) lines.push(`CLINICAL INDICATION: ${ind}`);
  const smoking = formatSmoking(state);
  if (smoking) lines.push(`SMOKING HISTORY: ${smoking}`);
  if (state.clinicalInfo.comparison) {
    lines.push(`COMPARISON: ${state.clinicalInfo.comparison}`);
  } else {
    lines.push("COMPARISON: None available.");
  }
  lines.push("");
  lines.push("FINDINGS:");
  lines.push("");

  // Special category
  if (state.specialCategory) {
    const spec = SPECIAL_CATEGORIES.find((s) => s.value === state.specialCategory);
    if (spec) {
      lines.push(`Lung-RADS Category ${spec.category}: ${spec.label}.`);
      lines.push("");
    }
  }

  // Nodules
  if (!state.specialCategory) {
    lines.push("Pulmonary Nodules:");
    if (scored.length === 0) {
      lines.push("No pulmonary nodules identified.");
    } else {
      scored.forEach((sn, idx) => {
        lines.push(formatNoduleLine(sn, idx + 1));
      });
    }
    lines.push("");
  }

  // Mediastinum
  lines.push(formatMediastinum(state));
  lines.push("");

  // Other findings
  if (state.otherFindings.trim()) {
    lines.push(`Other Findings: ${state.otherFindings.trim()}`);
    lines.push("");
  }

  // Impression
  lines.push("IMPRESSION:");
  const impression = state.impressionOverride ?? generateAutoImpression(state, scored);
  lines.push(impression);

  return lines.join("\n");
}

// ── Auto-impression ───────────────────────────────────────────────────────

export function generateAutoImpression(state: LungReportState, scored: ScoredLungNodule[]): string {
  const items: string[] = [];
  let num = 1;

  // Special category impression
  if (state.specialCategory) {
    const spec = SPECIAL_CATEGORIES.find((s) => s.value === state.specialCategory);
    if (spec) {
      const result = scoreLungRads(state.specialCategory, "", null, "baseline", null, {
        spiculation: false, lymphadenopathy: false, directInvasion: false,
        pleuralEffusion: false, other: false,
      });
      if (result) {
        items.push(`${num}. ${result.displayCategory} (${result.level}). ${result.recommendation}`);
        num++;
      }
    }
  } else {
    // Nodule impressions — sort by highest category
    const sortedScored = [...scored].sort((a, b) => {
      const order = ["1", "2", "2S", "3", "3S", "4A", "4X", "4B"];
      const ai = order.indexOf(a.result?.category ?? "1");
      const bi = order.indexOf(b.result?.category ?? "1");
      return bi - ai; // highest first
    });

    sortedScored.forEach((sn) => {
      if (!sn.result) return;
      const loc = locLabel(sn.nodule.location);
      const size = sn.sizeMmNum ? `${sn.sizeMmNum} mm` : "";
      const where = [loc, size].filter(Boolean).join(", ");
      const cat = sn.result.displayCategory;
      const level = sn.result.level;
      const rec = sn.result.recommendation;
      items.push(`${num}. ${sn.nodule.label}${where ? ` (${where})` : ""}: ${cat} (${level}). ${rec}`);
      num++;
    });
  }

  if (state.mediastinum.lymphadenopathy) {
    items.push(`${num}. Mediastinal/hilar lymphadenopathy. Correlate clinically.`);
    num++;
  }

  return items.length > 0 ? items.join("\n") : "No significant findings. Continue annual screening with LDCT.";
}

// ── Helpers ───────────────────────────────────────────────────────────────

function formatIndication(state: LungReportState): string {
  const { indication, customIndication } = state.clinicalInfo;
  if (!indication) return "";
  if (indication === "other") return customIndication || "Other";
  return LUNG_INDICATIONS.find((i) => i.value === indication)?.label ?? indication;
}

function formatSmoking(state: LungReportState): string {
  const { packYears, smokingStatus } = state.clinicalInfo;
  const parts: string[] = [];
  if (smokingStatus) {
    const statusMap: Record<string, string> = {
      current: "Current smoker",
      former: "Former smoker",
      never: "Never smoker",
    };
    parts.push(statusMap[smokingStatus] ?? smokingStatus);
  }
  if (packYears) parts.push(`${packYears} pack-years`);
  return parts.join(", ");
}

function formatNoduleLine(sn: ScoredLungNodule, num: number): string {
  const n = sn.nodule;
  const loc = locLabel(n.location);
  const sizeStr = n.sizeMm ? `${n.sizeMm} mm` : "";
  const where = [loc, sizeStr].filter(Boolean).join(", ");
  const header = `${num}. ${n.label}${where ? ` (${where})` : ""}:`;

  const desc = sn.featureDescription;
  const parts = [header];
  if (desc) parts.push(`   ${desc}.`);
  if (sn.result) {
    const r = sn.result;
    parts.push(`   ${r.displayCategory} (${r.level}).`);
    parts.push(`   Recommendation: ${r.recommendation}`);
  }

  return parts.join("\n");
}

function formatMediastinum(state: LungReportState): string {
  const m = state.mediastinum;
  const parts = ["Mediastinum:"];
  if (m.lymphadenopathy) {
    parts.push("Mediastinal/hilar lymphadenopathy noted.");
    if (m.lymphNodes.trim()) parts.push(m.lymphNodes.trim());
  } else {
    parts.push("No significant mediastinal or hilar lymphadenopathy.");
  }
  if (m.other.trim()) parts.push(m.other.trim());
  return parts.join("\n");
}

function locLabel(loc: string): string {
  return LUNG_NODULE_LOCATIONS.find((l) => l.value === loc)?.label ?? "";
}
