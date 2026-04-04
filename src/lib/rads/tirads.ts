// ---------------------------------------------------------------------------
// TIRADS scoring engine — ACR TI-RADS, 2021 K-TIRADS, EU-TIRADS
// All logic runs client-side. Zero server calls.
// Reference: Ha et al. Korean J Radiol 2021;22(12):2094-2123
// ---------------------------------------------------------------------------

export type TiradsSystem = "acr" | "ktirads" | "eutirads";

// ── Shared types ──────────────────────────────────────────────────────────

export interface NoduleEntry {
  id: string;
  label: string; // e.g. "Nodule 1"
  location: NoduleLocation;
  size: number | null; // max diameter in cm
}

export type NoduleLocation =
  | "right_upper"
  | "right_mid"
  | "right_lower"
  | "left_upper"
  | "left_mid"
  | "left_lower"
  | "isthmus"
  | "pyramidal"
  | "";

export const NODULE_LOCATIONS: { value: NoduleLocation; label: string }[] = [
  { value: "", label: "Not specified" },
  { value: "right_upper", label: "Right lobe — upper" },
  { value: "right_mid", label: "Right lobe — mid" },
  { value: "right_lower", label: "Right lobe — lower" },
  { value: "left_upper", label: "Left lobe — upper" },
  { value: "left_mid", label: "Left lobe — mid" },
  { value: "left_lower", label: "Left lobe — lower" },
  { value: "isthmus", label: "Isthmus" },
  { value: "pyramidal", label: "Pyramidal lobe" },
];

// ── ACR TI-RADS (point-based, Tessler 2017) ──────────────────────────────

export interface AcrFeatureOption {
  label: string;
  points: number;
}

export interface AcrFeatureCategory {
  name: string;
  description: string;
  options: AcrFeatureOption[];
}

export const ACR_FEATURES: AcrFeatureCategory[] = [
  {
    name: "Composition",
    description: "Internal content of the nodule",
    options: [
      { label: "Cystic or almost completely cystic", points: 0 },
      { label: "Spongiform", points: 0 },
      { label: "Mixed cystic and solid", points: 1 },
      { label: "Solid or almost completely solid", points: 2 },
    ],
  },
  {
    name: "Echogenicity",
    description: "Relative to thyroid parenchyma",
    options: [
      { label: "Anechoic", points: 0 },
      { label: "Hyperechoic or isoechoic", points: 1 },
      { label: "Hypoechoic", points: 2 },
      { label: "Very hypoechoic (darker than strap muscles)", points: 3 },
    ],
  },
  {
    name: "Shape",
    description: "Assessed on transverse image",
    options: [
      { label: "Wider-than-tall", points: 0 },
      { label: "Taller-than-wide", points: 3 },
    ],
  },
  {
    name: "Margin",
    description: "Nodule border characteristics",
    options: [
      { label: "Smooth", points: 0 },
      { label: "Ill-defined", points: 0 },
      { label: "Lobulated or irregular", points: 2 },
      { label: "Extra-thyroidal extension", points: 3 },
    ],
  },
  {
    name: "Echogenic Foci",
    description: "Select the most suspicious finding",
    options: [
      { label: "None or large comet-tail artifacts", points: 0 },
      { label: "Macrocalcifications", points: 1 },
      { label: "Peripheral (rim) calcifications", points: 2 },
      { label: "Punctate echogenic foci", points: 3 },
    ],
  },
];

export interface AcrResult {
  totalPoints: number;
  category: string; // "TR1" ~ "TR5"
  level: string;
  risk: string;
  fna: string;
  followUp: string;
}

export function scoreAcrTirads(selections: number[], sizeCm: number | null): AcrResult {
  const total = selections.reduce(
    (sum, optIdx, catIdx) => sum + ACR_FEATURES[catIdx].options[optIdx].points,
    0,
  );

  if (total === 0) return makeAcr(total, "TR1", "Benign", "<2%", sizeCm, "TR1");
  if (total <= 2) return makeAcr(total, "TR2", "Not Suspicious", "~2%", sizeCm, "TR2");
  if (total === 3) return makeAcr(total, "TR3", "Mildly Suspicious", "~5%", sizeCm, "TR3");
  if (total <= 6) return makeAcr(total, "TR4", "Moderately Suspicious", "5–20%", sizeCm, "TR4");
  return makeAcr(total, "TR5", "Highly Suspicious", ">20%", sizeCm, "TR5");
}

function makeAcr(
  totalPoints: number,
  category: string,
  level: string,
  risk: string,
  sizeCm: number | null,
  cat: string,
): AcrResult {
  const rec = acrSizeRec(cat, sizeCm);
  return { totalPoints, category, level, risk, ...rec };
}

function acrSizeRec(cat: string, sizeCm: number | null): { fna: string; followUp: string } {
  if (sizeCm === null) {
    // Show thresholds when no size entered
    const thresholds: Record<string, { fna: string; followUp: string }> = {
      TR1: { fna: "No FNA", followUp: "No follow-up needed." },
      TR2: { fna: "No FNA", followUp: "No follow-up needed." },
      TR3: { fna: "FNA if \u2265 2.5 cm", followUp: "Follow-up if \u2265 1.5 cm." },
      TR4: { fna: "FNA if \u2265 1.5 cm", followUp: "Follow-up if \u2265 1.0 cm." },
      TR5: { fna: "FNA if \u2265 1.0 cm", followUp: "Follow-up if \u2265 0.5 cm." },
    };
    return thresholds[cat];
  }
  // Size-specific recommendation
  if (cat === "TR1" || cat === "TR2") return { fna: "No FNA", followUp: "No follow-up needed." };
  if (cat === "TR3") {
    if (sizeCm >= 2.5) return { fna: "FNA recommended", followUp: "" };
    if (sizeCm >= 1.5) return { fna: "Not indicated at this size", followUp: "Follow-up US recommended." };
    return { fna: "Not indicated", followUp: "No follow-up needed at this size." };
  }
  if (cat === "TR4") {
    if (sizeCm >= 1.5) return { fna: "FNA recommended", followUp: "" };
    if (sizeCm >= 1.0) return { fna: "Not indicated at this size", followUp: "Follow-up US recommended." };
    return { fna: "Not indicated", followUp: "No follow-up needed at this size." };
  }
  // TR5
  if (sizeCm >= 1.0) return { fna: "FNA recommended", followUp: "" };
  if (sizeCm >= 0.5) return { fna: "Not indicated at this size", followUp: "Follow-up US recommended." };
  return { fna: "Not indicated", followUp: "No follow-up needed at this size." };
}

// ── 2021 K-TIRADS (pattern-based, Ha et al. KJR 2021) ─────────────────────
// Based on Table 5 and Figure 9

// Step 1: Composition + Echogenicity → initial pattern
// Step 2: 3 suspicious US features → final category
// Step 3: Size → FNA threshold

export type KtiradsComposition =
  | "solid"
  | "predominantly_solid"
  | "predominantly_cystic"
  | "cystic"
  | "spongiform";

export type KtiradsEchogenicity =
  | "marked_hypo"
  | "mild_hypo"
  | "isoechoic"
  | "hyperechoic";

// The 3 suspicious US features per 2021 K-TIRADS (Fig. 9 footnote)
export interface KtiradsSuspiciousFeatures {
  punctateEchogenicFoci: boolean;  // microcalcifications / PEF
  nonparallelOrientation: boolean; // taller-than-wide
  irregularMargin: boolean;        // spiculated, microlobulated
}

export interface KtiradsResult {
  category: string;   // "K-TIRADS 1" ~ "K-TIRADS 5"
  level: string;
  risk: string;
  fna: string;
  followUp: string;
  pattern: string;     // description of the US pattern match
}

export function scoreKtirads(
  composition: KtiradsComposition | null,
  echogenicity: KtiradsEchogenicity | null,
  suspicious: KtiradsSuspiciousFeatures,
  entirelyCalcified: boolean,
  sizeCm: number | null,
): KtiradsResult | null {
  if (!composition) return null;

  const suspCount = [
    suspicious.punctateEchogenicFoci,
    suspicious.nonparallelOrientation,
    suspicious.irregularMargin,
  ].filter(Boolean).length;
  const hasSusp = suspCount > 0;

  // --- K-TIRADS 1: No nodule (not scored, just informational) ---

  // --- K-TIRADS 2: Benign ---
  // 1) Iso-/hyperechoic spongiform
  // 2) Partially cystic nodule with intracystic echogenic foci + comet-tail
  //    (handled as "cystic" composition in our UI since user identifies this)
  // 3) Pure cyst
  if (composition === "cystic") {
    return makeKtirads("K-TIRADS 2", "Benign", "<3%",
      "Pure cyst",
      ktSizeRec("2", sizeCm));
  }
  if (composition === "spongiform" && (echogenicity === "isoechoic" || echogenicity === "hyperechoic")) {
    return makeKtirads("K-TIRADS 2", "Benign", "<3%",
      "Iso-/hyperechoic spongiform nodule",
      ktSizeRec("2", sizeCm));
  }

  // --- Entirely calcified nodule → K-TIRADS 4 ---
  if (entirelyCalcified) {
    return makeKtirads("K-TIRADS 4", "Intermediate Suspicion", "10–40%",
      "Entirely calcified nodule",
      ktSizeRec("4", sizeCm));
  }

  // Need echogenicity for remaining categories
  if (!echogenicity) return null;

  // Determine if "solid hypoechoic" path vs "partially cystic or iso-/hyperechoic" path
  const isSolidLike = composition === "solid" || composition === "predominantly_solid";
  const isHypoechoic = echogenicity === "marked_hypo" || echogenicity === "mild_hypo";
  const isSolidHypo = isSolidLike && isHypoechoic;
  const isPartiallyCysticOrIsoHyper =
    composition === "predominantly_cystic" ||
    (isSolidLike && !isHypoechoic);

  // --- K-TIRADS 5: High suspicion ---
  // Solid hypoechoic + any of the 3 suspicious features
  if (isSolidHypo && hasSusp) {
    return makeKtirads("K-TIRADS 5", "High Suspicion", ">60%",
      "Solid hypoechoic with suspicious US feature(s)",
      ktSizeRec("5", sizeCm));
  }

  // --- K-TIRADS 4: Intermediate suspicion ---
  // 1) Solid hypoechoic WITHOUT suspicious features
  // 2) Partially cystic or iso-/hyperechoic WITH any suspicious features
  if (isSolidHypo && !hasSusp) {
    return makeKtirads("K-TIRADS 4", "Intermediate Suspicion", "10–40%",
      "Solid hypoechoic without suspicious features",
      ktSizeRec("4", sizeCm));
  }
  if (isPartiallyCysticOrIsoHyper && hasSusp) {
    return makeKtirads("K-TIRADS 4", "Intermediate Suspicion", "10–40%",
      "Partially cystic or iso-/hyperechoic with suspicious US feature(s)",
      ktSizeRec("4", sizeCm));
  }

  // --- K-TIRADS 3: Low suspicion ---
  // Partially cystic or iso-/hyperechoic WITHOUT suspicious features
  if (isPartiallyCysticOrIsoHyper && !hasSusp) {
    return makeKtirads("K-TIRADS 3", "Low Suspicion", "3–10%",
      "Partially cystic or iso-/hyperechoic without suspicious features",
      ktSizeRec("3", sizeCm));
  }

  // --- Fallback for edge cases (e.g., hypoechoic spongiform) ---
  // Spongiform with hypoechoic = per guideline, malignancy risk may be increased
  if (composition === "spongiform" && isHypoechoic) {
    if (hasSusp) {
      return makeKtirads("K-TIRADS 4", "Intermediate Suspicion", "10–40%",
        "Hypoechoic spongiform with suspicious feature(s)",
        ktSizeRec("4", sizeCm));
    }
    return makeKtirads("K-TIRADS 3", "Low Suspicion", "3–10%",
      "Hypoechoic spongiform without suspicious features",
      ktSizeRec("3", sizeCm));
  }

  return null;
}

function makeKtirads(
  category: string,
  level: string,
  risk: string,
  pattern: string,
  rec: { fna: string; followUp: string },
): KtiradsResult {
  return { category, level, risk, pattern, ...rec };
}

function ktSizeRec(cat: string, sizeCm: number | null): { fna: string; followUp: string } {
  // Per Table 5 of 2021 K-TIRADS
  if (sizeCm === null) {
    const thresholds: Record<string, { fna: string; followUp: string }> = {
      "2": { fna: "Biopsy not routinely indicated", followUp: "US follow-up at 2\u20135 years depending on size." },
      "3": { fna: "FNA if > 2.0 cm", followUp: "US at 1, 3, and 5 years." },
      "4": { fna: "FNA if > 1.0\u20131.5 cm", followUp: "US at 1, 3, and 5 years." },
      "5": { fna: "FNA if > 1.0 cm", followUp: "US every 6 months for 1\u20132 years, then yearly." },
    };
    return thresholds[cat] ?? { fna: "", followUp: "" };
  }

  if (cat === "2") {
    return { fna: "Biopsy not routinely indicated", followUp: "US follow-up may be performed at 2\u20135 years." };
  }
  if (cat === "3") {
    if (sizeCm > 2.0) return { fna: "FNA recommended", followUp: "" };
    return { fna: "Not indicated at this size", followUp: "US follow-up at 1, 3, and 5 years." };
  }
  if (cat === "4") {
    if (sizeCm > 1.5) return { fna: "FNA recommended", followUp: "" };
    if (sizeCm > 1.0) return { fna: "FNA may be considered (1.0\u20131.5 cm range)", followUp: "Consider clinical risk factors, location, and patient preference." };
    return { fna: "Not indicated at this size", followUp: "US follow-up at 1, 3, and 5 years." };
  }
  // cat === "5"
  if (sizeCm > 1.0) return { fna: "FNA recommended", followUp: "" };
  if (sizeCm > 0.5) {
    return { fna: "FNA may be considered for small high-suspicion nodules", followUp: "Especially with high-risk features (ETE, attachment to trachea/RLN, suspicious LN)." };
  }
  return { fna: "Not routinely indicated", followUp: "US follow-up every 6 months for 1\u20132 years." };
}

// ── EU-TIRADS (Russ et al. Eur Thyroid J 2017) ────────────────────────────

export type EutiradsComposition =
  | "cystic"
  | "spongiform"
  | "solid_iso_hyper"
  | "mildly_hypo"
  | "markedly_hypo";

export interface EutiradsResult {
  category: string;
  level: string;
  risk: string;
  fna: string;
  followUp: string;
}

export function scoreEutirads(
  composition: EutiradsComposition | null,
  hasHighRisk: boolean,
  sizeCm: number | null,
): EutiradsResult | null {
  if (!composition) return null;

  if (composition === "cystic")
    return makeEu("EU-TIRADS 1", "Benign", "<1%", euSizeRec("1", sizeCm));
  if (composition === "spongiform")
    return makeEu("EU-TIRADS 2", "Not Suspicious", "0–3%", euSizeRec("2", sizeCm));
  if (composition === "solid_iso_hyper")
    return makeEu("EU-TIRADS 3", "Low Risk", "2–4%", euSizeRec("3", sizeCm));
  if (composition === "mildly_hypo" && !hasHighRisk)
    return makeEu("EU-TIRADS 4", "Intermediate Risk", "6–17%", euSizeRec("4", sizeCm));
  // Markedly hypoechoic OR mildly hypo + high-risk
  return makeEu("EU-TIRADS 5", "High Risk", ">26%", euSizeRec("5", sizeCm));
}

function makeEu(
  category: string,
  level: string,
  risk: string,
  rec: { fna: string; followUp: string },
): EutiradsResult {
  return { category, level, risk, ...rec };
}

function euSizeRec(cat: string, sizeCm: number | null): { fna: string; followUp: string } {
  if (sizeCm === null) {
    const t: Record<string, { fna: string; followUp: string }> = {
      "1": { fna: "No FNA", followUp: "No follow-up needed." },
      "2": { fna: "No FNA", followUp: "No follow-up needed." },
      "3": { fna: "FNA if \u2265 2.0 cm", followUp: "Follow-up if \u2265 1.0 cm." },
      "4": { fna: "FNA if \u2265 1.5 cm", followUp: "Follow-up if \u2265 1.0 cm." },
      "5": { fna: "FNA if \u2265 1.0 cm", followUp: "Consider FNA if < 1.0 cm with suspicious features." },
    };
    return t[cat] ?? { fna: "", followUp: "" };
  }
  if (cat === "1" || cat === "2") return { fna: "No FNA", followUp: "No follow-up needed." };
  if (cat === "3") {
    if (sizeCm >= 2.0) return { fna: "FNA recommended", followUp: "" };
    if (sizeCm >= 1.0) return { fna: "Not indicated at this size", followUp: "Follow-up US recommended." };
    return { fna: "Not indicated", followUp: "No follow-up needed at this size." };
  }
  if (cat === "4") {
    if (sizeCm >= 1.5) return { fna: "FNA recommended", followUp: "" };
    if (sizeCm >= 1.0) return { fna: "Not indicated at this size", followUp: "Follow-up US recommended." };
    return { fna: "Not indicated", followUp: "No follow-up needed at this size." };
  }
  // cat === "5"
  if (sizeCm >= 1.0) return { fna: "FNA recommended", followUp: "" };
  if (sizeCm > 0) return { fna: "Consider FNA", followUp: "Especially with suspicious features." };
  return { fna: "Not indicated", followUp: "" };
}

// ── Feature description helpers (for report text generation) ──────────────

export function describeAcrFeatures(selections: number[]): string {
  return ACR_FEATURES.map((cat, i) => cat.options[selections[i]].label).join(", ");
}

export function describeKtiradsFeatures(
  composition: KtiradsComposition | null,
  echogenicity: KtiradsEchogenicity | null,
  suspicious: KtiradsSuspiciousFeatures,
  entirelyCalcified: boolean,
): string {
  const parts: string[] = [];
  if (entirelyCalcified) return "Entirely calcified nodule";
  const compMap: Record<string, string> = {
    solid: "Solid",
    predominantly_solid: "Predominantly solid",
    predominantly_cystic: "Predominantly cystic",
    cystic: "Pure cyst",
    spongiform: "Spongiform",
  };
  if (composition) parts.push(compMap[composition] ?? composition);
  const echoMap: Record<string, string> = {
    marked_hypo: "markedly hypoechoic",
    mild_hypo: "mildly hypoechoic",
    isoechoic: "isoechoic",
    hyperechoic: "hyperechoic",
  };
  if (echogenicity) parts.push(echoMap[echogenicity] ?? echogenicity);
  if (suspicious.punctateEchogenicFoci) parts.push("punctate echogenic foci");
  if (suspicious.nonparallelOrientation) parts.push("nonparallel orientation");
  if (suspicious.irregularMargin) parts.push("irregular margin");
  return parts.join(", ");
}

export function describeEutiradsFeatures(
  composition: EutiradsComposition | null,
  hasHighRisk: boolean,
): string {
  const compMap: Record<string, string> = {
    cystic: "Purely cystic",
    spongiform: "Spongiform",
    solid_iso_hyper: "Solid, isoechoic/hyperechoic",
    mildly_hypo: "Solid, mildly hypoechoic",
    markedly_hypo: "Solid, markedly hypoechoic",
  };
  const parts: string[] = [];
  if (composition) parts.push(compMap[composition] ?? composition);
  if (hasHighRisk) parts.push("with high-risk features");
  return parts.join(", ");
}

// ── Risk color helpers ────────────────────────────────────────────────────

export function riskBg(category: string): string {
  if (/[12]/.test(category) && !/[345]/.test(category.replace(/TIRADS/g, "")))
    return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800";
  if (/3/.test(category))
    return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800";
  if (/4/.test(category))
    return "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800";
  return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
}

// Simple numeric extraction for color coding
export function categoryNumber(category: string): number {
  const m = category.match(/(\d)/);
  return m ? parseInt(m[1], 10) : 0;
}
