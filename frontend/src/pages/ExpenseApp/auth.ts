const TOKEN_KEY = "expense_auth_token";

// プライベートブラウジング等で localStorage が例外を投げる場合があるため、
// 読み書きは常に失敗しうる前提で扱う (未ログイン扱いにフォールバックする)
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // 保存できない環境ではセッション内のみのログインになる
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // 消せなくても致命的ではない
  }
}

/** トークン切れ・未ログインを他のエラーと区別するための型 */
export class UnauthorizedError extends Error {
  constructor(message = "ログインが必要です") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
