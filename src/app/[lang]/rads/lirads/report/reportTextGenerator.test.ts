import { describe, it, expect } from "vitest";
import { generateLiradsReportText, generateAutoImpression } from "./reportTextGenerator";
import { buildLiradsInput } from "./ReportContext";
import { scoreLirads } from "@/lib/rads/lirads";
import type { LiradsObservation, LiradsReportState, ScoredLiradsObservation } from "./types";

function emptyObservation(overrides: Partial<LiradsObservation> = {}): LiradsObservation {
  return {
    id: "1",
    label: "Observation 1",
    segment: "VIII",
    sizeMm: "40",
    diagnosticQuality: "adequate",
    aphe: "nonrim",
    washout: "pvp",
    enhancingCapsule: false,
    thresholdGrowth: false,
    tumorInVein: false,
    benignity: "",
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

function makeState(overrides: Partial<LiradsReportState> = {}): LiradsReportState {
  return {
    modality: "mri",
    contrastAgent: "eca",
    clinicalInfo: { applicableContext: "cirrhosis", indication: "hcc_surveillance", customIndication: "", comparison: "" },
    observations: [emptyObservation()],
    activeObservationId: "1",
    otherFindings: "",
    impressionOverride: null,
    ...overrides,
  };
}

function scoreAll(state: LiradsReportState): ScoredLiradsObservation[] {
  return state.observations.map((o) => {
    const input = buildLiradsInput(o, state.contrastAgent);
    return {
      observation: o,
      sizeMmNum: input.sizeMm,
      input,
      result: scoreLirads(input),
      featureDescription: "",
    };
  });
}

describe("LI-RADS report text — required lines", () => {
  it("includes technique, context, observation, category, rationale, and management", () => {
    const state = makeState();
    const text = generateLiradsReportText(state, scoreAll(state));

    // modality + contrast agent
    expect(text).toContain("TECHNIQUE:");
    expect(text).toContain("MRI");
    expect(text).toContain("Extracellular agent");
    // applicable clinical context assumed
    expect(text).toMatch(/applicable clinical context assumed/i);
    // observation label/segment/size
    expect(text).toContain("Observation 1");
    expect(text).toContain("Segment VIII");
    expect(text).toContain("40 mm");
    // category + rationale + management
    expect(text).toContain("LI-RADS category: LR-5");
    expect(text).toContain("Rationale:");
    expect(text).toContain("Recommendation:");
  });

  it("emits a not-applicable warning when the context is not LI-RADS high-risk", () => {
    const state = makeState({
      clinicalInfo: { applicableContext: "not_applicable", indication: "", customIndication: "", comparison: "" },
    });
    const text = generateLiradsReportText(state, scoreAll(state));
    expect(text).toMatch(/does not apply/i);
    expect(generateAutoImpression(state, scoreAll(state))).toMatch(/does not apply/i);
  });

  it("explains LR-NC when an observation is nondiagnostic", () => {
    const state = makeState({
      observations: [emptyObservation({ diagnosticQuality: "nondiagnostic" })],
      activeObservationId: "1",
    });
    const text = generateLiradsReportText(state, scoreAll(state));
    expect(text).toMatch(/nondiagnostic/i);
    expect(text).toContain("LR-NC");
    expect(text).toMatch(/omission or degradation/i);
  });
});
