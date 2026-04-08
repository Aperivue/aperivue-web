"use client";

import { useMemo, useState } from "react";
import { useReport } from "../report/ReportContext";
import { generateReportText } from "../report/reportTextGenerator";
import CollapsibleSection from "./CollapsibleSection";

export default function ReportPreview() {
  const { state, scoredNodules } = useReport();
  const [copied, setCopied] = useState(false);

  const reportText = useMemo(
    () => generateReportText(state, scoredNodules),
    [state, scoredNodules],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CollapsibleSection title="Report Preview" defaultOpen={true}>
      <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted p-4 text-xs font-mono leading-relaxed text-foreground/80">
        {reportText}
      </pre>
      <div className="mt-3 flex justify-end">
        <button
          onClick={handleCopy}
          className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
            copied
              ? "bg-green-600 text-white"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
        >
          {copied ? "Copied!" : "Copy Full Report"}
        </button>
      </div>
    </CollapsibleSection>
  );
}
