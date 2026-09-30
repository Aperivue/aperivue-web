import type { NextConfig } from "next";

/**
 * Skill pages renamed in medsci-skills v6.0.0 (its MIGRATION-v6.md). The repo keeps the old
 * names as aliases only until v7, so this list lives here instead of being derived from the
 * catalog snapshot: old links and search results must keep resolving after the aliases are gone.
 */
const RENAMED_SKILLS: Record<string, string> = {
  "architecture-zoo": "model-selection",
  "model-sourcing": "model-selection",
  "profile-imaging": "imaging-data",
  "preprocess-imaging": "imaging-data",
  "model-evaluation": "model-assessment",
  "model-validation": "model-assessment",
  "uncertainty-imaging": "model-assessment",
  explainability: "model-assessment",
};

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aperivue.com" }],
        destination: "https://aperivue.com/:path*",
        permanent: true,
      },
      {
        source: "/guide/:path*",
        destination: "/skills/guide/:path*",
        permanent: true,
      },
      {
        source: "/guide",
        destination: "/skills/guide",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/about#contact",
        permanent: true,
      },
      ...Object.entries(RENAMED_SKILLS).map(([from, to]) => ({
        source: `/:lang(en|ko)/skills/${from}`,
        destination: `/:lang/skills/${to}`,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
