// list of posts of a given category

// import type { NextPage } from 'next'
import Link from 'next/link'
// import { timeFormat } from 'd3-time-format'
import {
  // listBlogposts,
  // listBlogpostsOfCategory,
  listCategories,
} from 'utils/fetchIssues'
import BaseReadingLayout from 'layouts/BaseReadingLayout'

const CategoryList = props => {
  return (
    <BaseReadingLayout maxWidthClassName="max-w-screen-md">
      <h1>Categories</h1>

      <ul>
        {props.allCategories.map(cat => (
          <li key={cat}>
            <Link href={`/blog/c/${cat}`}>
              <a>{cat}</a>
            </Link>
          </li>
        ))}
      </ul>
    </BaseReadingLayout>
  )
}

export default CategoryList

export async function getStaticProps() {
  const allCategories = await listCategories()

  return { props: { allCategories } }
}
