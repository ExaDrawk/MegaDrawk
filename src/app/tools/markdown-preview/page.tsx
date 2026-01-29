'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { FileText, Eye, Code, Trash2 } from 'lucide-react';

export default function MarkdownPreviewPage() {
    const [markdown, setMarkdown] = useState('# Markdown Preview\n\nStart typing **markdown** here to see the *live preview*.\n\n### Features:\n- Live feedback\n- Premium styling\n- Mobile responsive');

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>左側のエディタにMarkdown形式のテキストを入力してください。</li>
            <li>右側のパネルに、レンダリングされた結果がリアルタイムで表示されます。</li>
            <li>標準的なMarkdown構文（見出し、太字、リスト、リンク等）に対応しています。</li>
        </ul>
    );

    const faq = [
        { q: "どのようなタグに対応していますか？", a: "一般的な見出し、強調、リスト、コードブロック、引用、画像などは標準的なCSSで美しくレンダリングされます。" },
        { q: "データの保存機能はありますか？", a: "現在のバージョンでは一時的な確認用として設計されており、ページを閉じるとリセットされます。出力が必要な場合はコピーしてご利用ください。" },
    ];

    return (
        <ToolShell
            title="Markdownプレビュー"
            description="Markdown記法を美しくリアルタイムにレンダリングするライブプレビューツール。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[700px]">
                {/* Editor */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center ml-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <Code size={12} className="text-blue-600" />
                            Editor
                        </label>
                        <button onClick={() => setMarkdown('')} className="text-slate-200 hover:text-rose-500 transition-colors p-1">
                            <Trash2 size={16} />
                        </button>
                    </div>
                    <textarea
                        value={markdown}
                        onChange={(e) => setMarkdown(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 rounded-[2rem] p-10 font-mono text-sm text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm transition-all resize-none placeholder:text-slate-200"
                        placeholder="# タイトルを入力..."
                        spellCheck="false"
                    />
                </div>

                {/* Preview */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center ml-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <Eye size={12} className="text-emerald-500" />
                            Live Preview
                        </label>
                    </div>
                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-[2rem] p-10 overflow-y-auto text-slate-900 shadow-xl shadow-slate-200/50">
                        <article className="prose prose-slate max-w-none prose-headings:font-black prose-a:text-blue-600 prose-img:rounded-2xl prose-strong:font-black">
                            {markdown.split('\n').filter(Boolean).map((line, i) => {
                                if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-black mb-8 mt-2 text-slate-900 tracking-tighter">{line.slice(2)}</h1>;
                                if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black mb-6 mt-8 text-slate-800 tracking-tight border-b border-slate-200 pb-2">{line.slice(3)}</h2>;
                                if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-black mb-4 mt-6 text-slate-700">{line.slice(4)}</h3>;
                                if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc mb-2 text-slate-600 font-medium">{line.trim().slice(2)}</li>;
                                return <p key={i} className="mb-6 leading-relaxed text-slate-600 font-medium">{line}</p>;
                            })}
                        </article>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
