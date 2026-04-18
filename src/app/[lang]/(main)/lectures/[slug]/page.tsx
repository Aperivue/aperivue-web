import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllLectures, getLectureBySlug } from "@/lib/lectures";
import { getDictionary, hasLocale, type Locale } from "../../../dictionaries";
import { MDXContent } from "@/components/MDXContent";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateStaticParams() {
  const lectures = getAllLectures();
  return lectures.flatMap((l) => [
    { lang: "en", slug: l.slug },
    { lang: "ko", slug: l.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const lecture = getLectureBySlug(slug);
  if (!lecture) return {};
  return {
    title: lecture.title,
    description: lecture.description,
    keywords: lecture.tags,
    openGraph: {
      title: lecture.title,
      description: lecture.description,
      type: "article",
      publishedTime: new Date(lecture.date).toISOString(),
      tags: lecture.tags,
      siteName: "Aperivue",
      url: `https://aperivue.com/${lang}/lectures/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: lecture.title,
      description: lecture.description,
    },
  };
}

function formatDate(date: string, lang: string) {
  const d = new Date(date);
  return d.toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function LectureDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const lecture = getLectureBySlug(slug);
  if (!lecture) notFound();
  const dict = await getDictionary(lang as Locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: lecture.title,
    description: lecture.description,
    startDate: new Date(lecture.date).toISOString(),
    eventStatus:
      lecture.status === "completed"
        ? "https://schema.org/EventScheduled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: lecture.institution,
      address: lecture.locationCity ?? "",
    },
    organizer: {
      "@type": "Organization",
      name: "Aperivue",
      url: "https://aperivue.com",
    },
    performer: {
      "@type": "Person",
      name: "Yoojin Nam",
      url: "https://aperivue.com/about",
    },
  };

  const contactHref = `/${lang}/about#contact`;

  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-6 text-sm">
        <Link
          href={`/${lang}/lectures`}
          className="text-foreground/60 hover:text-primary"
        >
          ← {dict.lectures.title}
        </Link>
      </div>

      <article>
        <header>
          <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/50">
            <time>{formatDate(lecture.date, lang)}</time>
            <span>•</span>
            <span>{lecture.institution}</span>
            {lecture.department && (
              <>
                <span>•</span>
                <span>{lecture.department}</span>
              </>
            )}
            {lecture.status === "upcoming" && (
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                {dict.lectures.upcomingLectures}
              </span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            {lecture.title}
          </h1>
          <p className="mt-4 text-lg text-foreground/70">
            {lecture.description}
          </p>
          {lecture.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {lecture.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-zinc mt-10 max-w-none dark:prose-invert">
          <MDXContent source={lecture.content} />
        </div>

        {lecture.testimonials && lecture.testimonials.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold tracking-tight">
              {dict.lectures.testimonials}
            </h2>
            <div className="mt-6 space-y-4">
              {lecture.testimonials.map((t, i) => (
                <blockquote
                  key={i}
                  className="rounded-2xl border border-border bg-muted/30 p-6"
                >
                  <p className="italic text-foreground/80">“{t.quote}”</p>
                  {t.attribution && (
                    <footer className="mt-2 text-sm text-foreground/50">
                      — {t.attribution}
                    </footer>
                  )}
                </blockquote>
              ))}
            </div>
          </section>
        )}
      </article>

      <section className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <h2 className="text-xl font-bold tracking-tight">
          {dict.lectures.proposeTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-foreground/70">
          {dict.lectures.proposeDesc}
        </p>
        <div className="mt-5">
          <Link
            href={contactHref}
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {dict.lectures.proposeContact} →
          </Link>
        </div>
      </section>
    </main>
  );
}
