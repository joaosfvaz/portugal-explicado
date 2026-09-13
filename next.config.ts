import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/site";

const nextConfig: NextConfig = {
  // Static HTML in out/, published on GitHub Pages. Pages read tax files and data snapshots at build time.
  output: "export",
  basePath: BASE_PATH,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
