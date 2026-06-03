"use client";

import { usePiradsReport } from "../report/ReportContext";
import CollapsibleSection from "./CollapsibleSection";

export default function OtherFindingsSection() {
  const { state, dispatch } = usePiradsReport();

  return (
    <CollapsibleSection title="Other / Staging Findings" defaultOpen={false}>
      <textarea
        aria-label="Other findings"
        rows={3}
        placeholder="e.g. Extraprostatic extension, seminal vesicle invasion, lymphadenopathy, bone lesions..."
        value={state.otherFindings}
        onChange={(e) => dispatch({ type: "SET_OTHER_FINDINGS", value: e.target.value })}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
      />
    </CollapsibleSection>
  );
}
