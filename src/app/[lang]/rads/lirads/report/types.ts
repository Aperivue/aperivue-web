import type {
  LiradsContrastAgent,
  DiagnosticQuality,
  LiradsSegment,
  Aphe,
  WashoutPhase,
  LiradsBenignity,
  LrmFeatures,
  AncillaryMalignancyFeatures,
  AncillaryBenignFeatures,
  LiradsInput,
  LiradsResult,
} from "@/lib/rads/lirads";

// ── Modality / applicable context ──────────────────────────────────────────

export type LiradsModality = "ct" | "mri";

export type LiradsApplicableContext =
  | ""
  | "cirrhosis"
  | "chronic_hbv"
  | "current_prior_hcc"
  | "other_high_risk"
  | "not_applicable";

export const LIRADS_APPLICABLE_CONTEXTS: { value: LiradsApplicableContext; label: string }[] = [
  { value: "", label: "Select high-risk context..." },
  { value: "cirrhosis", label: "Cirrhosis (LI-RADS applicable)" },
  { value: "chronic_hbv", label: "Chronic hepatitis B without cirrhosis (applicable)" },
  { value: "current_prior_hcc", label: "Current or prior HCC (applicable)" },
  { value: "other_high_risk", label: "Other LI-RADS high-risk context (applicable)" },
  { value: "not_applicable", label: "Not an LI-RADS high-risk patient (NOT applicable)" },
];

export const LIRADS_INDICATIONS = [
  { value: "hcc_surveillance", label: "HCC surveillance" },
  { value: "observation_workup", label: "Work-up of a known liver observation" },
  { value: "hcc_staging", label: "Staging of known HCC" },
  { value: "pre_transplant", label: "Pre-transplant evaluation" },
  { value: "other", label: "Other" },
] as const;

// ── Report state ───────────────────────────────────────────────────────────

export interface LiradsReportState {
  modality: LiradsModality;
  contrastAgent: LiradsContrastAgent;

  clinicalInfo: {
    applicableContext: LiradsApplicableContext;
    indication: string;
    customIndication: string;
    comparison: string;
  };

  observations: LiradsObservation[];
  activeObservationId: string;

  otherFindings: string;
  impressionOverride: string | null;
}

export interface LiradsObservation {
  id: string;
  label: string;
  segment: LiradsSegment;
  sizeMm: string;

  // Per-observation diagnostic adequacy (LR-NC gate). Observation-level so a
  // mixed report can carry e.g. Observation 1 = LR-5 and Observation 2 = LR-NC.
  diagnosticQuality: DiagnosticQuality;

  // Major features
  aphe: Aphe;
  washout: WashoutPhase;
  enhancingCapsule: boolean;
  thresholdGrowth: boolean;

  // Override categories
  tumorInVein: boolean;
  benignity: LiradsBenignity;

  // LR-M and ancillary
  lrm: LrmFeatures;
  ancillaryMalignancy: AncillaryMalignancyFeatures;
  ancillaryBenign: AncillaryBenignFeatures;
}

// ── Scored result for an observation ───────────────────────────────────────

export type ScoredLiradsObservation = {
  observation: LiradsObservation;
  sizeMmNum: number | null;
  input: LiradsInput;
  result: LiradsResult | null;
  featureDescription: string;
};

// ── Reducer actions ────────────────────────────────────────────────────────

export type LiradsReportAction =
  | { type: "SET_MODALITY"; value: LiradsModality }
  | { type: "SET_CONTRAST_AGENT"; value: LiradsContrastAgent }
  | { type: "SET_CLINICAL_INFO"; payload: Partial<LiradsReportState["clinicalInfo"]> }
  | { type: "ADD_OBSERVATION" }
  | { type: "REMOVE_OBSERVATION"; id: string }
  | { type: "SET_ACTIVE_OBSERVATION"; id: string }
  | { type: "UPDATE_OBSERVATION"; id: string; payload: Partial<LiradsObservation> }
  | { type: "SET_OTHER_FINDINGS"; value: string }
  | { type: "SET_IMPRESSION_OVERRIDE"; value: string | null };
