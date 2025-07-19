import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    // This makes the GEMINI_API_KEY available to the client side.
    // It's already available to the server side thanks to `.env`
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  }
};

export default nextConfig;
