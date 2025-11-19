/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'minio'],
    unoptimized: true,
  },
  // Remove i18n routing - using react-i18next instead
  // This prevents Next.js routing conflicts
};

module.exports = nextConfig;


