"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const baseSections = [
  { path: "/skills/guide", label: "시작하기" },
  { path: "/skills/guide/install", label: "1. 설치" },
  { path: "/skills/guide/first-pipeline", label: "2. 첫 파이프라인" },
  { path: "/skills/guide/skills", label: "3. 스킬 안내" },
  { path: "/skills/guide/customize", label: "4. 커스터마이즈" },
  { path: "/skills/guide/faq", label: "FAQ" },
];

export default function GuideNav() {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  return (
    <nav className="scrollbar-hide flex gap-2 overflow-x-auto border-b border-border pb-4 md:flex-col md:border-b-0 md:border-r md:pr-6 md:pb-0">
      {baseSections.map((section) => {
        const href = `/${lang}${section.path}`;
        const isActive = pathname === href;
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
            {section.label}
          </Link>
        );
      })}
    </nav>
  );
}
