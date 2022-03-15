import MetaHead from 'components/MetaHead'

// TODO meta for bullsandcows
const defaultMeta = {
  imagePathname: '/images/bullsandcows.jpg',
}

export default function BNCCustomLayout({ children, ...restProps }) {
  const meta = { ...defaultMeta, ...restProps }
  return (
    <div className="min-h-full bg-lime-50   font-sans ">
      <main className="px-4 pt-6 pb-16 sm:px-6 lg:px-8 ">
        <div className="text-right text-sm">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://youtu.be/LF-wOPEkGIc"
          >
            How to play [Video]
          </a>
        </div>
        <div className="text-right text-sm">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://en.wikipedia.org/wiki/Bulls_and_Cows#The_numerical_version"
          >
            How to play
          </a>
        </div>

        <MetaHead {...meta} />
        <h1 className="my-16 text-center font-sans text-4xl font-bold tracking-tight text-lime-500">
          Bulls and Cows
        </h1>
        <div className="mx-auto w-[20rem] text-center">{children}</div>
      </main>
    </div>
  )
}
