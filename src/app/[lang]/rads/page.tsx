import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aperivue RADS — Radiology Scoring & Structured Reporting",
  description:
    "Free structured radiology report generators for TI-RADS, Lung-RADS, BI-RADS, and LI-RADS. Evidence-based scoring calculators with PACS-ready output.",
};

const modules = [
  {
    name: "TI-RADS",
    description:
      "Thyroid ultrasound structured reporting with ACR TI-RADS, K-TIRADS, and EU-TIRADS scoring. Multi-nodule support and FNA criteria.",
    href: "/rads/tirads",
    status: "live" as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h4l3-7 4 14 3-7h4" />
      </svg>
    ),
  },
  {
    name: "Lung-RADS",
    description:
      "Lung cancer screening CT report generator with Lung-RADS v2022. Solid, part-solid, and ground-glass nodule classification.",
    href: "/rads/lungrads",
    status: "live" as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    name: "BI-RADS",
    description:
      "Breast imaging structured reporting with BI-RADS assessment categories for mammography, ultrasound, and MRI.",
    href: "#",
    status: "coming" as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    name: "LI-RADS",
    description:
      "Liver imaging reporting and data system for CT and MRI. HCC diagnostic algorithm with ancillary features.",
    href: "#",
    status: "coming" as const,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

export default function RadsLandingPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Header */}
      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-accent">
          Structured Radiology Reporting
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
          Aperivue{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            RADS
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-foreground/60">
          Free, evidence-based scoring calculators with structured report
          generation. Built by a radiologist, for radiologists.
        </p>
      </div>

      {/* Module Grid */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {modules.map((mod) => {
          const isLive = mod.status === "live";

          const cardClassName = `group relative flex flex-col rounded-2xl border p-8 transition-all ${
            isLive
              ? "border-border bg-surface hover:border-primary/30 hover:shadow-lg cursor-pointer"
              : "border-border/50 bg-surface/50 opacity-70"
          }`;

          const inner = (
            <>
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isLive ? "bg-primary/10 text-primary" : "bg-muted text-foreground/30"
                }`}>
                  {mod.icon}
                </div>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                    isLive
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : "bg-foreground/5 text-foreground/40"
                  }`}
                >
                  {isLive ? "Live" : "Coming Soon"}
                </span>
              </div>

              <h2 className="mt-5 text-xl font-semibold">{mod.name}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/60">
                {mod.description}
              </p>

              {isLive && (
                <p className="mt-5 text-sm font-medium text-primary group-hover:underline">
                  Open calculator &rarr;
                </p>
              )}
            </>
          );

          return isLive ? (
            <Link key={mod.name} href={mod.href} className={cardClassName}>
              {inner}
            </Link>
          ) : (
            <div key={mod.name} className={cardClassName}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
