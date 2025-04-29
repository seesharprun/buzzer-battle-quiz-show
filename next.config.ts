import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enable static export for Azure Static Web Apps
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: true,
};

export default nextConfig;
