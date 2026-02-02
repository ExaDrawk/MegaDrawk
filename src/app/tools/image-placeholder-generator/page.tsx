'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolOptionGroup } from '@/components/tools/shared/ToolOptionGroup';
import { Copy } from 'lucide-react';

export default function ImagePlaceholderPage() {
    const [w, setW] = useState(800);
    const [h, setH] = useState(600);
    const [text, setText] = useState('800x600');
    const [theme, setTheme] = useState<'DARK' | 'LIGHT'>('DARK');

    const bgColor = theme === 'DARK' ? '020617' : 'f1f5f9';
    const textColor = theme === 'DARK' ? '94a3b8' : '475569';
    const url = `https://placehold.co/${w}x${h}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Define the <strong>Geometric Calibration</strong> (Width/Height) in pixel-level resolution.</li>
            <li>Inject a <strong>Semantic Label</strong> to be centrally distributed within the visual proxy.</li>
            <li>Select the <strong>Core Aesthetic</strong> vector (Dark vs Light) for UI synchronization.</li>
            <li>Extract the <strong>Vector URL</strong> for immediate integration into design prototypes or development environments.</li>
            <li>Optimized for high-fidelity UI/UX mockups and rapid visual scaffolding.</li>
        </ul>
    );

    const faq = [
        { q: "Infrastructure source?", a: "Proxies are synthesized in real-time via the placehold.co REST API. These assets are accessible as remote distributions for high-fidelity mocking." },
        { q: "Commercial deployment compliance?", a: "Affirmative. These assets are distributed under open-protocol standards, suitable for development, staging, and commercial mockup environments." },
    ];

    return (
        <ToolShell
            title="Visual Proxy Synthesizer"
            description="Professional high-fidelity engine for generating customized visual layout proxies for architectural design and UI deconstruction."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="max-w-5xl mx-auto space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Controls */}
                    <div className="space-y-10 bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 shadow-inner">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Magnitude X (px)</label>
                                <input type="number" value={w} onChange={e => setW(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-2xl font-black text-slate-900 focus:border-blue-500 focus:outline-none shadow-sm" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Magnitude Y (px)</label>
                                <input type="number" value={h} onChange={e => setH(Number(e.target.value))} className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-2xl font-black text-slate-900 focus:border-blue-500 focus:outline-none shadow-sm" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Semantic Label</label>
                            <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-xl font-medium text-blue-600 focus:border-blue-500 focus:outline-none shadow-sm" placeholder="Inject label payload..." />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Core Aesthetic</label>
                            <ToolOptionGroup
                                options={[
                                    { id: 'DARK', label: 'Dark Vector' },
                                    { id: 'LIGHT', label: 'Light Vector' }
                                ]}
                                value={theme}
                                onChange={(val) => setTheme(val as 'DARK' | 'LIGHT')}
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="flex flex-col gap-8 items-center justify-center">
                        <div className="relative group max-w-full overflow-hidden">
                            <div className="absolute -inset-4 bg-blue-500/10 rounded-[2.5rem] blur-2xl opacity-50" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt="Proxy Preview" className="relative rounded-[2rem] border-8 border-white shadow-2xl max-w-full h-auto object-contain" />
                        </div>

                        <div className="w-full max-w-md space-y-4">
                            <div className="flex justify-between items-center ml-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Vector Distribution URL</label>
                                <button onClick={() => navigator.clipboard.writeText(url)} className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 uppercase tracking-widest"><Copy size={12} /> EXTRACT URL</button>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl font-mono text-[10px] text-slate-400 break-all select-all shadow-inner leading-relaxed">
                                {url}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
