import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary, hasLocale, type Locale } from "../dictionaries";
import { notFound } from "next/navigation";

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang as Locale);

  return (
    <>
      <Header lang={lang} dict={dict} />
      {children}
      <Footer lang={lang} dict={dict} />
    </>
  );
}
