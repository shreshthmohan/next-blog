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
      {
        source:
          '/learn-to-read-write-and-speak-kannada-by-kannada-prasara-parishat-137',
        destination: '/learn-kannada',
        permanent: true,
      },
      {
        source: '/ideas',
        destination: 'https://x.com/shreshthmohan/status/1725713727822172609',
        permanent: false,
      },
    ]
  },
}
