'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Clock, Calendar, Copy, RefreshCw, Zap, Hash } from 'lucide-react';

export default function TimestampConverterPage() {
    const [unix, setUnix] = useState<string>(Math.floor(Date.now() / 1000).toString());
    const [dateStr, setDateStr] = useState<string>(new Date().toLocaleString());

    const updateFromUnix = (val: string) => {
        setUnix(val);
        const n = parseInt(val);
        if (isNaN(n)) {
            setDateStr('Invalid Timestamp');
            return;
        }
        // Check if ms or s
        const isMs = val.length > 11;
        const d = new Date(isMs ? n : n * 1000);
        setDateStr(d.toString() !== 'Invalid Date' ? d.toLocaleString('ja-JP') : 'Invalid Timestamp');
    };

    const updateFromDate = (val: string) => {
        setDateStr(val);
        const d = new Date(val);
        if (d.toString() === 'Invalid Date') {
            setUnix('Invalid Date');
            return;
        }
        setUnix(Math.floor(d.getTime() / 1000).toString());
    };

    const setToNow = () => {
        const now = Date.now();
        updateFromUnix(Math.floor(now / 1000).toString());
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li><strong>Unix Timestamp</strong> (1970年からの経過秒数) を入力すると、人間が読める形式の日時に変換します。</li>
            <li><strong>ミリ秒単位</strong> (13桁) と<strong>秒単位</strong> (10桁) の両方を自動判別します。</li>
            <li>日時文字列を入力して、Unixタイムスタンプを算出することも可能です。</li>
            <li>「現在時刻にセット」ボタンで、現在のタイムスタンプを瞬時に取得できます。</li>
        </ul>
    );

    const faq = [
        { q: "タイムゾーンはどうなりますか？", a: "変換結果は使用しているブラウザ（ローカルPC）のタイムゾーンで表示されます。" },
        { q: "Unixタイムスタンプの最大値は？", a: "現在の10桁のシステム（32ビット）では2038年に限界が来ますが、本ツールは内部で64ビット数値として扱うため、それ以降の日付も正しく計算可能です。" },
    ];

    return (
        <ToolShell
            title="タイムスタンプ変換"
            description="Unixタイムスタンプと人間が読める日時形式（ISO/ローカル）を相互に変換します。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex justify-center">
                    <button
                        onClick={setToNow}
                        className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-xl"
                    >
                        <RefreshCw size={16} />
                        現在時刻にセット
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Unix */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-6 flex items-center gap-2">
                            <Hash size={12} />
                            Unix Timestamp (seconds)
                        </label>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-blue-500/10 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <input
                                type="text"
                                value={unix}
                                onChange={(e) => updateFromUnix(e.target.value)}
                                className="relative w-full bg-white border border-slate-200 rounded-[2rem] p-10 text-4xl font-black text-slate-900 text-center focus:outline-none focus:border-blue-500 shadow-sm transition-all"
                            />
                        </div>
                    </div>

                    {/* Human Date */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-6 flex items-center gap-2">
                            <Calendar size={12} />
                            Local Date Time
                        </label>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-emerald-500/10 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                            <input
                                type="text"
                                value={dateStr}
                                onChange={(e) => updateFromDate(e.target.value)}
                                className="relative w-full h-auto bg-white border border-slate-200 rounded-[2rem] p-10 text-2xl font-black text-emerald-600 text-center focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Common Ref */}
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-6 text-center">System Information</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-medium">
                        <div className="flex flex-col gap-1 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ISO 8601</span>
                            <span className="text-slate-700 font-mono text-xs">{new Date(parseInt(unix) * 1000).toISOString()}</span>
                        </div>
                        <div className="flex flex-col gap-1 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">UTC String</span>
                            <span className="text-slate-700 font-mono text-xs">{new Date(parseInt(unix) * 1000).toUTCString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
