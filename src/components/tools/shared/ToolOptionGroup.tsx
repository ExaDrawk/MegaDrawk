import React from 'react';

interface Option {
    id: string;
    label: string;
}

interface ToolOptionGroupProps {
    options: Option[];
    value: string;
    onChange: (id: string) => void;
    className?: string;
}

export const ToolOptionGroup: React.FC<ToolOptionGroupProps> = ({
    options,
    value,
    onChange,
    className = ""
}) => {
    return (
        <div className={`flex justify-center ${className}`}>
            <div className="bg-slate-50 p-2 rounded-2xl flex flex-wrap gap-2 border border-slate-100 justify-center shadow-inner">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onChange(opt.id)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${value === opt.id
                                ? 'bg-white text-slate-900 shadow-lg border border-slate-100 scale-105'
                                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
};
