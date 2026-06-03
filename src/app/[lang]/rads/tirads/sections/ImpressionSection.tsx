"use client";

import { useMemo } from "react";
import { useReport } from "../report/ReportContext";
import { generateAutoImpression } from "../report/reportTextGenerator";
import CollapsibleSection from "./CollapsibleSection";

export default function ImpressionSection() {
  const { state, dispatch, scoredNodules } = useReport();

  const autoImpression = useMemo(
    () => generateAutoImpression(state, scoredNodules),
    [state, scoredNodules],
  );

  const isOverridden = state.impressionOverride !== null;
  const displayText = state.impressionOverride ?? autoImpression;

  return (
    <CollapsibleSection title="Impression" defaultOpen={true}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-foreground/50">
            {isOverridden ? "Manually edited" : "Auto-generated from findings"}
          </p>
          {isOverridden && (
            <button
              type="button"
              onClick={() => dispatch({ type: "SET_IMPRESSION_OVERRIDE", value: null })}
              className="text-xs text-primary hover:underline"
            >
              Reset to auto
            </button>
          )}
        </div>
        <textarea
          aria-label="Impression"
          rows={5}
          value={displayText}
          onChange={(e) => dispatch({ type: "SET_IMPRESSION_OVERRIDE", value: e.target.value })}
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-mono leading-relaxed"
        />
      </div>
    </CollapsibleSection>
  );
}
