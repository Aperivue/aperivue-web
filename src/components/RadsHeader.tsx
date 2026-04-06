"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AperivueLogo from "./AperivueLogo";

const radsTabs = [
  { href: "/rads/tirads", label: "TI-RADS" },
  { href: "/rads/lungrads", label: "Lung-RADS" },
];

export default function RadsHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        {/* Left: Logo + RADS */}
        <Link href="/rads" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <AperivueLogo variant="icon" size="sm" />
          <span className="text-sm font-semibold tracking-tight">
            <span className="text-primary">Aperivue</span>{" "}
            <span className="text-foreground/70">RADS</span>
          </span>
        </Link>

        {/* Right: Tabs */}
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
        </div>
      </nav>
    </header>
  );
}
