"use client";

import { useState } from "react";
import { useBiRadsReport } from "../report/ReportContext";
import {
  generateBiRadsReportText,
  generateAutoImpression,
} from "../report/reportTextGenerator";

export default function BiRadsReportPreview() {
  const { state, dispatch } = useBiRadsReport();
  const [copied, setCopied] = useState(false);
  const [impressionCopied, setImpressionCopied] = useState(false);

  const reportText = generateBiRadsReportText(state);
  const impression = state.impressionOverride ?? generateAutoImpression(state);

  function copyReport() {
    navigator.clipboard.writeText(reportText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function copyImpression() {
    navigator.clipboard.writeText(impression).then(() => {
      setImpressionCopied(true);
      setTimeout(() => setImpressionCopied(false), 2000);
    });
  }

  return (
    <section className="rounded-xl border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Report Preview</h3>
        <div className="flex gap-2">
          <button
            onClick={copyImpression}
            className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground/60 transition-colors hover:border-primary/40 hover:text-primary"
          >
            {impressionCopied ? "Copied!" : "Copy Impression"}
          </button>
          <button
            onClick={copyReport}
            className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90"
          >
            {copied ? "Copied!" : "Copy Full Report"}
          </button>
        </div>
      </div>

      {/* Impression edit */}
      <div className="mb-3">
        <label className="mb-1 block text-xs font-medium text-foreground/60">
          Impression (editable — clear to auto-generate)
        </label>
        <textarea
          value={state.impressionOverride ?? impression}
          onChange={(e) => {
            const val = e.target.value;
            // If user clears to auto-generated value or empties, set to null
            dispatch({
              type: "SET_IMPRESSION_OVERRIDE",
              value: val === impression ? null : val || null,
            });
          }}
          rows={4}
          className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 font-mono text-xs text-foreground focus:border-primary focus:outline-none resize-y"
        />
      </div>

      {/* Full report */}
      <pre className="max-h-80 overflow-y-auto rounded-lg bg-muted px-4 py-3 font-mono text-xs leading-relaxed text-foreground/80 whitespace-pre-wrap">
        {reportText}
      </pre>
    </section>
  );
}
