'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Calendar, RefreshCw, Hash } from 'lucide-react';

export default function TimestampConverterPage() {
    const [unix, setUnix] = useState<string>(Math.floor(Date.now() / 1000).toString());
    const [dateStr, setDateStr] = useState<string>(new Date().toLocaleString());

    const updateFromUnix = (val: string) => {
        setUnix(val);
        const n = parseInt(val);
        if (isNaN(n)) {
            setDateStr('Invalid Temporal Signature');
            return;
        }
        const isMs = val.length > 11;
        const d = new Date(isMs ? n : n * 1000);
        setDateStr(d.toString() !== 'Invalid Date' ? d.toLocaleString('en-US') : 'Invalid Protocol State');
    };

    const updateFromDate = (val: string) => {
        setDateStr(val);
        const d = new Date(val);
        if (d.toString() === 'Invalid Date') {
            setUnix('Vector Corruption');
            return;
        }
        setUnix(Math.floor(d.getTime() / 1000).toString());
    };

    const setToNow = () => {
        const now = Date.now();
        updateFromUnix(Math.floor(now / 1000).toString());
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Inject an <strong>Epoch Vector</strong> (seconds since 1970-01-01) for high-fidelity deconstruction into human-readable chronologies.</li>
            <li>The engine automatically senses <strong>Second-level</strong> (10-bit) and <strong>Millisecond-level</strong> (13-bit) distributions.</li>
            <li>Execute inverse transformation by modifying the <strong>Chronological Baseline</strong> string.</li>
            <li>Initialize the <strong>Synchronization Protocol</strong> to align with the active system temporal state.</li>
        </ul>
    );

    const faq = [
        { q: "Environmental offset handling?", a: "The architecture utilizes the client-side locale and timezone distributions for baseline rendering." },
        { q: "Temporal resolution limits?", a: "The engine supports both 32-bit and 64-bit Epoch resolution, ensuring architectural resilience beyond the 2038 threshold." },
    ];

    return (
        <ToolShell
            title="Temporal Synchronization Engine"
            description="Professional bi-directional transformation between Unix Epoch vectors and standardized chronological architectures."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex justify-center">
                    <button
                        onClick={setToNow}
                        className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-black hover:text-white transition-all shadow-sm hover:shadow-xl"
                    >
                        <RefreshCw size={16} />
                        Execute Synchronization Protocol
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Unix */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-6 flex items-center gap-2">
                            <Hash size={12} />
                            Epoch Vector (sec)
                        </label>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-blue-500/10 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <input
                                type="text"
                                value={unix}
                                onChange={(e) => updateFromUnix(e.target.value)}
                                className="relative w-full bg-white border border-slate-200 rounded-[2rem] p-10 text-4xl font-black text-slate-900 text-center focus:outline-none focus:border-blue-500 shadow-sm transition-all italic"
                            />
                        </div>
                    </div>

                    {/* Human Date */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-6 flex items-center gap-2">
                            <Calendar size={12} />
                            Chronological Baseline
                        </label>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-emerald-500/10 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <input
                                type="text"
                                value={dateStr}
                                onChange={(e) => updateFromDate(e.target.value)}
                                className="relative w-full h-auto bg-white border border-slate-200 rounded-[2rem] p-10 text-2xl font-black text-emerald-600 text-center focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Common Ref */}
                <div className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6 text-center">Standard ISO Reference</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-medium">
                        <div className="flex flex-col gap-1 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ISO 8601 Vector</span>
                            <span className="text-slate-700 font-mono text-xs break-all">{isNaN(parseInt(unix)) ? '---' : new Date(parseInt(unix) * (unix.length > 11 ? 1 : 1000)).toISOString()}</span>
                        </div>
                        <div className="flex flex-col gap-1 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">UTC Reference</span>
                            <span className="text-slate-700 font-mono text-xs break-all">{isNaN(parseInt(unix)) ? '---' : new Date(parseInt(unix) * (unix.length > 11 ? 1 : 1000)).toUTCString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
