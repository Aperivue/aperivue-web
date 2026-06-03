"use client";

import { OradsReportProvider } from "./report/ReportContext";
import SystemSelector from "./sections/SystemSelector";
import ClinicalInfoSection from "./sections/ClinicalInfoSection";
import LesionSidebar from "./sections/LesionSidebar";
import LesionDetailPanel from "./sections/LesionDetailPanel";
import OtherFindingsSection from "./sections/OtherFindingsSection";
import ImpressionSection from "./sections/ImpressionSection";
import ReportPreview from "./sections/ReportPreview";

const INTRO = {
  en: "Calculator inputs are in English. Choose the imaging system, then complete the lexicon descriptors to generate a PACS-ready report.",
  ko: "계산기 입력은 영어로 표기됩니다. 영상 시스템을 선택한 뒤 항목을 채우면 PACS용 리포트가 생성됩니다.",
} as const;

function ReportContent({ locale }: { locale: "en" | "ko" }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-foreground/45">{INTRO[locale]}</p>

      <SystemSelector />

      <ClinicalInfoSection />

      <section className="rounded-xl border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold">Lesion Assessment</h3>
        <div className="flex flex-col gap-4 md:flex-row">
          <LesionSidebar />
          <div className="hidden w-px bg-border md:block" />
          <LesionDetailPanel />
        </div>
      </section>

      <OtherFindingsSection />
      <ImpressionSection />
      <ReportPreview />
    </div>
  );
}

export default function AdnexalReportGenerator({ locale }: { locale: "en" | "ko" }) {
  return (
    <OradsReportProvider>
      <ReportContent locale={locale} />
    </OradsReportProvider>
  );
}
