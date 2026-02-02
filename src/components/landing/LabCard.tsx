
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Service } from '@/config/site';

interface LabCardProps {
    service: Service;
    color: 'blue' | 'cyan' | 'emerald';
}

const COLOR_MAP = {
    blue: {
        gradientFrom: 'from-blue-500/20',
        hoverBtn: 'group-hover:bg-blue-600',
    },
    cyan: {
        gradientFrom: 'from-cyan-500/20',
        hoverBtn: 'group-hover:bg-cyan-600',
    },
    emerald: {
        gradientFrom: 'from-emerald-500/20',
        hoverBtn: 'group-hover:bg-emerald-600',
    },
};

export const LabCard: React.FC<LabCardProps> = ({ service, color }) => {
    const config = COLOR_MAP[color];

    return (
        <Link href={service.url}>
            <motion.div
                whileHover={{ y: -10 }}
                className="group relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl p-12 flex flex-col justify-end bg-white"
            >
                <div className={`absolute inset-0 bg-gradient-to-b ${config.gradientFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-1000 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={service.iconUrl} alt="" className="w-64 h-64 blur-xl" />
                </div>

                <div className="relative z-10 bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col h-full hover:shadow-xl transition-all">
                    <div className="mb-8">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={service.iconUrl} alt={service.name} className="w-12 h-12 rounded-xl" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3">{service.name}</h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-8 flex-1">{service.description}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Simulation</span>
                        <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 ${config.hoverBtn} group-hover:text-white transition-all`}>
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};
