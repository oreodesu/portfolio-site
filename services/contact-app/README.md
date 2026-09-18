# contact-app (Next.js App Router)

お問い合わせフォーム。画面とAPIの両方をNext.jsだけで完結させています。送信内容はMySQL (`contact_db`) の `contact_messages` テーブルに保存します。

## 構成

| パス | 内容 |
| --- | --- |
| `app/page.tsx` | フォーム画面 (Client Component) |
| `app/api/contact/route.ts` | 送信を受け取るAPI Route (Route Handler) |
| `lib/schema.ts` | Zodスキーマ。画面とAPIの両方で同じ定義を使う |
| `lib/db.ts` | MySQLの接続プールと保存処理 |

`next.config.mjs` で `basePath: "/contact"` を指定しているため、nginxの `/contact` 配下にそのまま配置できます。

## 設計メモ

- 入力検証は画面側とAPI側の両方で実行します。クライアント側の検証はブラウザの開発者ツールから回避できるため、サーバー側の検証が実質的な防御線になります
- 接続プールはグローバルに保持しています。開発時のホットリロードでモジュールが再評価されるたびにプールが増えるのを防ぐためです
- メール通知は実装していません。まずはDBに残す構成とし、必要になった時点で通知を追加できるようにしています

## ローカル実行

```bash
cd services/contact-app
pnpm install
DB_HOST=127.0.0.1 DB_NAME=contact_db DB_USER=contact_app DB_PASSWORD=xxx pnpm run dev
# → http://localhost:3100/contact
```

## 環境変数

- `DB_HOST` (デフォルト: db)
- `DB_NAME` (デフォルト: contact_db)
- `DB_USER` (デフォルト: contact_app)
- `DB_PASSWORD`
