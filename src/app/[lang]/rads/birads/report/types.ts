import type {
  BiRadsModality,
  BiRadsCategory,
  Laterality,
  ClockPosition,
  Depth,
  // Mammography
  BreastComposition,
  MammoFindingType,
  MammoMassShape,
  MammoMassMargin,
  MammoMassDensity,
  CalcMorphology,
  CalcDistribution,
  AsymmetryType,
  MammoAssociatedFeatures,
  // Ultrasound
  UsFindingType,
  UsMassShape,
  UsMassOrientation,
  UsMassMargin,
  UsEchoPattern,
  UsPosteriorFeatures,
  UsSpecialCase,
  UsAssociatedFeatures,
  // MRI
  MriFindingType,
  MriMassShape,
  MriMassMargin,
  MriMassEnhancement,
  MriNmeDistribution,
  MriNmePattern,
  MriKineticInitial,
  MriKineticDelayed,
  MriT2Signal,
  MriBpe,
  MriAssociatedFeatures,
  MriNonEnhancingType,
} from "@/lib/rads/birads";

// ── Report State ──────────────────────────────────────────────────────────

export interface BiRadsReportState {
  modality: BiRadsModality;

  clinicalInfo: {
    indication: string;         // preset key or "other"
    customIndication: string;
    comparison: string;
  };

  // Mammography-only: breast composition
  breastComposition: BreastComposition;

  // MRI-only: background parenchymal enhancement
  mriBpe: MriBpe;

  lesions: BiRadsLesion[];
  activeLesionId: string;

  otherFindings: string;
  impressionOverride: string | null;
}

// ── A single lesion ───────────────────────────────────────────────────────

export interface BiRadsLesion {
  id: string;
  label: string;  // "Finding 1"

  // Location
  laterality: Laterality;
  clockPosition: ClockPosition;
  depth: Depth;
  distanceFromNippleMm: string;

  // Size (cm for mammo mass / mm for US, stored as string)
  sizeA: string;  // largest dimension
  sizeB: string;
  sizeC: string;

  // Radiologist-selected category
  selectedCategory: BiRadsCategory | "";

  // Mammography descriptors
  mammoFindingType: MammoFindingType;
  // Mass
  mammoMassShape: MammoMassShape;
  mammoMassMargin: MammoMassMargin;
  mammoMassDensity: MammoMassDensity;
  // Calcifications
  calcMorphology: CalcMorphology;
  calcDistribution: CalcDistribution;
  // Asymmetry
  asymmetryType: AsymmetryType;
  // Associated features
  mammoAssociated: MammoAssociatedFeatures;

  // Ultrasound descriptors
  usFindingType: UsFindingType;
  // Mass
  usMassShape: UsMassShape;
  usMassOrientation: UsMassOrientation;
  usMassMargin: UsMassMargin;
  usEchoPattern: UsEchoPattern;
  usPosteriorFeatures: UsPosteriorFeatures;
  // Special case
  usSpecialCase: UsSpecialCase;
  // Associated features
  usAssociated: UsAssociatedFeatures;

  // MRI descriptors
  mriFindingType: MriFindingType;
  // Mass
  mriMassShape: MriMassShape;
  mriMassMargin: MriMassMargin;
  mriMassEnhancement: MriMassEnhancement;
  // NME
  mriNmeDistribution: MriNmeDistribution;
  mriNmePattern: MriNmePattern;
  // Kinetic (shared by mass and NME)
  mriKineticInitial: MriKineticInitial;
  mriKineticDelayed: MriKineticDelayed;
  // T2 signal
  mriT2Signal: MriT2Signal;
  // Non-enhancing finding
  mriNonEnhancingType: MriNonEnhancingType;
  // Associated features
  mriAssociated: MriAssociatedFeatures;

  // Free-text notes per lesion
  notes: string;
}

// ── Reducer Actions ───────────────────────────────────────────────────────

export type BiRadsAction =
  | { type: "SET_MODALITY"; modality: BiRadsModality }
  | { type: "SET_CLINICAL_INFO"; payload: Partial<BiRadsReportState["clinicalInfo"]> }
  | { type: "SET_BREAST_COMPOSITION"; value: BreastComposition }
  | { type: "SET_MRI_BPE"; value: MriBpe }
  | { type: "ADD_LESION" }
  | { type: "REMOVE_LESION"; id: string }
  | { type: "SET_ACTIVE_LESION"; id: string }
  | { type: "UPDATE_LESION"; id: string; payload: Partial<BiRadsLesion> }
  | { type: "SET_OTHER_FINDINGS"; value: string }
  | { type: "SET_IMPRESSION_OVERRIDE"; value: string | null };

// ── Constants ─────────────────────────────────────────────────────────────

export const BIRADS_INDICATIONS = [
  { value: "screening", label: "Routine screening" },
  { value: "palpable_mass", label: "Palpable mass" },
  { value: "nipple_discharge", label: "Nipple discharge" },
  { value: "skin_change", label: "Skin change" },
  { value: "follow_up_birads3", label: "Follow-up of BI-RADS 3 lesion" },
  { value: "post_treatment", label: "Post-treatment surveillance" },
  { value: "high_risk_screening", label: "High-risk screening" },
  { value: "other", label: "Other" },
] as const;
