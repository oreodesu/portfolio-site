import { UnauthorizedError, getToken } from "./auth";
import {
  Category,
  Expense,
  categoryListSchema,
  categorySchema,
  expenseListSchema,
  expenseSchema,
} from "./schemas";

export type { Category, Expense };

const BASE_URL = "/api/expense/api/v1";

async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${getToken() ?? ""}`,
      ...init.headers,
    },
  });

  // トークン切れは呼び出し側でログイン画面に戻すため、専用の型で投げ分ける
  if (res.status === 401) throw new UnauthorizedError();
  if (!res.ok) throw new Error(`request failed: ${res.status}`);

  return res;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await request("/categories");
  return categoryListSchema.parse(await res.json());
}

export async function createCategory(name: string): Promise<Category> {
  const res = await request("/categories", {
    method: "POST",
    body: JSON.stringify({ category: { name } }),
  });
  return categorySchema.parse(await res.json());
}

export async function deleteCategory(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken() ?? ""}` },
  });

  if (res.status === 401) throw new UnauthorizedError();

  // 支出で使用中の場合、サーバーが理由を返すのでそのまま画面に出せるようにする
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const error = (body as { error?: unknown } | null)?.error;
    throw new Error(Array.isArray(error) ? error.join(" / ") : "カテゴリの削除に失敗しました");
  }
}

export async function fetchExpenses(): Promise<Expense[]> {
  const res = await request("/expenses");
  return expenseListSchema.parse(await res.json());
}

export interface ExpenseInput {
  category_id: number;
  amount: number;
  spent_on: string;
  memo?: string;
}

export async function createExpense(input: ExpenseInput): Promise<Expense> {
  const res = await request("/expenses", {
    method: "POST",
    body: JSON.stringify({ expense: input }),
  });
  return expenseSchema.parse(await res.json());
}

export async function updateExpense(id: number, input: ExpenseInput): Promise<Expense> {
  const res = await request(`/expenses/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ expense: input }),
  });
  return expenseSchema.parse(await res.json());
}

export async function deleteExpense(id: number): Promise<void> {
  await request(`/expenses/${id}`, { method: "DELETE" });
}
