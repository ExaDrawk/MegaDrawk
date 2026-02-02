'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContrastCheckerPage() {
    const [bg, setBg] = useState('#ffffff');
    const [fg, setFg] = useState('#0f172a');
    const [ratio, setRatio] = useState(21);
    const [level, setLevel] = useState({ aa: true, aaLarge: true, aaa: true, aaaLarge: true });

    const lum = (hex: string) => {
        const rgb = parseInt(hex.replace('#', ''), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    useEffect(() => {
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!hexRegex.test(bg) || !hexRegex.test(fg)) return;

        const l1 = lum(bg) + 0.05;
        const l2 = lum(fg) + 0.05;
        const r = l1 > l2 ? l1 / l2 : l2 / l1;

        setRatio(parseFloat(r.toFixed(2)));
        setLevel({
            aa: r >= 4.5,
            aaLarge: r >= 3.0,
            aaa: r >= 7.0,
            aaaLarge: r >= 4.5
        });
    }, [bg, fg]);

    const ResultRow = ({ label, pass }: { label: string, pass: boolean }) => (
        <div className={`p-6 rounded-2xl border flex items-center justify-between transition-all ${pass ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
            <span className={`text-[10px] font-black uppercase tracking-widest ${pass ? 'text-emerald-600' : 'text-rose-600'}`}>{label}</span>
            {pass ? (
                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                    <Check size={14} />
                    VALIDATED
                </div>
            ) : (
                <div className="flex items-center gap-2 text-rose-600 font-black text-[10px] uppercase tracking-widest">
                    <X size={14} />
                    VIOLATION
                </div>
            )}
        </div>
    );

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Define the <strong>Foreground Vector</strong> and <strong>Luminance Baseline</strong> (Background) using HEX or chromatic pickers.</li>
            <li>The <strong>Luminance Contrast Ratio</strong> is derived in real-time according to WCAG architectural standards.</li>
            <li>A delta of at least <strong>4.5:1</strong> is mandatory for semantic text to achieve WCAG AA compliance.</li>
            <li>Simulate the outcome on the <strong>Canvas Preview</strong> to ensure legible visual hierarchies across varying display environments.</li>
        </ul>
    );

    const faq = [
        { q: "Architectural delta between AA and AAA?", a: "AA is the industry-standard accessibility baseline for professional interfaces. AAA represents high-fidelity Rigorous compliance, requiring more extreme contrast deltas (7:1 for normal-weight vectors)." },
        { q: "Linguistic 'Large Text' definition?", a: "Standard protocols define large text as ≥ 18pt (24px) or ≥ 14pt (approx. 19px) for weighted/bold vectors. These magnitudes require lower contrast deltas for architectural legibility." }
    ];

    return (
        <ToolShell
            title="Luminance Contrast Architect"
            description="Professional validation engine for verifying chromatic combinations against Web Content Accessibility Guidelines (WCAG) architectural standards."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                {/* Visual Preview */}
                <div className="space-y-6">
                    <motion.div
                        className="h-[500px] rounded-[3.5rem] flex flex-col items-center justify-center p-12 relative overflow-hidden shadow-2xl transition-all duration-500 border border-slate-100"
                        style={{ backgroundColor: bg, color: fg }}
                    >
                        <div className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Canvas Simulation</div>
                        <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-center leading-none italic">Semantic <span className="opacity-50">Hierarchy</span></h2>
                        <p className="text-xl md:text-2xl font-medium max-w-lg text-center opacity-80 leading-relaxed">
                            Visual accessibility is not merely a feature; it is a core requirement of professional interface engineering and structural integrity.
                        </p>
                        <div className="mt-12 text-9xl font-black opacity-10 absolute -bottom-10 -right-10 pointer-events-none">
                            {ratio}
                        </div>
                    </motion.div>
                </div>

                {/* Controls & Results */}
                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Foreground Vector</label>
                            <div className="flex gap-4">
                                <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="h-14 w-14 rounded-2xl cursor-pointer bg-white border border-slate-200 p-1 hover:border-blue-500 transition-colors shadow-sm" />
                                <input type="text" value={fg} onChange={e => setFg(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 font-mono text-slate-900 text-sm focus:border-blue-500 transition-all uppercase font-bold shadow-sm" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Luminance Baseline</label>
                            <div className="flex gap-4">
                                <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="h-14 w-14 rounded-2xl cursor-pointer bg-white border border-slate-200 p-1 hover:border-blue-500 transition-colors shadow-sm" />
                                <input type="text" value={bg} onChange={e => setBg(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 font-mono text-slate-900 text-sm focus:border-blue-500 transition-all uppercase font-bold shadow-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 shadow-inner text-slate-900">
                        <div className="text-center mb-10">
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">Luminance Contrast Ratio</div>
                            <div className={`text-8xl font-black tracking-tighter ${ratio >= 7 ? 'text-emerald-500' : ratio >= 4.5 ? 'text-emerald-400' : ratio >= 3 ? 'text-amber-500' : 'text-rose-500'} drop-shadow-sm`}>
                                {ratio}<span className="text-3xl text-slate-300 ml-1 italic">:1</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ResultRow label="WCAG AA Compliance (Normal)" pass={level.aa} />
                            <ResultRow label="WCAG AA Compliance (Large)" pass={level.aaLarge} />
                            <ResultRow label="WCAG AAA Rigorous (Normal)" pass={level.aaa} />
                            <ResultRow label="WCAG AAA Rigorous (Large)" pass={level.aaaLarge} />
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
