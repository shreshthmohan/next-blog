import { MDXRemote } from 'next-mdx-remote'
import BaseReadingLayout from 'layouts/BaseReadingLayout'
import { getBlogpost, listBlogposts } from 'utils/fetchIssues'
import { siteWide } from 'siteDetails'

const { siteName } = siteWide

export default function Issue(issueData) {
  const { content, metaData } = issueData
  const { title, summary, updated_at, created_at } = metaData
  return (
    <BaseReadingLayout
      title={`${title} – ${siteName}`}
      description={summary}
      date={updated_at || created_at}
      type="article"
    >
      <article className="mx-auto mb-16 flex w-full max-w-2xl flex-col items-start justify-center">
        <header className="mb-4 w-full border-0 border-b-2 border-solid border-gray-200">
          <h1 className="mb-1 text-3xl font-normal tracking-tight  text-gray-700 md:text-4xl">
            {title}
          </h1>
          <div className="mt-0 mb-1 text-xl text-gray-700">{summary}</div>
        </header>
        <div className="article-body mt-4 w-full max-w-none">
          <MDXRemote {...content} />
        </div>
      </article>
    </BaseReadingLayout>
  )
}

export async function getStaticPaths() {
  const allIssues = await listBlogposts()

  return {
    paths: allIssues.map(i => ({ params: { slug: i.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const issue = await getBlogpost(params.slug)

  return { props: { ...issue } }
}
