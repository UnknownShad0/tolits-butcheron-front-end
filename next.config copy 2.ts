import type { NextConfig } from "next";

const repo = "tolits-butcheron-front-end";


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;