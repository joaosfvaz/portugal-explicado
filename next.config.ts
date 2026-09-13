import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages read tax files and data snapshots from disk at request time.
  outputFileTracingIncludes: {
    "/*": ["./data/tax/**/*.json", "./data/snapshots/**/*.json"],
  },
};

export default nextConfig;
