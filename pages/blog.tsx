import type { NextPage } from 'next'
import Link from 'next/link'
import { listBlogposts } from 'utils/fetchIssues'
import BaseReadingLayout from 'layouts/BaseReadingLayout'

const IssueList: NextPage<{ issueList: string[] }> = props => {
  return (
    <BaseReadingLayout>
      <h1>All of my writing</h1>
      <ul>
        {props.issueList.map(issueSlug => (
          <li key={issueSlug}>
            <Link href={`issues/${issueSlug}`}>
              <a>{issueSlug}</a>
            </Link>
          </li>
        ))}
      </ul>
    </BaseReadingLayout>
  )
}

export default IssueList

export async function getStaticProps() {
  const allIssues = await listBlogposts()

  return { props: { issueList: allIssues.map(issue => issue.slug) } }
}
