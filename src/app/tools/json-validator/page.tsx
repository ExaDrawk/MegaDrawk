'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolInput } from '@/components/tools/shared/ToolInput';
import { ToolOutput } from '@/components/tools/shared/ToolOutput';
import { FileJson, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

export default function JsonValidatorPage() {
    const [input, setInput] = useState('');
    const [formatted, setFormatted] = useState('');
    const [error, setError] = useState('');
    const [stats, setStats] = useState<{ size: string; uniqueKeys: number } | null>(null);

    const validateAndFormat = () => {
        if (!input.trim()) {
            setFormatted('');
            setStats(null);
            return;
        }
        try {
            const parsed = JSON.parse(input);
            const result = JSON.stringify(parsed, null, 4);
            setFormatted(result);
            setError('');

            const bytes = new Blob([result]).size;
            setStats({
                size: bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`,
                uniqueKeys: Object.keys(parsed).length
            });
        } catch (e: any) {
            setError(e.message);
            setFormatted('');
            setStats(null);
        }
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Paste your raw JSON payload into the <strong>Payload Integration</strong> panel.</li>
            <li>Execute <strong>Structural Validation</strong> to identify syntax deviations and prettify the schema.</li>
            <li>Operational errors are highlighted with diagnostic reports for rapid debugging.</li>
            <li>Export the sanitized output using the high-level copy protocol.</li>
        </ul>
    );

    const faq = [
        { q: "Is the data integrity maintained locally?", a: "Yes. All semantic analysis and formatting occur within the client-side sandbox. No data leaves the local execution environment." },
        { q: "Standard compliance?", a: "The engine enforces strict RFC 8259 standards. Comments and trailing commas are flagged as structural violations." },
    ];

    return (
        <ToolShell
            title="Structural JSON Validator"
            description="High-fidelity debugging and formatting engine for ensuring absolute integrity in JSON data structures."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="flex flex-col gap-12">
                <div className="flex justify-end gap-4 min-h-[40px]">
                    {stats && (
                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                            <span className="px-5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle size={12} /> Data Verified
                            </span>
                            <span className="px-5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                Payload: {stats.size}
                            </span>
                            <span className="px-5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                                Root Nodes: {stats.uniqueKeys}
                            </span>
                        </div>
                    )}
                    {error && (
                        <span className="px-5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                            <AlertTriangle size={12} /> Semantic Error
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ToolInput
                        value={input}
                        onChange={setInput}
                        placeholder='{"integrity": "Paste JSON payload..."}'
                        label="Payload Integration"
                        heightClass="h-[600px]"
                        onClear={() => {
                            setInput('');
                            setFormatted('');
                            setError('');
                            setStats(null);
                        }}
                    />

                    <ToolOutput
                        value={formatted}
                        error={error}
                        label={error ? "Diagnostic Report" : "Format Output"}
                        heightClass="h-[600px]"
                        placeholder="Awaiting data injection..."
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={validateAndFormat}
                        className="group relative flex items-center gap-3 px-16 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <FileJson size={18} className="group-hover:rotate-12 transition-transform" />
                        Execute Validation Engine
                        <Zap size={14} className="ml-1 opacity-50 animate-pulse" />
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}

