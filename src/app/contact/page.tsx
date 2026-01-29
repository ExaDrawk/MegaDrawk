'use client';

import React from 'react';
import { Mail, MessageSquare, Send, Globe } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#020617] text-white pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-20">
                <header className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">
                        <MessageSquare size={14} />
                        Get In Touch
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter">お問い合わせ</h1>
                    <p className="text-slate-500 max-w-xl mx-auto font-medium">MegaDrawk に関するご質問、フィードバック、ビジネスのお問い合わせはこちらから。</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-[1fr,1.5fr] gap-12">
                    {/* Info */}
                    <div className="space-y-12 bg-slate-900/40 p-12 rounded-[3.5rem] border border-white/5 h-fit">
                        <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">Email Address</div>
                            <div className="text-xl font-bold text-white flex items-center gap-3">
                                <Mail className="text-blue-500" size={20} />
                                info@megadrawk.com
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">Location</div>
                            <div className="text-xl font-bold text-white flex items-center gap-3">
                                <Globe className="text-cyan-500" size={20} />
                                Tokyo / Metaverse
                            </div>
                        </div>
                    </div>

                    {/* Simple Form (Visual only for now) */}
                    <div className="space-y-8 bg-slate-900/20 p-12 rounded-[4rem] border border-white/5 border-dashed">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">お名前 (Name)</label>
                            <input type="text" className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 focus:border-blue-500 focus:outline-none transition-all" placeholder="例: 山田 太郎" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">メールアドレス (Email)</label>
                            <input type="email" className="w-full bg-slate-950 border border-white/5 rounded-2xl p-6 focus:border-blue-500 focus:outline-none transition-all" placeholder="email@example.com" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-4">メッセージ (Message)</label>
                            <textarea className="w-full h-40 bg-slate-950 border border-white/5 rounded-2xl p-6 focus:border-blue-500 focus:outline-none transition-all resize-none" placeholder="お問い合わせ内容を入力..." />
                        </div>
                        <button className="w-full group relative flex items-center justify-center gap-3 px-8 py-6 bg-white text-black font-black text-xs uppercase tracking-[0.4em] rounded-2xl transition-all hover:bg-blue-600 hover:text-white active:scale-[0.98] shadow-2xl">
                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            送信する
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
