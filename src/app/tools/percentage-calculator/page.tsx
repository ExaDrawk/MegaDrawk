'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Percent, Zap } from 'lucide-react';

export default function PercentageCalculatorPage() {
    const [q1, setQ1] = useState({ a: '20', b: '100', res: '20' });
    const [q2, setQ2] = useState({ a: '50', b: '200', res: '25' });

    const calc1 = (a: string, b: string) => {
        setQ1({ a, b, res: ((Number(a) / 100) * Number(b)).toFixed(2).replace(/\.?0+$/, '') });
    };

    const calc2 = (a: string, b: string) => {
        setQ2({ a, b, res: ((Number(a) / Number(b)) * 100).toFixed(2).replace(/\.?0+$/, '') });
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li><strong>Value Extraction</strong>: Derive a specific magnitude from a basis total (e.g., "Determine 20% of 100 units").</li>
            <li><strong>Ratio Derivation</strong>: Calculate the percentual representation of a minor vector within a major total (e.g., "50 units out of 200").</li>
            <li>Inputs execute real-time recalibration for mission-critical financial and statistical modeling.</li>
            <li>Precision engine compliant with standard DPD (Decimal Point Distribution) requirements.</li>
        </ul>
    );

    const faq = [
        { q: "Sector-specific applications?", a: "Engineered for high-throughput discount modeling, tax nexus assessments, and performance delta analysis." },
        { q: "Floating-point precision?", a: "The architecture maintains resolution up to 2 decimal places with automated zero-truncation for optimal data clarity." },
    ];

    return (
        <ToolShell
            title="Analytical Dimension Engine"
            description="High-precision arithmetic engines for complex magnitude extraction and ratio derivation in professional workflows."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Type 1 */}
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 space-y-8 shadow-sm">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 flex items-center gap-2">
                        <Zap size={12} className="text-amber-500" />
                        Value Extraction Logic
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-2xl md:text-3xl font-black text-slate-900 italic">
                        <span className="text-slate-300 not-italic">Derive</span>
                        <input type="number" value={q1.a} onChange={e => calc1(e.target.value, q1.b)} className="w-24 bg-white border border-slate-200 rounded-2xl p-4 text-center text-blue-600 focus:border-blue-500 focus:outline-none shadow-sm" />
                        <span className="text-slate-300 not-italic">% of</span>
                        <input type="number" value={q1.b} onChange={e => calc1(q1.a, e.target.value)} className="w-40 bg-white border border-slate-200 rounded-2xl p-4 text-center text-blue-600 focus:border-blue-500 focus:outline-none shadow-sm" />
                        <span className="text-slate-300 not-italic">total</span>
                        <div className="flex-1 bg-blue-600 text-white rounded-2xl p-6 text-center shadow-xl">
                            {q1.res}
                        </div>
                    </div>
                </div>

                {/* Type 2 */}
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 space-y-8 shadow-sm">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4 flex items-center gap-2">
                        <Percent size={12} className="text-emerald-500" />
                        Ratio Derivation Engine
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-2xl md:text-3xl font-black text-slate-900 italic">
                        <input type="number" value={q2.a} onChange={e => calc2(e.target.value, q2.b)} className="w-40 bg-white border border-slate-200 rounded-2xl p-4 text-center text-emerald-600 focus:border-emerald-500 focus:outline-none shadow-sm" />
                        <span className="text-slate-300 not-italic">within</span>
                        <input type="number" value={q2.b} onChange={e => calc2(q2.a, e.target.value)} className="w-40 bg-white border border-slate-200 rounded-2xl p-4 text-center text-emerald-600 focus:border-emerald-500 focus:outline-none shadow-sm" />
                        <span className="text-slate-300 not-italic">is</span>
                        <div className="flex-1 bg-emerald-600 text-white rounded-2xl p-6 text-center shadow-xl flex items-center justify-center gap-2">
                            {q2.res} <span className="text-xl">%</span>
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
