import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/MHM",
  assetPrefix: "/MHM",
  trailingSlash: true,
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
