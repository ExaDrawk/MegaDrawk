'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolOptionGroup } from '@/components/tools/shared/ToolOptionGroup';
import { Copy, RefreshCw, Fingerprint } from 'lucide-react';
import { v4 as uuidv4, v1 as uuidv1 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

export default function UuidGeneratorPage() {
    const [uuids, setUuids] = useState<string[]>([]);
    const [count, setCount] = useState(5);
    const [version, setVersion] = useState<'v4' | 'v1'>('v4');

    const generate = () => {
        const results = [];
        for (let i = 0; i < count; i++) {
            results.push(version === 'v4' ? uuidv4() : uuidv1());
        }
        setUuids(results);
    };

    useEffect(() => {
        generate();
    }, [version]);

    const copyAll = () => {
        navigator.clipboard.writeText(uuids.join('\n'));
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Select <strong>Version 4 (V4)</strong> for cryptographically strong random-entropy identities.</li>
            <li>Select <strong>Version 1 (V1)</strong> for time-based chronological IDs utilizing hardware MAC synchronization.</li>
            <li>Calibrate the <strong>Batch Magnitude</strong> to allocate up to 50 unique identifiers per execution cycle.</li>
            <li>Directly extract individual results or execute a <strong>Full Batch Export</strong> for distributed scaffolding.</li>
            <li>Optimized for RFC 4122 compliance and high-performance system integration.</li>
        </ul>
    );

    const faq = [
        { q: "Architectural delta between v4 and v1?", a: "UUID v4 utilizes pure high-entropy randomness for non-deterministic identity assignment. UUID v1 is synthesized using precise timestamps and hardware MAC protocols, enabling temporal sorting within distributed architectures." },
        { q: "Collision probability metrics?", a: "Negligible. The 128-bit structural nature of these identifiers ensures that the probability of a collision event is effectively zero across all known real-world system magnitudes." },
    ];

    return (
        <ToolShell
            title="Universal Identity Architect"
            description="Professional high-fidelity generator for synthesizing RFC 4122 compliant Universally Unique Identifiers (UUID) for distributed system architectures."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                {/* Controls */}
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-end gap-12 shadow-sm">
                    <div className="flex-1 space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Standard Distribution</label>
                        <ToolOptionGroup
                            options={[
                                { id: 'v4', label: 'Version 4 (Random Entropy)' },
                                { id: 'v1', label: 'Version 1 (Temporal Baseline)' }
                            ]}
                            value={version}
                            onChange={(val) => setVersion(val as 'v4' | 'v1')}
                        />
                    </div>
                    <div className="w-full md:w-64 space-y-4">
                        <div className="flex justify-between items-end mr-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Batch Magnitude</label>
                            <span className="text-xl font-black text-slate-900 italic">{count}</span>
                        </div>
                        <input
                            type="range"
                            min="1" max="50"
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                </div>

                {/* Results List */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center ml-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <Fingerprint size={12} />
                            Synthesized Identifiers
                        </label>
                        <button onClick={copyAll} className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest flex items-center gap-1">Protocol Export (Full Batch) <RefreshCw size={12} className="rotate-90" /></button>
                    </div>

                    <div className="grid gap-3">
                        <AnimatePresence mode="popLayout">
                            {uuids.map((id, i) => (
                                <motion.div
                                    key={id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => navigator.clipboard.writeText(id)}
                                    className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-xl hover:border-blue-600/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-lg"
                                >
                                    <div className="font-mono text-sm md:text-lg text-slate-900 group-hover:text-blue-600 transition-colors tracking-wider">
                                        {id}
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Copy size={16} className="text-blue-600" />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={generate}
                        className="group relative flex items-center gap-4 px-16 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        Execute Identity Synthesis
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}
