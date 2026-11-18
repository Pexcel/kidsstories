import type { NextConfig } from "next";

// Animated Bible TV — Play Store listing.
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.janetbambistudio.animatedbibletv";

const nextConfig: NextConfig = {
  // Short, trustworthy links that send people straight to the app on Google Play.
  // e.g. https://your-domain.com/app  →  the Play Store listing.
  async redirects() {
    return [
      {
        source: "/app",
        destination: PLAY_STORE_URL,
        permanent: false, // 302 — keeps you free to change the destination later
      },
      {
        source: "/download",
        destination: PLAY_STORE_URL,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
