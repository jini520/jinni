import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@jejinni/ui', '@jejinni/types'],
  eslint: {
    ignoreDuringBuilds: false,
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;
