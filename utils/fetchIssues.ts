import { GithubBlog } from '@rena.to/github-blog'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeCodeTitles from 'rehype-code-titles'
import rehypePrism from 'rehype-prism-plus'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import rehypeColorChips from 'rehype-color-chips'

import { serialize } from 'next-mdx-remote/serialize'

import grayMatter from 'gray-matter'
// import fetch from 'node-fetch'
// import parse from 'parse-link-header'
import slugify from 'slugify'

// import { siteWide } from 'siteDetails'

const blog = new GithubBlog({
  repo: process.env.GH_USER_REPO, // e.g.: "renatorib/posts"
  token: process.env.GH_TOKEN, // your github token
})
export async function listBlogposts() {
  const posts = await blog.getPosts({ pager: { first: 10 } })

  return posts.edges.map(({ post }) => {
    const parsedPost = parseIssue(post)

    return parsedPost
  })
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

function parseIssue(issue) {
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

  // console.log(issue)

  return {
    content: data.content,
    slug: slug.toLowerCase(),
    metaData: {
      issueUrl: issue.url,
      title: issue.title,
      created_at: issue.createdAt,
      updated_at: issue.updatedAt,
      ...data.data,
      id: issue.id,

      author: issue.author.login,
    },
  }
}
