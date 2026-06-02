"use client";

import { LiradsReportProvider } from "./report/ReportContext";
import ModalityTechniqueSection from "./sections/ModalityTechniqueSection";
import ClinicalInfoSection from "./sections/ClinicalInfoSection";
import ObservationSidebar from "./sections/ObservationSidebar";
import ObservationDetailPanel from "./sections/ObservationDetailPanel";
import OtherFindingsSection from "./sections/OtherFindingsSection";
import ImpressionSection from "./sections/ImpressionSection";
import ReportPreview from "./sections/ReportPreview";

const INTRO = {
  en: "Calculator inputs are in English. Complete the fields below to generate a PACS-ready report.",
  ko: "계산기 입력은 영어로 표기됩니다. 아래 항목을 채우면 PACS용 리포트가 생성됩니다.",
} as const;

function ReportContent({ locale }: { locale: "en" | "ko" }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-foreground/45">{INTRO[locale]}</p>

      <ModalityTechniqueSection />
      <ClinicalInfoSection />

      <section className="rounded-xl border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold">Observation Assessment</h3>
        <div className="flex flex-col gap-4 md:flex-row">
          <ObservationSidebar />
          <div className="hidden w-px bg-border md:block" />
          <ObservationDetailPanel />
        </div>
      </section>

      <OtherFindingsSection />
      <ImpressionSection />
      <ReportPreview />
    </div>
  );
}

export default function LiverReportGenerator({ locale }: { locale: "en" | "ko" }) {
  return (
    <LiradsReportProvider>
      <ReportContent locale={locale} />
    </LiradsReportProvider>
  );
}
