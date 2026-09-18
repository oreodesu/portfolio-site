import { UnauthorizedError, getToken } from "./auth";
import { AuthUser, authResponseSchema, authUserSchema } from "./schemas";

export type { AuthUser };

const BASE_URL = "/api/expense/api/v1";

// 誰でも中身を確認できるようにするための公開デモアカウント (db/seeds.rb で作成される)
export const DEMO_CREDENTIALS = {
  email: "demo@example.com",
  password: "demopassword",
};

function extractErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === "object" && body !== null && "error" in body) {
    const error = (body as { error: unknown }).error;
    if (Array.isArray(error)) return error.join(" / ");
    if (typeof error === "string") return error;
  }
  return fallback;
}

async function postAuth(path: string, payload: unknown, fallbackMessage: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(extractErrorMessage(body, fallbackMessage));
  }
  return authResponseSchema.parse(body);
}

export function signup(email: string, password: string) {
  return postAuth("/signup", { user: { email, password } }, "登録に失敗しました");
}

export function login(email: string, password: string) {
  return postAuth("/login", { email, password }, "ログインに失敗しました");
}

/** 保存済みトークンがまだ有効かを確認する */
export async function fetchCurrentUser(): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${getToken() ?? ""}` },
  });

  if (res.status === 401) throw new UnauthorizedError();
  if (!res.ok) throw new Error("ユーザー情報の取得に失敗しました");

  const body = (await res.json()) as { user: unknown };
  return authUserSchema.parse(body.user);
}
