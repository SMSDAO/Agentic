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
      // Extract hostname:port from NEXT_PUBLIC_APP_URL so origins are consistent.
      // Must be an absolute URL (e.g. https://example.com); falls back to localhost only.
      allowedOrigins: (() => {
        const origins = ['localhost:3000'];
        if (process.env.NEXT_PUBLIC_APP_URL) {
          try {
            origins.push(new URL(process.env.NEXT_PUBLIC_APP_URL).host);
          } catch {
            // Invalid URL — ignore; fix NEXT_PUBLIC_APP_URL to include the scheme
          }
        }
        return origins;
      })(),
    },
  },
};

module.exports = nextConfig;
