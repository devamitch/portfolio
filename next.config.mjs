import path from "path";

// const isGithubActions = process.env.GITHUB_ACTIONS || false;

// const isProd = process.env.NODE_ENV === "production";
// const repo = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, "") || "";

// const assetPrefix = isProd ? "/" : `/${repo}/`;
// const basePath = isProd ? "/" : `/${repo}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  assetPrefix: "",
  basePath: "",
  sassOptions: {
    includePaths: [path.join(process.cwd(), "app")],
  },
  images: {
    unoptimized: true,
    deviceSizes: [320, 420, 768, 1024, 1200],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  distDir: "out",
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Add custom Webpack loaders for non-JS file types (e.g., mp4)
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // Add more file extensions as needed
      use: {
        loader: "file-loader",
        options: {
          publicPath: "/_next/static/media/",
          outputPath: "static/media/",
          name: "[name].[hash].[ext]",
        },
      },
    });

    return config;
  },
};

export default nextConfig;
