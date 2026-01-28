'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolShellProps {
    title: string;
    description: string;
    children: React.ReactNode;
    howToUse?: React.ReactNode;
    faq?: { q: string; a: string }[];
}

export const ToolShell: React.FC<ToolShellProps> = ({ title, description, children, howToUse, faq }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
                    <Link href="/tools" className="hover:text-cyan-400 transition-colors">Tools</Link>
                    <span>/</span>
                    <span className="text-slate-300">{title}</span>
                </nav>

                {/* Header */}
                <header className="mb-12 border-b border-slate-800 pb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                    >
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                {title}
                            </h1>
                            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                                {description}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 transition-all text-slate-400 hover:text-cyan-400">
                                <Share2 size={20} />
                            </button>
                            <button className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-yellow-500/50 hover:bg-slate-800 transition-all text-slate-400 hover:text-yellow-400">
                                <Star size={20} />
                            </button>
                        </div>
                    </motion.div>
                </header>

                {/* Main Tool Area */}
                <main className="mb-16">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-1 shadow-2xl overflow-hidden backdrop-blur-xl">
                        <div className="bg-slate-950/80 rounded-[1.4rem] p-6 md:p-10 min-h-[400px]">
                            {children}
                        </div>
                    </div>
                </main>

                {/* Content Content (SEO) */}
                <article className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-2 space-y-12">
                        {howToUse && (
                            <section className="prose prose-invert max-w-none">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-sm">01</span>
                                    How to use this tool
                                </h2>
                                <div className="text-slate-400 leading-7">
                                    {howToUse}
                                </div>
                            </section>
                        )}

                        {faq && faq.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-sm">02</span>
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-4">
                                    {faq.map((item, i) => (
                                        <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                                            <h3 className="text-lg font-bold text-slate-200 mb-2">{item.q}</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar Ad / Related */}
                    <aside className="space-y-8">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center h-64 flex items-center justify-center flex-col gap-2">
                            <div className="text-xs font-bold text-slate-600 tracking-widest uppercase">Sponsored</div>
                            <div className="text-slate-500 text-sm">Place AdSense Unit Here</div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">More Tools</h3>
                            <div className="space-y-3">
                                <Link href="/tools" className="block p-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors text-sm text-slate-400 hover:text-white">
                                    Check out our full suite...
                                </Link>
                            </div>
                        </div>
                    </aside>
                </article>

                <footer className="mt-24 pt-8 border-t border-slate-900 text-center text-slate-600 text-sm">
                    <p>© 2026 MegaDrawk Tools Suite. Professional Utility Collection.</p>
                </footer>
            </div>
        </div>
    );
};
