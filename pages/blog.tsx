import type { NextPage } from 'next'
import Link from 'next/link'
import { timeFormat } from 'd3-time-format'
import { listBlogposts } from 'utils/fetchIssues'
import BaseReadingLayout from 'layouts/BaseReadingLayout'

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

const IssueList: NextPage<{ issueList: [] }> = props => {
  return (
    <BaseReadingLayout maxWidthClassName="max-w-screen-md">
      <h1 className="text-3xl font-normal tracking-tight  text-gray-700 md:text-4xl">
        All of my writing
      </h1>
      {props.issueList.map(({ id, slug: issueSlug, title, updated_at }) => (
        <div
          key={id}
          className="mb-6 w-full border-0 border-b border-solid border-gray-200 "
        >
          <Link href={`/blog/${issueSlug}`}>
            <a className="text-xl text-red-900 no-underline">{title}</a>
          </Link>
          <time className="block text-sm text-gray-400" dateTime={updated_at}>
            {timeFormat('%e %B %Y')(new Date(updated_at))}
          </time>
        </div>
      ))}
    </BaseReadingLayout>
  )
}

export default IssueList

export async function getStaticProps() {
  const allIssues = await listBlogposts()

  return {
    props: {
      issueList: allIssues.map(
        ({ slug, metaData: { title, updated_at, id } }) => ({
          slug,
          title,
          updated_at,
          id,
        }),
      ),
    },
  }
}
