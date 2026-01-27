'use client';

import { motion } from 'framer-motion';
import { SITE, UI_TEXT } from '../../config/site';

export default function GovernancePage() {
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
                                Governance & Mission
                            </h1>
                            <p className="text-xl text-slate-500 font-medium">
                                {UI_TEXT.missionText}
                            </p>
                        </motion.div>

                        <div className="grid gap-12 text-slate-600 leading-loose">
                            <section className="space-y-6">
                                <h2 className="text-2xl font-black text-slate-900">企業の社会的責任と厳格な運用</h2>
                                <p>
                                    MegaDrawk Industries は、テクノロジーを通じて社会のインフラを再定義することを目指しています。
                                    私たちのガバナンス体制は、単なる法令遵守に留まらず、社会的な要請に対して先見性を持って応えることを主眼としています。
                                </p>
                                <div className="bg-slate-900 rounded-3xl p-10 text-white space-y-6">
                                    <h3 className="text-xl font-bold text-blue-400 font-mono uppercase tracking-widest">Core Values</h3>
                                    <ul className="grid md:grid-cols-2 gap-8">
                                        <li className="space-y-2">
                                            <h4 className="font-bold text-lg">Integrity (誠実性)</h4>
                                            <p className="text-sm text-slate-400">すべてのデータ、すべての意思決定において、歪みのない真実を追求します。</p>
                                        </li>
                                        <li className="space-y-2">
                                            <h4 className="font-bold text-lg">Precision (精緻性)</h4>
                                            <p className="text-sm text-slate-400">ミリ秒単位の精度が、組織の命運を分けることを認識し、妥協のない精度を維持します。</p>
                                        </li>
                                        <li className="space-y-2">
                                            <h4 className="font-bold text-lg">Resilience (回復力)</h4>
                                            <p className="text-sm text-slate-400">予期せぬ変動に対しても、業務を停止させない堅牢なプラットフォームを構築します。</p>
                                        </li>
                                        <li className="space-y-2">
                                            <h4 className="font-bold text-lg">Innovation (革新性)</h4>
                                            <p className="text-sm text-slate-400">既存の枠組みに囚われず、AIと人間の可能性を最大化する道を探求し続けます。</p>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-2xl font-black text-slate-900">運用管理体制</h2>
                                <p>
                                    私たちの「運用の厳格性 24/7」は、高度に自動化された監視システムと、専門のエンジニアリングチームによって支えられています。
                                    すべてのサービスにおいて、高い可用性とセキュリティ水準を維持し、ユーザーが安心して重要な業務を遂行できる環境を提供します。
                                </p>
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
                        <a href="/documentation" className="hover:text-blue-600">Documentation</a>
                        <a href="/compliance" className="hover:text-blue-600">Compliance</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
