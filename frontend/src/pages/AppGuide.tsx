import { Link } from "react-router-dom";

interface GuideEntry {
  title: string;
  href: string;
  external?: boolean;
  recommended?: boolean;
  accent: "blue" | "violet" | "emerald" | "slate";
  stacks: string[];
  features: string[];
  tryIt: string[];
  highlight: string;
}

const ENTRIES: GuideEntry[] = [
  {
    title: "TODOアプリ",
    href: "/works/todo",
    accent: "blue",
    stacks: ["Go", "Gin", "SQLite", "React"],
    features: [
      "タスクの追加・完了チェック",
      "タスク名の編集",
      "保存・削除前の確認ダイアログ",
      "未入力時のバリデーション",
    ],
    tryIt: [
      "やることを追加して、チェックを付けて完了にする",
      "緑の「編集」ボタンから内容を書き換えてみる",
      "空欄のまま「追加」を押してバリデーションを確認する",
    ],
    highlight:
      "HTTPハンドラ・永続化・データ構造を層で分離し、層ごとにテストを書いています。SQLiteはCGO不要のPure Go実装を採用しました。",
  },
  {
    title: "家計簿アプリ",
    href: "/works/expense",
    recommended: true,
    accent: "violet",
    stacks: ["Ruby on Rails", "MySQL", "JWT認証", "React", "TanStack Query"],
    features: [
      "アカウント登録・ログイン (JWT認証)",
      "カテゴリの作成・削除",
      "支出の登録・編集・削除",
      "合計金額の自動集計",
      "カテゴリ・メモでの検索と並び替え",
    ],
    tryIt: [
      "「デモアカウントで試す」からワンクリックでログインする",
      "自分のアカウントを作り、他のユーザーとデータが混ざらないことを確認する",
      "支出を登録・削除して、合計金額が即座に変わるのを見る",
      "使用中のカテゴリを削除しようとして、拒否されることを確認する",
    ],
    highlight:
      "本サイトで最も作り込んだアプリです。JWTによる認証、ユーザー単位のデータ分離、70件の自動テスト、React Hook Form + Zodによる入力検証、TanStack Queryによるサーバー状態管理を実装しています。",
  },
  {
    title: "URL短縮サービス",
    href: "/urlshortener/",
    external: true,
    accent: "emerald",
    stacks: ["PHP", "MySQL", "Vue 3", "TypeScript"],
    features: [
      "長いURLを短いURLに変換",
      "発行済みリンクの一覧表示",
      "短縮URLのクリップボードコピー",
      "リンクごとのアクセス数カウント",
    ],
    tryIt: [
      "長いURLを貼り付けて短縮する",
      "「コピー」で短縮URLをクリップボードに取得する",
      "「サイトに遷移」で元のページを開く",
    ],
    highlight:
      "フレームワークを使わず、ルーティングからDB接続まで素のPHPで実装しました。フロントエンドもVue 3で独立させ、メインサイトとは別のスタックで構成しています。",
  },
  {
    title: "お問い合わせフォーム",
    href: "/contact",
    external: true,
    accent: "slate",
    stacks: ["Next.js", "App Router", "TypeScript", "Zod", "MySQL"],
    features: [
      "お名前・メールアドレス・内容の送信",
      "項目ごとのバリデーションとエラー表示",
      "送信完了画面と、続けて送信する導線",
      "送信内容をデータベースに保存",
    ],
    tryIt: [
      "未入力のまま送信して、項目ごとのエラー表示を確認する",
      "内容を10文字未満で送信して、文字数チェックを確認する",
      "正しく入力して送信し、完了画面を確認する",
    ],
    highlight:
      "画面とAPIをNext.jsだけで完結させています。Zodのスキーマを画面とサーバーの両方で共有し、同じ検証ルールを一箇所で管理しました。クライアント側の検証は開発者ツールから回避できるため、サーバー側でも必ず同じ検証を通す設計にしています。",
  },
];

const ACCENT_STYLES = {
  blue: { bar: "bg-blue-500", chip: "bg-blue-50 text-blue-700", link: "text-blue-600 hover:text-blue-700" },
  violet: {
    bar: "bg-violet-500",
    chip: "bg-violet-50 text-violet-700",
    link: "text-violet-600 hover:text-violet-700",
  },
  emerald: {
    bar: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700",
    link: "text-emerald-600 hover:text-emerald-700",
  },
  slate: {
    bar: "bg-slate-500",
    chip: "bg-slate-100 text-slate-700",
    link: "text-slate-600 hover:text-slate-900",
  },
} as const;

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.5} stroke="currentColor" className="mt-0.5 h-3.5 w-3.5 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

/** URL短縮サービスだけ独立したフロントエンドのため、通常のリンクで遷移させる */
function OpenLink({ entry, className }: { entry: GuideEntry; className: string }) {
  const label = (
    <>
      {entry.title}を開く
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
      </svg>
    </>
  );

  if (entry.external) {
    return (
      <a href={entry.href} className={className}>
        {label}
      </a>
    );
  }

  return (
    <Link to={entry.href} className={className}>
      {label}
    </Link>
  );
}

export default function AppGuide() {
  return (
    <section id="guide" className="mt-20 scroll-mt-24">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-400">Guide</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">各アプリでできること</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          4つとも実際に触って動作を確認できます。入力した内容はその場でデータベースに保存されます。
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {ENTRIES.map((entry) => {
          const accent = ACCENT_STYLES[entry.accent];

          return (
            <article
              key={entry.title}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <span className={`absolute inset-y-0 left-0 w-1 ${accent.bar}`} aria-hidden="true" />

              <div className="p-6 pl-7">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{entry.title}</h3>
                  {entry.recommended && (
                    <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold text-amber-950">
                      おすすめ
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {entry.stacks.map((stack) => (
                    <span key={stack} className={`rounded-md px-2 py-0.5 text-xs font-medium ${accent.chip}`}>
                      {stack}
                    </span>
                  ))}
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">機能</p>
                    <ul className="mt-2 space-y-1.5">
                      {entry.features.map((feature) => (
                        <li key={feature} className="flex gap-2 text-sm text-slate-700">
                          <span className="text-slate-400">
                            <CheckIcon />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">試せること</p>
                    <ul className="mt-2 space-y-1.5">
                      {entry.tryIt.map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-slate-700">
                          <span className="text-slate-300">・</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
                  {entry.highlight}
                </p>

                <OpenLink entry={entry} className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${accent.link}`} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
