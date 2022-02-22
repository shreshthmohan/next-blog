import BlogLayout from "layouts/blog";
import { useMDXComponent } from "next-contentlayer/hooks";

import { allPosts } from "contentlayer/generated";
import type { Post } from "contentlayer/generated";

export default function Post({ post }: { post: Post }) {
  const Component = useMDXComponent(post.body.code);

  return (
    <BlogLayout post={post}>
      <Component />
    </BlogLayout>
  );
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
