/** @type {import('next').NextConfig} */
const nextConfig = {
  // Modern turbopack configuration for Next.js 15.5.4
  turbopack: {
    // Use current directory as root to avoid multiple lockfile conflicts
    root: __dirname
  },

  // Performance optimizations
  poweredByHeader: false,

  // Optimize for production
  compress: true,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dqmpityshhywzayjysru.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  }
};

module.exports = nextConfig;