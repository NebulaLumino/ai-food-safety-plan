import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 120,
  serverExternalPackages: ['openai'],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;
