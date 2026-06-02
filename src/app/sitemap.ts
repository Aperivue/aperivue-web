import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/blog";
import { getAllLectureSlugs } from "@/lib/lectures";

const BASE_URL = "https://aperivue.com";
const locales = ["en", "ko"];

export default function sitemap(): MetadataRoute.Sitemap {
  const postSlugs = getAllPostSlugs();
  const lectureSlugs = getAllLectureSlugs();

  const staticPages = [
    { path: "", priority: 1, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/products", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/skills", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/skills/guide", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/lectures", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/rads", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/rads/tirads", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/rads/lungrads", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/rads/birads", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/rads/lirads", priority: 0.9, changeFrequency: "monthly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}${page.path}`])
          ),
        },
      });
    }

    for (const slug of postSlugs) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/blog/${slug}`])
          ),
        },
      });
    }

    for (const slug of lectureSlugs) {
      entries.push({
        url: `${BASE_URL}/${locale}/lectures/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${BASE_URL}/${l}/lectures/${slug}`])
          ),
        },
      });
    }
  }

  return entries;
}
