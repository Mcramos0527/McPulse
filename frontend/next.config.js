/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/McPulse',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}
module.exports = nextConfig
