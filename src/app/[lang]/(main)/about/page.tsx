import type { Metadata } from "next";
import Image from "next/image";
import { getDictionary, hasLocale, type Locale } from "../../dictionaries";
import { notFound } from "next/navigation";
import { buildAlternates } from "@/lib/seo";
import { SOCIAL_LINKS, externalProps } from "@/lib/social";

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
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
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
        <h2 className="text-2xl font-semibold">{t.recognition}</h2>
        <div className="mt-6">
          <p className="font-semibold">{t.awardTitle}</p>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80">{t.awardDetail}</p>
        </div>
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
            { year: "2026", text: "KCR 2026 — KSR Most-Cited KJR Paper Award" },
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
        <dl className="mt-6 border-t border-border">
          {SOCIAL_LINKS.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-1 border-b border-border py-3 sm:flex-row sm:gap-6"
            >
              <dt className="text-sm text-foreground/60 sm:w-24 sm:pt-0.5">{item.label}</dt>
              <dd>
                <a
                  href={item.href}
                  {...(item.external ? externalProps : {})}
                  className="font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
                >
                  {item.text}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
