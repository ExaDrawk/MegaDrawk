'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Copy, RefreshCw, Hash, Fingerprint, Zap } from 'lucide-react';
import { v4 as uuidv4, v1 as uuidv1 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

export default function UuidGeneratorPage() {
    const [uuids, setUuids] = useState<string[]>([]);
    const [count, setCount] = useState(5);
    const [version, setVersion] = useState<'v4' | 'v1'>('v4');

    const generate = () => {
        const results = [];
        for (let i = 0; i < count; i++) {
            results.push(version === 'v4' ? uuidv4() : uuidv1());
        }
        setUuids(results);
    };

    useEffect(() => {
        generate();
    }, []);

    const copyAll = () => {
        navigator.clipboard.writeText(uuids.join('\n'));
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li><strong>UUID v4</strong> (完全ランダム) または <strong>UUID v1</strong> (時刻ベース) を選択します。</li>
            <li>生成したい個数（最大100個）を指定して、「生成」ボタンをクリックします。</li>
            <li>生成されたIDをクリックすることで、個別にコピーすることも可能です。</li>
        </ul>
    );

    const faq = [
        { q: "v4とv1の違いは何ですか？", a: "v4は完全にランダムな値を使用し、衝突の可能性が極めて低いため最も一般的に使われます。v1は macアドレスと時刻情報を利用するため、時系列順のソートが可能です。" },
        { q: "IDは一意ですか？", a: "UUIDのビット数は128ビットであり、重複が発生する確率は無視できるほど低いため、事実上すべての用途で一意なIDとして使用できます。" },
    ];

    return (
        <ToolShell
            title="UUIDジェネレーター"
            description="RFC 4122準拠の汎用一意識別子（UUID）を、バッチで一括生成します。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                {/* Controls */}
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-end gap-12 shadow-sm">
                    <div className="flex-1 space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">UUIDバージョン</label>
                        <div className="flex gap-2 bg-slate-200/50 p-2 rounded-2xl border border-slate-200">
                            <button onClick={() => setVersion('v4')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${version === 'v4' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>Version 4 (Random)</button>
                            <button onClick={() => setVersion('v1')} className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${version === 'v1' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}>Version 1 (Time-based)</button>
                        </div>
                    </div>
                    <div className="w-full md:w-64 space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">生成個数 ({count})</label>
                        <input
                            type="range"
                            min="1" max="50"
                            value={count}
                            onChange={(e) => setCount(Number(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                </div>

                {/* Results List */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center ml-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <Fingerprint size={12} />
                            生成結果 (Identifiers)
                        </label>
                        <button onClick={copyAll} className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest flex items-center gap-1">すべてコピー <Copy size={12} /></button>
                    </div>

                    <div className="grid gap-3">
                        <AnimatePresence mode="popLayout">
                            {uuids.map((id, i) => (
                                <motion.div
                                    key={id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => navigator.clipboard.writeText(id)}
                                    className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-xl hover:border-blue-600/30 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-lg"
                                >
                                    <div className="font-mono text-sm md:text-lg text-slate-900 group-hover:text-blue-600 transition-colors tracking-wider">
                                        {id}
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Copy size={16} className="text-blue-600" />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={generate}
                        className="group relative flex items-center gap-4 px-16 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        IDを一括生成
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}
