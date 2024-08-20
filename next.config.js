/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/hsr-106',
        destination: '/hsr',
        permanent: true,
      },
    ]
  },
}
