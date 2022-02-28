import Head from 'next/head'
import { useRouter } from 'next/router'
import { siteWide } from 'siteDetails'
const {
  siteRoot,
  siteName,
  description,
  type,
  twitterHandle,
  defaultImagePathname,
} = siteWide

export default function MetaHead(props: {
  imagePathname?: string
  date?: string
  title?: string
  description?: string
}) {
  const router = useRouter()

  const { imagePathname = defaultImagePathname } = props
  const meta = {
    title: siteName,
    description,
    type,
    twitterHandle,
    image: imagePathname ? siteRoot + imagePathname : null,
    ...props,
  }
  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="robots" content="follow, index" />
      <meta content={meta.description} name="description" />
      <meta property="og:url" content={`${siteRoot}${router.asPath}`} />
      <link rel="canonical" href={`${siteRoot}${router.asPath}`} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      {meta.image && <meta property="og:image" content={meta.image} />}

      <meta
        name="twitter:card"
        content={meta.image ? 'summary_large_image' : 'summary'}
      />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      {meta.image && <meta name="twitter:image" content={meta.image} />}
      {meta.date && (
        <meta property="article:published_time" content={meta.date} />
      )}
    </Head>
  )
}
