import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  image: {
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
    ],
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
    useCache: true,
  }
};

export default nextConfig;
