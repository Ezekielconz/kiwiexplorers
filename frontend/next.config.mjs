// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local dev (Strapi running on localhost:1337)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },

      // Strapi Cloud API host (JSON, admin, etc.)
      {
        protocol: 'https',
        hostname: 'accessible-horn-1b1f308051.strapiapp.com',
        pathname: '/uploads/**',
      },

      // Strapi Cloud media CDN host (actual image bytes)
      {
        protocol: 'https',
        hostname: 'accessible-horn-1b1f308051.strapiapp.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
