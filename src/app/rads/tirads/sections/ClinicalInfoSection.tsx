"use client";

import { useReport } from "../report/ReportContext";
import { INDICATIONS } from "../report/types";
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
          <label className="mb-1 block text-xs font-medium text-foreground/60">Indication</label>
          <select
            value={indication}
            onChange={(e) => set({ indication: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="">Select indication...</option>
            {INDICATIONS.map((i) => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
          {indication === "other" && (
            <input
              type="text"
              placeholder="Specify indication..."
              value={customIndication}
              onChange={(e) => set({ customIndication: e.target.value })}
              className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            />
          )}
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/60">Comparison</label>
          <input
            type="text"
            placeholder="e.g. Prior thyroid US dated 2024-01-15"
            value={comparison}
            onChange={(e) => set({ comparison: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}
