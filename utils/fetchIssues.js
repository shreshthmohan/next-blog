// Quite a bit if the code here is copied from
// https://github.com/sw-yx/swyxkit/commit/3a309d95275ae32bd311d71838ca36858b222eb6#diff-e52d7cbb53c2deb88bfe15cfc210a387853cf9f243172b6e2844bb88bc9743a3
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrism from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import { serialize } from 'next-mdx-remote/serialize'

import grayMatter from 'gray-matter'
import fetch from 'node-fetch'
import parse from 'parse-link-header'
import slugify from 'slugify'

const GH_USER_REPO = 'shreshthmohan/next-blog'

const publishedTags = ['Published']
let allBlogposts = []
// let etag = null // todo - implmement etag header

export async function listBlogposts() {
  allBlogposts = [] // reset to zero - make sure to handle this better when doing etags or cache restore
  let next = null
  let limit = 0 // just a failsafe against infinite loop - feel free to remove
  const authheader = process.env.GH_TOKEN && {
    Authorization: `token ${process.env.GH_TOKEN}`,
  }
  do {
    const res = await fetch(
      next ??
        `https://api.github.com/repos/${GH_USER_REPO}/issues?state=all&per_page=100&labels=Draft`,
      {
        headers: authheader,
      },
    )

    const issues = await res.json()
    if (res.status > 400)
      throw new Error(
        res.status + ' ' + res.statusText + '\n' + (issues && issues.message),
      )
    issues.forEach(issue => {
      allBlogposts.push(parseIssue(issue))
    })
    const headers = parse(res.headers.get('Link'))
    next = headers && headers.next
  } while (next && limit++ < 1000) // just a failsafe against infinite loop - feel free to remove
  return allBlogposts
}

export async function getBlogpost(slug) {
  allBlogposts = await listBlogposts()
  // find the blogpost that matches this slug
  const blogpost = allBlogposts.find(post => post.slug === slug)
  const content = await serialize(blogpost.content ?? 'No content', {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        rehypeCodeTitles,
        rehypePrism,
        [
          rehypeAutolinkHeadings,
          {
            // https://github.com/rehypejs/rehype-autolink-headings#optionsproperties
            properties: {
              className: ['intra-page-link'],
              ariaHidden: true,
            },
          },
        ],
      ],
    },
  })

  return { ...blogpost, content }
}

function parseIssue(issue) {
  const src = issue.body

  const data = grayMatter(src ?? 'No content')
  let slug
  if (data.data.slug) {
    slug = data.data.slug
  } else if (data.data.title) {
    slug = slugify(data.data.title)
  } else {
    slug = slugify(issue.title)
  }
  return {
    content: data.content,
    slug: slug.toLowerCase(),
    metaData: {
      issueUrl: issue.html_url,
      title: issue.title,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      ...data.data,
      // commentsUrl: issue.comments_url,
      // reactions: issue.reactions,
    },
  }
}
