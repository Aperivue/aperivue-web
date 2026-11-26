import Link from "next/link";
import AperivueLogo from "./AperivueLogo";
import { SOCIAL_LINKS, externalProps } from "@/lib/social";

interface FooterDict {
  nav: {
    tools: string;
    lectures: string;
    blog: string;
    about: string;
  };
  footer: { tagline: string; privacy: string };
}

export default function Footer({
  lang,
  dict,
}: {
  lang: string;
  dict: FooterDict;
}) {
  const siteLinks = [
    { href: `/${lang}/products`, label: dict.nav.tools },
    { href: `/${lang}/lectures`, label: dict.nav.lectures },
    { href: `/${lang}/blog`, label: dict.nav.blog },
    { href: `/${lang}/about`, label: dict.nav.about },
  ];

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-3">
            <AperivueLogo variant="full" size="sm" />
            <p className="text-sm text-foreground/60">{dict.footer.tagline}</p>
          </div>

          <div className="flex gap-16 text-sm text-foreground/70">
            <ul className="flex flex-col gap-2">
              {siteLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-primary hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-2">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    {...(s.external ? externalProps : {})}
                    className="hover:text-primary hover:underline"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 text-xs text-foreground/60">
          <p>&copy; {new Date().getFullYear()} Aperivue. All rights reserved.</p>
          <Link href={`/${lang}/privacy`} className="hover:text-primary hover:underline">
            {dict.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
