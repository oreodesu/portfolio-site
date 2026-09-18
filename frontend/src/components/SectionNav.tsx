import { useState } from "react";

const SECTIONS = [
  { id: "about", label: "About me", dot: "bg-blue-500" },
  { id: "guide", label: "各アプリでできること", dot: "bg-violet-500" },
  { id: "architecture", label: "サイト全体の構成", dot: "bg-slate-500" },
  { id: "contact", label: "Contact", dot: "bg-emerald-500" },
];

/**
 * 画面右端に固定表示するセクションナビ。
 * ボタン自体は常に見える状態にし、ホバー(またはクリック)でラベル付きのパネルを開く。
 * 画面が狭いと本文に重なるため、md以上でのみ表示する。
 */
export default function SectionNav() {
  const [open, setOpen] = useState(false);

  const panelVisibility = open
    ? "visible translate-x-0 opacity-100"
    : "invisible translate-x-3 opacity-0 group-hover:visible group-hover:translate-x-0 group-hover:opacity-100";

  return (
    <div className="group fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 items-center gap-3 md:flex">
      <nav
        aria-label="セクション"
        className={`flex flex-col gap-0.5 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl transition-all duration-200 ${panelVisibility}`}
      >
        <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Jump to</p>
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${section.dot}`} aria-hidden="true" />
            {section.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="セクションメニューを開く"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition hover:bg-blue-600 group-hover:bg-blue-600"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        </svg>
      </button>
    </div>
  );
}
