'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hslToHex, generateRandomPalette } from '@/lib/colors';

export default function ColorPalettePage() {
    const [palette, setPalette] = useState<string[]>(generateRandomPalette());

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
                        onClick={() => setPalette(generateRandomPalette())}
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
