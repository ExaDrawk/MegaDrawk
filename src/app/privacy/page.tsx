'use client';

import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900 pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-16">
                <header className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">
                        <Lock size={14} />
                        Security & Privacy
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-slate-900">プライバシーポリシー</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium">MegaDrawk Industries は、お客様の情報の機密性を最優先事項と考えています。</p>
                </header>

                <div className="space-y-12 bg-slate-50 p-12 md:p-20 rounded-[4rem] border border-slate-100 leading-loose text-slate-600 shadow-sm font-medium">
                    <section className="space-y-6">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <Shield className="text-blue-600" size={24} />
                            データの処理について
                        </h2>
                        <p>当サービスの提供するツールの多くは、クライアントサイド（お客様のブラウザ上）で完結するように設計されています。入力されたデータ（JSON、パスワード、コード等）が弊社のサーバーに送信されたり、保存されたりすることはありません。</p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <Eye className="text-emerald-600" size={24} />
                            アクセス解析の利用
                        </h2>
                        <p>サービスの品質向上と利用状況の把握のため、Google Analytics などのツールを使用し、匿名化されたアクセスデータを収集する場合があります。これらのデータに個人を特定する情報は含まれません。</p>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <FileText className="text-blue-600" size={24} />
                            情報の開示
                        </h2>
                        <p>法令に基づく要請がある場合を除き、収集した情報を第三者に提供することはありません。</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
