"use client";

import { useReport } from "../report/ReportContext";
import { INDICATIONS } from "../report/types";
import { LabeledInput, LabeledSelect } from "@/components/rads/LabeledField";
import CollapsibleSection from "./CollapsibleSection";

export default function ClinicalInfoSection() {
  const { state, dispatch } = useReport();
  const { indication, customIndication, comparison } = state.clinicalInfo;

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
            {INDICATIONS.map((i) => (
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
        <LabeledInput
          label="Comparison"
          type="text"
          placeholder="e.g. Prior thyroid US dated 2024-01-15"
          value={comparison}
          onChange={(e) => set({ comparison: e.target.value })}
        />
      </div>
    </CollapsibleSection>
  );
}
