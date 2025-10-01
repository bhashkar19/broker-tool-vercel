/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix Turbopack workspace root warning
  experimental: {
    turbo: {
      root: '.'
    }
  },

  // Performance optimizations
  poweredByHeader: false,

  // Optimize for production
  compress: true,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
  }
};

module.exports = nextConfig;