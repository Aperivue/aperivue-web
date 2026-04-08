"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { href: "/guide", label: "시작하기" },
  { href: "/guide/install", label: "1. 설치" },
  { href: "/guide/first-pipeline", label: "2. 첫 파이프라인" },
  { href: "/guide/skills", label: "3. 스킬 안내" },
  { href: "/guide/customize", label: "4. 커스터마이즈" },
  { href: "/guide/faq", label: "FAQ" },
];

export default function GuideNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-border pb-4 md:flex-col md:border-b-0 md:border-r md:pr-6 md:pb-0">
      {sections.map((section) => {
        const isActive = pathname === section.href;
        return (
          <Link
            key={section.href}
            href={section.href}
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
