'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Link, Copy, Trash2, ArrowRightLeft } from 'lucide-react';

export default function UrlEncoderPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'ENCODE' | 'DECODE'>('ENCODE');

    const process = (val: string, m: 'ENCODE' | 'DECODE') => {
        setInput(val);
        if (!val) { setOutput(''); return; }
        try {
            if (m === 'ENCODE') setOutput(encodeURIComponent(val));
            else setOutput(decodeURIComponent(val));
        } catch (e) {
            setOutput('エラー: 無効な形式です');
        }
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li><strong>URLエンコード</strong>（パーセント・エンコーディング）を行う場合は「エンコード」を選択します。</li>
            <li>URLに含まれる特殊文字や日本語を、安全な形式に変換します。</li>
            <li>逆に、暗号のようなURL文字列を元の読みやすい形式に戻すには「デコード」を使用します。</li>
        </ul>
    );

    const faq = [
        { q: "なぜエンコードが必要なのですか？", a: "URLには使用できる文字に制限があります。スペースや日本語などをURLとして正しく機能させるためには、特定の規則（%xx形式）に従って変換する必要があります。" },
        { q: "encodeURI と encodeURIComponent の違いは？", a: "本ツールでは、より強力な `encodeURIComponent` を使用しており、スラッシュ（/）やコロン（:）などの区切り文字もすべて安全に変換します。" },
    ];

    return (
        <ToolShell
            title="URLエンコーダー・デコーダー"
            description="URLで使用可能な安全な形式へのエンコード、および元の形式へのデコードを行います。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <div className="flex justify-center">
                    <div className="bg-slate-50 p-2 rounded-2xl flex gap-3 border border-slate-100 shadow-inner">
                        <button onClick={() => { setMode('ENCODE'); process(input, 'ENCODE'); }} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'ENCODE' ? 'bg-white text-slate-900 shadow-lg border border-slate-100' : 'text-slate-400 hover:text-slate-900'}`}>エンコード</button>
                        <button onClick={() => { setMode('DECODE'); process(input, 'DECODE'); }} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'DECODE' ? 'bg-white text-slate-900 shadow-lg border border-slate-100' : 'text-slate-400 hover:text-slate-900'}`}>デコード</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-6">入力文字列</label>
                        <textarea
                            value={input}
                            onChange={(e) => process(e.target.value, mode)}
                            className="w-full h-80 bg-white border border-slate-200 rounded-[2.5rem] p-10 text-xl font-medium text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm transition-all resize-none placeholder:text-slate-200"
                            placeholder="変換する文字列を入力..."
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center ml-6">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">出力結果</label>
                            {output && <button onClick={() => navigator.clipboard.writeText(output)} className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest flex items-center gap-1">コピー <Copy size={12} /></button>}
                        </div>
                        <textarea
                            readOnly
                            value={output}
                            className="w-full h-80 bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 text-xl font-medium text-blue-600 focus:outline-none transition-all resize-none shadow-inner"
                            placeholder="結果がここに表示されます..."
                        />
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
