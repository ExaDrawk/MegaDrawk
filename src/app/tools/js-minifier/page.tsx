'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolInput } from '@/components/tools/shared/ToolInput';
import { ToolOutput } from '@/components/tools/shared/ToolOutput';
import { Zap } from 'lucide-react';

export default function JsMinifierPage() {
    const [input, setInput] = useState('function helloWorld() {\n    // This is a comment\n    const name = "MegaDrawk";\n    console.log("Hello, " + name);\n}');
    const [output, setOutput] = useState('');
    const [stats, setStats] = useState({ saved: '0%' });

    const minify = () => {
        if (!input.trim()) return;

        let res = input
            .replace(/\/\/.*$/gm, '') // single line comments
            .replace(/\/\*[\s\S]*?\*\//g, '') // multi-line comments
            .replace(/\s+/g, ' ') // collapse whitespace
            .replace(/\s*([{};,])\s*/g, '$1') // remove space around separators
            .trim();

        const originalSize = new Blob([input]).size;
        const minifiedSize = new Blob([res]).size;
        const saved = originalSize > 0 ? ((1 - minifiedSize / originalSize) * 100).toFixed(1) : 0;

        setOutput(res);
        setStats({ saved: `${saved}%` });
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Inject your <strong>Semantic JavaScript Payload</strong> into the source integration zone.</li>
            <li>Execute the <strong>Compression Engine</strong> to strip technical debt, redundant comments, and structural whitespace.</li>
            <li>The <strong>Compacted Result</strong> is optimized for high-performance resource delivery and production-ready scaffolding.</li>
            <li>Utilize the footprint optimization metrics to verify architectural efficiency.</li>
        </ul>
    );

    const faq = [
        { q: "Logic obfuscation protocol?", a: "Negative. This is a structural minifier. It optimizes the footprint through character reduction without altering variable naming or semantic logic." },
        { q: "High-fidelity safety standards?", a: "Standard ECMAScript distributions are fully supported. We recommend verifying code that relies on implicit semicolons before production deployment." },
    ];

    return (
        <ToolShell
            title="JavaScript Payload Architect"
            description="Professional footprint optimization engine for reducing JavaScript asset weight through technical debt elimination."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ToolInput
                        value={input}
                        onChange={setInput}
                        label="Payload Source"
                        placeholder="Inject source code payload..."
                        heightClass="h-96"
                        onClear={() => { setInput(''); setOutput(''); }}
                    />
                    <div className="space-y-4">
                        <ToolOutput
                            value={output}
                            label="Compacted Result"
                            placeholder="Optimized result distribution..."
                            heightClass="h-96"
                        />
                        {output && (
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 mx-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compaction Metrics</span>
                                <span className="text-sm font-black text-emerald-600 italic">Saved ~{stats.saved} Footprint</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={minify}
                        className="group relative flex items-center gap-4 px-16 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <Zap size={20} className="group-hover:scale-125 transition-transform" />
                        Execute Compression Pulse
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}
