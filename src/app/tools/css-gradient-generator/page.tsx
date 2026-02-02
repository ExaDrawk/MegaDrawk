'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Copy, Layers } from 'lucide-react';

export default function CssGradientPage() {
    const [color1, setColor1] = useState('#3b82f6');
    const [color2, setColor2] = useState('#0ea5e9');
    const [angle, setAngle] = useState(135);

    const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Define your <strong>Chromatic Vectors</strong> utilizing the high-fidelity color integration panels.</li>
            <li>Calibrate the <strong>Rotation Vector</strong> (Angle) to synchronize the spectral distribution (0° to 360°).</li>
            <li>The <strong>Spectral Simulation</strong> canvas executes real-time rendering of your configuration.</li>
            <li>Extract the <strong>Transcoded Baseline</strong> (CSS Code) for high-fidelity deployment in your visual architecture.</li>
        </ul>
    );

    const faq = [
        { q: "Architecture compatibility?", a: "The engine generates standardized `linear-gradient` syntax, fully compliant with modern browser rendering infrastructures including Chromium, WebKit, and Gecko." },
        { q: "High-density spectral layering?", a: "This optimization is tailored for high-performance dual-vector linear transitions, ensuring maximum rendering efficiency." },
    ];

    return (
        <ToolShell
            title="Chromatic Gradient Engine"
            description="Professional high-fidelity design engine for synthesizing complex linear CSS gradients for architectural web UI."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="max-w-4xl mx-auto space-y-16">
                {/* Preview Container */}
                <div className="relative group">
                    <div className="absolute -inset-10 bg-white/5 rounded-[4rem] blur-2xl opacity-50" />
                    <div
                        className="relative h-80 rounded-[3rem] shadow-2xl flex items-center justify-center overflow-hidden border-8 border-slate-900"
                        style={{ background: gradient }}
                    >
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-full text-white font-black text-xs uppercase tracking-[0.4em] shadow-2xl">
                            Spectral Simulation
                        </div>
                    </div>
                </div>

                {/* Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-900/10 p-12 rounded-[3.5rem] border border-slate-200 shadow-inner">
                    <div className="space-y-10">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Chromatic Vector 01</label>
                                <input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-full h-20 rounded-2xl bg-white border border-slate-200 p-2 cursor-pointer shadow-sm" />
                                <div className="text-center font-mono text-sm text-slate-500 uppercase font-bold">{color1}</div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Chromatic Vector 02</label>
                                <input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-full h-20 rounded-2xl bg-white border border-slate-200 p-2 cursor-pointer shadow-sm" />
                                <div className="text-center font-mono text-sm text-slate-500 uppercase font-bold">{color2}</div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-end mb-6 ml-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 font-black">Rotation Vector</span>
                                <span className="text-2xl font-black text-slate-900 italic">{angle}°</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="360"
                                value={angle}
                                onChange={(e) => setAngle(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-6 flex flex-col justify-end">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Transcoded Baseline</label>
                        <div className="relative group" title="Copy Synthesis">
                            <textarea
                                readOnly
                                value={`background: ${gradient};`}
                                className="w-full h-40 bg-white border border-slate-200 rounded-[2rem] p-8 font-mono text-sm text-blue-600 focus:outline-none resize-none shadow-sm"
                            />
                            <button
                                onClick={() => navigator.clipboard.writeText(`background: ${gradient};`)}
                                className="absolute bottom-4 right-4 p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-xl"
                            >
                                <Copy size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 flex items-center gap-2">
                        <Layers size={14} className="animate-pulse" />
                        Spectral Synthesis Active
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
