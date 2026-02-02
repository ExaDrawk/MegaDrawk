'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolInput } from '@/components/tools/shared/ToolInput';
import { Type, Clock, AlignLeft, Hash } from 'lucide-react';

export default function WordCounterPage() {
    const [text, setText] = useState('');
    const [stats, setStats] = useState({
        words: 0,
        chars: 0,
        charsNoSpace: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0
    });

    useEffect(() => {
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, '').length;
        const sentences = text.trim() === '' ? 0 : text.split(/[.!?。！？]+/).filter(Boolean).length;
        const paragraphs = text.trim() === '' ? 0 : text.replace(/\n$/gm, '').split(/\n/).filter(Boolean).length;
        const readingTime = Math.ceil(chars / 500);

        setStats({ words, chars, charsNoSpace, sentences, paragraphs, readingTime });
    }, [text]);

    const StatCard = ({ icon: Icon, label, value, color, bg }: any) => (
        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-200 transition-all relative overflow-hidden shadow-sm hover:shadow-xl">
            <div className={`absolute inset-0 bg-gradient-to-b ${bg} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            <div className="relative z-10">
                <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{label}</div>
                <div className={`text-4xl font-black tracking-tight ${color}`}>{value}</div>
            </div>
            <div className={`p-5 rounded-2xl ${bg} group-hover:scale-110 transition-transform relative z-10 shadow-sm`}>
                <Icon size={32} className={color} />
            </div>
        </div>
    );

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Inject your semantic payload into the <strong>Payload Integration</strong> panel for real-time deconstruction.</li>
            <li>Operational metrics (Word Density, Temporal Estimates) update automatically during the data injection phase.</li>
            <li>Utilize the structural report to optimize content magnitude and linguistic complexity.</li>
        </ul>
    );

    const faq = [
        { q: "Is the analysis compliant with multi-byte character sets?", a: "Yes. The engine correctly calculates magnitude and temporal duration for CJK (Chinese, Japanese, Korean) vectors based on standardized reading speed thresholds." },
        { q: "Data persistence protocol?", a: "Negative. All deconstruction logic is executed within the client-side sandbox. No payload data is cached or transmitted to external nodes." }
    ];

    return (
        <ToolShell
            title="Lexical Analysis Engine"
            description="Real-time deconstruction of linguistic payloads to derive structural complexity, magnitude, and temporal consumption requirements."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard icon={Type} label="Lexical Magnitude" value={stats.words} color="text-blue-600" bg="bg-blue-50" />
                    <StatCard icon={Hash} label="Character Vector" value={stats.chars} color="text-sky-600" bg="bg-sky-50" />
                    <StatCard icon={AlignLeft} label="Structural Nodes" value={stats.sentences} color="text-indigo-600" bg="bg-indigo-50" />
                    <StatCard icon={Clock} label="Temporal Estimate" value={`${stats.readingTime} min`} color="text-emerald-600" bg="bg-emerald-50" />
                    <StatCard icon={AlignLeft} label="Paragraph Density" value={stats.paragraphs} color="text-amber-600" bg="bg-amber-50" />
                    <StatCard icon={Hash} label="Net Payload" value={stats.charsNoSpace} color="text-blue-600" bg="bg-blue-50" />
                </div>

                <ToolInput
                    value={text}
                    onChange={setText}
                    placeholder="Inject linguistic payload here..."
                    label="Payload Integration"
                    heightClass="h-[600px]"
                    onClear={() => setText('')}
                />
            </div>
        </ToolShell>
    );
}
