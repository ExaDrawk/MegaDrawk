'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ArrowLeftRight, Copy, Trash2 } from 'lucide-react';

export default function Base64ToolPage() {
    const [mode, setMode] = useState<'ENCODE' | 'DECODE'>('ENCODE');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const process = (val: string, currentMode: 'ENCODE' | 'DECODE') => {
        setInput(val);
        setError('');
        if (!val) {
            setOutput('');
            return;
        }

        try {
            if (currentMode === 'ENCODE') {
                setOutput(btoa(val));
            } else {
                try {
                    setOutput(atob(val));
                } catch (e) {
                    setError('Invalid Base64 string');
                    setOutput('');
                }
            }
        } catch (e) {
            setError('Conversion failed');
        }
    };

    const toggleMode = () => {
        const newMode = mode === 'ENCODE' ? 'DECODE' : 'ENCODE';
        setMode(newMode);
        // Swap content if valid
        if (!error && output) {
            process(output, newMode);
        } else {
            process('', newMode);
        }
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-2">
            <li>Select <strong>Encode</strong> to convert plain text to Base64.</li>
            <li>Select <strong>Decode</strong> to convert Base64 strings back to text.</li>
            <li>Type in the left box, and the result appears instantly on the right.</li>
        </ul>
    );

    return (
        <ToolShell
            title="Base64 Converter"
            description="Encode text to Base64 or decode Base64 strings instantly with error checking."
            howToUse={howToUse}
        >
            <div className="flex flex-col gap-6">

                {/* Mode Switcher */}
                <div className="flex justify-center mb-6">
                    <div className="bg-slate-900 p-1 rounded-xl flex gap-1 border border-slate-800">
                        {['ENCODE', 'DECODE'].map((m) => (
                            <button
                                key={m}
                                onClick={() => {
                                    setMode(m as any);
                                    process(input, m as any);
                                }}
                                className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${mode === m ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                {m === 'ENCODE' ? 'Text → Base64' : 'Base64 → Text'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-400 ml-2">Input</label>
                        <textarea
                            value={input}
                            onChange={(e) => process(e.target.value, mode)}
                            className="w-full h-64 bg-[#0b1121] border border-slate-800 rounded-xl p-4 font-mono text-sm focus:border-cyan-500 transition-all resize-none"
                            placeholder={mode === 'ENCODE' ? "Type plain text here..." : "Paste Base64 string here..."}
                        />
                    </div>

                    {/* Output */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-400 ml-2 flex justify-between">
                            <span>Output</span>
                            {error && <span className="text-red-400">{error}</span>}
                        </label>
                        <div className="relative">
                            <textarea
                                readOnly
                                value={output}
                                className={`w-full h-64 bg-slate-900/50 border rounded-xl p-4 font-mono text-sm resize-none focus:outline-none ${error ? 'border-red-500/50 text-red-300' : 'border-slate-800 text-cyan-300'}`}
                                placeholder="Result will appear here..."
                            />
                            {output && (
                                <button
                                    onClick={() => navigator.clipboard.writeText(output)}
                                    className="absolute bottom-4 right-4 p-2 bg-slate-800 hover:bg-white hover:text-black rounded-lg text-slate-400 transition-all shadow-lg"
                                >
                                    <Copy size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
