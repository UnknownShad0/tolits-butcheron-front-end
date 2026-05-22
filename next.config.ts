import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 👈 add this

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/storage/**",
      },
    ],
    unoptimized: true, // required for static export
  },
};

export default nextConfig;