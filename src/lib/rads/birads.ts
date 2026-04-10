// ---------------------------------------------------------------------------
// BI-RADS descriptor engine — Mammography & Ultrasound
// Phase A: Mammography + US. Phase B: MRI (future).
// All logic runs client-side. Zero server calls.
// Reference: ACR BI-RADS Atlas 5th Edition (2013)
// ---------------------------------------------------------------------------

// ── Modality ─────────────────────────────────────────────────────────────

export type BiRadsModality = "mammo" | "us";

export const BIRADS_MODALITIES: { value: BiRadsModality; label: string; desc: string }[] = [
  { value: "mammo", label: "Mammography", desc: "2D / 3D (tomosynthesis)" },
  { value: "us", label: "Ultrasound", desc: "B-mode ± Doppler" },
];

// ── BI-RADS Assessment Categories ────────────────────────────────────────

export type BiRadsCategory = "0" | "1" | "2" | "3" | "4A" | "4B" | "4C" | "5" | "6";

export interface BiRadsCategoryInfo {
  category: BiRadsCategory;
  label: string;         // "BI-RADS 0"
  level: string;         // "Incomplete"
  malignancyRisk: string;
  management: string;
}

export const BIRADS_CATEGORIES: BiRadsCategoryInfo[] = [
  {
    category: "0",
    label: "BI-RADS 0",
    level: "Incomplete",
    malignancyRisk: "N/A",
    management: "Additional imaging evaluation needed and/or prior mammograms for comparison.",
  },
  {
    category: "1",
    label: "BI-RADS 1",
    level: "Negative",
    malignancyRisk: "Essentially 0%",
    management: "Routine screening.",
  },
  {
    category: "2",
    label: "BI-RADS 2",
    level: "Benign",
    malignancyRisk: "Essentially 0%",
    management: "Routine screening.",
  },
  {
    category: "3",
    label: "BI-RADS 3",
    level: "Probably Benign",
    malignancyRisk: ">0% but ≤2%",
    management: "Short-interval follow-up (6-month).",
  },
  {
    category: "4A",
    label: "BI-RADS 4A",
    level: "Low Suspicion for Malignancy",
    malignancyRisk: ">2% to ≤10%",
    management: "Tissue sampling.",
  },
  {
    category: "4B",
    label: "BI-RADS 4B",
    level: "Moderate Suspicion for Malignancy",
    malignancyRisk: ">10% to ≤50%",
    management: "Tissue sampling.",
  },
  {
    category: "4C",
    label: "BI-RADS 4C",
    level: "High Suspicion for Malignancy",
    malignancyRisk: ">50% to <95%",
    management: "Tissue sampling.",
  },
  {
    category: "5",
    label: "BI-RADS 5",
    level: "Highly Suggestive of Malignancy",
    malignancyRisk: "≥95%",
    management: "Tissue sampling.",
  },
  {
    category: "6",
    label: "BI-RADS 6",
    level: "Known Biopsy-Proven Malignancy",
    malignancyRisk: "N/A",
    management: "Surgical excision when clinically appropriate.",
  },
];

export function getCategoryInfo(cat: BiRadsCategory): BiRadsCategoryInfo {
  return BIRADS_CATEGORIES.find((c) => c.category === cat) ?? BIRADS_CATEGORIES[0];
}

// ── Lesion location ───────────────────────────────────────────────────────

export type Laterality = "right" | "left" | "bilateral" | "";

export type ClockPosition =
  | "12" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11"
  | "central" | "axillary_tail" | "";

export type Depth = "anterior" | "middle" | "posterior" | "";

export const LATERALITY_OPTIONS: { value: Laterality; label: string }[] = [
  { value: "", label: "Not specified" },
  { value: "right", label: "Right breast" },
  { value: "left", label: "Left breast" },
  { value: "bilateral", label: "Bilateral" },
];

export const CLOCK_POSITIONS: { value: ClockPosition; label: string }[] = [
  { value: "", label: "Not specified" },
  { value: "12", label: "12 o'clock" },
  { value: "1", label: "1 o'clock" },
  { value: "2", label: "2 o'clock" },
  { value: "3", label: "3 o'clock" },
  { value: "4", label: "4 o'clock" },
  { value: "5", label: "5 o'clock" },
  { value: "6", label: "6 o'clock" },
  { value: "7", label: "7 o'clock" },
  { value: "8", label: "8 o'clock" },
  { value: "9", label: "9 o'clock" },
  { value: "10", label: "10 o'clock" },
  { value: "11", label: "11 o'clock" },
  { value: "central", label: "Central / subareolar" },
  { value: "axillary_tail", label: "Axillary tail" },
];

export const DEPTHS: { value: Depth; label: string }[] = [
  { value: "", label: "Not specified" },
  { value: "anterior", label: "Anterior third" },
  { value: "middle", label: "Middle third" },
  { value: "posterior", label: "Posterior third" },
];

// ── Mammography Descriptors ───────────────────────────────────────────────

// Finding type (mutually exclusive primary finding)
export type MammoFindingType =
  | "mass"
  | "calcifications"
  | "architectural_distortion"
  | "asymmetry"
  | "intramammary_ln"
  | "skin_lesion"
  | "no_finding"
  | "";

export const MAMMO_FINDING_TYPES: { value: MammoFindingType; label: string }[] = [
  { value: "", label: "Select finding type" },
  { value: "no_finding", label: "No finding (BI-RADS 1)" },
  { value: "mass", label: "Mass" },
  { value: "calcifications", label: "Calcifications" },
  { value: "architectural_distortion", label: "Architectural Distortion" },
  { value: "asymmetry", label: "Asymmetry" },
  { value: "intramammary_ln", label: "Intramammary Lymph Node" },
  { value: "skin_lesion", label: "Skin Lesion" },
];

// Mass — Shape
export type MammoMassShape = "oval" | "round" | "irregular" | "";
export const MAMMO_MASS_SHAPES: { value: MammoMassShape; label: string; desc: string }[] = [
  { value: "", label: "Not selected", desc: "" },
  { value: "oval", label: "Oval", desc: "Elliptical or egg-shaped (may have 2–3 undulations)" },
  { value: "round", label: "Round", desc: "Spherical, ball-shaped, circular" },
  { value: "irregular", label: "Irregular", desc: "Neither round nor oval" },
];

// Mass — Margin
export type MammoMassMargin =
  | "circumscribed"
  | "obscured"
  | "microlobulated"
  | "indistinct"
  | "spiculated"
  | "";
export const MAMMO_MASS_MARGINS: { value: MammoMassMargin; label: string; desc: string }[] = [
  { value: "", label: "Not selected", desc: "" },
  { value: "circumscribed", label: "Circumscribed", desc: "Well-defined, abrupt interface" },
  { value: "obscured", label: "Obscured", desc: "Hidden by superimposed tissue" },
  { value: "microlobulated", label: "Microlobulated", desc: "Short-cycle undulations" },
  { value: "indistinct", label: "Indistinct", desc: "No clear demarcation from surrounding tissue" },
  { value: "spiculated", label: "Spiculated", desc: "Lines radiating from mass" },
];

// Mass — Density
export type MammoMassDensity = "high" | "equal" | "low" | "fat_containing" | "";
export const MAMMO_MASS_DENSITIES: { value: MammoMassDensity; label: string; desc: string }[] = [
  { value: "", label: "Not selected", desc: "" },
  { value: "high", label: "High density", desc: "Denser than surrounding tissue" },
  { value: "equal", label: "Equal density", desc: "Same density as surrounding tissue" },
  { value: "low", label: "Low density", desc: "Less dense than surrounding tissue" },
  { value: "fat_containing", label: "Fat-containing", desc: "Contains fat (hamartoma, galactocele, etc.)" },
];

// Calcifications — Morphology
export type CalcMorphology =
  | "typically_benign"
  | "skin"
  | "vascular"
  | "coarse_popcorn"
  | "large_rod_like"
  | "round"
  | "rim"
  | "dystrophic"
  | "milk_of_calcium"
  | "suture"
  | "amorphous"
  | "coarse_heterogeneous"
  | "fine_pleomorphic"
  | "fine_linear_branching"
  | "";

export const CALC_MORPHOLOGIES: { value: CalcMorphology; label: string; suspicion: "benign" | "intermediate" | "suspicious" }[] = [
  { value: "", label: "Not selected", suspicion: "benign" },
  // Typically benign
  { value: "skin", label: "Skin (dermal)", suspicion: "benign" },
  { value: "vascular", label: "Vascular", suspicion: "benign" },
  { value: "coarse_popcorn", label: "Coarse / Popcorn", suspicion: "benign" },
  { value: "large_rod_like", label: "Large rod-like (plasma cell mastitis)", suspicion: "benign" },
  { value: "round", label: "Round (punctate)", suspicion: "benign" },
  { value: "rim", label: "Rim (eggshell)", suspicion: "benign" },
  { value: "dystrophic", label: "Dystrophic", suspicion: "benign" },
  { value: "milk_of_calcium", label: "Milk of calcium", suspicion: "benign" },
  { value: "suture", label: "Suture", suspicion: "benign" },
  // Intermediate concern
  { value: "amorphous", label: "Amorphous", suspicion: "intermediate" },
  { value: "coarse_heterogeneous", label: "Coarse heterogeneous", suspicion: "intermediate" },
  // Suspicious
  { value: "fine_pleomorphic", label: "Fine pleomorphic", suspicion: "suspicious" },
  { value: "fine_linear_branching", label: "Fine linear / branching (casting)", suspicion: "suspicious" },
];

// Calcifications — Distribution
export type CalcDistribution =
  | "diffuse"
  | "regional"
  | "grouped"
  | "linear"
  | "segmental"
  | "";
export const CALC_DISTRIBUTIONS: { value: CalcDistribution; label: string; desc: string }[] = [
  { value: "", label: "Not selected", desc: "" },
  { value: "diffuse", label: "Diffuse", desc: "Randomly distributed throughout the breast" },
  { value: "regional", label: "Regional", desc: "Large volume of tissue, not a duct distribution" },
  { value: "grouped", label: "Grouped (clustered)", desc: "Few calcifications in a small volume (<2 cm)" },
  { value: "linear", label: "Linear", desc: "In a line, may branch — suggest duct" },
  { value: "segmental", label: "Segmental", desc: "Triangle or cone pointing toward the nipple" },
];

// Asymmetry types
export type AsymmetryType =
  | "asymmetry"
  | "global_asymmetry"
  | "focal_asymmetry"
  | "developing_asymmetry"
  | "";
export const ASYMMETRY_TYPES: { value: AsymmetryType; label: string; desc: string }[] = [
  { value: "", label: "Not selected", desc: "" },
  { value: "asymmetry", label: "Asymmetry", desc: "Seen on one view only" },
  { value: "global_asymmetry", label: "Global asymmetry", desc: "Large volume of fibroglandular tissue" },
  { value: "focal_asymmetry", label: "Focal asymmetry", desc: "Seen on two views, no convex outward border" },
  { value: "developing_asymmetry", label: "Developing asymmetry", desc: "New or increasing — higher suspicion" },
];

// Associated features (mammography)
export interface MammoAssociatedFeatures {
  skinRetraction: boolean;
  nippleRetraction: boolean;
  skinThickening: boolean;
  trabecularThickening: boolean;
  axillaryAdenopathy: boolean;
  architecturalDistortion: boolean;
}

export const MAMMO_ASSOCIATED_FEATURE_OPTIONS: {
  key: keyof MammoAssociatedFeatures;
  label: string;
}[] = [
  { key: "skinRetraction", label: "Skin retraction" },
  { key: "nippleRetraction", label: "Nipple retraction" },
  { key: "skinThickening", label: "Skin thickening" },
  { key: "trabecularThickening", label: "Trabecular thickening" },
  { key: "axillaryAdenopathy", label: "Axillary adenopathy" },
  { key: "architecturalDistortion", label: "Architectural distortion" },
];

// Breast composition (mammography only)
export type BreastComposition = "a" | "b" | "c" | "d" | "";
export const BREAST_COMPOSITIONS: { value: BreastComposition; label: string; desc: string }[] = [
  { value: "", label: "Not selected", desc: "" },
  { value: "a", label: "Category A — Fatty", desc: "Almost entirely fatty" },
  { value: "b", label: "Category B — Scattered", desc: "Scattered areas of fibroglandular density" },
  { value: "c", label: "Category C — Heterogeneous", desc: "Heterogeneously dense (may obscure small masses)" },
  { value: "d", label: "Category D — Extremely dense", desc: "Extremely dense (lowers sensitivity of mammography)" },
];

// ── Ultrasound Descriptors ────────────────────────────────────────────────

export type UsFindingType = "mass" | "non_mass" | "special_case" | "no_finding" | "";
export const US_FINDING_TYPES: { value: UsFindingType; label: string }[] = [
  { value: "", label: "Select finding type" },
  { value: "no_finding", label: "No abnormality (BI-RADS 1)" },
  { value: "mass", label: "Mass" },
  { value: "non_mass", label: "Non-mass finding" },
  { value: "special_case", label: "Special case" },
];

// US Mass — Shape
export type UsMassShape = "oval" | "round" | "irregular" | "";
export const US_MASS_SHAPES: { value: UsMassShape; label: string }[] = [
  { value: "", label: "Not selected" },
  { value: "oval", label: "Oval" },
  { value: "round", label: "Round" },
  { value: "irregular", label: "Irregular" },
];

// US Mass — Orientation
export type UsMassOrientation = "parallel" | "not_parallel" | "";
export const US_MASS_ORIENTATIONS: { value: UsMassOrientation; label: string; desc: string }[] = [
  { value: "", label: "Not selected", desc: "" },
  { value: "parallel", label: "Parallel", desc: "Horizontal; long axis parallel to skin (wider-than-tall)" },
  { value: "not_parallel", label: "Not parallel", desc: "Taller-than-wide (vertical orientation — suspicious)" },
];

// US Mass — Margin
export type UsMassMargin =
  | "circumscribed"
  | "not_circumscribed_indistinct"
  | "not_circumscribed_angular"
  | "not_circumscribed_microlobulated"
  | "not_circumscribed_spiculated"
  | "";
export const US_MASS_MARGINS: { value: UsMassMargin; label: string }[] = [
  { value: "", label: "Not selected" },
  { value: "circumscribed", label: "Circumscribed" },
  { value: "not_circumscribed_indistinct", label: "Not circumscribed — Indistinct" },
  { value: "not_circumscribed_angular", label: "Not circumscribed — Angular" },
  { value: "not_circumscribed_microlobulated", label: "Not circumscribed — Microlobulated" },
  { value: "not_circumscribed_spiculated", label: "Not circumscribed — Spiculated" },
];

// US Mass — Echo pattern
export type UsEchoPattern =
  | "anechoic"
  | "hyperechoic"
  | "complex_cystic_solid"
  | "hypoechoic"
  | "isoechoic"
  | "heterogeneous"
  | "";
export const US_ECHO_PATTERNS: { value: UsEchoPattern; label: string; desc: string }[] = [
  { value: "", label: "Not selected", desc: "" },
  { value: "anechoic", label: "Anechoic", desc: "No internal echoes (simple cyst)" },
  { value: "hyperechoic", label: "Hyperechoic", desc: "Echogenicity greater than fat" },
  { value: "complex_cystic_solid", label: "Complex cystic and solid", desc: "Contains both cystic and solid components" },
  { value: "hypoechoic", label: "Hypoechoic", desc: "Echogenicity less than fat" },
  { value: "isoechoic", label: "Isoechoic", desc: "Same echogenicity as fat" },
  { value: "heterogeneous", label: "Heterogeneous", desc: "Mix of echogenicities" },
];

// US Mass — Posterior features
export type UsPosteriorFeatures =
  | "no_posterior"
  | "enhancement"
  | "shadowing"
  | "combined"
  | "";
export const US_POSTERIOR_FEATURES: { value: UsPosteriorFeatures; label: string; desc: string }[] = [
  { value: "", label: "Not selected", desc: "" },
  { value: "no_posterior", label: "No posterior features", desc: "No posterior change" },
  { value: "enhancement", label: "Enhancement", desc: "Increased echogenicity posterior to mass" },
  { value: "shadowing", label: "Shadowing", desc: "Decreased echogenicity posterior to mass" },
  { value: "combined", label: "Combined pattern", desc: "Both enhancement and shadowing present" },
];

// US — Special cases
export type UsSpecialCase =
  | "simple_cyst"
  | "clustered_microcysts"
  | "complicated_cyst"
  | "mass_in_or_on_skin"
  | "foreign_body"
  | "lymph_node_intramammary"
  | "lymph_node_axillary"
  | "vascular"
  | "postsurgical_change"
  | "fat_necrosis"
  | "";
export const US_SPECIAL_CASES: { value: UsSpecialCase; label: string; category: BiRadsCategory }[] = [
  { value: "", label: "Not selected", category: "1" },
  { value: "simple_cyst", label: "Simple cyst", category: "2" },
  { value: "clustered_microcysts", label: "Clustered microcysts", category: "3" },
  { value: "complicated_cyst", label: "Complicated cyst", category: "3" },
  { value: "mass_in_or_on_skin", label: "Mass in or on skin", category: "2" },
  { value: "foreign_body", label: "Foreign body (including implants)", category: "2" },
  { value: "lymph_node_intramammary", label: "Intramammary lymph node", category: "2" },
  { value: "lymph_node_axillary", label: "Axillary lymph node", category: "2" },
  { value: "vascular", label: "Vascular abnormality", category: "2" },
  { value: "postsurgical_change", label: "Post-surgical collection", category: "2" },
  { value: "fat_necrosis", label: "Fat necrosis", category: "2" },
];

// US Associated features
export interface UsAssociatedFeatures {
  ductChanges: boolean;
  skinChanges: boolean;
  edema: boolean;
  vascularity: boolean;
  elasticity: boolean;
}

export const US_ASSOCIATED_FEATURE_OPTIONS: {
  key: keyof UsAssociatedFeatures;
  label: string;
  desc: string;
}[] = [
  { key: "ductChanges", label: "Duct changes", desc: "Ductal extension or duct changes" },
  { key: "skinChanges", label: "Skin changes", desc: "Skin thickening / retraction / irregularity" },
  { key: "edema", label: "Edema", desc: "Increased echogenicity of surrounding tissue" },
  { key: "vascularity", label: "Vascularity", desc: "Internal or rim vascularity on Doppler" },
  { key: "elasticity", label: "Elasticity", desc: "Soft / hard on elastography" },
];

// ── Risk color helpers ────────────────────────────────────────────────────

export function biRadsRiskBg(category: BiRadsCategory): string {
  if (category === "0")
    return "bg-gray-50 border-gray-200 dark:bg-gray-950/30 dark:border-gray-800";
  if (category === "1" || category === "2")
    return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800";
  if (category === "3")
    return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800";
  if (category === "4A")
    return "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800";
  if (category === "4B" || category === "4C")
    return "bg-red-50 border-red-100 dark:bg-red-950/30 dark:border-red-800";
  if (category === "5")
    return "bg-red-100 border-red-300 dark:bg-red-900/40 dark:border-red-700";
  if (category === "6")
    return "bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-800";
  return "bg-gray-50 border-gray-200 dark:bg-gray-950/30 dark:border-gray-800";
}

// ── Feature description helpers ───────────────────────────────────────────

export function describeMammoMass(
  shape: MammoMassShape,
  margin: MammoMassMargin,
  density: MammoMassDensity,
): string {
  const parts: string[] = [];
  const shapeMap: Record<string, string> = { oval: "oval", round: "round", irregular: "irregular" };
  const marginMap: Record<string, string> = {
    circumscribed: "circumscribed",
    obscured: "obscured",
    microlobulated: "microlobulated",
    indistinct: "indistinct",
    spiculated: "spiculated",
  };
  const densityMap: Record<string, string> = {
    high: "high density",
    equal: "equal density",
    low: "low density",
    fat_containing: "fat-containing",
  };
  if (shape) parts.push(shapeMap[shape]);
  if (margin) parts.push(marginMap[margin]);
  if (density) parts.push(densityMap[density]);
  return parts.length > 0 ? `Mass: ${parts.join(", ")}` : "Mass";
}

export function describeMammoCalcifications(
  morphology: CalcMorphology,
  distribution: CalcDistribution,
): string {
  const m = CALC_MORPHOLOGIES.find((c) => c.value === morphology);
  const d = CALC_DISTRIBUTIONS.find((c) => c.value === distribution);
  const parts: string[] = [];
  if (m && m.value) parts.push(m.label.toLowerCase());
  if (d && d.value) parts.push(`${d.label.toLowerCase()} distribution`);
  return parts.length > 0 ? `Calcifications: ${parts.join(", ")}` : "Calcifications";
}

export function describeUsMass(
  shape: UsMassShape,
  orientation: UsMassOrientation,
  margin: UsMassMargin,
  echo: UsEchoPattern,
  posterior: UsPosteriorFeatures,
): string {
  const parts: string[] = [];
  if (shape) parts.push(shape);
  if (orientation) parts.push(orientation === "parallel" ? "parallel orientation" : "not-parallel orientation");
  if (margin) parts.push(margin.replace("not_circumscribed_", "").replace(/_/g, "-"));
  if (echo) parts.push(echo.replace(/_/g, " ") + " echo pattern");
  if (posterior && posterior !== "no_posterior") parts.push(`posterior ${posterior.replace(/_/g, " ")}`);
  return parts.length > 0 ? `Mass: ${parts.join(", ")}` : "Mass";
}

export function formatClockLocation(
  laterality: Laterality,
  clock: ClockPosition,
  depth: Depth,
  distanceMm: string,
): string {
  const parts: string[] = [];
  const lateralMap: Record<string, string> = {
    right: "Right breast",
    left: "Left breast",
    bilateral: "Bilateral",
  };
  if (laterality) parts.push(lateralMap[laterality]);
  if (clock && clock !== "central" && clock !== "axillary_tail") {
    parts.push(`${clock} o'clock`);
  } else if (clock === "central") {
    parts.push("central/subareolar");
  } else if (clock === "axillary_tail") {
    parts.push("axillary tail");
  }
  if (depth) parts.push(`${depth} third`);
  if (distanceMm) parts.push(`${distanceMm} mm from nipple`);
  return parts.join(", ");
}
