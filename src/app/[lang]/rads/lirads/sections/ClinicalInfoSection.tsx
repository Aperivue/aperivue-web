"use client";

import { useLiradsReport } from "../report/ReportContext";
import { LIRADS_INDICATIONS, LIRADS_APPLICABLE_CONTEXTS, type LiradsApplicableContext } from "../report/types";
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
          <label className="mb-1 block text-xs font-medium text-foreground/60">
            LI-RADS clinical context
          </label>
          <select
            value={applicableContext}
            onChange={(e) => set({ applicableContext: e.target.value as LiradsApplicableContext })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          >
            {LIRADS_APPLICABLE_CONTEXTS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {notApplicable && (
            <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
              LI-RADS applies only to patients at high risk for HCC (cirrhosis, chronic HBV, or
              current/prior HCC). For this context the categories below are <strong>provisional only</strong>
              {" "}and should not be reported as LI-RADS.
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/60">Indication</label>
          <select
            value={indication}
            onChange={(e) => set({ indication: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="">Select indication...</option>
            {LIRADS_INDICATIONS.map((i) => (
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
            placeholder="e.g. Prior CT/MRI dated 2025-04-01"
            value={comparison}
            onChange={(e) => set({ comparison: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}
