import { z } from "zod";

// 同じスキーマをクライアントの入力チェックとAPI Routeの検証の両方で使う。
// クライアント側の検証は回避できるため、サーバー側でも必ず通す。
export const contactSchema = z.object({
  name: z.string().trim().min(1, "お名前を入力してください").max(50, "お名前は50文字以内で入力してください"),
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください")
    .email("メールアドレスの形式が正しくありません")
    .max(255, "メールアドレスが長すぎます"),
  message: z
    .string()
    .trim()
    .min(10, "お問い合わせ内容は10文字以上で入力してください")
    .max(2000, "お問い合わせ内容は2000文字以内で入力してください"),
});

export type ContactInput = z.infer<typeof contactSchema>;
