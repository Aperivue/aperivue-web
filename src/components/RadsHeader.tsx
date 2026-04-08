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
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Left: Logo + RADS */}
        <Link href={`/${lang}/rads`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <AperivueLogo variant="icon" size="sm" />
          <span className="text-sm font-semibold tracking-tight">
            <span className="text-primary">Aperivue</span>{" "}
            <span className="text-foreground/70">RADS</span>
          </span>
        </Link>

        {/* Right: Tabs + Home link */}
        <div className="flex items-center gap-1">
          {radsTabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/60 hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}

          <div className="mx-1.5 h-4 w-px bg-border" />

          <Link
            href={`/${lang}`}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
          >
            aperivue.com
          </Link>
        </div>
      </nav>
    </header>
  );
}
