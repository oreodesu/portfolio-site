# Portfolio Site

## デモ動画（容量重く画質落としています）
https://github.com/user-attachments/assets/55df3cfc-3f63-464b-b5e0-0abab7d3ad29

これまでに作ってきたミニアプリを1つのサイトに集約したポートフォリオです。トップページから、技術スタックの異なる4つのアプリに実際に触れます。「動くものを並べる」だけでなく、**それぞれのスタックで妥当とされる設計に寄せる**ことを主眼に置いて構成しています。

## 設計方針

複数の言語・フレームワークが同居する構成のため、ディレクトリの切り方には以下の考え方を採用しています。

### 1. モノレポ + サービス単位の独立

各アプリは `services/` 配下で完全に分離し、**各サービスが自分のデータだけを所有する**方針にしています。他サービスのテーブルを直接参照することはなく、やり取りが必要ならHTTP API経由になります(現状は独立しているため通信自体が発生しません)。DBコンテナは1台を共有してコストを抑えつつ、`expense_db` / `shortener_db` / `contact_db` とデータベースとユーザーを分け、権限レベルで越境できないようにしています。

一方でリポジトリは分割せずモノレポにしました。1人で開発・デプロイする規模では、複数リポジトリのバージョン整合を取るコストの方が大きいという判断です。

### 2. バックエンドはスタックごとに「そのエコシステムの標準」へ寄せる

| サービス | 構成 | 採用理由 |
| --- | --- | --- |
| todo-api (Go) | レイヤードアーキテクチャ + リポジトリパターン | `handler`(HTTP) / `repository`(永続化) / `model`(データ構造) で責務を分離。ハンドラはSQLを知らず、リポジトリはHTTPを知らない。テスト時に層ごとの検証がしやすい |
| expense-api (Rails) | Rails Way (MVC) + APIバージョニング | 規約に逆らわないことが最大の利点になるフレームワークなので、独自構造を持ち込まず `app/models` `app/controllers/api/v1` の標準構成に従う |
| urlshortener-api (PHP) | フレームワーク無しの自前ルーティング | あえて素で書き、Router → Controller → Model → Database という最小の層構造を明示。フレームワークが裏で何をしているかを理解した上で使えることを示す意図 |
| contact-app (Next.js) | App Router + Route Handler | 画面とAPIを1つのアプリで完結させる構成。Zodのスキーマを画面とサーバーで共有し、検証ルールを二重管理しない |

### 3. フロントエンドは機能単位のコロケーション

`frontend/src/pages/TodoApp/` のように、**画面とそのAPIクライアントを同じディレクトリに同居**させています。「TODO機能を触る時はこのフォルダだけ見ればよい」状態を保つためです。技術的な種類(components / hooks / api)で全体を割る方式は、機能追加のたびに複数の遠いディレクトリを行き来することになるため採用していません。複数画面で共有するものだけ `components/` に置いています。

### 4. 単一エントリポイント

全サービスをnginxのリバースプロキシ配下に置き、パスで振り分けています。フロントエンドから見ると接続先は常に同一オリジンなので、CORS設定やAPIごとのホスト管理が不要になります。

### 意図的に採用しなかったこと

設計は「何を選んだか」と同じくらい「何を選ばなかったか」が重要だと考えているため、判断の記録を残しています。

- **DDDの戦術的パターン(集約・値オブジェクト・ドメインサービス)**: ドメインが「TODOを追加する」「支出を記録する」程度の複雑さしかなく、導入しても防げるバグより増える記述量の方が多いと判断しました。現状はレイヤードアーキテクチャ + リポジトリパターンに留めています。ドメインロジックが育った場合に移行しやすいよう、永続化の実装はリポジトリの内側に閉じ込めてあります。
- **マイクロサービス化 / コンテナオーケストレーション(ECS・Kubernetes)**: サービスは分離していますが、実行環境はEC2 1台にDocker Composeで同居させています。この規模では運用コストと金銭コストが利点を上回るためです。
- **マネージドDB (RDS)**: コスト最小化を優先し、DBもコンテナとして同一ホストに載せています。可用性とバックアップの自動化を捨てる代わりに、月額をEC2 1台分に抑える判断です。

## 認証機能について (実装範囲と既知の割り切り)

家計簿アプリのみ、JWTによる認証を実装しています(サインアップ / ログイン / デモアカウント)。個人の金銭データを扱うため機能的に認証が自然であること、Railsが `has_secure_password` を標準で持つことから、この1アプリに絞りました。3アプリ共通の認証基盤にすると、トークン検証をGo・Rails・PHPの3言語で実装することになり、題材の規模に対して複雑さが見合わないためです。

**実装している内容**

- パスワードはbcryptでハッシュ化(`has_secure_password`)。平文では保存しません
- ログイン失敗時、「アカウントが存在しない」と「パスワードが違う」で応答を変えていません(アカウントの存在有無を推測されないため)
- カテゴリ・支出はすべてログイン中のユーザーに紐づき、他人のデータは取得・更新・削除・集計のいずれでも参照できません。これはリクエストテストで検証しています
- 支出は `category_id` と `user_id` の両方を持つため、カテゴリの持ち主と支出の持ち主がずれないことをモデルのバリデーションで保証しています

**あえて実装していない内容**

学習用のポートフォリオとして、本番運用に必要だが今回の主題ではない要素は意図的に省いています。実務では以下の対応が必要です。

| 未対応の項目 | 現状 / 本来必要な対応 |
| --- | --- |
| トークンの保管場所 | localStorageに保存しているため、XSSが発生するとトークンを盗まれます。本来はhttpOnly Cookieを使うか、XSS対策を徹底した上で採用を判断すべき箇所です |
| ログアウト時のトークン失効 | クライアント側でトークンを破棄するだけで、サーバー側では有効期限(24時間)まで有効なままです。即時失効させるには失効リスト(またはリフレッシュトークン方式)が必要です |
| トークンの再発行 | リフレッシュトークンが無いため、24時間経つと再ログインが必要です |
| ログイン試行の制限 | レート制限やアカウントロックが無く、総当たり攻撃を防げません |
| パスワードリセット / メールアドレス確認 | 未実装です。メール送信基盤が必要になるため今回の範囲外としました |
| 通信の暗号化 | 現状HTTP配信のため、トークンが平文で流れます。公開する場合はHTTPS化が前提です |
| デモアカウントの資格情報 | 誰でも試せるよう、フロントエンドのコードに直接埋め込んでいます(公開前提のアカウントのため意図的な判断です) |

## サイト構成

| 項目                     | 内容                                                                         |
| ------------------------ | ---------------------------------------------------------------------------- |
| トップページ             | React + TypeScript。自己紹介 + 各制作物への導線                             |
| 制作物1: TODOアプリ      | バックエンド: Go (Gin) / フロント: トップページと共通のReact                 |
| 制作物2: 家計簿アプリ    | バックエンド: Ruby on Rails (API mode) / フロント: トップページと共通のReact |
| 制作物3: URL短縮サービス | バックエンド: PHP / フロント: 独立したVue3 + TypeScriptのミニアプリ          |
| 制作物4: お問い合わせ    | Next.js (App Router)。画面とAPIを1つのアプリで完結し、送信内容はMySQLに保存  |

トップページ・TODO・家計簿は同じReactアプリ内のページ(ルート)として実装し、URL短縮サービスとお問い合わせフォームは技術スタックを変えて完全に独立したアプリとして構成しています。

## ディレクトリ構成

```
portfolio-site/
├── .github/workflows/      # GitHub Actions (サービスごとのCI + 手動デプロイ)
├── frontend/               # メインサイト (React + TS) : トップページ / TODO UI / 家計簿 UI
├── frontend-urlshortener/  # URL短縮サービス専用フロント (Vue3 + TS)
├── services/
│   ├── todo-api/           # Go + Gin, SQLite
│   ├── expense-api/        # Ruby on Rails (API mode), MySQL
│   ├── urlshortener-api/   # PHP, MySQL
│   ├── contact-app/        # Next.js (App Router), MySQL
│   └── db-init/            # MySQL初期化 (アプリごとのDB・ユーザー作成)
├── nginx/                  # リバースプロキシ設定 (全サービスをパスで振り分け)
├── infra/terraform/        # AWSインフラ定義 (EC2 1台構成)
├── docker-compose.yml      # ローカル / 本番共通のオーケストレーション定義
└── env.sample              # 環境変数のテンプレート (コピーして .env を作る)
```

## ルーティング設計 (nginx)

単一のEC2インスタンス上で、パスベースのリバースプロキシで全サービスを収容する構成です。

| パス             | 転送先                              | 説明                             |
| ---------------- | ----------------------------------- | -------------------------------- |
| `/`              | frontend (React static)             | トップページ・TODO UI・家計簿 UI |
| `/api/todo/*`    | todo-api (Go)                       | TODOアプリ API                   |
| `/api/expense/*` | expense-api (Rails)                 | 家計簿アプリ API                 |
| `/urlshortener/` | frontend-urlshortener (Vue3 static) | URL短縮サービスの画面            |
| `/api/shorten/*` | urlshortener-api (PHP)              | 短縮URL発行 API                  |
| `/s/:code`       | urlshortener-api (PHP)              | 短縮URLのリダイレクト先          |
| `/contact`       | contact-app (Next.js)               | お問い合わせフォームとAPI        |

## データベース方針 (コスト最小化)

- **todo-api (Go)**: SQLiteファイルをコンテナ内ボリュームに永続化。追加DBコンテナ不要。
- **expense-api (Rails) / urlshortener-api (PHP) / contact-app (Next.js)**: 1台のMySQLコンテナを共有し、`expense_db` / `shortener_db` / `contact_db` とデータベースを分ける。DBエンジンを増やさずメモリ消費を抑える狙い。

RDSなどのマネージドDBは使わず、すべてEC2上のDockerコンテナでホストします。

---

# ローカルで動かす手順

## 0. 必要なソフトウェア

| ソフトウェア   | 用途                           | 確認コマンド             |
| -------------- | ------------------------------ | ------------------------ |
| Docker Desktop | 全サービスの起動               | `docker compose version` |
| Node.js 20以上 | フロントエンドの開発サーバー   | `node -v`                |
| pnpm           | フロントエンドのパッケージ管理 | `pnpm -v`                |

pnpmが入っていない場合は、Node.js同梱のcorepackで有効化できます(追加インストール不要)。

```bash
corepack enable
```

Docker Desktopは**アプリを起動しておく必要があります**。メニューバーのクジラアイコンが安定した状態になっていればOKです。以下でエラーが出なければ準備完了です。

```bash
docker info
```

## 1. 環境変数ファイル `.env` を作る

リポジトリ直下(`docker-compose.yml` と同じ階層)で実行します。

```bash
cd portfolio-site
cp env.sample .env
```

`.env` を開き、`change_me_*` となっている値を任意の文字列に変更します。ローカル検証用なので複雑である必要はありません。

```
MYSQL_ROOT_PASSWORD=local_root_pass
MYSQL_EXPENSE_PASSWORD=local_expense_pass
MYSQL_SHORTENER_PASSWORD=local_shortener_pass
```

`SECRET_KEY_BASE`(Railsが使う署名鍵)はランダムな文字列が必要です。以下で生成して貼り付けてください。

```bash
ruby -rsecurerandom -e "puts SecureRandom.hex(64)"
```

> `.env` は `.gitignore` 済みなので、コミットされることはありません。

## 2. 全サービスをDockerで起動する

```bash
docker compose up -d --build
```

初回はイメージのビルドで5〜10分程度かかります。完了後、以下で全サービスの状態を確認します。

```bash
docker compose ps
```

`db` が `healthy`、それ以外が `Up` になっていれば成功です。

ブラウザで以下にアクセスできます。

| URL                            | 画面            |
| ------------------------------ | --------------- |
| http://localhost/              | トップページ    |
| http://localhost/works/todo    | TODOアプリ      |
| http://localhost/works/expense | 家計簿アプリ    |
| http://localhost/urlshortener/ | URL短縮サービス |
| http://localhost/contact       | お問い合わせ    |

## 3. 各アプリの使い方

**TODOアプリ**: 入力欄にやることを入れて「追加」。チェックボックスで完了、緑の「編集」で内容修正、赤の「削除」で削除できます(保存・削除時は確認ダイアログが出ます)。

**家計簿アプリ**: ログインが必要です。**「デモアカウントで試す」を押すと、サンプルデータ入りの状態で即座に利用できます**(アカウント登録も可能です)。ログイン後、カテゴリを追加してから支出を登録します。一覧の上部に合計金額が表示され、検索窓とカテゴリ順の並び替えも使えます。データはユーザーごとに分離されているため、別アカウントを作ると中身は空から始まります。

**URL短縮サービス**: URLを入れて「短縮する」。一覧の「コピー」で短縮URLをクリップボードにコピー、「サイトに遷移」で元のページを開けます。

**お問い合わせフォーム**: 名前・メールアドレス・内容を入力して送信します。送信内容は `contact_db` の `contact_messages` テーブルに保存されます(メール通知は実装していません)。

## 4. フロントエンドを編集しながら開発する場合

コードを変えた瞬間に画面へ反映させたい場合は、バックエンドだけDockerで動かし、フロントエンドはViteの開発サーバーで起動します。

まず依存パッケージをインストールします(初回のみ)。

```bash
cd frontend && pnpm install
cd ../frontend-urlshortener && pnpm install
```

バックエンド一式を起動します。

```bash
cd ..
docker compose up -d db todo-api expense-api urlshortener-api contact-app reverse-proxy
```

別のターミナルタブでフロントエンドの開発サーバーを起動します。

```bash
# メインサイト (React)
cd frontend && pnpm run dev
# → http://localhost:5173/

# URL短縮サービス (Vue3) : さらに別のタブで
cd frontend-urlshortener && pnpm run dev
# → http://localhost:5174/urlshortener/
```

Viteの設定で、このアプリが持たないパス (`/api` `/contact` `/urlshortener` `/s/`) を `http://localhost:80`(nginx)へ転送しています。そのため開発サーバー(5173)からでも、APIへの通信と他アプリへの画面遷移がそのまま動きます。

> **補足**: URL短縮サービスを単体で編集したい場合のみ、`frontend-urlshortener` の開発サーバー(5174)を使います。閲覧するだけなら5173からの遷移で足ります。

## 5. 停止・再起動・リセット

```bash
# 停止(データは残る)
docker compose stop

# 停止してコンテナを削除(データは残る)
docker compose down

# データベースも含めて完全に初期化してやり直す
docker compose down -v
docker compose up -d --build
```

`docker compose down -v` はMySQLとTODOのデータを**すべて削除**します。DBの認証エラーなどで作り直したい時に使ってください。

## 6. 困った時

| 症状                          | 原因と対処                                                                                                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docker info` がエラー        | Docker Desktopが起動していません。アプリを起動してください                                                                                                           |
| ポート80が使えないエラー      | 他のアプリがポート80を使用中です。`sudo lsof -i :80` で確認して停止するか、`docker-compose.yml` の `reverse-proxy` のポート設定を `"8080:80"` などに変更してください |
| `Access denied for user ...`  | `.env` を変更する前にDBが作られた可能性があります。`docker compose down -v` でボリュームごと作り直してください                                                       |
| 特定のサービスが `Restarting` | `docker compose logs <サービス名> --tail 50` でエラー内容を確認してください                                                                                          |
| 画面は出るがAPIがエラー       | `docker compose ps` で `reverse-proxy` が起動しているか確認してください                                                                                              |

各サービス固有の開発コマンド(Goのホットリロード、Railsのマイグレーションなど)は、それぞれのディレクトリ内のREADMEを参照してください。

---

## インフラ (Terraform)

`infra/terraform/` に、コスト最小構成 (EC2 1台 + セキュリティグループ) のTerraformコードを配置しています。詳細は `infra/terraform/README.md` を参照してください。

## CI/CD

`.github/workflows/` にサービス単位でワークフローを分割して配置しています。

| ファイル | トリガー | 内容 |
| --- | --- | --- |
| `ci-frontend.yml` | `frontend/**` 変更時 | lint + build (React) |
| `ci-frontend-urlshortener.yml` | `frontend-urlshortener/**` 変更時 | build (Vue3) |
| `ci-todo-api.yml` | `services/todo-api/**` 変更時 | go vet / build / test |
| `ci-expense-api.yml` | `services/expense-api/**` 変更時 | MySQL起動 + マイグレーション + RSpec |
| `ci-urlshortener-api.yml` | `services/urlshortener-api/**` 変更時 | composer install + 構文チェック |
| `ci-contact-app.yml` | `services/contact-app/**` 変更時 | build (Next.js) |
| `deploy.yml` | 手動実行のみ | SSHでEC2へ接続し `git pull` + `docker compose up -d --build` |

- CIは変更があったディレクトリのワークフローだけが走ります。
- `deploy.yml` は `workflow_dispatch` (手動実行) のみです。`EC2_HOST` / `EC2_SSH_USER` / `EC2_SSH_PRIVATE_KEY` の3つをGitHub Secretsに登録するまで動作しません。意図せずデプロイが走らないよう、push契機のトリガーはあえて設定していません。
- EC2上の `.env` はgit管理外です。初回デプロイ前に手動でサーバー上へ配置してください。

## テスト

| 対象 | 件数 | 内容 |
| --- | --- | --- |
| expense-api (RSpec) | 70件 | モデルのバリデーション、APIのステータスとレスポンス構造、他ユーザーのデータが参照・更新・削除・集計のいずれでも見えないこと |
| todo-api (Go) | 14件 | リポジトリ層(実際のSQLiteに対して実行)とHTTPハンドラ層(`httptest` で実リクエストを送信) |

モックは使わず、実際のデータベースとHTTPリクエストで検証する方針にしています。

```bash
# Rails
docker compose exec -e RAILS_ENV=test expense-api bundle exec rspec

# Go
cd services/todo-api && go test ./...
```
