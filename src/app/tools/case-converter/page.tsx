'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Type, Copy, Trash2, ArrowRightLeft } from 'lucide-react';

export default function CaseConverterPage() {
    const [text, setText] = useState('');

    const convert = (mode: string) => {
        let result = text;
        switch (mode) {
            case 'UPPER': result = text.toUpperCase(); break;
            case 'LOWER': result = text.toLowerCase(); break;
            case 'SNAKE': result = text.replace(/\s+/g, '_').toLowerCase(); break;
            case 'KEBAB': result = text.replace(/\s+/g, '-').toLowerCase(); break;
            case 'CAMEL': result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()); break;
            case 'PASCAL':
                const camel = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
                result = camel.charAt(0).toUpperCase() + camel.slice(1);
                break;
        }
        setText(result);
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>変換したいテキストを入力欄に入力してください。</li>
            <li>「大文字」「小文字」「スネークケース」などのボタンをクリックすると、テキストが即座に変換されます。</li>
            <li>プログラミングの変数名作成や、文書の整形にご活用ください。</li>
        </ul>
    );

    const faq = [
        { q: "日本語には対応していますか？", a: "大文字・小文字の変換はアルファベットのみに有効です。スネークケースやケバブケース変換は、スペース区切りの日本語にも一部対応しています。" },
        { q: "どのようなプロジェクトで使われますか？", a: "主にプログラミングでの変数命名（camelCase, snake_case）や、URLのスラッグ作成（kebab-case）などで頻繁に使用されます。" },
    ];

    const CaseButton = ({ label, mode }: { label: string, mode: string }) => (
        <button
            onClick={() => convert(mode)}
            className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm hover:shadow-xl"
        >
            {label}
        </button>
    );

    return (
        <ToolShell
            title="ケース変換"
            description="テキストを大文字、小文字、キャメルケース、スネークケースなどへ瞬時に変換します。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <div className="flex flex-wrap gap-4 justify-center bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    <CaseButton label="UPPERCASE" mode="UPPER" />
                    <CaseButton label="lowercase" mode="LOWER" />
                    <CaseButton label="snake_case" mode="SNAKE" />
                    <CaseButton label="kebab-case" mode="KEBAB" />
                    <CaseButton label="camelCase" mode="CAMEL" />
                    <CaseButton label="PascalCase" mode="PASCAL" />
                </div>

                <div className="space-y-4 font-sans">
                    <div className="flex justify-between items-center ml-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">テキスト入力</label>
                        <div className="flex gap-4">
                            <button onClick={() => setText('')} className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">クリア</button>
                            {text && (
                                <button onClick={() => navigator.clipboard.writeText(text)} className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest flex items-center gap-1">コピー <Copy size={12} /></button>
                            )}
                        </div>
                    </div>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-80 bg-white border border-slate-200 rounded-[2.5rem] p-10 text-2xl font-medium text-slate-900 focus:outline-none focus:border-blue-500/50 transition-all resize-none shadow-xl placeholder:text-slate-200"
                        placeholder="変換するテキストを入力..."
                        spellCheck="false"
                    />
                </div>
            </div>
        </ToolShell>
    );
}
