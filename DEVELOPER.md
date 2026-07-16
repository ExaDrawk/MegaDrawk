# 開発者ドキュメント (Developer Guide)

本ドキュメントは `AGENTS.md` の設計哲学に基づいた本プロジェクトの開発手法・設計意図・運用事項をまとめたものです。

## 1. セットアップと起動

本プロジェクトは Next.js 16 (App Router) + React 19 + Tailwind CSS v4 を採用しています。

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 単体テストの実行
npm run test

# E2Eテストの実行（初回はブラウザ導入が必要）
npm run e2e:install
npm run e2e

# 本番ビルド
npm run build

# セキュリティ監査
npm audit
```

## 2. アーキテクチャと設計意図

本プロジェクトは以下の層境界を意識して構築されています。

*   **UI層** (`src/app/`, `src/components/`)
    *   表示とユーザーインタラクションの責務を担います。
    *   ビジネスロジックは持たず、プレーンなコンポーネントとして実装されます。
*   **ドメイン・設定層** (`src/domain/`, `src/config/`, `src/lib/`)
    *   ブログの状態、コメント入力値の検証ルール、定数定義、ユースケースなどのビジネスルールを持ちます。
    *   `src/domain/comment/types.ts` はコメントの文字数制限・空値検証をドメイン知識として一元管理します。
    *   （例: `createBlogPost` は最低限の入力で有効な投稿データを作るドメインルールの表現です）
*   **インフラ層** (`src/infra/`)
    *   `CommentSection` で利用している状態永続化 (`localStorage`) はインフラ層の簡易的な代替です。本格的なバックエンドへ移行する際はこれを差し替えます。

### セキュリティと品質ゲート

*   **Fail Fast:** 問題は発生源で即座に検知し、ビルドやLintの段階で不正なコードを弾きます (ESLint 9 + Flat Config 適用済み)。
*   **ゼロトラスト:** セキュリティヘッダー (`middleware.ts`) により、XSS / Clickjacking 等を防ぐ堅牢なCSPを設定しています。
*   **依存ライブラリの安全性:** `npm audit` で本番・開発依存ともに 0 vulnerabilities を維持します。
*   **入力値検証の二重化:** コメント入力値は UI の `maxLength` 属性とドメイン層の `validateCommentInput` で二重に検証します（単一の情報源 `COMMENT_LIMITS` を共有）。

## 3. よくある変更手順

*   **ブログ記事の追加:**
    `src/config/blog.ts` にある `BLOG_POSTS` 配列に `createBlogPost({...})` を追加します。`date` は公開日、追記・修正日は `updatedAt` に入れてください。サイトマップはここから自動的に更新されます。
*   **テーマ・配色の変更:**
    `src/app/globals.css` のCSS変数、および `src/config/theme.ts` を修正することでサイト全体の色合いを統制できます。
*   **サイト名・運営者名の変更:**
    `src/config/site.ts` のみを更新します。公開名 (`name`) と運営者名 (`ownerName`) は別の知識として扱います。
*   **コメント文字数制限の変更:**
    `src/domain/comment/types.ts` の `COMMENT_LIMITS` のみを変更します。UI の `maxLength` 属性と検証ロジックは自動的に追従します。

## 4. 運用注意事項

*   現在ブログの「コメント機能」は LocalStorage を用いたクライアント完結型（プロトタイプ）です。複数ユーザー間での共有や、別ブラウザでの状態永続化が必要な場合は、データベース (PostgreSQL, D1 等) への移行が必須です (`tasks/todo.md` に将来の課題として記録してください)。
*   本番デプロイにあたっては、Cloudflare Pages/Workers (`open-next`, `wrangler.toml` 構成) のビルドフローに従って `npm run build` のエラーゼロを維持してください。
*   公開UIでは内部ファイルパスや実装ヘルパー名を表示しないでください。空状態文言はユーザー向けの表現を優先します。
