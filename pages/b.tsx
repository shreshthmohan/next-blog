import React from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import { timeFormat } from 'd3-time-format'
import { listBlogposts, listCategories } from 'utils/fetchIssues'
import BaseReadingLayout from 'layouts/BaseReadingLayout'

const IssueList: NextPage<{
  issueList: []
  allCategories: string[]
}> = props => {
  return (
    <BaseReadingLayout maxWidthClassName="max-w-screen-md">
      <h1 className="text-3xl font-normal tracking-tight md:text-4xl">
        All of my writing
      </h1>

      <h2 className="font-mornal text-2xl font-normal md:text-3xl">
        Categories
      </h2>
      <p className="pt-2 ">
        {props.allCategories.map(cat => (
          <React.Fragment key={cat}>
            <Link href={`/c/${cat}`}>
              <a className="text-lg">{cat}</a>
            </Link>

            <span> </span>
          </React.Fragment>
        ))}
      </p>

      <hr className="my-8" />
      <div className="">
        {props.issueList.map(({ id, slug: issueSlug, title, updated_at }) => (
          <div
            key={id}
            className="bor-der-b mb-6 w-full border-0 border-solid border-gray-200 dark:border-zinc-800"
          >
            <Link href={`/${issueSlug}`}>
              <a className="text-xl ">{title}</a>
            </Link>
            <time
              className="block text-sm text-gray-400 dark:text-gray-600"
              dateTime={updated_at}
            >
              {timeFormat('%e %B %Y')(new Date(updated_at))}
            </time>
          </div>
        ))}
      </div>
    </BaseReadingLayout>
  )
}

export default IssueList

export async function getStaticProps() {
  const allIssues = await listBlogposts()
  const allCategories = await listCategories()

  return {
    props: {
      allCategories,
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
