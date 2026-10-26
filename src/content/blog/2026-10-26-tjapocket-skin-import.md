---
title: "TJA Pocketにスキンを追加する方法"
description: "TJA Pocketでスキンを使う3つの方法を画像付きで紹介します。ZIPの取り込み、解凍済みフォルダの取り込み、自分で配置したフォルダの参照登録から、設定での切り替えまでをまとめました。"
date: "2026-10-26"
tags: ["TJA Pocket", "使い方"]
draft: false
---

こんにちは、Drawkです。

今回は、TJA Pocketにスキンを追加する方法を紹介します。

TJA Pocketでは、スキンの置き方に合わせて、**ZIPの取り込み・フォルダの取り込み・参照フォルダの登録**の3通りから選べます。

> 画面はPixel 8a／Android 16で撮影しました。**TJA Pocket 0.1.6**を使用しています。ストアで配信中の版では、仕様が一部異なる場合があります。

## 1. 配布元からスキンをダウンロードする

[OpenTaiko-SkinsのGitHubリリースページ](https://github.com/OpenTaiko/OpenTaiko-Skins/releases)を開き、使いたいスキンのZIPをダウンロードします。

配布ファイルには `Open-World.Memories.zip`、`SimpleStyle.1080p.zip`、`SimpleStyle.zip` があります。この記事では **`SimpleStyle.1080p.zip`** を使います。

ZIPのまま取り込む場合は、ここで解凍する必要はありません。フォルダで取り込む場合や、参照フォルダとして登録する場合は、端末のファイル管理アプリで解凍しておきます。

## 2. TJA Pocketの管理画面で「スキン」を選ぶ

選曲画面の歯車ボタンから設定を開き、右上の **「ファイル管理」** を押します。

管理画面の左側には、上から**種類の切り替え・一覧・ファイル・参照フォルダ**が並んでいます。種類のボタンが「曲 ▾」などになっていたら、押して **「スキン」** を選んでください。

[![管理する種類からスキンを選ぶ画面。曲・スキン・キャラクター・プチキャラ・音色・フォントを切り替えられる](/blog-assets/2026-10-26-tjapocket-skin-import/12-resource-type.png)](/blog-assets/2026-10-26-tjapocket-skin-import/12-resource-type.png)

## 方法A：ZIPをそのまま取り込む

まだ解凍していない場合は、この方法が手軽です。

取り込むと、選択した保存先にスキン一式がコピーされます。標準の保存先は通常、次のフォルダです。

```text
/storage/emulated/0/Android/data/com.drawk.tjapocket/files/System
```

方法Cで登録した参照フォルダも、取り込み先として選択できます。

1. スキン管理の右上にある **「追加」** を押します。
2. **「ZIPを取り込む」** を選びます。
3. ダウンロードした `SimpleStyle.1080p.zip` を選びます。
4. 読み込み後の確認画面で、スキン名を確認して **「追加」** を押します。

[![スキン管理の追加メニュー。ZIPを取り込む・フォルダを取り込む・ファイルを追加・参照フォルダを登録が表示されている](/blog-assets/2026-10-26-tjapocket-skin-import/13-import-methods.png)](/blog-assets/2026-10-26-tjapocket-skin-import/13-import-methods.png)

## 方法B：解凍済みのフォルダを取り込む

ZIPをすでに解凍してある場合は、フォルダごと取り込めます。

この方法も、選択した保存先へスキン一式をコピーします。

1. スキン管理の **「追加」→「フォルダを取り込む」** を選びます。
2. Androidのフォルダ選択画面で、解凍した場所へ移動します。
3. **`SimpleStyle (1080p)`** を開き、**「このフォルダを使用」** を押します。
4. アクセス許可の確認が出たら **「許可」** を選びます。

[![説明用のSimpleStyle (1080p)フォルダを開いたAndroidの選択画面。下部にこのフォルダを使用ボタンがある](/blog-assets/2026-10-26-tjapocket-skin-import/21-skin-folder-clean.png)](/blog-assets/2026-10-26-tjapocket-skin-import/21-skin-folder-clean.png)

スキン本体の目印は **`SkinConfig.ini`** です。同じフォルダに `Graphics` や `Sounds` なども入っています。

読み込みが終わったら、確認画面で取り込み対象を確認して **「追加」** を押します。

[![取り込み内容の確認画面。SimpleStyle (1080p)が対象として表示され、追加ボタンから取り込める](/blog-assets/2026-10-26-tjapocket-skin-import/15-import-preview.png)](/blog-assets/2026-10-26-tjapocket-skin-import/15-import-preview.png)

スキンが一段奥にある親フォルダを選んだ場合も、配下を探索します。親フォルダの中に複数のスキンがある場合は、まとめて取り込み対象にできます。

同じ名前のフォルダが保存先にある場合は、別名で追加されます。

## 方法C：自分で置いたフォルダを参照登録する

スキンを置く場所を自分で管理したい場合は、**参照フォルダの登録**を使います。

まず、端末のファイル管理アプリなどで、使いたい場所にスキン一式を置きます。今回は `MegaDrawk_SkinGuide` フォルダを作り、その中に `SimpleStyle (1080p)` を置きました。フォルダ名は同じでなくても構いません。

1. スキン管理の左側にある **「参照フォルダ」** を押します。
2. **「追加」** を押し、読み込み元にしたいフォルダを開きます。
3. **「このフォルダを使用」→「許可」** を選びます。

[![説明用のMegaDrawk_SkinGuideフォルダを読み込み元として選ぶ画面。中にはSimpleStyle (1080p)だけが入っている](/blog-assets/2026-10-26-tjapocket-skin-import/22-source-parent-clean.png)](/blog-assets/2026-10-26-tjapocket-skin-import/22-source-parent-clean.png)

**スキン本体を指定しても、その親フォルダを指定しても使えます。** 更新後の検証版では、登録したフォルダの配下をたどり、`SkinConfig.ini` のある場所を探します。たとえば、次のように間に `System` フォルダが挟まっていても検出対象になります。

```text
登録するフォルダ/
└─ OpenTaiko-Skins-main/
   └─ System/
      └─ SimpleStyle (1080p)/
         ├─ SkinConfig.ini
         ├─ Graphics/
         └─ Sounds/
```

登録後は、参照フォルダの一覧に名前が追加されたことを確認してください。

[![参照フォルダの一覧に、標準と説明用のMegaDrawk_SkinGuideが表示されている](/blog-assets/2026-10-26-tjapocket-skin-import/18-source-registered.png)](/blog-assets/2026-10-26-tjapocket-skin-import/18-source-registered.png)

登録を外したい場合も、登録したフォルダ名から **「登録を解除」** を選べます。登録を解除しても、元のフォルダやファイルは残ります。

## 最後に、設定で使うスキンを選ぶ

どの方法で追加した場合も、**追加や登録だけでは、使うスキンは切り替わりません。**

設定へ戻り、**「外観」→「スキン」**を開いて、使いたい **「SimpleStyle (1080p)」** を選びます。

[![外観設定のスキン欄にSimpleStyle (1080p)が表示されている](/blog-assets/2026-10-26-tjapocket-skin-import/23-selected-skin-clean.png)](/blog-assets/2026-10-26-tjapocket-skin-import/23-selected-skin-clean.png)

選択後は「戻る」で選曲画面へ戻り、表示を確認してください。ほかのスキンに戻す場合も、同じ設定から選び直せます。

## うまくいかないとき

### フォルダを選択できない

Androidの制限により、`Download` フォルダ全体などを指定できない場合があります。その中にスキン用のフォルダを作り、作成したフォルダを指定してください。

### 文字が読みづらい・一部が表示されない

**「外観」→「フォント」**で、アプリに用意されているNoto Sans JPを選び直してみてください。フォントインストールや `Config.ini` 編集を、Androidでそのまま行う必要はありません。

### キャラクターやプチキャラも変わった

スキンを切り替えると、そのスキンに合わせて表示の選択が変わる場合があります。表示したくないときは、「外観」の **「キャラクター」「プチキャラ」** で再度選択してください。

最新版のOpenTaikoでは正常に表示されるスキンについては、可能な限り対応いたします。ただし、すべてのスキンで同じ表示・動作になるとは限りません。あらかじめご了承ください。