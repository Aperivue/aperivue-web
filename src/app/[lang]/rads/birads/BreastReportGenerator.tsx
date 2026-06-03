"use client";

import { useId } from "react";
import { BiRadsReportProvider, useBiRadsReport } from "./report/ReportContext";
import type { BiRadsModality } from "@/lib/rads/birads";
import { BREAST_COMPOSITIONS, MRI_BPE_OPTIONS } from "@/lib/rads/birads";
import { BIRADS_INDICATIONS } from "./report/types";
import LesionSidebar from "./sections/LesionSidebar";
import LesionDetailPanel from "./sections/LesionDetailPanel";
import BiRadsReportPreview from "./sections/ReportPreview";

const MODALITIES: { id: BiRadsModality; label: string; desc: string }[] = [
  { id: "mammo", label: "Mammography", desc: "2D / tomosynthesis" },
  { id: "us", label: "Ultrasound", desc: "B-mode ± Doppler" },
  { id: "mri", label: "MRI", desc: "CE breast MRI" },
];

// ── UI text (Korean / English) ────────────────────────────────────────────

const UI_TEXT = {
  en: {
    modality: "Modality",
    indication: "Indication",
    comparison: "Comparison",
    compPlaceholder: "e.g. Mammography 2023-04",
    breastComposition: "Breast Composition (Mammography)",
    mriBpe: "Background Parenchymal Enhancement (MRI)",
    findings: "Findings",
    otherFindings: "Other Findings",
    otherPlaceholder: "Skin changes, axillary findings, etc.",
  },
  ko: {
    modality: "검사 종류",
    indication: "검사 적응증",
    comparison: "비교 검사",
    compPlaceholder: "예: 유방촬영 2023-04",
    breastComposition: "유방 구성 (유방촬영)",
    mriBpe: "배경 유방 실질 조영증강 (MRI)",
    findings: "소견",
    otherFindings: "기타 소견",
    otherPlaceholder: "피부 변화, 액와부 소견 등",
  },
} as const;

// ── Main inner component ──────────────────────────────────────────────────

function ReportContent({ locale }: { locale: "en" | "ko" }) {
  const { state, dispatch } = useBiRadsReport();
  const t = UI_TEXT[locale];
  const indicationId = useId();
  const comparisonId = useId();

  return (
    <div className="space-y-4">
      {/* Modality selector */}
      <div className="flex rounded-lg border border-border bg-muted p-1">
        {MODALITIES.map((mod) => (
          <button
            key={mod.id}
            onClick={() => dispatch({ type: "SET_MODALITY", modality: mod.id })}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              state.modality === mod.id
                ? "bg-surface text-foreground shadow-sm"
                : "text-foreground/50 hover:text-foreground/80"
            }`}
          >
            {mod.label}
            <span className="ml-1 text-[10px] text-foreground/40">{mod.desc}</span>
          </button>
        ))}
      </div>

      {/* Clinical Info */}
      <section className="rounded-xl border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold">{t.indication}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor={indicationId} className="mb-1 block text-xs font-medium text-foreground/70">
              {t.indication}
            </label>
            <select
              id={indicationId}
              value={state.clinicalInfo.indication}
              onChange={(e) =>
                dispatch({
                  type: "SET_CLINICAL_INFO",
                  payload: { indication: e.target.value },
                })
              }
              className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">— Select —</option>
              {BIRADS_INDICATIONS.map((ind) => (
                <option key={ind.value} value={ind.value}>
                  {ind.label}
                </option>
              ))}
            </select>
            {state.clinicalInfo.indication === "other" && (
              <input
                type="text"
                aria-label="Custom indication"
                value={state.clinicalInfo.customIndication}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CLINICAL_INFO",
                    payload: { customIndication: e.target.value },
                  })
                }
                placeholder="Specify indication..."
                className="mt-2 w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none"
              />
            )}
          </div>
          <div>
            <label htmlFor={comparisonId} className="mb-1 block text-xs font-medium text-foreground/70">
              {t.comparison}
            </label>
            <input
              id={comparisonId}
              type="text"
              value={state.clinicalInfo.comparison}
              onChange={(e) =>
                dispatch({
                  type: "SET_CLINICAL_INFO",
                  payload: { comparison: e.target.value },
                })
              }
              placeholder={t.compPlaceholder}
              className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Breast Composition (mammo only) */}
      {state.modality === "mammo" && (
        <section className="rounded-xl border border-border p-4">
          <h3 className="mb-3 text-sm font-semibold">{t.breastComposition}</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BREAST_COMPOSITIONS.filter((c) => c.value !== "").map((comp) => (
              <button
                key={comp.value}
                onClick={() =>
                  dispatch({
                    type: "SET_BREAST_COMPOSITION",
                    value: state.breastComposition === comp.value ? "" : comp.value,
                  })
                }
                className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${
                  state.breastComposition === comp.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-surface text-foreground/60 hover:border-primary/30"
                }`}
              >
                <div className="font-semibold">{comp.label.split(" — ")[0]}</div>
                <div className="mt-0.5 text-[10px] text-foreground/40 leading-tight">{comp.desc}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Background Parenchymal Enhancement (MRI only) */}
      {state.modality === "mri" && (
        <section className="rounded-xl border border-border p-4">
          <h3 className="mb-3 text-sm font-semibold">{t.mriBpe}</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {MRI_BPE_OPTIONS.filter((b) => b.value !== "").map((bpe) => (
              <button
                key={bpe.value}
                onClick={() =>
                  dispatch({
                    type: "SET_MRI_BPE",
                    value: state.mriBpe === bpe.value ? "" : bpe.value,
                  })
                }
                className={`rounded-lg border p-2.5 text-left text-xs transition-colors ${
                  state.mriBpe === bpe.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-surface text-foreground/60 hover:border-primary/30"
                }`}
              >
                <div className="font-semibold">{bpe.label.split(" (")[0]}</div>
                <div className="mt-0.5 text-[10px] text-foreground/40 leading-tight">{bpe.desc}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Findings — split panel */}
      <section className="rounded-xl border border-border p-4">
        <h3 className="mb-3 text-sm font-semibold">{t.findings}</h3>
        <div className="flex flex-col gap-4 md:flex-row">
          <LesionSidebar />
          <div className="hidden w-px bg-border md:block" />
          <LesionDetailPanel />
        </div>
      </section>

      {/* Other Findings */}
      <section className="rounded-xl border border-border p-4">
        <h3 className="mb-2 text-sm font-semibold">{t.otherFindings}</h3>
        <textarea
          aria-label={t.otherFindings}
          value={state.otherFindings}
          onChange={(e) =>
            dispatch({ type: "SET_OTHER_FINDINGS", value: e.target.value })
          }
          rows={2}
          placeholder={t.otherPlaceholder}
          className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none resize-none"
        />
      </section>

      {/* Report Preview */}
      <BiRadsReportPreview />
    </div>
  );
}

export default function BreastReportGenerator({ locale }: { locale: "en" | "ko" }) {
  return (
    <BiRadsReportProvider>
      <ReportContent locale={locale} />
    </BiRadsReportProvider>
  );
}
