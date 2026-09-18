import { NextResponse } from "next/server";

import { insertMessage } from "@/lib/db";
import { contactSchema } from "@/lib/schema";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { errors: parsed.error.issues.map((issue) => issue.message) },
      { status: 422 },
    );
  }

  try {
    await insertMessage(parsed.data);
  } catch (error) {
    console.error("failed to save contact message:", error);
    return NextResponse.json({ errors: ["送信に失敗しました。時間をおいて再度お試しください。"] }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
