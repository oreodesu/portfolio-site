import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
          Portfolio
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/works/todo" className="transition-colors hover:text-slate-900">
            TODO
          </Link>
          <Link to="/works/expense" className="transition-colors hover:text-slate-900">
            家計簿
          </Link>
          <a href="/urlshortener/" className="transition-colors hover:text-slate-900">
            URL短縮
          </a>
          <a href="/contact" className="transition-colors hover:text-slate-900">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
