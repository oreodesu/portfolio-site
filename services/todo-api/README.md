# todo-api (Go + Gin)

TODOアプリのバックエンド。SQLite (`modernc.org/sqlite`, pure Go実装) にデータを永続化します。

## エンドポイント

| Method | Path | 説明 |
| --- | --- | --- |
| GET | /healthz | ヘルスチェック |
| GET | /todos | 一覧取得 |
| POST | /todos | 作成 (`{"title": "..."}`) |
| PATCH | /todos/:id | 更新 (`{"title": "...", "done": true}`) |
| DELETE | /todos/:id | 削除 |

## ローカル実行

```bash
cd services/todo-api
go mod tidy   # go.sum を生成 (未コミット)
TODO_DB_PATH=./todo.db go run ./cmd/server
```

### ホットリロード (Air)

ファイル変更を検知して自動でビルド・再起動してくれる [Air](https://github.com/air-verse/air) の設定 (`.air.toml`) を同梱しています。

```bash
go install github.com/air-verse/air@latest
cd services/todo-api
air
```

## 環境変数

- `TODO_API_PORT` (デフォルト: 8080)
- `TODO_DB_PATH` (デフォルト: ./todo.db)
