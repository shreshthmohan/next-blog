import Link from 'next/link'
import { useRouter } from 'next/router'
import Footer from '../components/Footer'
import MetaHead from '../components/MetaHead'

function NavLink({ href, text }) {
  const router = useRouter()
  const isActive = router.asPath === href

  return (
    <Link href={href}>
      <a
        className={`${isActive ? 'text-gray-600 ' : 'text-gray-400 '}
           mr-2 text-xl font-normal no-underline decoration-gray-500 underline-offset-2 hover:text-gray-500 hover:underline`}
      >
        {text}
      </a>
    </Link>
  )
}

export default function BaseReadingLayout(props) {
  const { children, ...meta } = props

  return (
    <div className="h-full font-serif ">
      <MetaHead {...meta} />
      <div className="flex min-h-full flex-col justify-between">
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
