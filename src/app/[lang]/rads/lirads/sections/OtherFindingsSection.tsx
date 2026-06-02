"use client";

import { useLiradsReport } from "../report/ReportContext";
import CollapsibleSection from "./CollapsibleSection";

export default function OtherFindingsSection() {
  const { state, dispatch } = useLiradsReport();

  return (
    <CollapsibleSection title="Other / Incidental Findings" defaultOpen={false}>
      <textarea
        rows={3}
        placeholder="e.g. Portal hypertension, varices, ascites, biliary dilatation, extrahepatic findings..."
        value={state.otherFindings}
        onChange={(e) => dispatch({ type: "SET_OTHER_FINDINGS", value: e.target.value })}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
      />
    </CollapsibleSection>
  );
}
