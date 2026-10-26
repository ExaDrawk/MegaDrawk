---
title: "TJA Pocketにスキンを追加する方法｜SimpleStyleを例に紹介"
description: "TJA Pocketにスキンを追加し、表示を切り替えるまでの手順を画像付きで紹介します。OpenTaiko-Skinsの配布元から取得する方法と、解凍後に選ぶフォルダ、アプリ側の設定をまとめました。"
date: "2026-10-26"
tags: ["TJA Pocket", "使い方"]
draft: true
---

こんにちは、Drawkです。

今回は、TJA Pocketにスキンを追加する方法を紹介します。例として使うのは、OpenTaikoが案内している配布元の **SimpleStyle（1080p）** です。

流れは、**配布元からダウンロード → ZIPを解凍 → スキンのフォルダを取り込む → 設定で選ぶ**、の4つです。

> 画面は2026年10月26日、Pixel 8a／Android 16のTJA Pocket **0.1.6検証版**で撮影しました。取り込みに使ったSimpleStyle（1080p）は **0.6.0.7** です。アプリやスキンのバージョンによって、画面や動作が異なる場合があります。

## 1. 配布元からスキンをダウンロードする

まずは、[OpenTaiko-SkinsのGitHubページ](https://github.com/OpenTaiko/OpenTaiko-Skins)を開きます。

ダウンロード前に、[SimpleStyle（1080p）のREADME](https://github.com/OpenTaiko/OpenTaiko-Skins/blob/main/System/SimpleStyle%20%281080p%29/README.txt)を確認してください。スキンには複数の制作者の素材が含まれており、利用条件は配布元や各素材の案内に従います。

GitHubのリポジトリ画面で **「Code」→「Download ZIP」** を選ぶと、ファイル一式をダウンロードできます。画面の幅によってボタンが見つからない場合は、ブラウザーの「PC版サイト」表示も試してください。GitHubの操作は[公式のダウンロード案内](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives)でも確認できます。

このZIPには、SimpleStyle以外のスキンや共通素材も含まれます。通信量や空き容量に余裕のある状態で取得してください。この記事では、その中のSimpleStyle（1080p）だけを使います。

スキン本体は配布元から取得してください。このページではファイルの転載・再配布はしていません。

## 2. ZIPを解凍し、使うフォルダを確認する

保存したZIPを、端末のファイル管理アプリで解凍します。`main`ブランチのZIPなら、解凍後はおおむね次の構成になります。

[![OpenTaiko-Skins-mainのSystemフォルダ内にあるSimpleStyle (1080p)を選ぶ。中にはSkinConfig.iniとGraphics、Soundsなどがある](/blog-assets/2026-10-26-tjapocket-skin-import/00-folder-layout.svg)](/blog-assets/2026-10-26-tjapocket-skin-import/00-folder-layout.svg)

今回取り込むのは、**`System` の中にある `SimpleStyle (1080p)` フォルダ**です。その直下に `SkinConfig.ini` があり、`Graphics` や `Sounds` なども一緒に入っていることを確認します。

フォルダを別の場所へ移す場合は、`SkinConfig.ini`だけを取り出さず、**`SimpleStyle (1080p)`を中身ごと**移してください。

## 3. TJA Pocketの「ファイル管理」を開く

選曲画面の歯車ボタンで設定を開き、右上の **「ファイル管理」** を押します。

[![TJA Pocketの設定画面。右上に「ファイル管理」と「曲管理」が並んでいる](/blog-assets/2026-10-26-tjapocket-skin-import/01-settings.png)](/blog-assets/2026-10-26-tjapocket-skin-import/01-settings.png)

ファイル管理では、曲やスキンなど、管理する種類を切り替えられます。左側にある **「曲 ▾」** などの種類ボタンを押し、**「スキン」** を選んでください。すでに「スキン管理」になっている場合は、そのままで大丈夫です。

[![管理する種類の選択画面に、曲・スキン・キャラクター・プチキャラ・音色・フォントが並んでいる](/blog-assets/2026-10-26-tjapocket-skin-import/02-resource-type.png)](/blog-assets/2026-10-26-tjapocket-skin-import/02-resource-type.png)

## 4. 「フォルダを取り込む」を選ぶ

スキン管理の右上にある **「追加」** を押し、**「フォルダを取り込む」** を選びます。

[![スキン管理の「追加」メニューに、「フォルダを取り込む」などの項目が表示されている](/blog-assets/2026-10-26-tjapocket-skin-import/03-add-folder.png)](/blog-assets/2026-10-26-tjapocket-skin-import/03-add-folder.png)

Androidのフォルダ選択画面が開いたら、解凍した場所へ移動して、**`SimpleStyle (1080p)` の中を開きます。**

[![SimpleStyle (1080p)フォルダを開いたAndroidのフォルダ選択画面。Fonts・Graphics・Modules・Soundsがあり、下に「このフォルダを使用」が表示されている](/blog-assets/2026-10-26-tjapocket-skin-import/04-select-folder.png)](/blog-assets/2026-10-26-tjapocket-skin-import/04-select-folder.png)

画面下の **「このフォルダを使用」** を押し、アクセス許可の確認が出たら **「許可」** を選びます。

Downloadフォルダそのものは、Androidの制限で選べない場合があります。取り込みたいスキンのフォルダまで入ってから指定してください。

## 5. 内容を確認して追加する

ファイルの数や容量によっては、読み込みに少し時間がかかります。取り込み内容が表示されるまで待ちましょう。

[![取り込み内容の確認画面に、SimpleStyle (1080p)が1項目として表示されている](/blog-assets/2026-10-26-tjapocket-skin-import/06-import-preview.png)](/blog-assets/2026-10-26-tjapocket-skin-import/06-import-preview.png)

取り込むスキンのフォルダ名を確認して **「追加」** を押します。追加が終わったら、スキン管理にフォルダが増えていることを確認してください。

同じ名前のフォルダがすでにある場合は、別名で追加されることがあります。更新のつもりで繰り返し取り込む前に、今あるスキンを確認しておくと整理しやすくなります。

## 6. 設定でスキンを切り替える

スキンを追加しただけでは、現在の表示は切り替わりません。

設定へ戻り、**「外観」→「スキン」** を開いて、追加した **「SimpleStyle (1080p)」** を選びます。

[![外観設定の「スキン」に、選択したSimpleStyle (1080p)が表示されている](/blog-assets/2026-10-26-tjapocket-skin-import/08-selected-skin.png)](/blog-assets/2026-10-26-tjapocket-skin-import/08-selected-skin.png)

選択後に「戻る」で選曲画面へ戻り、表示が切り替わったことを確認してください。ほかのスキンに戻したいときも、同じ設定から選び直せます。

## ZIPのまま取り込みたい場合

スキン管理の「追加」には **「ZIPを取り込む」** もあります。スキン単体のZIPを用意している場合は、こちらから取り込めます。

ただし、GitHubの「Download ZIP」で取得したリポジトリ全体のZIPには、複数のスキンが含まれています。必要なスキンだけを追加するなら、この記事のように一度解凍して、対象のフォルダを選ぶ方法が分かりやすいと思います。

## うまくいかないとき

### スキンの一覧に出てこない

取り込んだフォルダの直下に `SkinConfig.ini` があるかを確認してください。`Graphics`だけを取り込んだり、設定ファイルだけを追加したりすると、スキン一式がそろいません。

取り込み先の種類が **「スキン」** になっていることも確認します。追加後は設定の「外観」→「スキン」を開き直してみてください。

### 文字が読みづらい・一部が表示されない

「外観」→「フォント」で、アプリに用意されているNoto Sans JPのフォントを選び直してみてください。配布元READMEにあるWindows向けのフォントインストールや`Config.ini`編集を、Android端末でそのまま行う必要はありません。

### キャラクターやプチキャラも変わった

スキンを切り替えると、そのスキンに合わせて表示の選択が変わる場合があります。表示したくないときは、「外観」の **「キャラクター」「プチキャラ」** で **「00 - None」** を選んでください。

### 読み込みや追加でエラーが出る

スキンの設定やバージョンによっては、TJA Pocketで表示・動作が一致しない場合もあります。可能な限り対応いたしますが、あらかじめご了承ください。
