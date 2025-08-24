/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['dev.bflow.co.il'],
  },
  // אופטימיזציות
  swcMinify: true,
  compress: true,
}

module.exports = nextConfig

