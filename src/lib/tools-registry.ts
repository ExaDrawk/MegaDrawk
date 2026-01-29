import { FileJson, Hash, Code, Palette, Type, Shield, Clock, Calculator, Globe, Image, Database, Link, Key, Box, LayoutGrid, FileCode, Split, Fingerprint, Search, FileText, Minimize2, Maximize, Smartphone, Layers, Percent, Binary } from 'lucide-react';

export type ToolCategory = '開発' | 'デザイン' | 'テキスト' | 'セキュリティ' | '生産性';

export interface ToolMeta {
    slug: string;
    title: string;
    description: string;
    category: ToolCategory;
    icon: any;
    path: string;
}

export const TOOLS_REGISTRY: ToolMeta[] = [
    // 開発
    { slug: 'json-validator', title: 'JSON検証・成形', description: 'JSONデータの検証、フォーマット、エラー修正を高度なハイライト付きで行います。', category: '開発', icon: FileJson, path: '/tools/json-validator' },
    { slug: 'base64-encoder', title: 'Base64エンコーダー', description: 'テキストやファイルをBase64形式に、またはその逆へ瞬時に変換します。', category: '開発', icon: Code, path: '/tools/base64-encoder' },
    { slug: 'sql-formatter', title: 'SQLフォーマッタ', description: 'SQLクエリを綺麗に整えます。', category: '開発', icon: Database, path: '/tools/sql-formatter' },
    { slug: 'yaml-to-json', title: 'YAML ↔ JSON 変換', description: 'YAML形式とJSON形式の設定ファイルを、相互に瞬時に変換します。', category: '開発', icon: FileCode, path: '/tools/yaml-to-json' },
    { slug: 'diff-checker', title: '差分チェック', description: '2つのテキスト間の変更箇所を検出しハイライト表示します。', category: '開発', icon: Split, path: '/tools/diff-checker' },
    { slug: 'uuid-generator', title: 'UUID生成', description: '汎用一意識別子（UUID）をバッチで一括生成します。', category: '開発', icon: Fingerprint, path: '/tools/uuid-generator' },
    { slug: 'js-minifier', title: 'JSミニファイアー', description: 'JavaScriptファイルを軽量化し、パフォーマンスを最適化します。', category: '開発', icon: Minimize2, path: '/tools/js-minifier' },
    { slug: 'user-agent-parser', title: 'User-Agent解析', description: 'ブラウザの識別情報を解析し、OSやブラウザを特定します。', category: '開発', icon: Smartphone, path: '/tools/user-agent-parser' },

    // セキュリティ
    { slug: 'password-generator', title: 'セキュアパスワード生成', description: 'カスタム文字セットを使用した、解読不可能な高エントロピーパスワードを生成します。', category: 'セキュリティ', icon: Key, path: '/tools/password-generator' },
    { slug: 'hash-generator', title: 'ハッシュ計算', description: '任意のテキストに対して主要なハッシュ値を計算します。', category: 'セキュリティ', icon: Shield, path: '/tools/hash-generator' },

    // デザイン
    { slug: 'contrast-checker', title: 'コントラスト比チェック', description: 'WCAGアクセシビリティ基準に基づき、色の組み合わせを検証します。', category: 'デザイン', icon: Palette, path: '/tools/contrast-checker' },
    { slug: 'px-to-rem', title: 'PX to REM変換', description: 'CSS単位変換（px ↔ rem）を基準サイズに基づき行います。', category: 'デザイン', icon: LayoutGrid, path: '/tools/px-to-rem' },
    { slug: 'color-palette-generator', title: 'カラーパレット生成', description: '調和の取れた配色セットをランダムに生成します。', category: 'デザイン', icon: Palette, path: '/tools/color-palette-generator' },
    { slug: 'css-gradient-generator', title: 'CSSグラデーション生成', description: '視覚的に美しいCSSグラデーションを作成します。', category: 'デザイン', icon: Layers, path: '/tools/css-gradient-generator' },
    { slug: 'aspect-ratio-calculator', title: 'アスペクト比計算', description: '画像や動画の縦横比を維持したリサイズ計算。', category: 'デザイン', icon: Maximize, path: '/tools/aspect-ratio-calculator' },

    // テキスト
    { slug: 'word-counter', title: '文字・単語カウント', description: 'テキストの密度や読了時間分析。', category: 'テキスト', icon: Type, path: '/tools/word-counter' },
    { slug: 'lorem-ipsum', title: 'ダミーテキスト生成', description: 'プレースホルダー用のダミーテキストを生成。', category: 'テキスト', icon: Type, path: '/tools/lorem-ipsum' },
    { slug: 'markdown-preview', title: 'Markdownプレビュー', description: 'Markdownを美しくリアルタイムにレンダリング。', category: 'テキスト', icon: FileText, path: '/tools/markdown-preview' },
    { slug: 'case-converter', title: 'ケース変換', description: '大文字、小文字、キャメルケース等への変換。', category: 'テキスト', icon: Type, path: '/tools/case-converter' },
    { slug: 'binary-converter', title: 'バイナリ変換', description: 'テキストと2進数表現の相互変換。', category: 'テキスト', icon: Binary, path: '/tools/binary-converter' },

    // 生産性
    { slug: 'pomodoro-timer', title: 'ポモドーロタイマー', description: '生産性を向上させる作業サイクル管理ツール。', category: '生産性', icon: Clock, path: '/tools/pomodoro-timer' },
    { slug: 'qr-generator', title: 'QRコード生成', description: 'URLや設定情報のカスタムQRコード作成。', category: '生産性', icon: Box, path: '/tools/qr-generator' },
    { slug: 'timestamp-converter', title: 'タイムスタンプ変換', description: 'Unixタイムスタンプと日時の相互変換。', category: '生産性', icon: Clock, path: '/tools/timestamp-converter' },
    { slug: 'url-encoder', title: 'URLエンコーダー', description: 'URL用の安全なエンコード・デコード。', category: '生産性', icon: Globe, path: '/tools/url-encoder' },
    { slug: 'percentage-calculator', title: 'パーセント計算', description: '割合、比率、変化率を素早く計算。', category: '生産性', icon: Percent, path: '/tools/percentage-calculator' },
    { slug: 'image-placeholder-generator', title: '画像プレースホルダー生成', description: 'ダミー画像をサイズ指定で生成します。', category: '生産性', icon: Image, path: '/tools/image-placeholder-generator' },
];

export const ALL_TOOLS = TOOLS_REGISTRY.sort((a, b) => a.title.localeCompare(b.title));

export const TOOLS_BY_CATEGORY = TOOLS_REGISTRY.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
}, {} as Record<ToolCategory, ToolMeta[]>);
