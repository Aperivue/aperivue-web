import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, hasLocale, type Locale } from "../dictionaries";
import { notFound } from "next/navigation";
import { buildAlternates, SKILL_COUNT } from "@/lib/seo";
import { RADS_REGISTRY } from "@/lib/rads/registry";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  // title/description/openGraph inherit from the root layout; only canonical + hreflang here.
  return { alternates: buildAlternates(lang, "") };
}

/** Organ each calculator covers, shown under its name on the home grid. */
const RADS_ORGAN: Record<string, { ko: string; en: string }> = {
  tirads: { ko: "갑상선 초음파", en: "Thyroid US" },
  lungrads: { ko: "폐암 검진 CT", en: "Lung screening CT" },
  birads: { ko: "유방 영상", en: "Breast imaging" },
  lirads: { ko: "간 CT·MRI", en: "Liver CT/MRI" },
  pirads: { ko: "전립선 MRI", en: "Prostate MRI" },
  orads: { ko: "난소·부속기", en: "Ovary/adnexa" },
};

function HeroVisual() {
  return (
    <div className="relative flex items-center justify-center" aria-hidden>
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(closest-side, rgba(8,145,178,0.18), rgba(30,64,175,0.08) 45%, transparent 75%)",
          filter: "blur(12px)",
        }}
      />
      <div className="relative h-64 w-64 md:h-80 md:w-80">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/20"
            style={{
              margin: `${i * 28}px`,
              animation: `pulse-ring ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent opacity-80 blur-md" />
          <div className="absolute h-4 w-4 rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_0_20px_rgba(8,145,178,0.6)]" />
        </div>
      </div>
    </div>
  );
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = (await getDictionary(lang as Locale)).home;
  const loc = lang === "ko" ? "ko" : "en";

  const facts = [
    { value: String(RADS_REGISTRY.length), label: t.factCalculators },
    { value: String(SKILL_COUNT), label: t.factSkills },
    { value: t.factFreeValue, label: t.factFree },
  ];

  return (
    <main className="flex flex-1 flex-col">
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.03); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="pulse-ring"] { animation: none !important; }
        }
      `}</style>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px]"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 0%, rgba(30,64,175,0.08), transparent 70%)",
          }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-5">
          <div className="md:col-span-3">
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-7xl">
              {t.hero}{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text pb-1 text-transparent">
                {t.heroHighlight}
              </span>
            </h1>
            <p className="mt-6 max-w-xl break-keep text-lg leading-relaxed text-foreground/70">
              {t.intro}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`/${lang}/rads`}
                className="rounded-full bg-gradient-to-r from-primary to-accent-text px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(30,64,175,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-10px_rgba(8,145,178,0.55)]"
              >
                {t.ctaRads}
              </Link>
              <Link
                href={`/${lang}/skills`}
                className="rounded-full border border-border px-7 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted"
              >
                {t.ctaSkills}
              </Link>
            </div>
          </div>
          <div className="hidden md:col-span-2 md:block">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="border-t border-border bg-muted px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight">{t.toolsTitle}</h2>
          <p className="mt-3 break-keep text-foreground/70">{t.toolsSub}</p>

          {/* RADS: one tile per calculator */}
          <div className="mt-12 rounded-2xl border border-primary/20 bg-surface p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-xl font-semibold">{t.radsTitle}</h3>
              <Link
                href={`/${lang}/rads`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {t.radsAll} &rarr;
              </Link>
            </div>
            <p className="mt-3 max-w-2xl break-keep text-foreground/70">{t.radsDesc}</p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {RADS_REGISTRY.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${lang}/rads/${r.slug}`}
                  className="group rounded-xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <p className="font-semibold group-hover:text-primary">{r.name}</p>
                  <p className="mt-1 text-xs text-foreground/60">
                    {RADS_ORGAN[r.slug]?.[loc] ?? ""}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* medsci-skills */}
          <Link
            href={`/${lang}/skills`}
            className="mt-6 block rounded-2xl border border-border bg-surface p-8 transition-shadow hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold">medsci-skills</h3>
            <p className="mt-3 max-w-2xl break-keep text-foreground/70">
              {t.skillsDesc.replace("{count}", String(SKILL_COUNT))}
            </p>
            <p className="mt-6 text-sm font-medium text-primary">{t.skillsLink} &rarr;</p>
          </Link>
        </div>
      </section>

      {/* Facts */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-6">
          {facts.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-2xl font-bold text-primary md:text-3xl">{item.value}</p>
              <p className="mt-1 text-xs text-foreground/60">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground px-6 py-20 text-background">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold md:text-3xl">{t.ctaTitle}</h2>
          <p className="mt-4 break-keep text-background/70">{t.ctaSub}</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href={`/${lang}/blog`}
              className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {t.readBlog}
            </Link>
            <a
              href="https://github.com/Aperivue/medsci-skills"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-background/20 px-7 py-3 text-sm font-semibold transition-colors hover:bg-background/10"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
