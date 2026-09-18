import { z } from "zod";

// --- APIレスポンスの検証 ---
// バックエンドのレスポンス形状が変わった場合に、画面が壊れる前に気付けるようにする

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const expenseSchema = z.object({
  id: z.number(),
  amount: z.string(),
  spent_on: z.string(),
  memo: z.string().nullable(),
  category: categorySchema,
});

export const categoryListSchema = z.array(categorySchema);
export const expenseListSchema = z.array(expenseSchema);

export const authUserSchema = z.object({
  id: z.number(),
  email: z.string(),
});

export const authResponseSchema = z.object({
  token: z.string(),
  user: authUserSchema,
});

export type Category = z.infer<typeof categorySchema>;
export type Expense = z.infer<typeof expenseSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;

// --- フォーム入力の検証 ---

export const expenseFormSchema = z.object({
  categoryId: z.string().min(1, "カテゴリを選択してください"),
  amount: z
    .string()
    .min(1, "金額を入力してください")
    .refine((value) => Number(value) > 0, "金額は1円以上で入力してください"),
  spentOn: z.string().min(1, "日付を入力してください"),
  memo: z.string().max(200, "メモは200文字以内で入力してください"),
});

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "カテゴリ名を入力してください"),
});

export const loginFormSchema = z.object({
  email: z.string().min(1, "メールアドレスを入力してください").email("メールアドレスの形式が正しくありません"),
  password: z.string().min(1, "パスワードを入力してください"),
});

// サインアップ時のみ、バックエンドと同じ8文字以上の条件を課す
export const signupFormSchema = loginFormSchema.extend({
  password: z.string().min(8, "パスワードは8文字以上で入力してください"),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
