---
title: "TJA Pocketにスキンを追加する方法｜ZIPの取り込みと切り替え"
description: "TJA Pocketにスキンを追加して切り替える手順を、Pixel 8aの実際の画面で紹介します。ZIPの取り込み、スキン管理、外観設定での選択、フォルダ構成の確認をまとめました。"
date: "2026-10-26"
tags: ["TJA Pocket", "使い方"]
draft: false
---

こんにちは、Drawkです。

今回は、TJA Pocketにスキンを追加する方法を紹介します。TJA Pocketでは、同梱の「Pocket Simple」に加えて、OpenTaiko互換のスキンを追加できます。スキンの置き方に合わせて、**ZIPの取り込み・フォルダの取り込み・参照フォルダの登録**の3通りから選べます。

この記事では、ZIPから取り込んで、設定で切り替えるところまでを紹介します。

> 画面はPixel 8a／Android 16、TJA Pocket 0.1.8（検証版）で撮影しました。ストアで配信中の版では、ボタンや画面構成が一部異なる場合があります。

この記事の画像では、説明用に用意したオリジナルのサンプルスキン「MegaDrawk Sample Skin」を使っています。第三者が制作したスキンの画像や名称は使用していません。

スキンは、配布元の利用条件を確認してから使用してください。

## 先に用意するもの

スキンのフォルダには、通常、次のようなファイルが入っています。

```text
MegaDrawk_Sample_Skin/
├─ SkinConfig.ini
├─ TjaPocketSkin.ini
├─ Graphics/
├─ Sounds/
├─ Fonts/
└─ Modules/
```

スキン本体の目印は **`SkinConfig.ini`** です。TJA Pocket用の情報が入った `TjaPocketSkin.ini` も一緒に用意します。フォルダの構成は次のとおりです。

[![MegaDrawk_Sample_Skinフォルダの中に、SkinConfig.ini、TjaPocketSkin.ini、Graphics、Soundsなどが入る構成図](/blog-assets/2026-10-26-tjapocket-skin-import/00-folder-layout.svg)](/blog-assets/2026-10-26-tjapocket-skin-import/00-folder-layout.svg)

手順を試してみたい方は、[記事用サンプルのZIP（約6 MB）](/blog-assets/2026-10-26-tjapocket-skin-import/MegaDrawk_Sample_Skin.zip)を使えます。アプリ同梱のPocket Simpleをもとに、名前と作成者だけを変えたオリジナルのサンプルです。

## 1. 設定から「ファイル管理」を開く

選曲画面の歯車ボタンで設定を開き、右上の **「ファイル管理」** を押します。

[![設定画面の右上に「ファイル管理」と「曲管理」が並んでいる](/blog-assets/2026-10-26-tjapocket-skin-import/01-settings.png)](/blog-assets/2026-10-26-tjapocket-skin-import/01-settings.png)

ファイル管理の画面では、曲やスキンなどの種類を切り替えて管理します。この画面では、曲のフォルダ・音源・譜面が表示されています。

[![ファイル管理のファイル一覧。曲のフォルダ、音源、譜面が表示されている](/blog-assets/2026-10-26-tjapocket-skin-import/01-file-manager.png)](/blog-assets/2026-10-26-tjapocket-skin-import/01-file-manager.png)

## 2. 種類を「スキン」に切り替える

左上の種類ボタンが「曲 ▾」になっている場合は、押して **「スキン」** を選びます。

[![管理する種類のメニュー。曲・スキン・キャラクター・プチキャラ・音色・フォントを選べる](/blog-assets/2026-10-26-tjapocket-skin-import/02-resource-type.png)](/blog-assets/2026-10-26-tjapocket-skin-import/02-resource-type.png)

切り替えると、スキン管理の画面になります。初回は、アプリ同梱の `pocket-simple` が表示されます。

[![スキン管理の画面。標準の保存先にpocket-simpleが表示されている](/blog-assets/2026-10-26-tjapocket-skin-import/03-skin-manager.png)](/blog-assets/2026-10-26-tjapocket-skin-import/03-skin-manager.png)

## 3. 「追加」から「ZIPを取り込む」を選ぶ

スキン管理の右上にある **「追加」** を押し、**「ZIPを取り込む」** を選びます。

[![スキン管理の追加メニュー。ZIPを取り込む・フォルダを取り込む・ファイルを追加・参照フォルダを登録が表示されている](/blog-assets/2026-10-26-tjapocket-skin-import/04-add-menu.png)](/blog-assets/2026-10-26-tjapocket-skin-import/04-add-menu.png)

## 4. 保存したZIPを選ぶ

Androidのファイル選択画面が開いたら、ZIPを保存した場所に移動して選びます。ここでは `MegaDrawk_Sample_Skin.zip` を選びます。

[![Androidのファイル選択画面で、MegaDrawk_Import_Demo.zipとMegaDrawk_Sample_Skin.zipが表示されている](/blog-assets/2026-10-26-tjapocket-skin-import/05-file-picker.png)](/blog-assets/2026-10-26-tjapocket-skin-import/05-file-picker.png)

曲のZIPと同じフォルダに置いている場合は、ファイル名で選び分けてください。

## 5. 取り込み内容を確認して追加する

ZIPの読み込みが終わると、取り込み対象の一覧が表示されます。ここでは `MegaDrawk_Sample_Skin` の1項目です。内容を確認して **「追加」** を押します。

[![取り込み内容に「1 項目」「MegaDrawk_Sample_Skin」と表示され、「追加」ボタンがある](/blog-assets/2026-10-26-tjapocket-skin-import/06-import-preview.png)](/blog-assets/2026-10-26-tjapocket-skin-import/06-import-preview.png)

## 6. 追加されたことを確認する

**「1 項目を追加しました」** と表示されたら、**「閉じる」** を押します。

[![スキンの取り込み結果。「1 項目を追加しました」と表示され、閉じるボタンがある](/blog-assets/2026-10-26-tjapocket-skin-import/07-import-result.png)](/blog-assets/2026-10-26-tjapocket-skin-import/07-import-result.png)

スキン管理の一覧に、追加した `MegaDrawk_Sample_Skin` が表示されます。アプリ同梱の `pocket-simple` も残っています。

[![スキン管理の一覧に、MegaDrawk_Sample_Skinとpocket-simpleが表示されている](/blog-assets/2026-10-26-tjapocket-skin-import/08-skin-list.png)](/blog-assets/2026-10-26-tjapocket-skin-import/08-skin-list.png)

## 7. 設定で使うスキンを選ぶ

**追加しただけでは、使うスキンは切り替わりません。** 設定へ戻り、**「外観」→「スキン」**を開いて、使いたいスキンを選びます。

[![外観設定のスキン選択。Pocket SimpleとMegaDrawk Sample Skinが表示され、MegaDrawk Sample Skinを選べる](/blog-assets/2026-10-26-tjapocket-skin-import/09-skin-select.png)](/blog-assets/2026-10-26-tjapocket-skin-import/09-skin-select.png)

選択すると、外観設定の「スキン」と「フォント」に、選んだスキンの名前が表示されます。

[![外観設定でスキンにMegaDrawk Sample Skin、フォントにMegaDrawk Sample Skin / NotoSansJP-Mediumが表示されている](/blog-assets/2026-10-26-tjapocket-skin-import/10-selected-skin.png)](/blog-assets/2026-10-26-tjapocket-skin-import/10-selected-skin.png)

「戻る」で選曲画面へ戻り、表示を確認してください。ほかのスキンに戻す場合も、同じ設定から選び直せます。

## ZIP・フォルダ・参照フォルダの違い

| 方法               | 動作                                               | 使い分け                                  |
| ------------------ | -------------------------------------------------- | ----------------------------------------- |
| ZIPを取り込む      | ZIPの中のスキンを、選択した保存先へコピーする。    | 配布されているZIPをそのまま使いたいとき。 |
| フォルダを取り込む | 解凍済みのフォルダを、選択した保存先へコピーする。 | 中身を確認してから追加したいとき。        |
| 参照フォルダを登録 | 元のフォルダを参照元として登録する。コピーしない。 | 元の場所のスキンをそのまま使いたいとき。  |

標準の保存先は通常、次のフォルダです。

```text
/storage/emulated/0/Android/data/com.drawk.tjapocket/files/System
```

参照フォルダを登録した場合、元のフォルダを移動したり、アクセス権を取り消したりすると、読み込めなくなることがあります。登録を解除しても、元のフォルダやファイルは残ります。

## うまくいかないとき

### スキンが一覧に出ない

ファイル管理の種類が **「スキン」** になっているか確認してください。曲の一覧を見ていると、スキンは表示されません。ZIPの中に `SkinConfig.ini` があるかも確認します。

### 取り込み内容にスキンが出ない

ZIPやフォルダの中に、スキンのフォルダが深く入れ子になっていないか確認してください。`SkinConfig.ini` のあるフォルダが取り込み対象です。

### 文字が読みづらい・一部が表示されない

**「外観」→「フォント」** で、アプリに用意されているNoto Sans JPを選び直してみてください。スキン側のフォントが端末にない場合でも、アプリのフォントに切り替えられます。

### キャラクターやプチキャラも変わった

スキンを切り替えると、そのスキンに合わせて表示の選択が変わる場合があります。表示したくないときは、「外観」の **「キャラクター」「プチキャラ」** で再度選択してください。

### フォルダを選択できない

Androidの制限により、`Download` フォルダ全体などを指定できない場合があります。その中にスキン用のフォルダを作り、作成したフォルダを指定してください。

スキンの表示や動作は、スキンごとの作りによって異なります。すべてのスキンで同じ表示になるとは限らないため、配布元の説明もあわせて確認してください。

[app:com.drawk.tjapocket]
