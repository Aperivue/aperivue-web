import type { Metadata } from "next";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";
import ContentKo from "./content.ko";
import ContentEn from "./content.en";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: "Customize — MedSci Skills Guide",
    description:
      "Learn how to modify existing skills or create your own custom skills from scratch.",
    alternates: buildAlternates(lang, "/skills/guide/customize"),
  };
}

export default async function CustomizePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return lang === "ko" ? <ContentKo lang={lang} /> : <ContentEn lang={lang} />;
}
