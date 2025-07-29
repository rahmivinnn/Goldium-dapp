/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    appDir: false,
  },
  images: {
    domains: ['arweave.net'],
    unoptimized: true,
  },
  env: {
    CUSTOMCONNECT_WALLET: process.env.CUSTOMCONNECT_WALLET,
  },
  webpack: (config) => {
    config.resolve.fallback = { 
      fs: false, 
      net: false, 
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false
    };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  trailingSlash: true,
};

module.exports = nextConfig;
