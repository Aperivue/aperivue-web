"use client";

import { LungReportProvider, useLungReport } from "./report/ReportContext";
import ClinicalInfoSection from "./sections/ClinicalInfoSection";
import SpecialCategorySection from "./sections/SpecialCategorySection";
import NoduleSidebar from "./sections/NoduleSidebar";
import NoduleDetailPanel from "./sections/NoduleDetailPanel";
import MediastinumSection from "./sections/MediastinumSection";
import OtherFindingsSection from "./sections/OtherFindingsSection";
import ImpressionSection from "./sections/ImpressionSection";
import ReportPreview from "./sections/ReportPreview";

function ReportContent() {
  const { state } = useLungReport();
  const showNoduleAssessment = !state.specialCategory;

  return (
    <div className="space-y-4">
      {/* Clinical Info */}
      <ClinicalInfoSection />

      {/* Pre-assessment (Cat 0/1) */}
      <SpecialCategorySection />

      {/* Nodules — split panel */}
      {showNoduleAssessment && (
        <section className="rounded-xl border border-border p-4">
          <h3 className="mb-3 text-sm font-semibold">Nodule Assessment</h3>
          <div className="flex flex-col gap-4 md:flex-row">
            <NoduleSidebar />
            <div className="hidden w-px bg-border md:block" />
            <NoduleDetailPanel />
          </div>
        </section>
      )}

      {/* Mediastinum */}
      <MediastinumSection />

      {/* Other Findings */}
      <OtherFindingsSection />

      {/* Impression */}
      <ImpressionSection />

      {/* Report Preview */}
      <ReportPreview />
    </div>
  );
}

export default function LungRadsReportGenerator() {
  return (
    <LungReportProvider>
      <ReportContent />
    </LungReportProvider>
  );
}
