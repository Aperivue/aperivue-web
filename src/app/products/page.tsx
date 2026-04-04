import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
  description: "Aperivue products — RADS Tool for structured radiology reporting.",
};

const products = [
  {
    name: "RADS Tool",
    status: "In Development",
    description:
      "Unified scoring calculator for TI-RADS, BI-RADS, Lung-RADS, LI-RADS, and more. Generate structured radiology reports with evidence-based recommendations.",
    features: [
      "Multi-system RADS scoring in one interface",
      "Structured report generation",
      "Evidence-based management recommendations",
      "Web, desktop, and mobile (planned)",
    ],
    link: "/rads/tirads",
  },
  {
    name: "ScrubCode",
    status: "Active",
    description:
      "YouTube channel covering Medical AI papers and deep learning foundations. AI-generated visuals with expert-curated scripts.",
    features: [
      "Medical AI paper breakdowns",
      "Deep learning fundamentals",
      "Weekly long-form + clips",
    ],
    link: "https://youtube.com/@scrubcode",
  },
  {
    name: "MedGlow",
    status: "Coming Soon",
    description:
      "K-beauty meets dermatology science. Evidence-based skincare content for Korean and global audiences.",
    features: [
      "Dermatology science explainers",
      "Korean + English subtitles",
      "Ingredient deep-dives",
    ],
  },
];

function statusBadge(status: string) {
  if (status === "Active")
    return "bg-green-500/10 text-green-600 dark:text-green-400";
  if (status === "In Development")
    return "bg-accent/10 text-accent";
  return "bg-foreground/5 text-foreground/50";
}

export default function ProductsPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-1 flex-col px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-widest text-accent">
        Products
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
        What We Build
      </h1>
      <p className="mt-4 text-foreground/60">
        Tools and content that bridge the gap between AI research and clinical practice.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.name}
            className="flex flex-col rounded-2xl border border-border bg-surface p-8 transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <span
                className={`rounded-full px-3 py-0.5 text-xs font-medium ${statusBadge(product.status)}`}
              >
                {product.status}
              </span>
            </div>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/70">
              {product.description}
            </p>
            <ul className="mt-5 space-y-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground/60">
                  <span className="mt-0.5 text-primary">&#x2713;</span>
                  {f}
                </li>
              ))}
            </ul>
            {product.link && (
              product.link.startsWith("/") ? (
                <Link
                  href={product.link}
                  className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Try it &rarr;
                </Link>
              ) : (
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
                >
                  Visit &rarr;
                </a>
              )
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
