const schemeRegex = /^http(?:s)?:\/\//
const siteUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL

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
  // Intentionally not implementing a list of labels to publish to keep thing simple
  // One can always manually label all issues to be published
  labelToPublish: 'draft', // github issues marked with this label will be published to the blog
}
