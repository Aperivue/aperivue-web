import type { Metadata } from "next";
import Link from "next/link";
import { getAllLectures } from "@/lib/lectures";
import { getDictionary, hasLocale, type Locale } from "../../dictionaries";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang as Locale);
  return {
    title: dict.lectures.title,
    description: dict.lectures.description,
    openGraph: {
      title: dict.lectures.title,
      description: dict.lectures.description,
      type: "website",
      url: `https://aperivue.com/${lang}/lectures`,
      siteName: "Aperivue",
    },
  };
}

function formatDate(date: string, lang: string) {
  const d = new Date(date);
  return d.toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function LecturesPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const all = getAllLectures();
  const completed = all.filter((l) => l.status === "completed");
  const upcoming = all.filter((l) => l.status === "upcoming");

  const contactHref = `/${lang}/about#contact`;

  return (
    <main className="mx-auto flex max-w-5xl flex-1 flex-col px-6 py-16">
      {/* Hero */}
      <section className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          {dict.lectures.tagline}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
          {dict.lectures.title}
        </h1>
        <p className="mt-5 text-lg text-foreground/70">
          {dict.lectures.description}
        </p>
        <div className="mt-6">
          <Link
            href={contactHref}
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {dict.lectures.proposeContact} →
          </Link>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {dict.lectures.whatYouLearn}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              t: dict.lectures.learn1Title,
              d: dict.lectures.learn1Desc,
            },
            {
              t: dict.lectures.learn2Title,
              d: dict.lectures.learn2Desc,
            },
            {
              t: dict.lectures.learn3Title,
              d: dict.lectures.learn3Desc,
            },
          ].map((item) => (
            <div
              key={item.t}
              className="rounded-2xl border border-border p-6"
            >
              <h3 className="text-lg font-semibold">{item.t}</h3>
              <p className="mt-3 text-sm text-foreground/70">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Format */}
      <section className="mt-16 rounded-2xl bg-muted/40 p-8">
        <h2 className="text-xl font-bold tracking-tight">
          {dict.lectures.format}
        </h2>
        <p className="mt-3 text-foreground/70">{dict.lectures.formatDesc}</p>
      </section>

      {/* Past lectures */}
      {completed.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {dict.lectures.pastLectures}
          </h2>
          <div className="mt-8 space-y-6">
            {completed.map((l) => (
              <article
                key={l.slug}
                className="rounded-2xl border border-border p-6 transition-shadow hover:shadow-lg"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/50">
                  <time>{formatDate(l.date, lang)}</time>
                  <span>•</span>
                  <span>{l.institution}</span>
                  {l.department && (
                    <>
                      <span>•</span>
                      <span>{l.department}</span>
                    </>
                  )}
                  {l.participantsCount && (
                    <>
                      <span>•</span>
                      <span>
                        {l.participantsCount} {dict.lectures.participants}
                      </span>
                    </>
                  )}
                </div>
                <Link href={`/${lang}/lectures/${l.slug}`}>
                  <h3 className="mt-3 text-xl font-semibold hover:text-primary">
                    {l.title}
                  </h3>
                </Link>
                <p className="mt-3 text-sm text-foreground/70">
                  {l.description}
                </p>
                {l.testimonials && l.testimonials.length > 0 && (
                  <div className="mt-5 border-l-2 border-primary/40 pl-4">
                    <p className="text-sm italic text-foreground/80">
                      “{l.testimonials[0].quote}”
                    </p>
                    {l.testimonials[0].attribution && (
                      <p className="mt-1 text-xs text-foreground/50">
                        — {l.testimonials[0].attribution}
                      </p>
                    )}
                  </div>
                )}
                <div className="mt-5">
                  <Link
                    href={`/${lang}/lectures/${l.slug}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {dict.lectures.readRecap} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            {dict.lectures.upcomingLectures}
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {upcoming.map((l) => (
              <article
                key={l.slug}
                className="rounded-2xl border border-dashed border-border p-6"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/50">
                  <time>{formatDate(l.date, lang)}</time>
                  <span>•</span>
                  <span>{l.institution}</span>
                </div>
                <Link href={`/${lang}/lectures/${l.slug}`}>
                  <h3 className="mt-3 text-lg font-semibold hover:text-primary">
                    {l.title}
                  </h3>
                </Link>
                <p className="mt-3 text-sm text-foreground/70">
                  {l.description}
                </p>
                <div className="mt-4">
                  <Link
                    href={`/${lang}/lectures/${l.slug}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {dict.lectures.lectureDetails} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Propose CTA */}
      <section className="mt-20 rounded-3xl border border-primary/20 bg-primary/5 p-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {dict.lectures.proposeTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-foreground/70">
          {dict.lectures.proposeDesc}
        </p>
        <div className="mt-6">
          <Link
            href={contactHref}
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {dict.lectures.proposeContact} →
          </Link>
        </div>
      </section>
    </main>
  );
}
