import type { Metadata } from "next";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";
import GuideContentKo from "./content.ko";
import GuideContentEn from "./content.en";

export const metadata: Metadata = {
  title: "Getting Started Guide — MedSci Skills",
  description:
    "Step-by-step guide for clinician researchers: install MedSci Skills and run your first research pipeline in 15 minutes.",
};

export default async function GuideLanding({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return lang === "ko" ? (
    <GuideContentKo lang={lang} />
  ) : (
    <GuideContentEn lang={lang} />
  );
}
