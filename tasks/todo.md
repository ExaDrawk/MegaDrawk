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
- [ ] 残課題: Cloudflareダッシュボードのビルド設定を `npm run deploy` + 出力 `.open-next` に変更（Git連携ビルドは旧Astro設定のままで失敗するため。直接アップロード運用なら不要）
