import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.notion.so',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 'notion.so',
        pathname: '/image/**',
      },
      {
        protocol: 'https',
        hostname: 's3-us-west-2.amazonaws.com',
        pathname: '/public.notion-static.com/**',
      },
      {
        protocol: 'https',
        hostname: 'www.notion-static.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.notion-static.com',
        pathname: '/**',
      },
    ],
    unoptimized: false, // Keep Next.js image optimization
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ['image/webp'],
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"]
  }
};

export default nextConfig;
