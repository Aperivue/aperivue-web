"use client";

import { createContext, useContext, useReducer, useMemo, type ReactNode } from "react";
import {
  type OradsReportState,
  type OradsReportAction,
  type OradsLesion,
  type ScoredOradsLesion,
} from "./types";
import {
  scoreOradsUs,
  scoreOradsMri,
  describeOradsUsFeatures,
  describeOradsMriFeatures,
  type OradsUsInput,
  type OradsMriInput,
  type ColorScore,
  type Menopausal,
} from "@/lib/rads/orads";

let _nextId = 1;

function createLesion(): OradsLesion {
  const id = String(_nextId++);
  return {
    id,
    label: `Lesion ${id}`,
    laterality: "",
    sizeCm: "",
    us: {
      lesionType: "",
      physiologicType: "",
      innerWall: "",
      cystContent: "",
      solidComponent: "",
      papillaryProjections: "",
      outerContour: "",
      shadowing: false,
      colorScore: "",
      classicBenignType: "",
      ascitesNodules: false,
    },
    mri: {
      lesionType: "",
      locularity: "",
      fluid: "",
      wallEnhancement: false,
      fatEnhancingSolid: false,
      darkT2Dwi: false,
      tic: "",
      nonDce: "",
      peritonealImplants: false,
    },
  };
}

export function parseCm(val: string): number | null {
  const n = parseFloat(val);
  return isNaN(n) || n <= 0 ? null : n;
}

function parseCount(val: string): number | null {
  if (val.trim() === "") return null;
  const n = parseInt(val, 10);
  return isNaN(n) || n < 0 ? null : n;
}

function parseColorScore(val: string): ColorScore {
  const n = parseInt(val, 10);
  return n === 1 || n === 2 || n === 3 || n === 4 ? (n as ColorScore) : null;
}

const firstLesion = createLesion();

const initialState: OradsReportState = {
  system: "us",
  clinicalInfo: { indication: "", customIndication: "", comparison: "", menopausal: "" },
  lesions: [firstLesion],
  activeLesionId: firstLesion.id,
  otherFindings: "",
  impressionOverride: null,
};

function reducer(state: OradsReportState, action: OradsReportAction): OradsReportState {
  switch (action.type) {
    case "SET_SYSTEM":
      return { ...state, system: action.system };
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
    case "UPDATE_US":
      return {
        ...state,
        lesions: state.lesions.map((l) =>
          l.id === action.id ? { ...l, us: { ...l.us, ...action.payload } } : l,
        ),
      };
    case "UPDATE_MRI":
      return {
        ...state,
        lesions: state.lesions.map((l) =>
          l.id === action.id ? { ...l, mri: { ...l.mri, ...action.payload } } : l,
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

export function buildUsInput(lesion: OradsLesion, menopausal: Menopausal): OradsUsInput {
  return {
    lesionType: lesion.us.lesionType,
    menopausal,
    sizeCm: parseCm(lesion.sizeCm),
    physiologicType: lesion.us.physiologicType,
    innerWall: lesion.us.innerWall,
    cystContent: lesion.us.cystContent,
    solidComponent: lesion.us.solidComponent,
    papillaryProjections: parseCount(lesion.us.papillaryProjections),
    outerContour: lesion.us.outerContour,
    shadowing: lesion.us.shadowing,
    colorScore: parseColorScore(lesion.us.colorScore),
    classicBenignType: lesion.us.classicBenignType,
    ascitesNodules: lesion.us.ascitesNodules,
  };
}

export function buildMriInput(lesion: OradsLesion, menopausal: Menopausal): OradsMriInput {
  return {
    lesionType: lesion.mri.lesionType,
    menopausal,
    locularity: lesion.mri.locularity,
    fluid: lesion.mri.fluid,
    wallEnhancement: lesion.mri.wallEnhancement,
    fatEnhancingSolid: lesion.mri.fatEnhancingSolid,
    darkT2Dwi: lesion.mri.darkT2Dwi,
    tic: lesion.mri.tic,
    nonDce: lesion.mri.nonDce,
    peritonealImplants: lesion.mri.peritonealImplants,
  };
}

function scoreLesion(lesion: OradsLesion, state: OradsReportState): ScoredOradsLesion {
  if (state.system === "us") {
    const input = buildUsInput(lesion, state.clinicalInfo.menopausal);
    return {
      lesion,
      sizeCmNum: parseCm(lesion.sizeCm),
      result: scoreOradsUs(input),
      featureDescription: describeOradsUsFeatures(input),
    };
  }
  const input = buildMriInput(lesion, state.clinicalInfo.menopausal);
  return {
    lesion,
    sizeCmNum: parseCm(lesion.sizeCm),
    result: scoreOradsMri(input),
    featureDescription: describeOradsMriFeatures(input),
  };
}

interface OradsReportContextValue {
  state: OradsReportState;
  dispatch: React.Dispatch<OradsReportAction>;
  activeLesion: OradsLesion;
  scoredLesions: ScoredOradsLesion[];
  activeScored: ScoredOradsLesion;
}

const OradsReportContext = createContext<OradsReportContextValue | null>(null);

export function OradsReportProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const activeLesion = state.lesions.find((l) => l.id === state.activeLesionId) ?? state.lesions[0];

  const scoredLesions = useMemo(
    () => state.lesions.map((l) => scoreLesion(l, state)),
    [state],
  );

  const activeScored =
    scoredLesions.find((s) => s.lesion.id === state.activeLesionId) ?? scoredLesions[0];

  const value = useMemo(
    () => ({ state, dispatch, activeLesion, scoredLesions, activeScored }),
    [state, activeLesion, scoredLesions, activeScored],
  );

  return <OradsReportContext value={value}>{children}</OradsReportContext>;
}

export function useOradsReport() {
  const ctx = useContext(OradsReportContext);
  if (!ctx) throw new Error("useOradsReport must be used within OradsReportProvider");
  return ctx;
}
