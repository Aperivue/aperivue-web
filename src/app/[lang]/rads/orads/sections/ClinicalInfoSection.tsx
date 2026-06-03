"use client";

import { useOradsReport } from "../report/ReportContext";
import { ORADS_INDICATIONS } from "../report/types";
import { MENOPAUSAL_OPTIONS, type Menopausal } from "@/lib/rads/orads";
import { LabeledInput, LabeledSelect } from "@/components/rads/LabeledField";
import CollapsibleSection from "./CollapsibleSection";

export default function ClinicalInfoSection() {
  const { state, dispatch } = useOradsReport();
  const { indication, customIndication, comparison, menopausal } = state.clinicalInfo;
  const isUs = state.system === "us";

  const set = (payload: Partial<typeof state.clinicalInfo>) =>
    dispatch({ type: "SET_CLINICAL_INFO", payload });

  return (
    <CollapsibleSection title="Clinical Information" defaultOpen={true}>
      <div className="space-y-3">
        <div>
          <LabeledSelect
            label="Indication"
            value={indication}
            onChange={(e) => set({ indication: e.target.value })}
          >
            <option value="">Select indication...</option>
            {ORADS_INDICATIONS.map((i) => (
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

        <LabeledSelect
          label={
            isUs
              ? "Menopausal status (affects O-RADS US management)"
              : "Menopausal status (required for physiologic findings)"
          }
          value={menopausal}
          onChange={(e) => set({ menopausal: e.target.value as Menopausal })}
        >
          <option value="">Not specified</option>
          {MENOPAUSAL_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </LabeledSelect>

        <LabeledInput label="Comparison" type="text" placeholder="e.g. Prior pelvic US dated 2024-09-01"
          value={comparison}
          onChange={(e) => set({ comparison: e.target.value })} />
      </div>
    </CollapsibleSection>
  );
}
