import type { PropsWithChildren } from 'react'
// import type { Post } from "contentlayer/types";
import type { Post } from 'contentlayer/generated'
import BaseReadingLayout from 'layouts/BaseReadingLayout'
import { siteWide } from 'siteDetails'

const { siteName } = siteWide

export default function BlogLayout({
  children,
  post,
}: PropsWithChildren<{ post: Post }>) {
  return (
    <BaseReadingLayout
      title={`${post.title} – ${siteName}`}
      description={post.summary}
      date={post.date}
      type="article"
    >
      <article className="mx-auto mb-16 flex w-full max-w-2xl flex-col items-start justify-center">
        <h1 className="mb-4 text-center text-3xl tracking-tight text-black md:text-5xl ">
          {post.title}
        </h1>
        <div className="mt-2 flex w-full flex-col items-start justify-between md:flex-row md:items-center"></div>
        <div className="article-body mt-4 w-full max-w-none">{children}</div>

        <div className=""></div>
      </article>
    </BaseReadingLayout>
  )
}
