import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "social-media-feed-be.onrender.com",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
