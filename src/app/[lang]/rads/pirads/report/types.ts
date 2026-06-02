import type { ProstateZone, ProstateSide, ProstateLevel, DceResult, PiradsInput, PiradsResult } from "@/lib/rads/pirads";

export const PIRADS_INDICATIONS = [
  { value: "elevated_psa", label: "Elevated PSA" },
  { value: "active_surveillance", label: "Active surveillance" },
  { value: "prior_negative_biopsy", label: "Prior negative biopsy, ongoing suspicion" },
  { value: "staging", label: "Staging of known prostate cancer" },
  { value: "other", label: "Other" },
] as const;

// ── Report state ───────────────────────────────────────────────────────────

export interface PiradsReportState {
  clinicalInfo: {
    indication: string;
    customIndication: string;
    comparison: string;
    psa: string;            // ng/mL
    prostateVolumeMl: string;
  };

  lesions: PiradsLesion[];
  activeLesionId: string;

  otherFindings: string;
  impressionOverride: string | null;
}

export interface PiradsLesion {
  id: string;
  label: string;
  side: ProstateSide;
  level: ProstateLevel;
  zone: ProstateZone;
  sizeMm: string;

  // Extraprostatic extension — used to break index-lesion ties at equal PI-RADS.
  epe: boolean;

  // Per-sequence scores (stored as strings for selects; "" = not scored)
  t2w: string; // "" | "1".."5"
  dwi: string; // "" | "1".."5"
  dce: DceResult;
}

export type ScoredPiradsLesion = {
  lesion: PiradsLesion;
  sizeMmNum: number | null;
  input: PiradsInput;
  result: PiradsResult | null;
  featureDescription: string;
};

// ── Reducer actions ────────────────────────────────────────────────────────

export type PiradsReportAction =
  | { type: "SET_CLINICAL_INFO"; payload: Partial<PiradsReportState["clinicalInfo"]> }
  | { type: "ADD_LESION" }
  | { type: "REMOVE_LESION"; id: string }
  | { type: "SET_ACTIVE_LESION"; id: string }
  | { type: "UPDATE_LESION"; id: string; payload: Partial<PiradsLesion> }
  | { type: "SET_OTHER_FINDINGS"; value: string }
  | { type: "SET_IMPRESSION_OVERRIDE"; value: string | null };
