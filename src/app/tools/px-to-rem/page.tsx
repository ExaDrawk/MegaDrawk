'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ArrowRightLeft, Settings2, LayoutGrid, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PxToRemPage() {
    const [baseSize, setBaseSize] = useState(16);
    const [px, setPx] = useState<string>('16');
    const [rem, setRem] = useState<string>('1');

    const updateFromPx = (val: string) => {
        setPx(val);
        if (isNaN(Number(val)) || val === '') {
            setRem('');
            return;
        }
        setRem((Number(val) / baseSize).toFixed(3).replace(/\.?0+$/, ''));
    };

    const updateFromRem = (val: string) => {
        setRem(val);
        if (isNaN(Number(val)) || val === '') {
            setPx('');
            return;
        }
        setPx((Number(val) * baseSize).toFixed(0));
    };

    useEffect(() => {
        updateFromPx(px);
    }, [baseSize]);

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li><strong>Base Font Size</strong> (通常は16px) を設定します。これはWebブラウザのデフォルト設定に準じます。</li>
            <li>「Pixel (px)」欄に数値を入力すると、即座に「REM」に変換されます。</li>
            <li>逆に「REM」欄に入力して、必要なピクセル値を算出することも可能です。</li>
        </ul>
    );

    const faq = [
        { q: "なぜREMを使うべきなのですか？", a: "REMはルート要素（html）のフォントサイズに対する相対単位です。ユーザーがブラウザのフォントサイズを変更した際に、レイアウト全体が追従するため、アクセシビリティの観点から推奨されます。" },
        { q: "Base Sizeを変更する必要はありますか？", a: "一般的なモダンブラウザのデフォルトは16pxですが、特定のプロジェクトデザイン規定がある場合は、その基本サイズに合わせて調整してください。" },
    ];

    return (
        <ToolShell
            title="PX to REM変換"
            description="ピクセル単位（px）と相対単位（rem）を、基準サイズに基づいて瞬時に変換します。レスポンシブ設計の必須ツール。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="max-w-4xl mx-auto space-y-16">
                {/* Base Size Control */}
                <div className="bg-slate-50 border border-slate-100 p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                            <Settings2 size={24} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1">Base Configuration</div>
                            <div className="text-xl font-black text-slate-900 italic">Base Font Size (px)</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-200/50 p-2 rounded-2xl border border-slate-200">
                        {[12, 14, 16, 18, 20].map(size => (
                            <button
                                key={size}
                                onClick={() => setBaseSize(size)}
                                className={`w-12 h-12 rounded-xl text-sm font-black transition-all ${baseSize === size ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {size}
                            </button>
                        ))}
                        <input
                            type="number"
                            value={baseSize}
                            onChange={(e) => setBaseSize(Number(e.target.value))}
                            className="w-16 h-12 bg-transparent text-center font-black text-blue-600 focus:outline-none border-l border-slate-200"
                        />
                    </div>
                </div>

                {/* Main Converter */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-8">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-6">Pixel (px)</label>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-blue-500/10 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <input
                                type="number"
                                value={px}
                                onChange={(e) => updateFromPx(e.target.value)}
                                className="relative w-full bg-white border border-slate-200 rounded-[2rem] p-10 text-5xl font-black text-slate-900 text-center focus:outline-none focus:border-blue-500 shadow-sm transition-all"
                            />
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200 font-black italic text-2xl">PX</div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                            <ArrowRightLeft size={32} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-6">Relative (rem)</label>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-emerald-500/10 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <input
                                type="number"
                                value={rem}
                                onChange={(e) => updateFromRem(e.target.value)}
                                className="relative w-full bg-white border border-slate-200 rounded-[2rem] p-10 text-5xl font-black text-emerald-600 text-center focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
                            />
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-200 font-black italic text-2xl">REM</div>
                        </div>
                    </div>
                </div>

                {/* Quick Reference Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 pt-12">
                    {[4, 8, 12, 16, 20, 24, 32, 64].map(v => (
                        <button
                            key={v}
                            onClick={() => updateFromPx(v.toString())}
                            className="bg-slate-50 border border-slate-100 p-6 rounded-3xl hover:border-blue-500/30 transition-all text-center group shadow-sm hover:shadow-lg"
                        >
                            <div className="text-[10px] font-black text-slate-400 mb-1 group-hover:text-blue-600">{v}px</div>
                            <div className="text-sm font-black text-slate-900">{(v / baseSize).toFixed(3).replace(/\.?0+$/, '')}rem</div>
                        </button>
                    ))}
                </div>
            </div>
        </ToolShell>
    );
}
