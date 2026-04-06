import type {
  LungNoduleLocation,
  NoduleType,
  ScanType,
  SpecialCategory,
  SModifierFeatures,
  LungRadsResult,
} from "@/lib/rads/lungrads";

// ── Report State ──────────────────────────────────────────────────────────

export interface LungReportState {
  clinicalInfo: {
    indication: string;        // preset key or "other"
    customIndication: string;
    comparison: string;
    packYears: string;
    smokingStatus: "" | "current" | "former" | "never";
  };

  specialCategory: SpecialCategory;

  nodules: LungReportNodule[];
  activeNoduleId: string;

  mediastinum: {
    lymphadenopathy: boolean;
    lymphNodes: string;
    other: string;
  };

  otherFindings: string;
  impressionOverride: string | null;
}

export interface LungReportNodule {
  id: string;
  label: string;
  location: LungNoduleLocation;
  noduleType: NoduleType;
  scanType: ScanType;
  sizeMm: string;          // total nodule size in mm
  priorSizeMm: string;     // prior size for comparison
  solidComponentMm: string; // for part-solid
  sModifier: SModifierFeatures;
}

// ── Scored result for a nodule ────────────────────────────────────────────

export type ScoredLungNodule = {
  nodule: LungReportNodule;
  sizeMmNum: number | null;
  solidComponentMmNum: number | null;
  result: LungRadsResult | null;
  featureDescription: string;
};

// ── Reducer Actions ───────────────────────────────────────────────────────

export type LungReportAction =
  | { type: "SET_CLINICAL_INFO"; payload: Partial<LungReportState["clinicalInfo"]> }
  | { type: "SET_SPECIAL_CATEGORY"; value: SpecialCategory }
  | { type: "ADD_NODULE" }
  | { type: "REMOVE_NODULE"; id: string }
  | { type: "SET_ACTIVE_NODULE"; id: string }
  | { type: "UPDATE_NODULE"; id: string; payload: Partial<LungReportNodule> }
  | { type: "SET_MEDIASTINUM"; payload: Partial<LungReportState["mediastinum"]> }
  | { type: "SET_OTHER_FINDINGS"; value: string }
  | { type: "SET_IMPRESSION_OVERRIDE"; value: string | null };

// ── Constants ─────────────────────────────────────────────────────────────

export const LUNG_INDICATIONS = [
  { value: "lung_cancer_screening", label: "Lung cancer screening (LDCT)" },
  { value: "follow_up_nodule", label: "Follow-up of known pulmonary nodule(s)" },
  { value: "incidental_nodule", label: "Incidentally detected pulmonary nodule" },
  { value: "history_lung_cancer", label: "History of lung cancer" },
  { value: "high_risk_exposure", label: "High-risk exposure (asbestos, radon, etc.)" },
  { value: "other", label: "Other" },
] as const;
