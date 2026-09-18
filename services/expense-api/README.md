# expense-api (Ruby on Rails, API mode)

家計簿アプリのバックエンド。カテゴリ別に支出を記録し、月次・カテゴリ別の集計API (`/api/v1/expenses/summary`) を提供します。

## 注意: このディレクトリは手書きの最小スケルトンです

`rails new` を実行せずに、起動に必要な最低限のファイル(`config/boot.rb` 〜 `config/environments/*`、モデル・コントローラ・マイグレーション・ルーティング・Gemfileなど)を手で配置しています。`bundle exec rails server` / `bundle exec puma` で起動する分には動きますが、以下は含まれていないので、必要になったら別途用意してください。

- `bin/rails` などの利便性のためのbinstub一式(無くても `bundle exec rails ...` で代用可能)
- `rspec-rails` のテスト設定 (`.rspec` / `spec/rails_helper.rb` など)。CIの `bundle exec rspec` はこのままでは実行できません
- 暗号化credentials (`config/master.key` / `config/credentials.yml.enc`) は使わない設計にしています。`secret_key_base` は `SECRET_KEY_BASE` 環境変数から読む方式です(`config/environments/production.rb` 参照)

## エンドポイント

| Method | Path | 説明 |
| --- | --- | --- |
| GET | /healthz | ヘルスチェック |
| GET | /api/v1/categories | カテゴリ一覧 |
| POST | /api/v1/categories | カテゴリ作成 |
| GET | /api/v1/expenses | 支出一覧 |
| POST | /api/v1/expenses | 支出登録 |
| PATCH | /api/v1/expenses/:id | 支出更新 |
| DELETE | /api/v1/expenses/:id | 支出削除 |
| GET | /api/v1/expenses/summary?year=&month= | カテゴリ別月次集計 |

## ローカル実行

```bash
bundle install
SECRET_KEY_BASE=$(ruby -rsecurerandom -e "puts SecureRandom.hex(64)") \
  DATABASE_HOST=127.0.0.1 DATABASE_USER=root DATABASE_PASSWORD= \
  bundle exec rails db:create db:migrate
SECRET_KEY_BASE=xxx bundle exec rails server
```
