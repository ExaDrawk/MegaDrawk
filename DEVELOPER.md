# 開発者ガイド

## 設計と依存方向

Astroのsrc/pagesがURLとメタデータを定義し、src/layouts/Layout.astroがhead、ナビゲーション、フッターを統合します。src/viewsのReactコンポーネントはビルド時にHTMLへ変換され、閲覧者へReactランタイムを送りません。操作が必要なコメントと草案エディターだけ、Astroのclient:loadでハイドレーションします。

UI（pages/layouts/views/components）→ ドメイン（domain/config/lib）→ 永続化（infra）に責務を分けます。コメント永続化の契約はCommentRepositoryが定義し、インフラが実装します（DIP/ISP）。既存の小規模な草案保存には、実装が1つしかない不要な抽象層を追加していません。

記事・作品・法的ページの内容と既存URLを保持しています。記事をMarkdownへ二重管理せず、src/config/blog.tsを正本として継続します。将来Markdownへ変更する場合は、記事データ・草案出力・検証をまとめて移行してください。

## セキュリティ

scripts/prepare-static.mjsが生成HTMLを検査し、インラインスクリプトの正確なバイト列からSHA-256を生成してdist/_headersへ出力します。scripts/security.mjsがCSPと共通ヘッダーの正本です。unsafe-inline、unsafe-evalは許可せず、イベント属性・style属性はビルドで拒否します。色指定はCSSのdata属性セレクターへ移行しました。JSON-LDのHTML終端文字はエスケープします。

CSPはCloudflare PagesのHTTPヘッダーとして適用します。distを別サービスへ置く場合も_headersをそのホストのHTTPヘッダーへ設定してください。単にHTMLをコピーするだけでは同等のヘッダー保護はありません。Astro開発サーバーはHMRを使うため、本番CSPの確認は必ずnpm run build後のnpm startで行います。

Cloudflareが本番で追加するWeb Analyticsには、公式のCSP要件に従いstatic.cloudflareinsights.com（script-src）とcloudflareinsights.com（connect-src）だけを許可しています。

既存AdSense連携に必要な外部オリジンを限定列挙しています。広告配信は外部サービスの応答・同意設定にも依存し、広告コード未設定の検証を実広告配信成功とは扱いません。広告が動的に追加するスタイルが厳格CSPに抵触する場合は、実際の違反を確認して広告側の構成を調整します。全ページのCSPを安易に緩めないでください。

ブラウザの保存データは信頼せず、JSON構造・入力上限・日時を読み書き時に検証します。Reactがユーザー入力をテキストとして出力し、草案の生成コードはJSON.stringifyで文字列をエスケープします。読み込み失敗後に元データを空の状態で上書きしません。

/adminは公開可能なローカル草案ツールです。noindex、robots.txtのDisallow、Cache-Control:no-storeを設定しますが、これらは認証やアクセス制御ではありません。秘密情報や管理APIを置いてはいけません。共有投稿・認証・サーバー保存は現在存在せず、導入時には独立した認可・入力検証・CSRF対策が必要です。

scripts/serve-static.mjsはローカル専用の証拠取得用サーバーです。生成済み_headersを適用し、書き込みメソッドとドットファイルへのアクセスを拒否します。公開はCloudflare Pagesの静的配信を使用します。

## 変更と品質ゲート

npm run verifyでUTF-8/BOM検査、Prettier、ESLint、astro check、Vitest、静的ビルド、npm audit、Playwrightを実行します。Playwrightは本番成果物を自動起動し、公開URL、JavaScript無効時の表示、CSP、エディターの実動作、保存復元、XSS入力、破損データ保護、モバイル操作を検証します。スクリーンショットはscreenshots/へ保存します。

依存の既知の脆弱性はnpm auditで確認します。0件でも未知の脆弱性がない保証にはなりません。外部広告・本番Cloudflare設定はローカル検証と別に公開後確認が必要です。

## 削除した構成

src/app、Next.js設定・型定義・middleware、OpenNext設定、Pages変換スクリプト、旧PostCSS設定を削除しました。レイアウト定数のうち参照元がテストしかなくCSSと食い違っていたtheme.ts、および未参照の旧作品SVGも削除しています。新たな定数の正本は既存tokens.cssへ集約してください。
