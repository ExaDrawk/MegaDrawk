'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Copy, Trash2, ArrowRightLeft, FileCode, Zap } from 'lucide-react';
import yaml from 'js-yaml';

export default function YamlToJsonPage() {
    const [input, setInput] = useState('name: MegaDrawk\nversion: 1.0.0\nfeatures:\n  - speed\n  - precision\n  - logic');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'YAML_TO_JSON' | 'JSON_TO_YAML'>('YAML_TO_JSON');
    const [error, setError] = useState('');

    const process = (val: string, m: 'YAML_TO_JSON' | 'JSON_TO_YAML') => {
        setInput(val);
        setError('');
        if (!val.trim()) { setOutput(''); return; }
        try {
            if (m === 'YAML_TO_JSON') {
                const obj = yaml.load(val);
                setOutput(JSON.stringify(obj, null, 4));
            } else {
                const obj = JSON.parse(val);
                setOutput(yaml.dump(obj));
            }
        } catch (e: any) {
            setError(m === 'YAML_TO_JSON' ? '無効なYAML形式です' : '無効なJSON形式です');
        }
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li><strong>YAML to JSON</strong> または <strong>JSON to YAML</strong> モードを選択します。</li>
            <li>左側のエディタにソースコードを入力してください。</li>
            <li>構文が正しい場合、右側のエディタに変換結果が即座に表示されます。</li>
            <li>設定ファイル（k8s, docker-compose, config等）の相互変換に便利です。</li>
        </ul>
    );

    const faq = [
        { q: "YAMLとJSONの主な違いは何ですか？", a: "JSONは厳格な中括弧とダブルクォートを重視する一方、YAMLはインデントによる構造表現を重視し、人間にとってより読みやすい（Human-friendly）設計になっています。" },
        { q: "大規模なファイルでも動作しますか？", a: "数百KB程度の一般的な設定ファイルであれば快適に動作します。数MBを超える巨大なデータの場合は、ブラウザの処理速度に依存します。" },
    ];

    return (
        <ToolShell
            title="YAML ↔ JSON 変換"
            description="YAML形式とJSON形式の設定ファイルを、相互に瞬時に変換します。構文チェック機能付き。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <div className="flex justify-center">
                    <div className="bg-slate-50 p-2 rounded-2xl flex gap-3 border border-slate-200 shadow-inner">
                        <button onClick={() => { setMode('YAML_TO_JSON'); process(input, 'YAML_TO_JSON'); }} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'YAML_TO_JSON' ? 'bg-white text-slate-900 shadow-xl border border-slate-100' : 'text-slate-400 hover:text-slate-900'}`}>YAML → JSON</button>
                        <button onClick={() => { setMode('JSON_TO_YAML'); process(input, 'JSON_TO_YAML'); }} className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'JSON_TO_YAML' ? 'bg-white text-slate-900 shadow-xl border border-slate-100' : 'text-slate-400 hover:text-slate-900'}`}>JSON → YAML</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-6 flex items-center gap-2">
                            <FileCode size={12} />
                            Source ({mode === 'YAML_TO_JSON' ? 'YAML' : 'JSON'})
                        </label>
                        <textarea
                            value={input}
                            onChange={(e) => process(e.target.value, mode)}
                            className="w-full h-[500px] bg-white border border-slate-200 rounded-[2.5rem] p-10 font-mono text-sm leading-relaxed text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all shadow-sm resize-none"
                            spellCheck="false"
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center ml-6">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-2">
                                <FileCode size={12} className="text-blue-600" />
                                Result ({mode === 'YAML_TO_JSON' ? 'JSON' : 'YAML'})
                                {error && <span className="text-red-500 animate-pulse ml-2">{error}</span>}
                            </label>
                            {output && <button onClick={() => navigator.clipboard.writeText(output)} className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest flex items-center gap-1">コピー <Copy size={12} /></button>}
                        </div>
                        <textarea
                            readOnly
                            value={output}
                            className="w-full h-[500px] bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 font-mono text-sm leading-relaxed text-blue-700 shadow-inner focus:outline-none transition-all resize-none"
                            spellCheck="false"
                        />
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
