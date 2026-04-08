"use client";

import { createContext, useContext, useReducer, useMemo, type ReactNode } from "react";
import {
  type LungReportState,
  type LungReportAction,
  type LungReportNodule,
  type ScoredLungNodule,
} from "./types";
import {
  scoreLungRads,
  describeLungRadsFeatures,
  LUNG_NODULE_LOCATIONS,
} from "@/lib/rads/lungrads";

// ── Helpers ───────────────────────────────────────────────────────────────

let _nextId = 1;

function createLungNodule(): LungReportNodule {
  const id = String(_nextId++);
  return {
    id,
    label: `Nodule ${id}`,
    location: "",
    noduleType: "",
    scanType: "baseline",
    sizeMm: "",
    priorSizeMm: "",
    solidComponentMm: "",
    sModifier: {
      spiculation: false,
      lymphadenopathy: false,
      directInvasion: false,
      pleuralEffusion: false,
      other: false,
    },
  };
}

export function parseMm(val: string): number | null {
  const n = parseFloat(val);
  return isNaN(n) || n <= 0 ? null : n;
}

// ── Initial state ─────────────────────────────────────────────────────────

const firstNodule = createLungNodule();

const initialState: LungReportState = {
  clinicalInfo: {
    indication: "",
    customIndication: "",
    comparison: "",
    packYears: "",
    smokingStatus: "",
  },
  specialCategory: "",
  nodules: [firstNodule],
  activeNoduleId: firstNodule.id,
  mediastinum: {
    lymphadenopathy: false,
    lymphNodes: "",
    other: "",
  },
  otherFindings: "",
  impressionOverride: null,
};

// ── Reducer ───────────────────────────────────────────────────────────────

function reducer(state: LungReportState, action: LungReportAction): LungReportState {
  switch (action.type) {
    case "SET_CLINICAL_INFO":
      return { ...state, clinicalInfo: { ...state.clinicalInfo, ...action.payload } };

    case "SET_SPECIAL_CATEGORY":
      return { ...state, specialCategory: action.value };

    case "ADD_NODULE": {
      const n = createLungNodule();
      return { ...state, nodules: [...state.nodules, n], activeNoduleId: n.id };
    }

    case "REMOVE_NODULE": {
      const next = state.nodules.filter((n) => n.id !== action.id);
      if (next.length === 0) {
        const fresh = createLungNodule();
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

    case "SET_MEDIASTINUM":
      return { ...state, mediastinum: { ...state.mediastinum, ...action.payload } };

    case "SET_OTHER_FINDINGS":
      return { ...state, otherFindings: action.value };

    case "SET_IMPRESSION_OVERRIDE":
      return { ...state, impressionOverride: action.value };

    default:
      return state;
  }
}

// ── Score a single nodule ─────────────────────────────────────────────────

function scoreNodule(nodule: LungReportNodule, specialCategory: string): ScoredLungNodule {
  const sizeMmNum = parseMm(nodule.sizeMm);
  const solidComponentMmNum = parseMm(nodule.solidComponentMm);

  // If special category is set (Cat 0 or 1), nodule scoring doesn't apply
  if (specialCategory) {
    return {
      nodule,
      sizeMmNum,
      solidComponentMmNum,
      result: null,
      featureDescription: "",
    };
  }

  const result = scoreLungRads(
    "",
    nodule.noduleType as "" | "solid" | "part_solid" | "ground_glass",
    sizeMmNum,
    nodule.scanType as "baseline" | "new" | "stable" | "growing",
    solidComponentMmNum,
    nodule.sModifier,
  );

  const featureDescription = describeLungRadsFeatures(
    nodule.noduleType as "" | "solid" | "part_solid" | "ground_glass",
    sizeMmNum,
    nodule.scanType as "baseline" | "new" | "stable" | "growing",
    solidComponentMmNum,
    nodule.sModifier,
  );

  return { nodule, sizeMmNum, solidComponentMmNum, result, featureDescription };
}

// ── Context ───────────────────────────────────────────────────────────────

interface LungReportContextValue {
  state: LungReportState;
  dispatch: React.Dispatch<LungReportAction>;
  activeNodule: LungReportNodule;
  scoredNodules: ScoredLungNodule[];
  activeScored: ScoredLungNodule;
}

const LungReportContext = createContext<LungReportContextValue | null>(null);

export function LungReportProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const activeNodule = state.nodules.find((n) => n.id === state.activeNoduleId) ?? state.nodules[0];

  const scoredNodules = useMemo(
    () => state.nodules.map((n) => scoreNodule(n, state.specialCategory)),
    [state.nodules, state.specialCategory],
  );

  const activeScored = scoredNodules.find((s) => s.nodule.id === state.activeNoduleId) ?? scoredNodules[0];

  const value = useMemo(
    () => ({ state, dispatch, activeNodule, scoredNodules, activeScored }),
    [state, activeNodule, scoredNodules, activeScored],
  );

  return <LungReportContext value={value}>{children}</LungReportContext>;
}

export function useLungReport() {
  const ctx = useContext(LungReportContext);
  if (!ctx) throw new Error("useLungReport must be used within LungReportProvider");
  return ctx;
}

export function lungLocationLabel(loc: string): string {
  return LUNG_NODULE_LOCATIONS.find((l) => l.value === loc)?.label ?? "";
}
