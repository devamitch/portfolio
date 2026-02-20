import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
    "postprocessing",
  ],

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

  webpack: (config) => {
    // ─── MEDIA FILES ──────────────────────────────────────────
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

    // ─── NOTE: NO react/react-dom alias here ─────────────────
    // require.resolve("react") returns the index.js FILE PATH.
    // Aliasing to a file breaks React 19 subpath exports:
    //   react/jsx-runtime    → "Can't resolve" crash
    //   react-dom/client     → "Can't resolve" crash (drei Html)
    //
    // The ReactCurrentOwner problem is fully solved by
    // dynamic(() => import("./Scene3D"), { ssr: false })
    // in page.tsx. No alias needed.

    return config;
  },
};

export default nextConfig;
