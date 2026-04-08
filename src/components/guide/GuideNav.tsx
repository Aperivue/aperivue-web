"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const baseSections = [
  { path: "/skills/guide", en: "Getting Started", ko: "시작하기", koShort: "시작" },
  { path: "/skills/guide/install", en: "1. Installation", ko: "1. 설치", koShort: "1. 설치" },
  { path: "/skills/guide/first-pipeline", en: "2. First Pipeline", ko: "2. 첫 파이프라인", koShort: "2. 파이프라인" },
  { path: "/skills/guide/skills", en: "3. Skills Guide", ko: "3. 스킬 안내", koShort: "3. 스킬" },
  { path: "/skills/guide/customize", en: "4. Customize", ko: "4. 커스터마이즈", koShort: "4. 커스텀" },
  { path: "/skills/guide/faq", en: "FAQ", ko: "FAQ", koShort: "FAQ" },
];

export default function GuideNav() {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  return (
    <nav className="scrollbar-hide flex gap-2 overflow-x-auto border-b border-border pb-4 pr-4 md:flex-col md:border-b-0 md:border-r md:pr-6 md:pb-0">
      {baseSections.map((section) => {
        const href = `/${lang}${section.path}`;
        const isActive = pathname === href;
        const label = lang === "ko" ? section.ko : section.en;
        const shortLabel = lang === "ko" ? section.koShort : section.en;
        return (
          <Link
            key={section.path}
            href={href}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-foreground/50 hover:bg-muted hover:text-foreground/70"
            }`}
          >
            <span className="md:hidden">{shortLabel}</span>
            <span className="hidden md:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
