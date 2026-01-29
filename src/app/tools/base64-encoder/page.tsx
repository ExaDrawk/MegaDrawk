'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Copy, RefreshCw } from 'lucide-react';

export default function Base64ToolPage() {
    const [mode, setMode] = useState<'ENCODE' | 'DECODE'>('ENCODE');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const process = (val: string, currentMode: 'ENCODE' | 'DECODE') => {
        setInput(val);
        setError('');
        if (!val) {
            setOutput('');
            return;
        }

        try {
            if (currentMode === 'ENCODE') {
                setOutput(btoa(unescape(encodeURIComponent(val))));
            } else {
                try {
                    setOutput(decodeURIComponent(escape(atob(val))));
                } catch (e) {
                    setError('無効なBase64文字列です');
                    setOutput('');
                }
            }
        } catch (e) {
            setError('変換に失敗しました');
        }
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li><strong>エンコード</strong>を選択すると、通常のテキストをBase64形式に変換します。</li>
            <li><strong>デコード</strong>を選択すると、Base64文字列を元のテキストに復元します。</li>
            <li>左側の入力エリアにテキストを入力すると、右側に即座に結果が表示されます。</li>
            <li>日本語（UTF-8）のエンコード・デコードにも完全対応しています。</li>
        </ul>
    );

    const faq = [
        { q: "日本語は使えますか？", a: "はい、本ツールはUTF-8エンコーディングに対応しているため、日本語を含むマルチバイト文字も安全に変換可能です。" },
        { q: "大きなデータも扱えますか？", a: "ブラウザのメモリ制限内であれば動作しますが、あまりに巨大なファイル（数百MB以上）の場合は専用のツールを推奨します。" }
    ];

    return (
        <ToolShell
            title="Base64エンコーダー"
            description="テキストからBase64への変換、およびBase64からの復元を瞬時に行います。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="flex flex-col gap-12">
                {/* Mode Switcher */}
                <div className="flex justify-center">
                    <div className="bg-slate-50 p-2 rounded-2xl flex gap-2 border border-slate-100 shadow-inner">
                        {[
                            { id: 'ENCODE', label: 'エンコード (Text → B64)' },
                            { id: 'DECODE', label: 'デコード (B64 → Text)' }
                        ].map((m) => (
                            <button
                                key={m.id}
                                onClick={() => {
                                    setMode(m.id as any);
                                    process(input, m.id as any);
                                }}
                                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === m.id ? 'bg-white text-slate-900 shadow-lg border border-slate-100' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Input */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center ml-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">入力 (Input)</label>
                            <button onClick={() => process('', mode)} className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">リセット</button>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => process(e.target.value, mode)}
                            className="w-full h-80 bg-white border border-slate-200 rounded-[2rem] p-8 font-mono text-sm text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm transition-all resize-none placeholder:text-slate-300"
                            placeholder={mode === 'ENCODE' ? "ここにテキストを入力してください..." : "ここにBase64文字列を貼り付けてください..."}
                        />
                    </div>

                    {/* Output */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center ml-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                出力 (Output)
                                {error && <span className="text-rose-600 animate-pulse">{error}</span>}
                            </label>
                            {output && (
                                <button
                                    onClick={() => navigator.clipboard.writeText(output)}
                                    className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest flex items-center gap-1"
                                >
                                    コピー
                                    <Copy size={12} />
                                </button>
                            )}
                        </div>
                        <div className="relative">
                            <textarea
                                readOnly
                                value={output}
                                className={`w-full h-80 border rounded-[2rem] p-8 font-mono text-sm transition-all resize-none focus:outline-none ${error ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-slate-100 text-blue-600 shadow-inner'}`}
                                placeholder="結果がここに表示されます..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
