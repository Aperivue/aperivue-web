"use client";

import { useReport } from "../report/ReportContext";
import { LN_LEVELS, LN_FEATURES } from "../report/types";
import { LabeledTextarea } from "@/components/rads/LabeledField";
import CollapsibleSection from "./CollapsibleSection";

export default function LymphNodeSection() {
  const { state, dispatch } = useReport();
  const ln = state.lymphNodes;

  return (
    <CollapsibleSection title="Cervical Lymph Nodes" defaultOpen={false}>
      <div className="space-y-3">
        <div className="flex gap-3">
          {(["normal", "abnormal"] as const).map((s) => (
            <label key={s} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              ln.status === s ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
            }`}>
              <input type="radio" name="ln-status" checked={ln.status === s}
                onChange={() => dispatch({ type: "SET_LYMPH_STATUS", status: s })}
                className="accent-primary" />
              {s === "normal" ? "Normal" : "Abnormal / Suspicious"}
            </label>
          ))}
        </div>

        {ln.status === "abnormal" && (
          <div className="space-y-3">
            {ln.nodes.map((node) => (
              <div key={node.id} className="rounded-lg border border-border bg-surface p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground/60">Abnormal Node</span>
                  <button onClick={() => dispatch({ type: "REMOVE_ABNORMAL_LN", id: node.id })}
                    className="text-xs text-red-500 hover:underline">Remove</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor={`ln-level-${node.id}`} className="text-xs text-foreground/50">Level</label>
                    <select id={`ln-level-${node.id}`} value={node.level}
                      onChange={(e) => dispatch({ type: "UPDATE_ABNORMAL_LN", id: node.id, payload: { level: e.target.value } })}
                      className="w-full rounded border border-border bg-surface px-2 py-1 text-sm">
                      <option value="">--</option>
                      {LN_LEVELS.map((l) => <option key={l} value={l}>Level {l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`ln-size-${node.id}`} className="text-xs text-foreground/50">Short diameter (mm)</label>
                    <input id={`ln-size-${node.id}`} type="number" step="1" min="0" value={node.size}
                      onChange={(e) => dispatch({ type: "UPDATE_ABNORMAL_LN", id: node.id, payload: { size: e.target.value } })}
                      className="w-full rounded border border-border bg-surface px-2 py-1 text-sm" />
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-foreground/50">Features</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {LN_FEATURES.map((f) => {
                      const checked = node.features.includes(f.value);
                      return (
                        <label key={f.value} className={`cursor-pointer rounded-full border px-2.5 py-1 text-xs transition-colors ${
                          checked ? "border-primary bg-primary/10 font-medium" : "border-border hover:bg-muted"
                        }`}>
                          <input type="checkbox" className="sr-only" checked={checked}
                            onChange={() => {
                              const features = checked
                                ? node.features.filter((v) => v !== f.value)
                                : [...node.features, f.value];
                              dispatch({ type: "UPDATE_ABNORMAL_LN", id: node.id, payload: { features } });
                            }} />
                          {f.label}
                        </label>
                      );
                    })}
                  </div>
                </div>
                <textarea rows={1} placeholder="Additional description..."
                  aria-label="Abnormal node additional description"
                  value={node.description}
                  onChange={(e) => dispatch({ type: "UPDATE_ABNORMAL_LN", id: node.id, payload: { description: e.target.value } })}
                  className="mt-2 w-full rounded border border-border bg-surface px-2 py-1 text-sm" />
              </div>
            ))}
            <button onClick={() => dispatch({ type: "ADD_ABNORMAL_LN" })}
              className="rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-foreground/40 hover:bg-muted">
              + Add Abnormal Node
            </button>
          </div>
        )}

        <LabeledTextarea label="Additional LN description" rows={2}
          placeholder="e.g. Bilateral benign-appearing reactive LNs in levels II-III..."
          value={ln.additionalDescription}
          onChange={(e) => dispatch({ type: "SET_LYMPH_DESCRIPTION", value: e.target.value })} />
      </div>
    </CollapsibleSection>
  );
}
