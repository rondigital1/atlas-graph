import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@atlas-graph/agent",
    "@atlas-graph/config",
    "@atlas-graph/core",
    "@atlas-graph/db",
  ],
};

export default nextConfig;
