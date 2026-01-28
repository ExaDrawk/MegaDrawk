'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Check, X } from 'lucide-react';

export default function ContrastCheckerPage() {
    const [bg, setBg] = useState('#ffffff');
    const [fg, setFg] = useState('#000000');
    const [ratio, setRatio] = useState(21);
    const [level, setLevel] = useState({ aa: true, aaLarge: true, aaa: true, aaaLarge: true });

    // Calculates luminance
    const lum = (hex: string) => {
        const rgb = parseInt(hex.slice(1), 16);
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
        if (!/^#[0-9A-F]{6}$/i.test(bg) || !/^#[0-9A-F]{6}$/i.test(fg)) return;

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
        <div className={`p-4 rounded-xl border flex items-center justify-between ${pass ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
            <span className={`font-bold ${pass ? 'text-green-400' : 'text-red-400'}`}>{label}</span>
            {pass ? <div className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold">PASS</div> : <div className="bg-red-500 text-white px-3 py-1 rounded text-xs font-bold">FAIL</div>}
        </div>
    );

    return (
        <ToolShell
            title="Contrast Ratio Checker"
            description="Ensure your color combinations meet WCAG accessibility standards for readability."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Preview Area */}
                <div
                    className="h-96 rounded-3xl flex flex-col items-center justify-center p-8 ease-in-out transition-colors duration-300 shadow-2xl relative overflow-hidden"
                    style={{ backgroundColor: bg, color: fg }}
                >
                    <h2 className="text-4xl font-black mb-4">Hello World</h2>
                    <p className="text-lg max-w-sm text-center opacity-90">
                        This is how your text looks on the background. Good contrast is essential for accessibility.
                    </p>

                    <div className="mt-8 text-6xl font-black opacity-20 absolute -bottom-10 -right-10 pointer-events-none">
                        {ratio}:1
                    </div>
                </div>

                {/* Controls & Results */}
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">Text Color</label>
                            <div className="flex gap-2">
                                <input type="color" value={fg} onChange={e => setFg(e.target.value)} className="h-12 w-12 rounded-lg cursor-pointer bg-transparent border-none" />
                                <input type="text" value={fg} onChange={e => setFg(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 text-white uppercase" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-400">Background</label>
                            <div className="flex gap-2">
                                <input type="color" value={bg} onChange={e => setBg(e.target.value)} className="h-12 w-12 rounded-lg cursor-pointer bg-transparent border-none" />
                                <input type="text" value={bg} onChange={e => setBg(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 text-white uppercase" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-2xl border-2 border-slate-800">
                        <div className="text-center mb-6">
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Contrast Ratio</div>
                            <div className={`text-6xl font-black ${ratio >= 7 ? 'text-green-400' : ratio >= 4.5 ? 'text-green-400' : ratio >= 3 ? 'text-yellow-400' : 'text-red-500'}`}>
                                {ratio}:1
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <ResultRow label="WCAG AA (Normal Text)" pass={level.aa} />
                            <ResultRow label="WCAG AA (Large Text)" pass={level.aaLarge} />
                            <ResultRow label="WCAG AAA (Normal Text)" pass={level.aaa} />
                            <ResultRow label="WCAG AAA (Large Text)" pass={level.aaaLarge} />
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
