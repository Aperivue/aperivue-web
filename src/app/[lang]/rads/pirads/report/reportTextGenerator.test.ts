import { describe, it, expect } from "vitest";
import { generatePiradsReportText, generateAutoImpression } from "./reportTextGenerator";
import { buildPiradsInput, parseMm } from "./ReportContext";
import { scorePirads } from "@/lib/rads/pirads";
import type { PiradsLesion, PiradsReportState, ScoredPiradsLesion } from "./types";

function lesion(overrides: Partial<PiradsLesion> = {}): PiradsLesion {
  return {
    id: "1",
    label: "Lesion 1",
    side: "right",
    level: "base",
    zone: "pz",
    sizeMm: "12",
    epe: false,
    t2w: "",
    dwi: "4",
    dce: "",
    ...overrides,
  };
}

function makeState(overrides: Partial<PiradsReportState> = {}): PiradsReportState {
  return {
    clinicalInfo: { indication: "elevated_psa", customIndication: "", comparison: "", psa: "8", prostateVolumeMl: "40" },
    lesions: [lesion()],
    activeLesionId: "1",
    otherFindings: "",
    impressionOverride: null,
    ...overrides,
  };
}

function scoreAll(state: PiradsReportState): ScoredPiradsLesion[] {
  return state.lesions.map((l) => {
    const input = buildPiradsInput(l);
    return { lesion: l, sizeMmNum: parseMm(l.sizeMm), input, result: scorePirads(input), featureDescription: "" };
  });
}

describe("PI-RADS report text — required lines", () => {
  it("includes technique, clinical, lesion, category, rationale, management", () => {
    const state = makeState();
    const text = generatePiradsReportText(state, scoreAll(state));
    expect(text).toContain("TECHNIQUE:");
    expect(text).toMatch(/multiparametric/i);
    expect(text).toContain("PSA 8 ng/mL");
    expect(text).toMatch(/PSA density 0\.20/);
    expect(text).toContain("Lesion 1");
    expect(text).toContain("PI-RADS 4");
    expect(text).toContain("Rationale:");
    expect(text).toContain("Clinical note:");
  });

  it("flags incomplete lesions", () => {
    const state = makeState({ lesions: [lesion({ zone: "", dwi: "" })], activeLesionId: "1" });
    const text = generatePiradsReportText(state, scoreAll(state));
    expect(text).toMatch(/incomplete input/i);
  });

  it("tags the highest-scoring lesion as the index lesion", () => {
    const state = makeState({
      lesions: [lesion({ id: "1", dwi: "2" }), lesion({ id: "2", label: "Lesion 2", dwi: "5" })],
      activeLesionId: "1",
    });
    const impression = generateAutoImpression(state, scoreAll(state));
    expect(impression).toMatch(/Lesion 2.*index lesion/);
  });

  it("breaks an equal-PI-RADS tie by extraprostatic extension", () => {
    const state = makeState({
      lesions: [
        lesion({ id: "1", label: "Lesion 1", dwi: "4" }),
        lesion({ id: "2", label: "Lesion 2", dwi: "4", epe: true }),
      ],
      activeLesionId: "1",
    });
    const impression = generateAutoImpression(state, scoreAll(state));
    expect(impression).toMatch(/Lesion 2.*index lesion/);
  });

  it("does not tag an index lesion when all findings are PI-RADS <3", () => {
    const state = makeState({
      lesions: [lesion({ id: "1", dwi: "2" }), lesion({ id: "2", label: "Lesion 2", dwi: "1" })],
      activeLesionId: "1",
    });
    const impression = generateAutoImpression(state, scoreAll(state));
    expect(impression).not.toMatch(/index lesion/);
  });
});
