import type { BiRadsReportState, BiRadsLesion } from "./types";
import { BIRADS_INDICATIONS } from "./types";
import {
  getCategoryInfo,
  formatClockLocation,
  describeMammoMass,
  describeMammoCalcifications,
  describeUsMass,
  MAMMO_ASSOCIATED_FEATURE_OPTIONS,
  US_ASSOCIATED_FEATURE_OPTIONS,
  BREAST_COMPOSITIONS,
  ASYMMETRY_TYPES,
  US_SPECIAL_CASES,
} from "@/lib/rads/birads";

// ── Main generator ────────────────────────────────────────────────────────

export function generateBiRadsReportText(state: BiRadsReportState): string {
  const lines: string[] = [];
  const modalityLabel =
    state.modality === "mammo" ? "MAMMOGRAPHY" : "BREAST ULTRASOUND";

  lines.push(modalityLabel);
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

  // Breast composition (mammography only)
  if (state.modality === "mammo" && state.breastComposition) {
    const comp = BREAST_COMPOSITIONS.find((c) => c.value === state.breastComposition);
    if (comp) {
      lines.push(`Breast Composition: ${comp.label}.`);
      lines.push("");
    }
  }

  // Lesions
  if (state.lesions.length === 0) {
    lines.push("No significant finding identified.");
  } else {
    state.lesions.forEach((lesion, idx) => {
      lines.push(formatLesionBlock(lesion, idx + 1, state.modality));
      lines.push("");
    });
  }

  // Other findings
  if (state.otherFindings.trim()) {
    lines.push(`Additional Findings: ${state.otherFindings.trim()}`);
    lines.push("");
  }

  // Impression
  lines.push("IMPRESSION:");
  const impression = state.impressionOverride ?? generateAutoImpression(state);
  lines.push(impression);

  return lines.join("\n");
}

// ── Auto-impression ───────────────────────────────────────────────────────

export function generateAutoImpression(state: BiRadsReportState): string {
  const items: string[] = [];
  let num = 1;

  for (const lesion of state.lesions) {
    const cat = lesion.selectedCategory;
    if (!cat) continue;

    const info = getCategoryInfo(cat);
    const loc = formatClockLocation(
      lesion.laterality,
      lesion.clockPosition,
      lesion.depth,
      lesion.distanceFromNippleMm,
    );
    const sizeStr = formatSize(lesion, state.modality);

    const descriptor = buildShortDescriptor(lesion, state.modality);
    const locParts = [loc, sizeStr].filter(Boolean).join(", ");

    items.push(
      `${num}. ${lesion.label}${locParts ? ` (${locParts})` : ""}${descriptor ? ` — ${descriptor}` : ""}. ${info.label} (${info.level}). ${info.management}`,
    );
    num++;
  }

  if (items.length === 0) {
    const defaultCat =
      state.modality === "mammo" ? "Mammography: BI-RADS 1. Negative." : "Breast US: BI-RADS 1. Negative.";
    return defaultCat;
  }

  return items.join("\n");
}

// ── Helpers ───────────────────────────────────────────────────────────────

function formatIndication(state: BiRadsReportState): string {
  const { indication, customIndication } = state.clinicalInfo;
  if (!indication) return "";
  if (indication === "other") return customIndication || "Other";
  return BIRADS_INDICATIONS.find((i) => i.value === indication)?.label ?? indication;
}

function formatSize(lesion: BiRadsLesion, modality: BiRadsReportState["modality"]): string {
  const unit = modality === "us" ? "mm" : "cm";
  const dims = [lesion.sizeA, lesion.sizeB, lesion.sizeC].filter(Boolean);
  if (dims.length === 0) return "";
  return dims.join(" x ") + " " + unit;
}

function buildShortDescriptor(
  lesion: BiRadsLesion,
  modality: BiRadsReportState["modality"],
): string {
  if (modality === "mammo") {
    if (lesion.mammoFindingType === "mass") {
      return describeMammoMass(
        lesion.mammoMassShape,
        lesion.mammoMassMargin,
        lesion.mammoMassDensity,
      );
    }
    if (lesion.mammoFindingType === "calcifications") {
      return describeMammoCalcifications(lesion.calcMorphology, lesion.calcDistribution);
    }
    if (lesion.mammoFindingType === "architectural_distortion") {
      return "Architectural distortion";
    }
    if (lesion.mammoFindingType === "asymmetry") {
      const a = ASYMMETRY_TYPES.find((t) => t.value === lesion.asymmetryType);
      return a ? a.label : "Asymmetry";
    }
    if (lesion.mammoFindingType === "intramammary_ln") return "Intramammary lymph node";
    if (lesion.mammoFindingType === "skin_lesion") return "Skin lesion";
    if (lesion.mammoFindingType === "no_finding") return "No abnormality";
  } else {
    if (lesion.usFindingType === "mass") {
      return describeUsMass(
        lesion.usMassShape,
        lesion.usMassOrientation,
        lesion.usMassMargin,
        lesion.usEchoPattern,
        lesion.usPosteriorFeatures,
      );
    }
    if (lesion.usFindingType === "special_case") {
      const s = US_SPECIAL_CASES.find((c) => c.value === lesion.usSpecialCase);
      return s ? s.label : "Special case";
    }
    if (lesion.usFindingType === "no_finding") return "No abnormality";
    if (lesion.usFindingType === "non_mass") return "Non-mass finding";
  }
  return "";
}

function formatLesionBlock(
  lesion: BiRadsLesion,
  num: number,
  modality: BiRadsReportState["modality"],
): string {
  const lines: string[] = [];
  const loc = formatClockLocation(
    lesion.laterality,
    lesion.clockPosition,
    lesion.depth,
    lesion.distanceFromNippleMm,
  );
  const sizeStr = formatSize(lesion, modality);
  const locParts = [loc, sizeStr].filter(Boolean).join(", ");

  lines.push(`${num}. ${lesion.label}${locParts ? ` (${locParts})` : ""}:`);

  const descriptor = buildShortDescriptor(lesion, modality);
  if (descriptor) lines.push(`   ${descriptor}.`);

  // Associated features
  if (modality === "mammo") {
    const activeAssoc = MAMMO_ASSOCIATED_FEATURE_OPTIONS.filter(
      (o) => lesion.mammoAssociated[o.key],
    ).map((o) => o.label.toLowerCase());
    if (activeAssoc.length > 0) {
      lines.push(`   Associated features: ${activeAssoc.join(", ")}.`);
    }
  } else {
    const activeAssoc = US_ASSOCIATED_FEATURE_OPTIONS.filter(
      (o) => lesion.usAssociated[o.key],
    ).map((o) => o.label.toLowerCase());
    if (activeAssoc.length > 0) {
      lines.push(`   Associated features: ${activeAssoc.join(", ")}.`);
    }
  }

  // BI-RADS category
  if (lesion.selectedCategory) {
    const info = getCategoryInfo(lesion.selectedCategory);
    lines.push(`   ${info.label} — ${info.level}. Malignancy risk: ${info.malignancyRisk}.`);
    lines.push(`   Management: ${info.management}`);
  }

  if (lesion.notes.trim()) {
    lines.push(`   Note: ${lesion.notes.trim()}`);
  }

  return lines.join("\n");
}
