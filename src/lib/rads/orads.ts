// ---------------------------------------------------------------------------
// O-RADS scoring engine — Ovarian-Adnexal Reporting and Data System
//   • O-RADS US v2022  (ultrasound)
//   • O-RADS MRI 2022  (magnetic resonance)
// All logic runs client-side. Zero server calls.
//
// References:
//   US v2022:  ACR O-RADS US v2022 Assessment Categories (Release Nov 2022);
//              Strachowski LM, et al. O-RADS US v2022: An Update from the ACR
//              O-RADS US Committee. Radiology. 2023;308(3):e230685.
//   MRI 2022:  Sadowski EA, Thomassin-Naggara I, et al. O-RADS MRI Risk
//              Stratification System. Radiology. 2022;303(1):35-47.
//
// Each lesion is scored independently; per the ACR Governing Concepts, when
// multiple lesions are present, management is driven by the highest score.
// Criteria are encoded explicitly from the published tables (no point-count
// shortcuts). Any incomplete input returns null.
// ---------------------------------------------------------------------------

export type OradsSystem = "us" | "mri";

// ===========================================================================
//  O-RADS US v2022
// ===========================================================================

// O-RADS scores share the 0–5 scale across US and MRI.
export type OradsUsCategory =
  | "O-RADS 0"
  | "O-RADS 1"
  | "O-RADS 2"
  | "O-RADS 3"
  | "O-RADS 4"
  | "O-RADS 5";

// Top-level lexicon lesion class.
export type UsLesionType =
  | ""
  | "no_lesion"
  | "physiologic"
  | "unilocular"
  | "bilocular"
  | "multilocular"
  | "solid"
  | "classic_benign";

export const US_LESION_TYPES: { value: Exclude<UsLesionType, "">; label: string; desc: string }[] = [
  { value: "no_lesion", label: "No ovarian lesion", desc: "Normal ovary." },
  { value: "physiologic", label: "Physiologic cyst", desc: "Follicle or corpus luteum (premenopausal)." },
  { value: "unilocular", label: "Unilocular cyst", desc: "Single locule, no septation." },
  { value: "bilocular", label: "Bilocular cyst", desc: "Two locules (lower risk than multilocular)." },
  { value: "multilocular", label: "Multilocular cyst", desc: "Three or more locules." },
  { value: "solid", label: "Solid lesion", desc: "≥80% solid." },
  { value: "classic_benign", label: "Classic benign lesion", desc: "Typical hemorrhagic cyst, dermoid, endometrioma, paraovarian, peritoneal inclusion, or hydrosalpinx." },
];

export type Menopausal = "" | "pre" | "post";
export const MENOPAUSAL_OPTIONS: { value: Exclude<Menopausal, "">; label: string }[] = [
  { value: "pre", label: "Premenopausal" },
  { value: "post", label: "Postmenopausal (amenorrhea ≥1 year)" },
];

export type PhysiologicType = "" | "follicle" | "corpus_luteum";

// Inner wall (and septations) for cystic lesions. "irregular" = wall/septal
// projection(s) < 3 mm in height. A protrusion ≥ 3 mm is a solid component.
export type InnerWall = "" | "smooth" | "irregular";

// Unilocular cyst content. Scoring is identical for smooth simple vs smooth
// non-simple cysts; this only refines the descriptor / management nuance.
export type UsCystContent = "" | "simple" | "nonsimple";

// Solid component within a cystic lesion (protrudes ≥ 3 mm off a wall/septum).
export type SolidComponent = "" | "none" | "present";

// Outer contour for a solid lesion.
export type OuterContour = "" | "smooth" | "irregular";

// Color score (degree of intralesional vascularity).
//  1 = none, 2 = minimal flow, 3 = moderate flow, 4 = very strong flow.
export type ColorScore = 1 | 2 | 3 | 4 | null;

export const COLOR_SCORES: { value: 1 | 2 | 3 | 4; label: string }[] = [
  { value: 1, label: "CS 1 — No flow" },
  { value: 2, label: "CS 2 — Minimal flow" },
  { value: 3, label: "CS 3 — Moderate flow" },
  { value: 4, label: "CS 4 — Very strong flow" },
];

export type ClassicBenignType =
  | ""
  | "hemorrhagic"
  | "dermoid"
  | "endometrioma"
  | "paraovarian"
  | "peritoneal_inclusion"
  | "hydrosalpinx";

export const CLASSIC_BENIGN_TYPES: { value: Exclude<ClassicBenignType, "">; label: string; extraovarian: boolean }[] = [
  { value: "hemorrhagic", label: "Typical hemorrhagic cyst", extraovarian: false },
  { value: "dermoid", label: "Typical dermoid cyst", extraovarian: false },
  { value: "endometrioma", label: "Typical endometrioma", extraovarian: false },
  { value: "paraovarian", label: "Typical paraovarian cyst", extraovarian: true },
  { value: "peritoneal_inclusion", label: "Typical peritoneal inclusion cyst", extraovarian: true },
  { value: "hydrosalpinx", label: "Typical hydrosalpinx", extraovarian: true },
];

export interface OradsUsInput {
  lesionType: UsLesionType;
  menopausal: Menopausal;
  sizeCm: number | null; // single largest diameter

  physiologicType: PhysiologicType;

  // Cystic descriptors
  innerWall: InnerWall;
  cystContent: UsCystContent; // unilocular only (descriptor)
  solidComponent: SolidComponent;
  papillaryProjections: number | null; // count of pps (unilocular with solid component)

  // Solid lesion descriptors
  outerContour: OuterContour;
  shadowing: boolean;

  colorScore: ColorScore;

  classicBenignType: ClassicBenignType;

  // Suspicious peritoneal disease not explained by another etiology.
  ascitesNodules: boolean;
}

export interface OradsResult {
  category: string; // "O-RADS 3" (US) or "O-RADS MRI 4" (MRI)
  score: number; // 0–5
  riskCategory: string; // "Almost Certainly Benign", etc.
  riskPercent: string; // IOTA model malignancy estimate
  rationale: string;
  management: string;
  note?: string; // optional caveat (e.g. ascites etiology, postmenopausal physiologic)
}

const US_RISK_CATEGORY: Record<number, string> = {
  0: "Incomplete Evaluation",
  1: "Normal Ovary",
  2: "Almost Certainly Benign",
  3: "Low Risk",
  4: "Intermediate Risk",
  5: "High Risk",
};

const US_RISK_PERCENT: Record<number, string> = {
  0: "N/A",
  1: "N/A",
  2: "<1%",
  3: "1 – <10%",
  4: "10 – <50%",
  5: "≥50%",
};

// Concise management guidance distilled from the ACR O-RADS US v2022 table.
// Management is risk-based and varies with menopausal status; detailed
// follow-up intervals are summarized.
function usManagement(score: number, menopausal: Menopausal): string {
  switch (score) {
    case 0:
      return "Repeat ultrasound or MRI to complete characterization.";
    case 1:
      return "No follow-up needed.";
    case 2:
      return menopausal === "post"
        ? "Benign; follow-up ultrasound may be indicated depending on lesion type and size (see report)."
        : "Benign; routine follow-up only as indicated by lesion type and size (see report).";
    case 3:
      return "Low risk. If not surgically excised, consider follow-up ultrasound; for a solid lesion consider an ultrasound specialist or MRI. Manage with gynecology.";
    case 4:
      return "Intermediate risk. Options: ultrasound specialist, MRI (with O-RADS MRI score), or management per gyn-oncology protocol. Gynecology with gyn-oncology consultation.";
    case 5:
      return "High risk. Manage per gyn-oncology protocol; refer to gyn-oncology.";
    default:
      return "";
  }
}

function makeUs(
  score: number,
  rationale: string,
  menopausal: Menopausal,
  note?: string,
): OradsResult {
  return {
    category: `O-RADS ${score}`,
    score,
    riskCategory: US_RISK_CATEGORY[score],
    riskPercent: US_RISK_PERCENT[score],
    rationale,
    management: usManagement(score, menopausal),
    note,
  };
}

export function scoreOradsUs(input: OradsUsInput): OradsResult | null {
  const {
    lesionType,
    menopausal,
    sizeCm,
    physiologicType,
    innerWall,
    solidComponent,
    papillaryProjections,
    outerContour,
    shadowing,
    colorScore,
    classicBenignType,
    ascitesNodules,
  } = input;

  // Suspicious ascites and/or peritoneal nodules is itself an O-RADS 5
  // descriptor. Per the table footnote, other etiologies must be excluded for
  // category 1–2 lesions — surfaced as a caveat note.
  const ascitesNote =
    "Ascites and/or peritoneal nodules: exclude other malignant and non-malignant etiologies before attributing to this lesion.";

  const lesion = lesionType === "" ? null : scoreUsLesion();

  // Ascites/peritoneal nodules escalate to O-RADS 5 even when no lesion type
  // has been selected.
  if (ascitesNodules) {
    if (lesion && lesion.score === 5) return lesion;
    const prefix = lesion ? `${lesion.rationale} ` : "";
    return makeUs(
      5,
      `${prefix}Suspicious ascites and/or peritoneal nodules present → O-RADS 5.`,
      menopausal,
      ascitesNote,
    );
  }

  if (lesion === null) return null;
  return lesion;

  // ── inner helper: score the lesion itself (without peritoneal escalation) ──
  function scoreUsLesion(): OradsResult | null {
    // O-RADS 1 — normal ovary, no lesion.
    if (lesionType === "no_lesion") {
      return makeUs(1, "No ovarian lesion → O-RADS 1 (normal ovary).", menopausal);
    }

    // O-RADS 1 — physiologic follicle / corpus luteum.
    if (lesionType === "physiologic") {
      if (physiologicType === "") return null;
      // A physiologic follicle/corpus luteum is ≤ 3 cm by definition → O-RADS 1.
      const label = physiologicType === "follicle" ? "Follicle" : "Corpus luteum";
      const note =
        menopausal === "post"
          ? "Physiologic cysts are not expected after menopause; if present, recharacterize with lexicon descriptors."
          : undefined;
      return makeUs(1, `${label} (physiologic, ≤3 cm) → O-RADS 1.`, menopausal, note);
    }

    // O-RADS 2/3 — classic benign lesions.
    if (lesionType === "classic_benign") {
      if (classicBenignType === "") return null;
      const def = CLASSIC_BENIGN_TYPES.find((c) => c.value === classicBenignType)!;
      const name = def.label.replace(/^Typical /, "");
      if (def.extraovarian) {
        // Paraovarian / peritoneal inclusion / hydrosalpinx → O-RADS 2, any size.
        return makeUs(2, `Typical ${name} (extraovarian, classic benign), any size → O-RADS 2.`, menopausal);
      }
      // Ovarian classic benign (hemorrhagic / dermoid / endometrioma):
      //   <10 cm → O-RADS 2, ≥10 cm → O-RADS 3.
      if (sizeCm === null) return null;
      if (sizeCm < 10) return makeUs(2, `Typical ${name} (classic benign), <10 cm → O-RADS 2.`, menopausal);
      return makeUs(3, `Typical ${name} (classic benign), ≥10 cm → O-RADS 3.`, menopausal);
    }

    // O-RADS 2–5 — unilocular cyst.
    if (lesionType === "unilocular") {
      if (solidComponent === "") return null;
      if (solidComponent === "present") {
        if (papillaryProjections === null) return null;
        // ≥4 papillary projections → O-RADS 5; otherwise (<4 pps, or a
        // solid component that is not a pp) → O-RADS 4, any size.
        if (papillaryProjections >= 4) {
          return makeUs(5, "Unilocular cyst with ≥4 papillary projections, any size → O-RADS 5.", menopausal);
        }
        return makeUs(
          4,
          "Unilocular cyst with solid component(s) (<4 papillary projections or non-pp solid component), any size → O-RADS 4.",
          menopausal,
        );
      }
      // No solid component.
      if (innerWall === "") return null;
      if (innerWall === "irregular") {
        return makeUs(3, "Unilocular cyst with irregular inner wall, any size → O-RADS 3.", menopausal);
      }
      // Smooth inner wall (simple or non-simple): <10 cm → 2, ≥10 cm → 3.
      if (sizeCm === null) return null;
      if (sizeCm < 10) return makeUs(2, "Unilocular smooth cyst, <10 cm → O-RADS 2.", menopausal);
      return makeUs(3, "Unilocular smooth cyst, ≥10 cm → O-RADS 3.", menopausal);
    }

    // O-RADS 2–5 — bilocular cyst (lower risk than multilocular).
    if (lesionType === "bilocular") {
      if (solidComponent === "") return null;
      if (solidComponent === "present") {
        if (colorScore === null) return null;
        // Bi-/multilocular cyst with solid component: CS 1–2 → 4, CS 3–4 → 5.
        if (colorScore <= 2) return makeUs(4, "Bilocular cyst with solid component(s), CS 1–2, any size → O-RADS 4.", menopausal);
        return makeUs(5, "Bilocular cyst with solid component(s), CS 3–4, any size → O-RADS 5.", menopausal);
      }
      // No solid component.
      if (innerWall === "") return null;
      if (innerWall === "irregular") {
        return makeUs(4, "Bilocular cyst, irregular, no solid component, any size, any CS → O-RADS 4.", menopausal);
      }
      // Smooth bilocular cyst — low risk regardless of CS: <10 cm → 2, ≥10 cm → 3.
      if (sizeCm === null) return null;
      if (sizeCm < 10) return makeUs(2, "Bilocular smooth cyst, no solid component, <10 cm → O-RADS 2.", menopausal);
      return makeUs(3, "Bilocular smooth cyst, no solid component, ≥10 cm → O-RADS 3.", menopausal);
    }

    // O-RADS 3–5 — multilocular cyst.
    if (lesionType === "multilocular") {
      if (solidComponent === "") return null;
      if (solidComponent === "present") {
        if (colorScore === null) return null;
        if (colorScore <= 2) return makeUs(4, "Multilocular cyst with solid component(s), CS 1–2, any size → O-RADS 4.", menopausal);
        return makeUs(5, "Multilocular cyst with solid component(s), CS 3–4, any size → O-RADS 5.", menopausal);
      }
      // No solid component.
      if (innerWall === "") return null;
      if (innerWall === "irregular") {
        return makeUs(4, "Multilocular cyst, irregular, no solid component, any size, any CS → O-RADS 4.", menopausal);
      }
      // Smooth multilocular cyst, no solid component.
      if (colorScore === null) return null;
      if (colorScore === 4) {
        return makeUs(4, "Multilocular smooth cyst, no solid component, CS 4, any size → O-RADS 4.", menopausal);
      }
      // CS 1–3: <10 cm → 3, ≥10 cm → 4.
      if (sizeCm === null) return null;
      if (sizeCm < 10) return makeUs(3, "Multilocular smooth cyst, no solid component, <10 cm, CS <4 → O-RADS 3.", menopausal);
      return makeUs(4, "Multilocular smooth cyst, no solid component, ≥10 cm, CS <4 → O-RADS 4.", menopausal);
    }

    // O-RADS 3–5 — solid lesion (≥80% solid).
    if (lesionType === "solid") {
      if (outerContour === "") return null;
      if (outerContour === "irregular") {
        return makeUs(5, "Solid lesion with irregular outer contour, any size, any CS → O-RADS 5.", menopausal);
      }
      // Smooth outer contour.
      if (colorScore === null) return null;
      if (colorScore === 1) {
        return makeUs(3, "Solid lesion, smooth, CS 1, ± shadowing, any size → O-RADS 3.", menopausal);
      }
      if (colorScore === 4) {
        return makeUs(5, "Solid lesion, smooth, CS 4, ± shadowing, any size → O-RADS 5.", menopausal);
      }
      // CS 2–3 — shadowing distinguishes O-RADS 3 (shadowing) vs 4 (non-shadowing).
      if (shadowing) {
        return makeUs(3, "Solid lesion, smooth, CS 2–3, with shadowing, any size → O-RADS 3.", menopausal);
      }
      return makeUs(4, "Solid lesion, smooth, CS 2–3, non-shadowing, any size → O-RADS 4.", menopausal);
    }

    return null;
  }
}

// ===========================================================================
//  O-RADS MRI 2022
// ===========================================================================

export type OradsMriCategory =
  | "O-RADS MRI 1"
  | "O-RADS MRI 2"
  | "O-RADS MRI 3"
  | "O-RADS MRI 4"
  | "O-RADS MRI 5";

// Top-level MRI lesion class.
export type MriLesionType =
  | ""
  | "no_lesion"
  | "physiologic"
  | "cystic_no_solid"
  | "fat"
  | "solid_tissue";

export const MRI_LESION_TYPES: { value: Exclude<MriLesionType, "">; label: string; desc: string }[] = [
  { value: "no_lesion", label: "No adnexal lesion", desc: "Normal ovaries." },
  { value: "physiologic", label: "Physiologic finding (premenopausal)", desc: "Follicle, corpus luteum, or hemorrhagic cyst ≤3 cm." },
  { value: "cystic_no_solid", label: "Cystic, no enhancing solid tissue", desc: "Uni- or multilocular; assess fluid and wall enhancement." },
  { value: "fat", label: "Fat-containing lesion", desc: "Mature teratoma / dermoid." },
  { value: "solid_tissue", label: "Enhancing solid tissue", desc: "Non-fatty enhancing solid tissue present." },
];

// Fluid content of a unilocular cyst. Per O-RADS MRI, simple and endometriotic
// fluid are O-RADS MRI 2 regardless of wall enhancement; hemorrhagic and
// proteinaceous/mucinous fluid become O-RADS MRI 3 when the wall enhances.
export type MriFluid = "" | "simple" | "endometriotic" | "hemorrhagic" | "proteinaceous";
export type MriLocularity = "" | "unilocular" | "multilocular";

// Whether a unilocular non-simple cyst's wall enhances (only changes the score
// for hemorrhagic / proteinaceous fluid).
export const MRI_WALL_ENHANCEMENT_RELEVANT: MriFluid[] = ["hemorrhagic", "proteinaceous"];

// Time-intensity curve type of the enhancing solid tissue, or a non-DCE path.
export type MriTic = "" | "low" | "intermediate" | "high" | "no_dce";

// When DCE/TIC is unavailable, enhancement of solid tissue relative to
// myometrium at 30–40 s is used.
export type MriNonDce = "" | "le_myometrium" | "gt_myometrium";

export interface OradsMriInput {
  lesionType: MriLesionType;
  menopausal: Menopausal; // physiologic findings → O-RADS MRI 1 only when premenopausal

  // cystic_no_solid
  locularity: MriLocularity;
  fluid: MriFluid;
  wallEnhancement: boolean; // wall/septal enhancement

  // fat
  fatEnhancingSolid: boolean; // large-volume enhancing solid tissue within fat

  // solid_tissue
  darkT2Dwi: boolean; // homogeneous dark T2 AND dark DWI (fibroma) → O-RADS MRI 2
  tic: MriTic;
  nonDce: MriNonDce;

  // Peritoneal / mesenteric / omental disease → O-RADS MRI 5
  peritonealImplants: boolean;
}

const MRI_RISK_CATEGORY: Record<number, string> = {
  1: "Normal",
  2: "Almost Certainly Benign",
  3: "Low Risk",
  4: "Intermediate Risk",
  5: "High Risk",
};

const MRI_PPV: Record<number, string> = {
  1: "N/A",
  2: "<0.5%",
  3: "~5%",
  4: "~50%",
  5: "~90%",
};

function mriManagement(score: number): string {
  switch (score) {
    case 1:
      return "Normal ovaries; no further imaging on this basis.";
    case 2:
      return "Almost certainly benign; manage per clinical context.";
    case 3:
      return "Low risk; manage with gynecology.";
    case 4:
      return "Intermediate risk; gynecologic oncology consultation is recommended.";
    case 5:
      return "High risk; refer to gynecologic oncology.";
    default:
      return "";
  }
}

function makeMri(score: number, rationale: string, note?: string): OradsResult {
  return {
    category: `O-RADS MRI ${score}`,
    score,
    riskCategory: MRI_RISK_CATEGORY[score],
    riskPercent: MRI_PPV[score],
    rationale,
    management: mriManagement(score),
    note,
  };
}

export function scoreOradsMri(input: OradsMriInput): OradsResult | null {
  const {
    lesionType,
    menopausal,
    locularity,
    fluid,
    wallEnhancement,
    fatEnhancingSolid,
    darkT2Dwi,
    tic,
    nonDce,
    peritonealImplants,
  } = input;

  const peritonealNote =
    "Peritoneal, mesenteric, or omental nodularity / irregular thickening present.";

  const lesion = lesionType === "" ? null : scoreMriLesion();

  // Peritoneal / mesenteric / omental disease is itself an O-RADS MRI 5
  // descriptor — it escalates even when no lesion type has been selected.
  if (peritonealImplants) {
    if (lesion && lesion.score === 5) return lesion;
    const prefix = lesion ? `${lesion.rationale} ` : "";
    return makeMri(5, `${prefix}Peritoneal/omental disease present → O-RADS MRI 5.`, peritonealNote);
  }

  return lesion;

  function scoreMriLesion(): OradsResult | null {
    // O-RADS MRI 1 — normal ovaries.
    if (lesionType === "no_lesion") {
      return makeMri(1, "No adnexal lesion → O-RADS MRI 1 (normal ovaries).");
    }

    // O-RADS MRI 1 — premenopausal physiologic finding (≤3 cm).
    if (lesionType === "physiologic") {
      if (menopausal === "") return null; // need menopausal status to apply the physiologic pathway
      if (menopausal === "post") {
        // Physiologic findings are not expected after menopause; recharacterize
        // (a normal postmenopausal ovary is "No adnexal lesion").
        return null;
      }
      return makeMri(
        1,
        "Premenopausal physiologic finding (follicle, corpus luteum, or hemorrhagic cyst ≤3 cm) → O-RADS MRI 1.",
      );
    }

    // Cystic lesion with no enhancing solid tissue.
    if (lesionType === "cystic_no_solid") {
      if (locularity === "") return null;
      if (locularity === "multilocular") {
        // Multilocular (non-fatty), no enhancing solid tissue → O-RADS MRI 3.
        return makeMri(3, "Multilocular cyst, no enhancing solid tissue → O-RADS MRI 3.");
      }
      // Unilocular.
      if (fluid === "") return null;
      // Simple and endometriotic fluid are O-RADS MRI 2 regardless of wall enhancement.
      if (fluid === "simple") {
        return makeMri(2, "Unilocular cyst with simple fluid, no enhancing solid tissue → O-RADS MRI 2.");
      }
      if (fluid === "endometriotic") {
        return makeMri(
          2,
          "Unilocular cyst with endometriotic fluid, no enhancing solid tissue → O-RADS MRI 2 (regardless of wall enhancement).",
        );
      }
      // Hemorrhagic or proteinaceous/mucinous fluid: wall enhancement → O-RADS MRI 3.
      const fluidLabel = fluid === "hemorrhagic" ? "hemorrhagic" : "proteinaceous/mucinous";
      if (!wallEnhancement) {
        return makeMri(2, `Unilocular cyst with ${fluidLabel} fluid and no wall enhancement → O-RADS MRI 2.`);
      }
      return makeMri(3, `Unilocular cyst with ${fluidLabel} fluid and smooth wall enhancement, no solid tissue → O-RADS MRI 3.`);
    }

    // Fat-containing lesion (mature teratoma / dermoid).
    if (lesionType === "fat") {
      if (!fatEnhancingSolid) {
        return makeMri(2, "Fat-containing lesion with no (or minimal Rokitansky) enhancing solid tissue → O-RADS MRI 2.");
      }
      return makeMri(4, "Fat-containing lesion with a large volume of enhancing solid tissue → O-RADS MRI 4.");
    }

    // Enhancing solid tissue (non-fatty).
    if (lesionType === "solid_tissue") {
      // Homogeneous dark T2 AND dark DWI = fibrous tissue → O-RADS MRI 2,
      // independent of enhancement.
      if (darkT2Dwi) {
        return makeMri(2, "Solid tissue homogeneously dark on T2 and high-b DWI (fibrous) → O-RADS MRI 2.");
      }
      if (tic === "") return null;
      if (tic === "low") return makeMri(3, "Enhancing solid tissue with a low-risk time-intensity curve → O-RADS MRI 3.");
      if (tic === "intermediate") return makeMri(4, "Enhancing solid tissue with an intermediate-risk time-intensity curve → O-RADS MRI 4.");
      if (tic === "high") return makeMri(5, "Enhancing solid tissue with a high-risk time-intensity curve → O-RADS MRI 5.");
      // tic === "no_dce" — fall back to enhancement vs myometrium at 30–40 s.
      if (nonDce === "") return null;
      if (nonDce === "le_myometrium") {
        return makeMri(4, "Enhancing solid tissue (no DCE), enhancing ≤ myometrium at 30–40 s → O-RADS MRI 4.");
      }
      return makeMri(5, "Enhancing solid tissue (no DCE), enhancing > myometrium at 30–40 s → O-RADS MRI 5.");
    }

    return null;
  }
}

// ===========================================================================
//  Shared helpers
// ===========================================================================

// Feature description for report text (US).
export function describeOradsUsFeatures(input: OradsUsInput): string {
  const parts: string[] = [];
  if (input.lesionType) {
    const t = US_LESION_TYPES.find((x) => x.value === input.lesionType);
    if (input.lesionType === "classic_benign" && input.classicBenignType) {
      const c = CLASSIC_BENIGN_TYPES.find((x) => x.value === input.classicBenignType);
      parts.push(c ? c.label.toLowerCase() : "classic benign lesion");
    } else if (input.lesionType === "physiologic" && input.physiologicType) {
      parts.push(input.physiologicType === "follicle" ? "follicle" : "corpus luteum");
    } else if (t) {
      parts.push(t.label.toLowerCase());
    }
  }
  if (input.sizeCm !== null) parts.push(`${input.sizeCm} cm`);
  if (input.innerWall) parts.push(`${input.innerWall} inner wall`);
  if (input.solidComponent === "present") {
    if (input.papillaryProjections !== null) parts.push(`${input.papillaryProjections} papillary projection(s)`);
    else parts.push("solid component");
  }
  if (input.outerContour) parts.push(`${input.outerContour} contour`);
  if (input.shadowing) parts.push("shadowing");
  if (input.colorScore !== null) parts.push(`CS ${input.colorScore}`);
  if (input.ascitesNodules) parts.push("ascites/peritoneal nodules");
  return parts.join(", ");
}

// Feature description for report text (MRI).
export function describeOradsMriFeatures(input: OradsMriInput): string {
  const parts: string[] = [];
  const t = MRI_LESION_TYPES.find((x) => x.value === input.lesionType);
  if (t) parts.push(t.label.toLowerCase());
  if (input.lesionType === "cystic_no_solid") {
    if (input.locularity) parts.push(input.locularity);
    const fluidLabel: Record<Exclude<MriFluid, "">, string> = {
      simple: "simple fluid",
      endometriotic: "endometriotic fluid",
      hemorrhagic: "hemorrhagic fluid",
      proteinaceous: "proteinaceous/mucinous fluid",
    };
    if (input.fluid) parts.push(fluidLabel[input.fluid]);
    if (MRI_WALL_ENHANCEMENT_RELEVANT.includes(input.fluid)) {
      parts.push(input.wallEnhancement ? "wall enhancement" : "no wall enhancement");
    }
  }
  if (input.lesionType === "fat") parts.push(input.fatEnhancingSolid ? "large enhancing solid tissue" : "no enhancing solid tissue");
  if (input.lesionType === "solid_tissue") {
    if (input.darkT2Dwi) parts.push("dark T2 / dark DWI");
    else if (input.tic === "no_dce") {
      if (input.nonDce) parts.push(input.nonDce === "le_myometrium" ? "enhancement ≤ myometrium" : "enhancement > myometrium");
    } else if (input.tic) parts.push(`${input.tic}-risk TIC`);
  }
  if (input.peritonealImplants) parts.push("peritoneal/omental disease");
  return parts.join(", ");
}

// Risk color helper (shared 0–5 scale).
export function oradsRiskBg(score: number): string {
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
