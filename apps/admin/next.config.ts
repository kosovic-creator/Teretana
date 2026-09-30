import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@puls/ui", "@puls/database"],
};

export default nextConfig;
