'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Copy, Trash2, Database, Zap, LayoutGrid } from 'lucide-react';
import { format } from 'sql-formatter';
import { motion, AnimatePresence } from 'framer-motion';

export default function SqlFormatterPage() {
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState<any>('sql');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const languages = [
        { id: 'sql', label: 'Standard SQL' },
        { id: 'postgresql', label: 'PostgreSQL' },
        { id: 'mysql', label: 'MySQL' },
        { id: 'mariadb', label: 'MariaDB' },
        { id: 'sqlite', label: 'SQLite' },
        { id: 'tsql', label: 'T-SQL (SQL Server)' },
    ];

    const formatSql = () => {
        if (!input.trim()) return;
        try {
            const result = format(input, {
                language: language,
                tabWidth: 4,
                keywordCase: 'upper',
                linesBetweenQueries: 2,
            });
            setOutput(result);
            setError('');
        } catch (e: any) {
            setError('SQLの解析に失敗しました。構文を確認してください。');
        }
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>整形したいSQLクエリを左側のテキストエリアに入力してください。</li>
            <li>クエリの種類（PostgreSQL, MySQL等）を選択します。デフォルトは標準SQLです。</li>
            <li>「<strong>フォーマットを実行</strong>」ボタンをクリックすると、キーワードの大文字化と綺麗なインデント処理が行われます。</li>
            <li>「コピー」ボタンで整形後のクエリを取得できます。</li>
        </ul>
    );

    const faq = [
        { q: "どのような整形が行われますか？", a: "SELECT, FROM, WHERE などの予約語を大文字に統一し、適切な改行とインデントを挿入することで、可読性を最大化します。" },
        { q: "複雑なサブクエリにも対応していますか？", a: "はい。ネストされたサブクエリや複雑なJOIN句も、階層構造を保ったまま整形されます。" },
    ];

    return (
        <ToolShell
            title="SQLフォーマッタ"
            description="複雑なSQLクエリを、読みやすく構造化された形式に瞬時に整形します。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="flex flex-col gap-12">
                {/* Language Selector */}
                <div className="flex justify-center">
                    <div className="bg-slate-50 p-2 rounded-2xl flex flex-wrap gap-2 border border-slate-100 justify-center shadow-inner">
                        {languages.map((lang) => (
                            <button
                                key={lang.id}
                                onClick={() => setLanguage(lang.id)}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${language === lang.id ? 'bg-white text-slate-900 shadow-lg border border-slate-100' : 'text-slate-400 hover:text-slate-900'}`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Input */}
                    <div className="space-y-4 font-sans">
                        <div className="flex justify-between items-center ml-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">入力 (SQL Input)</label>
                            <button onClick={() => setInput('')} className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">クリア</button>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="w-full h-96 bg-white border border-slate-200 rounded-[2rem] p-8 font-mono text-sm text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm transition-all resize-none placeholder:text-slate-300"
                            placeholder="SELECT * FROM users WHERE active = 1..."
                            spellCheck="false"
                        />
                    </div>

                    {/* Output */}
                    <div className="space-y-4 font-sans">
                        <div className="flex justify-between items-center ml-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                出力 (Formatted SQL)
                                {error && <span className="text-red-500 animate-pulse">{error}</span>}
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
                                className={`w-full h-96 border rounded-[2rem] p-8 font-mono text-sm transition-all resize-none focus:outline-none ${error ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-slate-50 border-slate-200 text-blue-700 shadow-inner'}`}
                                placeholder="フォーマット済みのSQLがここに表示されます..."
                                spellCheck="false"
                            />
                        </div>
                    </div>
                </div>

                {/* Main Action */}
                <div className="flex justify-center">
                    <button
                        onClick={formatSql}
                        className="group relative flex items-center gap-3 px-16 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <Database size={18} className="group-hover:translate-y-[-2px] transition-transform" />
                        フォーマットを実行
                        <Zap size={14} className="ml-1 opacity-50 animate-pulse" />
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}
