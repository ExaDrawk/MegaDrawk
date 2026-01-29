'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Palette, Copy, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ColorPalettePage() {
    const generateColor = () => {
        const h = Math.floor(Math.random() * 360);
        const s = Math.floor(Math.random() * 40) + 60; // 60-100%
        const l = Math.floor(Math.random() * 40) + 30; // 30-70%
        return `hsl(${h}, ${s}%, ${l}%)`;
    };

    const generatePalette = () => {
        const baseH = Math.floor(Math.random() * 360);
        return [
            `hsl(${baseH}, 70%, 50%)`,
            `hsl(${(baseH + 30) % 360}, 65%, 45%)`,
            `hsl(${(baseH + 60) % 360}, 60%, 40%)`,
            `hsl(${(baseH + 180) % 360}, 70%, 50%)`,
            `hsl(${(baseH + 210) % 360}, 65%, 45%)`,
        ];
    };

    const [palette, setPalette] = useState<string[]>(generatePalette());

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>「パレットを更新」ボタンをクリックすると、調和のとれた5色のカラーセットをランダムに生成します。</li>
            <li>各カラーパネルをクリックすることで、HEXコードをクリップボードにコピーできます。</li>
            <li>ベースとなる色相（Hue）から、類似色や補色を自動的に計算してパレットを構築します。</li>
        </ul>
    );

    const faq = [
        { q: "生成される色の形式は何ですか？", a: "現在はWeb制作に最も適したRGB（HEX形式）でコピーされます。パレット自体はHSLカラースペースで計算されており、美しい階調を実現しています。" },
        { q: "ブランドカラーの作成に使えますか？", a: "はい。メインカラーとアクセントカラーの組み合わせを検討する際のインスピレーションツールとして最適です。" },
    ];

    const hslToHex = (hslStr: string) => {
        // Simple conversion if needed, but for now let's just use CSS for display
        // and a helper for hex copy
        const [h, s, l] = hslStr.match(/\d+/g)!.map(Number);
        const hVal = h / 360;
        const sVal = s / 100;
        const lVal = l / 100;
        let r, g, b;
        if (sVal === 0) {
            r = g = b = lVal;
        } else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = lVal < 0.5 ? lVal * (1 + sVal) : lVal + sVal - lVal * sVal;
            const p = 2 * lVal - q;
            r = hue2rgb(p, q, hVal + 1 / 3);
            g = hue2rgb(p, q, hVal);
            b = hue2rgb(p, q, hVal - 1 / 3);
        }
        const toHex = (x: number) => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    };

    return (
        <ToolShell
            title="カラーパレット生成"
            description="調和の取れた美しい配色セットを瞬時に生成します。デザインのインスピレーションに。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-16">
                <div className="flex flex-col md:flex-row h-[500px] rounded-[3.5rem] overflow-hidden border-4 border-white shadow-2xl relative">
                    <div className="absolute inset-0 border-[12px] border-slate-50 pointer-events-none rounded-[3.5rem] z-20" />
                    <AnimatePresence mode="wait">
                        {palette.map((color, i) => {
                            const hex = hslToHex(color);
                            return (
                                <motion.div
                                    key={`${color}-${i}`}
                                    initial={{ flex: 0, opacity: 0 }}
                                    animate={{ flex: 1, opacity: 1 }}
                                    exit={{ flex: 0, opacity: 0 }}
                                    onClick={() => navigator.clipboard.writeText(hex)}
                                    className="relative group cursor-pointer flex flex-col items-center justify-end pb-12 transition-all hover:flex-[1.5]"
                                    style={{ backgroundColor: color }}
                                >
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                                    <div className="bg-white/90 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white text-slate-900 font-black text-[10px] tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 shadow-xl">
                                        COPY HEX
                                    </div>
                                    <div className="mt-4 text-white font-black text-2xl tracking-tighter drop-shadow-2xl">
                                        {hex}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={() => setPalette(generatePalette())}
                        className="group relative flex items-center gap-4 px-16 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
                        パレットを更新
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}
