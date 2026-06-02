// ---------------------------------------------------------------------------
// PI-RADS v2.1 scoring engine (prostate multiparametric MRI)
// All logic runs client-side. Zero server calls.
// Reference: Turkbey B, et al. Prostate Imaging Reporting and Data System
// Version 2.1: 2019 Update of PI-RADS Version 2. Eur Urol. 2019;76(3):340-351.
//
// Assessment is per lesion and zone-dependent:
//  - Peripheral zone (PZ): DWI is the dominant sequence. DCE is used only to
//    resolve a DWI score of 3 (positive -> 4, negative -> 3).
//  - Transition zone (TZ): T2W is the dominant sequence. DWI upgrades a T2W
//    score of 2 (DWI >= 4 -> PI-RADS 3) and resolves a T2W score of 3
//    (DWI 5 -> 4, otherwise -> 3).
// ---------------------------------------------------------------------------

export type PiradsCategory = "PI-RADS 1" | "PI-RADS 2" | "PI-RADS 3" | "PI-RADS 4" | "PI-RADS 5";

export type ProstateZone = "" | "pz" | "tz";

// "" = not yet selected (incomplete). "unavailable" = DCE not performed or
// non-diagnostic; per PI-RADS v2.1 the DWI category is then final (DWI 3 -> 3).
export type DceResult = "" | "negative" | "positive" | "unavailable";

// ── Zone / location ────────────────────────────────────────────────────────

export const PROSTATE_ZONES: { value: ProstateZone; label: string; desc: string }[] = [
  { value: "pz", label: "Peripheral zone (PZ)", desc: "DWI is the dominant sequence." },
  { value: "tz", label: "Transition zone (TZ)", desc: "T2W is the dominant sequence." },
];

export type ProstateSide = "" | "right" | "left" | "bilateral" | "midline";
export const PROSTATE_SIDES: { value: ProstateSide; label: string }[] = [
  { value: "", label: "Not specified" },
  { value: "right", label: "Right" },
  { value: "left", label: "Left" },
  { value: "bilateral", label: "Bilateral" },
  { value: "midline", label: "Midline" },
];

export type ProstateLevel = "" | "base" | "mid" | "apex";
export const PROSTATE_LEVELS: { value: ProstateLevel; label: string }[] = [
  { value: "", label: "Not specified" },
  { value: "base", label: "Base" },
  { value: "mid", label: "Mid gland" },
  { value: "apex", label: "Apex" },
];

// ── Per-sequence score option lists (1–5) ──────────────────────────────────

export const T2W_PZ_SCORES: { value: number; label: string }[] = [
  { value: 1, label: "1 — Uniform hyperintense (normal)" },
  { value: 2, label: "2 — Linear/wedge hypointense or diffuse mild hypointensity" },
  { value: 3, label: "3 — Heterogeneous or rounded moderate hypointensity" },
  { value: 4, label: "4 — Circumscribed hypointense <1.5 cm, confined to prostate" },
  { value: 5, label: "5 — Same as 4 but ≥1.5 cm or definite extraprostatic extension" },
];

export const T2W_TZ_SCORES: { value: number; label: string }[] = [
  { value: 1, label: "1 — Normal/round complete capsule (\"organized chaos\")" },
  { value: 2, label: "2 — Mostly encapsulated nodule or homogeneous mild hypointensity" },
  { value: 3, label: "3 — Heterogeneous signal, obscured margins" },
  { value: 4, label: "4 — Lenticular/non-circumscribed hypointense <1.5 cm" },
  { value: 5, label: "5 — Same as 4 but ≥1.5 cm or definite extraprostatic extension" },
];

export const DWI_SCORES: { value: number; label: string }[] = [
  { value: 1, label: "1 — No abnormality on ADC and high-b DWI" },
  { value: 2, label: "2 — Indistinct hypointense on ADC" },
  { value: 3, label: "3 — Focal mild/moderate ADC low and isointense/mild high-b" },
  { value: 4, label: "4 — Focal marked ADC low and marked high-b, <1.5 cm" },
  { value: 5, label: "5 — Same as 4 but ≥1.5 cm or definite extraprostatic extension" },
];

export const DCE_OPTIONS: { value: Exclude<DceResult, "">; label: string; desc: string }[] = [
  { value: "negative", label: "DCE negative", desc: "No early/contemporaneous focal enhancement, or enhancement not corresponding to a T2W/DWI finding." },
  { value: "positive", label: "DCE positive", desc: "Focal enhancement earlier than or contemporaneous with adjacent normal prostate, corresponding to a T2W/DWI finding." },
  { value: "unavailable", label: "DCE unavailable / inadequate", desc: "DCE not performed or non-diagnostic. The DWI category is final (a DWI 3 stays PI-RADS 3)." },
];

// ── Engine input / result ──────────────────────────────────────────────────

export interface PiradsInput {
  zone: ProstateZone;
  t2w: number | null; // 1–5
  dwi: number | null; // 1–5
  dce: DceResult;     // PZ only, to resolve DWI = 3
}

export interface PiradsResult {
  category: PiradsCategory;
  score: number; // 1–5
  risk: string;
  rationale: string;
  clinicalNote: string;
}

const RISK: Record<number, string> = {
  1: "Clinically significant cancer is highly unlikely.",
  2: "Clinically significant cancer is unlikely.",
  3: "The presence of clinically significant cancer is equivocal (intermediate).",
  4: "Clinically significant cancer is likely.",
  5: "Clinically significant cancer is highly likely.",
};

// PI-RADS v2.1 itself does not prescribe management; biopsy decisions are
// clinical. These are framed as clinical notes, not directives.
const CLINICAL_NOTE: Record<number, string> = {
  1: "PI-RADS is a risk category; manage per clinical risk factors and local protocol.",
  2: "PI-RADS is a risk category; manage per clinical risk factors and local protocol.",
  3: "Equivocal; correlate with PSA density and clinical risk factors per local protocol.",
  4: "Correlate with PSA density and clinical risk factors; targeted biopsy may be considered per local protocol.",
  5: "Correlate with PSA density and clinical risk factors; targeted biopsy may be considered per local protocol.",
};

// ── Main scoring function ──────────────────────────────────────────────────

export function scorePirads(input: PiradsInput): PiradsResult | null {
  const { zone, t2w, dwi, dce } = input;
  if (zone === "") return null;

  if (zone === "pz") {
    // Peripheral zone — DWI is dominant.
    if (dwi === null) return null;
    if (dwi === 3) {
      if (dce === "") return null; // DCE must be selected to resolve DWI 3
      if (dce === "positive") return make(4, "PZ, DWI 3 with positive DCE → upgraded to PI-RADS 4.");
      // negative OR unavailable/inadequate → the DWI category is final (PI-RADS 3)
      const why = dce === "unavailable" ? "unavailable/inadequate DCE" : "negative DCE";
      return make(3, `PZ, DWI 3 with ${why} → PI-RADS 3 (DWI category is final).`);
    }
    return make(dwi, `PZ, DWI ${dwi} (dominant sequence) → PI-RADS ${dwi}.`);
  }

  // Transition zone — T2W is dominant. DWI upgrades T2W 2 and resolves T2W 3.
  if (t2w === null) return null;
  if (t2w === 1) return make(1, "TZ, T2W 1 (dominant sequence) → PI-RADS 1.");
  if (t2w === 4) return make(4, "TZ, T2W 4 (dominant sequence) → PI-RADS 4.");
  if (t2w === 5) return make(5, "TZ, T2W 5 (dominant sequence) → PI-RADS 5.");
  // T2W 2 and 3 both require DWI to finalize the category.
  if (dwi === null) return null;
  if (t2w === 2) {
    if (dwi >= 4) return make(3, "TZ, T2W 2 with DWI ≥4 → upgraded to PI-RADS 3.");
    return make(2, `TZ, T2W 2 with DWI ${dwi} → PI-RADS 2.`);
  }
  // t2w === 3
  if (dwi === 5) return make(4, "TZ, T2W 3 with DWI 5 → upgraded to PI-RADS 4.");
  return make(3, `TZ, T2W 3 with DWI ${dwi} → PI-RADS 3.`);
}

function make(score: number, rationale: string): PiradsResult {
  return {
    category: `PI-RADS ${score}` as PiradsCategory,
    score,
    risk: RISK[score],
    rationale,
    clinicalNote: CLINICAL_NOTE[score],
  };
}

// ── Feature description (for report text) ──────────────────────────────────

export function describePiradsFeatures(input: PiradsInput): string {
  const parts: string[] = [];
  if (input.zone) parts.push(input.zone === "pz" ? "peripheral zone" : "transition zone");
  if (input.t2w !== null) parts.push(`T2W ${input.t2w}`);
  if (input.dwi !== null) parts.push(`DWI ${input.dwi}`);
  if (input.dce) parts.push(`DCE ${input.dce}`);
  return parts.join(", ");
}

// ── Risk color helpers (reuse tirads/lungrads pattern) ─────────────────────

export function piradsRiskBg(score: number): string {
  switch (score) {
    case 1:
    case 2:
      return "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800";
    case 3:
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800";
    case 4:
      return "bg-orange-50 border-orange-200 dark:bg-orange-950/30 dark:border-orange-800";
    case 5:
      return "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800";
    default:
      return "bg-gray-50 border-gray-200 dark:bg-gray-950/30 dark:border-gray-800";
  }
}
