"use client";

import { useLungReport } from "../report/ReportContext";
import { LabeledTextarea } from "@/components/rads/LabeledField";
import CollapsibleSection from "./CollapsibleSection";

export default function MediastinumSection() {
  const { state, dispatch } = useLungReport();
  const m = state.mediastinum;

  const set = (payload: Partial<typeof m>) =>
    dispatch({ type: "SET_MEDIASTINUM", payload });

  return (
    <CollapsibleSection title="Mediastinum / Lymph Nodes" defaultOpen={false}>
      <div className="space-y-3">
        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-muted">
          <input
            type="checkbox"
            checked={m.lymphadenopathy}
            onChange={() => set({ lymphadenopathy: !m.lymphadenopathy })}
            className="accent-primary"
          />
          <div>
            <span className="font-medium">Mediastinal / hilar lymphadenopathy</span>
            <p className="text-xs text-foreground/60">Short-axis diameter &gt; 10 mm</p>
          </div>
        </label>

        {m.lymphadenopathy && (
          <LabeledTextarea
            label="Lymph node description"
            rows={2}
            placeholder="e.g. Station 7 subcarinal node, 14 mm short axis..."
            value={m.lymphNodes}
            onChange={(e) => set({ lymphNodes: e.target.value })}
          />
        )}

        <LabeledTextarea
          label="Other mediastinal findings"
          rows={2}
          placeholder="e.g. Coronary calcifications, pericardial effusion, thyroid abnormality..."
          value={m.other}
          onChange={(e) => set({ other: e.target.value })}
        />
      </div>
    </CollapsibleSection>
  );
}
