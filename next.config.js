/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: [],
  },
  assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
  trailingSlash: true,
};

module.exports = nextConfig;
