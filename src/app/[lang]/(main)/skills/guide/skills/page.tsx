import type { Metadata } from "next";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";
import ContentKo from "./content.ko";
import ContentEn from "./content.en";

export const metadata: Metadata = {
  title: "Skills by Situation — MedSci Skills Guide",
  description:
    "Find the right MedSci Skill for your research stage. From topic exploration and data analysis to paper writing and revision response.",
};

export default async function SkillsGuidePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return lang === "ko" ? <ContentKo lang={lang} /> : <ContentEn lang={lang} />;
}
