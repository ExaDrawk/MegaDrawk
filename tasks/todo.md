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
- [ ] 残課題: Cloudflareダッシュボードのビルド設定を `npm run deploy` + 出力 `.open-next` に変更（Git連携ビルドは旧Astro設定のままで失敗するため。直接アップロード運用なら不要）

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
