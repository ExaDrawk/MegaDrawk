---
title: "MEGADRAWKへようこそ"
description: "このサイトとブログについて。公開しているアプリ、このブログで書いていくこと、そしてこのサイト自体の作り方の話。"
date: "2026-10-25"
tags: ["制作品", "サイト運営"]
---

こんにちは。私はDrawkと申します。このサイトでは、私の個人開発の制作物や日々の学びを紹介していきます。

## 公開しているもの

現在、Google PlayとChrome ウェブストアでアプリを公開しています。

- **どこでも六法**: 日本の主要法令を検索し、条文・参照関係・履歴をすばやく確認できるAndroidアプリ
- **証ぴた**: 証明写真をL判・A4などの印刷シートやPDFにするAndroidアプリ
- **TJA Pocket**: TJAファイルで遊べる太鼓リズムゲームのAndroidアプリ
- **Multi-Subtitles for YouTube**: YouTubeの字幕を複数言語で同時表示するChrome拡張機能

それぞれの詳細はトップページのリンクからストアへ飛べます。

## このブログで書いていくこと

アプリの機能追加や不具合修正の記録、調べたことのメモ、開発環境の話などを書いていく予定です。

例えば、このサイト自体はAstroで静的生成していて、記事はMarkdownで書いています。コードブロックもこのように表示されます。

```ts
// 記事はsrc/content/blog/のMarkdownファイルが正本
import { getPublishedBlogPosts } from "@/config/blog";

const posts = await getPublishedBlogPosts();
console.log(posts[0]?.title);
```

シンタックスハイライトはビルド時にShikiで付けているので、JavaScript無効の環境でもそのまま表示されます。

## このサイトの作りについて

関心のある方のために、構成だけまとめておきます。

1. 静的サイトジェネレーターのAstroでビルドし、Cloudflare Pagesで配信
2. Reactが動くのはコメント欄と管理画面の草案エディターだけで、公開ページは純粋なHTMLとCSS
3. 記事を更新するとRSSとサイトマップ、記事ごとのSNSカード画像が自動で生成される

コメントは各記事の末尾からGitHubアカウントで書き込めます。気になる点や感想があれば、気軽にどうぞ。
