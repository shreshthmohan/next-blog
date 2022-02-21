import BlogLayout from "layouts/blog";

import { allPosts } from "contentlayer/generated";
import type { Post } from "contentlayer/generated";

export default function Post({ post }: { post: Post }) {
  return <BlogLayout post={post}></BlogLayout>;
}

export async function getStaticPaths() {
  return {
    paths: allPosts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = allPosts.find((post) => post.slug === params.slug);

  return { props: { post } };
}
