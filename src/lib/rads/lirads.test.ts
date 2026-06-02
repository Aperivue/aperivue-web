import { describe, it, expect } from "vitest";
import {
  scoreLirads,
  hasMajorWashout,
  type LiradsInput,
  type LiradsCategory,
  type LiradsContrastAgent,
  type Aphe,
  type WashoutPhase,
} from "./lirads";

// ---------------------------------------------------------------------------
// These tests are a REGRESSION / INVARIANT harness. They do NOT replace the
// radiologist's manual 1:1 reconciliation against the ACR CT/MRI LI-RADS v2018
// Core. Expected values below are hand-curated from the published v2018
// diagnostic table and precedence rules — an oracle independent of the engine.
// ---------------------------------------------------------------------------

const ALL_CATEGORIES: LiradsCategory[] = [
  "LR-NC",
  "LR-1",
  "LR-2",
  "LR-3",
  "LR-4",
  "LR-5",
  "LR-M",
  "LR-TIV",
];

function base(overrides: Partial<LiradsInput> = {}): LiradsInput {
  return {
    contrastAgent: "eca",
    diagnosticQuality: "adequate",
    tumorInVein: false,
    benignity: "",
    aphe: "nonrim",
    sizeMm: 15,
    washout: "none",
    enhancingCapsule: false,
    thresholdGrowth: false,
    lrm: {
      peripheralWashout: false,
      delayedCentralEnhancement: false,
      targetoidRestriction: false,
      targetoidAppearance: false,
      infiltrative: false,
      markedDiffusionRestriction: false,
      necrosisOrSevereIschemia: false,
    },
    ancillaryMalignancy: {
      restrictedDiffusion: false,
      mildModerateT2Hyperintensity: false,
      coronaEnhancement: false,
      fatSparingInSolidMass: false,
      ironSparingInSolidMass: false,
      bloodProducts: false,
      hbpHypointensity: false,
      subthresholdGrowth: false,
    },
    ancillaryBenign: {
      sizeStabilityTwoYears: false,
      sizeReduction: false,
      parallelsBloodPool: false,
      hbpIsoOrHyperintensity: false,
      undistortedVessels: false,
    },
    ...overrides,
  };
}

function cat(overrides: Partial<LiradsInput>): LiradsCategory | null {
  return scoreLirads(base(overrides))?.category ?? null;
}

// ── 1. Golden / exhaustive diagnostic-table tests ──────────────────────────
// Oracle = hand-written reference table (NOT the engine). Each row is an
// independent transcription of the v2018 CT/MRI table.

describe("v2018 diagnostic table — golden cells", () => {
  // No APHE (size-independent): 0 features → LR-3, ≥1 → LR-4
  it("no APHE → LR-3 / LR-4 (size-independent)", () => {
    expect(cat({ aphe: "none", sizeMm: 8, washout: "none" })).toBe("LR-3");
    expect(cat({ aphe: "none", sizeMm: 15, washout: "none" })).toBe("LR-3");
    expect(cat({ aphe: "none", sizeMm: 30, washout: "none" })).toBe("LR-3");
    expect(cat({ aphe: "none", sizeMm: 8, washout: "pvp" })).toBe("LR-4");
    expect(cat({ aphe: "none", sizeMm: 30, enhancingCapsule: true })).toBe("LR-4");
  });

  // Nonrim APHE, <10 mm: 0 → LR-3, ≥1 → LR-4 (never LR-5)
  it("nonrim APHE <10 mm → LR-3 / LR-4 (cannot reach LR-5)", () => {
    expect(cat({ aphe: "nonrim", sizeMm: 8, washout: "none" })).toBe("LR-3");
    expect(cat({ aphe: "nonrim", sizeMm: 8, washout: "pvp" })).toBe("LR-4");
    expect(cat({ aphe: "nonrim", sizeMm: 9, enhancingCapsule: true, thresholdGrowth: true })).toBe("LR-4");
  });

  // Nonrim APHE, 10–19 mm: the critical diagonal
  it("nonrim APHE 10–19 mm — 0 features → LR-3", () => {
    expect(cat({ aphe: "nonrim", sizeMm: 12, washout: "none" })).toBe("LR-3");
  });
  it("nonrim APHE 10–19 mm — capsule ONLY → LR-4", () => {
    expect(cat({ aphe: "nonrim", sizeMm: 12, enhancingCapsule: true })).toBe("LR-4");
    expect(cat({ aphe: "nonrim", sizeMm: 19, enhancingCapsule: true })).toBe("LR-4");
  });
  it("nonrim APHE 10–19 mm — washout ONLY → LR-5", () => {
    expect(cat({ aphe: "nonrim", sizeMm: 12, washout: "pvp" })).toBe("LR-5");
  });
  it("nonrim APHE 10–19 mm — threshold growth ONLY → LR-5", () => {
    expect(cat({ aphe: "nonrim", sizeMm: 12, thresholdGrowth: true })).toBe("LR-5");
  });
  it("nonrim APHE 10–19 mm — ≥2 features → LR-5", () => {
    expect(cat({ aphe: "nonrim", sizeMm: 12, enhancingCapsule: true, washout: "pvp" })).toBe("LR-5");
    expect(cat({ aphe: "nonrim", sizeMm: 12, enhancingCapsule: true, thresholdGrowth: true })).toBe("LR-5");
  });

  // Nonrim APHE, ≥20 mm: 0 → LR-4, ≥1 → LR-5
  it("nonrim APHE ≥20 mm → LR-4 / LR-5", () => {
    expect(cat({ aphe: "nonrim", sizeMm: 25, washout: "none" })).toBe("LR-4");
    expect(cat({ aphe: "nonrim", sizeMm: 20, enhancingCapsule: true })).toBe("LR-5");
    expect(cat({ aphe: "nonrim", sizeMm: 40, washout: "pvp" })).toBe("LR-5");
  });
});

// ── 2. Priority / precedence tests ─────────────────────────────────────────

describe("precedence: LR-NC > LR-TIV > LR-1/2 > LR-M > table > ancillary", () => {
  it("nondiagnostic quality beats LR-5 features → LR-NC", () => {
    expect(cat({ diagnosticQuality: "nondiagnostic", aphe: "nonrim", sizeMm: 40, washout: "pvp" })).toBe("LR-NC");
  });
  it("definite TIV beats LR-M features → LR-TIV", () => {
    expect(
      cat({ tumorInVein: true, lrm: { ...base().lrm, infiltrative: true } }),
    ).toBe("LR-TIV");
  });
  it("rim APHE → LR-M (never enters the table)", () => {
    expect(cat({ aphe: "rim", sizeMm: 40, washout: "pvp", enhancingCapsule: true })).toBe("LR-M");
  });
  it("a targetoid LR-M feature with otherwise-LR-5 inputs → LR-M", () => {
    expect(
      cat({
        aphe: "nonrim",
        sizeMm: 40,
        washout: "pvp",
        lrm: { ...base().lrm, peripheralWashout: true },
      }),
    ).toBe("LR-M");
  });
  it("definitely benign overrides table → LR-1", () => {
    expect(cat({ benignity: "definite", aphe: "nonrim", sizeMm: 40, washout: "pvp" })).toBe("LR-1");
  });
  it("probably benign → LR-2", () => {
    expect(cat({ benignity: "probable", aphe: "nonrim", sizeMm: 12 })).toBe("LR-2");
  });
  // Regression: benignity precedes LR-M in the v2018 algorithm. A conflicting
  // "definitely benign + rim APHE / LR-M feature" must return LR-1, not LR-M.
  it("definitely benign beats rim APHE / LR-M features → LR-1", () => {
    expect(cat({ benignity: "definite", aphe: "rim", washout: "pvp", enhancingCapsule: true })).toBe("LR-1");
    expect(cat({ benignity: "definite", lrm: { ...base().lrm, infiltrative: true } })).toBe("LR-1");
  });
  it("probably benign beats LR-M features → LR-2", () => {
    expect(cat({ benignity: "probable", lrm: { ...base().lrm, peripheralWashout: true } })).toBe("LR-2");
  });
});

// ── 3. LR-NC vs incomplete input (null) ────────────────────────────────────

describe("LR-NC is not the same as incomplete input", () => {
  it("size blank with adequate quality → null (incomplete), not LR-NC", () => {
    expect(cat({ aphe: "nonrim", sizeMm: null })).toBeNull();
  });
  it("APHE not selected with adequate quality → null (incomplete), not LR-NC", () => {
    expect(cat({ aphe: "", sizeMm: 15 })).toBeNull();
  });
  it("washout not assessed (empty) with APHE + size → null, not silently absent", () => {
    expect(cat({ aphe: "nonrim", sizeMm: 12, washout: "" })).toBeNull();
    expect(cat({ aphe: "none", sizeMm: 30, washout: "" })).toBeNull();
  });
  it("a merely limited (not nondiagnostic) study still categorizes", () => {
    expect(cat({ diagnosticQuality: "limited", aphe: "nonrim", sizeMm: 25, washout: "none" })).toBe("LR-4");
  });
  it("override categories return even when size is blank (no table needed)", () => {
    expect(cat({ tumorInVein: true, sizeMm: null, aphe: "" })).toBe("LR-TIV");
    expect(cat({ diagnosticQuality: "nondiagnostic", sizeMm: null, aphe: "" })).toBe("LR-NC");
  });
});

// ── 4. Ancillary invariants ────────────────────────────────────────────────

describe("ancillary adjustment invariants", () => {
  it("malignancy AF upgrades one category but never to LR-5", () => {
    // base LR-3 → LR-4
    expect(
      cat({ aphe: "nonrim", sizeMm: 12, ancillaryMalignancy: { ...base().ancillaryMalignancy, restrictedDiffusion: true } }),
    ).toBe("LR-4");
    // base LR-4 stays LR-4 (cannot reach LR-5)
    expect(
      cat({ aphe: "nonrim", sizeMm: 25, ancillaryMalignancy: { ...base().ancillaryMalignancy, coronaEnhancement: true } }),
    ).toBe("LR-4");
  });
  it("benignity AF downgrades one category (floor respected)", () => {
    // base LR-4 → LR-3
    expect(
      cat({ aphe: "nonrim", sizeMm: 25, ancillaryBenign: { ...base().ancillaryBenign, sizeReduction: true } }),
    ).toBe("LR-3");
    // base LR-3 → LR-2
    expect(
      cat({ aphe: "nonrim", sizeMm: 12, ancillaryBenign: { ...base().ancillaryBenign, parallelsBloodPool: true } }),
    ).toBe("LR-2");
  });
  it("conflicting AFs (both favoring) → no adjustment", () => {
    expect(
      cat({
        aphe: "nonrim",
        sizeMm: 12,
        ancillaryMalignancy: { ...base().ancillaryMalignancy, restrictedDiffusion: true },
        ancillaryBenign: { ...base().ancillaryBenign, sizeReduction: true },
      }),
    ).toBe("LR-3");
  });
  it("ancillary is not applied to LR-5 from the table", () => {
    expect(
      cat({ aphe: "nonrim", sizeMm: 40, washout: "pvp", ancillaryBenign: { ...base().ancillaryBenign, sizeReduction: true } }),
    ).toBe("LR-5");
  });
  it("ancillary is not applied to LR-M / LR-TIV / LR-NC", () => {
    expect(
      cat({ tumorInVein: true, ancillaryBenign: { ...base().ancillaryBenign, sizeReduction: true } }),
    ).toBe("LR-TIV");
    expect(
      cat({ diagnosticQuality: "nondiagnostic", ancillaryMalignancy: { ...base().ancillaryMalignancy, restrictedDiffusion: true } }),
    ).toBe("LR-NC");
  });
});

// ── 5. HBA / ECA contrast-agent tests ──────────────────────────────────────

describe("contrast-agent washout semantics", () => {
  it("ECA: delayed-phase washout counts as a major feature", () => {
    expect(hasMajorWashout("delayed", "eca")).toBe(true);
    // 10–19 mm nonrim + delayed washout only → LR-5
    expect(cat({ contrastAgent: "eca", aphe: "nonrim", sizeMm: 12, washout: "delayed" })).toBe("LR-5");
  });
  it("HBA: delayed/transitional washout does NOT count as a major feature", () => {
    expect(hasMajorWashout("delayed", "hba")).toBe(false);
    // 10–19 mm nonrim + delayed washout only → still LR-3 (no major feature)
    expect(cat({ contrastAgent: "hba", aphe: "nonrim", sizeMm: 12, washout: "delayed" })).toBe("LR-3");
  });
  it("HBA: PVP washout still counts", () => {
    expect(hasMajorWashout("pvp", "hba")).toBe(true);
    expect(cat({ contrastAgent: "hba", aphe: "nonrim", sizeMm: 12, washout: "pvp" })).toBe("LR-5");
  });
  it("HBA: HBP hypointensity alone (ancillary) cannot reach LR-5", () => {
    // nonrim 10–19, no major washout, only ancillary HBP hypointensity → LR-3 upgraded to LR-4
    expect(
      cat({
        contrastAgent: "hba",
        aphe: "nonrim",
        sizeMm: 12,
        washout: "none",
        ancillaryMalignancy: { ...base().ancillaryMalignancy, hbpHypointensity: true },
      }),
    ).toBe("LR-4");
  });
});

// ── 6. Random / fuzz invariant tests ───────────────────────────────────────

// Seeded PRNG (mulberry32) — reproducible, no Math.random / Date dependency.
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

function anyTrue(obj: Record<string, boolean>): boolean {
  return Object.values(obj).some(Boolean);
}

describe("fuzz invariants (10,000 random observations)", () => {
  it("holds all structural invariants", () => {
    const rnd = mulberry32(0x1ab5);
    const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)];
    const coin = (p = 0.5) => rnd() < p;
    const agents: LiradsContrastAgent[] = ["eca", "hba"];
    const qualities = ["adequate", "limited", "nondiagnostic"] as const;
    const aphes: Aphe[] = ["", "none", "rim", "nonrim"];
    const washouts: WashoutPhase[] = ["", "none", "pvp", "delayed"];
    const benignities = ["", "definite", "probable"] as const;
    const sizes = [null, 4, 8, 9, 10, 12, 15, 19, 20, 25, 40, 80];

    const allowed = new Set<LiradsCategory>(ALL_CATEGORIES);

    for (let i = 0; i < 10000; i++) {
      const input: LiradsInput = {
        contrastAgent: pick(agents),
        diagnosticQuality: pick(qualities),
        tumorInVein: coin(0.15),
        benignity: pick(benignities),
        aphe: pick(aphes),
        sizeMm: pick(sizes),
        washout: pick(washouts),
        enhancingCapsule: coin(0.3),
        thresholdGrowth: coin(0.3),
        lrm: {
          peripheralWashout: coin(0.1),
          delayedCentralEnhancement: coin(0.1),
          targetoidRestriction: coin(0.1),
          targetoidAppearance: coin(0.1),
          infiltrative: coin(0.1),
          markedDiffusionRestriction: coin(0.1),
          necrosisOrSevereIschemia: coin(0.1),
        },
        ancillaryMalignancy: {
          restrictedDiffusion: coin(0.2),
          mildModerateT2Hyperintensity: coin(0.15),
          coronaEnhancement: coin(0.1),
          fatSparingInSolidMass: coin(0.1),
          ironSparingInSolidMass: coin(0.1),
          bloodProducts: coin(0.1),
          hbpHypointensity: coin(0.1),
          subthresholdGrowth: coin(0.1),
        },
        ancillaryBenign: {
          sizeStabilityTwoYears: coin(0.15),
          sizeReduction: coin(0.1),
          parallelsBloodPool: coin(0.1),
          hbpIsoOrHyperintensity: coin(0.1),
          undistortedVessels: coin(0.1),
        },
      };

      const res = scoreLirads(input);

      // Invariant A: result is null or an allowed category.
      if (res === null) continue;
      expect(allowed.has(res.category)).toBe(true);

      // Invariant B: a category always carries rationale + management.
      expect(res.rationale.length).toBeGreaterThan(0);
      expect(res.management.length).toBeGreaterThan(0);

      // Invariant C: LR-5 only via the nonrim-APHE diagnostic table.
      if (res.category === "LR-5") {
        expect(input.diagnosticQuality).not.toBe("nondiagnostic");
        expect(input.tumorInVein).toBe(false);
        expect(input.aphe).toBe("nonrim");
        expect(anyTrue(input.lrm)).toBe(false);
        expect(input.benignity).toBe("");
        expect(input.sizeMm).not.toBeNull();
        expect(input.sizeMm as number).toBeGreaterThanOrEqual(10);
      }

      // Invariant D: rim APHE / LR-M features divert to LR-M (not the table),
      // unless pre-empted by LR-NC, LR-TIV, or a benign diagnosis (which the
      // v2018 algorithm evaluates before LR-M).
      if (
        input.diagnosticQuality !== "nondiagnostic" &&
        !input.tumorInVein &&
        input.benignity === "" &&
        (input.aphe === "rim" || anyTrue(input.lrm))
      ) {
        expect(res.category).toBe("LR-M");
      }

      // Invariant E: HBA delayed-only washout never yields a major-feature LR-5.
      if (
        input.contrastAgent === "hba" &&
        input.washout === "delayed" &&
        !input.enhancingCapsule &&
        !input.thresholdGrowth &&
        input.aphe === "nonrim" &&
        input.sizeMm !== null &&
        input.sizeMm < 20 &&
        input.diagnosticQuality !== "nondiagnostic" &&
        !input.tumorInVein &&
        input.aphe !== "rim" &&
        !anyTrue(input.lrm) &&
        input.benignity === ""
      ) {
        expect(res.category).not.toBe("LR-5");
      }
    }
  });
});
