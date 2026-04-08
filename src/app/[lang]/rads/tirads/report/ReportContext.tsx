"use client";

import { createContext, useContext, useReducer, useMemo, type ReactNode } from "react";
import {
  type ReportState,
  type ReportAction,
  type ReportNodule,
  type ScoredNodule,
} from "./types";
import {
  ACR_FEATURES,
  scoreAcrTirads,
  scoreKtirads,
  scoreEutirads,
  describeAcrFeatures,
  describeKtiradsFeatures,
  describeEutiradsFeatures,
  NODULE_LOCATIONS,
} from "@/lib/rads/tirads";

// ── Helpers ───────────────────────────────────────────────────────────────

let _nextId = 1;

function createNodule(): ReportNodule {
  const id = String(_nextId++);
  return {
    id,
    label: `Nodule ${id}`,
    location: "",
    sizeL: "", sizeW: "", sizeH: "",
    acrSelections: ACR_FEATURES.map(() => 0),
    ktiradsComposition: null,
    ktiradsEchogenicity: null,
    ktiradsSuspicious: { punctateEchogenicFoci: false, nonparallelOrientation: false, irregularMargin: false },
    ktiradsEntirelyCalcified: false,
    eutiradsComposition: null,
    eutiradsHasHighRisk: false,
  };
}

function createAbnormalLN() {
  return { id: String(Date.now()), level: "", size: "", features: [] as string[], description: "" };
}

export function maxDiameter(n: ReportNodule): number | null {
  const vals = [n.sizeL, n.sizeW, n.sizeH]
    .map((v) => parseFloat(v))
    .filter((v) => !isNaN(v) && v > 0);
  return vals.length > 0 ? Math.max(...vals) : null;
}

// ── Initial state ─────────────────────────────────────────────────────────

const firstNodule = createNodule();

const initialState: ReportState = {
  system: "acr",
  clinicalInfo: { indication: "", customIndication: "", comparison: "" },
  glandAssessment: {
    rightLobe: { l: "", w: "", h: "" },
    leftLobe: { l: "", w: "", h: "" },
    isthmusAP: "",
    echotexture: "",
    vascularity: "",
    thyroiditis: "",
    additionalFindings: "",
  },
  nodules: [firstNodule],
  activeNoduleId: firstNodule.id,
  lymphNodes: { status: "normal", nodes: [], additionalDescription: "" },
  otherFindings: "",
  impressionOverride: null,
};

// ── Reducer ───────────────────────────────────────────────────────────────

function reducer(state: ReportState, action: ReportAction): ReportState {
  switch (action.type) {
    case "SET_SYSTEM":
      return { ...state, system: action.system };

    case "SET_CLINICAL_INFO":
      return { ...state, clinicalInfo: { ...state.clinicalInfo, ...action.payload } };

    case "SET_GLAND":
      return { ...state, glandAssessment: { ...state.glandAssessment, ...action.payload } };

    case "ADD_NODULE": {
      const n = createNodule();
      return { ...state, nodules: [...state.nodules, n], activeNoduleId: n.id };
    }

    case "REMOVE_NODULE": {
      const next = state.nodules.filter((n) => n.id !== action.id);
      if (next.length === 0) {
        const fresh = createNodule();
        return { ...state, nodules: [fresh], activeNoduleId: fresh.id };
      }
      const activeId = state.activeNoduleId === action.id ? next[0].id : state.activeNoduleId;
      return { ...state, nodules: next, activeNoduleId: activeId };
    }

    case "SET_ACTIVE_NODULE":
      return { ...state, activeNoduleId: action.id };

    case "UPDATE_NODULE":
      return {
        ...state,
        nodules: state.nodules.map((n) =>
          n.id === action.id ? { ...n, ...action.payload } : n,
        ),
      };

    case "SET_LYMPH_STATUS":
      return { ...state, lymphNodes: { ...state.lymphNodes, status: action.status } };

    case "ADD_ABNORMAL_LN":
      return {
        ...state,
        lymphNodes: {
          ...state.lymphNodes,
          nodes: [...state.lymphNodes.nodes, createAbnormalLN()],
        },
      };

    case "REMOVE_ABNORMAL_LN":
      return {
        ...state,
        lymphNodes: {
          ...state.lymphNodes,
          nodes: state.lymphNodes.nodes.filter((n) => n.id !== action.id),
        },
      };

    case "UPDATE_ABNORMAL_LN":
      return {
        ...state,
        lymphNodes: {
          ...state.lymphNodes,
          nodes: state.lymphNodes.nodes.map((n) =>
            n.id === action.id ? { ...n, ...action.payload } : n,
          ),
        },
      };

    case "SET_LYMPH_DESCRIPTION":
      return { ...state, lymphNodes: { ...state.lymphNodes, additionalDescription: action.value } };

    case "SET_OTHER_FINDINGS":
      return { ...state, otherFindings: action.value };

    case "SET_IMPRESSION_OVERRIDE":
      return { ...state, impressionOverride: action.value };

    default:
      return state;
  }
}

// ── Score a single nodule ─────────────────────────────────────────────────

function scoreNodule(nodule: ReportNodule, system: string): ScoredNodule {
  const md = maxDiameter(nodule);
  let result = null;
  let featureDescription = "";

  if (system === "acr") {
    result = scoreAcrTirads(nodule.acrSelections, md);
    featureDescription = describeAcrFeatures(nodule.acrSelections);
  } else if (system === "ktirads") {
    result = scoreKtirads(
      nodule.ktiradsComposition,
      nodule.ktiradsEchogenicity,
      nodule.ktiradsSuspicious,
      nodule.ktiradsEntirelyCalcified,
      md,
    );
    featureDescription = describeKtiradsFeatures(
      nodule.ktiradsComposition,
      nodule.ktiradsEchogenicity,
      nodule.ktiradsSuspicious,
      nodule.ktiradsEntirelyCalcified,
    );
  } else if (system === "eutirads") {
    result = scoreEutirads(nodule.eutiradsComposition, nodule.eutiradsHasHighRisk, md);
    featureDescription = describeEutiradsFeatures(
      nodule.eutiradsComposition,
      nodule.eutiradsHasHighRisk,
    );
  }

  return { nodule, maxDiameter: md, result, featureDescription };
}

// ── Context ───────────────────────────────────────────────────────────────

interface ReportContextValue {
  state: ReportState;
  dispatch: React.Dispatch<ReportAction>;
  activeNodule: ReportNodule;
  scoredNodules: ScoredNodule[];
  activeScored: ScoredNodule;
}

const ReportContext = createContext<ReportContextValue | null>(null);

export function ReportProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const activeNodule = state.nodules.find((n) => n.id === state.activeNoduleId) ?? state.nodules[0];

  const scoredNodules = useMemo(
    () => state.nodules.map((n) => scoreNodule(n, state.system)),
    [state.nodules, state.system],
  );

  const activeScored = scoredNodules.find((s) => s.nodule.id === state.activeNoduleId) ?? scoredNodules[0];

  const value = useMemo(
    () => ({ state, dispatch, activeNodule, scoredNodules, activeScored }),
    [state, activeNodule, scoredNodules, activeScored],
  );

  return <ReportContext value={value}>{children}</ReportContext>;
}

export function useReport() {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReport must be used within ReportProvider");
  return ctx;
}

export function locationLabel(loc: string): string {
  return NODULE_LOCATIONS.find((l) => l.value === loc)?.label ?? "";
}
