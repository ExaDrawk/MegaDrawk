'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Copy, Shield, ShieldCheck, Zap } from 'lucide-react';
import CryptoJS from 'crypto-js';

export default function HashGeneratorPage() {
    const [input, setInput] = useState('');
    const [hashes, setHashes] = useState({
        md5: '',
        sha1: '',
        sha256: '',
        sha512: ''
    });

    useEffect(() => {
        if (!input) {
            setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
            return;
        }
        setHashes({
            md5: CryptoJS.MD5(input).toString(),
            sha1: CryptoJS.SHA1(input).toString(),
            sha256: CryptoJS.SHA256(input).toString(),
            sha512: CryptoJS.SHA512(input).toString(),
        });
    }, [input]);

    const HashResult = ({ label, value }: { label: string, value: string }) => (
        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-col gap-4 group hover:border-blue-500/30 transition-all shadow-sm hover:shadow-xl">
            <div className="flex justify-between items-center ml-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{label}</span>
                {value && (
                    <button
                        onClick={() => navigator.clipboard.writeText(value)}
                        className="text-[10px] font-black text-blue-600 hover:text-black transition-colors"
                    >
                        COPY
                    </button>
                )}
            </div>
            <div className="font-mono text-sm break-all text-slate-700 bg-slate-50 p-6 rounded-2xl border border-slate-100 group-hover:border-blue-100 transition-colors h-24 overflow-y-auto custom-scrollbar">
                {value || '入力待ち...'}
            </div>
        </div>
    );

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4 text-slate-600">
            <li>ハッシュ化したいテキストを入力欄に入力してください。</li>
            <li>入力と同時に、主要なアルゴリズム（MD5, SHA-256等）によるハッシュ値がリアルタイムで計算されます。</li>
            <li>生成されたハッシュ値は各パネルの「COPY」ボタンで即座に取得可能です。</li>
        </ul>
    );

    const faq = [
        { q: "ハッシュ化とは何ですか？", a: "任意のデータを固定長の不規則な文字列に変換する処理です。元のデータに戻すことは不可能（不可逆）であり、データの改ざん検出やパスワードの保護に使用されます。" },
        { q: "パスワードを安全に保存するにはSHA-256だけで十分ですか？", a: "最新のセキュリティ基準では、ソルトの追加や、Argon2などのより高度なアルゴリズムが推奨されます。本ツールはチェックサムやデバッグ目的の使用に適しています。" },
    ];

    return (
        <ToolShell
            title="ハッシュ計算"
            description="任意のテキスト入力から、MD5, SHA-1, SHA-256, SHA-512ハッシュ値をリアルタイムで生成します。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-blue-500/10 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="relative w-full h-48 bg-white border border-slate-200 rounded-[2rem] p-10 text-2xl font-black text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm transition-all placeholder:text-slate-200 resize-none"
                        placeholder="ハッシュ化するテキストを入力..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                    <HashResult label="MD5" value={hashes.md5} />
                    <HashResult label="SHA-1" value={hashes.sha1} />
                    <HashResult label="SHA-256" value={hashes.sha256} />
                    <HashResult label="SHA-512" value={hashes.sha512} />
                </div>

                <div className="flex justify-center pt-8">
                    <div className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 shadow-sm">
                        <ShieldCheck size={14} className="animate-pulse" />
                        CRYPTO ENGINE ACTIVE
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
