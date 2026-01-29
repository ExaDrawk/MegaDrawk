'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { SITE } from '@/config/site';

export function Navbar() {
    const pathname = usePathname();

    const navLinks = [
        { name: 'ホーム', href: '/' },
        { name: 'ツール', href: '/tools' },
        { name: 'オーラ精製機', href: '/aura-refiner' },
        { name: 'エコー制御', href: '/echo-control' },
        { name: 'ドキュメント', href: '/documentation' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-2xl border-b border-slate-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-6 h-6 bg-blue-600 rounded-lg group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-500/20" />
                    <span className="text-xl font-black tracking-tighter text-slate-900">
                        {SITE.name}<span className="text-blue-600">.</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                {link.name}
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-underline"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Nav Trigger Placeholder */}
                <div className="md:hidden">
                    <button className="text-slate-500">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}
