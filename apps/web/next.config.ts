import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@invoice/db", "@invoice/ui"],
};

export default nextConfig;
