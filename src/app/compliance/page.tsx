'use client';

import { motion } from 'framer-motion';
import { SITE, UI_TEXT } from '../../config/site';

export default function CompliancePage() {
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
                                Compliance & Privacy
                            </h1>
                            <p className="text-xl text-slate-500 font-medium">
                                {UI_TEXT.privacySubheading} 当社は透明性の高い運営を約束します。
                            </p>
                        </motion.div>

                        <div className="space-y-16 text-slate-700 leading-loose">
                            <section className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-12 shadow-sm">
                                <h2 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">プライバシーポリシー</h2>
                                <div className="space-y-10">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">1. 個人情報の収集と利用</h3>
                                        <p>
                                            当社は、お客様に最適なサービスを提供するために、氏名、メールアドレス等の個人情報を適切な手段で取得し、お問い合わせ対応およびサービス向上の目的で利用します。
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">2. 広告配信に関する情報公開</h3>
                                        <p className="mb-4">
                                            当サイト（{SITE.name}）では、第三者配信の広告サービス（Google AdSense）を利用しています。
                                        </p>
                                        <ul className="list-disc pl-6 space-y-4 text-slate-600">
                                            <li>
                                                Google などの第三者配信事業者は Cookie を使用し、ユーザーが当サイトや他のウェブサイトに過去にアクセスした際の情報に基づいて広告を配信します。
                                            </li>
                                            <li>
                                                Google が広告 Cookie を使用することにより、Google およびそのパートナーは、ユーザーが当サイトや他のサイトにアクセスした際の情報に基づいて、適切な広告をユーザーに表示できます。
                                            </li>
                                            <li>
                                                ユーザーは、<a href="https://adssettings.google.com/authenticated" className="text-blue-600 underline">広告設定</a>でパーソナライズド広告を無効にできます。
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4">3. Cookie の管理について</h3>
                                        <p>
                                            ブラウザの設定により Cookie を無効にすることが可能ですが、その際、当サイトの一部機能が正常に利用できなくなる場合があります。
                                            第三者配信事業者の Cookie 使用によるパーソナライズド広告配信を無効にしたい場合は、
                                            <a href="http://www.aboutads.info" className="text-blue-600 underline">aboutads.info</a> にアクセスして設定を変更することができます。
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-8">
                                <h2 className="text-3xl font-black text-slate-900 border-l-4 border-blue-600 pl-6">国際的な規制への準拠</h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="p-6 bg-slate-50 rounded-2xl">
                                        <h4 className="font-bold text-slate-900 mb-3">GDPR / 欧州経済領域</h4>
                                        <p className="text-sm text-slate-500">
                                            EEA/英国/スイス等のユーザーに対しては、Cookie の使用や広告パーソナライズのための個人データの収集について、透明性を保ち、必要に応じて同意を取得します。
                                        </p>
                                    </div>
                                    <div className="p-6 bg-slate-50 rounded-2xl">
                                        <h4 className="font-bold text-slate-900 mb-3">日本国内法 / 外部送信規律</h4>
                                        <p className="text-sm text-slate-500">
                                            電気通信事業法の外部送信規律に基づき、利用者情報の外部送信に関する情報の通知、公表、および必要に応じたオプトアウト等の措置を講じています。
                                        </p>
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
                        <a href="/documentation" className="hover:text-blue-600">Documentation</a>
                        <a href="/governance" className="hover:text-blue-600">Governance</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
