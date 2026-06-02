// ---------------------------------------------------------------------------
// LI-RADS CT/MRI v2018 scoring engine
// All logic runs client-side. Zero server calls.
// Reference: ACR CT/MRI LI-RADS v2018 Core; Chernyak V, et al. Liver Imaging
// Reporting and Data System (LI-RADS) Version 2018: Imaging of Hepatocellular
// Carcinoma in At-Risk Patients. Radiology. 2018;289(3):816-830.
//
// Scope: applies only to observations in patients at high risk for HCC
// (cirrhosis, chronic HBV, or current/prior HCC) using extracellular (ECA) or
// hepatobiliary (HBA) contrast agents. Categorization follows the published
// precedence: LR-NC > LR-TIV > LR-1/LR-2 > LR-M > diagnostic table > ancillary.
// ---------------------------------------------------------------------------

export type LiradsCategory =
  | "LR-NC"
  | "LR-1"
  | "LR-2"
  | "LR-3"
  | "LR-4"
  | "LR-5"
  | "LR-M"
  | "LR-TIV";

export type LiradsContrastAgent = "eca" | "hba";

// "" = not yet selected (incomplete input). rim is consumed by LR-M.
export type Aphe = "" | "none" | "rim" | "nonrim";

// "" = not assessed, "none" = absent. pvp/delayed = phase in which nonperipheral
// washout is seen. For HBA, only PVP washout is a *major* feature; delayed
// (transitional) appearance is not a major feature.
export type WashoutPhase = "" | "none" | "pvp" | "delayed";

// LR-NC is assigned only when the study cannot be meaningfully categorized
// because of image omission or degradation. "limited" is degraded but still
// categorizable — it does NOT force LR-NC.
export type DiagnosticQuality = "adequate" | "limited" | "nondiagnostic";

export type LiradsBenignity = "" | "definite" | "probable";

// ── Couinaud segments ──────────────────────────────────────────────────────

export type LiradsSegment =
  | ""
  | "I"
  | "II"
  | "III"
  | "IVa"
  | "IVb"
  | "V"
  | "VI"
  | "VII"
  | "VIII";

export const LIRADS_SEGMENTS: { value: LiradsSegment; label: string }[] = [
  { value: "", label: "Not specified" },
  { value: "I", label: "Segment I (caudate)" },
  { value: "II", label: "Segment II" },
  { value: "III", label: "Segment III" },
  { value: "IVa", label: "Segment IVa" },
  { value: "IVb", label: "Segment IVb" },
  { value: "V", label: "Segment V" },
  { value: "VI", label: "Segment VI" },
  { value: "VII", label: "Segment VII" },
  { value: "VIII", label: "Segment VIII" },
];

// ── Contrast agent ─────────────────────────────────────────────────────────

export const CONTRAST_AGENTS: { value: LiradsContrastAgent; label: string; desc: string }[] = [
  {
    value: "eca",
    label: "Extracellular agent (ECA)",
    desc: "Nonperipheral washout assessed in the portal venous or delayed phase.",
  },
  {
    value: "hba",
    label: "Hepatobiliary agent (HBA / gadoxetate)",
    desc: "Major washout assessed in the portal venous phase only; hepatobiliary-phase hypointensity is an ancillary feature, not washout.",
  },
];

// ── Diagnostic quality (LR-NC gate) ────────────────────────────────────────

export const DIAGNOSTIC_QUALITY_OPTIONS: { value: DiagnosticQuality; label: string; desc: string }[] = [
  { value: "adequate", label: "Adequate", desc: "Key phases present and diagnostic." },
  {
    value: "limited",
    label: "Limited but categorizable",
    desc: "Some degradation or a missing phase, but categorization remains possible.",
  },
  {
    value: "nondiagnostic",
    label: "Nondiagnostic (omitted/degraded)",
    desc: "Image omission or degradation prevents meaningful categorization → LR-NC.",
  },
];

// ── Arterial phase hyperenhancement ────────────────────────────────────────

export const APHE_OPTIONS: { value: Exclude<Aphe, "">; label: string; desc: string }[] = [
  { value: "none", label: "No APHE", desc: "No nonrim arterial phase hyperenhancement." },
  {
    value: "rim",
    label: "Rim APHE (targetoid)",
    desc: "Peripheral/rim arterial hyperenhancement — a targetoid feature → LR-M.",
  },
  { value: "nonrim", label: "Nonrim APHE", desc: "Nonrim arterial phase hyperenhancement (major feature)." },
];

// ── Nonperipheral washout ──────────────────────────────────────────────────

export const WASHOUT_OPTIONS: { value: Exclude<WashoutPhase, "">; label: string; desc: string }[] = [
  { value: "none", label: "No nonperipheral washout", desc: "Washout absent." },
  { value: "pvp", label: "Portal venous phase", desc: "Nonperipheral washout in the portal venous phase." },
  {
    value: "delayed",
    label: "Delayed / transitional phase",
    desc: "Washout in the delayed phase. With HBA this is the transitional phase and is NOT a major feature.",
  },
];

// ── LR-M features (rim APHE handled via the APHE selector) ──────────────────

export interface LrmFeatures {
  peripheralWashout: boolean;
  delayedCentralEnhancement: boolean;
  targetoidRestriction: boolean;
  targetoidAppearance: boolean;
  infiltrative: boolean;
  markedDiffusionRestriction: boolean;
  necrosisOrSevereIschemia: boolean;
}

export const LRM_FEATURE_OPTIONS: { key: keyof LrmFeatures; label: string; desc: string }[] = [
  { key: "peripheralWashout", label: "Peripheral washout", desc: "Targetoid — peripheral washout appearance." },
  { key: "delayedCentralEnhancement", label: "Delayed central enhancement", desc: "Targetoid — progressive central enhancement." },
  { key: "targetoidRestriction", label: "Targetoid diffusion restriction", desc: "Peripheral restriction with central sparing." },
  { key: "targetoidAppearance", label: "Targetoid TP/HBP appearance", desc: "Targetoid appearance on transitional/hepatobiliary phase." },
  { key: "infiltrative", label: "Infiltrative appearance", desc: "Nontargetoid — infiltrative mass." },
  { key: "markedDiffusionRestriction", label: "Marked diffusion restriction", desc: "Nontargetoid — marked, non-targetoid restriction." },
  { key: "necrosisOrSevereIschemia", label: "Necrosis / severe ischemia", desc: "Nontargetoid — marked necrosis or ischemia." },
];

// ── Ancillary features ─────────────────────────────────────────────────────

export interface AncillaryMalignancyFeatures {
  restrictedDiffusion: boolean;
  mildModerateT2Hyperintensity: boolean;
  coronaEnhancement: boolean;
  fatSparingInSolidMass: boolean;
  ironSparingInSolidMass: boolean;
  bloodProducts: boolean;
  hbpHypointensity: boolean; // HBA only — favoring malignancy, NOT major washout
  subthresholdGrowth: boolean;
}

export const ANCILLARY_MALIGNANCY_OPTIONS: { key: keyof AncillaryMalignancyFeatures; label: string }[] = [
  { key: "restrictedDiffusion", label: "Restricted diffusion" },
  { key: "mildModerateT2Hyperintensity", label: "Mild–moderate T2 hyperintensity" },
  { key: "coronaEnhancement", label: "Corona enhancement" },
  { key: "fatSparingInSolidMass", label: "Fat sparing in solid mass" },
  { key: "ironSparingInSolidMass", label: "Iron sparing in solid mass" },
  { key: "bloodProducts", label: "Blood products in mass" },
  { key: "hbpHypointensity", label: "HBP hypointensity (HBA)" },
  { key: "subthresholdGrowth", label: "Subthreshold growth" },
];

export interface AncillaryBenignFeatures {
  sizeStabilityTwoYears: boolean;
  sizeReduction: boolean;
  parallelsBloodPool: boolean;
  hbpIsoOrHyperintensity: boolean;
  undistortedVessels: boolean;
}

export const ANCILLARY_BENIGN_OPTIONS: { key: keyof AncillaryBenignFeatures; label: string }[] = [
  { key: "sizeStabilityTwoYears", label: "Size stability ≥2 years" },
  { key: "sizeReduction", label: "Size reduction" },
  { key: "parallelsBloodPool", label: "Parallels blood pool enhancement" },
  { key: "hbpIsoOrHyperintensity", label: "HBP iso/hyperintensity (HBA)" },
  { key: "undistortedVessels", label: "Undistorted traversing vessels" },
];

// ── Engine input / result ──────────────────────────────────────────────────

export interface LiradsInput {
  contrastAgent: LiradsContrastAgent;
  diagnosticQuality: DiagnosticQuality;
  tumorInVein: boolean;
  benignity: LiradsBenignity;
  aphe: Aphe;
  sizeMm: number | null;
  washout: WashoutPhase;
  enhancingCapsule: boolean;
  thresholdGrowth: boolean;
  lrm: LrmFeatures;
  ancillaryMalignancy: AncillaryMalignancyFeatures;
  ancillaryBenign: AncillaryBenignFeatures;
}

export interface LiradsResult {
  category: LiradsCategory;
  rationale: string;
  management: string;
}

// ── Management mapping (v2018) ─────────────────────────────────────────────

const MANAGEMENT: Record<LiradsCategory, string> = {
  "LR-NC": "Category cannot be assigned due to image omission or degradation. Repeat or alternative imaging, generally within 3 months.",
  "LR-1": "Definitely benign. Return to routine surveillance (e.g., 6-month imaging).",
  "LR-2": "Probably benign. Surveillance imaging, generally in 6 months.",
  "LR-3": "Intermediate probability of malignancy. Repeat or alternative diagnostic imaging in 3–6 months.",
  "LR-4": "Probably HCC. Multidisciplinary discussion; consider biopsy or repeat/alternative imaging.",
  "LR-5": "Definitely HCC. Biopsy not required; multidisciplinary management.",
  "LR-M": "Probably or definitely malignant, not HCC-specific. Multidisciplinary discussion; biopsy usually required.",
  "LR-TIV": "Definite tumor in vein. Multidisciplinary discussion; treat as malignant.",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function anyLrm(lrm: LrmFeatures): boolean {
  return Object.values(lrm).some(Boolean);
}

function anyAncillary(features: Record<string, boolean>): boolean {
  return Object.values(features).some(Boolean);
}

// Whether nonperipheral washout counts as a *major* feature for the diagnostic
// table. HBA: only portal venous phase. ECA: portal venous or delayed.
export function hasMajorWashout(washout: WashoutPhase, agent: LiradsContrastAgent): boolean {
  if (washout === "pvp") return true;
  if (washout === "delayed") return agent === "eca";
  return false;
}

// The v2018 CT/MRI diagnostic table. APHE here is only "none" or "nonrim"
// (rim APHE is consumed by LR-M before this is reached).
function diagnosticTable(
  aphe: "none" | "nonrim",
  sizeMm: number,
  washoutMajor: boolean,
  capsule: boolean,
  growth: boolean,
): LiradsCategory {
  const additional = [washoutMajor, capsule, growth].filter(Boolean).length;

  // No nonrim APHE (size-independent in v2018).
  if (aphe === "none") {
    return additional === 0 ? "LR-3" : "LR-4";
  }

  // Nonrim APHE present.
  if (sizeMm < 10) {
    return additional === 0 ? "LR-3" : "LR-4"; // <10 mm cannot reach LR-5 via table
  }
  if (sizeMm < 20) {
    // 10–19 mm
    if (additional === 0) return "LR-3";
    if (additional >= 2) return "LR-5";
    // Exactly one additional feature — identity matters:
    // capsule only → LR-4; washout or threshold growth → LR-5.
    return capsule && !washoutMajor && !growth ? "LR-4" : "LR-5";
  }
  // ≥20 mm
  return additional === 0 ? "LR-4" : "LR-5";
}

// Ancillary adjustment. Applies only to table-derived LR-3/LR-4. Malignancy AFs
// upgrade by one category but can never reach LR-5. Benignity AFs downgrade by
// one category (floor LR-1). Both present → no adjustment.
function applyAncillary(
  base: LiradsCategory,
  favMalignancy: boolean,
  favBenignity: boolean,
): LiradsCategory {
  if (base !== "LR-3" && base !== "LR-4") return base;
  if (favMalignancy && favBenignity) return base;
  if (favMalignancy) return "LR-4"; // LR-3→LR-4, LR-4→LR-4 (cap below LR-5)
  if (favBenignity) return base === "LR-4" ? "LR-3" : "LR-2"; // down one
  return base;
}

// ── Main scoring function ──────────────────────────────────────────────────

export function scoreLirads(input: LiradsInput): LiradsResult | null {
  const {
    contrastAgent,
    diagnosticQuality,
    tumorInVein,
    benignity,
    aphe,
    sizeMm,
    washout,
    enhancingCapsule,
    thresholdGrowth,
    lrm,
    ancillaryMalignancy,
    ancillaryBenign,
  } = input;

  // Precedence 0 — LR-NC (image omission/degradation prevents categorization).
  // diagnosticQuality is assessed per observation, so a single nondiagnostic
  // observation does not force the whole report to LR-NC.
  if (diagnosticQuality === "nondiagnostic") {
    return make("LR-NC", "Observation is nondiagnostic; it cannot be categorized because of image omission or degradation.");
  }

  // Precedence 1 — LR-TIV (definite tumor in vein).
  if (tumorInVein) {
    return make("LR-TIV", "Definite enhancing soft tissue in vein (tumor in vein).");
  }

  // Precedence 2 — definitely / probably benign. Per the ACR CT/MRI v2018
  // algorithm, benignity is assigned BEFORE LR-M, so a benign diagnosis wins
  // over rim APHE or any other LR-M feature.
  if (benignity === "definite") {
    return make("LR-1", "Observation has a definitely benign imaging diagnosis.");
  }
  if (benignity === "probable") {
    return make("LR-2", "Observation has a probably benign imaging appearance.");
  }

  // Precedence 3 — LR-M. Rim APHE is a targetoid feature and is consumed here,
  // so it never reaches the diagnostic table.
  if (aphe === "rim" || anyLrm(lrm)) {
    const reasons: string[] = [];
    if (aphe === "rim") reasons.push("rim APHE");
    LRM_FEATURE_OPTIONS.forEach((o) => {
      if (lrm[o.key]) reasons.push(o.label.toLowerCase());
    });
    return make("LR-M", `Targetoid or nontargetoid malignant feature(s): ${reasons.join(", ")}.`);
  }

  // Precedence 4 — diagnostic table. Requires APHE (none/nonrim), size, and an
  // explicit washout assessment. Incomplete input → null (distinct from LR-NC).
  // An unselected washout ("") must not be silently scored as absent, which
  // would under-call the 10–19 mm diagonal. rim APHE is already consumed by
  // LR-M above, so aphe here is "" | "none" | "nonrim".
  if (aphe === "") return null;
  if (sizeMm === null) return null;
  if (washout === "") return null;

  const washoutMajor = hasMajorWashout(washout, contrastAgent);
  const base = diagnosticTable(aphe, sizeMm, washoutMajor, enhancingCapsule, thresholdGrowth);

  // Precedence 5 — ancillary adjustment.
  const favMal = anyAncillary(ancillaryMalignancy as unknown as Record<string, boolean>);
  const favBen = anyAncillary(ancillaryBenign as unknown as Record<string, boolean>);
  const adjusted = applyAncillary(base, favMal, favBen);

  const rationale = buildTableRationale(
    aphe,
    sizeMm,
    washoutMajor,
    enhancingCapsule,
    thresholdGrowth,
    base,
    adjusted,
    favMal,
    favBen,
  );

  return make(adjusted, rationale);
}

function make(category: LiradsCategory, rationale: string): LiradsResult {
  return { category, rationale, management: MANAGEMENT[category] };
}

function buildTableRationale(
  aphe: "none" | "nonrim",
  sizeMm: number,
  washoutMajor: boolean,
  capsule: boolean,
  growth: boolean,
  base: LiradsCategory,
  adjusted: LiradsCategory,
  favMal: boolean,
  favBen: boolean,
): string {
  const major: string[] = [];
  major.push(aphe === "nonrim" ? "nonrim APHE" : "no APHE");
  if (washoutMajor) major.push("nonperipheral washout");
  if (capsule) major.push("enhancing capsule");
  if (growth) major.push("threshold growth");
  let text = `${sizeMm} mm observation with ${major.join(", ")} → ${base} by the CT/MRI v2018 diagnostic table.`;
  if (adjusted !== base) {
    const dir = favMal && !favBen ? "upgraded" : "downgraded";
    text += ` Ancillary features favoring ${favMal && !favBen ? "malignancy" : "benignity"} ${dir} the category to ${adjusted} (ancillary features cannot reach LR-5).`;
  } else if (favMal && favBen) {
    text += " Ancillary features favoring both malignancy and benignity were present, so no adjustment was applied.";
  }
  return text;
}

// ── Feature description (for report text) ──────────────────────────────────

export function describeLiradsFeatures(input: LiradsInput): string {
  const parts: string[] = [];
  if (input.sizeMm !== null) parts.push(`${input.sizeMm} mm`);

  const apheMap: Record<Exclude<Aphe, "">, string> = {
    none: "no APHE",
    rim: "rim (targetoid) APHE",
    nonrim: "nonrim APHE",
  };
  if (input.aphe) parts.push(apheMap[input.aphe]);

  if (input.washout === "pvp") parts.push("nonperipheral washout (PVP)");
  else if (input.washout === "delayed") parts.push("nonperipheral washout (delayed/transitional)");
  if (input.enhancingCapsule) parts.push("enhancing capsule");
  if (input.thresholdGrowth) parts.push("threshold growth");

  if (input.tumorInVein) parts.push("tumor in vein");

  const lrmActive = LRM_FEATURE_OPTIONS.filter((o) => input.lrm[o.key]);
  if (lrmActive.length > 0) {
    parts.push("LR-M features: " + lrmActive.map((o) => o.label.toLowerCase()).join(", "));
  }

  const afMal = ANCILLARY_MALIGNANCY_OPTIONS.filter((o) => input.ancillaryMalignancy[o.key]);
  if (afMal.length > 0) {
    parts.push("ancillary (malignancy): " + afMal.map((o) => o.label.toLowerCase()).join(", "));
  }
  const afBen = ANCILLARY_BENIGN_OPTIONS.filter((o) => input.ancillaryBenign[o.key]);
  if (afBen.length > 0) {
    parts.push("ancillary (benign): " + afBen.map((o) => o.label.toLowerCase()).join(", "));
  }

  return parts.join(", ");
}

// ── Risk color helpers (reuse tirads/lungrads pattern) ─────────────────────

export function liradsRiskBg(category: LiradsCategory): string {
  switch (category) {
    case "LR-1":
    case "LR-2":
      return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800";
    case "LR-3":
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800";
    case "LR-4":
      return "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800";
    case "LR-5":
    case "LR-M":
    case "LR-TIV":
      return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
    case "LR-NC":
    default:
      return "bg-gray-50 border-gray-200 dark:bg-gray-950/30 dark:border-gray-800";
  }
}

// Ordering rank for sorting observations (highest concern first in impression).
export function categoryRank(category: LiradsCategory): number {
  const order: LiradsCategory[] = [
    "LR-NC",
    "LR-1",
    "LR-2",
    "LR-3",
    "LR-4",
    "LR-M",
    "LR-5",
    "LR-TIV",
  ];
  return order.indexOf(category);
}
