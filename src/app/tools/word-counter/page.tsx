'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
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
        const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).length - 1;
        const paragraphs = text.trim() === '' ? 0 : text.replace(/\n$/gm, '').split(/\n/).length;
        const readingTime = Math.ceil(words / 200); // 200 wpm

        setStats({ words, chars, charsNoSpace, sentences, paragraphs, readingTime });
    }, [text]);

    const StatCard = ({ icon: Icon, label, value, color }: any) => (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between">
            <div>
                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</div>
                <div className={`text-3xl font-black ${color}`}>{value}</div>
            </div>
            <div className={`p-3 rounded-xl bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
                <Icon size={24} className={color} />
            </div>
        </div>
    );

    return (
        <ToolShell
            title="Word & Character Counter"
            description="Analyze your text density, reading time, and structure complexity in real-time."
        >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon={Type} label="Words" value={stats.words} color="text-cyan-400" />
                <StatCard icon={Hash} label="Characters" value={stats.chars} color="text-purple-400" />
                <StatCard icon={AlignLeft} label="Sentences" value={stats.sentences} color="text-yellow-400" />
                <StatCard icon={Clock} label="Read Time" value={`${stats.readingTime} min`} color="text-green-400" />
                <StatCard icon={AlignLeft} label="Paragraphs" value={stats.paragraphs} color="text-pink-400" />
                <StatCard icon={Hash} label="No Spaces" value={stats.charsNoSpace} color="text-blue-400" />
            </div>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing or paste your text here..."
                className="w-full h-96 bg-[#0b1121] border border-slate-800 rounded-xl p-6 text-lg leading-relaxed text-slate-300 focus:outline-none focus:border-cyan-500 transition-all resize-y"
            />
        </ToolShell>
    );
}
