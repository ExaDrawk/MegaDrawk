'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Image, Copy, Download, Zap, Move } from 'lucide-react';

export default function ImagePlaceholderPage() {
    const [w, setW] = useState(800);
    const [h, setH] = useState(600);
    const [text, setText] = useState('800x600');
    const [theme, setTheme] = useState<'DARK' | 'LIGHT'>('DARK');

    const bgColor = theme === 'DARK' ? '020617' : 'f1f5f9';
    const textColor = theme === 'DARK' ? '94a3b8' : '475569';
    const url = `https://placehold.co/${w}x${h}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>必要な画像の<strong>幅</strong>と<strong>高さ</strong>を指定してください。</li>
            <li>中央に表示するカスタムテキストを入力できます。</li>
            <li>「ダーク」または「ライト」の配色テーマを選択します。</li>
            <li>生成されたURLをHTMLの &lt;img&gt; タグの <code>src</code> 属性に使用してください。</li>
        </ul>
    );

    const faq = [
        { q: "このツールで生成された画像はどこに保存されますか？", a: "このツールは placehold.co のAPIを使用して画像を動的に生成します。URLを自身のプロジェクトに貼り付けるだけで機能します。" },
        { q: "商用利用は可能ですか？", a: "はい。Webサイトの製作中やモックアップ作成のプレースホルダーとして自由にご使用いただけます。" },
    ];

    return (
        <ToolShell
            title="画像プレースホルダー生成"
            description="デザインやレイアウト確認用のダミー画像を、指定したサイズとテーマで即座に生成します。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="max-w-5xl mx-auto space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Controls */}
                    <div className="space-y-10 bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 shadow-inner">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Width (px)</label>
                                <input type="number" value={w} onChange={e => setW(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-2xl font-black text-slate-900 focus:border-blue-500 focus:outline-none shadow-sm" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Height (px)</label>
                                <input type="number" value={h} onChange={e => setH(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-2xl font-black text-slate-900 focus:border-blue-500 focus:outline-none shadow-sm" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Label Text</label>
                            <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-xl font-medium text-blue-600 focus:border-blue-500 focus:outline-none shadow-sm" placeholder="プレースホルダーの文字..." />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Theme Selection</label>
                            <div className="flex gap-2 bg-slate-200/50 p-2 rounded-2xl border border-slate-200">
                                <button onClick={() => setTheme('DARK')} className={`flex-1 py-4 rounded-xl text-xs font-black uppercase transition-all ${theme === 'DARK' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>Dark Mode</button>
                                <button onClick={() => setTheme('LIGHT')} className={`flex-1 py-4 rounded-xl text-xs font-black uppercase transition-all ${theme === 'LIGHT' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>Light Mode</button>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="flex flex-col gap-8 items-center justify-center">
                        <div className="relative group max-w-full overflow-hidden">
                            <div className="absolute -inset-4 bg-blue-500/10 rounded-[2.5rem] blur-2xl opacity-50" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="Placeholder Preview" className="relative rounded-[2rem] border-8 border-white shadow-2xl max-w-full h-auto object-contain" />
                        </div>

                        <div className="w-full max-w-md space-y-4">
                            <div className="flex justify-between items-center ml-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Image URL</label>
                                <button onClick={() => navigator.clipboard.writeText(url)} className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors">COPY URL</button>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl font-mono text-[10px] text-slate-400 break-all select-all shadow-inner">
                                {url}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
