'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Code, Copy, Trash2, Zap, Minimize2 } from 'lucide-react';

export default function JsMinifierPage() {
    const [input, setInput] = useState('function helloWorld() {\n    // This is a comment\n    const name = "MegaDrawk";\n    console.log("Hello, " + name);\n}');
    const [output, setOutput] = useState('');
    const [stats, setStats] = useState({ saved: '0%' });

    const minify = () => {
        if (!input.trim()) return;

        // Simple manual minification: remove comments and extra whitespace
        let res = input
            .replace(/\/\/.*$/gm, '') // single line comments
            .replace(/\/\*[\s\S]*?\*\//g, '') // multi-line comments
            .replace(/\s+/g, ' ') // collapse whitespace
            .replace(/\s*([{};,])\s*/g, '$1') // remove space around separators
            .trim();

        const originalSize = new Blob([input]).size;
        const minifiedSize = new Blob([res]).size;
        const saved = originalSize > 0 ? ((1 - minifiedSize / originalSize) * 100).toFixed(1) : 0;

        setOutput(res);
        setStats({ saved: `${saved}%` });
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>JavaScriptコードを入力欄に貼り付けてください。</li>
            <li>「コードを圧縮」ボタンをクリックすると、コメントの削除と、余分なスペース・改行の除去が行われます。</li>
            <li>圧縮後のコードはファイルサイズが削減され、Webサイトの読み込み速度向上に寄与します。</li>
        </ul>
    );

    const faq = [
        { q: "難読化も行われますか？", a: "本ツールは軽量化（Minify）のみを目的としており、変数名の書き換えなどの難読化（Obfuscation）は行いません。" },
        { q: "実行エラーは起きませんか？", a: "セミコロンを省略したコードなど、特定の書き方によっては圧縮後に構文エラーが発生する可能性があります。標準的な構文に従ったコードの使用を推奨します。" },
    ];

    return (
        <ToolShell
            title="JSミニファイアー"
            description="JavaScriptファイルを軽量化し、Webサイトのパフォーマンスを最適化します。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-6 flex items-center gap-2">
                            <Code size={12} />
                            Source Code
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full h-96 bg-white border border-slate-200 rounded-[2.5rem] p-10 font-mono text-sm leading-relaxed text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm transition-all resize-none placeholder:text-slate-200"
                            spellCheck="false"
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center ml-6">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-2">
                                <Minimize2 size={12} className="text-blue-600" />
                                Minified Result
                                {output && <span className="ml-4 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[8px] font-black">SAVED: {stats.saved}</span>}
                            </label>
                            {output && <button onClick={() => navigator.clipboard.writeText(output)} className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors">コピー</button>}
                        </div>
                        <textarea
                            readOnly
                            value={output}
                            className="w-full h-96 bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 font-mono text-xs leading-relaxed text-blue-600 focus:outline-none transition-all resize-none shadow-inner"
                            spellCheck="false"
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={minify}
                        className="group relative flex items-center gap-4 px-16 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <Zap size={20} className="group-hover:scale-125 transition-transform" />
                        コードを圧縮
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}
