'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SITE, SERVICES } from '@/config/site';
import Link from 'next/link';
import { ChevronRight, ArrowUpRight, Zap, Target, Shield, Layout, FileJson, Key, LayoutGrid, Box } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] } }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Mesh Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-100 blur-[100px] rounded-full" />
      </div>

      <main className="relative pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero Section */}
          <section className="text-center mb-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
            >
              <Zap size={12} className="animate-pulse" />
              次世代知能インフラストラクチャ
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.9] mb-12"
            >
              未来を、<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-500 italic">精緻化</span>せよ。
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium mb-12"
            >
              MegaDrawk Industries は、法務、経営、そして最先端技術を融合させ、不確実な世界を論理の力で再構築します。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link href="/tools" className="group px-10 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all shadow-2xl shadow-white/5">
                ツールキットを開く
                <ChevronRight size={16} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/documentation" className="px-10 py-5 bg-slate-900 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
                技術ドキュメント
              </Link>
            </motion.div>
          </section>

          {/* Core Services Grid */}
          <motion.section
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-48"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SERVICES.filter(s => !s.isGame).map((service) => (
                <motion.a
                  key={service.name}
                  href={service.url}
                  target="_blank"
                  variants={item}
                  className="group relative p-12 bg-slate-50 border border-slate-200 rounded-[3rem] overflow-hidden hover:border-blue-500/30 transition-all hover:bg-white hover:shadow-2xl"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <img src={service.iconUrl} alt={service.name} className="w-16 h-16 rounded-2xl" />
                      <ArrowUpRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">{service.name}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-8">{service.description}</p>
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{service.subdomain}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* Global Utility Section */}
          <section className="mb-48">
            <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
              <div className="space-y-4">
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Integrated Toolkit</div>
                <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">Global <span className="text-slate-400">Utility</span></h2>
              </div>
              <Link href="/tools" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-blue-600 transition-all pb-2 border-b border-slate-200 flex items-center gap-4 group">
                すべてのツールを閲覧
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'JSON検証', icon: FileJson, path: '/tools/json-validator', color: 'blue' },
                { name: 'パスワード生成', icon: Key, path: '/tools/password-generator', color: 'sky' },
                { name: 'PX/REM変換', icon: LayoutGrid, path: '/tools/px-to-rem', color: 'cyan' },
                { name: 'QR生成', icon: Box, path: '/tools/qr-generator', color: 'emerald' },
              ].map((tool, i) => (
                <Link key={i} href={tool.path}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-10 bg-slate-50 border border-slate-200 rounded-[2.5rem] flex flex-col items-center text-center gap-6 hover:border-blue-500 transition-all shadow-xl group"
                  >
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-colors shadow-md">
                      <tool.icon size={24} />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </section>
          <section className="py-32 px-6 bg-slate-50 border-y border-slate-200">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 uppercase">Experimental <span className="text-slate-400">Lab</span></h2>
              <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {/* AuraRefiner Card */}
              <Link href="/aura-refiner">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="group relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl p-12 flex flex-col justify-end"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000">
                    <img src={SERVICES.find(s => s.url === '/aura-refiner')?.iconUrl} className="w-64 h-64 blur-xl" />
                  </div>

                  <div className="relative z-10 bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col h-full hover:shadow-xl transition-all">
                    <div className="mb-8">
                      <img src={SERVICES.find(s => s.url === '/aura-refiner')?.iconUrl} className="w-12 h-12 rounded-xl" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">Aura Refiner</h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-8 flex-1">反射と選別の高速シミュレーター。論理の結晶を精製せよ。</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Simulation</span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* EchoControl Card */}
              <Link href="/echo-control">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="group relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl p-12 flex flex-col justify-end"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000">
                    <img src={SERVICES.find(s => s.url === '/echo-control')?.iconUrl} className="w-64 h-64 blur-xl" />
                  </div>

                  <div className="relative z-10 bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col h-full hover:shadow-xl transition-all">
                    <div className="mb-8">
                      <img src={SERVICES.find(s => s.url === '/echo-control')?.iconUrl} className="w-12 h-12 rounded-xl" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">Echo Control</h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-8 flex-1">未来の予約を清算する、時間構造パズル。静寂を取り戻せ。</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Simulation</span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>

              {/* StreamWiring Card */}
              <Link href="/stream-wiring">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="group relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl p-12 flex flex-col justify-end"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000">
                    <img src={SERVICES.find(s => s.url === '/stream-wiring')?.iconUrl} className="w-64 h-64 blur-xl" />
                  </div>

                  <div className="relative z-10 bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col h-full hover:shadow-xl transition-all">
                    <div className="mb-8">
                      <img src={SERVICES.find(s => s.url === '/stream-wiring')?.iconUrl} className="w-12 h-12 rounded-xl" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">Stream Wiring</h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-8 flex-1">現実のパルスを同調させる、信号処理回路。</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Simulation</span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          </section>

          {/* Core Values */}
          <section className="grid md:grid-cols-3 gap-12 bg-slate-50 rounded-[4rem] p-16 border border-slate-200">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-600">
                <Target size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Precision Engineering</h4>
              <p className="text-slate-600 text-sm leading-relaxed">ミリ秒単位の精度でデータを解析し、意思決定のノイズを排除します。</p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center text-sky-600">
                <Shield size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Mission Critical</h4>
              <p className="text-slate-600 text-sm leading-relaxed">金融、法務、インフラ。止まることが許されない現場を支え続けます。</p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-600">
                <Layout size={24} />
              </div>
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Human Centric UX</h4>
              <p className="text-slate-600 text-sm leading-relaxed">複雑なロジックを直感的な体験へ。人間知能を拡張するデザイン。</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg" />
              <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">{SITE.name} Industries</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} {SITE.legalName}. All Rights Reserved.</p>
          </div>
          <div className="flex flex-wrap items-center gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
