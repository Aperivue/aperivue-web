import Link from "next/link";
import AperivueLogo from "./AperivueLogo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <AperivueLogo variant="full" size="sm" />
            <p className="text-sm text-foreground/50">
              Opening what cannot be seen.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16 text-sm text-foreground/60">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-foreground/40">
                Company
              </span>
              <Link href="/about" className="hover:text-primary">About</Link>
              <Link href="/products" className="hover:text-primary">Products</Link>
              <Link href="/blog" className="hover:text-primary">Blog</Link>
              <Link href="/contact" className="hover:text-primary">Contact</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-foreground/40">
                Social
              </span>
              <a href="https://github.com/aperivue" target="_blank" rel="noopener noreferrer" className="hover:text-primary">GitHub</a>
              <a href="https://youtube.com/@scrubcode" target="_blank" rel="noopener noreferrer" className="hover:text-primary">YouTube</a>
              <a href="https://www.linkedin.com/in/eugene8998/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">LinkedIn</a>
              <a href="https://x.com/aperivue" target="_blank" rel="noopener noreferrer" className="hover:text-primary">X</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-border pt-6 text-xs text-foreground/40">
          <p>&copy; {new Date().getFullYear()} Aperivue. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
