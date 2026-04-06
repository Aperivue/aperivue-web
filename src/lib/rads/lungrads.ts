// ---------------------------------------------------------------------------
// Lung-RADS v2022 scoring engine
// All logic runs client-side. Zero server calls.
// Reference: ACR Lung-RADS v2022 Assessment Categories
// ---------------------------------------------------------------------------

// ── Shared types ──────────────────────────────────────────────────────────

export interface LungNoduleEntry {
  id: string;
  label: string; // e.g. "Nodule 1"
  location: LungNoduleLocation;
  sizeMm: number | null; // longest diameter in mm (solid) or solid component size
  priorSizeMm: number | null; // prior exam size for growth assessment
}

export type LungNoduleLocation =
  | "RUL"
  | "RML"
  | "RLL"
  | "LUL"
  | "lingula"
  | "LLL"
  | "";

export const LUNG_NODULE_LOCATIONS: { value: LungNoduleLocation; label: string }[] = [
  { value: "", label: "Not specified" },
  { value: "RUL", label: "Right upper lobe" },
  { value: "RML", label: "Right middle lobe" },
  { value: "RLL", label: "Right lower lobe" },
  { value: "LUL", label: "Left upper lobe" },
  { value: "lingula", label: "Lingula" },
  { value: "LLL", label: "Left lower lobe" },
];

// ── Nodule morphology ────────────────────────────────────────────────────

export type NoduleType = "solid" | "part_solid" | "ground_glass" | "";

export const NODULE_TYPES: { value: NoduleType; label: string; desc: string }[] = [
  { value: "solid", label: "Solid", desc: "Completely solid attenuation" },
  { value: "part_solid", label: "Part-solid", desc: "Both ground-glass and solid components" },
  { value: "ground_glass", label: "Ground-glass (GGN)", desc: "Pure ground-glass attenuation" },
];

// ── Scan context ─────────────────────────────────────────────────────────

export type ScanType = "baseline" | "new" | "stable" | "growing";

export const SCAN_TYPES: { value: ScanType; label: string; desc: string }[] = [
  { value: "baseline", label: "Baseline", desc: "First LDCT scan, no prior comparison" },
  { value: "new", label: "New", desc: "Not seen on prior LDCT" },
  { value: "stable", label: "Stable", desc: "Unchanged compared to prior LDCT" },
  { value: "growing", label: "Growing", desc: "Increased in size compared to prior LDCT" },
];

// ── Category 0/1 special reasons ─────────────────────────────────────────

export type SpecialCategory =
  | "" // not applicable
  | "incomplete_no_prior"
  | "incomplete_lung_not_imaged"
  | "negative_no_nodule"
  | "benign_calcification"
  | "benign_fat";

export const SPECIAL_CATEGORIES: { value: SpecialCategory; label: string; category: string }[] = [
  { value: "", label: "None (proceed to nodule assessment)", category: "" },
  { value: "incomplete_no_prior", label: "Prior CT not available for comparison", category: "0" },
  { value: "incomplete_lung_not_imaged", label: "Lung(s) not fully imaged", category: "0" },
  { value: "negative_no_nodule", label: "No pulmonary nodules", category: "1" },
  { value: "benign_calcification", label: "Completely calcified nodule (benign)", category: "1" },
  { value: "benign_fat", label: "Nodule with fat density (hamartoma)", category: "1" },
];

// ── S modifier features ──────────────────────────────────────────────────

export interface SModifierFeatures {
  spiculation: boolean;
  lymphadenopathy: boolean;
  directInvasion: boolean;
  pleuralEffusion: boolean;
  other: boolean;
}

export const S_MODIFIER_OPTIONS: { key: keyof SModifierFeatures; label: string; desc: string }[] = [
  { key: "spiculation", label: "Spiculation", desc: "Irregular or spiculated margins" },
  { key: "lymphadenopathy", label: "Lymphadenopathy", desc: "Suspicious mediastinal or hilar lymph nodes" },
  { key: "directInvasion", label: "Direct invasion", desc: "Chest wall, mediastinal, or vascular invasion" },
  { key: "pleuralEffusion", label: "Pleural effusion", desc: "New or increasing pleural effusion" },
  { key: "other", label: "Other suspicious finding", desc: "Any additional finding suggesting malignancy" },
];

// ── Result type ──────────────────────────────────────────────────────────

export interface LungRadsResult {
  category: string;      // "0", "1", "2", "3", "4A", "4B", "4X"
  displayCategory: string; // "Lung-RADS 0", etc.
  level: string;         // "Incomplete", "Negative", etc.
  sModifier: boolean;
  recommendation: string;
  followUpInterval: string;
}

// ── Main scoring function ────────────────────────────────────────────────

export function scoreLungRads(
  specialCategory: SpecialCategory,
  noduleType: NoduleType,
  sizeMm: number | null,
  scanType: ScanType,
  solidComponentMm: number | null, // for part-solid: solid component size
  sModifier: SModifierFeatures,
): LungRadsResult | null {
  // Check for special categories first (Cat 0 or Cat 1)
  if (specialCategory) {
    const spec = SPECIAL_CATEGORIES.find((s) => s.value === specialCategory);
    if (!spec) return null;
    if (spec.category === "0") {
      return makeLungRads("0", "Incomplete", false,
        "Additional imaging or comparison needed.",
        "Requires prior CT for comparison or complete lung imaging.");
    }
    return makeLungRads("1", "Negative", false,
      "Continue annual screening with LDCT.",
      "LDCT in 12 months.");
  }

  // Need nodule type to proceed
  if (!noduleType) return null;

  const hasSModifier = Object.values(sModifier).some(Boolean);

  // Score based on nodule type
  let result: LungRadsResult | null = null;

  if (noduleType === "solid") {
    result = scoreSolid(sizeMm, scanType, hasSModifier);
  } else if (noduleType === "part_solid") {
    result = scorePartSolid(sizeMm, solidComponentMm, scanType, hasSModifier);
  } else if (noduleType === "ground_glass") {
    result = scoreGroundGlass(sizeMm, scanType, hasSModifier);
  }

  return result;
}

// ── Solid nodule scoring ─────────────────────────────────────────────────

function scoreSolid(
  sizeMm: number | null,
  scanType: ScanType,
  hasSModifier: boolean,
): LungRadsResult | null {
  if (sizeMm === null) return null;

  // Growing nodules have their own thresholds
  if (scanType === "growing") {
    if (sizeMm >= 8) {
      return makeLungRads(
        hasSModifier ? "4X" : "4B",
        hasSModifier ? "Suspicious — additional features" : "Very Suspicious",
        hasSModifier,
        hasSModifier
          ? "Tissue sampling and/or PET/CT. Additional workup as indicated."
          : "Tissue sampling, PET/CT, or both.",
        "As clinically indicated.",
      );
    }
    // >=6mm growing → 4A
    if (sizeMm >= 6) {
      return makeLungRads(
        hasSModifier ? "4X" : "4A",
        hasSModifier ? "Suspicious — additional features" : "Suspicious",
        hasSModifier,
        hasSModifier
          ? "LDCT in 3 months, PET/CT may be used. Additional workup as indicated."
          : "LDCT in 3 months, PET/CT may be used.",
        "LDCT in 3 months.",
      );
    }
    // <6mm growing → still 3
    return makeLungRads(
      hasSModifier ? "3S" : "3",
      hasSModifier ? "Probably Benign — additional features" : "Probably Benign",
      hasSModifier,
      "LDCT in 6 months.",
      "LDCT in 6 months.",
    );
  }

  // Stable nodules
  if (scanType === "stable") {
    // Stable >=12 months and >=6mm → Cat 2
    if (sizeMm >= 6) {
      return makeLungRads(
        hasSModifier ? "2S" : "2",
        hasSModifier ? "Benign Appearance — additional features" : "Benign Appearance",
        hasSModifier,
        "Continue annual screening with LDCT.",
        "LDCT in 12 months.",
      );
    }
    // <6mm stable → Cat 1 (too small to characterize, benign)
    return makeLungRads(
      "1", "Negative", false,
      "Continue annual screening with LDCT.",
      "LDCT in 12 months.",
    );
  }

  // Baseline or New
  if (sizeMm < 6) {
    return makeLungRads(
      "1", "Negative", false,
      "Continue annual screening with LDCT.",
      "LDCT in 12 months.",
    );
  }
  if (sizeMm < 8) {
    return makeLungRads(
      hasSModifier ? "3S" : "3",
      hasSModifier ? "Probably Benign — additional features" : "Probably Benign",
      hasSModifier,
      "LDCT in 6 months.",
      "LDCT in 6 months.",
    );
  }
  if (sizeMm < 15) {
    return makeLungRads(
      hasSModifier ? "4X" : "4A",
      hasSModifier ? "Suspicious — additional features" : "Suspicious",
      hasSModifier,
      hasSModifier
        ? "LDCT in 3 months, PET/CT may be used. Additional workup as indicated."
        : "LDCT in 3 months, PET/CT may be used.",
      "LDCT in 3 months.",
    );
  }
  // >=15mm
  return makeLungRads(
    hasSModifier ? "4X" : "4B",
    hasSModifier ? "Suspicious — additional features" : "Very Suspicious",
    hasSModifier,
    hasSModifier
      ? "Tissue sampling and/or PET/CT. Additional workup as indicated."
      : "Tissue sampling, PET/CT, or both.",
    "As clinically indicated.",
  );
}

// ── Part-solid nodule scoring ────────────────────────────────────────────

function scorePartSolid(
  sizeMm: number | null,
  solidComponentMm: number | null,
  scanType: ScanType,
  hasSModifier: boolean,
): LungRadsResult | null {
  // For part-solid, we need the solid component size to be meaningful
  const solidSize = solidComponentMm ?? 0;

  // Stable: resolved GGN component → Cat 2
  if (scanType === "stable") {
    return makeLungRads(
      hasSModifier ? "2S" : "2",
      hasSModifier ? "Benign Appearance — additional features" : "Benign Appearance",
      hasSModifier,
      "Continue annual screening with LDCT.",
      "LDCT in 12 months.",
    );
  }

  // Growing solid component
  if (scanType === "growing") {
    if (solidSize >= 4) {
      return makeLungRads(
        hasSModifier ? "4X" : "4B",
        hasSModifier ? "Suspicious — additional features" : "Very Suspicious",
        hasSModifier,
        hasSModifier
          ? "Tissue sampling and/or PET/CT. Additional workup as indicated."
          : "Tissue sampling, PET/CT, or both.",
        "As clinically indicated.",
      );
    }
    // Growing but solid <4mm
    return makeLungRads(
      hasSModifier ? "4X" : "4A",
      hasSModifier ? "Suspicious — additional features" : "Suspicious",
      hasSModifier,
      hasSModifier
        ? "LDCT in 3 months, PET/CT may be used. Additional workup as indicated."
        : "LDCT in 3 months, PET/CT may be used.",
      "LDCT in 3 months.",
    );
  }

  // Baseline or New
  if (solidSize >= 6) {
    return makeLungRads(
      hasSModifier ? "4X" : "4B",
      hasSModifier ? "Suspicious — additional features" : "Very Suspicious",
      hasSModifier,
      hasSModifier
        ? "Tissue sampling and/or PET/CT. Additional workup as indicated."
        : "Tissue sampling, PET/CT, or both.",
      "As clinically indicated.",
    );
  }
  if (solidSize >= 4) {
    return makeLungRads(
      hasSModifier ? "4X" : "4A",
      hasSModifier ? "Suspicious — additional features" : "Suspicious",
      hasSModifier,
      hasSModifier
        ? "LDCT in 3 months, PET/CT may be used. Additional workup as indicated."
        : "LDCT in 3 months, PET/CT may be used.",
      "LDCT in 3 months.",
    );
  }
  // New with solid component <4mm
  if (scanType === "new" && solidSize > 0 && solidSize < 4) {
    return makeLungRads(
      hasSModifier ? "3S" : "3",
      hasSModifier ? "Probably Benign — additional features" : "Probably Benign",
      hasSModifier,
      "LDCT in 6 months.",
      "LDCT in 6 months.",
    );
  }
  // Baseline with solid <4mm → assess by total nodule size
  if (sizeMm === null) return null;
  if (sizeMm >= 6) {
    return makeLungRads(
      hasSModifier ? "3S" : "3",
      hasSModifier ? "Probably Benign — additional features" : "Probably Benign",
      hasSModifier,
      "LDCT in 6 months.",
      "LDCT in 6 months.",
    );
  }
  return makeLungRads(
    "2", "Benign Appearance", false,
    "Continue annual screening with LDCT.",
    "LDCT in 12 months.",
  );
}

// ── Ground-glass nodule scoring ──────────────────────────────────────────

function scoreGroundGlass(
  sizeMm: number | null,
  scanType: ScanType,
  hasSModifier: boolean,
): LungRadsResult | null {
  if (sizeMm === null) return null;

  // Stable >=12 months and <30mm → Cat 2
  if (scanType === "stable") {
    if (sizeMm < 30) {
      return makeLungRads(
        hasSModifier ? "2S" : "2",
        hasSModifier ? "Benign Appearance — additional features" : "Benign Appearance",
        hasSModifier,
        "Continue annual screening with LDCT.",
        "LDCT in 12 months.",
      );
    }
    // Stable >=30mm → Cat 2 still (stable is key)
    return makeLungRads(
      hasSModifier ? "2S" : "2",
      hasSModifier ? "Benign Appearance — additional features" : "Benign Appearance",
      hasSModifier,
      "Continue annual screening with LDCT.",
      "LDCT in 12 months.",
    );
  }

  // Growing GGN >=30mm → 4A
  if (scanType === "growing") {
    if (sizeMm >= 30) {
      return makeLungRads(
        hasSModifier ? "4X" : "4A",
        hasSModifier ? "Suspicious — additional features" : "Suspicious",
        hasSModifier,
        hasSModifier
          ? "LDCT in 3 months, PET/CT may be used. Additional workup as indicated."
          : "LDCT in 3 months, PET/CT may be used.",
        "LDCT in 3 months.",
      );
    }
    // Growing <30mm → 3
    return makeLungRads(
      hasSModifier ? "3S" : "3",
      hasSModifier ? "Probably Benign — additional features" : "Probably Benign",
      hasSModifier,
      "LDCT in 6 months.",
      "LDCT in 6 months.",
    );
  }

  // Baseline or New
  if (sizeMm >= 30) {
    return makeLungRads(
      hasSModifier ? "3S" : "3",
      hasSModifier ? "Probably Benign — additional features" : "Probably Benign",
      hasSModifier,
      "LDCT in 6 months.",
      "LDCT in 6 months.",
    );
  }
  // New <30mm → Cat 3
  if (scanType === "new") {
    return makeLungRads(
      hasSModifier ? "3S" : "3",
      hasSModifier ? "Probably Benign — additional features" : "Probably Benign",
      hasSModifier,
      "LDCT in 6 months.",
      "LDCT in 6 months.",
    );
  }
  // Baseline <30mm → Cat 2
  return makeLungRads(
    hasSModifier ? "2S" : "2",
    hasSModifier ? "Benign Appearance — additional features" : "Benign Appearance",
    hasSModifier,
    "Continue annual screening with LDCT.",
    "LDCT in 12 months.",
  );
}

// ── Helper ───────────────────────────────────────────────────────────────

function makeLungRads(
  category: string,
  level: string,
  sModifier: boolean,
  recommendation: string,
  followUpInterval: string,
): LungRadsResult {
  return {
    category,
    displayCategory: `Lung-RADS ${category}`,
    level,
    sModifier,
    recommendation,
    followUpInterval,
  };
}

// ── Feature description helper ───────────────────────────────────────────

export function describeLungRadsFeatures(
  noduleType: NoduleType,
  sizeMm: number | null,
  scanType: ScanType,
  solidComponentMm: number | null,
  sFeatures: SModifierFeatures,
): string {
  const parts: string[] = [];
  const typeMap: Record<string, string> = {
    solid: "Solid nodule",
    part_solid: "Part-solid nodule",
    ground_glass: "Ground-glass nodule",
  };
  if (noduleType) parts.push(typeMap[noduleType] ?? noduleType);
  if (sizeMm !== null) parts.push(`${sizeMm} mm`);
  if (noduleType === "part_solid" && solidComponentMm !== null) {
    parts.push(`solid component ${solidComponentMm} mm`);
  }
  const scanMap: Record<string, string> = {
    baseline: "baseline scan",
    new: "new nodule",
    stable: "stable",
    growing: "growing",
  };
  if (scanType) parts.push(scanMap[scanType] ?? scanType);

  const activeS = S_MODIFIER_OPTIONS.filter((o) => sFeatures[o.key]);
  if (activeS.length > 0) {
    parts.push("S modifier: " + activeS.map((o) => o.label.toLowerCase()).join(", "));
  }

  return parts.join(", ");
}

// ── Risk color helpers (reuse tirads pattern) ────────────────────────────

export function lungRadsRiskBg(category: string): string {
  // Strip "S" suffix for color matching
  const clean = category.replace(/S$/, "");
  if (clean === "0")
    return "bg-gray-50 border-gray-200 dark:bg-gray-950/30 dark:border-gray-800";
  if (clean === "1")
    return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800";
  if (clean === "2")
    return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800";
  if (clean === "3")
    return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800";
  if (clean === "4A")
    return "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800";
  if (clean === "4B" || clean === "4X")
    return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
  return "bg-gray-50 border-gray-200 dark:bg-gray-950/30 dark:border-gray-800";
}
