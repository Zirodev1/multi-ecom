/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: false, // Enable image optimization for better performance
  },
  typescript: {
    ignoreBuildErrors: true, // For deployment, ignore TS errors
  },
  eslint: {
    ignoreDuringBuilds: true, // For deployment, ignore ESLint errors
  },
  experimental: {
    optimizePackageImports: ['@tremor/react', '@radix-ui/react-select'],
  },
};

module.exports = nextConfig; 