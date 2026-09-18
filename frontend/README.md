# frontend (React + TypeScript)

トップページ・TODOアプリ画面・家計簿アプリ画面をまとめたメインのフロントエンドです(Vite + React Router)。

## ローカル実行

```bash
cd frontend
pnpm install
pnpm run dev
```

pnpmが無い場合は `corepack enable` (Node.js 16.9+に同梱) を一度実行すれば、`package.json` の `packageManager` 指定に従って自動的に使えるようになります。

`vite.config.ts` で `/api` へのリクエストを `http://localhost:80` (nginx経由) にプロキシしているので、`docker compose up` でバックエンド一式を起動した状態で `pnpm run dev` すると実際のAPIと繋がります。

## ビルド

```bash
pnpm run build   # tsc の型チェック + dist/ に静的ファイル生成
```
