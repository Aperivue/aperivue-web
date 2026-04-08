import type { NextConfig } from "next";

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
    ];
  },
};

export default nextConfig;
