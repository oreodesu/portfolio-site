"use client";

import { FormEvent, useState } from "react";

import { contactSchema } from "@/lib/schema";

type Status = "idle" | "submitting" | "done";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<string[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const input = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    const parsed = contactSchema.safeParse(input);
    if (!parsed.success) {
      setErrors(parsed.error.issues.map((issue) => issue.message));
      return;
    }

    setErrors([]);
    setStatus("submitting");

    try {
      const res = await fetch("/contact/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setErrors(body?.errors ?? ["送信に失敗しました。時間をおいて再度お試しください。"]);
        setStatus("idle");
        return;
      }

      setStatus("done");
    } catch {
      setErrors(["通信に失敗しました。時間をおいて再度お試しください。"]);
      setStatus("idle");
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-6 py-12">
      <a href="/" className="text-sm text-slate-500 transition hover:text-slate-900">
        &larr; Portfolio トップへ戻る
      </a>

      <p className="mt-6 text-sm font-medium uppercase tracking-wide text-slate-400">Contact</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">お問い合わせ</h1>
      <p className="mt-1 text-sm text-slate-500">Next.js (App Router) + MySQL</p>

      {status === "done" ? (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="font-medium text-emerald-800">送信しました</p>
          <p className="mt-1 text-sm text-emerald-700">
            お問い合わせありがとうございます。内容を確認のうえ、折り返しご連絡します。
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-4 rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100"
          >
            続けて送信する
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="text-xs font-medium text-slate-600">
              お名前
            </label>
            <input id="name" name="name" className={`${inputClass} mt-1`} />
          </div>

          <div>
            <label htmlFor="email" className="text-xs font-medium text-slate-600">
              メールアドレス
            </label>
            <input id="email" name="email" type="email" className={`${inputClass} mt-1`} />
          </div>

          <div>
            <label htmlFor="message" className="text-xs font-medium text-slate-600">
              お問い合わせ内容
            </label>
            <textarea id="message" name="message" rows={6} className={`${inputClass} mt-1 resize-y`} />
            <p className="mt-1 text-xs text-slate-400">10文字以上2000文字以内で入力してください。</p>
          </div>

          {errors.length > 0 && (
            <ul className="space-y-1 rounded-lg border border-red-200 bg-red-50 p-3">
              {errors.map((error) => (
                <li key={error} className="text-sm text-red-700">
                  {error}
                </li>
              ))}
            </ul>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {status === "submitting" ? "送信中..." : "送信する"}
          </button>
        </form>
      )}
    </main>
  );
}
