"use client";

import { useLungReport } from "../report/ReportContext";
import CollapsibleSection from "./CollapsibleSection";

export default function OtherFindingsSection() {
  const { state, dispatch } = useLungReport();

  return (
    <CollapsibleSection title="Other / Incidental Findings" defaultOpen={false}>
      <textarea
        aria-label="Other findings"
        rows={3}
        placeholder="e.g. Emphysema, interstitial lung disease, pleural abnormality, bone lesion, coronary calcification..."
        value={state.otherFindings}
        onChange={(e) => dispatch({ type: "SET_OTHER_FINDINGS", value: e.target.value })}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
      />
    </CollapsibleSection>
  );
}
