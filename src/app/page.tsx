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

        </div>
      </section>

      {/* New Game Section - Small Button */}
      <section className="text-center mb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-4 p-2 pl-4 pr-6 bg-slate-100/50 backdrop-blur rounded-full border border-slate-200 hover:border-pink-300 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experimental</span>
          </div>
          <a
            href="/aura-refiner"
            className="text-sm font-bold text-slate-600 group-hover:text-pink-600 transition-colors flex items-center gap-2"
          >
            AuraRefiner を起動
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:rotate-12 transition-transform">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </a>
        </motion.div>
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
      </main >

    {/* Footer */ }
    < footer className = "border-t border-slate-100 py-12 bg-white" >
      <div className="container-max flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="h-6 w-1 bg-slate-200 rounded-full" />
          <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">
            {SITE.name} Industries
          </span>
        </div>
        <div className="flex items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <a href="/documentation" className="hover:text-blue-600 transition-colors">Documentation</a>
          <a href="/governance" className="hover:text-blue-600 transition-colors">Governance</a>
          <a href="/compliance" className="hover:text-blue-600 transition-colors">Compliance</a>
        </div>
        <span className="text-xs font-bold text-slate-400 font-mono">
          © {new Date().getFullYear()} {SITE.legalName}
        </span>
      </div>
      </footer >
    </div >
  );
}
