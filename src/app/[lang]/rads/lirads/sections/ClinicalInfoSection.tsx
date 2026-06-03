"use client";

import { useLiradsReport } from "../report/ReportContext";
import { LIRADS_INDICATIONS, LIRADS_APPLICABLE_CONTEXTS, type LiradsApplicableContext } from "../report/types";
import { LabeledInput, LabeledSelect } from "@/components/rads/LabeledField";
import CollapsibleSection from "./CollapsibleSection";

export default function ClinicalInfoSection() {
  const { state, dispatch } = useLiradsReport();
  const { applicableContext, indication, customIndication, comparison } = state.clinicalInfo;

  const set = (payload: Partial<typeof state.clinicalInfo>) =>
    dispatch({ type: "SET_CLINICAL_INFO", payload });

  const notApplicable = applicableContext === "not_applicable";

  return (
    <CollapsibleSection title="Clinical Information" defaultOpen={true}>
      <div className="space-y-3">
        <div>
          <LabeledSelect
            label="LI-RADS clinical context"
            value={applicableContext}
            onChange={(e) => set({ applicableContext: e.target.value as LiradsApplicableContext })}
          >
            {LIRADS_APPLICABLE_CONTEXTS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </LabeledSelect>
          {notApplicable && (
            <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
              LI-RADS applies only to patients at high risk for HCC (cirrhosis, chronic HBV, or
              current/prior HCC). For this context the categories below are <strong>provisional only</strong>
              {" "}and should not be reported as LI-RADS.
            </div>
          )}
        </div>

        <div>
          <LabeledSelect
            label="Indication"
            value={indication}
            onChange={(e) => set({ indication: e.target.value })}
          >
            <option value="">Select indication...</option>
            {LIRADS_INDICATIONS.map((i) => (
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
          placeholder="e.g. Prior CT/MRI dated 2025-04-01"
          value={comparison}
          onChange={(e) => set({ comparison: e.target.value })}
        />
      </div>
    </CollapsibleSection>
  );
}
