'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Palette, Copy, RefreshCw, Layers, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CssGradientPage() {
    const [color1, setColor1] = useState('#3b82f6');
    const [color2, setColor2] = useState('#0ea5e9');
    const [angle, setAngle] = useState(135);

    const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>2つのカラーピッカーからグラデーションに使用する色を選択してください。</li>
            <li>「Angle」スライダーを調整して、グラデーションの角度（0度〜360度）を変更します。</li>
            <li>中央のプレビュー画面にリアルタイムで結果が表示されます。</li>
            <li>「コードをコピー」ボタンで、CSSの `background` プロパティ用の値を取得できます。</li>
        </ul>
    );

    const faq = [
        { q: "どのようなブラウザで使用できますま？", a: "生成されるのは標準的な `linear-gradient` 構文であり、現在使用されているすべてのモダンブラウザで正しく表示されます。" },
        { q: "3色以上のグラデーションも可能ですか？", a: "本ツールはシンプルさを重視し、現在は2色の変換に最適化されています。" },
    ];

    return (
        <ToolShell
            title="CSSグラデーション生成"
            description="2色の組み合わせから、美しい線形グラデーション（CSS）を視覚的に作成します。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="max-w-4xl mx-auto space-y-16">
                {/* Preview Container */}
                <div className="relative group">
                    <div className="absolute -inset-10 bg-white/5 rounded-[4rem] blur-2xl opacity-50" />
                    <div
                        className="relative h-80 rounded-[3rem] shadow-2xl flex items-center justify-center overflow-hidden border-8 border-slate-950"
                        style={{ background: gradient }}
                    >
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl">
                            Preview Active
                        </div>
                    </div>
                </div>

                {/* Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-900/40 p-12 rounded-[3.5rem] border border-white/5">
                    <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Color 1</label>
                                <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-full h-20 rounded-2xl bg-slate-950 border border-white/10 p-2 cursor-pointer" />
                                <div className="text-center font-mono text-sm text-slate-500 uppercase">{color1}</div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">Color 2</label>
                                <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-full h-20 rounded-2xl bg-slate-950 border border-white/10 p-2 cursor-pointer" />
                                <div className="text-center font-mono text-sm text-slate-500 uppercase">{color2}</div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-6 ml-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">角度 (Angle)</span>
                                <span className="text-2xl font-black text-white italic">{angle}°</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="360"
                                value={angle}
                                onChange={(e) => setAngle(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-6 flex flex-col justify-end">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-4">CSS Code Output</label>
                        <div className="relative group">
                            <textarea
                                readOnly
                                value={`background: ${gradient};`}
                                className="w-full h-40 bg-slate-950 border border-white/10 rounded-[2rem] p-8 font-mono text-sm text-blue-400 focus:outline-none resize-none shadow-inner"
                            />
                            <button
                                onClick={() => navigator.clipboard.writeText(`background: ${gradient};`)}
                                className="absolute bottom-4 right-4 p-3 bg-white text-black rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-xl"
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 flex items-center gap-2">
                        <Layers size={14} className="animate-pulse" />
                        Rendering Hub Ready
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
