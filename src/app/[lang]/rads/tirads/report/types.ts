import type {
  TiradsSystem,
  NoduleLocation,
  KtiradsComposition,
  KtiradsEchogenicity,
  KtiradsSuspiciousFeatures,
  EutiradsComposition,
  AcrResult,
  KtiradsResult,
  EutiradsResult,
} from "@/lib/rads/tirads";

// ── Report State ──────────────────────────────────────────────────────────

export interface ReportState {
  system: TiradsSystem;

  clinicalInfo: {
    indication: string;        // preset key or "other"
    customIndication: string;
    comparison: string;
  };

  glandAssessment: {
    rightLobe: Dimensions;
    leftLobe: Dimensions;
    isthmusAP: string;
    echotexture: "" | "normal" | "heterogeneous" | "diffusely_hypoechoic";
    vascularity: "" | "normal" | "increased" | "decreased";
    thyroiditis: "" | "none" | "hashimoto" | "subacute" | "graves" | "other";
    additionalFindings: string;
  };

  nodules: ReportNodule[];
  activeNoduleId: string;

  lymphNodes: {
    status: "normal" | "abnormal";
    nodes: AbnormalLN[];
    additionalDescription: string;
  };

  otherFindings: string;
  impressionOverride: string | null;
}

export interface Dimensions {
  l: string;
  w: string;
  h: string;
}

export interface ReportNodule {
  id: string;
  label: string;
  location: NoduleLocation;
  sizeL: string;
  sizeW: string;
  sizeH: string;
  // ACR
  acrSelections: number[];
  // K-TIRADS
  ktiradsComposition: KtiradsComposition | null;
  ktiradsEchogenicity: KtiradsEchogenicity | null;
  ktiradsSuspicious: KtiradsSuspiciousFeatures;
  ktiradsEntirelyCalcified: boolean;
  // EU-TIRADS
  eutiradsComposition: EutiradsComposition | null;
  eutiradsHasHighRisk: boolean;
}

export interface AbnormalLN {
  id: string;
  level: string;
  size: string;
  features: string[];
  description: string;
}

// ── Scored result for a nodule ────────────────────────────────────────────

export type ScoredNodule = {
  nodule: ReportNodule;
  maxDiameter: number | null;
  result: AcrResult | KtiradsResult | EutiradsResult | null;
  featureDescription: string;
};

// ── Reducer Actions ───────────────────────────────────────────────────────

export type ReportAction =
  | { type: "SET_SYSTEM"; system: TiradsSystem }
  | { type: "SET_CLINICAL_INFO"; payload: Partial<ReportState["clinicalInfo"]> }
  | { type: "SET_GLAND"; payload: Partial<ReportState["glandAssessment"]> }
  | { type: "ADD_NODULE" }
  | { type: "REMOVE_NODULE"; id: string }
  | { type: "SET_ACTIVE_NODULE"; id: string }
  | { type: "UPDATE_NODULE"; id: string; payload: Partial<ReportNodule> }
  | { type: "SET_LYMPH_STATUS"; status: "normal" | "abnormal" }
  | { type: "ADD_ABNORMAL_LN" }
  | { type: "REMOVE_ABNORMAL_LN"; id: string }
  | { type: "UPDATE_ABNORMAL_LN"; id: string; payload: Partial<AbnormalLN> }
  | { type: "SET_LYMPH_DESCRIPTION"; value: string }
  | { type: "SET_OTHER_FINDINGS"; value: string }
  | { type: "SET_IMPRESSION_OVERRIDE"; value: string | null };

// ── Constants ─────────────────────────────────────────────────────────────

export const INDICATIONS = [
  { value: "palpable_nodule", label: "Palpable thyroid nodule" },
  { value: "abnormal_tsh", label: "Abnormal thyroid function (TSH)" },
  { value: "follow_up", label: "Follow-up of known thyroid nodule(s)" },
  { value: "incidentaloma", label: "Thyroid incidentaloma" },
  { value: "screening", label: "Screening" },
  { value: "post_thyroidectomy", label: "Post-thyroidectomy surveillance" },
  { value: "history_cancer", label: "History of thyroid cancer" },
  { value: "neck_enlargement", label: "Neck enlargement / goiter" },
  { value: "radiation_history", label: "Radiation exposure history" },
  { value: "other", label: "Other" },
] as const;

export const LN_LEVELS = ["I", "II", "III", "IV", "V", "VI"] as const;

export const LN_FEATURES = [
  { value: "loss_of_hilum", label: "Loss of echogenic hilum" },
  { value: "round_shape", label: "Round shape" },
  { value: "cystic_change", label: "Cystic change" },
  { value: "calcification", label: "Calcification" },
  { value: "hyperechogenicity", label: "Cortical hyperechogenicity" },
  { value: "abnormal_vascularity", label: "Abnormal vascularity" },
] as const;
