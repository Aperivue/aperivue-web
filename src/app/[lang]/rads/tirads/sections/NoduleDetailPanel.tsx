"use client";

import { useReport, maxDiameter } from "../report/ReportContext";
import { LabeledInput, LabeledSelect } from "@/components/rads/LabeledField";
import { NODULE_LOCATIONS, type NoduleLocation, type KtiradsComposition, type KtiradsEchogenicity, type EutiradsComposition } from "@/lib/rads/tirads";
import {
  AcrCalculatorControlled,
  KtiradsCalculatorControlled,
  EutiradsCalculatorControlled,
} from "../ControlledCalculators";

export default function NoduleDetailPanel() {
  const { state, dispatch, activeNodule } = useReport();
  const n = activeNodule;
  const md = maxDiameter(n);

  const update = (payload: Record<string, unknown>) =>
    dispatch({ type: "UPDATE_NODULE", id: n.id, payload });

  return (
    <div className="flex-1 space-y-3">
      {/* Label + Location */}
      <div className="grid grid-cols-2 gap-3">
        <LabeledInput label="Label" type="text" value={n.label}
          onChange={(e) => update({ label: e.target.value })} />
        <LabeledSelect label="Location" value={n.location}
          onChange={(e) => update({ location: e.target.value as NoduleLocation })}>
          {NODULE_LOCATIONS.map((loc) => (
            <option key={loc.value} value={loc.value}>{loc.label}</option>
          ))}
        </LabeledSelect>
      </div>

      {/* 3D Size */}
      <div>
        <p className="mb-1 block text-xs font-medium text-foreground/60">
          Size (cm) {md !== null && <span className="text-foreground/60">— max diameter: {md} cm</span>}
        </p>
        <div className="flex items-center gap-1">
          <input type="number" step="0.1" min="0" placeholder="L" aria-label="Length (cm)" value={n.sizeL}
            onChange={(e) => update({ sizeL: e.target.value })}
            className="w-20 rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-center" />
          <span className="text-xs text-foreground/60">&times;</span>
          <input type="number" step="0.1" min="0" placeholder="W" aria-label="Width (cm)" value={n.sizeW}
            onChange={(e) => update({ sizeW: e.target.value })}
            className="w-20 rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-center" />
          <span className="text-xs text-foreground/60">&times;</span>
          <input type="number" step="0.1" min="0" placeholder="H" aria-label="Height (cm)" value={n.sizeH}
            onChange={(e) => update({ sizeH: e.target.value })}
            className="w-20 rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-center" />
          <span className="text-xs text-foreground/60">cm</span>
        </div>
      </div>

      {/* Calculator based on active system */}
      {state.system === "acr" && (
        <AcrCalculatorControlled
          selections={n.acrSelections}
          onSelectionChange={(catIdx, optIdx) => {
            const next = [...n.acrSelections];
            next[catIdx] = optIdx;
            update({ acrSelections: next });
          }}
          sizeCm={md}
        />
      )}

      {state.system === "ktirads" && (
        <KtiradsCalculatorControlled
          composition={n.ktiradsComposition}
          echogenicity={n.ktiradsEchogenicity}
          suspicious={n.ktiradsSuspicious}
          entirelyCalcified={n.ktiradsEntirelyCalcified}
          onCompositionChange={(v: KtiradsComposition) => update({ ktiradsComposition: v, ktiradsEntirelyCalcified: v === "cystic" ? false : n.ktiradsEntirelyCalcified })}
          onEchogenicityChange={(v: KtiradsEchogenicity) => update({ ktiradsEchogenicity: v })}
          onSuspiciousChange={(key, val) => update({ ktiradsSuspicious: { ...n.ktiradsSuspicious, [key]: val } })}
          onEntirelyCalcifiedChange={(v) => update({ ktiradsEntirelyCalcified: v })}
          sizeCm={md}
        />
      )}

      {state.system === "eutirads" && (
        <EutiradsCalculatorControlled
          composition={n.eutiradsComposition}
          hasHighRisk={n.eutiradsHasHighRisk}
          onCompositionChange={(v: EutiradsComposition) => update({ eutiradsComposition: v })}
          onHighRiskChange={(v) => update({ eutiradsHasHighRisk: v })}
          sizeCm={md}
        />
      )}
    </div>
  );
}
