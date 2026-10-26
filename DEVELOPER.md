# 開発者ガイド

## 設計と依存方向

Astroのsrc/pagesがURLとメタデータを定義し、src/layouts/Layout.astroがhead、ナビゲーション、フッターを統合します。src/viewsのReactコンポーネントはビルド時にHTMLへ変換され、閲覧者へReactランタイムを送りません。操作が必要なコメント欄と草案エディター・お問い合わせフォームだけ、Astroのclient:load / client:visibleでハイドレーションします。

UI（pages/layouts/views/components）→ ドメイン（domain/config/lib）→ 永続化（infra）に責務を分けます。お問い合わせフォームの入力検証ルールはsrc/domain/contact/contact.tsにのみ存在し、ブラウザ側のisland（src/components/contact/ContactForm.tsx）とサーバー側のPages Function（functions/api/contact.ts）の双方が同じ関数を参照します。functions/はCloudflare Pages Functionsで、配信は静的distのまま、/api/contactだけサーバー処理を行います。

## ブログ（Content Collections）

- 記事の正本はsrc/content/blog/*.md。src/content.config.tsのZodスキーマ（title・description・date・updatedAt・tags・draft）で検証され、src/config/blog.tsがastro:contentとドメインモデル（src/domain/blog/post.ts）の仲介層になります。astro:contentはAstro実行環境でのみ解決されるため、この仲介層をimportしてよいのは.astroページとエンドポイントだけ。Reactビュー（Homeなど）には値をpropsで渡します。
- ルートパラメータはAstro.paramsから取ります（Astro.propsはgetStaticPathsのpropsのみ）。記事のid＝ファイル名＝URLスラッグ。
- コードハイライトはAstro標準のShikiを二重テーマ（github-light/github-dark、defaultColor: false）で生成し、globals.cssが[data-theme]で切り替えます。Shikiはstyle属性を出力するため、scripts/security.mjsがShiki形式のstyle属性のみ許可し、値ごとのSHA-256ハッシュをCSPのstyle-src-attrへ出力します。
- 読了時間・関連記事・タグ集計・前後記事のロジックはsrc/lib/blogUtils.tsの純粋関数（単体テスト対象）。記事ごとのOG画像はsrc/pages/og/[id].png.tsがビルド時にsatori＋sharpで生成し、フォントはscripts/assets/fonts/から読み込みます（リポジトリにコミット、ブラウザへは配信しない）。
- コメントはアカウント不要・公開型。functions/api/comments/[postId].tsがGET（一覧）とPOST（投稿）を提供し、D1（megadrawk-commentsデータベース、COMMENTS_DBバインディング）に保存する。POSTはTurnstile検証・入力検証（domain/comment/types.tsのCOMMENT_LIMITS、本文は2,000文字まで）・IPハッシュ（IP_HASH_SALT）によるレート制限（60秒間隔、10分間に3件、1日10件、同一記事1日3件、いずれも日本時間の暦日で集計）と同一本文再送抑止（24時間）を経由する。PUT（編集）は投稿後10分以内の同一IPハッシュのみ本文を更新し、edited_atを記録する。返信はトップレベルコメントへの1階層のみで、返信への返信はサーバー側でルートに正規化する。管理者（SITE.ownerNameと同一名のコメント）への返信は、そのコメントへの返信が3件までの間レート制限を免除され、4件目以降は原則の制限が適用される（名前は公開値のため偽装可能だが、免除は3件までに限られる）。削除はDELETEにX-Admin-Tokenヘッダ（ADMIN_DELETE_TOKEN）で認証して実行する。生IPは保存せずSHA-256ハッシュのみ保持。
- 非公開記事（draft: true）は公開一覧・RSS・サイトマップ・OG画像から除外されます。記事のURLは公開時と同じ `/blog/<id>` で、管理者セッションがある場合のみネット上で閲覧できます。未認証時は本文・記事素材とも404を返し、秘密設定の欠如時も静的ファイルへフォールバックしません。開発サーバーでは従来どおり確認できます。
- 記事専用の画像やZIPは `src/content/blog-assets/<id>/` に置き、本文では `/blog-assets/<id>/<filename>` を参照します。`scripts/prepare-static.mjs` が公開記事の素材だけをdistへ配置します。非公開記事のHTMLと素材は `.astro/private-blog.json` にまとめ、Functionsの内部データとしてバンドルします。distには残さないため、Functionsを経由しないアクセスでも漏れません。非公開の素材をpublicや共有のクライアントJSへ置かないでください。
- 配信時は必ず `npm run build` を使用します（`astro build`単独の出力は配信禁止）。`functions/blog/[id].ts` と `functions/blog-assets/[[path]].ts` が既存の `checkAdminAccess` で認証し、認証後の応答には `private, no-store` と `noindex` を付けます。公開状態の変更は再ビルド・デプロイ完了後に反映されます。すでに閲覧・保存された公開記事のコピーまでは取り消せません。

## 管理画面（/admin）

### 記事ファイルの上書きガード（pre-pushフック）

- 記事（src/content/blog/**、src/content/blog-assets/**）は管理画面からの保存が正本。ローカルからのgit pushでこれらを変更・削除しようとすると、scripts/hooks/pre-push（.git/hooks/pre-pushへ配置）がpushを拒否する。
- 意図的にローカルから記事を変更する場合のみ、ALLOW_BLOG_OVERRIDE=1 git push で上書きできる。
- フックはこのクローン固有のため、再クローン時は cp scripts/hooks/pre-push .git/hooks/pre-push で再設置する。

- /admin（メニュー）、/admin/comments（コメント管理）、/admin/articles（記事管理）の全ページがパスワードゲートの裏にあり、ポップアップ（表示名は「パスワード」）で入力を求める。認証はPOST /api/admin/sessionがADMIN_DELETE_TOKENと照合し、SHA-256導出値のHttpOnlyセッションCookie（Secure/SameSite=Strict/400日）を発行する形式。パスワード・トークンともにJavaScriptからは読めず、localStorageにも保存されない。全管理APIはcheckAdminAccessでヘッダ（API直接利用）またはセッションCookieを検証する。ログアウトはDELETE /api/admin/session、強制失効はADMIN_DELETE_TOKENの上書きで行える。Cookieは400日で設計しており、運営者のPCでは常時開ける運用を想定する。
- コメント管理: 全コメントの一覧・削除（返信ごと削除）と、管理人コメントの投稿。管理人コメントはis_admin=1として保存され、公開ページに「管理人」バッジが表示される。一般フォームからは名前「Drawk」を予約語として拒否し、返信免除の判定もis_admin参照のためなりすましでは免除を得られない。
- 記事管理: src/infra/articles/github.tsとimages.tsがGitHub APIでsrc/content/blogと記事素材を読み書きし、mainへコミットする。「公開状態」で公開・非公開を選び、対応する保存ボタンで確定する。「記事を確認」から配信済みの記事を開ける。保存から反映まで通常1〜2分かかるため、「記事を確認」の配信内容は更新まで変わらない（編集画面のプレビューは即時更新）。保存応答の最新SHAを保持し、連続保存でも古いSHAを送らない。ファイル名はスラッグ（英小文字・数字・ハイフン）+.mdのみ許可。
- 重要: Cloudflare Workersのfetchは既定のUser-Agentを送らない。GitHub APIはUA必須で、無いと403を返す（src/infra/articles/github.tsのgithubHeadersで User-Agent を必ず送ること）。 FunctionsのFetch例外はCloudflareの素の502ページになるため、外部API呼び出しは必ずtry/catchしてJSON応答に変換すること（2026-10-25に実障害として確認）。コメントデータは各利用者のブラウザのlocalStorage（キーは変更なし）に残ります。

## セキュリティ

scripts/prepare-static.mjsが生成HTMLを検査し、インラインスクリプトの正確なバイト列からSHA-256を生成してdist/_headersへ出力します。scripts/security.mjsがCSPと共通ヘッダーの正本です。unsafe-inline、unsafe-evalは許可せず、イベント属性・style属性はビルドで拒否します。色指定はCSSのdata属性セレクターへ移行しました。JSON-LDのHTML終端文字はエスケープします。

CSPはCloudflare PagesのHTTPヘッダーとして適用します。distを別サービスへ置く場合も_headersをそのホストのHTTPヘッダーへ設定してください。単にHTMLをコピーするだけでは同等のヘッダー保護はありません。Astro開発サーバーはHMRを使うため、本番CSPの確認は必ずnpm run build後のnpm startで行います。

Cloudflareが本番で追加するWeb Analyticsには、公式のCSP要件に従いstatic.cloudflareinsights.com（script-src）とcloudflareinsights.com（connect-src）だけを許可しています。

Turnstile（お問い合わせフォーム）のオリジン（challenges.cloudflare.comのscript-srcとframe-src）は、ビルド時にPUBLIC_TURNSTILE_SITE_KEYが設定されている場合にのみCSPへ追加されます（scripts/security.mjsの正本とscripts/prepare-static.mjs）。フォームを無効化したビルドではCSPは広がりません。

既存AdSense連携に必要な外部オリジンを限定列挙しています。広告配信は外部サービスの応答・同意設定にも依存し、広告コード未設定の検証を実広告配信成功とは扱いません。広告が動的に追加するスタイルが厳格CSPに抵触する場合は、実際の違反を確認して広告側の構成を調整します。全ページのCSPを安易に緩めないでください。

ブラウザの保存データは信頼せず、JSON構造・入力上限・日時を読み書き時に検証します。Reactがユーザー入力をテキストとして出力し、草案の生成コードはJSON.stringifyで文字列をエスケープします。読み込み失敗後に元データを空の状態で上書きしません。

/adminは認証付き管理メニューです。ローカル草案ツールは/admin/posts/newにあり、草案をlocalStorageへ保存します。管理APIの認可はcheckAdminAccessで実施します。

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

## 記事編集ワークスペース（2026-10-26）

- `/admin/articles` は全幅のMarkdown／プレビュー分割画面。境界をドラッグ、またはフォーカスして左右キーで幅を変更できます。スクロール連動は割合ベースで双方向、狭い画面はタブ切替です。
- 保存は画面を再読込せず最新SHAと基準本文を更新します。通信中の追加入力は未保存として保持します。Ctrl/Cmd+Sに対応し、記事切替と離脱には未保存保護があります。認証切れでもエディタはマウントを維持し、再認証後に再保存できます。
- 画像パネルのファイル選択・ドロップ・貼り付けでPNG/JPEG/WebP/GIFを追加できます。容量の正本は `src/domain/blog/images.ts`（1枚5MiB、合計15MiB）。名前・拡張子・データ署名をクライアントとサーバーで検証し、同名は自動上書きしません。既存SVG等の素材は保持します。
- `GET /api/admin/articles?images&file=<article.md>` は画像一覧、追加の `image=<name>` は管理者限定の画像取得。どちらも既存認証を通り、画像はprivate/no-storeで返します。未配信の画像も確認できます。
- `PUT /api/admin/articles` は従来のname/content/shaに加え、省略可能なadditions（name/base64）とdeletions（画像名）を受け取ります。Git blobs→tree→commit→non-forced ref updateの順で本文と画像を単一コミットに確定し、shaとcommitを返します。競合は409で、途中失敗ではmainを更新しません。
- 画像削除は保存時に全記事の参照を保守的に確認します。同名の記述が残る場合も削除を拒否します。既存記事のファイル名は固定です。記事削除は画像を自動削除せず履歴と素材を保持します。
- 記事／非公開記事／プレビューの画像は共通のdialogで拡大できます。原寸切替、Escape、フォーカス復帰に対応。画像以外へのリンクは通常の遷移を維持します。
- UIの保存完了はGitHubへの確定です。公開URLへの反映はCloudflareのデプロイ完了後です。Pages設定と環境変数は既存の管理方式を維持し、wrangler.tomlを新設しません。
