export default function ContactSection() {
  return (
    <section id="contact" className="mt-20 scroll-mt-24">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-400">Contact</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">お問い合わせ</h2>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-8 sm:px-8">
          <p className="text-sm font-medium text-blue-100">Next.js (App Router) + MySQL</p>
          <p className="mt-2 text-xl font-bold text-white">お仕事のご相談・ご質問はこちらから</p>
          <p className="mt-2 text-sm leading-relaxed text-blue-50">
            お問い合わせフォーム自体も、このポートフォリオの制作物のひとつです。
            画面とAPIをNext.jsだけで構成し、送信内容はMySQLに保存しています。
          </p>
          <a
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
          >
            フォームを開く
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
