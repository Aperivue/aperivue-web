"use client";

import { createContext, useContext, useReducer, useMemo, type ReactNode } from "react";
import {
  type PiradsReportState,
  type PiradsReportAction,
  type PiradsLesion,
  type ScoredPiradsLesion,
} from "./types";
import { scorePirads, describePiradsFeatures, type PiradsInput } from "@/lib/rads/pirads";

let _nextId = 1;

function createLesion(): PiradsLesion {
  const id = String(_nextId++);
  return {
    id,
    label: `Lesion ${id}`,
    side: "",
    level: "",
    zone: "",
    sizeMm: "",
    epe: false,
    t2w: "",
    dwi: "",
    dce: "",
  };
}

export function parseScore(val: string): number | null {
  const n = parseInt(val, 10);
  return isNaN(n) || n < 1 || n > 5 ? null : n;
}

export function parseMm(val: string): number | null {
  const n = parseFloat(val);
  return isNaN(n) || n <= 0 ? null : n;
}

const firstLesion = createLesion();

const initialState: PiradsReportState = {
  clinicalInfo: { indication: "", customIndication: "", comparison: "", psa: "", prostateVolumeMl: "" },
  lesions: [firstLesion],
  activeLesionId: firstLesion.id,
  otherFindings: "",
  impressionOverride: null,
};

function reducer(state: PiradsReportState, action: PiradsReportAction): PiradsReportState {
  switch (action.type) {
    case "SET_CLINICAL_INFO":
      return { ...state, clinicalInfo: { ...state.clinicalInfo, ...action.payload } };
    case "ADD_LESION": {
      const l = createLesion();
      return { ...state, lesions: [...state.lesions, l], activeLesionId: l.id };
    }
    case "REMOVE_LESION": {
      const next = state.lesions.filter((l) => l.id !== action.id);
      if (next.length === 0) {
        const fresh = createLesion();
        return { ...state, lesions: [fresh], activeLesionId: fresh.id };
      }
      const activeId = state.activeLesionId === action.id ? next[0].id : state.activeLesionId;
      return { ...state, lesions: next, activeLesionId: activeId };
    }
    case "SET_ACTIVE_LESION":
      return { ...state, activeLesionId: action.id };
    case "UPDATE_LESION":
      return {
        ...state,
        lesions: state.lesions.map((l) => (l.id === action.id ? { ...l, ...action.payload } : l)),
      };
    case "SET_OTHER_FINDINGS":
      return { ...state, otherFindings: action.value };
    case "SET_IMPRESSION_OVERRIDE":
      return { ...state, impressionOverride: action.value };
    default:
      return state;
  }
}

export function buildPiradsInput(lesion: PiradsLesion): PiradsInput {
  return {
    zone: lesion.zone,
    t2w: parseScore(lesion.t2w),
    dwi: parseScore(lesion.dwi),
    dce: lesion.dce,
  };
}

function scoreLesion(lesion: PiradsLesion): ScoredPiradsLesion {
  const input = buildPiradsInput(lesion);
  return {
    lesion,
    sizeMmNum: parseMm(lesion.sizeMm),
    input,
    result: scorePirads(input),
    featureDescription: describePiradsFeatures(input),
  };
}

interface PiradsReportContextValue {
  state: PiradsReportState;
  dispatch: React.Dispatch<PiradsReportAction>;
  activeLesion: PiradsLesion;
  scoredLesions: ScoredPiradsLesion[];
  activeScored: ScoredPiradsLesion;
}

const PiradsReportContext = createContext<PiradsReportContextValue | null>(null);

export function PiradsReportProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const activeLesion = state.lesions.find((l) => l.id === state.activeLesionId) ?? state.lesions[0];

  const scoredLesions = useMemo(() => state.lesions.map((l) => scoreLesion(l)), [state.lesions]);

  const activeScored =
    scoredLesions.find((s) => s.lesion.id === state.activeLesionId) ?? scoredLesions[0];

  const value = useMemo(
    () => ({ state, dispatch, activeLesion, scoredLesions, activeScored }),
    [state, activeLesion, scoredLesions, activeScored],
  );

  return <PiradsReportContext value={value}>{children}</PiradsReportContext>;
}

export function usePiradsReport() {
  const ctx = useContext(PiradsReportContext);
  if (!ctx) throw new Error("usePiradsReport must be used within PiradsReportProvider");
  return ctx;
}
