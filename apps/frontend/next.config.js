/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'minio'],
    unoptimized: true, // For static export if needed
  },
  // Temporarily disable i18n routing to fix 404
  // i18n: {
  //   locales: ['en', 'hi'],
  //   defaultLocale: 'en',
  // },
  // Output configuration
  output: 'standalone',
};

module.exports = nextConfig;


