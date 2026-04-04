import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
  description: "About Aperivue and Yoojin Nam — Medical AI researcher and developer.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-1 flex-col px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-widest text-accent">
        About
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        The Team Behind Aperivue
      </h1>

      <section className="mt-12 flex flex-col gap-8 md:flex-row">
        <div className="shrink-0">
          <Image
            src="/images/yoojin-nam.jpg"
            alt="Yoojin Nam"
            width={200}
            height={200}
            className="rounded-2xl object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">Yoojin Nam, M.D.</h2>
          <p className="mt-1 text-sm text-foreground/60">
            Founder &amp; Medical AI Researcher
          </p>
          <p className="mt-4 leading-relaxed text-foreground/80">
            Radiology resident and doctoral candidate at Asan Medical Center,
            University of Ulsan College of Medicine. Research focus on diagnostic
            accuracy studies, medical image analysis with deep learning, and
            AI validation in clinical workflows.
          </p>
          <p className="mt-3 leading-relaxed text-foreground/80">
            Previously at KAIST (B.S.), Yonsei University College of Medicine (M.D.),
            and MI2RL (Medical Imaging &amp; Intelligent Reality Lab). Contributor to
            MeducAI — a multi-agent system for automated manuscript quality assurance.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Mission</h2>
        <p className="mt-4 leading-relaxed text-foreground/80">
          Aperivue aims to make radiology smarter and more accessible.
          We build practical tools that help radiologists work more efficiently —
          from structured RADS scoring calculators to AI-assisted diagnostic pipelines.
          Our content bridges the gap between cutting-edge AI research and
          everyday clinical practice.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Timeline</h2>
        <div className="mt-6 space-y-4 border-l-2 border-primary/30 pl-6">
          {[
            { year: "2016", text: "KAIST — B.S. in Bio & Brain Engineering" },
            { year: "2022", text: "Yonsei University — M.D." },
            { year: "2023", text: "MI2RL — Medical Imaging Research" },
            { year: "2025", text: "Samsung Changwon Hospital — Radiology Resident" },
            { year: "2026", text: "Asan Medical Center — Fellowship & Ph.D." },
            { year: "2026", text: "Aperivue founded" },
          ].map((item) => (
            <div key={item.year + item.text} className="relative">
              <div className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full bg-primary" />
              <p className="text-sm font-semibold text-primary">{item.year}</p>
              <p className="text-sm text-foreground/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
