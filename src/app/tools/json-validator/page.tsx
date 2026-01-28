'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Copy, Trash2, CheckCircle, AlertTriangle, FileJson } from 'lucide-react';

export default function JsonValidatorPage() {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'VALID' | 'ERROR'>('IDLE');
    const [errorMsg, setErrorMsg] = useState('');
    const [stats, setStats] = useState({ size: '0 B', uniqueKeys: 0 });

    const validateAndFormat = () => {
        if (!input.trim()) {
            setStatus('IDLE');
            return;
        }
        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 4);
            setInput(formatted);
            setStatus('VALID');
            setErrorMsg('');

            // Calc stats
            const bytes = new Blob([formatted]).size;
            setStats({
                size: bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`,
                uniqueKeys: Object.keys(parsed).length // Root keys only for simplicity
            });
        } catch (e: any) {
            setStatus('ERROR');
            setErrorMsg(e.message);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(input);
    };

    const clear = () => {
        setInput('');
        setStatus('IDLE');
        setErrorMsg('');
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-2">
            <li>Paste your raw JSON string into the large text area.</li>
            <li>Click the <strong className="text-cyan-400">Validate & Beautify</strong> button to process the data.</li>
            <li>If valid, the JSON will be formatted with 4-space indentation and syntax colors.</li>
            <li>If invalid, an error message will pinpoint the location of the syntax error.</li>
            <li>Use the "Copy" icon to grab the cleaned result.</li>
        </ul>
    );

    const faq = [
        { q: "Is my JSON data sent to a server?", a: "No. All validation and formatting happens entirely within your browser using JavaScript. Your data never leaves your device." },
        { q: "Why use this instead of an IDE?", a: "This tool is optimized for quick checks, providing instant visual feedback and metadata (size, keys) without needing to configure a heavy development environment." },
    ];

    return (
        <ToolShell
            title="JSON Validator & Beautifier"
            description="Transform messy JSON strings into readable, structured data with strict syntax validation."
            howToUse={howToUse}
            faq={faq}
        >
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 text-sm">
                    <span className={`px-3 py-1 rounded-full border ${status === 'VALID' ? 'bg-green-500/10 border-green-500/50 text-green-400' : status === 'ERROR' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                        {status === 'IDLE' ? 'Waiting for Input' : status === 'VALID' ? 'Valid JSON' : 'Syntax Error'}
                    </span>
                    {status === 'VALID' && <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">Size: {stats.size}</span>}
                </div>
                <div className="flex gap-2">
                    <button onClick={clear} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Clear">
                        <Trash2 size={18} />
                    </button>
                    <button onClick={copyToClipboard} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Copy">
                        <Copy size={18} />
                    </button>
                </div>
            </div>

            {/* Editor */}
            <div className="relative">
                <textarea
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        if (status !== 'IDLE') setStatus('IDLE');
                    }}
                    placeholder='{"example": "paste your json here..."}'
                    className={`w-full h-[500px] bg-[#0b1121] border-2 rounded-xl p-6 font-mono text-sm leading-relaxed resize-y focus:outline-none focus:ring-4 transition-all
                        ${status === 'ERROR' ? 'border-red-500/50 focus:ring-red-500/20' : status === 'VALID' ? 'border-green-500/50 focus:ring-green-500/20' : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20 text-slate-300'}
                    `}
                    spellCheck="false"
                />
                {status === 'ERROR' && (
                    <div className="absolute bottom-4 left-4 right-4 bg-red-950/90 border border-red-500/50 text-red-200 p-4 rounded-xl backdrop-blur-md flex items-start gap-3 animate-in slide-in-from-bottom-2">
                        <AlertTriangle className="shrink-0 text-red-400" />
                        <div className="font-mono text-xs">{errorMsg}</div>
                    </div>
                )}
            </div>

            {/* Main Action */}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={validateAndFormat}
                    className="flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <FileJson size={20} />
                    Validate & Beautify
                </button>
            </div>

        </ToolShell>
    );
}
