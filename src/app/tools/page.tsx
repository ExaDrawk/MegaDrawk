'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { ALL_TOOLS, TOOLS_BY_CATEGORY, ToolCategory, ToolMeta } from '@/lib/tools-registry';

export default function ToolsIndexPage() {
    const [search, setSearch] = useState('');
    const [selectedCat, setSelectedCat] = useState<ToolCategory | 'All'>('All');

    const filteredTools = ALL_TOOLS.filter((t: ToolMeta) => {
        const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
        const matchCat = selectedCat === 'All' || t.category === selectedCat;
        return matchSearch && matchCat;
    });

    const categories: (ToolCategory | 'All')[] = ['All', 'Developer', 'Design', 'Text', 'Security', 'Productivity'];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-20">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest">
                        MegaDrawk Utility Suite
                    </motion.div>
                    <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
                        Professional Tools <br /><span className="text-slate-600 italic">for Creators</span>
                    </motion.h1>
                    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        A curated collection of {ALL_TOOLS.length}+ developer, design, and productivity utilities. Free, secure, and running entirely in your browser.
                    </motion.p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 sticky top-4 z-50 bg-[#020617]/80 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-2xl">
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCat(cat)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${selectedCat === cat ? 'bg-white text-black' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search tools..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>

                {/* Grid */}
                {filteredTools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTools.map((tool: ToolMeta, i: number) => (
                            <Link key={tool.slug} href={tool.path}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group h-full bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/30 rounded-3xl p-8 transition-all hover:-translate-y-1 relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 p-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all -mr-16 -mt-16 pointer-events-none" />

                                    <div className="relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-300 mb-6 group-hover:scale-110 group-hover:border-cyan-500/50 group-hover:text-cyan-400 transition-all shadow-lg">
                                            <tool.icon size={28} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{tool.title}</h3>
                                        <p className="text-slate-400 leading-relaxed text-sm">{tool.description}</p>

                                        <div className="mt-8 flex items-center text-xs font-bold text-slate-600 uppercase tracking-widest group-hover:text-cyan-500 transition-colors">
                                            Open Tool →
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 text-slate-500">
                        <p className="text-xl">No tools found matching "{search}"</p>
                        <button onClick={() => { setSearch(''); setSelectedCat('All'); }} className="mt-4 text-cyan-400 hover:underline">Clear Filters</button>
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
            `}</style>
        </div>
    );
}
