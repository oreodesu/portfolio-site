import ProjectCard from "../components/ProjectCard";
import SectionNav from "../components/SectionNav";
import AboutMe from "./AboutMe";
import AppGuide from "./AppGuide";
import Architecture from "./Architecture";
import ContactSection from "./ContactSection";

export default function Home() {
  return (
    <>
      <SectionNav />

      <section>
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Portfolio</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">ようこそ</h1>
          <p className="mt-4 leading-relaxed text-slate-600">
            普段の学習・制作の成果として、技術スタックの異なる4つのアプリをまとめたポートフォリオサイトです。
            お問い合わせフォームも含め、すべて実際に操作できます。
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ProjectCard
            title="TODOアプリ"
            stack="Go (Gin) / React"
            description="シンプルなタスク管理アプリ。作成・完了・編集・削除ができます。"
            href="/works/todo"
          />
          <ProjectCard
            title="家計簿アプリ"
            stack="Ruby on Rails / React"
            description="ログイン付きの家計簿。カテゴリ別に支出を記録し、合計を自動集計します。"
            href="/works/expense"
            recommended
          />
          <ProjectCard
            title="URL短縮サービス"
            stack="PHP / Vue3"
            description="長いURLを短縮し、アクセス数を計測する独立したミニアプリです。"
            href="/urlshortener/"
            external
          />
          <ProjectCard
            title="お問い合わせフォーム"
            stack="Next.js / MySQL"
            description="画面とAPIをNext.jsだけで構成したフォーム。送信内容はDBに保存されます。"
            href="/contact"
            external
          />
        </div>
      </section>

      <AboutMe />
      <AppGuide />
      <Architecture />
      <ContactSection />
    </>
  );
}
