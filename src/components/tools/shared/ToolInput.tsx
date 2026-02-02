import React from 'react';
import { Trash2 } from 'lucide-react';

interface ToolInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    onClear?: () => void;
    error?: string;
    className?: string;
    heightClass?: string;
}

export const ToolInput: React.FC<ToolInputProps> = ({
    value,
    onChange,
    placeholder = "Input text here...",
    label = "Input",
    onClear,
    error,
    className = "",
    heightClass = "h-80"
}) => {
    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex justify-between items-center ml-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {label}
                    {error && <span className="ml-2 text-rose-500 animate-pulse">{error}</span>}
                </label>
                {onClear && (
                    <button
                        onClick={onClear}
                        className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest flex items-center gap-1"
                    >
                        Reset <Trash2 size={10} />
                    </button>
                )}
            </div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full ${heightClass} bg-white border border-slate-200 rounded-[2rem] p-8 font-mono text-sm text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm transition-all resize-none placeholder:text-slate-300 ${error ? 'border-rose-300 focus:border-rose-500 bg-rose-50/10' : ''}`}
                placeholder={placeholder}
                spellCheck={false}
            />
        </div>
    );
};
