'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Binary, Copy, Trash2, ArrowRightLeft, Zap, Type } from 'lucide-react';

export default function BinaryConverterPage() {
    const [text, setText] = useState('');
    const [binary, setBinary] = useState('');

    const textToBinary = (t: string) => {
        setText(t);
        const res = t.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        setBinary(res);
    };

    const binaryToText = (b: string) => {
        setBinary(b);
        try {
            const res = b.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
            setText(res);
        } catch (e) {
            setText('無効なバイナリ形式です');
        }
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li><strong>テキスト → バイナリ</strong>: 通常の文章を入力すると、コンピュータが理解する 0 と 1 の羅列に変換します。</li>
            <li><strong>バイナリ → テキスト</strong>: スペース区切りのバイナリ系列を入力すると、元のテキストに復元します。</li>
            <li>文字コード（UTF-16）に基づいて変換が行われるため、日本語も正しく処理可能です。</li>
        </ul>
    );

    const faq = [
        { q: "なぜバイナリに変換するのですか？", a: "コンピュータの最も低レイヤーでのデータ表現を理解するための学習目的や、情報の難読化として使用されることがあります。" },
        { q: "日本語は使えますか？", a: "はい。各文字をバイナリ（8ビット〜）に変換するため、マルチバイト文字である日本語も正確に処理できます。" },
    ];

    return (
        <ToolShell
            title="バイナリ変換"
            description="テキストと2進数（バイナリ）表現を相互に変換します。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-6 flex items-center gap-2 text-blue-600">
                            <Type size={12} />
                            Text
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => textToBinary(e.target.value)}
                            className="w-full h-80 bg-white border border-slate-200 rounded-[2.5rem] p-10 text-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm transition-all placeholder:text-slate-200"
                            placeholder="テキストを入力..."
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-6 flex items-center gap-2 text-emerald-600">
                            <Binary size={12} />
                            Binary Output
                        </label>
                        <textarea
                            value={binary}
                            onChange={(e) => binaryToText(e.target.value)}
                            className="w-full h-80 bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 font-mono text-sm leading-relaxed text-emerald-600 focus:outline-none focus:border-emerald-500 shadow-inner transition-all"
                            placeholder="01001000 01000101..."
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <div className="px-8 py-3 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-2 shadow-sm">
                        <Zap size={12} className="text-blue-600 animate-pulse" />
                        8-bit Encoding Engine
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
