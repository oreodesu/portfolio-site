const SKILL_GROUPS = [
  { label: "バックエンド", items: ["Go (メイン)", "PHP", "Ruby / Ruby on Rails"] },
  { label: "フロントエンド", items: ["TypeScript", "JavaScript", "React", "Next.js", "Vue"] },
  { label: "インフラ・その他", items: ["Docker", "AWS", "Terraform", "GitHub Actions"] },
];

const GITHUB_URL = "https://github.com/oreodesu";

export default function AboutMe() {
  return (
    <section id="about" className="mt-20 scroll-mt-24">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-400">About</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">About me</h2>

      <div className="mt-8 grid gap-8 sm:grid-cols-[auto_1fr]">
        <img
          src="/profile.jpg"
          alt="プロフィール写真"
          className="h-28 w-28 shrink-0 rounded-2xl object-cover shadow-sm"
        />

        <div>
          <p className="leading-relaxed text-slate-600">
            エンジニア歴4年です。バックエンドを中心に開発しており、メインの言語はGoです。
            業務ではPHPやRubyでの開発も経験しています。
            フロントエンドはTypeScript / JavaScriptで、React・Next.js・Vueを扱います。
          </p>
          <p className="mt-3 leading-relaxed text-slate-600">
            このサイトは、扱える技術の幅を実際に動くものとして示すために作りました。
            アプリごとに異なるスタックを採用し、インフラ構成やCI/CDまで含めて自分で構築しています。
          </p>

          <dl className="mt-6 space-y-3">
            {SKILL_GROUPS.map((group) => (
              <div key={group.label} className="sm:flex sm:gap-4">
                <dt className="w-32 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {group.label}
                </dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5 sm:mt-0">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>

          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
