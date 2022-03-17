export const siteWide = {
  // siteRoot: 'https://shreshth.dev',
  siteRoot:
    'https://' + (process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL),
  siteName: 'Shreshth Mohan',
  twitterHandle: '@shreshthmohan',
  type: 'website',
  description:
    'A site featuring projects and content on web development and data visualisation. d3.js, SVG, JavaScript, React, HTML, CSS',
  defaultImagePathname: '/images/banner.jpg', // for default og:image, twitter:image
}
