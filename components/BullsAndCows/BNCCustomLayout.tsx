import MetaHead from 'components/MetaHead'

// TODO meta for bullsandcows
const defaultMeta = {
  imagePathname: '/images/bullsandcows.jpg',
}

export default function BNCCustomLayout({ children, ...restProps }) {
  const meta = { ...defaultMeta, ...restProps }
  return (
    <div className="w-full pt-12 font-sans sm:pt-24">
      <MetaHead {...meta} />
      <h1 className="mb-16 text-center font-sans text-4xl font-bold tracking-tight text-lime-500">
        Bulls and Cows
      </h1>
      <div className="mx-auto w-[20rem] text-center">{children}</div>
    </div>
  )
}
