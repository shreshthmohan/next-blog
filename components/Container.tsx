import Head from "next/head";

import { useRouter } from "next/router";
// import { useState, useEffect } from "react";
import Footer from "./Footer";

const siteRoot = "https://shreshth.dev";
const siteName = "Shreshth Mohan";
const twitterHandle = "@shreshthmohan";

export default function Container(props) {
  const { children, ...customMeta } = props;
  const router = useRouter();
  const meta = {
    title: "Shreshth Mohan",
    description: "Web developer",
    // image: "",
    type: "website",
    ...customMeta,
  };

  return (
    <div className="font-serif">
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
        {/* <meta property="og:image" content={meta.image} /> */}
        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={twitterHandle} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} /> */}
        {meta.date && (
          <meta property="article:published_time" content={meta.date} />
        )}
      </Head>
      <div className="flex flex-col min-h-full">
        <div className="mx-auto max-w-prose pt-10">
          <header>
            {/* TODO: skip to content */}
            <nav>
              <span>
                {/* <a href="/">Home</a> */}
                {/* <a href="/about/">About + Now</a> */}
              </span>
            </nav>
          </header>

          <main id="skip" className="md:pt-10 md:pb-24">
            {children}
          </main>
        </div>
        <Footer>
          <span>
            Twitter:
            <a
              rel="noreferrer"
              target="_blank"
              href="https://twitter.com/shreshthmohan"
            >
              @shreshthmohan
            </a>{" "}
            Email:
            <a
              rel="noreferrer"
              target="_blank"
              href="mailto:shreshthmohan@hey.com"
            >
              shreshthmohan@hey.com
            </a>
          </span>
        </Footer>
      </div>
    </div>
  );
}
