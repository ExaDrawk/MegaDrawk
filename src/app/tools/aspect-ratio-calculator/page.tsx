'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Maximize, Layout, Copy, Zap } from 'lucide-react';

export default function AspectRatioPage() {
    const [w1, setW1] = useState(1920);
    const [h1, setH1] = useState(1080);
    const [w2, setW2] = useState(1080);
    const [h2, setH2] = useState(607.5);

    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);

    const updateFromW = (val: number) => {
        setW2(val);
        setH2((val * h1) / w1);
    };

    const updateFromH = (val: number) => {
        setH2(val);
        setW2((val * w1) / h1);
    };

    const commonRatios = [
        { name: '16:9', w: 16, h: 9 },
        { name: '4:3', w: 4, h: 3 },
        { name: '1:1', w: 1, h: 1 },
        { name: '21:9', w: 21, h: 9 },
        { name: '9:16', w: 9, h: 16 },
    ];

    const ratioGcd = gcd(w1, h1);
    const ratioStr = `${w1 / ratioGcd}:${h1 / ratioGcd}`;

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>基準となるサイズ（Original）を入力すると、そのアスペクト比を自動計算します。</li>
            <li>リサイズ後の幅（Target Width）または高さ（Target Height）を入力すると、比率を維持したもう一方の数値を算出します。</li>
            <li>「16:9」などのプリセットをクリックして、主要な比率を瞬時にセットできます。</li>
        </ul>
    );

    const faq = [
        { q: "なぜアスペクト比が重要なのですか？", a: "画像や動画をリサイズする際、アスペクト比を維持しないと不自然に引き伸ばされたり、歪んだりしてしまいます。Webデザインや映像制作において必須の計算です。" },
        { q: "どのような比率が一般的ですか？", a: "YouTubeやテレビは16:9、古いディスプレイや写真は4:3、Instagramの投稿は1:1や4:5がよく使われます。" },
    ];

    return (
        <ToolShell
            title="アスペクト比計算"
            description="画像や動画の縦横比を維持したまま、リサイズ後の数値を計算します。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="max-w-4xl mx-auto space-y-16">
                {/* Ratio Display */}
                <div className="flex justify-center flex-wrap gap-4">
                    {commonRatios.map((r) => (
                        <button
                            key={r.name}
                            onClick={() => { setW1(r.w); setH1(r.h); }}
                            className={`px-8 py-3 rounded-2xl text-[10px] uppercase font-black tracking-widest transition-all border ${w1 / gcd(w1, h1) === r.w && h1 / gcd(w1, h1) === r.h ? 'bg-blue-600 text-white border-blue-600 shadow-xl scale-105' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300'}`}
                        >
                            {r.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
                    {/* Source */}
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:bg-blue-100 transition-colors" />
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-10 flex justify-between items-center relative z-10">
                            <span>Original Dimensions</span>
                            <span className="text-blue-600">RATIO: {ratioStr}</span>
                        </div>
                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center gap-6">
                                <span className="w-12 text-slate-200 font-black italic text-2xl">W</span>
                                <input type="number" value={w1} onChange={e => setW1(Number(e.target.value))} className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-3xl font-black text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all shadow-inner" />
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="w-12 text-slate-200 font-black italic text-2xl">H</span>
                                <input type="number" value={h1} onChange={e => setH1(Number(e.target.value))} className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-3xl font-black text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none transition-all shadow-inner" />
                            </div>
                        </div>
                    </div>

                    {/* Target */}
                    <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 border-dashed">
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-10">Target Dimensions</div>
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <span className="w-12 text-slate-200 font-black italic text-2xl">W</span>
                                <input type="number" value={w2} onChange={e => updateFromW(Number(e.target.value))} className="flex-1 bg-white border border-slate-100 rounded-2xl p-6 text-3xl font-black text-blue-600 focus:border-blue-500 focus:outline-none shadow-sm transition-all" />
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="w-12 text-slate-200 font-black italic text-2xl">H</span>
                                <input type="number" value={h2} onChange={e => updateFromH(Number(e.target.value))} className="flex-1 bg-white border border-slate-100 rounded-2xl p-6 text-3xl font-black text-blue-600 focus:border-blue-500 focus:outline-none shadow-sm transition-all" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Visualizer */}
                <div className="flex flex-col items-center gap-8 pt-8">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Perspective Preview</div>
                    <div
                        className="bg-blue-50 border-2 border-blue-100 rounded-xl flex items-center justify-center relative overflow-hidden transition-all duration-500 shadow-inner"
                        style={{
                            width: '240px',
                            height: `${(240 * h1) / w1}px`,
                            maxWidth: '100%',
                            maxHeight: '300px'
                        }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 text-blue-200">
                            <Maximize size={32} />
                        </div>
                        <div className="absolute bottom-3 right-4 font-mono text-[8px] font-bold text-blue-300 uppercase tracking-widest">{ratioStr}</div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
