'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Type, Copy, Trash2, Zap, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOREM_EN = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.",
    "Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
    "Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula.",
    "Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam.",
];

const LOREM_JP = [
    "あらゆる現実は、単なる論理の影に過ぎない。",
    "MegaDrawk Industries は、不確実性を排除し、構造化された未来を提供します。",
    "データは精緻化されることで、初めて知能としての価値を持つ。",
    "情報の洪水の中で、我々は静かなる秩序を構築する。",
    "反射するプリズムが、真実の輪郭を浮き彫りにするだろう。",
    "複雑さは、設計の不備を隠蔽するための言い訳ではない。",
    "時間は常に一方向へ流れ、我々のコードはその速度を規定する。",
    "美しさは機能に従属し、機能は論理に従属する。",
];

export default function LoremIpsumPage() {
    const [count, setCount] = useState(3);
    const [type, setType] = useState<'PARAGRAPH' | 'SENTENCE'>('PARAGRAPH');
    const [lang, setLang] = useState<'EN' | 'JP'>('JP');
    const [output, setOutput] = useState('');

    const generate = () => {
        const pool = lang === 'EN' ? LOREM_EN : LOREM_JP;
        let result = [];
        for (let i = 0; i < count; i++) {
            if (type === 'PARAGRAPH') {
                // Shuffle and pick 3-5 sentences for a paragraph
                const shuffled = [...pool].sort(() => 0.5 - Math.random());
                result.push(shuffled.slice(0, 4).join(lang === 'EN' ? ' ' : ''));
            } else {
                result.push(pool[Math.floor(Math.random() * pool.length)]);
            }
        }
        setOutput(result.join(type === 'PARAGRAPH' ? '\n\n' : (lang === 'EN' ? ' ' : '')));
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li><strong>言語</strong>（日本語 / 英語）を選択してください。</li>
            <li><strong>生成タイプ</strong>（段落単位 / 文単位）と<strong>数量</strong>を指定します。</li>
            <li>「ダミーテキストを生成」ボタンをクリックすると、ランダムな文章が作成されます。</li>
            <li>デザインのレイアウト確認や、プレースホルダーとして自由にご使用ください。</li>
        </ul>
    );

    const faq = [
        { q: "生成される文章に意味はありますか？", a: "英語（Lorem Ipsum）は伝統的なラテン語ベースの無意味な文字列です。日本語はMegaDrawkの世界観を反映した抽象的な文章が生成されますが、特定の主張を持つものではありません。" },
        { q: "著作権はありますか？", a: "生成されたテキストには著作権は発生しません。商用・非商用を問わず、自由にご利用いただけます。" },
    ];

    return (
        <ToolShell
            title="ダミーテキスト生成"
            description="デザインの試作やプレースホルダーに使用する、高品質なダミーテキストを生成します。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="flex flex-col gap-12">
                {/* Controls */}
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 items-end shadow-sm">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">言語 (Language)</label>
                        <div className="flex gap-2 bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200">
                            {['JP', 'EN'].map(l => (
                                <button key={l} onClick={() => setLang(l as any)} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${lang === l ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>
                                    {l === 'JP' ? '日本語' : 'English'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">数量 (Count: {count})</label>
                        <input
                            type="range"
                            min="1" max="20"
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">単位 (Unit)</label>
                        <div className="flex gap-2 bg-slate-200/50 p-1.5 rounded-2xl border border-slate-200">
                            {['SENTENCE', 'PARAGRAPH'].map(t => (
                                <button key={t} onClick={() => setType(t as any)} className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${type === t ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>
                                    {t === 'SENTENCE' ? '文' : '段落'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Output */}
                <div className="space-y-4 font-sans">
                    <div className="flex justify-between items-center ml-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">生成結果 (Result)</label>
                        <div className="flex gap-4">
                            <button onClick={() => setOutput('')} className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">クリア</button>
                            {output && (
                                <button onClick={() => navigator.clipboard.writeText(output)} className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest flex items-center gap-1">コピー <Copy size={12} /></button>
                            )}
                        </div>
                    </div>
                    <textarea
                        readOnly
                        value={output}
                        className="w-full h-[500px] bg-white border border-slate-200 rounded-[2.5rem] p-12 text-xl leading-loose text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all resize-none shadow-xl"
                        placeholder="生成ボタンをクリックしてください..."
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={generate}
                        className="group relative flex items-center gap-4 px-16 py-6 bg-blue-600 text-white font-black text-sm uppercase tracking-[0.4em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        ダミーテキストを生成
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}
