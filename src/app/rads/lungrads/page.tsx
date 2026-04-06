import type { Metadata } from "next";
import LungRadsReportGenerator from "./LungRadsReportGenerator";

export const metadata: Metadata = {
  title: "Lung-RADS Calculator & Report Generator — v2022",
  description:
    "Free lung cancer screening CT structured report generator with Lung-RADS v2022 scoring. Supports solid, part-solid, and ground-glass nodules. Multi-nodule, S modifier, PACS-ready report.",
  keywords: [
    "Lung-RADS", "Lung-RADS v2022", "lung cancer screening",
    "LDCT", "pulmonary nodule", "structured reporting",
    "low-dose CT", "lung nodule calculator",
  ],
};

export default function LungRadsPage() {
  return (
    <main className="flex-1 px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">
            RADS Tool
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Lung Cancer Screening CT Report Generator
          </h1>
          <p className="mt-3 text-sm text-foreground/60">
            Structured reporting with Lung-RADS v2022 &middot; Multi-nodule
            &middot; S modifier &middot; PACS-ready output
          </p>
        </div>
        <LungRadsReportGenerator />
        <footer className="mt-10 space-y-2 rounded-xl border border-border bg-muted p-4 text-xs text-foreground/50 leading-relaxed">
          <p>
            <strong>Disclaimer:</strong> This tool is for educational and
            research purposes only. It is not a medical device and has not
            been cleared or approved by the FDA, KFDA/MFDS, or any
            regulatory authority. It is not intended for clinical diagnosis
            or treatment decisions. It does not replace professional
            medical judgment. Always correlate with clinical findings and
            institutional protocols.
          </p>
          <p>
            <strong>Reference:</strong> ACR Lung-RADS v2022 — American College
            of Radiology. Lung CT Screening Reporting &amp; Data System
            (Lung-RADS).
          </p>
        </footer>
      </div>
    </main>
  );
}
