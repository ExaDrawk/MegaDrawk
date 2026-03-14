## tasks/lessons.md

### 2026-03-14: セキュリティヘッダー実装整合

- ミスの内容: CSP nonce を発行していたが、レイアウト側スクリプトに nonce 伝播がなく方針が不整合だった。
- 違反した原則: DRY, Fail Fast, PoLA
- 根本原因: middleware と app/layout の責務連携がテストで検証されていなかった。
- 再発防止ルール: ヘッダーで nonce を使う場合は script 側にも同時に実装し、レイアウト変更時に build と E2E で CSP を確認する。
