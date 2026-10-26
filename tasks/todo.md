## tasks/todo.md

- [x] Step 1: 仮定・スコープの明示
- [x] Step 2: アーキテクチャ設計（層境界・データフロー・採用原則）
- [x] Step 3: 実装
  - [x] 3-1: ドメイン層（記事生成ルールを `src/domain/blog` に分離）
  - [x] 3-2: インフラ層（今回は未導入。静的設定 `src/config/blog.ts` を暫定保存境界として維持）
  - [x] 3-3: UI層（`/admin/posts/new` の管理画面追加）
  - [x] 3-4: loading / empty / error / success の確認
- [x] Step 4: 品質ゲート（Lint・型・テスト・ビルド）
- [x] Step 5: 自己レビュー・修正
- [x] Step 6: ドキュメント整備

## 2026-07-16 UI/UX統一

- [x] 8観点のUI/UX監査
- [x] デザイントークンと共通Actionの正本化
- [x] 公開画面・法務画面・管理画面の余白、見出し、カード、入力欄の統一
- [x] hover / active / focus / disabled / loading の統一
- [x] モバイルメニューのフォーカス管理とレスポンシブ修正
- [x] コメント二重送信と管理画面の状態不整合・保存競合の修正
- [x] Lint・型・単体テスト・ビルド・E2E・PC/スマートフォン画像検証
- [x] UTF-8 BOM / U+FFFD / 差分検査

## 2026-07-16 全体監査・セキュリティ改善・コード品質向上

- [x] npm audit: 2件（high/moderate）→ 0件に修正（next 16.2.10 アップグレード、postcss override 追加）
- [x] vitest 4.0.18（テスト発見不全バグ）→ 3.2.7（安定版）にダウングレード
- [x] Next.js 16.1.6 → 16.2.10 アップグレード（多数のCVE修正）
- [x] eslint-config-next 16.1.6 → 16.2.10 同期
- [x] コメント入力値検証をドメイン層に集約（COMMENT_LIMITS / validateCommentInput）
- [x] コメント文字数制限の単一情報源化（UI とロジックが同じ定数を参照）
- [x] CSS デッドエイリアス削除（--color-bg / --color-accent / --color-error 等の未使用変数）
- [x] Tailwind v4 と冗長な autoprefixer 削除（依存最小化）
- [x] 未使用依存 @testing-library/dom 削除
- [x] E2Eテストインフラ整備（@playwright/test 追加、e2e スクリプト追加）
- [x] E2Eテスト修正（deep.spec.ts の古いエラーメッセージ・実行不可能なコメントテスト修正）
- [x] セキュリティヘッダー検証テスト追加（CSP / X-Frame-Options / HSTS 等）
- [x] README.md 整合性修正（Next.js 14→16、next.config.js→.mjs、npm audit 記述更新）
- [x] DEVELOPER.md アーキテクチャ記述更新
- [x] commentStorage.ts のブラウザ環境チェック統一（blogDraftStorage と同じパターン）
- [x] Lint・型・テスト（48件）・ビルド 全通過確認

## 2026-09-02 UI簡素化（AIスロップ排除）

- [x] 旧Astro環境の残骸 `dist/`・`.astro/` を削除（「independent / builder's index」等の旧文言はここにのみ残存していた）
- [x] 空 `tagline` フィールドと全分岐（site.ts / layout / footer / page）を削除
- [x] 装飾キックラベル削除（`.eyebrow`、"Admin / Posts / New"、"Summary"、大文字トラッキングラベル）
- [x] 実装解説メタ文言削除（管理画面の「将来の拡張余地」カード、アーキテクチャ解説文）
- [x] 装飾排除: body放射グラデーション、ヘッダー/メニューのbackdrop-blur、カード浮遊hover、enter系ページアニメ、青ピルタグチップ、ボタンhoverリフト
- [x] 死蔵トークン削除（`--ease-emphasized` `--duration-normal` `--duration-slow` `--radius-pill` `--shadow-md`）
- [x] 空状態文言を1行に簡潔化（home / blog / comments）
- [x] ホーム「Latest Blog」→「最近の記事」、「すべて見る →」→「すべて見る」
- [x] 品質ゲート: Lint / 型 / 単体48件 / ビルド / E2E16件 全通過、BOM・U+FFFDなし

## 2026-09-02 公開（mainプッシュ + Cloudflare Pages）

- [x] mainにコミットし、Astro時代のコミットを履歴に残したまま `-s ours` マージでNext.jsツリーを正本化、origin/mainへプッシュ
- [x] Git連携ビルドのFailureを特定： Next 16.2.10のprefetch-hintsマニフェストに@opennextjs/cloudflare 1.17.1が未対応で、Worker起動時に1101例外
- [x] next 16.2.10 → 16.3.4、@opennextjs/cloudflare → 1.20.5（peer要件 >=16.3.3）、eslint-config-next 同期
- [x] wrangler pages dev（workerd）でローカル検証後に `wrangler pages deploy` で本番反映を確認（200・新UI配信）
- [x] 全品質ゲート再実行: Lint / 型 / 単体48件 / E2E16件
- [x] `/logo.svg` 404修正: `_routes.json` が実在しない静的パスまでexcludeし動的ルート(robots.txt/sitemap.xml/manifest)も壊していたため、prepare-pages.cjs を「assets内の実在ファイルのみexclude」方式に変更。production全パス200を確認
- [x] 残課題: Cloudflareダッシュボードのビルド設定を `npm run deploy` + 出力 `.open-next` に変更（Git連携ビルドは旧Astro設定のままで失敗するため。直接アップロード運用なら不要）

## 2026-09-07 個人医療情報・病歴の完全削除とプライバシー強化

- [x] Step 1: 仮定・スコープの明示
- [x] Step 2: アーキテクチャ設計（層境界・データフロー・採用原則）
- [x] Step 3: 実装
  - [x] 3-1: `src/app/about/page.tsx` から病歴セクション（持病、手術名、薬剤名、障害等級等）および闘病noticeを完全削除
  - [x] 3-2: `src/app/contact/page.tsx` から病気関連noticeを完全削除
  - [x] 3-3: プロジェクト全体のテキスト走査で病気・個人医療情報がゼロであることを検証
  - [x] 3-4: `e2e/site.spec.ts` に病気情報非存在のアサーションを追加
- [x] Step 4: 品質ゲート（Lint・型・テスト・ビルド・E2E）
- [x] Step 5: 自己レビュー・修正
- [x] Step 6: Gitコミット & origin/main プッシュ

## 2026-09-07 メインルール厳罰化 & ユーザー製作物（どこでも六法他）の復元

- [x] AGENTS.md の絶対に守るべきルールに「既存成果物・データの破壊的消去の絶対禁止（破壊的マージ・強制上書きの厳禁）」を刻印
- [x] tasks/lessons.md に過去の `-s ours` によるデータ喪失の教訓と再発防止ルールを追記
- [x] コミット `0649aa7` よりユーザーの製作物データ（どこでも六法、Multi-Subtitles for YouTube、条文スコープ）を完全復元
- [x] `src/config/projects.ts` を単一の権威ある情報源として新設
- [x] `src/app/about/page.tsx` にプロジェクト一覧セクションを現在のデザインシステムに沿って再配置
- [x] `src/config/__tests__/projects.test.ts` 単体テストを追加
- [x] `e2e/site.spec.ts` にプロジェクト表示・外部リンクのアサーションを追加
- [x] 全品質ゲート通過（型・Lint・単体テスト52件・ビルド・E2Eテスト16件）
- [x] Gitコミット & origin/main プッシュ & Cloudflare Pages 本番反映

## 2026-09-07 フラグシップデザインシステム完全復元・全ファイル検証・大規模改善

- [x] Step 1: 仮定・スコープの明示
- [x] Step 2: アーキテクチャ設計（層境界・データフロー・採用原則）
- [x] Step 3: 実装・復元
  - [x] 3-1: `src/app/blog/page.tsx` のフラグシップスタイル復元（`blog-index`, `blog-entry`, `tag`, `empty-state`）
  - [x] 3-2: `src/app/contact/page.tsx` のフラグシップスタイル復元（`contact-layout`, `contact-detail`、病歴完全排除維持）
  - [x] 3-3: `src/app/privacy/page.tsx`, `src/app/terms/page.tsx` のスタイル復元（`eyebrow`, `document-meta`, `animate-enter-up`）
  - [x] 3-4: `src/app/not-found.tsx`, `src/app/error.tsx` のステータスページスタイル復元
  - [x] 3-5: `src/components/ui/SkipNav.tsx` を `.skip-nav` クラス利用へ復元
  - [x] 3-6: `src/app/admin/page.tsx`, `src/app/admin/posts/new/page.tsx`, `src/components/admin/BlogPostEditor.tsx` の整理・デザイン整合
  - [x] 3-7: 不要ファイル・一時ファイルの完全削除とファイル走査
  - [x] 3-8: 文字コード（UTF-8 BOMなし、U+FFFDなし）の全ファイル検証
- [x] Step 4: 品質ゲート（Lint・型・テスト・ビルド・E2E 全通過）
- [x] Step 5: 自己レビュー・修正
- [x] Step 6: Gitコミット & origin/main プッシュ & Cloudflare Pages 本番反映・URL確認

## 2026-09-07 AIスロップ完全排斥 & ソリッド・シンプルUIへの再構築

- [x] Step 1: `anti-ai-slop-design` スキルに基づく排斥項目の特定
  - 余計な文言（`.eyebrow`、装飾キックラベル、ポエム文言、`hero-plate`の装飾）の完全削除
  - 過剰な角丸（pill, rounded-2xl等）の排斥 → 4px〜6px の端正なエッジへ統一
  - 浮遊シャドウ・もっさりアニメーション（`animate-enter-up`）の排斥 → 1px 境界線とソリッドな表示
- [x] Step 2: 各画面の簡素化・ソリッド化
  - [x] 2-1: `src/app/page.tsx`（hero-plate/home-brief等の装飾とポエム文言を削除、シンプルなトップへ）
  - [x] 2-2: `src/app/about/page.tsx`（ポエム文言削除、端正なプロフィールと製作物3件のソリッドリスト表示）
  - [x] 2-3: `src/app/blog/page.tsx`（装飾キックラベル・ポエム削除、シンプルな記事一覧/空状態）
  - [x] 2-4: `src/app/contact/page.tsx`（装飾ラベル削除、簡潔な連絡先表示）
  - [x] 2-5: `src/components/layout/SiteHeader.tsx`（`builder's index` 等の装飾ラベル削除、シンプルなブランド+ナビへ）
  - [x] 2-6: `src/app/privacy/page.tsx`, `terms/page.tsx`, `not-found.tsx`, `error.tsx`, `admin/`（`.eyebrow` 削除、簡潔化）
  - [x] 2-7: `src/app/globals.css`（角丸・シャドウ・アニメーションのAIスロップ排斥、4px端正エッジ・1pxボーダー調整）
- [x] Step 3: 品質ゲート通過（型・Lint・単体テスト52件・ビルド・E2Eテスト16件・BOM検証）
- [x] Step 4: 本番反映（Gitプッシュ・Cloudflare Pages デプロイ・実機検証）

## 2026-09-07 AAAクオリティへの究極刷新 & 余計な言葉の徹底殺処分

- [x] Step 1: 仮定・スコープの明示 & 余計な言葉の完全撲滅
  - [x] 1-1: `SiteFooter.tsx` から「作品と活動記録を、ひとつの場所に。」を完全削除
  - [x] 1-2: `About` ページから「MEGADRAWKは、Drawkの作品と活動記録をまとめたサイトです。」を完全削除
  - [x] 1-3: `Contact` ページの社交辞令文を簡潔・端正な案内に純化
  - [x] 1-4: `site.ts` の meta description・heroCopy を端正で品格ある表現に昇華
- [x] Step 2: AAAクオリティの視覚デザインシステム確立（Less, but better）
  - [x] 2-1: タイポグラフィと階層の極上チューニング（余白、字間、コントラスト）
  - [x] 2-2: ソリッドかつ端正なグリッド・ディバイダー・カード表現
  - [x] 2-3: マイクロインタラクション（触覚的フィードバック、スムーズで軽快なホバー）
- [x] Step 3: 全画面のAAAクオリティ実装
  - [x] 3-1: Home（堂々としたブランド表示、端正な主導線、美しい記事/制作物カード構造）
  - [x] 3-2: About（洗練されたプロフィール、製作物3件の極上カード表現、病歴ゼロ完全死守）
  - [x] 3-3: Blog（洗練された記事カード/空状態、コメント欄の端正なUI）
  - [x] 3-4: Contact（洗練された連絡先カード・アクション導線）
  - [x] 3-5: Header & Footer（静謐で美しい水平規律、無駄な文字ゼロ）
  - [x] 3-6: Privacy & Terms & Status（端正なドキュメントレイアウト）
- [x] Step 4: スクリーンショットによる視覚的検証（デスクトップ・モバイル）
- [x] Step 5: 品質ゲート（BOM・Lint・型・単体52件・E2E16件・ビルド）
- [x] Step 6: Gitコミット & origin/main プッシュ & Cloudflare Pages デプロイ & 実機URL確認

## 2026-09-08 トップページHero見出しのMEGADRAWKマーク（大型ロゴ）化

- [x] Step 1: 仮定・スコープの明示
  - `src/components/layout/BrandLockup.tsx` に `hero` プリセットを追加（大型サイズ: デスクトップで高さ約80px〜100px相当、モバイルで自然にレスポンシブ縮小）
  - `src/app/page.tsx` の `h1` テキストを大型MEGADRAWKマーク（`BrandLockup preset="hero"`）に置き換え
  - SEO / a11y のため `<span className="sr-only">MEGADRAWK</span>` を内包
- [x] Step 2: 実装 & 視覚確認（スクリーンショット検証: デスクトップ・モバイル共に完全な美しさを確認）
- [x] Step 3: 品質ゲート通過（BOM・型・Lint・単体52件・E2E17件・ビルドすべて完全パス）
- [x] Step 4: 本番反映（Gitプッシュ・Cloudflare Pages デプロイ・実機検証: https://megadrawk.com/ にて反映確認済み）

## 2026-09-08 個人開発紹介の画像リンク表示（AAAクラス）

- [x] Step 1: 仮定・スコープの明示
  - 公式ストアアセット（どこでも六法、Multi-Subtitles for YouTube、条文スコープ）の確保
  - `public/images/projects/` 配下への静的画像配置
  - `src/config/projects.ts` への `imageSrc` 追加
- [x] Step 2: UI層実装（`ProjectIcon.tsx` 作成、`page.tsx` および `about/page.tsx` への画像リンク配置）
- [x] Step 3: 品質ゲート通過（BOM・型・Lint・単体52件・E2E17件・ビルド全件完全パス）
- [x] Step 4: 視覚確認（スクリーンショット検証: デスクトップ・モバイル双方の美麗表示を確認）
- [x] Step 5: 本番反映（Gitプッシュ・Cloudflare Pages デプロイ・実機検証: https://megadrawk.com/ および /about にて配信確認完了）

## 2026-10-22 Astro完全移行

- [x] 静的生成・層境界・URLとコンテンツの保持
- [x] Astroルート・React islands・自己配信フォント
- [x] Next.js/OpenNext専用ファイルと旧生成物の削除
- [x] ハッシュCSP・HTTPヘッダー・保存データ保護
- [x] 自動品質ゲート・ブラウザ検証・証拠確認
- [x] READMEと開発者ガイド更新

## 2026-10-22 contact@megadrawk.com 対外主要アドレス化（Brevo完全対応）

- [x] 仮定・スコープの明示（受信: Cloudflare Email Routing / 送信: Brevo SMTP / 正本: SITE.email）
- [x] src/config/site.ts に email を追加し Contact ページへ反映（DRY・単一情報源）
- [x] 単体テスト（メール形式・ドメイン整合）とE2E（mailto表示・href）追加
- [x] 死蔵デザイントークン20個削除（tokens.css全トークンの使用数を機械監査）
- [x] e2e/migration.spec.ts → e2e/static.spec.ts リネーム（現役回帰テストの名称実態化）
- [x] Cloudflare DNS: Brevo認証レコード7件追加（brevo-code / DKIM×2 / DMARC / ブランド×3）
- [x] Cloudflare Email Routing: security@ 転送ルール新規作成（security.txtの死んだ宛先を修復）
- [x] Brevo: megadrawk.com ドメイン認証完了・送信者 Drawk <contact@megadrawk.com> Verified
- [x] DNS反映検証（8.8.8.8でDMARC / DKIM×2 / brevo-code / mailブランド確認）
- [x] DEVELOPER.md にメール構成セクション追加（Gmail Send as手順・DMARC強化計画・運用注意）
- [x] 品質ゲート（BOM・Prettier・ESLint・astro check・Vitest・ビルド・audit・E2E）
- [x] 未使用設定の全数調査（ローカル全リポジトリgrep・Cloudflare全Pages/Workers環境変数・DNS全レコード）→ Resend/SESレコードはlawdrawk問い合わせ送信（RESEND_API_KEY）が使用中のため保持。削除対象は0件と判定
- [x] Brevo SMTPキー生成の自動実行開始 → メールstep-up認証コードはGmailから自動取得して通過
- [x] 受信経路の実E2E確認（Gmail→contact@→Email Routing→受信トレイの往復を実送信で検証）
- [x] 本番のmailtoがCloudflareメール難読化+CSPで壊れていることを実機で発見 → Email Obfuscation offで修復、実機再確認
- [x] ユーザーが電話SMS認証を実施 → 以降を全自動で完走
- [x] Brevo SMTPキー（gmail-send-as）生成・取得（値は転記せず即消費、一時ファイルは削除済み）
- [x] Gmail送信元 MegaDrawk <contact@megadrawk.com> をResend SMTPからsmtp-relay.brevo.comへ移行（旧Resend依存を解消、lawdrawk.comエントリは変更なし）
- [x] 実送信テスト: From=contact@megadrawk.com（Brevo経由）で送信 → Sent/受信トレイ双方で実ヘッダ確認
- [x] 既定の送信元をcontact@megadrawk.comに設定（対外主要アドレスとして意図した状態。戻し方もDEVELOPER.mdに記載）

## 2026-10-23 公開アプリとサイト再設計

- [x] 条文スコープの掲載・画像を削除
- [x] Google Playで3アプリの公開確認、製品版リンク・名称・説明・アイコンの同期
- [x] 共通の製品一覧、白・スレート基調の静かな画面へ再設計
- [x] 実際の通信・保存・広告状態に沿うプライバシーポリシーと利用規約の修正
- [x] 自動更新ジョブの実行と本番反映・画面確認

## 2026-10-25 改良12項目実装（ブログ個別ページ・SEO・フォーム・ダークモード・解析・アイコン・Lighthouse）

- [x] 精査完了（既存コード・e2e・セキュリティ正本・CI規約）
- [x] 3-1: ブログ個別ページ /blog/[id]（getStaticPaths・本文段落化・コメント・Article JSON-LD・Homeリンク更新）
- [x] 3-2: RSS /rss.xml（lib/rss.ts 純粋関数・escapeXml共有 lib/xml.ts・sitemap拡張）
- [x] 3-3: OG画像生成スクリプト＋og:image / twitter:card 設定
- [x] 3-4: 構造化データ lib/structuredData.ts（Person/WebSite/ItemList/SoftwareApplication/Article）
- [x] 3-5: プラットフォーム表記（ProjectList＋projects.ts拡張）
- [x] 3-6: ダークモード（tokens.css darkブロック・no-flashスクリプト・ヘッダートグル）
- [x] 3-7: お問い合わせフォーム（domain/contact共有バリデーション・ContactForm island・functions/api/contact.ts Turnstile+Brevo・CSP条件拡張）
- [x] 3-8: Cloudflare Web Analytics（PUBLIC_CF_WEB_ANALYTICS_TOKEN 条件注入）
- [x] 3-9: アイコン補完（apple-touch-icon・manifest PNG icons）
- [x] 3-10: Lighthouse CI ワークフロー
- [x] 3-11: .env.example・manifest・README/DEVELOPER.md 更新
- [x] Step 4 品質ゲート: encoding / format / lint / typecheck / unit / build / audit / e2e
- [x] Step 5 自己レビュー・修正
- [x] Step 6 ドキュメント整備

## 2026-10-25 公開前設定と本番反映（ユーザー指示で自動化）

- [x] 認証手段の調査（ローカル資格情報なし → ユーザーBraveのCDP経由で運用）
- [x] Cloudflare Turnstileウィジェット megadrawk-contact 作成（managed / megadrawk.com）
- [x] Pages本番環境変数に PUBLIC_TURNSTILE_SITE_KEY / TURNSTILE_SECRET_KEY / BREVO_API_KEY を設定
- [x] Brevo APIキー megadrawk-contact-085402 を生成（Restricted / Transactional email: All / 無期限）し値喪失の孤児キー2件を削除
- [x] Web Analyticsはゾーンの自動注入が有効であることを確認（トークン設定はせず二重計測回避）
- [x] 改良一式をコミット＆プッシュしCloudflare Pagesが本番反映
- [x] デプロイ失敗の根本修正: FunctionsのモジュールスコープResponse生成を廃止（lessons記録）
- [x] 環境変数消失の根本修正: wrangler.tomlを削除しダッシュボード/API管理へ統一（lessons記録）
- [x] 本番検証: /rss.xml・og:image・apple-touch-icon・CSP(challenges.cloudflare.com)・フォームisland・/api/contact 400応答
- [x] 実送信E2E: 本番フォーム→Turnstile→Function→Brevo→contact@→Gmail着信を確認（18:41受領）

## 2026-10-25 お問い合わせフォームのメールアドレス任意化

- [x] Step 1: 仮定・スコープの明示（メール任意＋返信条件の注記。他フォーム・他機能には触れない）
- [x] Step 2: アーキテクチャ設計（ドメイン＝任意という知識の正本、UI＝表示のみ、インフラ＝replyTo条件化。単方向データフロー維持）
- [x] Step 3: 実装
  - [x] 3-1: ドメイン層（`email-empty` を廃止、入力時のみ形式・長さを検証）
  - [x] 3-2: インフラ層（`buildBrevoEmail` で未入力時はReply-Toを付けず本文に「返信先: （記載なし）」）
  - [x] 3-3: UI層（`required` 廃止、ラベル「メールアドレス（任意）」、注記・成功文言を返信条件つきに更新）
- [x] Step 4: 品質ゲート（encoding / Prettier / ESLint / astro check / Vitest / ビルド）
- [x] Step 5: 自己レビュー・修正（未入力許可と形式検証の共存、e2eへの影響なし確認）
- [x] Step 6: ドキュメント整備（DEVELOPER.md の処理順・任意方針を追記）

## 2026-10-25 ブログ機能のプロ標準化（優先度A・B・C全部）

- [x] A1: Markdown＋Content Collections移行（src/content/blog/*.md正本・Zodスキーマ・Shiki二重テーマ）
- [x] A2: 記事別OG画像（satori＋sharpのビルド時エンドポイント・Noto Sans JP OTF同梱）
- [x] A3: frontmatterのdescription明示＋読了時間算出（blogUtils純粋関数）
- [x] B: 前後記事ナビ・タグページ（/tags/[tag]）・関連記事・目次
- [x] C: giscus導入（リポジトリ公開・Discussions有効化・アプリ導入・Announcementsカテゴリ・themechange連動）
- [x] 草案エディターをMarkdown生成に刷新（draftフラグ・ファイル名提案・ストレージ形状更新）
- [x] 初回投稿「MEGADRAWKへようこそ」作成
- [x] 旧localStorageコメント機能の削除（データは削除せず）＋プライバシーポリシー更新
- [x] セキュリティ正本の拡張: Shiki形式style属性の許可リスト＋CSP style-src-attrハッシュ化
- [x] npm audit: satori依存fflateの脆弱性をオーバーライド（0.8.3）で解消
- [x] 品質ゲート全パス（単体90・E2E44）→本番反映

## 2026-10-25 コメント機能の方針変更（ユーザー指示）

- [x] giscus（GitHub認証必須）を撤去し、アカウント不要のlocalStorage型コメント（CommentSection）を復元
- [x] コメント欄にX・お問い合わせフォームへの公開導線を併記（GitHubアカウントを持たない読者への案内）
- [x] CSPからgiscusオリジンを除去、プライバシーポリシー・README・DEVELOPER.mdを現状に整合
- [x] 記事ページのMarkdown化・OG画像・目次・タグページなど、ブログ機能本体は維持

## 2026-10-25 公開コメントシステム（誰でも投稿・D1保存）

- [x] giscus撤去済み（ユーザー指示: GitHubアカウント必須のため）＋アカウント不要コメントへ刷新
- [x] Cloudflare D1データベース megadrawk-comments 作成・COMMENTS_DBバインディング設定
- [x] functions/api/comments/[postId].ts: GET一覧・POST投稿・DELETE管理削除
- [x] スパム対策: Turnstile検証、IPハッシュ化（IP_HASH_SALT、生IP非保存）、10分連投クールダウン、24時間同一本文再送抑止、入力上限（名前30/本文500文字）、8KBボディ上限
- [x] 管理削除API（X-Admin-Token認証、ADMIN_DELETE_TOKENをPagesシークレットに設定済み）
- [x] CommentSection刷新: useTurnstileフック共有化（ContactFormとDRY）、状態表現（loading/empty/error/success）
- [x] プライバシーポリシー・README・DEVELOPER.mdを公開コメントの実態に更新
- [x] Shikiのstyle属性CSP: 'unsafe-hashes'付与で実ブラウザでも有効化
- [x] 単体127件・E2E44件全パス→本番反映→実投稿確認

- [x] 本番障害修正: D1バインディングPATCH時にシークレット値が空置換された問題を特定し、Turnstile再発行＋全シークレット再設定で復旧（連絡フォームも同時復旧）
- [x] 本番E2E: Turnstileチェック→公開コメント投稿→D1永続化→別セッションGET表示→テストデータ削除

## 2026-10-25 返信機能・レート制限変更・初回記事書き直し（ユーザー指示）

- [x] giscusアプリの削除はユーザーが実施
- [x] コメント返信機能: D1にparent_id追加、返信はトップレベルへの1階層（返信への返信はサーバーでルートに正規化）、返信ボタン＋返信モードUI、スレッド表示
- [x] レート制限を変更: 60秒間隔・10分3件・1日10件（日本時間）・同一記事1日3件・本文2,000文字（旧10分クールダウン・500文字から変更）
- [x] 編集機能: 投稿後10分以内・同一IPハッシュのみPUT /api/comments で本文編集、edited_at記録、「（編集済み）」表示
- [x] useTurnstileフック新設（ContactFormと共有）
- [x] 初回記事を書き直し（エンジニア向け記述・GitHub言及を削除しシンプルに。タイトル「ブログをはじめました」）
- [x] コメント欄・プライバシーポリシーから「GitHubアカウントは不要です」の文言を削除
- [x] 単体テスト149件・E2E44件全パス

- [x] 管理者コメントへの返信は3件までレート制限を免除（4件目以降は原則の制限、管理者名はSITE.ownerName）
- [x] 本番E2E: 管理者親コメント→返信3連投（免除で60秒待たずに成功）→4件目は429→10分以内編集成功。実訪問者コメントには編集ボタンが出ないことも確認
- [x] 投稿成功後にTurnstileウィジェットを再発行（連続投稿でトークン再利用失敗する問題を修正）
- [x] テストコメント清掃（実訪問者のコメントは保持）

## 2026-10-25 管理画面（コメント管理・記事管理）＋なりすまし対策

- [x] D1にis_admin列追加。管理人コメント（バッジ表示）は管理画面からのみ投稿可能
- [x] 一般フォームから名前「Drawk」を予約語として拒否（403）
- [x] 返信免除判定を名前一致からis_admin参照へ変更（なりすましによる免除悪用を解消）
- [x] 管理API: GET/POST /api/admin/comments（X-Admin-Token認証）、GET/PUT/DELETE /api/admin/articles（GitHub Contents APIでsrc/content/blogをコミット）
- [x] /admin/comments: 全コメント一覧・管理人コメント投稿（返信対応）・削除
- [x] /admin/articles: Markdownのまま記事を追加・編集・削除（保存でGitHubコミット→Pages自動再ビルド1〜2分）
- [x] 環境変数にGITHUB_TOKEN追加、既存シークレットを実値で再設定
- [x] 単体テスト161件・E2E44件全パス

## 2026-10-25 管理画面実装の本番検証

- [x] GitHub 403の根本原因（UA必須）を特定・修正し本番API 200を確認
- [x] 本番E2E: 管理画面認証→記事新規作成→GitHubコミット→削除まで成功（実訪問者コメントは保持）
- [x] 管理人コメント＋バッジは公開ページで確認済み（前回E2E）

## 2026-10-26 管理メニューのパスワードゲート化（ユーザー指示）

- [x] 全管理ページ（/admin、/admin/comments、/admin/articles）にポップアップ式パスワードゲートを実装
- [x] 認証方式をHttpOnlyセッションCookieへ変更: POST /api/admin/session がパスワード検証後、SHA-256導出値のCookie（HttpOnly/Secure/SameSite=Strict/12時間）を発行。JavaScriptからは値も生パスワードも読めない
- [x] 全管理API（admin comments/articles、コメントDELETE）を checkAdminAccess に統一（X-Admin-TokenヘッダまたはセッションCookie）
- [x] localStorageへトークンを保存する方式を廃止（漏洩面の除去）
- [x] 単体テスト166件・E2E44件全パス

## 2026-10-26 管理メニューのパスワードポップアップ化（漏洩対策込み）

- [x] /adminメニュー本体もゲートの裏へ移動（サーバーHTMLに管理メニュー本文を出さない）
- [x] ポップアップ（dialog、表示名「パスワード」）で入力、誤パスワードは401で拒否
- [x] 認証をHttpOnlyセッションCookie方式へ変更: 生パスワード・トークンはJSから読めず、localStorage保存も廃止
- [x] 漏洩検査: HTML/localStorage/sessionStorage/document.cookieのいずれにもパスワード・セッション値が現れないことを実機確認
- [x] 単体166件・E2E44件全パス

## 2026-10-26 Google Search Console設定（ユーザー指示・Brave操作）

- [x] megadrawk.com/sitemap.xml を送信（それまでは別サイトmeetpicksの分のみ登録だった）
- [x] ホームは「URL は Google に登録されています」を確認（既にインデックス済み）
- [x] 記事 /blog/2026-10-25-hello-megadrawk は未登録のため「インデックス登録をリクエスト」を実行
- [x] 今後の記事はサイトマップに自動追加→Googleが定期的に取得で自動掲載（追加操作不要）

## 2026-10-26 記事編集の左右分割＋Markdownツールバー（ユーザー指示）

- [x] 記事管理画面を左右分割に（左：ツールバー付きMarkdownエディタ、右：リアルタイムプレビュー、PCはsticky、モバイルは縦積み）
- [x] Markdownツールバー: 見出し2/3・太字・斜体・リンク・箇条書き・番号付き・引用・コードブロック（選択範囲を尊重、行頭記法はトグル、カーソル位置復元）
- [x] プレビューはmarkedでレンダリング＋簡易サニタイザ（script/on属性/javascript:除去）＋CSP二重防御
- [x] 草案エディター（/admin/posts/new）も同じツールバー＋本物のMarkdownプレビューに更新
- [x] marked追加、単体6件追加（markdownPreview）、E2Eのエラー検査をセキュリティ関連に限定（壊れたimgの404は許容）
- [x] 単体166件・E2E44件全パス
- [x] ツールバー挿入をDOM直接更新＋inputイベント発火方式に変更（制御コンポーネントの競合で文字化けする問題を修正、ネイティブUndo/Redoも保持）
- [x] ツールバー修正: 行頭記法適用後のカーソルを行末へ（選択範囲復元による記法消失を解消）、挿入はネイティブセッター＋onChange明示呼び出しに二重化

## 2026-10-26 記事編集・画像管理
- [x] 既存実装と保存時の再マウント原因を確認
- [x] 全幅分割・双方向連動・保存状態保持・画像パネル・ページ内拡大
- [x] 認証付き画像API・Git単一コミット保存
- [x] 品質ゲート・ブラウザ回帰確認（単体194件、E2E50件、依存監査0件、Functionsコンパイル成功）
- [x] リモート統合・本番デプロイ・認証済み実画面確認（単一コミット保存、連続保存、同一DOM・選択・スクロール保持、未認証404/401、既存記事画像拡大とフォーカス復帰、検証記事・画像の後片付け）

## 2026-10-26 記事内アプリ紹介カードの埋め込み機能（ユーザー指示）

- [x] Markdown中に `[app:パッケージID]` のみの行を書くとアプリ紹介カード（アイコン・名前・説明・ストアリンク）を自動生成
- [x] データは store-listings.json（毎日のストア同期の正本）から取得 → 同期でストア情報が更新されるとカードも自動更新
- [x] src/lib/appCard.ts（カードHTML生成・HTMLエスケープ）+ remarkプラグイン（src/infra/blog/remarkAppCard.ts）+ astro.config登録
- [x] 未知のパッケージIDは本文のまま残す（誤記に寛容）
- [x] 単体5件追加、ローカルビルドで描画確認済み（カード生成・未知IDフォールバック）
- [x] リベンス時の競合（利用者が管理画面から保存した記事）はリモート版を優先して解消

## 2026-10-26 記事の復元と文言修正（ユーザー指示）

- [x] 「公開の場でのご連絡は…」の文言をコメント欄から削除
- [x] リベンス競合解消ミスで旧版になっていた「TJA Pocketにスキンを追加する方法」を1272c58（利用者の最終版）から復元、欠落していた画像7枚もc992a51から復元
- [x] lessons.mdにリベンス--theirs/--ours取り違えの教訓を記録
- [x] 単体172件・E2E50件全パス

## 2026-10-26 記事の太字記号の表示修正
- [x] 該当箇所と同種箇所の修正
- [ ] プレビュー・静的変換・本番表示の確認
