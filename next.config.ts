import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,

  // Enable experimental features for better performance
  experimental: {
    // Optimize images and fonts
    optimizeFonts: true,
    // Enable concurrent features
    reactCompiler: false, // Set to true when stable
  },

  // Bundle analyzer for production builds
  bundleAnalyzer: {
    enabled: process.env.ANALYZE === 'true',
  },

  // Webpack optimizations for code splitting
  webpack: (config, { dev, isServer }) => {
    // Optimize for production builds
    if (!dev && !isServer) {
      // Split vendor modules for better caching
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
          },
          common: {
            name: 'commons',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
          // Separate chunk for analytics/tracking
          analytics: {
            test: /[\\/]components[\\/](analytics|tracking)[\\/]/,
            name: 'analytics',
            chunks: 'all',
            enforce: true,
          },
          // Separate chunk for UI components
          ui: {
            test: /[\\/]components[\\/]ui[\\/]/,
            name: 'ui',
            chunks: 'all',
            enforce: true,
          },
        },
      };

      // Tree shaking optimizations
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }

    return config;
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Headers for performance and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Cache control for static assets
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          // Preload critical resources
          {
            key: 'Link',
            value: '</css/globals.css>; rel=preload; as=style',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },

  // Environment variables for build optimization
  env: {
    ENABLE_BUNDLE_ANALYZER: process.env.ANALYZE || 'false',
  },
};

export default nextConfig;
