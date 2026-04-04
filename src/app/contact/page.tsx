import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Aperivue.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-widest text-accent">
        Contact
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Get in Touch</h1>
      <p className="mt-4 text-foreground/60">
        Have questions or want to collaborate? Reach out below.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {[
          { label: "Email", href: "mailto:contact@aperivue.com", text: "contact@aperivue.com" },
          { label: "GitHub", href: "https://github.com/aperivue", text: "github.com/aperivue", external: true },
          { label: "YouTube", href: "https://youtube.com/@scrubcode", text: "@scrubcode — Medical AI & Deep Learning", external: true },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/eugene8998/", text: "Yoojin Nam", external: true },
          { label: "X (Twitter)", href: "https://x.com/aperivue", text: "@aperivue", external: true },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-xs font-medium uppercase tracking-wider text-foreground/40">
              {item.label}
            </h2>
            <a
              href={item.href}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="mt-2 block text-sm font-medium text-primary hover:underline"
            >
              {item.text}
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
