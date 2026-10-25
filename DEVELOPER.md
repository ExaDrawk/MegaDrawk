# 開発者ガイド

## 設計と依存方向

Astroのsrc/pagesがURLとメタデータを定義し、src/layouts/Layout.astroがhead、ナビゲーション、フッターを統合します。src/viewsのReactコンポーネントはビルド時にHTMLへ変換され、閲覧者へReactランタイムを送りません。操作が必要なコメント欄と草案エディター・お問い合わせフォームだけ、Astroのclient:load / client:visibleでハイドレーションします。

UI（pages/layouts/views/components）→ ドメイン（domain/config/lib）→ 永続化（infra）に責務を分けます。お問い合わせフォームの入力検証ルールはsrc/domain/contact/contact.tsにのみ存在し、ブラウザ側のisland（src/components/contact/ContactForm.tsx）とサーバー側のPages Function（functions/api/contact.ts）の双方が同じ関数を参照します。functions/はCloudflare Pages Functionsで、配信は静的distのまま、/api/contactだけサーバー処理を行います。

## ブログ（Content Collections）

- 記事の正本はsrc/content/blog/*.md。src/content.config.tsのZodスキーマ（title・description・date・updatedAt・tags・draft）で検証され、src/config/blog.tsがastro:contentとドメインモデル（src/domain/blog/post.ts）の仲介層になります。astro:contentはAstro実行環境でのみ解決されるため、この仲介層をimportしてよいのは.astroページとエンドポイントだけ。Reactビュー（Homeなど）には値をpropsで渡します。
- ルートパラメータはAstro.paramsから取ります（Astro.propsはgetStaticPathsのpropsのみ）。記事のid＝ファイル名＝URLスラッグ。
- コードハイライトはAstro標準のShikiを二重テーマ（github-light/github-dark、defaultColor: false）で生成し、globals.cssが[data-theme]で切り替えます。Shikiはstyle属性を出力するため、scripts/security.mjsがShiki形式のstyle属性のみ許可し、値ごとのSHA-256ハッシュをCSPのstyle-src-attrへ出力します。
- 読了時間・関連記事・タグ集計・前後記事のロジックはsrc/lib/blogUtils.tsの純粋関数（単体テスト対象）。記事ごとのOG画像はsrc/pages/og/[id].png.tsがビルド時にsatori＋sharpで生成し、フォントはscripts/assets/fonts/から読み込みます（リポジトリにコミット、ブラウザへは配信しない）。
- コメントはアカウント不要のlocalStorage保存型（CommentSection）。他の利用者には表示されないため、公開導線としてX・お問い合わせフォームへの案内リンクをコメント欄に併記します。
- 下書き（draft: true）は本番ビルド・RSS・サイトマップから除外され、開発サーバーでのみ表示されます。コメントデータは各利用者のブラウザのlocalStorage（キーは変更なし）に残ります。

## セキュリティ

scripts/prepare-static.mjsが生成HTMLを検査し、インラインスクリプトの正確なバイト列からSHA-256を生成してdist/_headersへ出力します。scripts/security.mjsがCSPと共通ヘッダーの正本です。unsafe-inline、unsafe-evalは許可せず、イベント属性・style属性はビルドで拒否します。色指定はCSSのdata属性セレクターへ移行しました。JSON-LDのHTML終端文字はエスケープします。

CSPはCloudflare PagesのHTTPヘッダーとして適用します。distを別サービスへ置く場合も_headersをそのホストのHTTPヘッダーへ設定してください。単にHTMLをコピーするだけでは同等のヘッダー保護はありません。Astro開発サーバーはHMRを使うため、本番CSPの確認は必ずnpm run build後のnpm startで行います。

Cloudflareが本番で追加するWeb Analyticsには、公式のCSP要件に従いstatic.cloudflareinsights.com（script-src）とcloudflareinsights.com（connect-src）だけを許可しています。

Turnstile（お問い合わせフォーム）のオリジン（challenges.cloudflare.comのscript-srcとframe-src）は、ビルド時にPUBLIC_TURNSTILE_SITE_KEYが設定されている場合にのみCSPへ追加されます（scripts/security.mjsの正本とscripts/prepare-static.mjs）。フォームを無効化したビルドではCSPは広がりません。

既存AdSense連携に必要な外部オリジンを限定列挙しています。広告配信は外部サービスの応答・同意設定にも依存し、広告コード未設定の検証を実広告配信成功とは扱いません。広告が動的に追加するスタイルが厳格CSPに抵触する場合は、実際の違反を確認して広告側の構成を調整します。全ページのCSPを安易に緩めないでください。

ブラウザの保存データは信頼せず、JSON構造・入力上限・日時を読み書き時に検証します。Reactがユーザー入力をテキストとして出力し、草案の生成コードはJSON.stringifyで文字列をエスケープします。読み込み失敗後に元データを空の状態で上書きしません。

/adminは公開可能なローカル草案ツールです。noindex、robots.txtのDisallow、Cache-Control:no-storeを設定しますが、これらは認証やアクセス制御ではありません。秘密情報や管理APIを置いてはいけません。共有投稿・認証・サーバー保存は現在存在せず、導入時には独立した認可・入力検証・CSRF対策が必要です。

scripts/serve-static.mjsはローカル専用の証拠取得用サーバーです。生成済み_headersを適用し、書き込みメソッドとドットファイルへのアクセスを拒否します。公開はCloudflare Pagesの静的配信を使用します。

## メール構成（contact@megadrawk.com）

連絡先の正本はsrc/config/site.tsの`SITE.email`です。ページ・テストはこの値のみを参照し、アドレスを複製しないこと。

**受信（Cloudflare Email Routing）**: `contact@`と`security@`をryumasa0226@gmail.comへ転送するリテラルルールが有効。Cloudflareは送信しないため、返信はGmailまたはBrevo経由で行う。ルールの変更はCloudflareダッシュボード（Email → Email Routing）で行う。

**送信（Brevo SMTP・稼働済み）**: ドメイン認証済み（DKIM 2本＋Brevo code＋ブランドトラッキングmail.megadrawk.com）。送信者`Drawk <contact@megadrawk.com>`Verified、SMTPキー（名称`gmail-send-as`）生成済み。Gmailの「Send mail as」の`MegaDrawk <contact@megadrawk.com>`は**smtp-relay.brevo.com（TLS 587、ログイン`bf6cf6001@smtp-brevo.com`＋SMTPキー）へ移行済み**で、2026-10-22に実送信テスト完了（From=`contact@megadrawk.com`でGmail宛に配信確認）。旧設定はlawdrawkのResend SMTPを使っていたが、個人連絡先をlawdrawkのResendアカウントに依存させないためBrevoへ切り替えた。lawdrawk.com用の送信元（Resend）は別エントリとして変更していない。SMTPキーは生成時に一度しか表示されないため紛失時は再発行する。既定の送信元（デフォルトのFrom）は`contact@megadrawk.com`に設定してある。対外メールの主送信元として意図した状態であり、Gmail個人の既定に戻す場合は設定 → アカウント → 送信元で`ryumasa0226@gmail.com`の「デフォルトに設定」を押す。Brevoアカウントの電話認証は完了済み。

**DNSレコードの役割（削除・変更前に必ず確認）**: `_dmarc` TXTはポリシー`p=none`＋レポート集約先`rua@dmarc.brevo.com`。`brevo1/2._domainkey` CNAMEはBrevoのDKIM鍵。`brevo-code` TXTはBrevoドメイン所有権確認。`mail`・`r.mail`・`img.mail` CNAMEはBrevoのリンク・画像ブランドトラッキング。`send.megadrawk.com`のMX/TXTと`resend._domainkey`はlawdrawk（Pagesプロジェクト、本番で`RESEND_API_KEY`を使用）が問い合わせメールを送るためのResendDKIM・バウンス経路であり、削除するとlawdrawkのメールがDKIM不一致で迷惑メール化するため削除禁止。ResendとBrevoの両DKIMが`d=megadrawk.com`で整合するため、DMARCは両送信経路を保護する。`google-site-verification` TXTはSearch Console確認用。`8band.megadrawk.com`（Worker `band8`）と`meetpicks.megadrawk.com`（Pages `meetpicks`）は稼働中アプリのカスタムドメイン。

**DMARC強化計画**: 現行は監視フェーズ（p=none）。BrevoのDMARCレポートで正規送信（Brevo・Resend経由）のみが2〜4週間続くことを確認したら`p=quarantine`へ、さらに数か月問題がなければ`p=reject`へ引き上げる。集約先を個人メールボックスに変えるとレポートXMLで受信箱が溢れるため避ける。

**運用上の最優先事項**: このアドレスを対外主要連絡先にするため、megadrawk.comの自動更新・レジストラロック・Cloudflareアカウントの2FAを維持する。ドメイン失効は連絡先の完全喪失を意味する。重要アカウントの復帰用メールアドレスにはGmailを使い、ドメイン依存のcontact@を単独の復帰経路にしない。

**受信経路の実績**: Gmail→contact@megadrawk.com→Email Routing→Gmailの往復を実送信で確認済み（2026-10-22）。Cloudflareのメール難読化（Scrape ShieldのEmail Obfuscation）は本zoneで無効化済み。厳格CSP（script-src自己保証+ハッシュ）下ではCloudflare製decoderスクリプトが実行できず、mailtoリンクが`/cdn-cgi/l/email-protection`に書き換えられたまま復号されないため。連絡先は公開前提の情報であり、難読化を再び有効にするとContactページのメールボタンが壊れる。

## お問い合わせフォーム（functions/api/contact.ts）

- 有効条件: ビルド時に`PUBLIC_TURNSTILE_SITE_KEY`が設定され、Pages実行環境に`TURNSTILE_SECRET_KEY`と`BREVO_API_KEY`が設定されていること。シークレットはPagesの環境変数（暗号化）で管理し、コードへ書かない。
- Pages設定はダッシュボード/API管理に統一し、リポジトリにwrangler.tomlを置かない。wrangler.tomlが存在すると、Git連携デプロイのたびにプロジェクト設定がファイル側へ同期され、ダッシュボード設定の環境変数が消える（2026-10-25に実障害として確認）。
- 現在の構成（2026-10-25設定済み）: Turnstileウィジェット`megadrawk-contact`（managed、megadrawk.comのみ）。Brevo APIキー`megadrawk-contact-085402`（Restricted・Transactional email: All・無期限だが90日未使用で失効。フォーム稼働中なら失効しない）。3変数ともPagesプロジェクト`megadrawk`のproduction環境変数に登録済み。新しいキーへ差し替える場合はBrevoのSMTP & API画面で生成し、Pagesの環境変数を更新してから再デプロイする。
- アクセス解析はCloudflareダッシュボードのWeb Analytics自動注入（megadrawk.comゾーンで有効）を使用しているため、`PUBLIC_CF_WEB_ANALYTICS_TOKEN`は設定しないこと（二重計測になる）。
- 処理順: サイズ上限（32KB）→JSON解析→ハニーポット（`company`欄が空でなければボットとして成功応答のみ返し送信しない）→Turnstile siteverify→ドメインの検証（src/domain/contact/contact.ts）→Brevo REST API（api.brevo.com/v3/smtp/email）で`SITE.email`へ送信、Reply-Toに送信者（未入力ならReply-Toを付けない）。
- 送信者・宛先の正本はSITE.emailのみ。宛先を分けたい場合はconfigの変更で一括更新する。
- メールアドレスは任意（2026-10-25〜）。フォームには「返信が必要な場合は、本文にその旨と返信先をご記入ください」と案内する。未入力の問い合わせには返信できないため、返信したい場合は本文に記載された返信先へ送る。
- 失敗時はFail Fastで状態コードを返す（設定不備500・入力413/400・Turnstile失敗400・配信失敗502）。Brevo/Turnstileの障害時、フォームはエラーを表示し、既存のメール・X導線が常に代替となる。
- レート制限は持っていない（ステートレス）。Turnstileとハニーポットで一次防御するが、大量送信が懸念される場合はCloudflare WAFレート制限ルールをzone側へ追加する。
- ローカル検証: `npm start`（serve-static.mjs）は書き込みメソッドを拒否するため、関数の実動作は単体テスト（tests/contact-function.test.ts）とデプロイ後の実送信で確認する。Turnstileのテストキー（公式の1x/2x…）を使えば実配信前にUI検証が可能。

## テーマ（ライト/ダーク）

- 正本はtokens.css。`:root`がライト、`[data-theme="dark"]`がダークで、`--meta-theme-color`も各テーマで定義する。
- Layout先頭のインラインスクリプトが、localStorageの`theme`（light/darkのみ有効）→システム設定の順で描画前に`data-theme`を設定する（フラッシュ防止）。ボタン#theme-toggleはヘッダーにあり、クリックはLayoutのスクリプトがdocument委譲で受け、`theme`を保存する。保存領域が使えない環境ではその場の表示のみ切り替える。
- トレードオフ: JavaScript無効環境ではダークテーマに切り替わらない（ライト固定）。CSSの二重管理を避けることを優先した判断であり、無効環境向けの自動切替が必要になった時点で再設計する。

## 生成アセット（OG画像・アイコン）

- public/images/og/default.png（1200x630）、public/apple-touch-icon.png（180px）、public/images/icons/icon-{192,512}.pngはscripts/generate-brand-assets.mjsがscripts/assets/のテンプレートから生成し、gitへコミットする。
- 再生成は `npm run assets:generate`（Playwright Chromiumが必要。npm run e2e:install済みなら実行できる）。テンプレート内のコピー文はブランド表現そのものであり、site.tsのdescription変更時に手動で合わせて再生成する。

## 変更と品質ゲート

npm run verifyでUTF-8/BOM検査、Prettier、ESLint、astro check、Vitest、静的ビルド、npm audit、Playwrightを実行します。Playwrightは本番成果物を自動起動し、公開URL、JavaScript無効時の表示、CSP、エディターの実動作、保存復元、XSS入力、破損データ保護、モバイル操作を検証します。スクリーンショットはscreenshots/へ保存します。

依存の既知の脆弱性はnpm auditで確認します。0件でも未知の脆弱性がない保証にはなりません。外部広告・本番Cloudflare設定はローカル検証と別に公開後確認が必要です。Core Web VitalsはGitHub ActionsのLighthouseワークフロー（.github/workflows/lighthouse.yml）がmainのpushごとに本番ビルドを計測し、Performance/Accessibility/Best Practices/SEOのしきい値違反で失敗します。

## 削除した構成

src/app、Next.js設定・型定義・middleware、OpenNext設定、Pages変換スクリプト、旧PostCSS設定を削除しました。レイアウト定数のうち参照元がテストしかなくCSSと食い違っていたtheme.ts、および未参照の旧作品SVGも削除しています。新たな定数の正本は既存tokens.cssへ集約してください。

## ストア同期の境界

Google Playの公開ページは非保証のHTMLインターフェースです。構造変更・地域制限・通信障害時は取得を失敗として扱い、既存スナップショットを維持します。ストアのcanonicalパッケージID、発行者、文字列長、画像オリジン、PNG署名とサイズを検証します。全アプリの検証後にJSONを一括置換します。アイコンは内容ハッシュ付きのローカルPNGへ保存し、以前の自動生成画像だけを整理します。更新ジョブのactionsはコミットSHAで固定し、権限はcontents:writeに限定しています。

法的ページの監査ではCloudflare Web AnalyticsのCookieを使わない集計と配信用通信処理を区別しました。広告記載はLayoutと共通のSITE_FEATURESから実際のスクリプト有効状態に合わせ、localStorageがサーバー共有でない点、削除方法、連絡先・利用目的を記載しています。利用規約の一律免責と引用まで禁じる文言を撤去しました。参考はCloudflareのWeb Analytics公式資料、個人情報保護委員会の通則編・Q&A、消費者庁の消費者契約法解説です。
