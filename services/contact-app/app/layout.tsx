import type { Metadata } from "next";

import SiteHeader from "./SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "お問い合わせ | Portfolio",
  description: "ポートフォリオサイトのお問い合わせフォームです。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">
        <SiteHeader />
        {children}
        <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} Portfolio
        </footer>
      </body>
    </html>
  );
}
