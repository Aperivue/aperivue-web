import type { Metadata } from "next";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";
import ContentKo from "./content.ko";
import ContentEn from "./content.en";

export const metadata: Metadata = {
  title: "Customize — MedSci Skills Guide",
  description:
    "Learn how to modify existing skills or create your own custom skills from scratch.",
};

export default async function CustomizePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return lang === "ko" ? <ContentKo lang={lang} /> : <ContentEn lang={lang} />;
}
