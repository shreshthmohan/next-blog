export default function Footer({
  children,
  maxWidthClassName = 'max-w-prose',
}) {
  return (
    <footer className="border-x-0 border-t border-b-0 border-solid border-gray-300 py-6">
      <div className={`${maxWidthClassName} mx-auto text-center`}>
        {children}
      </div>
    </footer>
  )
}
