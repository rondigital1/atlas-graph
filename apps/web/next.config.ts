import { config as loadDotEnv } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const webDirectory = dirname(fileURLToPath(import.meta.url));

// Load the monorepo root env so app routes can access shared server config.
loadDotEnv({ path: resolve(webDirectory, "../../.env") });
loadDotEnv({ path: resolve(webDirectory, "../../.env.local"), override: true });

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@atlas-graph/agent",
    "@atlas-graph/config",
    "@atlas-graph/core",
    "@atlas-graph/db",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
