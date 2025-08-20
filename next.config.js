/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['dev.bflow.co.il'],
  },
  // הגדרות לפריסה בסביבת production
  output: 'standalone',
  // אופטימיזציות נוספות
  swcMinify: true,
  compress: true,
}

module.exports = nextConfig

