# Design — MEGADRAWK

MEGADRAWKの公開サイト全体で共有する、フラグシップ用のデザインシステムです。
ページごとにテーマを再生成せず、以下の規約を正本として拡張します。

## Genre

modern-minimal（技術的な個人開発者サイトとしての静かな強さ）

## Macrostructure family

- Marketing / home: Split Studio + Index-First。左にステートメント、右に意味のあるプレート。更新は罫線付きのインデックスで見せる。
- App / admin: Workbench。管理機能の責務と操作性を優先し、公開サイトの装飾は持ち込まない。
- Content / blog and legal: Long Document。見出し、本文、日付、罫線の順で読むリズムを固定する。

## Theme

冷たい紙面とグラファイトを基調に、コバルトを信号色として少量だけ使う。

- `--color-paper` oklch(98.2% 0.004 250)
- `--color-paper-2` oklch(95.8% 0.006 250)
- `--color-ink` oklch(20% 0.016 258)
- `--color-ink-2` oklch(32% 0.018 257)
- `--color-rule` oklch(83% 0.01 250)
- `--color-accent` oklch(57% 0.2 256)
- `--color-accent-ink` oklch(99% 0.004 250)
- `--color-graphite` oklch(22% 0.018 260)

## Typography

- Display: Bricolage Grotesque, weight 600–800, roman
- Body: IBM Plex Sans, weight 400–700
- Mono: IBM Plex Mono, weight 400–600（ラベル、日付、操作語）
- Display tracking: `-0.035em` 〜 `-0.075em`
- Type scale anchor: display `clamp(2.1rem, 9.5vw, 6.25rem)`（ブランド名）

## Spacing

4-point named scale。値は`tokens.css`に集約し、ページCSSはトークンを参照します。

## Motion

- Easings: `--ease-standard` / `--ease-emphasized`
- Reveal pattern: 初回表示の短いfade + riseのみ
- Reduced-motion fallback: 静的表示、アニメーションは実質無効化

## Microinteractions stance

- 成功は静かな状態更新。祝祭的トーストやバウンスは使わない。
- ホバーは罫線・下線・1pxの移動だけ。フォーカスは即時の`outline`で示す。
- 既存のコメント入力はloading / empty / error / successを維持する。

## CTA voice

- Primary: コバルトの矩形ボタン、6–10pxの角丸、行動を具体的に書く。
- Secondary: 透明背景＋罫線、同じ高さ、1行を保つ。
- 補助導線: ボックスを増やさず、下線付きのタイポグラフィリンク。

## Navigation and footer

- Navigation: edge-aligned typographic rail。ロゴ、短いサイト印、3つの主要導線を同じ水平線に置く。モバイルでは同じ導線をシートに折りたたむ。
- Footer: letter-close。グラファイト帯にロゴ、短い締めの文、リンクのインデックス、コピーライトを置く。

## What pages MUST share

- `BrandLockup`のロゴと、紙色・グラファイト・コバルトの色関係
- Bricolage Grotesque / IBM Plex Sans / IBM Plex Monoの役割分担
- CTAの高さ、角丸、フォーカスリング、レスポンシブ規約
- 320 / 375 / 414 / 768pxでの横スクロールなしとクリック可能テキストの1行維持

## What pages MAY differ on

- HomeはSplit Studio、Blogと法的文書はLong Document、Adminは操作密度を優先するWorkbench
- ダーク帯は公開ページに最大1箇所。管理画面では機能優先で使用しない。
- 公開ページのコピーは既存の事実・導線を保持し、医療情報など削除済みの個人情報は再導入しない。

## Source files

- Tokens: `tokens.css`
- Entry stylesheet: `src/styles/globals.css`
- Layout: `src/layouts/SiteLayout.astro`
- Shared chrome: `src/components/layout/SiteHeader.tsx`, `src/components/layout/SiteFooter.tsx`
