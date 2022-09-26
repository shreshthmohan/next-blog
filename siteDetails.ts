const schemeRegex = /^http(?:s)?:\/\//
const siteUrl = process.env.SITE_URL

export const siteWide = {
  // prepend scheme [https://] if not present in the environment variable
  siteRoot: schemeRegex.test(siteUrl) ? siteUrl : `https://${siteUrl}`,
  siteName: 'Shreshth Mohan',
  twitterHandle: '@shreshthmohan',
  type: 'website',
  description:
    'A site featuring projects and content on web development and data visualisation. d3.js, SVG, JavaScript, React, HTML, CSS',
  defaultImagePathname: '/images/banner.jpg', // for default og:image, twitter:image
  githubUserRepo: process.env.GH_USER_REPO, // 'shreshthmohan/next-blog',
  labelsToPublish: ['published', 'draft'], //
}
