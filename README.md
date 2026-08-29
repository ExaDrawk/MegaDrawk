# MEGADRAWK

Astro 7 + React islands + Tailwind CSS 4で構成した静的ポートフォリオ／ブログサイトです。生成物はCloudflare Pagesへ直接配信します。Node.js 22.12以上を使用します。

## セットアップ

```bash
npm ci
copy .env.example .env
npm run dev
```

AdSenseを使う場合は`.env`の`PUBLIC_ADSENSE_CLIENT`を設定します。

## 品質ゲート

```bash
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run build
npm run e2e
```

`npm run build`は`dist/`へ静的HTML、CSS、JavaScript、manifest、robots、sitemapを生成します。

## Cloudflare Pages

Pagesのビルド設定は次のとおりです。

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: `.node-version`で固定

`public/_headers`が静的セキュリティヘッダーの正本です。Astroが生成するhash付きCSPと組み合わせ、Pagesがデプロイ時に適用します。

## 構成

- `src/pages/`: URLごとのAstroエントリーポイント
- `src/layouts/`: HTML、SEO、共通レイアウト
- `src/components/`: React islandsと共有UI
- `src/domain/`: ブログ・コメントのルール
- `src/infra/`: localStorageなどブラウザ側の保存処理
- `src/config/`: サイト・テーマ・ブログの正本
- `public/`: 静的アセットとPages設定

ブログ本文は`src/config/blog.ts`の`BLOG_POSTS`に追加します。管理画面は公開用CMSではなく、`createBlogPost(...)`のコードを生成するローカル補助画面です。コメントと草案はブラウザのlocalStorageに保存され、サーバー間で共有されません。
