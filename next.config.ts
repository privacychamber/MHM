import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/MHM",
  assetPrefix: "/MHM",
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
