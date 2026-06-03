"use client";

import { useLungReport } from "../report/ReportContext";
import { LUNG_INDICATIONS } from "../report/types";
import { LabeledInput, LabeledSelect } from "@/components/rads/LabeledField";
import CollapsibleSection from "./CollapsibleSection";

export default function ClinicalInfoSection() {
  const { state, dispatch } = useLungReport();
  const { indication, customIndication, comparison, packYears, smokingStatus } = state.clinicalInfo;

  const set = (payload: Partial<typeof state.clinicalInfo>) =>
    dispatch({ type: "SET_CLINICAL_INFO", payload });

  return (
    <CollapsibleSection title="Clinical Information" defaultOpen={false}>
      <div className="space-y-3">
        <div>
          <LabeledSelect
            label="Indication"
            value={indication}
            onChange={(e) => set({ indication: e.target.value })}
          >
            <option value="">Select indication...</option>
            {LUNG_INDICATIONS.map((i) => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </LabeledSelect>
          {indication === "other" && (
            <input
              type="text"
              aria-label="Custom indication"
              placeholder="Specify indication..."
              value={customIndication}
              onChange={(e) => set({ customIndication: e.target.value })}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <LabeledSelect
            label="Smoking status"
            value={smokingStatus}
            onChange={(e) => set({ smokingStatus: e.target.value as typeof smokingStatus })}
          >
            <option value="">--</option>
            <option value="current">Current smoker</option>
            <option value="former">Former smoker</option>
            <option value="never">Never smoker</option>
          </LabeledSelect>
          <LabeledInput
            label="Pack-years"
            type="number"
            step="1"
            min="0"
            placeholder="e.g. 30"
            value={packYears}
            onChange={(e) => set({ packYears: e.target.value })}
          />
        </div>

        <LabeledInput
          label="Comparison"
          type="text"
          placeholder="e.g. Prior LDCT dated 2025-04-01"
          value={comparison}
          onChange={(e) => set({ comparison: e.target.value })}
        />
      </div>
    </CollapsibleSection>
  );
}
