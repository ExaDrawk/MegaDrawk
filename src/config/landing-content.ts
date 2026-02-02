
import { Zap, Shield, Layout, Target } from 'lucide-react';
import { SERVICES } from './site';

export const HERO_CONTENT = {
    badge: "次世代知能インフラストラクチャ",
    headline: {
        line1: "未来を、",
        line2: "精緻化",
        line2Suffix: "せよ。"
    },
    description: "MegaDrawk Industries は、法務、経営、そして最先端技術を融合させ、不確実な世界を論理の力で再構築します。",
    cta: {
        primary: "ツールキットを開く",
        secondary: "技術ドキュメント"
    }
};

export const CORE_VALUES = [
    {
        icon: Target,
        title: "Precision Engineering",
        description: "ミリ秒単位の精度でデータを解析し、意思決定のノイズを排除します。",
        color: "blue"
    },
    {
        icon: Shield,
        title: "Mission Critical",
        description: "金融機関レベルの暗号化とアクセスコントロールにより、企業の最重要資産である「知」を守り抜きます。", // Aligned with site.ts
        color: "sky"
    },
    {
        icon: Layout,
        title: "Human Centric UX",
        description: "複雑なロジックを直感的な体験へ。人間知能を拡張するデザイン。",
        color: "cyan"
    }
];

export const LAB_ITEMS = SERVICES.filter(s => s.isGame).map(s => ({
    ...s,
    tag: "Simulation"
}));
