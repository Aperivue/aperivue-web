"use client";

import { createContext, useContext, useReducer, useMemo, type ReactNode } from "react";
import {
  type LiradsReportState,
  type LiradsReportAction,
  type LiradsObservation,
  type ScoredLiradsObservation,
} from "./types";
import {
  scoreLirads,
  describeLiradsFeatures,
  LIRADS_SEGMENTS,
  type LiradsInput,
} from "@/lib/rads/lirads";

// ── Helpers ───────────────────────────────────────────────────────────────

let _nextId = 1;

function emptyLrm() {
  return {
    peripheralWashout: false,
    delayedCentralEnhancement: false,
    targetoidRestriction: false,
    targetoidAppearance: false,
    infiltrative: false,
    markedDiffusionRestriction: false,
    necrosisOrSevereIschemia: false,
  };
}

function emptyAncillaryMalignancy() {
  return {
    restrictedDiffusion: false,
    mildModerateT2Hyperintensity: false,
    coronaEnhancement: false,
    fatSparingInSolidMass: false,
    ironSparingInSolidMass: false,
    bloodProducts: false,
    hbpHypointensity: false,
    subthresholdGrowth: false,
  };
}

function emptyAncillaryBenign() {
  return {
    sizeStabilityTwoYears: false,
    sizeReduction: false,
    parallelsBloodPool: false,
    hbpIsoOrHyperintensity: false,
    undistortedVessels: false,
  };
}

function createObservation(): LiradsObservation {
  const id = String(_nextId++);
  return {
    id,
    label: `Observation ${id}`,
    segment: "",
    sizeMm: "",
    diagnosticQuality: "adequate",
    aphe: "",
    washout: "",
    enhancingCapsule: false,
    thresholdGrowth: false,
    tumorInVein: false,
    benignity: "",
    lrm: emptyLrm(),
    ancillaryMalignancy: emptyAncillaryMalignancy(),
    ancillaryBenign: emptyAncillaryBenign(),
  };
}

export function parseMm(val: string): number | null {
  const n = parseFloat(val);
  return isNaN(n) || n <= 0 ? null : n;
}

// ── Initial state ─────────────────────────────────────────────────────────

const firstObservation = createObservation();

const initialState: LiradsReportState = {
  modality: "mri",
  contrastAgent: "eca",
  clinicalInfo: {
    applicableContext: "",
    indication: "",
    customIndication: "",
    comparison: "",
  },
  observations: [firstObservation],
  activeObservationId: firstObservation.id,
  otherFindings: "",
  impressionOverride: null,
};

// ── Reducer ───────────────────────────────────────────────────────────────

function reducer(state: LiradsReportState, action: LiradsReportAction): LiradsReportState {
  switch (action.type) {
    case "SET_MODALITY":
      return { ...state, modality: action.value };

    case "SET_CONTRAST_AGENT":
      return { ...state, contrastAgent: action.value };

    case "SET_CLINICAL_INFO":
      return { ...state, clinicalInfo: { ...state.clinicalInfo, ...action.payload } };

    case "ADD_OBSERVATION": {
      const o = createObservation();
      return { ...state, observations: [...state.observations, o], activeObservationId: o.id };
    }

    case "REMOVE_OBSERVATION": {
      const next = state.observations.filter((o) => o.id !== action.id);
      if (next.length === 0) {
        const fresh = createObservation();
        return { ...state, observations: [fresh], activeObservationId: fresh.id };
      }
      const activeId = state.activeObservationId === action.id ? next[0].id : state.activeObservationId;
      return { ...state, observations: next, activeObservationId: activeId };
    }

    case "SET_ACTIVE_OBSERVATION":
      return { ...state, activeObservationId: action.id };

    case "UPDATE_OBSERVATION":
      return {
        ...state,
        observations: state.observations.map((o) =>
          o.id === action.id ? { ...o, ...action.payload } : o,
        ),
      };

    case "SET_OTHER_FINDINGS":
      return { ...state, otherFindings: action.value };

    case "SET_IMPRESSION_OVERRIDE":
      return { ...state, impressionOverride: action.value };

    default:
      return state;
  }
}

// ── Build engine input from an observation + study-level settings ──────────

export function buildLiradsInput(
  observation: LiradsObservation,
  contrastAgent: LiradsReportState["contrastAgent"],
): LiradsInput {
  return {
    contrastAgent,
    diagnosticQuality: observation.diagnosticQuality,
    tumorInVein: observation.tumorInVein,
    benignity: observation.benignity,
    aphe: observation.aphe,
    sizeMm: parseMm(observation.sizeMm),
    washout: observation.washout,
    enhancingCapsule: observation.enhancingCapsule,
    thresholdGrowth: observation.thresholdGrowth,
    lrm: observation.lrm,
    ancillaryMalignancy: observation.ancillaryMalignancy,
    ancillaryBenign: observation.ancillaryBenign,
  };
}

function scoreObservation(
  observation: LiradsObservation,
  contrastAgent: LiradsReportState["contrastAgent"],
): ScoredLiradsObservation {
  const input = buildLiradsInput(observation, contrastAgent);
  const result = scoreLirads(input);
  return {
    observation,
    sizeMmNum: input.sizeMm,
    input,
    result,
    featureDescription: describeLiradsFeatures(input),
  };
}

// ── Context ───────────────────────────────────────────────────────────────

interface LiradsReportContextValue {
  state: LiradsReportState;
  dispatch: React.Dispatch<LiradsReportAction>;
  activeObservation: LiradsObservation;
  scoredObservations: ScoredLiradsObservation[];
  activeScored: ScoredLiradsObservation;
}

const LiradsReportContext = createContext<LiradsReportContextValue | null>(null);

export function LiradsReportProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const activeObservation =
    state.observations.find((o) => o.id === state.activeObservationId) ?? state.observations[0];

  const scoredObservations = useMemo(
    () => state.observations.map((o) => scoreObservation(o, state.contrastAgent)),
    [state.observations, state.contrastAgent],
  );

  const activeScored =
    scoredObservations.find((s) => s.observation.id === state.activeObservationId) ?? scoredObservations[0];

  const value = useMemo(
    () => ({ state, dispatch, activeObservation, scoredObservations, activeScored }),
    [state, activeObservation, scoredObservations, activeScored],
  );

  return <LiradsReportContext value={value}>{children}</LiradsReportContext>;
}

export function useLiradsReport() {
  const ctx = useContext(LiradsReportContext);
  if (!ctx) throw new Error("useLiradsReport must be used within LiradsReportProvider");
  return ctx;
}

export function liradsSegmentLabel(seg: string): string {
  return LIRADS_SEGMENTS.find((s) => s.value === seg)?.label ?? "";
}
