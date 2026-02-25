/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Transpile workspace packages that ship TypeScript source
  transpilePackages: ['@agentic/ui', '@agentic/shared', '@agentic/web3', '@agentic/ai'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  },
  experimental: {
    serverActions: {
      // Extract hostname:port from NEXT_PUBLIC_APP_URL so origins are consistent
      allowedOrigins: [
        'localhost:3000',
        process.env.NEXT_PUBLIC_APP_URL
          ? new URL(process.env.NEXT_PUBLIC_APP_URL).host
          : null,
      ].filter(Boolean),
    },
  },
};

module.exports = nextConfig;
