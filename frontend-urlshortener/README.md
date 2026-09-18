# frontend-urlshortener (Vue3 + TypeScript)

URL短縮サービス専用の、メインサイトとは独立したミニフロントエンドです。`vite.config.ts` の `base` を `/urlshortener/` にしているので、nginxの `/urlshortener/` 配下にそのまま配置できます。

## ローカル実行

```bash
cd frontend-urlshortener
pnpm install
pnpm run dev
```

pnpmが無い場合は `corepack enable` を一度実行してください。

## ビルド

```bash
pnpm run build
```
