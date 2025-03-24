/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['randomuser.me'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  // Remove standalone output as it might cause issues with Amplify
  // Remove onDemandEntries as it's not needed for production
  poweredByHeader: false,
  
  // Security headers with ad-compatible CSP
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.facebook.com https://*.facebook.net https://*.google.com https://*.google-analytics.com https://*.googletagmanager.com https://*.tiktok.com https://*.tiktokcdn.com https://api.trustedform.com",
              "style-src 'self' 'unsafe-inline' https://*.facebook.com https://*.facebook.net https://*.google.com https://*.tiktok.com",
              "img-src 'self' data: blob: https://*.facebook.com https://*.facebook.net https://*.google.com https://*.google-analytics.com https://*.googletagmanager.com https://*.tiktok.com https://*.tiktokcdn.com https://randomuser.me https://api.trustedform.com https://www.facebook.com",
              "font-src 'self' https://*.facebook.com https://*.facebook.net https://*.google.com https://*.tiktok.com",
              "connect-src 'self' https://*.facebook.com https://*.facebook.net https://*.google.com https://*.google-analytics.com https://*.googletagmanager.com https://*.tiktok.com https://*.tiktokcdn.com https://randomuser.me https://api.trustedform.com https://bnmcip8xp5.execute-api.us-east-1.amazonaws.com https://api.activeprosper.com",
              "frame-src 'self' https://*.facebook.com https://*.facebook.net https://*.google.com https://*.tiktok.com",
              "media-src 'self' https://*.facebook.com https://*.facebook.net https://*.google.com https://*.tiktok.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self' https://*.facebook.com https://*.facebook.net https://*.google.com https://*.tiktok.com",
              "block-all-mixed-content"
            ].join('; ')
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With'
          }
        ],
      },
    ];
  },

  // Webpack optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize CSS
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss)$/,
        chunks: 'all',
        enforce: true,
      };
    }

    return config;
  },
};

module.exports = nextConfig; 