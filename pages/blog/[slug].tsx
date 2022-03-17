import BlogLayout from 'layouts/BlogLayout'
import BaseReadingLayout from 'layouts/BaseReadingLayout'
import { useMDXComponent } from 'next-contentlayer/hooks'

import { allPosts } from 'contentlayer/generated'
import type { Post } from 'contentlayer/generated'
import { siteWide } from 'siteDetails'

const { siteName } = siteWide

export default function Post({ post }: { post: Post }) {
  const Component = useMDXComponent(post.body.code)

  return (
    <BaseReadingLayout
      title={`${post.title} – ${siteName}`}
      description={post.summary}
      date={post.date}
      type="article"
    >
      <article className="mx-auto mb-16 flex w-full max-w-2xl flex-col items-start justify-center">
        <h1 className="mx-auto mb-4 text-center text-3xl tracking-tight text-black md:text-5xl ">
          {post.title}
        </h1>
        <div className="mt-2 flex w-full flex-col items-start justify-between md:flex-row md:items-center"></div>
        <div className="article-body mt-4 w-full max-w-none">
          <Component />
        </div>

        <div className=""></div>
      </article>
    </BaseReadingLayout>
  )
}

export async function getStaticPaths() {
  return {
    paths: allPosts.map(p => ({ params: { slug: p.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const post = allPosts.find(post => post.slug === params.slug)

  return { props: { post } }
}
