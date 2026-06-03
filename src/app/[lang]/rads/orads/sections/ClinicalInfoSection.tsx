"use client";

import { useOradsReport } from "../report/ReportContext";
import { ORADS_INDICATIONS } from "../report/types";
import { MENOPAUSAL_OPTIONS, type Menopausal } from "@/lib/rads/orads";
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
          <label className="mb-1 block text-xs font-medium text-foreground/60">Indication</label>
          <select
            value={indication}
            onChange={(e) => set({ indication: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="">Select indication...</option>
            {ORADS_INDICATIONS.map((i) => (
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
          <label className="mb-1 block text-xs font-medium text-foreground/60">
            {isUs
              ? "Menopausal status (affects O-RADS US management)"
              : "Menopausal status (required for physiologic findings)"}
          </label>
          <select
            value={menopausal}
            onChange={(e) => set({ menopausal: e.target.value as Menopausal })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
          >
            <option value="">Not specified</option>
            {MENOPAUSAL_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/60">Comparison</label>
          <input type="text" placeholder="e.g. Prior pelvic US dated 2024-09-01"
            value={comparison}
            onChange={(e) => set({ comparison: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
        </div>
      </div>
    </CollapsibleSection>
  );
}
