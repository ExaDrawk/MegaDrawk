# MEGADRAWK

Astroで静的生成するポートフォリオサイトです。公開ページはHTML・CSSとして配信し、Reactはコメントと記事草案エディターだけで起動します。Next.js、OpenNext、サーバーレンダリングの実行基盤は不要です。

## セットアップ

Node.js 22.23.4以上（検証は24系）とnpmを使用します。

```sh
npm ci
npm run dev
```

開発サーバーは http://127.0.0.1:4321 です。広告を有効にする場合のみ、.env.local に PUBLIC_ADSENSE_CLIENT=ca-pub-に続く16桁のIDを設定します。旧NEXT_PUBLIC_ADSENSE_CLIENTは使用しません。広告ID未設定では広告スクリプトを出力しません。不正な値はビルドエラーになります。

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

Cloudflare Pagesではビルドコマンドを npm run build、出力ディレクトリを dist に設定します。認証済みのWrangler CLIから公開する場合は npm run deploy を使用します。ローカルビルド成功と公開完了は別の状態です。

## コンテンツの編集

- 作品: src/config/projects.ts
- サイト情報・ナビゲーション: src/config/site.ts
- 記事: src/config/blog.ts のBLOG_POSTS。既存のcreateBlogPost形式を継続します。
- 草案: /admin/posts/new で生成したコードを記事設定へ追加し、再ビルドします。画面からの公開・サーバーへの書き込み機能はありません。
- 外観: tokens.css と src/styles/globals.css。フォントはnpmパッケージから自己配信します。

コメントと草案は同じオリジンのlocalStorageにだけ保存されます。共有コメントサービス、認証付きCMSではありません。保存キーは移行前と同じです。ブラウザデータの読み込みに失敗した場合、自動保存による上書きを停止して再読み込みを提供します。

設計・セキュリティ・運用上の制約は DEVELOPER.md を参照してください。

## ストア情報の自動更新

Androidアプリの正本は src/config/store-apps.json のパッケージIDです。npm run sync:stores は日本向けGoogle Play公開ページから名称・短い説明・アイコンを取得し、src/config/store-listings.jsonとローカル画像へ保存します。紹介画面はこの保存済みデータを使い、閲覧時の外部通信を増やしません。

GitHub ActionsのSync public store listingsは毎日日本時間6:17頃と手動起動時に取得・品質検証し、変更がある場合だけmainへコミットします。CloudflareのGit連携が本番を再ビルドします。スケジュール時刻にはGitHub側の遅延があり得ます。取得失敗時はジョブを失敗させ、最後に検証できた掲載内容を保持します。新しいアプリの追加やChrome拡張機能の説明は明示的な編集が必要です。
