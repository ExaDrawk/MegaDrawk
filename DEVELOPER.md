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

## メール構成（contact@megadrawk.com）

連絡先の正本はsrc/config/site.tsの`SITE.email`です。ページ・テストはこの値のみを参照し、アドレスを複製しないこと。

**受信（Cloudflare Email Routing）**: `contact@`と`security@`をryumasa0226@gmail.comへ転送するリテラルルールが有効。Cloudflareは送信しないため、返信はGmailまたはBrevo経由で行う。ルールの変更はCloudflareダッシュボード（Email → Email Routing）で行う。

**送信（Brevo SMTP・稼働済み）**: ドメイン認証済み（DKIM 2本＋Brevo code＋ブランドトラッキングmail.megadrawk.com）。送信者`Drawk <contact@megadrawk.com>`Verified、SMTPキー（名称`gmail-send-as`）生成済み。Gmailの「Send mail as」の`MegaDrawk <contact@megadrawk.com>`は**smtp-relay.brevo.com（TLS 587、ログイン`bf6cf6001@smtp-brevo.com`＋SMTPキー）へ移行済み**で、2026-10-22に実送信テスト完了（From=`contact@megadrawk.com`でGmail宛に配信確認）。旧設定はlawdrawkのResend SMTPを使っていたが、個人連絡先をlawdrawkのResendアカウントに依存させないためBrevoへ切り替えた。lawdrawk.com用の送信元（Resend）は別エントリとして変更していない。SMTPキーは生成時に一度しか表示されないため紛失時は再発行する。既定の送信元（デフォルトのFrom）は`contact@megadrawk.com`に設定してある。対外メールの主送信元として意図した状態であり、Gmail個人の既定に戻す場合は設定 → アカウント → 送信元で`ryumasa0226@gmail.com`の「デフォルトに設定」を押す。Brevoアカウントの電話認証は完了済み。

**DNSレコードの役割（削除・変更前に必ず確認）**: `_dmarc` TXTはポリシー`p=none`＋レポート集約先`rua@dmarc.brevo.com`。`brevo1/2._domainkey` CNAMEはBrevoのDKIM鍵。`brevo-code` TXTはBrevoドメイン所有権確認。`mail`・`r.mail`・`img.mail` CNAMEはBrevoのリンク・画像ブランドトラッキング。`send.megadrawk.com`のMX/TXTと`resend._domainkey`はlawdrawk（Pagesプロジェクト、本番で`RESEND_API_KEY`を使用）が問い合わせメールを送るためのResendDKIM・バウンス経路であり、削除するとlawdrawkのメールがDKIM不一致で迷惑メール化するため削除禁止。ResendとBrevoの両DKIMが`d=megadrawk.com`で整合するため、DMARCは両送信経路を保護する。`google-site-verification` TXTはSearch Console確認用。`8band.megadrawk.com`（Worker `band8`）と`meetpicks.megadrawk.com`（Pages `meetpicks`）は稼働中アプリのカスタムドメイン。

**DMARC強化計画**: 現行は監視フェーズ（p=none）。BrevoのDMARCレポートで正規送信（Brevo・Resend経由）のみが2〜4週間続くことを確認したら`p=quarantine`へ、さらに数か月問題がなければ`p=reject`へ引き上げる。集約先を個人メールボックスに変えるとレポートXMLで受信箱が溢れるため避ける。

**運用上の最優先事項**: このアドレスを対外主要連絡先にするため、megadrawk.comの自動更新・レジストラロック・Cloudflareアカウントの2FAを維持する。ドメイン失効は連絡先の完全喪失を意味する。重要アカウントの復帰用メールアドレスにはGmailを使い、ドメイン依存のcontact@を単独の復帰経路にしない。

**受信経路の実績**: Gmail→contact@megadrawk.com→Email Routing→Gmailの往復を実送信で確認済み（2026-10-22）。Cloudflareのメール難読化（Scrape ShieldのEmail Obfuscation）は本zoneで無効化済み。厳格CSP（script-src自己保証+ハッシュ）下ではCloudflare製decoderスクリプトが実行できず、mailtoリンクが`/cdn-cgi/l/email-protection`に書き換えられたまま復号されないため。連絡先は公開前提の情報であり、難読化を再び有効にするとContactページのメールボタンが壊れる。

## 変更と品質ゲート

npm run verifyでUTF-8/BOM検査、Prettier、ESLint、astro check、Vitest、静的ビルド、npm audit、Playwrightを実行します。Playwrightは本番成果物を自動起動し、公開URL、JavaScript無効時の表示、CSP、エディターの実動作、保存復元、XSS入力、破損データ保護、モバイル操作を検証します。スクリーンショットはscreenshots/へ保存します。

依存の既知の脆弱性はnpm auditで確認します。0件でも未知の脆弱性がない保証にはなりません。外部広告・本番Cloudflare設定はローカル検証と別に公開後確認が必要です。

## 削除した構成

src/app、Next.js設定・型定義・middleware、OpenNext設定、Pages変換スクリプト、旧PostCSS設定を削除しました。レイアウト定数のうち参照元がテストしかなくCSSと食い違っていたtheme.ts、および未参照の旧作品SVGも削除しています。新たな定数の正本は既存tokens.cssへ集約してください。
