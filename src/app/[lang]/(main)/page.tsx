import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, hasLocale, type Locale } from "../dictionaries";
import { notFound } from "next/navigation";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  // title/description/openGraph inherit from the root layout; only canonical + hreflang here.
  return { alternates: buildAlternates(lang, "") };
}

function HeroVisual() {
  return (
    <div className="relative flex items-center justify-center">
      <div
        aria-hidden
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

  return (
    <main className="flex flex-1 flex-col">
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.03); }
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
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
              {t.tagline}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-7xl">
              {t.hero}{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text pb-1 text-transparent">
                {t.heroHighlight}
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-foreground/70">
              {t.descriptionLine1}
              <br />
              {t.descriptionLine2}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`/${lang}/rads`}
                className="rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(30,64,175,0.6)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-10px_rgba(8,145,178,0.55)]"
              >
                {t.ctaRads}
              </Link>
              <a
                href="https://youtube.com/@scrubcode"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-7 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-muted"
              >
                {t.ctaYoutube} &#9654;
              </a>
            </div>
            <p className="mt-8 text-xs text-foreground/40">
              {t.credibility} &middot; 10+ {t.peerReviewed}
            </p>
          </div>
          <div className="hidden md:col-span-2 md:block">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* What We Build */}
      <section className="border-t border-border bg-muted px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight">{t.whatWeBuild}</h2>
          <p className="mt-3 text-foreground/60">{t.whatWeBuildSub}</p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Aperivue RADS */}
            <Link href={`/${lang}/rads`} className="relative col-span-full overflow-hidden rounded-2xl border border-primary/20 bg-surface p-8 transition-shadow hover:shadow-lg md:col-span-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h4l3-7 4 14 3-7h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Aperivue RADS</h3>
                  <span className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent">
                    In Development
                  </span>
                </div>
                <p className="mt-4 max-w-2xl text-foreground/70">{t.radsDesc}</p>
                <div className="mt-6 flex flex-wrap gap-3 text-xs text-foreground/50">
                  {["TI-RADS", "Lung-RADS", "BI-RADS", "LI-RADS", "PI-RADS", "O-RADS", "Structured Reports"].map((tag) => (
                    <span key={tag} className="rounded-full border border-border px-3 py-1">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>

            {/* ScrubCode */}
            <div className="rounded-2xl border border-border bg-surface p-8 transition-shadow hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">ScrubCode</h3>
                <span className="rounded-full bg-green-500/10 px-3 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                  Active
                </span>
              </div>
              <p className="mt-4 text-sm text-foreground/70">{t.scrubcodeDesc}</p>
              <a
                href="https://youtube.com/@scrubcode"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
              >
                Watch on YouTube &rarr;
              </a>
            </div>

            {/* MedGlow */}
            <div className="rounded-2xl border border-border bg-surface p-8 transition-shadow hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">MedGlow</h3>
                <span className="rounded-full bg-foreground/5 px-3 py-0.5 text-xs font-medium text-foreground/50">
                  Coming Soon
                </span>
              </div>
              <p className="mt-4 text-sm text-foreground/70">{t.medglowDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Credibility */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { value: "10+", label: t.peerReviewed },
            { value: "M.D.", label: t.radiologist },
            { value: "AI", label: t.medicalImaging },
            { value: "OSS", label: t.openSource },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-2xl font-bold text-primary md:text-3xl">{item.value}</p>
              <p className="mt-1 text-xs text-foreground/50">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground px-6 py-20 text-background">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold md:text-3xl">{t.followResearch}</h2>
          <p className="mt-4 text-background/60">{t.followSub}</p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href={`/${lang}/blog`}
              className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {t.readBlog}
            </Link>
            <a
              href="https://youtube.com/@scrubcode"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-background/20 px-7 py-3 text-sm font-semibold transition-colors hover:bg-background/10"
            >
              YouTube
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
