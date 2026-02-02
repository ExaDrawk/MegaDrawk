'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Star, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdSense } from '../AdSense'; // Correct relative import
import { ADSENSE_CONFIG } from '@/config/site';

interface ToolShellProps {
    title: string;
    description: string;
    children: React.ReactNode;
    howToUse?: React.ReactNode;
    faq?: { q: string; a: string }[];
}

export const ToolShell: React.FC<ToolShellProps> = ({ title, description, children, howToUse, faq }) => {
    return (
        <div className="min-h-screen bg-white text-slate-800 pt-24 pb-20 px-6 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-12">
                    <Link href="/tools" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                        <ChevronLeft size={12} />
                        Utility Vectors
                    </Link>
                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-slate-500 font-bold">{title}</span>
                </nav>

                {/* Header */}
                <header className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-12"
                    >
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-none">
                                {title}
                            </h1>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                {description}
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-all text-slate-400 shadow-sm" aria-label="Share">
                                <Share2 size={20} />
                            </button>
                            <button className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-yellow-500 hover:text-yellow-600 transition-all text-slate-400 shadow-sm" aria-label="Star">
                                <Star size={20} />
                            </button>
                        </div>
                    </motion.div>
                </header>

                {/* Main Tool Area */}
                <main className="mb-32">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-sky-100 rounded-[3rem] blur-2xl opacity-50 transition duration-1000" />
                        <div className="relative bg-white border border-slate-200 rounded-[3rem] p-2 shadow-2xl">
                            <div className="bg-slate-50 rounded-[2.2rem] p-8 md:p-16 min-h-[500px]">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Info Sections */}
                <article className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-8 space-y-24">
                        {howToUse && (
                            <section>
                                <h2 className="text-sm font-black text-slate-900 mb-10 uppercase tracking-[0.3em] flex items-center gap-4">
                                    <span className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xs border border-blue-200 shadow-sm">01</span>
                                    Operational Guidance
                                </h2>
                                <div className="text-slate-600 leading-8 font-medium prose prose-slate max-w-none prose-strong:text-slate-900 prose-strong:font-black">
                                    {howToUse}
                                </div>
                            </section>
                        )}

                        {faq && faq.length > 0 && (
                            <section>
                                <h2 className="text-sm font-black text-slate-900 mb-10 uppercase tracking-[0.3em] flex items-center gap-4">
                                    <span className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center text-xs border border-sky-200 shadow-sm">02</span>
                                    Technical FAQ
                                </h2>
                                <div className="grid gap-6">
                                    {faq.map((item, i) => (
                                        <div key={i} className="group bg-white border border-slate-200 rounded-3xl p-8 hover:border-blue-500/50 hover:shadow-lg transition-all">
                                            <h3 className="text-lg font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{item.q}</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-4 space-y-12">
                        {/* AdSense Unit Container */}
                        <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm min-h-[300px] flex flex-col items-center justify-center relative">
                            {/* Using the component directly. ID is from configuration in site.ts. */}
                            <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                <AdSense pId={ADSENSE_CONFIG.id} />
                                <span className="text-[10px] text-slate-300 uppercase tracking-widest absolute bottom-4">Advertisement</span>
                            </div>
                        </div>


                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-900 mb-8 uppercase tracking-[0.3em]">Peripheral Utilities</h3>
                            <div className="space-y-4">
                                <Link href="/tools" className="group flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-500 transition-all text-xs font-black uppercase tracking-widest text-slate-500 hover:text-blue-600">
                                    Show All Vectors
                                    <ArrowLeft size={14} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </aside>
                </article>

                <footer className="mt-40 pt-12 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">© {new Date().getFullYear()} MegaDrawk Tools Suite. Professional Utility Collection.</p>
                </footer>
            </div>
        </div>
    );
};
