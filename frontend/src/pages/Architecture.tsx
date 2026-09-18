const ROUTES = [
  { path: "/", app: "メインサイト", stack: "React + TypeScript", accent: "text-blue-600" },
  { path: "/api/todo/*", app: "TODO API", stack: "Go + Gin / SQLite", accent: "text-blue-600" },
  { path: "/api/expense/*", app: "家計簿 API", stack: "Ruby on Rails / MySQL", accent: "text-violet-600" },
  { path: "/urlshortener/", app: "URL短縮", stack: "Vue 3 + PHP / MySQL", accent: "text-emerald-600" },
  { path: "/contact", app: "お問い合わせ", stack: "Next.js / MySQL", accent: "text-slate-600" },
];

const TOPICS = [
  {
    title: "単一エントリポイント",
    body: "nginxのリバースプロキシで全アプリを1つのオリジンに集約しています。フロントエンドから見た接続先が常に同一になるため、CORSの設定やAPIごとのホスト管理が不要になります。",
  },
  {
    title: "コンテナ構成",
    body: "8つのコンテナをDocker Composeで管理しています。MySQLは1台を共有しつつ、アプリごとにデータベースとユーザーを分離し、権限レベルで他アプリのデータに触れないようにしています。",
  },
  {
    title: "インフラのコード管理",
    body: "AWS上の構成はTerraformで定義しています。EC2 1台にすべてを同居させる最小構成で、マネージドDBやオーケストレーションは使わず運用コストを抑える判断をしました。",
  },
  {
    title: "テストとCI/CD",
    body: "GitHub Actionsでアプリ単位にCIを分割し、変更があったディレクトリのワークフローだけが動きます。デプロイは誤操作を防ぐため手動実行のみに限定しています。",
  },
];

const STATS = [
  { value: "4", unit: "アプリ", note: "言語・フレームワークを分けて実装" },
  { value: "84", unit: "テスト", note: "Rails 70件 / Go 14件" },
  { value: "8", unit: "コンテナ", note: "Docker Composeで一括管理" },
];

export default function Architecture() {
  return (
    <section id="architecture" className="mt-20 scroll-mt-24">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-400">Architecture</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">サイト全体の構成</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          アプリを並べるだけでなく、それらを1つのサイトとして成立させる部分も自分で構築しています。
          リバースプロキシによる振り分けから、コンテナ構成、インフラのコード化、CI/CDまでが対象です。
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div key={stat.unit} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold tracking-tight text-slate-900">{stat.value}</span>
              <span className="text-sm font-medium text-slate-500">{stat.unit}</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">{stat.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">リクエストの振り分け</p>

          <div className="mt-4 rounded-xl bg-slate-900 px-4 py-3">
            <p className="text-sm font-semibold text-white">nginx (リバースプロキシ)</p>
            <p className="text-xs text-slate-400">ポート80で受け、パスごとに転送先を決める</p>
          </div>

          <ul className="mt-2 space-y-1">
            {ROUTES.map((route) => (
              <li key={route.path} className="flex items-start gap-3 rounded-lg px-2 py-2 text-sm">
                <span className="mt-1.5 h-px w-4 shrink-0 bg-slate-300" aria-hidden="true" />
                <div className="min-w-0">
                  <code className={`text-xs font-semibold ${route.accent}`}>{route.path}</code>
                  <p className="text-sm text-slate-700">{route.app}</p>
                  <p className="text-xs text-slate-400">{route.stack}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          {TOPICS.map((topic) => (
            <div key={topic.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="text-sm font-bold text-slate-900">{topic.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{topic.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
