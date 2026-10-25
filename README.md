# MEGADRAWK

Astroで静的生成するポートフォリオサイトです。公開ページはHTML・CSSとして配信し、Reactはコメント・記事草案エディター・お問い合わせフォームだけで起動します。Next.js、OpenNext、サーバーレンダリングの実行基盤は不要です。メール送信だけCloudflare Pages Functions（functions/api/contact.ts）を使用します。

## セットアップ

Node.js 22.23.4以上（検証は24系）とnpmを使用します。

```sh
npm ci
npm run dev
```

開発サーバーは http://127.0.0.1:4321 です。機能は.env.localで有効化します（未設定の機能は出力されません。不正な値はビルドエラーになります）。

- `PUBLIC_ADSENSE_CLIENT`: 広告。`ca-pub-` + 16桁。
- `PUBLIC_TURNSTILE_SITE_KEY`: お問い合わせフォーム。Turnstileサイトキー（`0x` + 22文字）。
- `PUBLIC_CF_WEB_ANALYTICS_TOKEN`: アクセス解析。Cloudflare Web Analyticsのビーコントークン（32桁の16進）。

旧NEXT_PUBLIC_ADSENSE_CLIENTは使用しません。

## 検証

```sh
npm run e2e:install
npm run verify
```

verifyは文字コード、整形、lint、Astro/TypeScript型チェック、単体テスト、本番ビルド、依存監査、ChromiumのE2Eを実行します。終了コードとログは verification/latest/manifest.json に保存します。個別実行は package.json のscriptsを参照してください。

## ビルドと配信

```sh
npm run build
npm start
```

ビルド成果物はdist/です。npm startは本番成果物と生成済みセキュリティヘッダーを使うローカル検証サーバー（127.0.0.1:3000）です。公開用サーバーとしては使用しません。

Cloudflare Pagesではビルドコマンドを npm run build、出力ディレクトリを dist に設定します。お問い合わせフォームを有効にする場合は、Pagesの環境変数に `PUBLIC_TURNSTILE_SITE_KEY`（ビルド用）と `TURNSTILE_SECRET_KEY`・`BREVO_API_KEY`（functions実行用）を設定します。認証済みのWrangler CLIから公開する場合は npm run deploy を使用します。ローカルビルド成功と公開完了は別の状態です。

## コンテンツの編集

- 作品: src/config/projects.ts
- サイト情報・ナビゲーション: src/config/site.ts
- 記事: src/config/blog.ts のBLOG_POSTS。既存のcreateBlogPost形式を継続します。各記事は /blog/{id} の個別ページと /rss.xml に自動反映されます。
- 草案: /admin/posts/new で生成したコードを記事設定へ追加し、再ビルドします。画面からの公開・サーバーへの書き込み機能はありません。
- 外観: tokens.css と src/styles/globals.css。フォントはnpmパッケージから自己配信します。ダークテーマは [data-theme="dark"] でtokens.cssに定義しています。
- OG画像・アイコン: public/images/og/default.png と public/apple-touch-icon.png。ブランド変更時は `npm run assets:generate` で再生成し、コミットします。

コメントと草案は同じオリジンのlocalStorageにだけ保存されます。共有コメントサービス、認証付きCMSではありません。保存キーは移行前と同じです。ブラウザデータの読み込みに失敗した場合、自動保存による上書きを停止して再読み込みを提供します。

設計・セキュリティ・運用上の制約は DEVELOPER.md を参照してください。

## アクセス解析

`PUBLIC_CF_WEB_ANALYTICS_TOKEN` を設定するとCloudflare Web Analyticsのビーコンを出力します（Cookie不使用）。Cloudflareダッシュボードの自動注入を使う場合はトークンを設定しないでください。二重計測を避けるため、どちらか一方のみを使用します。

## ストア情報の自動更新

Androidアプリの正本は src/config/store-apps.json のパッケージIDです。npm run sync:stores は日本向けGoogle Play公開ページから名称・短い説明・アイコンを取得し、src/config/store-listings.jsonとローカル画像へ保存します。紹介画面はこの保存済みデータを使い、閲覧時の外部通信を増やしません。

GitHub ActionsのSync public store listingsは毎日日本時間6:17頃と手動起動時に取得・品質検証し、変更がある場合だけmainへコミットします。CloudflareのGit連携が本番を再ビルドします。スケジュール時刻にはGitHub側の遅延があり得ます。一時的な取得失敗は最大3回まで再検証し、復旧しない場合はジョブを失敗させ、最後に検証できた掲載内容を保持します。新しいアプリの追加やChrome拡張機能の説明は明示的な編集が必要です。

## 品質の自動計測

GitHub ActionsのLighthouseはmainへのpushと手動起動で、本番ビルドに対してPerformance 0.9 / Accessibility 0.95 / Best Practices 0.9 / SEO 0.9 のしきい値を検証します。
