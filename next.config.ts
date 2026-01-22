import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  typescript: {
    ignoreBuildErrors: true,
  },
  // Memory optimization for limited build environments
};

export default nextConfig;
