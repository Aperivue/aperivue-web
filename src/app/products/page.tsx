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

export default function ProductsPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-1 flex-col px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Products</h1>
      <p className="mt-4 text-foreground/60">
        Tools and content for medical professionals.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.name}
            className="flex flex-col rounded-2xl border border-border p-6 transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  product.status === "Active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : product.status === "In Development"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {product.status}
              </span>
            </div>
            <p className="mt-3 flex-1 text-sm text-foreground/70">
              {product.description}
            </p>
            <ul className="mt-4 space-y-1">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground/60">
                  <span className="mt-1 text-primary">&#x2713;</span>
                  {f}
                </li>
              ))}
            </ul>
            {product.link && (
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
              >
                Visit &rarr;
              </a>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
