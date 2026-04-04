import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-sm text-foreground/60 md:flex-row md:justify-between">
        <p>&copy; {new Date().getFullYear()} Aperivue. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="hover:text-primary">
            Contact
          </Link>
          <a
            href="https://github.com/aperivue"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            GitHub
          </a>
          <a
            href="https://youtube.com/@scrubcode"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            YouTube
          </a>
        </div>
      </div>
    </footer>
  );
}
