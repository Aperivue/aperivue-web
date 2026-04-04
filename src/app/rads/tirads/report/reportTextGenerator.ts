import type { ReportState, ScoredNodule } from "./types";
import { INDICATIONS, LN_FEATURES } from "./types";
import { NODULE_LOCATIONS } from "@/lib/rads/tirads";

const SYSTEM_LABELS: Record<string, string> = {
  acr: "ACR TI-RADS",
  ktirads: "K-TIRADS",
  eutirads: "EU-TIRADS",
};

export function generateReportText(state: ReportState, scored: ScoredNodule[]): string {
  const lines: string[] = [];

  lines.push("THYROID ULTRASOUND");
  lines.push("");

  // Clinical info
  const ind = formatIndication(state);
  if (ind) lines.push(`CLINICAL INDICATION: ${ind}`);
  if (state.clinicalInfo.comparison) {
    lines.push(`COMPARISON: ${state.clinicalInfo.comparison}`);
  } else {
    lines.push("COMPARISON: None available.");
  }
  lines.push("");
  lines.push("FINDINGS:");
  lines.push("");

  // Gland
  lines.push(formatGland(state));
  lines.push("");

  // Nodules
  lines.push("Nodules:");
  if (scored.length === 0) {
    lines.push("No thyroid nodules identified.");
  } else {
    scored.forEach((sn, idx) => {
      lines.push(formatNoduleLine(sn, idx + 1, state.system));
    });
  }
  lines.push("");

  // Lymph nodes
  lines.push(formatLymphNodes(state));
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

export function generateAutoImpression(state: ReportState, scored: ScoredNodule[]): string {
  const items: string[] = [];
  let num = 1;

  scored.forEach((sn) => {
    if (!sn.result) return;
    const loc = locLabel(sn.nodule.location);
    const size = sn.maxDiameter ? `${sn.maxDiameter} cm` : "";
    const where = [loc, size].filter(Boolean).join(", ");
    const cat = sn.result.category;
    const level = sn.result.level;
    const fna = sn.result.fna;
    items.push(`${num}. ${sn.nodule.label}${where ? ` (${where})` : ""}: ${cat} (${level}). ${fna}`);
    num++;
  });

  const g = state.glandAssessment;
  if (g.thyroiditis && g.thyroiditis !== "none") {
    const tMap: Record<string, string> = {
      hashimoto: "Hashimoto thyroiditis",
      subacute: "Subacute thyroiditis",
      graves: "Graves disease",
      other: "Thyroiditis",
    };
    items.push(`${num}. Background parenchyma suggests ${tMap[g.thyroiditis] ?? g.thyroiditis}.`);
    num++;
  }

  if (state.lymphNodes.status === "abnormal" && state.lymphNodes.nodes.length > 0) {
    const levels = state.lymphNodes.nodes
      .filter((n) => n.level)
      .map((n) => `level ${n.level}`)
      .join(", ");
    items.push(`${num}. Abnormal cervical lymph node(s)${levels ? ` at ${levels}` : ""}. Consider further evaluation.`);
  }

  return items.length > 0 ? items.join("\n") : "No significant findings.";
}

// ── Helpers ───────────────────────────────────────────────────────────────

function formatIndication(state: ReportState): string {
  const { indication, customIndication } = state.clinicalInfo;
  if (!indication) return "";
  if (indication === "other") return customIndication || "Other";
  return INDICATIONS.find((i) => i.value === indication)?.label ?? indication;
}

function dimStr(d: { l: string; w: string; h: string }): string {
  const vals = [d.l, d.w, d.h].filter(Boolean);
  if (vals.length === 0) return "not measured";
  return vals.join(" x ") + " cm";
}

function formatGland(state: ReportState): string {
  const g = state.glandAssessment;
  const parts: string[] = ["Thyroid Gland:"];
  parts.push(`Right lobe: ${dimStr(g.rightLobe)}. Left lobe: ${dimStr(g.leftLobe)}. Isthmus: ${g.isthmusAP ? g.isthmusAP + " cm" : "not measured"}.`);

  const details: string[] = [];
  if (g.echotexture) {
    const eMap: Record<string, string> = { normal: "Normal homogeneous echotexture", heterogeneous: "Heterogeneous echotexture", diffusely_hypoechoic: "Diffusely hypoechoic parenchyma" };
    details.push(eMap[g.echotexture] ?? g.echotexture);
  }
  if (g.vascularity) {
    details.push(`${g.vascularity.charAt(0).toUpperCase() + g.vascularity.slice(1)} vascularity`);
  }
  if (details.length) parts.push(details.join(". ") + ".");

  if (g.thyroiditis && g.thyroiditis !== "none") {
    const tMap: Record<string, string> = { hashimoto: "Findings consistent with Hashimoto thyroiditis.", subacute: "Findings suggestive of subacute thyroiditis.", graves: "Findings consistent with Graves disease.", other: "Thyroiditis noted." };
    parts.push(tMap[g.thyroiditis] ?? "");
  }
  if (g.additionalFindings.trim()) parts.push(g.additionalFindings.trim());

  return parts.join("\n");
}

function formatNoduleLine(sn: ScoredNodule, num: number, system: string): string {
  const n = sn.nodule;
  const loc = locLabel(n.location);
  const sizes = [n.sizeL, n.sizeW, n.sizeH].filter(Boolean);
  const sizeStr = sizes.length > 0 ? sizes.join(" x ") + " cm" : "";
  const where = [loc, sizeStr].filter(Boolean).join(", ");
  const header = `${num}. ${n.label}${where ? ` (${where})` : ""}:`;

  const desc = sn.featureDescription;
  const parts = [header];
  if (desc) parts.push(`   ${desc}.`);
  if (sn.result) {
    const r = sn.result;
    parts.push(`   ${SYSTEM_LABELS[system]}: ${r.category} (${r.level}). Malignancy risk: ${r.risk}.`);
  }

  return parts.join("\n");
}

function formatLymphNodes(state: ReportState): string {
  const ln = state.lymphNodes;
  if (ln.status === "normal") {
    const extra = ln.additionalDescription.trim();
    return `Cervical Lymph Nodes: No suspicious cervical lymphadenopathy.${extra ? " " + extra : ""}`;
  }

  const parts = ["Cervical Lymph Nodes:"];
  ln.nodes.forEach((node) => {
    const feats = node.features
      .map((f) => LN_FEATURES.find((lf) => lf.value === f)?.label ?? f)
      .join(", ");
    const desc = [
      node.level ? `Level ${node.level}` : "",
      node.size ? `${node.size} mm` : "",
      feats,
      node.description,
    ].filter(Boolean).join(", ");
    if (desc) parts.push(`- ${desc}`);
  });
  if (ln.additionalDescription.trim()) parts.push(ln.additionalDescription.trim());

  return parts.join("\n");
}

function locLabel(loc: string): string {
  return NODULE_LOCATIONS.find((l) => l.value === loc)?.label ?? "";
}
