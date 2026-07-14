import type { NextConfig } from "next";

const repo = "tolits-butcheron-front-end";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/tolits-butcheron-front-end',

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