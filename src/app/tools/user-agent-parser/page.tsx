'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Monitor, Smartphone, Globe, Cpu, Zap, Search } from 'lucide-react';

export default function UserAgentParserPage() {
    const [ua, setUa] = useState('');
    const [parsed, setParsed] = useState<any>(null);

    const parse = (userAgent: string) => {
        setUa(userAgent);
        const lowUA = userAgent.toLowerCase();

        let browser = 'Unknown Browser';
        if (lowUA.includes('chrome')) browser = 'Google Chrome';
        else if (lowUA.includes('safari')) browser = 'Apple Safari';
        else if (lowUA.includes('firefox')) browser = 'Mozilla Firefox';
        else if (lowUA.includes('edge')) browser = 'Microsoft Edge';

        let os = 'Unknown OS';
        if (lowUA.includes('win')) os = 'Windows';
        else if (lowUA.includes('mac')) os = 'macOS';
        else if (lowUA.includes('linux')) os = 'Linux';
        else if (lowUA.includes('android')) os = 'Android';
        else if (lowUA.includes('iphone') || lowUA.includes('ipad')) os = 'iOS';

        const isMobile = /mobile|android|iphone|ipad|phone/i.test(lowUA);

        setParsed({
            browser,
            os,
            platform: isMobile ? 'Mobile' : 'Desktop',
            engine: lowUA.includes('webkit') ? 'WebKit / Blink' : (lowUA.includes('gecko') ? 'Gecko' : 'Unknown')
        });
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            parse(navigator.userAgent);
        }
    }, []);

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>ページを読み込むと、現在のブラウザのUser-Agent情報を自動的に取得して解析します。</li>
            <li>他のUser-Agentを解析したい場合は、テキストエリアに直接貼り付けてください。</li>
            <li>OSの種類、ブラウザの種類、デバイス（Mobile/Desktop）などの主要情報を抽出します。</li>
        </ul>
    );

    const faq = [
        { q: "User-Agentとは何ですか？", a: "WebブラウザがWebサーバーに対して送信する自身の識別情報です。サーバーはこの情報を元に、適切なレイアウト（PC版かスマホ版か等）を判断します。" },
        { q: "プライバシーは大丈夫ですか？", a: "User-Agent情報はブラウザ上の標準的なAPIで取得できるものであり、本ツールが特定の個人を特定する情報を取得・保存することはありません。" },
    ];

    return (
        <ToolShell
            title="User-Agent解析"
            description="ブラウザから送信される識別情報を解析し、OSやブラウザの種類を特定します。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-16">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-sky-500/10 rounded-[2.5rem] blur-xl opacity-30" />
                    <textarea
                        value={ua}
                        onChange={(e) => parse(e.target.value)}
                        className="relative w-full h-40 bg-white border border-slate-200 rounded-[2rem] p-10 font-mono text-sm text-slate-700 focus:outline-none focus:border-blue-500 shadow-sm transition-all resize-none placeholder:text-slate-200"
                        placeholder="解析する User-Agent を入力..."
                    />
                </div>

                {parsed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Browser', value: parsed.browser, icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Operating System', value: parsed.os, icon: Cpu, color: 'text-sky-600', bg: 'bg-sky-50' },
                            { label: 'Platform', value: parsed.platform, icon: parsed.platform === 'Mobile' ? Smartphone : Monitor, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'Render Engine', value: parsed.engine, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-slate-100 p-8 rounded-[2rem] flex flex-col items-center text-center gap-4 hover:border-slate-200 transition-all shadow-sm hover:shadow-xl group">
                                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                                    <item.icon size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">{item.label}</div>
                                    <div className="text-xl font-black text-slate-900 tracking-tight">{item.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-center">
                    <div className="px-10 py-4 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 flex items-center gap-3 shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                        Live UA Parsing active
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
