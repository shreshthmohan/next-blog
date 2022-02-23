import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Footer from './Footer'
import MetaHead from './MetaHead'

function NavLink({ href, text }) {
  const router = useRouter()
  const isActive = router.asPath === href

  return (
    <Link href={href}>
      <a
        className={`${isActive ? 'text-gray-600 ' : 'text-gray-400 '}
           font-normal text-xl hover:text-gray-500 no-underline hover:underline decoration-gray-500 underline-offset-2 mr-2`}
      >
        {text}
      </a>
    </Link>
  )
}

export default function Container(props) {
  const { children, ...meta } = props

  return (
    <div className="font-serif h-full ">
      <MetaHead {...meta} />
      <div className="flex flex-col min-h-full justify-between">
        <div className="mx-auto max-w-prose pt-10">
          <header className="relative">
            <a className="skip-to-content" href="#main-content">
              Skip navigation
            </a>
            <nav role="navigation" className="text-center">
              <span>
                {/* TODO test a11y */}
                <NavLink href="/" text="Home" />
                <NavLink href="/about" text="About + Now" />
                {/* blog */}
                {/* projects */}
                {/* snippets/components */}
                {/* tools/uses */}
              </span>
            </nav>
          </header>

          <main id="main-content" className="md:pt-10 md:pb-24">
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
            </a>{' '}
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
  )
}
