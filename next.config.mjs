import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ REMOVE THIS - it breaks API routes
  // output: "export",

  // ❌ CHANGE THIS - wrong distDir
  // distDir: "out",

  // ✅ Use default .next directory
  distDir: ".next",

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
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
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
