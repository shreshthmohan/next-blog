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
      <article className="mx-auto mb-16 flex w-full max-w-screen-xl flex-col items-start justify-center">
        <header className="mb-4 w-full ">
          <div className="border-0 border-b-2 border-solid border-gray-200 pb-1 dark:border-zinc-800">
            <h1 className="mb-4  text-5xl font-normal tracking-tight text-gray-700 dark:text-slate-300">
              {title}
            </h1>
            <div className="flex justify-between text-sm">
              <span>{metaData.author}</span>
              <a href={metaData.issueUrl}>Source</a>
            </div>
          </div>
          <div className="mb-1 mt-0 text-xl">{summary}</div>
        </header>
        <div className="article-body mt-4 w-full max-w-none prose-img:max-w-full">
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
