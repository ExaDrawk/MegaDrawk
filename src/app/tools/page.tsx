'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { ALL_TOOLS, ToolCategory, ToolMeta } from '@/lib/tools-registry';

export default function ToolsIndexPage() {
    const [search, setSearch] = useState('');
    const [selectedCat, setSelectedCat] = useState<ToolCategory | 'すべて'>('すべて');

    const filteredTools = ALL_TOOLS.filter((t: ToolMeta) => {
        const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
        const matchCat = selectedCat === 'すべて' || t.category === selectedCat;
        return matchSearch && matchCat;
    });

    const categories: (ToolCategory | 'すべて')[] = ['すべて', '開発', 'デザイン', 'テキスト', 'セキュリティ', '生産性'];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-20">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em]">
                        MegaDrawk Utility Suite
                    </motion.div>
                    <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6">
                        Professional <br /><span className="text-slate-400 italic">Tools</span>
                    </motion.h1>
                    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
                        開発、デザイン、生産性を向上させる {ALL_TOOLS.length} 以上の厳選されたユーティリティ。無料、安全、そしてブラウザ上で完結。
                    </motion.p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 sticky top-20 z-40 bg-white/80 backdrop-blur-2xl p-4 rounded-3xl border border-slate-200 shadow-xl">
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCat(cat)}
                                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCat === cat ? 'bg-blue-600 text-white shadow-xl translate-y-[-2px]' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="ツールを検索..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-slate-900 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-400 font-bold"
                        />
                    </div>
                </div>

                {/* Grid */}
                {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTools.map((tool: ToolMeta, i: number) => (
                            <Link key={tool.slug} href={tool.path}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="group h-full bg-white border border-slate-200 rounded-[2.5rem] p-10 transition-all hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-32 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-all -mr-16 -mt-16 pointer-events-none" />

                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-8 group-hover:scale-110 group-hover:border-blue-500 group-hover:text-blue-600 transition-all shadow-sm">
                                            <tool.icon size={28} />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{tool.title}</h3>
                                        <p className="text-slate-500 leading-relaxed text-sm font-medium">{tool.description}</p>

                                        <div className="mt-10 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors">
                                            ツールを開く
                                            <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32">
                        <p className="text-xl font-bold text-slate-600">"{search}" に一致するツールは見つかりませんでした。</p>
                        <button onClick={() => { setSearch(''); setSelectedCat('すべて'); }} className="mt-4 text-blue-400 font-black text-xs uppercase tracking-widest hover:underline">フィルターをクリア</button>
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
}
