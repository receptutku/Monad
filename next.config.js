/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Vercel deployment optimizations
  output: 'standalone',
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    // Fix for MetaMask SDK and other wallet-related modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      };
    }
    
    // Ignore optional dependencies that cause build issues
    config.externals = config.externals || [];
    config.externals.push({
      '@react-native-async-storage/async-storage': 'commonjs @react-native-async-storage/async-storage',
      'pino-pretty': 'commonjs pino-pretty',
    });
    
    return config;
  },
}

module.exports = nextConfig

