export default function Footer({
  children,
  maxWidthClassName = 'max-w-prose',
}) {
  return (
    <footer className="py-8 prose max-w-prose dark:prose-invert mx-auto">
      <div className={`${maxWidthClassName} mx-auto text-center`}>
        {children}
      </div>
    </footer>
  )
}
