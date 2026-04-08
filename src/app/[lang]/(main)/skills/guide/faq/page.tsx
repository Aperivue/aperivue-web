import type { Metadata } from "next";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";
import FaqContentKo from "./content.ko";
import FaqContentEn from "./content.en";

export const metadata: Metadata = {
  title: "FAQ — MedSci Skills Guide",
  description:
    "Frequently asked questions about MedSci Skills. Subscriptions, security, language support, compatibility.",
};

export default async function FaqPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return lang === "ko" ? (
    <FaqContentKo lang={lang} />
  ) : (
    <FaqContentEn lang={lang} />
  );
}
