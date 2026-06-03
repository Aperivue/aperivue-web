"use client";

import { useReport } from "../report/ReportContext";
import type { Dimensions } from "../report/types";
import { LabeledInput, LabeledSelect, LabeledTextarea } from "@/components/rads/LabeledField";
import CollapsibleSection from "./CollapsibleSection";

function DimensionInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Dimensions;
  onChange: (d: Dimensions) => void;
}) {
  return (
    <div>
      <p className="mb-1 block text-xs font-medium text-foreground/60">{label}</p>
      <div className="flex items-center gap-1">
        <input type="number" step="0.1" min="0" placeholder="L" aria-label={`${label} length (cm)`} value={value.l}
          onChange={(e) => onChange({ ...value, l: e.target.value })}
          className="w-20 rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-center" />
        <span className="text-xs text-foreground/40">&times;</span>
        <input type="number" step="0.1" min="0" placeholder="W" aria-label={`${label} width (cm)`} value={value.w}
          onChange={(e) => onChange({ ...value, w: e.target.value })}
          className="w-20 rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-center" />
        <span className="text-xs text-foreground/40">&times;</span>
        <input type="number" step="0.1" min="0" placeholder="H" aria-label={`${label} height (cm)`} value={value.h}
          onChange={(e) => onChange({ ...value, h: e.target.value })}
          className="w-20 rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-center" />
        <span className="text-xs text-foreground/40">cm</span>
      </div>
    </div>
  );
}

export default function GlandAssessmentSection() {
  const { state, dispatch } = useReport();
  const g = state.glandAssessment;

  const set = (payload: Partial<typeof g>) =>
    dispatch({ type: "SET_GLAND", payload });

  return (
    <CollapsibleSection title="Thyroid Gland" defaultOpen={false}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <DimensionInput label="Right lobe" value={g.rightLobe} onChange={(d) => set({ rightLobe: d })} />
          <DimensionInput label="Left lobe" value={g.leftLobe} onChange={(d) => set({ leftLobe: d })} />
        </div>

        <LabeledInput
          wrapperClassName="w-40"
          label="Isthmus AP (cm)"
          type="number" step="0.1" min="0" placeholder="e.g. 0.3"
          value={g.isthmusAP} onChange={(e) => set({ isthmusAP: e.target.value })}
          className="w-full rounded-lg border border-border bg-surface px-3 py-1.5 text-sm" />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <LabeledSelect label="Echotexture" value={g.echotexture} onChange={(e) => set({ echotexture: e.target.value as typeof g.echotexture })}>
            <option value="">--</option>
            <option value="normal">Normal (homogeneous)</option>
            <option value="heterogeneous">Heterogeneous</option>
            <option value="diffusely_hypoechoic">Diffusely hypoechoic</option>
          </LabeledSelect>
          <LabeledSelect label="Vascularity" value={g.vascularity} onChange={(e) => set({ vascularity: e.target.value as typeof g.vascularity })}>
            <option value="">--</option>
            <option value="normal">Normal</option>
            <option value="increased">Increased</option>
            <option value="decreased">Decreased</option>
          </LabeledSelect>
          <LabeledSelect label="Thyroiditis" value={g.thyroiditis} onChange={(e) => set({ thyroiditis: e.target.value as typeof g.thyroiditis })}>
            <option value="">--</option>
            <option value="none">None</option>
            <option value="hashimoto">Hashimoto</option>
            <option value="subacute">Subacute (de Quervain)</option>
            <option value="graves">Graves</option>
            <option value="other">Other</option>
          </LabeledSelect>
        </div>

        <LabeledTextarea
          label="Additional gland findings"
          rows={2}
          placeholder="e.g. Diffuse gland enlargement, fibrous septae..."
          value={g.additionalFindings}
          onChange={(e) => set({ additionalFindings: e.target.value })}
        />
      </div>
    </CollapsibleSection>
  );
}
