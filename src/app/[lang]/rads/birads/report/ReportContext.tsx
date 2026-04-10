"use client";

import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from "react";
import type {
  BiRadsReportState,
  BiRadsAction,
  BiRadsLesion,
} from "./types";

// ── Helpers ───────────────────────────────────────────────────────────────

let _nextId = 1;

function createLesion(): BiRadsLesion {
  const id = String(_nextId++);
  return {
    id,
    label: `Finding ${id}`,
    laterality: "",
    clockPosition: "",
    depth: "",
    distanceFromNippleMm: "",
    sizeA: "",
    sizeB: "",
    sizeC: "",
    selectedCategory: "",
    // Mammography
    mammoFindingType: "",
    mammoMassShape: "",
    mammoMassMargin: "",
    mammoMassDensity: "",
    calcMorphology: "",
    calcDistribution: "",
    asymmetryType: "",
    mammoAssociated: {
      skinRetraction: false,
      nippleRetraction: false,
      skinThickening: false,
      trabecularThickening: false,
      axillaryAdenopathy: false,
      architecturalDistortion: false,
    },
    // Ultrasound
    usFindingType: "",
    usMassShape: "",
    usMassOrientation: "",
    usMassMargin: "",
    usEchoPattern: "",
    usPosteriorFeatures: "",
    usSpecialCase: "",
    usAssociated: {
      ductChanges: false,
      skinChanges: false,
      edema: false,
      vascularity: false,
      elasticity: false,
    },
    // MRI
    mriFindingType: "",
    mriMassShape: "",
    mriMassMargin: "",
    mriMassEnhancement: "",
    mriNmeDistribution: "",
    mriNmePattern: "",
    mriKineticInitial: "",
    mriKineticDelayed: "",
    mriT2Signal: "",
    mriNonEnhancingType: "",
    mriAssociated: {
      nippleRetraction: false,
      nippleInvasion: false,
      skinThickening: false,
      skinInvasion: false,
      edema: false,
      lymphadenopathy: false,
      pectoralisInvolvement: false,
      chestWallInvolvement: false,
    },
    notes: "",
  };
}

// ── Initial state ─────────────────────────────────────────────────────────

const firstLesion = createLesion();

const initialState: BiRadsReportState = {
  modality: "mammo",
  clinicalInfo: { indication: "", customIndication: "", comparison: "" },
  breastComposition: "",
  mriBpe: "",
  lesions: [firstLesion],
  activeLesionId: firstLesion.id,
  otherFindings: "",
  impressionOverride: null,
};

// ── Reducer ───────────────────────────────────────────────────────────────

function reducer(state: BiRadsReportState, action: BiRadsAction): BiRadsReportState {
  switch (action.type) {
    case "SET_MODALITY":
      return { ...state, modality: action.modality };

    case "SET_CLINICAL_INFO":
      return { ...state, clinicalInfo: { ...state.clinicalInfo, ...action.payload } };

    case "SET_BREAST_COMPOSITION":
      return { ...state, breastComposition: action.value };

    case "SET_MRI_BPE":
      return { ...state, mriBpe: action.value };

    case "ADD_LESION": {
      const n = createLesion();
      return { ...state, lesions: [...state.lesions, n], activeLesionId: n.id };
    }

    case "REMOVE_LESION": {
      const next = state.lesions.filter((l) => l.id !== action.id);
      if (next.length === 0) {
        const fresh = createLesion();
        return { ...state, lesions: [fresh], activeLesionId: fresh.id };
      }
      const activeId =
        state.activeLesionId === action.id ? next[0].id : state.activeLesionId;
      return { ...state, lesions: next, activeLesionId: activeId };
    }

    case "SET_ACTIVE_LESION":
      return { ...state, activeLesionId: action.id };

    case "UPDATE_LESION":
      return {
        ...state,
        lesions: state.lesions.map((l) =>
          l.id === action.id ? { ...l, ...action.payload } : l,
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

// ── Context ───────────────────────────────────────────────────────────────

interface ReportContextValue {
  state: BiRadsReportState;
  dispatch: React.Dispatch<BiRadsAction>;
  activeLesion: BiRadsLesion;
}

const ReportContext = createContext<ReportContextValue | null>(null);

export function BiRadsReportProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const activeLesion =
    state.lesions.find((l) => l.id === state.activeLesionId) ?? state.lesions[0];

  const value = useMemo(
    () => ({ state, dispatch, activeLesion }),
    [state, activeLesion],
  );

  return <ReportContext value={value}>{children}</ReportContext>;
}

export function useBiRadsReport() {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useBiRadsReport must be used within BiRadsReportProvider");
  return ctx;
}
