/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true, // Disable image optimization for deployment
  },
  typescript: {
    ignoreBuildErrors: true, // For deployment, ignore TS errors
  },
  eslint: {
    ignoreDuringBuilds: true, // For deployment, ignore ESLint errors
  },
};

module.exports = nextConfig; 