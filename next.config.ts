import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isGitHubPages ? "/Aitzaz.12" : "",
  assetPrefix: isGitHubPages ? "/Aitzaz.12/" : "",
};

export default nextConfig;
