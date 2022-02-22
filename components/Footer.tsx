export default function Footer({ children }) {
  return (
    <footer className="py-6 border-t border-x-0 border-b-0 border-solid border-gray-300">
      <div className="max-w-prose mx-auto">{children}</div>
    </footer>
  );
}
