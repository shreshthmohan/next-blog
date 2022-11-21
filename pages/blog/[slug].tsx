import { MDXRemote } from 'next-mdx-remote'
import BaseReadingLayout from 'layouts/BaseReadingLayout'
import { getBlogpost, listBlogposts } from 'utils/fetchIssues'
import { siteWide } from 'siteDetails'

const { siteName } = siteWide

export default function Issue(issueData) {
  const { content, metaData } = issueData
  const { title, summary, updated_at, created_at, tags } = metaData
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
            <h1 className=" mt-2 mb-4  text-5xl font-normal tracking-tight text-gray-700 dark:text-slate-300">
              {title}
            </h1>

            <div className="flex justify-between text-sm">
              <span>{metaData.author}</span>
              <a href={metaData.issueUrl}>Source</a>
            </div>
          </div>
          <div className="mt-0 mb-1 text-xl">{summary}</div>
          {tags &&
            tags.map(t => {
              return (
                <span
                  className="mr-2 rounded border border-solid border-gray-300 bg-gray-100 py-0.5 px-1 text-sm dark:border-gray-600 dark:bg-gray-800 "
                  key={t}
                >
                  {t}
                </span>
              )
            })}
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
