'use client';

import React from 'react';
import { Gavel, FileText, CheckCircle } from 'lucide-react';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#020617] text-white pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-16">
                <header className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-yellow-500">
                        <Gavel size={14} />
                        Legal Agreement
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter">利用規約</h1>
                    <p className="text-slate-500 max-w-xl mx-auto font-medium">MegaDrawk のサービスをご提供する上での基本的な条件を規定しています。</p>
                </header>

                <div className="space-y-12 bg-slate-900/30 p-12 md:p-20 rounded-[4rem] border border-white/5 leading-loose text-slate-400">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <CheckCircle className="text-blue-500" size={24} />
                            第1条（適用）
                        </h2>
                        <p>本規約は、MegaDrawk Industries（以下「弊社」）が提供する本ツールの利用に関わる一切の関係に適用されます。本ツールを利用することで、本規約に同意したものとみなされます。</p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <CheckCircle className="text-blue-500" size={24} />
                            第2条（禁止事項）
                        </h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>法令または公序良俗に違反する行為。</li>
                            <li>本サービスのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為。</li>
                            <li>本サービスの運営を妨害するおそれのある行為。</li>
                        </ul>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <CheckCircle className="text-blue-500" size={24} />
                            第3条（免責事項）
                        </h2>
                        <p>弊社は、本ツールに関して提供される情報の正確性、有用性、確実性について一切の保証を行いません。本ツールの利用により生じた損害について、弊社は一切の責任を負わないものとします。</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
