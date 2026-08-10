"use client";

import { ReportProvider, useReport } from "./report/ReportContext";
import type { TiradsSystem } from "@/lib/rads/tirads";
import ClinicalInfoSection from "./sections/ClinicalInfoSection";
import GlandAssessmentSection from "./sections/GlandAssessmentSection";
import NoduleSidebar from "./sections/NoduleSidebar";
import NoduleDetailPanel from "./sections/NoduleDetailPanel";
import LymphNodeSection from "./sections/LymphNodeSection";
import OtherFindingsSection from "./sections/OtherFindingsSection";
import ImpressionSection from "./sections/ImpressionSection";
import ReportPreview from "./sections/ReportPreview";

const SYSTEMS: { id: TiradsSystem; label: string; year: string }[] = [
  { id: "acr", label: "ACR TI-RADS", year: "2017" },
  { id: "ktirads", label: "K-TIRADS", year: "2021" },
  { id: "eutirads", label: "EU-TIRADS", year: "2017" },
];

function ReportContent() {
  const { state, dispatch } = useReport();

  return (
    <div className="space-y-4">
      {/* System selector */}
      <div className="flex rounded-lg border border-border bg-muted p-1">
        {SYSTEMS.map((s) => (
          <button
            key={s.id}
            onClick={() => dispatch({ type: "SET_SYSTEM", system: s.id })}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              state.system === s.id
                ? "bg-surface text-foreground shadow-sm"
                : "text-foreground/50 hover:text-foreground/80"
            }`}
          >
            {s.label}
            <span className="ml-1 text-[10px] text-foreground/60">{s.year}</span>
          </button>
        ))}
      </div>

      {/* Clinical Info */}
      <ClinicalInfoSection />

      {/* Gland Assessment */}
      <GlandAssessmentSection />

      {/* Nodules — split panel */}
      <section className="rounded-xl border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold">Nodule Assessment</h3>
        <div className="flex flex-col gap-4 md:flex-row">
          <NoduleSidebar />
          <div className="hidden w-px bg-border md:block" />
          <NoduleDetailPanel />
        </div>
      </section>

      {/* Lymph Nodes */}
      <LymphNodeSection />

      {/* Other Findings */}
      <OtherFindingsSection />

      {/* Impression */}
      <ImpressionSection />

      {/* Report Preview */}
      <ReportPreview />
    </div>
  );
}

export default function ThyroidReportGenerator() {
  return (
    <ReportProvider>
      <ReportContent />
    </ReportProvider>
  );
}
