import type { Metadata } from "next";
import Image from "next/image";
import { getDictionary, hasLocale, type Locale } from "../../dictionaries";
import { notFound } from "next/navigation";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "About",
    description: "About Aperivue and Yoojin Nam — Medical AI researcher and developer.",
    alternates: buildAlternates(lang, "/about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = (await getDictionary(lang as Locale)).about;

  return (
    <main className="mx-auto flex max-w-4xl flex-1 flex-col px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-widest text-accent">
        About
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        {t.title}
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
          <h2 className="text-2xl font-semibold">{lang === "ko" ? "남유진" : "Yoojin Nam, M.D."}</h2>
          <p className="mt-1 text-sm text-foreground/60">
            {t.founderTitle}
          </p>
          <p className="mt-4 leading-relaxed text-foreground/80">
            {t.bio1}
          </p>
          <p className="mt-3 leading-relaxed text-foreground/80">
            {t.bio2}
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">{t.mission}</h2>
        <p className="mt-4 leading-relaxed text-foreground/80">
          {t.missionText}
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">{t.timeline}</h2>
        <div className="mt-6 space-y-4 border-l-2 border-primary/30 pl-6">
          {[
            { year: "2011", text: "KAIST — B.S. in Biological Sciences" },
            { year: "2016", text: "Yonsei University College of Medicine — M.D." },
            { year: "2021", text: "Samsung Changwon Hospital — Radiology Resident" },
            { year: "2024", text: "MI2RL, Asan Medical Center — Medical AI Research" },
            { year: "2026", text: "Aperivue founded" },
            { year: "2026", text: "Asan Medical Center — Neuroradiology Fellow" },
          ].map((item) => (
            <div key={item.year + item.text} className="relative">
              <div className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full bg-primary" />
              <p className="text-sm font-semibold text-primary">{item.year}</p>
              <p className="text-sm text-foreground/70">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mt-16">
        <h2 className="text-2xl font-semibold">{t.contact}</h2>
        <p className="mt-4 text-foreground/60">
          {t.contactSub}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            { label: "Email", href: "mailto:contact@aperivue.com", text: "contact@aperivue.com" },
            { label: "GitHub", href: "https://github.com/aperivue", text: "github.com/aperivue", external: true },
            { label: "YouTube", href: "https://youtube.com/@scrubcode", text: "@scrubcode — Medical AI & Deep Learning", external: true },
            { label: "LinkedIn", href: "https://www.linkedin.com/company/aperivue", text: "Aperivue", external: true },
            { label: "Instagram", href: "https://instagram.com/aperivue", text: "@aperivue", external: true },
            { label: "X (Twitter)", href: "https://x.com/aperivue", text: "@aperivue", external: true },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="text-xs font-medium uppercase tracking-wider text-foreground/40">
                {item.label}
              </h3>
              <a
                href={item.href}
                {...("external" in item && item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="mt-2 block text-sm font-medium text-primary hover:underline"
              >
                {item.text}
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
