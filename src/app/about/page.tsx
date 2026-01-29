'use client';

import React from 'react';
import { Target, Zap, Cpu, Globe } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900 pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto space-y-24">
                <header className="text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
                        <Target size={14} />
                        Our Mission
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter leading-none text-slate-900">秩序と論理の<br />新基準</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">MegaDrawk Industries は、複雑なデジタル空間に「静かな秩序」をもたらすためのツールセットを開発しています。</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: '精緻な設計', desc: '1ピクセル、1ミリ秒にこだわり、開発者の思考を妨げない究極の道具を目指します。', icon: Cpu, color: 'text-blue-600', iconBg: 'bg-blue-50' },
                        { title: '圧倒的な速度', desc: 'すべてのツールは瞬時に反応し、あなたのワークフローから「待ち時間」を排除します。', icon: Zap, color: 'text-amber-500', iconBg: 'bg-amber-50' },
                        { title: 'グローバル基準', desc: '日本の美学と、世界標準のエンジニアリング品質を融合させた体験。', icon: Globe, color: 'text-emerald-500', iconBg: 'bg-emerald-50' },
                    ].map((item, i) => (
                        <div key={i} className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 hover:border-blue-500/50 hover:bg-white transition-all flex flex-col gap-6 shadow-sm hover:shadow-xl group">
                            <div className={`w-16 h-16 ${item.iconBg} rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                                <item.icon size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">{item.title}</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-900 p-12 md:p-24 rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
                    <div className="space-y-6 flex-1 relative z-10">
                        <h2 className="text-5xl font-black text-white italic tracking-tighter">Beyond Innovation</h2>
                        <p className="text-blue-100 text-lg leading-relaxed font-medium">
                            我々の旅は、単なるツールの提供に留まりません。デジタル世界の構造を理解し、それを再構築するための新しいアプローチを提案し続けます。MegaDrawkは、エンジニアとデザイナーのための聖域です。
                        </p>
                    </div>
                    <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse relative z-10">
                        <div className="w-40 h-40 bg-white/20 rounded-full" />
                    </div>
                </div>
            </div>
        </main>
    );
}
