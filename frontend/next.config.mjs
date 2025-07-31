/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // local dev
      { protocol: 'http',  hostname: 'localhost', port: '1337', pathname: '/uploads/**' },

      // Strapi Cloud API host (JSON, admin, etc.)
      { protocol: 'https', hostname: 'accessible-horn-1b1f308051.strapiapp.com', pathname: '/uploads/**' },

      // NEW – Strapi Cloud media CDN
      { protocol: 'https', hostname: '*.media.strapiapp.com', pathname: '/**' },

      // (or, in Next ≥15.3 you can use the URL shorthand)
      // new URL('https://**.media.strapiapp.com/**'),
    ],
  },
};

export default nextConfig;
