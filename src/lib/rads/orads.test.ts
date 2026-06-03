import { describe, it, expect } from "vitest";
import {
  scoreOradsUs,
  scoreOradsMri,
  type OradsUsInput,
  type OradsMriInput,
  type UsLesionType,
  type Menopausal,
  type InnerWall,
  type SolidComponent,
  type OuterContour,
  type ColorScore,
  type ClassicBenignType,
  type PhysiologicType,
  type MriLesionType,
  type MriLocularity,
  type MriFluid,
  type MriTic,
  type MriNonDce,
} from "./orads";

// ---------------------------------------------------------------------------
// Regression / invariant harness for O-RADS US v2022 and O-RADS MRI 2022.
// Does NOT replace radiologist reconciliation against the ACR source tables.
// Expected values are hand-curated from the published assessment categories.
// ---------------------------------------------------------------------------

function usBase(overrides: Partial<OradsUsInput> = {}): OradsUsInput {
  return {
    lesionType: "",
    menopausal: "pre",
    sizeCm: null,
    physiologicType: "",
    innerWall: "",
    cystContent: "",
    solidComponent: "",
    papillaryProjections: null,
    outerContour: "",
    shadowing: false,
    colorScore: null,
    classicBenignType: "",
    ascitesNodules: false,
    ...overrides,
  };
}

function us(overrides: Partial<OradsUsInput>): number | null {
  return scoreOradsUs(usBase(overrides))?.score ?? null;
}

function mriBase(overrides: Partial<OradsMriInput> = {}): OradsMriInput {
  return {
    lesionType: "",
    menopausal: "",
    locularity: "",
    fluid: "",
    wallEnhancement: false,
    fatEnhancingSolid: false,
    darkT2Dwi: false,
    tic: "",
    nonDce: "",
    peritonealImplants: false,
    ...overrides,
  };
}

function mri(overrides: Partial<OradsMriInput>): number | null {
  return scoreOradsMri(mriBase(overrides))?.score ?? null;
}

// ===========================================================================
//  O-RADS US v2022 — golden cases
// ===========================================================================

describe("O-RADS US — normal / physiologic", () => {
  it("no lesion → O-RADS 1", () => {
    expect(us({ lesionType: "no_lesion" })).toBe(1);
  });
  it("follicle / corpus luteum → O-RADS 1", () => {
    expect(us({ lesionType: "physiologic", physiologicType: "follicle" })).toBe(1);
    expect(us({ lesionType: "physiologic", physiologicType: "corpus_luteum" })).toBe(1);
  });
  it("physiologic without type → null", () => {
    expect(us({ lesionType: "physiologic", physiologicType: "" })).toBeNull();
  });
});

describe("O-RADS US — unilocular cyst", () => {
  it("smooth, no solid, <10 cm → O-RADS 2", () => {
    expect(us({ lesionType: "unilocular", solidComponent: "none", innerWall: "smooth", sizeCm: 6 })).toBe(2);
    expect(us({ lesionType: "unilocular", solidComponent: "none", innerWall: "smooth", sizeCm: 9.9, cystContent: "nonsimple" })).toBe(2);
  });
  it("smooth, no solid, ≥10 cm → O-RADS 3", () => {
    expect(us({ lesionType: "unilocular", solidComponent: "none", innerWall: "smooth", sizeCm: 10 })).toBe(3);
    expect(us({ lesionType: "unilocular", solidComponent: "none", innerWall: "smooth", sizeCm: 14 })).toBe(3);
  });
  it("irregular inner wall, any size → O-RADS 3", () => {
    expect(us({ lesionType: "unilocular", solidComponent: "none", innerWall: "irregular", sizeCm: 4 })).toBe(3);
    expect(us({ lesionType: "unilocular", solidComponent: "none", innerWall: "irregular", sizeCm: 20 })).toBe(3);
  });
  it("solid component, <4 pps → O-RADS 4", () => {
    expect(us({ lesionType: "unilocular", solidComponent: "present", papillaryProjections: 0, sizeCm: 3 })).toBe(4);
    expect(us({ lesionType: "unilocular", solidComponent: "present", papillaryProjections: 3, sizeCm: 12 })).toBe(4);
  });
  it("solid component, ≥4 pps → O-RADS 5", () => {
    expect(us({ lesionType: "unilocular", solidComponent: "present", papillaryProjections: 4, sizeCm: 2 })).toBe(5);
  });
  it("solid component without pp count → null", () => {
    expect(us({ lesionType: "unilocular", solidComponent: "present", papillaryProjections: null })).toBeNull();
  });
});

describe("O-RADS US — bilocular cyst (lower risk than multilocular)", () => {
  it("smooth, no solid, <10 cm → O-RADS 2 (regardless of CS)", () => {
    expect(us({ lesionType: "bilocular", solidComponent: "none", innerWall: "smooth", sizeCm: 7, colorScore: 4 })).toBe(2);
  });
  it("smooth, no solid, ≥10 cm → O-RADS 3", () => {
    expect(us({ lesionType: "bilocular", solidComponent: "none", innerWall: "smooth", sizeCm: 11 })).toBe(3);
  });
  it("irregular, no solid, any size/CS → O-RADS 4", () => {
    expect(us({ lesionType: "bilocular", solidComponent: "none", innerWall: "irregular", sizeCm: 5 })).toBe(4);
  });
  it("with solid, CS 1–2 → O-RADS 4; CS 3–4 → O-RADS 5", () => {
    expect(us({ lesionType: "bilocular", solidComponent: "present", colorScore: 2 })).toBe(4);
    expect(us({ lesionType: "bilocular", solidComponent: "present", colorScore: 3 })).toBe(5);
  });
});

describe("O-RADS US — multilocular cyst", () => {
  it("smooth, no solid, <10 cm, CS<4 → O-RADS 3", () => {
    expect(us({ lesionType: "multilocular", solidComponent: "none", innerWall: "smooth", sizeCm: 8, colorScore: 3 })).toBe(3);
  });
  it("smooth, no solid, ≥10 cm, CS<4 → O-RADS 4", () => {
    expect(us({ lesionType: "multilocular", solidComponent: "none", innerWall: "smooth", sizeCm: 12, colorScore: 1 })).toBe(4);
  });
  it("smooth, no solid, CS 4, any size → O-RADS 4", () => {
    expect(us({ lesionType: "multilocular", solidComponent: "none", innerWall: "smooth", sizeCm: 4, colorScore: 4 })).toBe(4);
  });
  it("irregular, no solid → O-RADS 4", () => {
    expect(us({ lesionType: "multilocular", solidComponent: "none", innerWall: "irregular", sizeCm: 3, colorScore: 1 })).toBe(4);
  });
  it("with solid, CS 1–2 → 4; CS 3–4 → 5", () => {
    expect(us({ lesionType: "multilocular", solidComponent: "present", colorScore: 1 })).toBe(4);
    expect(us({ lesionType: "multilocular", solidComponent: "present", colorScore: 4 })).toBe(5);
  });
});

describe("O-RADS US — solid lesion", () => {
  it("smooth, CS 1, ± shadowing → O-RADS 3", () => {
    expect(us({ lesionType: "solid", outerContour: "smooth", colorScore: 1, shadowing: false })).toBe(3);
    expect(us({ lesionType: "solid", outerContour: "smooth", colorScore: 1, shadowing: true })).toBe(3);
  });
  it("smooth, CS 2–3, shadowing → O-RADS 3", () => {
    expect(us({ lesionType: "solid", outerContour: "smooth", colorScore: 2, shadowing: true })).toBe(3);
    expect(us({ lesionType: "solid", outerContour: "smooth", colorScore: 3, shadowing: true })).toBe(3);
  });
  it("smooth, CS 2–3, non-shadowing → O-RADS 4", () => {
    expect(us({ lesionType: "solid", outerContour: "smooth", colorScore: 2, shadowing: false })).toBe(4);
    expect(us({ lesionType: "solid", outerContour: "smooth", colorScore: 3, shadowing: false })).toBe(4);
  });
  it("smooth, CS 4 → O-RADS 5", () => {
    expect(us({ lesionType: "solid", outerContour: "smooth", colorScore: 4, shadowing: true })).toBe(5);
  });
  it("irregular contour, any CS → O-RADS 5", () => {
    expect(us({ lesionType: "solid", outerContour: "irregular", colorScore: 1 })).toBe(5);
  });
});

describe("O-RADS US — classic benign lesions", () => {
  it("ovarian (hemorrhagic/dermoid/endometrioma) <10 cm → O-RADS 2", () => {
    expect(us({ lesionType: "classic_benign", classicBenignType: "hemorrhagic", sizeCm: 4 })).toBe(2);
    expect(us({ lesionType: "classic_benign", classicBenignType: "dermoid", sizeCm: 8 })).toBe(2);
    expect(us({ lesionType: "classic_benign", classicBenignType: "endometrioma", sizeCm: 9 })).toBe(2);
  });
  it("ovarian classic benign ≥10 cm → O-RADS 3", () => {
    expect(us({ lesionType: "classic_benign", classicBenignType: "endometrioma", sizeCm: 11 })).toBe(3);
  });
  it("extraovarian (paraovarian/peritoneal/hydrosalpinx) any size → O-RADS 2", () => {
    expect(us({ lesionType: "classic_benign", classicBenignType: "paraovarian", sizeCm: 15 })).toBe(2);
    expect(us({ lesionType: "classic_benign", classicBenignType: "hydrosalpinx", sizeCm: 12 })).toBe(2);
    expect(us({ lesionType: "classic_benign", classicBenignType: "peritoneal_inclusion", sizeCm: null })).toBe(2);
  });
});

describe("O-RADS US — ascites / peritoneal nodules escalate to O-RADS 5", () => {
  it("benign lesion + suspicious peritoneal disease → O-RADS 5 with caveat", () => {
    const r = scoreOradsUs(usBase({ lesionType: "unilocular", solidComponent: "none", innerWall: "smooth", sizeCm: 5, ascitesNodules: true }));
    expect(r?.score).toBe(5);
    expect(r?.note).toMatch(/exclude other/i);
  });
  it("does not downgrade an already-5 lesion", () => {
    expect(us({ lesionType: "solid", outerContour: "irregular", colorScore: 1, ascitesNodules: true })).toBe(5);
  });
  it("ascites/peritoneal nodules alone (no lesion type selected) → O-RADS 5", () => {
    expect(us({ lesionType: "", ascitesNodules: true })).toBe(5);
  });
});

// ===========================================================================
//  O-RADS MRI 2022 — golden cases
// ===========================================================================

describe("O-RADS MRI — normal / physiologic", () => {
  it("no adnexal lesion → MRI 1", () => {
    expect(mri({ lesionType: "no_lesion" })).toBe(1);
  });
  it("premenopausal physiologic finding → MRI 1", () => {
    expect(mri({ lesionType: "physiologic", menopausal: "pre" })).toBe(1);
  });
  it("physiologic without menopausal status → null", () => {
    expect(mri({ lesionType: "physiologic", menopausal: "" })).toBeNull();
  });
  it("physiologic + postmenopausal → null (not physiologic; recharacterize)", () => {
    expect(mri({ lesionType: "physiologic", menopausal: "post" })).toBeNull();
  });
});

describe("O-RADS MRI — cystic, no enhancing solid tissue", () => {
  it("unilocular simple fluid → MRI 2 (wall enhancement irrelevant)", () => {
    expect(mri({ lesionType: "cystic_no_solid", locularity: "unilocular", fluid: "simple" })).toBe(2);
    expect(mri({ lesionType: "cystic_no_solid", locularity: "unilocular", fluid: "simple", wallEnhancement: true })).toBe(2);
  });
  it("unilocular endometriotic fluid → MRI 2 regardless of wall enhancement", () => {
    expect(mri({ lesionType: "cystic_no_solid", locularity: "unilocular", fluid: "endometriotic", wallEnhancement: false })).toBe(2);
    expect(mri({ lesionType: "cystic_no_solid", locularity: "unilocular", fluid: "endometriotic", wallEnhancement: true })).toBe(2);
  });
  it("unilocular hemorrhagic fluid: no wall enh → 2; wall enh → 3", () => {
    expect(mri({ lesionType: "cystic_no_solid", locularity: "unilocular", fluid: "hemorrhagic", wallEnhancement: false })).toBe(2);
    expect(mri({ lesionType: "cystic_no_solid", locularity: "unilocular", fluid: "hemorrhagic", wallEnhancement: true })).toBe(3);
  });
  it("unilocular proteinaceous/mucinous fluid: no wall enh → 2; wall enh → 3", () => {
    expect(mri({ lesionType: "cystic_no_solid", locularity: "unilocular", fluid: "proteinaceous", wallEnhancement: false })).toBe(2);
    expect(mri({ lesionType: "cystic_no_solid", locularity: "unilocular", fluid: "proteinaceous", wallEnhancement: true })).toBe(3);
  });
  it("multilocular, no solid tissue → MRI 3", () => {
    expect(mri({ lesionType: "cystic_no_solid", locularity: "multilocular" })).toBe(3);
  });
  it("unilocular without fluid type → null", () => {
    expect(mri({ lesionType: "cystic_no_solid", locularity: "unilocular", fluid: "" })).toBeNull();
  });
});

describe("O-RADS MRI — fat-containing", () => {
  it("no enhancing solid → MRI 2", () => {
    expect(mri({ lesionType: "fat", fatEnhancingSolid: false })).toBe(2);
  });
  it("large enhancing solid tissue → MRI 4", () => {
    expect(mri({ lesionType: "fat", fatEnhancingSolid: true })).toBe(4);
  });
});

describe("O-RADS MRI — enhancing solid tissue", () => {
  it("dark T2 / dark DWI (fibroma) → MRI 2 regardless of enhancement", () => {
    expect(mri({ lesionType: "solid_tissue", darkT2Dwi: true, tic: "high" })).toBe(2);
  });
  it("low-risk TIC → MRI 3", () => {
    expect(mri({ lesionType: "solid_tissue", tic: "low" })).toBe(3);
  });
  it("intermediate-risk TIC → MRI 4", () => {
    expect(mri({ lesionType: "solid_tissue", tic: "intermediate" })).toBe(4);
  });
  it("high-risk TIC → MRI 5", () => {
    expect(mri({ lesionType: "solid_tissue", tic: "high" })).toBe(5);
  });
  it("no DCE: ≤ myometrium → MRI 4; > myometrium → MRI 5", () => {
    expect(mri({ lesionType: "solid_tissue", tic: "no_dce", nonDce: "le_myometrium" })).toBe(4);
    expect(mri({ lesionType: "solid_tissue", tic: "no_dce", nonDce: "gt_myometrium" })).toBe(5);
  });
  it("solid tissue without TIC → null", () => {
    expect(mri({ lesionType: "solid_tissue", tic: "" })).toBeNull();
  });
  it("no DCE without enhancement comparison → null", () => {
    expect(mri({ lesionType: "solid_tissue", tic: "no_dce", nonDce: "" })).toBeNull();
  });
});

describe("O-RADS MRI — peritoneal disease escalates to MRI 5", () => {
  it("benign lesion + peritoneal implants → MRI 5", () => {
    const r = scoreOradsMri(mriBase({ lesionType: "cystic_no_solid", locularity: "unilocular", fluid: "simple", peritonealImplants: true }));
    expect(r?.score).toBe(5);
    expect(r?.note).toMatch(/peritoneal/i);
  });
  it("peritoneal implants alone (no lesion type selected) → MRI 5", () => {
    expect(mri({ lesionType: "", peritonealImplants: true })).toBe(5);
  });
});

describe("incomplete input → null", () => {
  it("US no lesion type → null", () => {
    expect(us({ lesionType: "" })).toBeNull();
  });
  it("MRI no lesion type → null", () => {
    expect(mri({ lesionType: "" })).toBeNull();
  });
});

// ===========================================================================
//  Fuzz — independent oracles transcribing the ACR tables
// ===========================================================================

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Independent oracle (NOT the engine) — transcribes O-RADS US v2022.
function oracleUs(i: OradsUsInput): number | null {
  const lesion = i.lesionType === "" ? null : oracleUsLesion(i);
  // Ascites/peritoneal nodules is an O-RADS 5 descriptor on its own.
  if (i.ascitesNodules) return 5;
  if (lesion === null) return null;
  return lesion;
}

function oracleUsLesion(i: OradsUsInput): number | null {
  switch (i.lesionType) {
    case "no_lesion":
      return 1;
    case "physiologic":
      return i.physiologicType === "" ? null : 1;
    case "classic_benign": {
      if (i.classicBenignType === "") return null;
      const extra = ["paraovarian", "peritoneal_inclusion", "hydrosalpinx"].includes(i.classicBenignType);
      if (extra) return 2;
      if (i.sizeCm === null) return null;
      return i.sizeCm < 10 ? 2 : 3;
    }
    case "unilocular": {
      if (i.solidComponent === "") return null;
      if (i.solidComponent === "present") {
        if (i.papillaryProjections === null) return null;
        return i.papillaryProjections >= 4 ? 5 : 4;
      }
      if (i.innerWall === "") return null;
      if (i.innerWall === "irregular") return 3;
      if (i.sizeCm === null) return null;
      return i.sizeCm < 10 ? 2 : 3;
    }
    case "bilocular": {
      if (i.solidComponent === "") return null;
      if (i.solidComponent === "present") {
        if (i.colorScore === null) return null;
        return i.colorScore <= 2 ? 4 : 5;
      }
      if (i.innerWall === "") return null;
      if (i.innerWall === "irregular") return 4;
      if (i.sizeCm === null) return null;
      return i.sizeCm < 10 ? 2 : 3;
    }
    case "multilocular": {
      if (i.solidComponent === "") return null;
      if (i.solidComponent === "present") {
        if (i.colorScore === null) return null;
        return i.colorScore <= 2 ? 4 : 5;
      }
      if (i.innerWall === "") return null;
      if (i.innerWall === "irregular") return 4;
      if (i.colorScore === null) return null;
      if (i.colorScore === 4) return 4;
      if (i.sizeCm === null) return null;
      return i.sizeCm < 10 ? 3 : 4;
    }
    case "solid": {
      if (i.outerContour === "") return null;
      if (i.outerContour === "irregular") return 5;
      if (i.colorScore === null) return null;
      if (i.colorScore === 1) return 3;
      if (i.colorScore === 4) return 5;
      return i.shadowing ? 3 : 4; // CS 2–3
    }
    default:
      return null;
  }
}

// Independent oracle (NOT the engine) — transcribes O-RADS MRI 2022.
function oracleMri(i: OradsMriInput): number | null {
  const lesion = i.lesionType === "" ? null : oracleMriLesion(i);
  // Peritoneal/omental disease is an O-RADS MRI 5 descriptor on its own.
  if (i.peritonealImplants) return 5;
  if (lesion === null) return null;
  return lesion;
}

function oracleMriLesion(i: OradsMriInput): number | null {
  switch (i.lesionType) {
    case "no_lesion":
      return 1;
    case "physiologic":
      if (i.menopausal === "") return null;
      if (i.menopausal === "post") return null;
      return 1;
    case "cystic_no_solid": {
      if (i.locularity === "") return null;
      if (i.locularity === "multilocular") return 3;
      if (i.fluid === "") return null;
      // Simple and endometriotic fluid are MRI 2 regardless of wall enhancement.
      if (i.fluid === "simple" || i.fluid === "endometriotic") return 2;
      // Hemorrhagic or proteinaceous: wall enhancement → 3.
      return i.wallEnhancement ? 3 : 2;
    }
    case "fat":
      return i.fatEnhancingSolid ? 4 : 2;
    case "solid_tissue": {
      if (i.darkT2Dwi) return 2;
      if (i.tic === "") return null;
      if (i.tic === "low") return 3;
      if (i.tic === "intermediate") return 4;
      if (i.tic === "high") return 5;
      if (i.nonDce === "") return null;
      return i.nonDce === "le_myometrium" ? 4 : 5;
    }
    default:
      return null;
  }
}

describe("fuzz invariants — O-RADS US (10,000 random lesions)", () => {
  it("matches the independent oracle and holds structural invariants", () => {
    const rnd = mulberry32(0x0ada);
    const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)];
    const lesionTypes: UsLesionType[] = ["", "no_lesion", "physiologic", "unilocular", "bilocular", "multilocular", "solid", "classic_benign"];
    const menos: Menopausal[] = ["", "pre", "post"];
    const sizes: (number | null)[] = [null, 2, 3, 5, 9.9, 10, 15];
    const walls: InnerWall[] = ["", "smooth", "irregular"];
    const solids: SolidComponent[] = ["", "none", "present"];
    const contours: OuterContour[] = ["", "smooth", "irregular"];
    const css: ColorScore[] = [null, 1, 2, 3, 4];
    const benigns: ClassicBenignType[] = ["", "hemorrhagic", "dermoid", "endometrioma", "paraovarian", "peritoneal_inclusion", "hydrosalpinx"];
    const physs: PhysiologicType[] = ["", "follicle", "corpus_luteum"];
    const pps: (number | null)[] = [null, 0, 1, 3, 4, 7];

    for (let n = 0; n < 10000; n++) {
      const input: OradsUsInput = {
        lesionType: pick(lesionTypes),
        menopausal: pick(menos),
        sizeCm: pick(sizes),
        physiologicType: pick(physs),
        innerWall: pick(walls),
        cystContent: pick(["", "simple", "nonsimple"] as const),
        solidComponent: pick(solids),
        papillaryProjections: pick(pps),
        outerContour: pick(contours),
        shadowing: rnd() < 0.5,
        colorScore: pick(css),
        classicBenignType: pick(benigns),
        ascitesNodules: rnd() < 0.5,
      };
      const res = scoreOradsUs(input);
      const expected = oracleUs(input);

      expect(res?.score ?? null).toBe(expected);
      if (res === null) continue;

      expect(res.score).toBeGreaterThanOrEqual(1);
      expect(res.score).toBeLessThanOrEqual(5);
      expect(res.category).toBe(`O-RADS ${res.score}`);
      expect(res.riskCategory.length).toBeGreaterThan(0);
      expect(res.management.length).toBeGreaterThan(0);
      // Ascites/peritoneal nodules can never be benign.
      if (input.ascitesNodules) expect(res.score).toBe(5);
    }
  });
});

describe("fuzz invariants — O-RADS MRI (10,000 random lesions)", () => {
  it("matches the independent oracle and holds structural invariants", () => {
    const rnd = mulberry32(0x5151);
    const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)];
    const lesionTypes: MriLesionType[] = ["", "no_lesion", "physiologic", "cystic_no_solid", "fat", "solid_tissue"];
    const menos: Menopausal[] = ["", "pre", "post"];
    const locs: MriLocularity[] = ["", "unilocular", "multilocular"];
    const fluids: MriFluid[] = ["", "simple", "endometriotic", "hemorrhagic", "proteinaceous"];
    const tics: MriTic[] = ["", "low", "intermediate", "high", "no_dce"];
    const nonDces: MriNonDce[] = ["", "le_myometrium", "gt_myometrium"];

    for (let n = 0; n < 10000; n++) {
      const input: OradsMriInput = {
        lesionType: pick(lesionTypes),
        menopausal: pick(menos),
        locularity: pick(locs),
        fluid: pick(fluids),
        wallEnhancement: rnd() < 0.5,
        fatEnhancingSolid: rnd() < 0.5,
        darkT2Dwi: rnd() < 0.5,
        tic: pick(tics),
        nonDce: pick(nonDces),
        peritonealImplants: rnd() < 0.5,
      };
      const res = scoreOradsMri(input);
      const expected = oracleMri(input);

      expect(res?.score ?? null).toBe(expected);
      if (res === null) continue;

      expect(res.score).toBeGreaterThanOrEqual(1);
      expect(res.score).toBeLessThanOrEqual(5);
      expect(res.category).toBe(`O-RADS MRI ${res.score}`);
      expect(res.riskCategory.length).toBeGreaterThan(0);
      // Peritoneal disease can never be benign.
      if (input.peritonealImplants) expect(res.score).toBe(5);
    }
  });
});
