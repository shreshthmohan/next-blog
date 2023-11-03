// Quite a bit if the code here is copied from
// https://github.com/sw-yx/swyxkit/commit/3a309d95275ae32bd311d71838ca36858b222eb6#diff-e52d7cbb53c2deb88bfe15cfc210a387853cf9f243172b6e2844bb88bc9743a3
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrism from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import rehypeColorChips from 'rehype-color-chips'

import { serialize } from 'next-mdx-remote/serialize'

import grayMatter from 'gray-matter'
import fetch from 'node-fetch'
import parse from 'parse-link-header'
import slugify from 'slugify'

import { siteWide } from 'siteDetails'

const GH_USER_REPO = siteWide.githubUserRepo
const GH_OWNER_USER = GH_USER_REPO.split('/')[0]

type IssueLabel = { name: string }

type Issue = {
  body: string
  title: string
  html_url: string
  created_at: string
  updated_at: string
  labels: IssueLabel[]
  id: number
  user: {
    login: String
  }
}

// const publishedTag =
// let etag = null // todo - implmement etag header

export async function listBlogposts() {
  let allBlogposts = [] // reset to zero - make sure to handle this better when doing etags or cache restore
  let next = null
  let limit = 0 // just a failsafe against infinite loop - feel free to remove
  const authheader = process.env.GH_TOKEN && {
    Authorization: `token ${process.env.GH_TOKEN}`,
  }

  do {
    const res = await fetch(
      next?.url ??
        `https://api.github.com/repos/${GH_USER_REPO}/issues?state=all&per_page=100`,
      {
        headers: authheader,
      },
    )

    const result = await res.json()
    if (res.status > 400) {
      const err = result as { message?: string }
      throw new Error(
        res.status + ' ' + res.statusText + '\n' + err && err.message,
      )
    }
    const issues = result as Issue[]
    issues
      .filter(d => d.user.login === GH_OWNER_USER)
      // keep issues with the tag "status:published"
      .filter(d => d.labels.some(l => l.name === 'status:published'))
      // .filter(d => d.labels.some(l => l.name === 'draft'))
      .forEach(issue => {
        allBlogposts.push({ ...parseIssue(issue), issue })
      })
    const headers = parse(res.headers.get('Link'))
    next = headers && headers.next
  } while (next && limit++ < 1000) // just a failsafe against infinite loop - feel free to remove
  return allBlogposts
}

// list all categories
export async function listCategories() {
  const allBlogposts = await listBlogposts()
  const categories = allBlogposts.reduce((acc, { issue }) => {
    const post = issue
    console.log('post.labels', post.labels)
    post.labels.forEach(labelObj => {
      const label = labelObj.name as string
      if (label.startsWith('category:')) {
        const cat = label.split(':')[1]
        if (!acc.includes(cat)) {
          acc.push(cat)
        }
      }
    })
    return acc
  }, [] as string[])
  console.log('categories', categories)
  return categories
}

export async function listBlogpostsOfCategory(category: string) {
  const allBlogposts = await listBlogposts()
  const blogpostsOfCategory = allBlogposts.filter(({ issue }) => {
    return issue.labels.some(labelObj => {
      const label = labelObj.name as string
      if (label.startsWith('category:')) {
        const cat = label.split(':')[1]
        return cat === category
      }
    })
  })
  return blogpostsOfCategory
}

export async function getBlogpost(slug: string) {
  const allBlogposts = await listBlogposts()
  // find the blogpost that matches this slug
  const blogpost = allBlogposts.find(post => post.slug === slug)
  const content = await serialize(blogpost.content ?? 'No content', {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        rehypeCodeTitles,
        rehypeColorChips,
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

function parseIssue(issue: Issue) {
  const src = issue.body

  const data = grayMatter(src ?? 'No content')
  let slug: string
  if (data.data.slug) {
    slug = data.data.slug
  } else if (data.data.title) {
    slug = slugify(data.data.title, { remove: /[*+~.,()'"!:@]/g })
  } else {
    slug = slugify(issue.title, { remove: /[*+~.,()'"!:@]/g })
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
      id: issue.id,
      author: issue.user.login,
    },
  }
}
