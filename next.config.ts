import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.nike.com", pathname: "/**" },
      { protocol: "https", hostname: "images.puma.com", pathname: "/**" },
      { protocol: "https", hostname: "assets.adidas.com", pathname: "/**" },
      { protocol: "https", hostname: "nb.scene7.com", pathname: "/**" }, // New Balance
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
