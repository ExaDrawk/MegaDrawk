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
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?sz=64&domain=${subdomain}`;
          }}
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
          <span>Explore</span>
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
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

      {/* Hero Section */}
      <main className="pt-32 pb-24">
        <div className="container-max">
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

          {/* Mission & Governance Section */}
          <section id="governance" className="max-w-5xl mx-auto mb-32 grid md:grid-cols-2 gap-16 items-center pt-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter border-l-4 border-blue-600 pl-6">
                {UI_TEXT.missionHeading}
              </h2>
              <p className="text-slate-600 leading-loose text-lg font-medium">
                {UI_TEXT.missionText}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32" />
              <div className="relative z-10 space-y-8">
                <div className="space-y-2">
                  <div className="h-1 w-12 bg-blue-500 rounded-full" />
                  <p className="text-blue-400 font-mono text-sm tracking-widest uppercase">Global Standards</p>
                </div>
                <blockquote className="text-2xl font-bold text-white leading-snug italic">
                  "Efficiency is not just about speed, it's about the precision of every single decision."
                </blockquote>
                <div className="pt-6 border-t border-white/10">
                  <p className="text-slate-400 text-sm">Strategic Research Division, MegaDrawk</p>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Solutions Heading */}
          <section id="documentation" className="pt-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
                {UI_TEXT.servicesHeading}
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg hover:underline cursor-help">
                {UI_TEXT.servicesSubheading}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto mb-32">
              {SERVICES.map((service, index) => (
                <ServiceCard key={service.subdomain} service={service} index={index} />
              ))}
            </div>
          </section>

          {/* Technology Section */}
          <section id="technology" className="max-w-6xl mx-auto mb-32 py-20 bg-slate-50 rounded-[3rem] border border-slate-100 px-8 md:px-16 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">
              {UI_TEXT.techHeading}
            </h2>
            <p className="text-slate-500 mb-16">{UI_TEXT.techSubheading}</p>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="h-12 w-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-slate-100">
                  <div className="h-4 w-4 bg-blue-600 rounded-full animate-pulse" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">{UI_TEXT.techFocus1}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{UI_TEXT.techFocus1Desc}</p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-slate-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 text-lg">{UI_TEXT.techFocus2}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{UI_TEXT.techFocus2Desc}</p>
              </div>
              <div className="space-y-4">
                <div className="h-12 w-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 border border-slate-100">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-900 text-lg">{UI_TEXT.techFocus3}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{UI_TEXT.techFocus3Desc}</p>
              </div>
            </div>
          </section>

          {/* Compliance & Privacy Section */}
          <section id="compliance" className="max-w-4xl mx-auto mt-20 text-left border-t border-slate-100 pt-16 scroll-mt-20">
            <h3 className="text-2xl font-black text-slate-900 mb-2">{UI_TEXT.privacyHeading}</h3>
            <p className="text-slate-500 mb-10 font-medium">{UI_TEXT.privacySubheading}</p>

            <div className="grid md:grid-cols-2 gap-10 text-sm text-slate-600 leading-relaxed">
              <div className="space-y-4">
                <p>
                  <strong className="text-slate-900 block mb-1">広告配信について</strong>
                  当サイト（{SITE.name}）では、第三者配信の広告サービス（Google AdSense）を利用し、将来的なサービス運用の維持に役立てています。
                </p>
                <p>
                  <strong className="text-slate-900 block mb-1">Cookie の利用</strong>
                  Google などの第三者配信事業者は Cookie を使用し、ユーザーが当サイトや他のウェブサイトに過去にアクセスした際の情報に基づいて広告を配信します。
                </p>
                <p>
                  Google が広告 Cookie を使用することにより、Google およびそのパートナーは、ユーザーが当サイトや他のサイトにアクセスした際の情報に基づいて、適切な広告をユーザーに表示できます。
                </p>
              </div>
              <div className="space-y-4">
                <p>
                  <strong className="text-slate-900 block mb-1">設定の管理</strong>
                  ユーザーは、<a href="https://adssettings.google.com/authenticated" className="text-blue-600 underline">広告設定</a>でパーソナライズド広告を無効にできます。あるいは <a href="http://www.aboutads.info" className="text-blue-600 underline">aboutads.info</a> にアクセスし、第三者配信事業者の Cookie 使用によるパーソナライズド広告配信を無効にできます。
                </p>
                <p>
                  <strong className="text-slate-900 block mb-1">国際的規制への対応</strong>
                  EEA/英国/スイス等のユーザーに対しては、Cookie 等の使用や広告パーソナライズのための個人データの収集・共有・利用について適切に管理します。
                </p>
                <p>
                  日本の外部送信規律に基づき、外部送信がある場合は、通知・公表・オプトアウト・同意取得のいずれかの措置を適切に実施し、ユーザーのプライバシーを尊重します。
                </p>
              </div>
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
              {SITE.name} Industries
            </span>
          </div>
          <div className="flex items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <a href="#documentation" onClick={scrollTo('documentation')} className="hover:text-blue-600 transition-colors">Documentation</a>
            <a href="#governance" onClick={scrollTo('governance')} className="hover:text-blue-600 transition-colors">Governance</a>
            <a href="#compliance" onClick={scrollTo('compliance')} className="hover:text-blue-600 transition-colors">Compliance</a>
          </div>
          <span className="text-xs font-bold text-slate-400 font-mono">
            © {new Date().getFullYear()} {SITE.legalName} | {UI_TEXT.footerSuffix}
          </span>
        </div>
      </footer>
    </div>
  );
}
