
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ValueCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    color: 'blue' | 'sky' | 'cyan';
}

const COLOR_MAP = {
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-600' },
    sky: { bg: 'bg-sky-500/20', text: 'text-sky-600' },
    cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-600' },
};

export const ValueCard: React.FC<ValueCardProps> = ({ icon: Icon, title, description, color }) => {
    const theme = COLOR_MAP[color];
    return (
        <div className="space-y-6">
            <div className={`w-12 h-12 ${theme.bg} rounded-xl flex items-center justify-center ${theme.text}`}>
                <Icon size={24} />
            </div>
            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">{title}</h4>
            <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
        </div>
    );
};
