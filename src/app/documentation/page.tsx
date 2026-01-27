'use client';

import { motion } from 'framer-motion';
import { SITE, UI_TEXT, SERVICES } from '../../config/site';

export default function DocumentationPage() {
    return (
        <div className="min-h-screen relative overflow-x-hidden">
            <div className="bg-mesh" />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="container-max flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <a href="/" className="flex items-center gap-3">
                            <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
                            <span className="text-xl font-black tracking-tight text-slate-900">
                                {SITE.name}
                            </span>
                        </a>
                    </div>
                    <nav className="flex items-center gap-6">
                        <a href="/" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Home</a>
                    </nav>
                </div>
            </header>

            <main className="pt-32 pb-24">
                <div className="container-max">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-16"
                        >
                            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
                                Documentation
                            </h1>
                            <p className="text-xl text-slate-500 font-medium">
                                MegaDrawk エコシステムを構成するコア・テクノロジーと、各ソリューションの機能解説を提供します。
                            </p>
                        </motion.div>

                        <div className="space-y-20">
                            <section className="space-y-8">
                                <h2 className="text-3xl font-black text-slate-900 border-l-4 border-blue-600 pl-6">エコシステムの概要</h2>
                                <div className="prose prose-slate max-w-none text-slate-600 leading-loose">
                                    <p>
                                        MegaDrawk は、企業の「意思決定」と「リーガルリスク管理」を統合する、先進的なプラットフォームです。
                                        MeetPicks によるコミュニケーションの構造化と、LawDrawk による法務プロセスの自動化が相互に連携し、
                                        組織全体のレジリエンスを向上させます。
                                    </p>
                                </div>
                            </section>

                            {SERVICES.map((service) => (
                                <section key={service.name} className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm space-y-6">
                                    <div className="flex items-center gap-4">
                                        <img src={service.iconUrl} alt="" className="w-12 h-12" />
                                        <h3 className="text-2xl font-bold text-slate-900">{service.name} 概要</h3>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed">
                                        {service.description}
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-6 pt-6">
                                        <div className="bg-slate-50 p-6 rounded-2xl">
                                            <h4 className="font-bold text-slate-900 mb-2">主な機能</h4>
                                            <ul className="text-sm space-y-2 text-slate-500">
                                                <li>• 高度なデータ構造化エンジン</li>
                                                <li>• リアルタイム同期システム</li>
                                                <li>• 役割ベースのアクセスコントロール</li>
                                            </ul>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-2xl">
                                            <h4 className="font-bold text-slate-900 mb-2">導入メリット</h4>
                                            <ul className="text-sm space-y-2 text-slate-500">
                                                <li>• 業務時間の削減</li>
                                                <li>• 情報の透明性と追跡性の確保</li>
                                                <li>• 組織内のナレッジ共有の円滑化</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                            ))}

                            <section className="space-y-8">
                                <h2 className="text-3xl font-black text-slate-900 border-l-4 border-blue-600 pl-6">技術コンセプト</h2>
                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-slate-900">{UI_TEXT.techFocus1}</h4>
                                        <p className="text-sm text-slate-500">{UI_TEXT.techFocus1Desc}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-slate-900">{UI_TEXT.techFocus2}</h4>
                                        <p className="text-sm text-slate-500">{UI_TEXT.techFocus2Desc}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-slate-900">{UI_TEXT.techFocus3}</h4>
                                        <p className="text-sm text-slate-500">{UI_TEXT.techFocus3Desc}</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t border-slate-100 py-12 bg-white">
                <div className="container-max flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                        © {new Date().getFullYear()} {SITE.legalName}
                    </span>
                    <div className="flex gap-6 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <a href="/governance" className="hover:text-blue-600">Governance</a>
                        <a href="/compliance" className="hover:text-blue-600">Compliance</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
