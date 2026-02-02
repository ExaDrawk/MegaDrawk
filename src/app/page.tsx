'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SITE, SERVICES } from '@/config/site';
import { HERO_CONTENT, CORE_VALUES, LAB_ITEMS } from '@/config/landing-content';
import Link from 'next/link';
import { ChevronRight, Zap } from 'lucide-react';
import { ServiceCard } from '@/components/landing/ServiceCard';
import { LabCard } from '@/components/landing/LabCard';
import { ValueCard } from '@/components/landing/ValueCard';
import { ToolCard } from '@/components/landing/ToolCard';
import { TOOLS_REGISTRY } from '@/lib/tools-registry';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const FEATURED_TOOLS_SLUGS = ['json-validator', 'password-generator', 'px-to-rem', 'qr-generator'];
const FEATURED_TOOLS = TOOLS_REGISTRY.filter(t => FEATURED_TOOLS_SLUGS.includes(t.slug));

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
              {HERO_CONTENT.badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.9] mb-12"
            >
              {HERO_CONTENT.headline.line1}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-500 italic">
                {HERO_CONTENT.headline.line2}
              </span>
              {HERO_CONTENT.headline.line2Suffix}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium mb-12"
            >
              {HERO_CONTENT.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link href="/tools" className="group px-10 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all shadow-2xl shadow-white/5">
                {HERO_CONTENT.cta.primary}
                <ChevronRight size={16} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/documentation" className="px-10 py-5 bg-slate-900 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
                {HERO_CONTENT.cta.secondary}
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
                <ServiceCard key={service.name} service={service} />
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
              {FEATURED_TOOLS.map((tool) => (
                <ToolCard key={tool.slug} name={tool.title} icon={tool.icon} path={tool.path} />
              ))}
            </div>
          </section>

          {/* Experimental Lab */}
          <section className="py-32 px-6 bg-slate-50 border-y border-slate-200">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 uppercase">Experimental <span className="text-slate-400">Lab</span></h2>
              <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full" />
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {LAB_ITEMS.map((item, i) => {
                // Auto-assign colors for variety: blue, cyan, emerald
                const colors: ('blue' | 'cyan' | 'emerald')[] = ['blue', 'cyan', 'emerald'];
                return <LabCard key={item.name} service={item} color={colors[i % colors.length]} />;
              })}
            </div>
          </section>

          {/* Core Values */}
          <section className="grid md:grid-cols-3 gap-12 bg-slate-50 rounded-[4rem] p-16 border border-slate-200">
            {CORE_VALUES.map((value, i) => (
              <ValueCard
                key={i}
                {...value}
                color={value.color as 'blue' | 'sky' | 'cyan'}
              />
            ))}
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
