# MEGADRAWK

Next.js 16 + TypeScript + Tailwind CSS v4 で構築したポートフォリオサイトです。

## セットアップ

1. 依存インストール

npm ci

2. 環境変数の設定

NEXT_PUBLIC_ADSENSE_CLIENT を .env.local に設定します。
例: NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxxx

3. 開発サーバー起動

npm run dev

## 品質ゲート

- Lint: npm run lint
- 型チェック: npm run typecheck
- 単体テスト: npm run test
- E2Eテスト: npm run e2e （初回は `npm run e2e:install` でブラウザを導入）
- ビルド: npm run build
- セキュリティ監査: npm audit （0 vulnerabilities を維持）

## ブログ運用フロー

1. `src/config/blog.ts` の `BLOG_POSTS` に `createBlogPost(...)` を追加します。
2. `date` は公開日、追記した日は `updatedAt` に入れます。
3. `excerpt` は自動生成されるので、本文の冒頭120文字が一覧に出る前提で書きます。
4. 追加後は `npm run lint` と `npm run typecheck` を通します。
5. 公開画面に内部ファイル名や実装都合の文言が出ていないことを確認します。

### 管理画面で草案を作る手順

1. 開発サーバーで `/admin` もしくは `/admin/posts/new` を開きます。
2. タイトル・本文・日付・タグを入力してコード生成します。
3. 入力内容はブラウザに自動保存されるので、途中離脱しても復元できます。
4. 生成された `createBlogPost(...)` を `src/config/blog.ts` の `BLOG_POSTS` に貼り付けます。
5. 必要なら `updatedAt` を追加し、`npm run lint && npm run typecheck && npm run test` を実行します。

## 定期保守チェック

- 月1回: 依存更新（`npm audit` で 0 vulnerabilities を確認）、リンク切れ、法的ページの最終更新日確認
- 記事公開時: `title` / `description` / 日付 / タグ / sitemap 反映確認
- ブランド変更時: `src/config/site.ts` を更新し、個人名とサイト名の混線がないか確認
- UI変更時: loading / empty / error / success の各状態が崩れていないか確認
- デプロイ前: `npm run lint`, `npm run typecheck`, `npm run build`

## デプロイ

Cloudflare Pages 向け:

npm run deploy

このコマンドは Next.js ビルド、OpenNext ビルド、Pages 向け変換スクリプトを順番に実行します。

## 設計メモ

- サイト共通情報は src/config/site.ts に集約
- ブログ記事の生成ルールは src/domain/blog/post.ts に集約
- ブログ公開順と最新更新日は src/config/blog.ts に集約
- 管理用の記事草案生成は src/domain/blog/admin.ts と /admin/posts/new に集約
- 管理用の一時保存は src/infra/storage/blogDraftStorage.ts に集約
- コメント入力値の検証ルールは src/domain/comment/types.ts に集約
- 日付フォーマットは src/lib/date.ts に集約
- UI は loading / empty / error / success の状態を各ページで表現
- セキュリティヘッダーと CSP は middleware.ts で一元管理

## セキュリティ

- `middleware.ts` で許可HTTPメソッドを `GET/HEAD/OPTIONS` に制限し、不正なメソッドを 405 で即時拒否します。
- URL長は 2048 文字で制限し、過大リクエストを 414 で拒否します。
- `next.config.mjs` の `images.unoptimized=true` により、Next Image Optimizer を無効化しています。
- `npm audit` は本番・開発依存ともに 0 vulnerabilities を維持しています。
- コメントの入力値はドメイン層 (`src/domain/comment/types.ts`) で文字数制限・空値検証を行い、UI の `maxLength` 属性と単一の情報源を共有します。
- CSP の `style-src` には Tailwind CSS v4 との互換性のため暫定的に `'unsafe-inline'` を許可しています（TODO で追跡中）。
