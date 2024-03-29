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
        className={`${
          isActive
            ? 'text-gray-800 dark:text-gray-400 '
            : 'text-gray-400 dark:text-gray-600'
        }
           mr-4 text-xl font-normal no-underline decoration-gray-500 underline-offset-2 hover:text-gray-500 hover:underline`}
      >
        {text}
      </a>
    </Link>
  )
}

export default function BaseReadingLayout({
  children,
  maxWidthClassName = 'max-w-screen-md',
  ...meta
}) {
  return (
    <div className="bg-[#fefbf4] font-serif dark:bg-[#1f2124]">
      <MetaHead {...meta} />
      <div className="flex min-h-screen flex-col justify-between">
        <div
          className={`mx-auto w-full ${maxWidthClassName} px-3 pt-4 sm:pt-6 md:px-0 border-b dark:border-slate-600`}
        >
          <header className="relative">
            <a className="skip-to-content" href="#main-content">
              Skip navigation
            </a>
            <nav role="navigation" className="text-center">
              <span>
                {/* TODO test a11y */}
                <NavLink href="/" text="Home" />
                <NavLink href="/b" text="Blog" />
              </span>
            </nav>
          </header>

          <main id="main-content" className="md:pb-24 md:pt-10">
            {children}
          </main>
        </div>
        <Footer maxWidthClassName={maxWidthClassName}>
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
