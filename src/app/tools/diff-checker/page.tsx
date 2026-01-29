'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Copy, Trash2, ArrowRightLeft, FileCode, Zap, Split, Eye } from 'lucide-react';
import * as Diff from 'diff';
import { motion, AnimatePresence } from 'framer-motion';

export default function DiffCheckerPage() {
    const [original, setOriginal] = useState('// Old Code\nconst name = "MegaDrawk";\nconsole.log(name);');
    const [modified, setModified] = useState('// New Code\nconst name = "MegaDrawk Industries";\nconsole.log(name);\nconsole.log("System Initialized");');
    const [diffResult, setDiffResult] = useState<Diff.Change[]>([]);
    const [isComparing, setIsComparing] = useState(false);

    const compare = () => {
        const changes = Diff.diffLines(original, modified);
        setDiffResult(changes);
        setIsComparing(true);
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li><strong>Original</strong> パネルに比較元のテキストを入力します。</li>
            <li><strong>Modified</strong> パネルに比較先のテキストを入力します。</li>
            <li>「差分を比較」ボタンをクリックすると、変更箇所がハイライト表示されます。</li>
            <li>赤色の行は削除、緑色の行は追加された部分を指します。</li>
        </ul>
    );

    const faq = [
        { q: "どのような差分に対応していますか？", a: "本ツールは「行（ライン）」単位での比較を行います。ソースコードの変更箇所や、ドキュメントの改訂内容の確認に最適です。" },
        { q: "機密性の高いコードでも安全ですか？", a: "はい。比較処理はすべてブラウザ上のJavaScriptで完結するため、入力したテキストが外部サーバーに送信されることはありません。" },
    ];

    return (
        <ToolShell
            title="差分チェック (Diff Checker)"
            description="2つのテキスト間の変更箇所を、行単位で高速に検出しハイライト表示します。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                {!isComparing ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-6">Original (元データ)</label>
                            <textarea
                                value={original}
                                onChange={(e) => setOriginal(e.target.value)}
                                className="w-full h-80 bg-white border border-slate-200 rounded-[2.5rem] p-10 font-mono text-sm leading-relaxed text-slate-700 focus:outline-none focus:border-rose-200 shadow-sm transition-all resize-none placeholder:text-slate-200"
                                placeholder="比較元のテキストを貼り付けてください..."
                                spellCheck="false"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 ml-6 font-black">Modified (変更後)</label>
                            <textarea
                                value={modified}
                                onChange={(e) => setModified(e.target.value)}
                                className="w-full h-80 bg-white border border-slate-200 rounded-[2.5rem] p-10 font-mono text-sm leading-relaxed text-slate-700 focus:outline-none focus:border-emerald-200 shadow-sm transition-all resize-none placeholder:text-slate-200"
                                placeholder="比較先のテキストを貼り付けてください..."
                                spellCheck="false"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center ml-6">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-2">
                                <Eye size={12} />
                                Diff Analysis Result
                            </label>
                            <button onClick={() => setIsComparing(false)} className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest">編集に戻る</button>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 min-h-[400px] shadow-sm overflow-x-auto shadow-inner">
                            <div className="font-mono text-sm leading-relaxed">
                                {diffResult.length > 0 ? diffResult.map((part, i) => (
                                    <div
                                        key={i}
                                        className={`whitespace-pre-wrap p-2 my-1 rounded-lg border-l-4 transition-all ${part.added ? 'bg-emerald-50 text-emerald-700 border-emerald-500 font-medium' :
                                            part.removed ? 'bg-rose-50 text-rose-700 border-rose-500 line-through opacity-70' :
                                                'text-slate-400 opacity-60'
                                            }`}
                                    >
                                        <span className="inline-block w-4 opacity-50 select-none">
                                            {part.added ? '+ ' : part.removed ? '- ' : '  '}
                                        </span>
                                        {part.value}
                                    </div>
                                )) : <div className="p-10 text-slate-300 text-center font-black uppercase tracking-widest italic">No changes detected</div>}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-center">
                    <button
                        onClick={compare}
                        className="group relative flex items-center gap-4 px-16 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <Split size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        差分を比較
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}
