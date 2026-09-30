import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["@puls/ui", "@puls/database"],
  outputFileTracingRoot: path.join(process.cwd(), "../.."),
  outputFileTracingIncludes: {
    "/*": ["../../packages/database/generated/client/**/*"],
  },
};

export default nextConfig;
