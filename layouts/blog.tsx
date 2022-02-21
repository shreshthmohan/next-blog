import type { PropsWithChildren } from "react";
// import type { Post } from "contentlayer/types";
import type { Post } from "contentlayer/generated";
import Container from "components/Container";

export default function BlogLayout({
  children,
  post,
}: PropsWithChildren<{ post: Post }>) {
  return (
    <Container
      title={`${post.title} – Shreshth Mohan`}
      // description={post.summary}
      date={post.date}
      type="article"
    >
      <article className="flex flex-col items-start justify-center w-full max-w-2xl mx-auto mb-16">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-black md:text-5xl dark:text-white">
          {post.title}
        </h1>
        <div className="flex flex-col items-start justify-between w-full mt-2 md:flex-row md:items-center"></div>
        <div className="w-full mt-4 prose dark:prose-dark max-w-none">
          {children}
        </div>

        <div className="text-sm text-gray-700 dark:text-gray-300"></div>
      </article>
    </Container>
  );
}
