import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="py-12 text-center">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-400">404</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">ページが見つかりません</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">
        URLが間違っているか、ページが移動した可能性があります。
      </p>

      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        トップページへ戻る
      </Link>
    </section>
  );
}
