/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  // Remove standalone output as it might cause issues with Amplify
  // Remove onDemandEntries as it's not needed for production
  poweredByHeader: false,
};

// Log configuration for debugging
console.log('Next.js Config:', JSON.stringify(nextConfig, null, 2));

module.exports = nextConfig; 