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
        // Japanese text analysis improvement
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, '').length;
        const sentences = text.trim() === '' ? 0 : text.split(/[.!?。！？]+/).length - 1;
        const paragraphs = text.trim() === '' ? 0 : text.replace(/\n$/gm, '').split(/\n/).length;
        const readingTime = Math.ceil(chars / 600); // 600 characters per minute for Japanese

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
        <ul className="list-disc pl-5 space-y-4 text-slate-600">
            <li>テキストエリアに分析したい文章を入力または貼り付けてください。</li>
            <li>入力と同時に、上部の統計パネルがリアルタイムで更新されます。</li>
            <li><strong>読了時間</strong>は、日本語の平均的な読書速度（約600文字/分）に基づいて算出されます。</li>
            <li>「空白なし」の文字数カウントは、原稿用紙の枚数計算などに便利です。</li>
        </ul>
    );

    const faq = [
        { q: "日本語以外の言語もカウントできますか？", a: "はい、英語を始めとする他言語も正確に単語数や文字数をカウントします。" },
        { q: "プライバシーは守られますか？", a: "入力されたテキストはサーバーに送信されることはありません。すべての処理はブラウザ内で完結するため、機密文書の分析も安全です。" }
    ];

    return (
        <ToolShell
            title="文字・単語カウント"
            description="リアルタイムで文章密度、読了時間、構造的複雑さを分析します。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <StatCard icon={Type} label="単語数 (Words)" value={stats.words} color="text-blue-600" bg="bg-blue-50" />
                <StatCard icon={Hash} label="文字数 (Chars)" value={stats.chars} color="text-sky-600" bg="bg-sky-50" />
                <StatCard icon={AlignLeft} label="文章数 (Sentences)" value={stats.sentences} color="text-indigo-600" bg="bg-indigo-50" />
                <StatCard icon={Clock} label="読了時間 (目安)" value={`${stats.readingTime} 分`} color="text-emerald-600" bg="bg-emerald-50" />
                <StatCard icon={AlignLeft} label="段落数" value={stats.paragraphs} color="text-amber-600" bg="bg-amber-50" />
                <StatCard icon={Hash} label="文字数 (空白なし)" value={stats.charsNoSpace} color="text-blue-600" bg="bg-blue-50" />
            </div>

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-transparent rounded-[2.5rem] blur-xl opacity-20 pointer-events-none" />
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="ここに文章を入力してください..."
                    className="relative w-full h-[500px] bg-white border border-slate-200 rounded-[2rem] p-10 text-xl leading-relaxed text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm transition-all resize-none font-medium placeholder:text-slate-200"
                />
            </div>
        </ToolShell>
    );
}
