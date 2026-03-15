# MEGADRAWK

Next.js 14 + TypeScript で構築したポートフォリオサイトです。

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
- テスト: npm run test
- ビルド: npm run build

## ブログ運用フロー

1. `src/config/blog.ts` の `BLOG_POSTS` に `createBlogPost(...)` を追加します。
2. `date` は公開日、追記した日は `updatedAt` に入れます。
3. `excerpt` は自動生成されるので、本文の冒頭120文字が一覧に出る前提で書きます。
4. 追加後は `npm run lint` と `npm run typecheck` を通します。
5. 公開画面に内部ファイル名や実装都合の文言が出ていないことを確認します。

## 定期保守チェック

- 月1回: 依存更新、リンク切れ、法的ページの最終更新日確認
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
- ブログ公開順と最新更新日は src/config/blog.ts に集約
- 日付フォーマットは src/lib/date.ts に集約
- UI は loading / empty / error / success の状態を各ページで表現
- セキュリティヘッダーと CSP は middleware.ts で一元管理

## セキュリティ補足

- `middleware.ts` で許可HTTPメソッドを `GET/HEAD/OPTIONS` に制限し、不正なメソッドを 405 で即時拒否します。
- URL長は 2048 文字で制限し、過大リクエストを 414 で拒否します。
- `next.config.js` の `images.unoptimized=true` により、Next Image Optimizer を無効化しています。
- Next.js 16 対応として `next.config.mjs` / `postcss.config.cjs` を採用しています。
- `npm audit` は Next.js 本体の高リスク警告を1件報告します。現行メジャーでの安全な追従可否を確認後、次期アップグレードで解消してください。
