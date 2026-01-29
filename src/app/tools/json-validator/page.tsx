'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Copy, Trash2, CheckCircle, AlertTriangle, FileJson, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JsonValidatorPage() {
    const [input, setInput] = useState('');
    const [status, setStatus] = useState<'IDLE' | 'VALID' | 'ERROR'>('IDLE');
    const [errorMsg, setErrorMsg] = useState('');
    const [stats, setStats] = useState({ size: '0 B', uniqueKeys: 0 });

    const validateAndFormat = () => {
        if (!input.trim()) {
            setStatus('IDLE');
            return;
        }
        try {
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 4);
            setInput(formatted);
            setStatus('VALID');
            setErrorMsg('');

            // Calc stats
            const bytes = new Blob([formatted]).size;
            setStats({
                size: bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`,
                uniqueKeys: Object.keys(parsed).length
            });
        } catch (e: any) {
            setStatus('ERROR');
            setErrorMsg(e.message);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(input);
    };

    const clear = () => {
        setInput('');
        setStatus('IDLE');
        setErrorMsg('');
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>整形したいJSONデータをテキストエリアに貼り付けてください。</li>
            <li>「<strong>検証・整形を実行</strong>」ボタンをクリックすると、構文チェックとインデント処理が行われます。</li>
            <li>構文エラーがある場合は、エラー箇所と原因が赤色のパネルで表示されます。</li>
            <li>整形後のデータは「コピー」ボタンでクリップボードに保存できます。</li>
        </ul>
    );

    const faq = [
        { q: "JSONデータはサーバーに保存されますか？", a: "いいえ。すべての処理はブラウザ上のJavaScriptで行われるため、データが外部へ送信されることはありません。機密性の高い設定ファイルなども安全に扱えます。" },
        { q: "コメントやシングルクォートは使えますか？", a: "標準的なJSON形式（ダブルクォート使用、コメント不可）に準拠しています。非標準のJSON5などには対応していません。" },
    ];

    return (
        <ToolShell
            title="JSON検証・成形"
            description="乱雑なJSON文字列を、構造化された読みやすい形式に変換します。厳格な構文チェック機能付き。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="flex flex-col gap-6">
                {/* Toolbar */}
                <div className="flex flex-wrap justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner">
                    <div className="flex gap-3">
                        <span className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${status === 'VALID' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                            status === 'ERROR' ? 'bg-rose-50 border-rose-200 text-rose-600' :
                                'bg-white border-slate-200 text-slate-400'
                            }`}>
                            {status === 'IDLE' ? '待機中' : status === 'VALID' ? (
                                <>
                                    <CheckCircle size={12} />
                                    有効な構成
                                </>
                            ) : (
                                <>
                                    <AlertTriangle size={12} />
                                    構文エラー
                                </>
                            )}
                        </span>
                        {status === 'VALID' && (
                            <span className="px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                SIZE: {stats.size}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={clear} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="クリア">
                            <Trash2 size={18} />
                        </button>
                        <button onClick={copyToClipboard} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="コピー">
                            <Copy size={18} />
                        </button>
                    </div>
                </div>

                {/* Editor Container */}
                <div className="relative group">
                    <div className={`absolute -inset-1 rounded-[2.5rem] blur-xl opacity-10 transition-all duration-500 ${status === 'ERROR' ? 'bg-rose-500' : status === 'VALID' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`} />
                    <textarea
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            if (status !== 'IDLE') setStatus('IDLE');
                        }}
                        placeholder='{"status": "ここにJSONを貼り付けてください..."}'
                        className={`relative w-full h-[600px] bg-white border-2 rounded-[2rem] p-10 font-mono text-base leading-relaxed resize-none focus:outline-none transition-all
                            ${status === 'ERROR' ? 'border-rose-200 text-rose-700' : status === 'VALID' ? 'border-emerald-200 text-emerald-700 shadow-xl shadow-emerald-500/5' : 'border-slate-100 focus:border-blue-200 text-slate-700 shadow-sm'}
                        `}
                        spellCheck="false"
                    />

                    <AnimatePresence>
                        {status === 'ERROR' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute bottom-6 left-6 right-6 bg-rose-50 border border-rose-200 text-rose-700 p-6 rounded-2xl backdrop-blur-xl shadow-2xl flex items-start gap-4"
                            >
                                <AlertTriangle className="shrink-0 text-rose-500 mt-0.5" size={20} />
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-rose-400">Analysis Error</div>
                                    <div className="font-mono text-xs leading-relaxed">{errorMsg}</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Main Action */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={validateAndFormat}
                        className="group relative flex items-center gap-3 px-12 py-5 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <FileJson size={18} className="group-hover:rotate-12 transition-transform" />
                        検証・整形を実行
                        <Zap size={14} className="ml-1 opacity-50 animate-pulse" />
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}
