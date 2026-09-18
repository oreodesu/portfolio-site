import mysql from "mysql2/promise";

// Next.jsの開発時はモジュールが再評価されるため、グローバルに保持して接続プールの増殖を防ぐ
const globalForDb = globalThis as unknown as { contactPool?: mysql.Pool };

export function getPool(): mysql.Pool {
  if (!globalForDb.contactPool) {
    globalForDb.contactPool = mysql.createPool({
      host: process.env.DB_HOST ?? "db",
      database: process.env.DB_NAME ?? "contact_db",
      user: process.env.DB_USER ?? "contact_app",
      password: process.env.DB_PASSWORD ?? "",
      waitForConnections: true,
      connectionLimit: 5,
    });
  }

  return globalForDb.contactPool;
}

export async function insertMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await getPool().execute(
    "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
    [input.name, input.email, input.message],
  );
}
