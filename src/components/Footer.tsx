import Link from "next/link";
import AperivueLogo from "./AperivueLogo";

interface FooterDict {
  nav: {
    products: string;
    skills: string;
    blog: string;
    lectures: string;
    about: string;
  };
  footer: { tagline: string; company: string };
  about: { contact: string };
}

export default function Footer({
  lang,
  dict,
}: {
  lang: string;
  dict: FooterDict;
}) {
  return (
    <footer className="mt-auto border-t border-border bg-muted">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <AperivueLogo variant="full" size="sm" />
            <p className="text-sm text-foreground/50">
              {dict.footer.tagline}
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16 text-sm text-foreground/60">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                {dict.footer.company}
              </span>
              <Link href={`/${lang}/about`} className="hover:text-primary">{dict.nav.about}</Link>
              <Link href={`/${lang}/products`} className="hover:text-primary">{dict.nav.products}</Link>
              <Link href={`/${lang}/blog`} className="hover:text-primary">{dict.nav.blog}</Link>
              <Link href={`/${lang}/lectures`} className="hover:text-primary">{dict.nav.lectures}</Link>
              <Link href={`/${lang}/about#contact`} className="hover:text-primary">{dict.about.contact}</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-foreground/60">
                Social
              </span>
              <a href="https://github.com/aperivue" target="_blank" rel="noopener noreferrer" className="hover:text-primary">GitHub</a>
              <a href="https://youtube.com/@scrubcode" target="_blank" rel="noopener noreferrer" className="hover:text-primary">YouTube</a>
              <a href="https://www.linkedin.com/company/aperivue" target="_blank" rel="noopener noreferrer" className="hover:text-primary">LinkedIn</a>
              <a href="https://instagram.com/aperivue" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Instagram</a>
              <a href="https://x.com/aperivue" target="_blank" rel="noopener noreferrer" className="hover:text-primary">X</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-border pt-6 text-xs text-foreground/60">
          <p>&copy; {new Date().getFullYear()} Aperivue. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
