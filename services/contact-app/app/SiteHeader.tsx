// メインサイトとは別アプリのため、遷移は通常のリンク (ページ全体の読み込み) になる
const LINKS = [
  { href: "/works/todo", label: "TODO" },
  { href: "/works/expense", label: "家計簿" },
  { href: "/urlshortener/", label: "URL短縮" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <a href="/" className="text-lg font-semibold tracking-tight text-slate-900">
          Portfolio
        </a>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-slate-900">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
