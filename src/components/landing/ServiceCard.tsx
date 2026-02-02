
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Service } from '@/config/site';

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] } }
};

interface ServiceCardProps {
    service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    return (
        <motion.a
            href={service.url}
            target="_blank"
            variants={item}
            className="group relative p-12 bg-slate-50 border border-slate-200 rounded-[3rem] overflow-hidden hover:border-blue-500/30 transition-all hover:bg-white hover:shadow-2xl"
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={service.iconUrl} alt={service.name} className="w-16 h-16 rounded-2xl" />
                    <ArrowUpRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{service.name}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-8">{service.description}</p>
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{service.subdomain}</div>
            </div>
        </motion.a>
    );
};
