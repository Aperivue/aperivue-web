import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Aperivue.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Contact</h1>
      <p className="mt-4 text-foreground/60">
        Have questions or want to collaborate? Reach out below.
      </p>

      <div className="mt-12 space-y-6">
        <div className="rounded-2xl border border-border p-6">
          <h2 className="font-semibold">Email</h2>
          <a
            href="mailto:contact@aperivue.com"
            className="mt-2 block text-primary hover:underline"
          >
            contact@aperivue.com
          </a>
        </div>

        <div className="rounded-2xl border border-border p-6">
          <h2 className="font-semibold">GitHub</h2>
          <a
            href="https://github.com/aperivue"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-primary hover:underline"
          >
            github.com/aperivue
          </a>
        </div>

        <div className="rounded-2xl border border-border p-6">
          <h2 className="font-semibold">YouTube</h2>
          <a
            href="https://youtube.com/@scrubcode"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-primary hover:underline"
          >
            @scrubcode — Medical AI &amp; Deep Learning
          </a>
        </div>

        <div className="rounded-2xl border border-border p-6">
          <h2 className="font-semibold">LinkedIn</h2>
          <a
            href="https://www.linkedin.com/in/eugene8998/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-primary hover:underline"
          >
            Yoojin Nam
          </a>
        </div>

        <div className="rounded-2xl border border-border p-6">
          <h2 className="font-semibold">X (Twitter)</h2>
          <a
            href="https://x.com/aperivue"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-primary hover:underline"
          >
            @aperivue
          </a>
        </div>
      </div>
    </main>
  );
}
