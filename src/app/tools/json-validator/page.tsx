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
            <li>Paste your dirty JSON string into the Input area.</li>
            <li>Click "<strong>Validate & Format</strong>" to check syntax and prettify.</li>
            <li>Errors will be highlighted if the JSON is invalid.</li>
            <li>Use the Copy button to grab the clean JSON.</li>
        </ul>
    );

    const faq = [
        { q: "Is my data safe?", a: "Yes. All processing is done locally in your browser via JavaScript. No data leaves your device." },
        { q: "Does it support comments?", a: "No. Standard JSON does not support comments. This tool enforces strict JSON standards." },
    ];

    return (
        <ToolShell
            title="JSON Validator"
            description="Validate, format, and fix your JSON data instantly. Parse, prettify, and debug syntax errors."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="flex flex-col gap-12">
                <div className="flex justify-end gap-4 min-h-[40px]">
                    {stats && (
                        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
                            <span className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle size={12} /> Valid JSON
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                Size: {stats.size}
                            </span>
                            <span className="px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                                Keys: {stats.uniqueKeys}
                            </span>
                        </div>
                    )}
                    {error && (
                        <span className="px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-pulse">
                            <AlertTriangle size={12} /> Syntax Error
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ToolInput
                        value={input}
                        onChange={setInput}
                        placeholder='{"status": "Paste JSON here..."}'
                        label="Input JSON"
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
                        label={error ? "Error Details" : "Formatted JSON"}
                        heightClass="h-[600px]"
                        placeholder="Waiting for validation..."
                        className={error ? "opacity-100" : ""}
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={validateAndFormat}
                        className="group relative flex items-center gap-3 px-16 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <FileJson size={18} className="group-hover:rotate-12 transition-transform" />
                        Validate & Format
                        <Zap size={14} className="ml-1 opacity-50 animate-pulse" />
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}

