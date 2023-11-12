/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'investantcms.net',
        port: '',
        pathname: '/uploads/**'
      }
    ]
  }
}

module.exports = nextConfig
