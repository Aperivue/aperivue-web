import type {
  OradsSystem,
  OradsResult,
  Menopausal,
  UsLesionType,
  PhysiologicType,
  InnerWall,
  UsCystContent,
  SolidComponent,
  OuterContour,
  ClassicBenignType,
  MriLesionType,
  MriLocularity,
  MriFluid,
  MriTic,
  MriNonDce,
} from "@/lib/rads/orads";

export type { OradsSystem };

export const ORADS_INDICATIONS = [
  { value: "incidental", label: "Incidental adnexal lesion" },
  { value: "pelvic_pain", label: "Pelvic pain" },
  { value: "pelvic_mass", label: "Palpable / known pelvic mass" },
  { value: "characterization", label: "Characterization of indeterminate adnexal lesion" },
  { value: "surveillance", label: "Surveillance of known adnexal lesion" },
  { value: "other", label: "Other" },
] as const;

export const ORADS_LATERALITY = [
  { value: "", label: "Not specified" },
  { value: "right", label: "Right adnexa" },
  { value: "left", label: "Left adnexa" },
  { value: "midline", label: "Midline / cul-de-sac" },
] as const;

// ── Report state ───────────────────────────────────────────────────────────

export interface OradsReportState {
  system: OradsSystem;
  clinicalInfo: {
    indication: string;
    customIndication: string;
    comparison: string;
    menopausal: Menopausal; // drives US management guidance
  };
  lesions: OradsLesion[];
  activeLesionId: string;
  otherFindings: string;
  impressionOverride: string | null;
}

// Per-lesion US descriptors (strings for selects; "" = not selected).
export interface UsLesionFields {
  lesionType: UsLesionType;
  physiologicType: PhysiologicType;
  innerWall: InnerWall;
  cystContent: UsCystContent;
  solidComponent: SolidComponent;
  papillaryProjections: string; // count
  outerContour: OuterContour;
  shadowing: boolean;
  colorScore: string; // "" | "1".."4"
  classicBenignType: ClassicBenignType;
  ascitesNodules: boolean;
}

// Per-lesion MRI descriptors.
export interface MriLesionFields {
  lesionType: MriLesionType;
  locularity: MriLocularity;
  fluid: MriFluid;
  wallEnhancement: boolean;
  fatEnhancingSolid: boolean;
  darkT2Dwi: boolean;
  tic: MriTic;
  nonDce: MriNonDce;
  peritonealImplants: boolean;
}

export interface OradsLesion {
  id: string;
  label: string;
  laterality: string;
  sizeCm: string; // single largest diameter, cm
  us: UsLesionFields;
  mri: MriLesionFields;
}

export type ScoredOradsLesion = {
  lesion: OradsLesion;
  sizeCmNum: number | null;
  result: OradsResult | null;
  featureDescription: string;
};

// ── Reducer actions ────────────────────────────────────────────────────────

export type OradsReportAction =
  | { type: "SET_SYSTEM"; system: OradsSystem }
  | { type: "SET_CLINICAL_INFO"; payload: Partial<OradsReportState["clinicalInfo"]> }
  | { type: "ADD_LESION" }
  | { type: "REMOVE_LESION"; id: string }
  | { type: "SET_ACTIVE_LESION"; id: string }
  | { type: "UPDATE_LESION"; id: string; payload: Partial<Omit<OradsLesion, "us" | "mri">> }
  | { type: "UPDATE_US"; id: string; payload: Partial<UsLesionFields> }
  | { type: "UPDATE_MRI"; id: string; payload: Partial<MriLesionFields> }
  | { type: "SET_OTHER_FINDINGS"; value: string }
  | { type: "SET_IMPRESSION_OVERRIDE"; value: string | null };
