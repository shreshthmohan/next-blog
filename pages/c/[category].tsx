import Link from 'next/link'
import { listBlogpostsOfCategory, listCategories } from 'utils/fetchIssues'

import { timeFormat } from 'd3-time-format'
import BaseReadingLayout from 'layouts/BaseReadingLayout'

export default function PostsOfCategory(props) {
  return (
    <BaseReadingLayout maxWidthClassName="max-w-screen-md">
      <h1 className="text-3xl font-normal tracking-tight md:text-4xl">
        Everything related to {props.category}
      </h1>
      {props.allPostsOfCategory.map(({ slug: issueSlug, metaData }) => {
        const { title, id, updated_at } = metaData
        return (
          <div
            key={id}
            className="mb-6 w-full border-0 border-b border-solid border-gray-200 dark:border-zinc-800"
          >
            <Link href={`/blog/${issueSlug}`}>
              <a className="text-xl">{title}</a>
            </Link>
            <time
              className="block text-sm text-gray-400 dark:text-gray-600"
              dateTime={updated_at}
            >
              {timeFormat('%e %B %Y')(new Date(updated_at))}
            </time>
          </div>
        )
      })}
    </BaseReadingLayout>
  )
}

export async function getStaticPaths() {
  const allCategories = await listCategories()

  return {
    paths: allCategories.map(cat => ({ params: { category: cat } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const { category } = params

  const allPostsOfCategory = await listBlogpostsOfCategory(category)

  return { props: { allPostsOfCategory, category } }
}
