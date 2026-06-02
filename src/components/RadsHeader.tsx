"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AperivueLogo from "./AperivueLogo";

export default function RadsHeader() {
  const pathname = usePathname();
  const lang = pathname.split("/")[1] || "en";

  const radsTabs = [
    { href: `/${lang}/rads/tirads`, label: "TI-RADS" },
    { href: `/${lang}/rads/lungrads`, label: "Lung-RADS" },
    { href: `/${lang}/rads/birads`, label: "BI-RADS" },
    { href: `/${lang}/rads/lirads`, label: "LI-RADS" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Left: Logo → Homepage */}
        <Link href={`/${lang}`} className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <AperivueLogo variant="icon" size="sm" />
          <span className="text-sm font-semibold tracking-tight text-primary">
            aperivue
          </span>
        </Link>

        {/* Right: RADS Tabs + Language */}
        <div className="flex items-center gap-1">
          {radsTabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-colors sm:px-3 sm:text-sm ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/60 hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}

          <div className="mx-1 h-4 w-px bg-border sm:mx-1.5" />

          <Link
            href={pathname.replace(`/${lang}`, `/${lang === "ko" ? "en" : "ko"}`)}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${lang === "ko" ? "en" : "ko"};path=/;max-age=31536000`;
            }}
            className="rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
          >
            {lang === "ko" ? "EN" : "한국어"}
          </Link>
        </div>
      </nav>
    </header>
  );
}
