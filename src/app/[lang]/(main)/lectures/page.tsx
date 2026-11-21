import type { Metadata } from "next";
import Link from "next/link";
import { getAllLectures, getLectureStats } from "@/lib/lectures";
import { getDictionary, hasLocale, type Locale } from "../../dictionaries";
import { notFound } from "next/navigation";
import { buildAlternates, DEFAULT_OG_IMAGES } from "@/lib/seo";

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
    alternates: buildAlternates(lang, "/lectures"),
    openGraph: {
      title: dict.lectures.title,
      description: dict.lectures.description,
      type: "website",
      url: `https://aperivue.com/${lang}/lectures`,
      siteName: "Aperivue",
      images: DEFAULT_OG_IMAGES,
    },
  };
}

const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Format from the "YYYY-MM-DD" string itself so the server's time zone cannot shift the day.
function formatDate(date: string, lang: string) {
  const [y, m, d] = date.split("-");
  if (!y || !m || !d) return date;
  return lang === "ko"
    ? `${y}. ${Number(m)}. ${Number(d)}.`
    : `${EN_MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`;
}

export default async function LecturesPage({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);
  const t = dict.lectures;
  const lectures = getAllLectures(lang).filter((l) => l.status === "completed");
  const stats = getLectureStats(lang);

  const summary = stats
    ? (stats.invited > 0 ? t.summaryInvited : t.summary)
        .replace("{year}", stats.year)
        .replace("{count}", String(stats.sessions))
        .replace("{invited}", String(stats.invited))
    : null;

  const contactHref = `/${lang}/about#contact`;
  const linkClass =
    "font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary";

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t.title}</h1>
      <p className="mt-4 break-keep text-lg leading-relaxed text-foreground/80">
        {t.description}
      </p>
      {summary && <p className="mt-3 text-foreground/80">{summary}</p>}
      <p className="mt-4">
        <Link href={contactHref} className={linkClass}>
          {t.proposeContact} &rarr;
        </Link>
      </p>

      {lectures.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">{t.pastLectures}</h2>
          <ul className="mt-4 border-t border-border">
            {lectures.map((l) => (
              <li key={l.slug} className="border-b border-border">
                <Link
                  href={`/${lang}/lectures/${l.slug}`}
                  className="group flex flex-col gap-1 py-4 md:flex-row md:gap-6"
                >
                  <span className="shrink-0 text-sm text-foreground/60 tabular-nums md:w-28 md:pt-0.5">
                    {formatDate(l.date, lang)}
                  </span>
                  <span className="shrink-0 text-sm text-foreground/60 md:w-48 md:pt-0.5">
                    {l.institution}
                  </span>
                  <span className="break-keep font-medium text-foreground underline decoration-border underline-offset-4 group-hover:text-primary group-hover:decoration-primary">
                    {l.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight">{t.workshopTitle}</h2>
        <ul className="mt-4 space-y-4">
          {[
            { t: t.learn1Title, d: t.learn1Desc },
            { t: t.learn2Title, d: t.learn2Desc },
            { t: t.learn3Title, d: t.learn3Desc },
          ].map((item) => (
            <li key={item.t}>
              <p className="font-medium">{item.t}</p>
              <p className="mt-1 break-keep text-foreground/80">{item.d}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 break-keep text-foreground/80">
          <span className="font-medium text-foreground">{t.format}.</span> {t.formatDesc}
        </p>
      </section>

      <section className="mt-16 border-t border-border pt-10">
        <h2 className="text-xl font-semibold tracking-tight">{t.proposeTitle}</h2>
        <p className="mt-3 break-keep text-foreground/80">{t.proposeDesc}</p>
        <p className="mt-4">
          <Link href={contactHref} className={linkClass}>
            {t.proposeContact} &rarr;
          </Link>
        </p>
      </section>
    </main>
  );
}
