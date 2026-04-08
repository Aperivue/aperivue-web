"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import AperivueLogo from "./AperivueLogo";

interface NavDict {
  nav: {
    products: string;
    skills: string;
    rads: string;
    blog: string;
    about: string;
  };
}

function LocaleSwitcher({ lang }: { lang: string }) {
  const pathname = usePathname();
  const otherLang = lang === "ko" ? "en" : "ko";
  const otherPath = pathname.replace(`/${lang}`, `/${otherLang}`);

  function handleSwitch() {
    document.cookie = `NEXT_LOCALE=${otherLang};path=/;max-age=31536000`;
  }

  return (
    <Link
      href={otherPath}
      onClick={handleSwitch}
      className="rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
    >
      {lang === "ko" ? "EN" : "한국어"}
    </Link>
  );
}

export default function Header({
  lang,
  dict,
}: {
  lang: string;
  dict: NavDict;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: `/${lang}/products`, label: dict.nav.products },
    { href: `/${lang}/skills`, label: dict.nav.skills },
    { href: `/${lang}/rads`, label: dict.nav.rads },
    { href: `/${lang}/blog`, label: dict.nav.blog },
    { href: `/${lang}/about`, label: dict.nav.about },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={`/${lang}`} className="hover:opacity-80 transition-opacity">
          <AperivueLogo variant="full" size="sm" />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex lg:gap-6">
          <ul className="flex gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <LocaleSwitcher lang={lang} />
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <LocaleSwitcher lang={lang} />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <ul className="border-t border-border px-6 py-4 md:hidden">
          {navLinks.map((link) => (
            <li key={link.href} className="py-2">
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-foreground/70 hover:text-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
