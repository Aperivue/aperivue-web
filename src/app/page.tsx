import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center md:py-32">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Smarter Tools for{" "}
          <span className="text-primary">Medical Imaging</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-foreground/70">
          Aperivue builds AI-powered diagnostic tools and educational content
          for radiologists and healthcare professionals.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/products"
            className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Explore Products
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Read Blog
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">RADS Scoring</h3>
            <p className="mt-2 text-sm text-foreground/60">
              Unified TI-RADS, BI-RADS, and Lung-RADS calculator for
              structured radiology reporting.
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">AI Research</h3>
            <p className="mt-2 text-sm text-foreground/60">
              Developing and validating AI models for diagnostic accuracy
              in medical imaging.
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Education</h3>
            <p className="mt-2 text-sm text-foreground/60">
              Medical AI content on YouTube and blog — bridging the gap
              between research and practice.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-2xl font-bold md:text-3xl">Stay Updated</h2>
        <p className="mt-4 text-foreground/60">
          Follow our research and product updates on the blog.
        </p>
        <Link
          href="/blog"
          className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Visit Blog
        </Link>
      </section>
    </main>
  );
}
