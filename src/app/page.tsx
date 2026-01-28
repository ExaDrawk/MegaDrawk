'use client';

import { motion } from 'framer-motion';
import { SERVICES, SITE, UI_TEXT, type Service } from '../config/site';

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { name, subdomain, description, url, iconUrl } = service;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="premium-card group flex flex-col p-8 w-full"
    >
      <div className="mb-6 relative flex items-center gap-4">
        <img
          src={iconUrl}
          alt={name}
          className="relative h-12 w-12 rounded-xl border border-slate-200 bg-white p-2 shadow-sm group-hover:scale-110 transition-transform duration-300"
        />
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
      </div>

      <p className="text-slate-500 text-sm leading-relaxed mb-6">
        {description}
      </p>

      <div className="mt-auto pt-4 border-t border-slate-100 w-full flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 capitalize tracking-widest font-mono">
          {subdomain}
        </span>
        <div className="flex items-center gap-1 text-blue-600 font-bold text-xs">
          <span>詳細を見る</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:translate-x-1 transition-transform"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.a>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <div className="bg-mesh" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="container-max flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
            <span className="text-xl font-black tracking-tight text-slate-900">
              {SITE.name}
            </span>
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              {UI_TEXT.operationalRigor}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-24">
        <div className="container-max">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-8"
            >
              <span className="text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-5 py-2.5 rounded-full border border-blue-100 italic">
                {UI_TEXT.eyebrow}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[1] mb-10"
            >
              {UI_TEXT.heroHeadline}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl md:text-2xl text-slate-500 leading-relaxed max-w-3xl mx-auto font-medium"
            >
              {UI_TEXT.heroSubheadline}
            </motion.p>
          </div>

          {/* Solutions Summary */}
          <section className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                {UI_TEXT.servicesHeading}
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                {UI_TEXT.servicesSubheading}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
              {SERVICES.filter(s => !('isGame' in s)).map((service, index) => (
                <ServiceCard key={service.subdomain} service={service} index={index} />
              ))}
            </div>

            <div className="text-center mt-12">
              <a href="/documentation" className="text-sm font-bold text-blue-600 hover:underline inline-flex items-center gap-2 group">
                詳細なドキュメントを見る
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </section>

          {/* AuraRefiner Dedicated Section */}
          <section className="mb-48 relative">
            <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-5xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden border border-slate-800 shadow-2xl">
              {/* Background Accents */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-12 relative z-10"
              >
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">実証実験ラボ</span>
                </div>

                <div className="space-y-6">
                  <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase">
                    LOGIC<span className="text-[#00f2ff]">ASCENT</span>
                  </h2>
                  <p className="text-slate-400 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
                    マウスを動かすだけ、感覚を同期する。
                    飛来するデータを直感的に収集し、ノイズを排除せよ。
                    究極のシンプルさと爽快感を追求した、MegaDrawk の新機軸ニューロ・アクション。
                  </p>
                </div>

                {/* How to Play Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto py-8">
                  <div className="p-8 bg-slate-800/50 rounded-3xl border border-slate-700 text-left space-y-4">
                    <div className="w-12 h-12 bg-[#00f2ff]/20 rounded-2xl flex items-center justify-center text-[#00f2ff]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /></svg>
                    </div>
                    <h4 className="text-white font-bold text-lg">1. 直感的に回避・収集</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">マウスでコアを操作。青・緑のデータを集め、赤のノイズを巧みに回避せly。</p>
                  </div>
                  <div className="p-8 bg-slate-800/50 rounded-3xl border border-slate-800 text-left space-y-4">
                    <div className="w-12 h-12 bg-[#00ff88]/20 rounded-2xl flex items-center justify-center text-[#00ff88]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                    </div>
                    <h4 className="text-white font-bold text-lg">2. シンクロ・バースト</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">クリックまたはスペースでバースト発動。周囲のデータを一括回収し、危機を脱せよ。</p>
                  </div>
                  <div className="p-8 bg-slate-800/50 rounded-3xl border border-slate-800 text-left space-y-4">
                    <div className="w-12 h-12 bg-[#fff200]/20 rounded-2xl flex items-center justify-center text-[#fff200]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    </div>
                    <h4 className="text-white font-bold text-lg">3. ハイスコアを目指せ</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">コンボを繋ぎ、シンクロ率を高めてレベルアップ。極限のデータ処理能力を証明せよ。</p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-8">
                  <motion.a
                    href="/aura-refiner"
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative inline-flex items-center gap-4 bg-white text-slate-950 px-12 py-6 rounded-3xl text-2xl font-black transition-all hover:bg-[#00f2ff] hover:text-white shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[#00f2ff]/40"
                  >
                    Logic Ascent を起動する
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-2 group-hover:rotate-12 transition-transform">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </motion.a>

                  <div className="flex items-center gap-8 text-[10px] font-black text-slate-500 uppercase tracking-widest pt-4">
                    <span className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                      反射神経の測定
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                      論理的判断の高速化
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-slate-700 rounded-full" />
                      完全日本語対応
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Vision Section */}
          <section className="max-w-6xl mx-auto mb-32 grid md:grid-cols-2 gap-16 items-center bg-slate-50 rounded-[3rem] p-12 border border-slate-100">
            <div className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter border-l-4 border-blue-600 pl-6">
                {UI_TEXT.missionHeading}
              </h2>
              <p className="text-slate-600 leading-loose text-lg font-medium line-clamp-3">
                {UI_TEXT.missionText}
              </p>
              <a href="/governance" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-black transition-colors">
                ガバナンスと使命の詳細
              </a>
            </div>
            <div className="bg-white p-10 rounded-[2rem] shadow-sm transform rotate-1">
              <h4 className="font-bold text-slate-900 mb-4">{UI_TEXT.techHeading}</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm font-medium text-slate-500">
                  <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
                  {UI_TEXT.techFocus1}
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-500">
                  <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
                  {UI_TEXT.techFocus2}
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-slate-500">
                  <div className="h-1.5 w-1.5 bg-blue-600 rounded-full" />
                  {UI_TEXT.techFocus3}
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 bg-white">
        <div className="container-max flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-slate-200 rounded-full" />
            <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">
              {SITE.name} インダストリーズ
            </span>
          </div>
          <div className="flex items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <a href="/documentation" className="hover:text-blue-600 transition-colors">ドキュメント</a>
            <a href="/governance" className="hover:text-blue-600 transition-colors">ガバナンス</a>
            <a href="/compliance" className="hover:text-blue-600 transition-colors">コンプライアンス</a>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono">
            © {new Date().getFullYear()} {SITE.legalName}
          </span>
        </div>
      </footer>
    </div>
  );
}
