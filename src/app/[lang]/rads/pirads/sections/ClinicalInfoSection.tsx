"use client";

import { usePiradsReport } from "../report/ReportContext";
import { PIRADS_INDICATIONS } from "../report/types";
import CollapsibleSection from "./CollapsibleSection";

export default function ClinicalInfoSection() {
  const { state, dispatch } = usePiradsReport();
  const { indication, customIndication, comparison, psa, prostateVolumeMl } = state.clinicalInfo;

  const set = (payload: Partial<typeof state.clinicalInfo>) =>
    dispatch({ type: "SET_CLINICAL_INFO", payload });

  const psaNum = parseFloat(psa);
  const volNum = parseFloat(prostateVolumeMl);
  const density = !isNaN(psaNum) && !isNaN(volNum) && volNum > 0 ? (psaNum / volNum).toFixed(2) : null;

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
            {PIRADS_INDICATIONS.map((i) => (
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground/60">PSA (ng/mL)</label>
            <input type="number" step="0.1" min="0" placeholder="e.g. 6.5"
              value={psa}
              onChange={(e) => set({ psa: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-foreground/60">Prostate volume (mL)</label>
            <input type="number" step="1" min="0" placeholder="e.g. 45"
              value={prostateVolumeMl}
              onChange={(e) => set({ prostateVolumeMl: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
          </div>
        </div>
        {density && (
          <p className="text-xs text-foreground/50">PSA density: <strong>{density}</strong> ng/mL²</p>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-foreground/60">Comparison</label>
          <input type="text" placeholder="e.g. Prior mpMRI dated 2024-09-01"
            value={comparison}
            onChange={(e) => set({ comparison: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
        </div>
      </div>
    </CollapsibleSection>
  );
}
