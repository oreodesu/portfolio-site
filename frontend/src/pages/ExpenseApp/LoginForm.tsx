import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthUser, DEMO_CREDENTIALS, login, signup } from "./authApi";
import { LoginFormValues, loginFormSchema, signupFormSchema } from "./schemas";
import { inputClass } from "./styles";

interface LoginFormProps {
  onAuthenticated: (token: string, user: AuthUser) => void;
}

type Mode = "login" | "signup";

export default function LoginForm({ onAuthenticated }: LoginFormProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(mode === "login" ? loginFormSchema : signupFormSchema),
    defaultValues: { email: "", password: "" },
  });

  async function authenticate(action: () => Promise<{ token: string; user: AuthUser }>) {
    setServerError(null);

    try {
      const { token, user } = await action();
      onAuthenticated(token, user);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "処理に失敗しました");
    }
  }

  const onSubmit = handleSubmit((values) =>
    authenticate(() =>
      mode === "login" ? login(values.email, values.password) : signup(values.email, values.password),
    ),
  );

  function switchMode() {
    setMode(mode === "login" ? "signup" : "login");
    setServerError(null);
    reset();
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">
        {mode === "login" ? "ログイン" : "アカウント作成"}
      </h2>
      <p className="mt-1 text-sm text-slate-500">家計簿は個人のデータを扱うため、ログインが必要です。</p>

      <button
        type="button"
        onClick={() => authenticate(() => login(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password))}
        disabled={isSubmitting}
        className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-60"
      >
        デモアカウントで試す
      </button>
      <p className="mt-1.5 text-xs text-slate-400">サンプルデータ入りのアカウントにそのままログインします。</p>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">または</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-3">
        <div>
          <label htmlFor="email" className="text-xs font-medium text-slate-600">
            メールアドレス
          </label>
          <input id="email" type="email" autoComplete="email" {...register("email")} className={`${inputClass} mt-1 w-full`} />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="text-xs font-medium text-slate-600">
            パスワード
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            {...register("password")}
            className={`${inputClass} mt-1 w-full`}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          ) : (
            mode === "signup" && <p className="mt-1 text-xs text-slate-400">8文字以上で入力してください。</p>
          )}
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {mode === "login" ? "ログイン" : "アカウントを作成"}
        </button>
      </form>

      <button
        type="button"
        onClick={switchMode}
        className="mt-4 w-full text-xs font-medium text-blue-600 transition hover:text-blue-700"
      >
        {mode === "login" ? "アカウントをお持ちでない方はこちら" : "すでにアカウントをお持ちの方はこちら"}
      </button>
    </div>
  );
}
