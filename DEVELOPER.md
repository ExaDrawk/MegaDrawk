# 開発者ガイド

## 開発

```bash
npm ci
npm run dev
```

Astroの開発サーバーは`http://localhost:4321`で起動します。

## 設計

Astroが公開ページを静的HTMLとして生成し、Reactは操作が必要な部分だけをislandとしてhydrateします。

- 共通HTML・SEO: `src/layouts/SiteLayout.astro`
- ページ: `src/pages/`
- 操作UI: `src/components/`（`client:load`を必要な箇所だけに付与）
- ビジネスルール: `src/domain/`
- ブラウザ保存: `src/infra/`
- セキュリティヘッダー: `public/_headers`

静的サイトであるため、リクエストごとのmiddleware、サーバーnonce、SSR、Workers専用設定は使用しません。

## ブログ運用

1. `/admin/posts/new`で記事情報を入力します。
2. 生成された`createBlogPost(...)`を`src/config/blog.ts`へ追加します。
3. `npm run lint && npm run typecheck && npm run test && npm run build`を実行します。
4. `dist/`の生成結果を確認してPagesへデプロイします。

## 運用上の注意

- `PUBLIC_ADSENSE_CLIENT`は公開ビルド時に使用する公開識別子です。秘密情報は置きません。
- コメントと草案はlocalStorageのみで、ユーザー間共有や復旧はできません。
- `public/_headers`のCSPを変更した場合は、AdSense、フォント、画像、ブラウザコンソールを本番相当環境で確認します。
- Pagesのビルド成果物以外に、WorkersやOpenNextの成果物をデプロイしません。
