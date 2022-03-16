import BaseReadingLayout from 'layouts/BaseReadingLayout'
import { MDXRemote } from 'next-mdx-remote'

import { getBlogpost, listBlogposts } from 'utils/fetchIssues'

// const GH_USER_REPO = 'shreshthmohan/next-blog'

export default function Issue({ content }) {
  return (
    <BaseReadingLayout
      title="placeholder title"
      description="descr"
      date="{post.date}"
      type="article"
    >
      <h1>Issue</h1>
      {/* {JSON.stringify(content)} */}
      <MDXRemote {...content} />
    </BaseReadingLayout>
  )
}

export async function getStaticPaths() {
  const allIssues = await listBlogposts()

  return {
    paths: allIssues.map(i => ({ params: { slug: i.slug } })),
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const issue = await getBlogpost(params.slug)

  return { props: { ...issue } }
}
