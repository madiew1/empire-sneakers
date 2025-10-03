import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.nike.com" },
      { protocol: "https", hostname: "images.puma.com" },
      { protocol: "https", hostname: "assets.adidas.com" },
      { protocol: "https", hostname: "nb.scene7.com" }, // New Balance
    ],
  },
};

export default nextConfig;
