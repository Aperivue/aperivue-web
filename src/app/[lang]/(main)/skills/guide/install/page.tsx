import type { Metadata } from "next";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";
import InstallContentKo from "./content.ko";
import InstallContentEn from "./content.en";

export const metadata: Metadata = {
  title: "Installation Guide — Claude Code Desktop + MedSci Skills",
  description:
    "Step-by-step guide: install Claude Code Desktop and 20 MedSci Skills. No terminal needed.",
};

export default async function InstallPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return lang === "ko" ? (
    <InstallContentKo lang={lang} />
  ) : (
    <InstallContentEn lang={lang} />
  );
}
