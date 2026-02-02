
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ToolCardProps {
    name: string;
    icon: LucideIcon;
    path: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ name, icon: Icon, path }) => {
    return (
        <Link href={path}>
            <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-10 bg-slate-50 border border-slate-200 rounded-[2.5rem] flex flex-col items-center text-center gap-6 hover:border-blue-500 transition-all shadow-xl group"
            >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-blue-600 transition-colors shadow-md">
                    <Icon size={24} />
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 transition-colors">
                    {name}
                </div>
            </motion.div>
        </Link>
    );
};
