# urlshortener-api (PHP)

URL短縮サービスのバックエンド。フレームワークは使わず、素のPHP + PDOで実装したシンプルな構成です。MySQL (共有DBコンテナの `shortener_db`) にリンク情報を保存します。

## エンドポイント

| Method | Path | 説明 |
| --- | --- | --- |
| GET | /healthz | ヘルスチェック |
| GET | /links | 発行済みリンク一覧 |
| POST | /links | 短縮URL発行 (`{"url": "https://..."}`) |
| GET | /s/{code} | 元URLへリダイレクト (アクセス数をカウント) |

nginx経由では `/api/shorten/links` や `/s/{code}` としてアクセスします(トップレベルREADMEのルーティング表を参照)。

## ローカル実行

```bash
cd services/urlshortener-api
composer install
DB_HOST=127.0.0.1 DB_NAME=shortener_db DB_USER=shortener_app DB_PASSWORD=xxx \
  php -S 0.0.0.0:8000 -t public public/index.php
```
