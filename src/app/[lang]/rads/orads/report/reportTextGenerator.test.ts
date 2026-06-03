import { describe, it, expect } from "vitest";
import { generateOradsReportText, generateAutoImpression } from "./reportTextGenerator";
import type { OradsReportState, OradsLesion } from "./types";

function lesion(overrides: Partial<OradsLesion> = {}): OradsLesion {
  return {
    id: "1",
    label: "Lesion 1",
    laterality: "right",
    sizeCm: "6",
    us: {
      lesionType: "unilocular",
      physiologicType: "",
      innerWall: "smooth",
      cystContent: "simple",
      solidComponent: "none",
      papillaryProjections: "",
      outerContour: "",
      shadowing: false,
      colorScore: "",
      classicBenignType: "",
      ascitesNodules: false,
    },
    mri: {
      lesionType: "cystic_no_solid",
      locularity: "unilocular",
      fluid: "simple",
      wallEnhancement: false,
      fatEnhancingSolid: false,
      darkT2Dwi: false,
      tic: "",
      nonDce: "",
      peritonealImplants: false,
    },
    ...overrides,
  };
}

function state(overrides: Partial<OradsReportState> = {}): OradsReportState {
  return {
    system: "us",
    clinicalInfo: { indication: "incidental", customIndication: "", comparison: "", menopausal: "pre" },
    lesions: [lesion()],
    activeLesionId: "1",
    otherFindings: "",
    impressionOverride: null,
    ...overrides,
  };
}

// A scored lesion mirrors what ReportContext computes; build it from the engine.
import { scoreOradsUs, scoreOradsMri, describeOradsUsFeatures, describeOradsMriFeatures } from "@/lib/rads/orads";
import { buildUsInput, buildMriInput, parseCm } from "./ReportContext";
import type { ScoredOradsLesion } from "./types";

function scoreAll(s: OradsReportState): ScoredOradsLesion[] {
  return s.lesions.map((l) => {
    if (s.system === "us") {
      const input = buildUsInput(l, s.clinicalInfo.menopausal);
      return { lesion: l, sizeCmNum: parseCm(l.sizeCm), result: scoreOradsUs(input), featureDescription: describeOradsUsFeatures(input) };
    }
    const input = buildMriInput(l, s.clinicalInfo.menopausal);
    return { lesion: l, sizeCmNum: parseCm(l.sizeCm), result: scoreOradsMri(input), featureDescription: describeOradsMriFeatures(input) };
  });
}

describe("O-RADS report text", () => {
  it("US header and category appear", () => {
    const s = state();
    const txt = generateOradsReportText(s, scoreAll(s));
    expect(txt).toContain("O-RADS US v2022");
    expect(txt).toContain("O-RADS 2");
    expect(txt).toContain("Premenopausal");
  });

  it("MRI header and category appear", () => {
    const s = state({ system: "mri" });
    const txt = generateOradsReportText(s, scoreAll(s));
    expect(txt).toContain("O-RADS MRI 2022");
    expect(txt).toContain("O-RADS MRI 2");
  });

  it("impression marks the highest-score lesion as driving management", () => {
    const benign = lesion({ id: "1", label: "Lesion 1" });
    const malignant = lesion({
      id: "2",
      label: "Lesion 2",
      sizeCm: "8",
      us: { ...lesion().us, lesionType: "solid", outerContour: "irregular", innerWall: "", cystContent: "", solidComponent: "" },
    });
    const s = state({ lesions: [benign, malignant], activeLesionId: "1" });
    const imp = generateAutoImpression(s, scoreAll(s));
    // Lesion 2 (O-RADS 5) should sort first and be tagged.
    expect(imp).toMatch(/Lesion 2.*drives management.*O-RADS 5/s);
  });

  it("empty lesions yield a graceful impression", () => {
    const empty = lesion({ us: { ...lesion().us, lesionType: "" } });
    const s = state({ lesions: [empty] });
    const imp = generateAutoImpression(s, scoreAll(s));
    expect(imp).toMatch(/No categorizable lesion/);
  });
});
