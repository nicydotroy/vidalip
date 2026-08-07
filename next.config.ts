import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Uploads are served from /uploads on the same origin, so no remote
    // patterns are needed by default. Add them here if you move to S3/CDN.
    remotePatterns: [],
  },
};

export default nextConfig;
