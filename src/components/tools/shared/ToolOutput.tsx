import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ToolOutputProps {
    value: string;
    placeholder?: string;
    label?: string;
    error?: string;
    className?: string;
    heightClass?: string;
}

export const ToolOutput: React.FC<ToolOutputProps> = ({
    value,
    placeholder = "Result will appear here...",
    label = "Output",
    error,
    className = "",
    heightClass = "h-80"
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex justify-between items-center ml-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    {label}
                    {error && <span className="text-rose-600 animate-pulse bg-rose-50 px-2 py-0.5 rounded-full">{error}</span>}
                </label>
                {value && (
                    <button
                        onClick={handleCopy}
                        className={`text-[10px] font-black transition-all uppercase tracking-widest flex items-center gap-1 ${copied ? 'text-emerald-500' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                        {copied ? 'Copied!' : 'Copy'}
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                )}
            </div>
            <div className="relative">
                <textarea
                    readOnly
                    value={value}
                    className={`w-full ${heightClass} border rounded-[2rem] p-8 font-mono text-sm transition-all resize-none focus:outline-none ${error
                            ? 'bg-rose-50 border-rose-100 text-rose-600'
                            : 'bg-slate-50 border-slate-100 text-blue-600 shadow-inner'
                        }`}
                    placeholder={placeholder}
                    spellCheck={false}
                />
            </div>
        </div>
    );
};
