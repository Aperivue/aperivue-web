import type { Metadata } from "next";
import ThyroidReportGenerator from "./ThyroidReportGenerator";

export const metadata: Metadata = {
  title: "TIRADS Calculator & Report Generator — ACR TI-RADS · K-TIRADS · EU-TIRADS",
  description:
    "Free thyroid ultrasound structured report generator with TIRADS scoring. Supports ACR TI-RADS (2017), 2021 K-TIRADS, EU-TIRADS. Multi-nodule, size-based FNA, lymph node assessment, PACS-ready report.",
  keywords: [
    "TIRADS", "TI-RADS", "K-TIRADS", "EU-TIRADS",
    "thyroid nodule", "FNA", "radiology calculator",
    "thyroid ultrasound report", "structured reporting",
    "biopsy criteria", "PACS",
  ],
};

export default function TiradsPage() {
  return (
    <main className="flex-1 px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-accent">
            Aperivue RADS
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Thyroid US Report Generator
          </h1>
          <p className="mt-3 text-sm text-foreground/60">
            Structured reporting with TIRADS scoring &middot; Multi-nodule
            &middot; PACS-ready output
          </p>
        </div>
        <ThyroidReportGenerator />
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
            <strong>References:</strong> ACR TI-RADS — Tessler et al., JACR
            2017. K-TIRADS — Ha et al., Korean J Radiol 2021;22(12):2094-2123.
            EU-TIRADS — Russ et al., Eur Thyroid J 2017.
          </p>
        </footer>
      </div>
    </main>
  );
}
