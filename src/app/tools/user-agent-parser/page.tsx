'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolInput } from '@/components/tools/shared/ToolInput';
import { Monitor, Smartphone, Globe, Cpu, Zap, Search } from 'lucide-react';
import { UAParser } from 'ua-parser-js';

export default function UserAgentParserPage() {
    const [ua, setUa] = useState('');
    const [parsed, setParsed] = useState<any>(null);

    const parse = (userAgent: string) => {
        setUa(userAgent);
        if (!userAgent) {
            setParsed(null);
            return;
        }

        const parser = new UAParser(userAgent);
        const result = parser.getResult();

        setParsed({
            browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`,
            os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`,
            platform: result.device.type ? (result.device.type === 'mobile' || result.device.type === 'tablet' ? 'Mobile' : 'Desktop') : 'Desktop', // Default to Desktop if undefined
            engine: `${result.engine.name || 'Unknown'} ${result.engine.version || ''}`,
            cpu: result.cpu.architecture || 'Unknown Arch'
        });
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            parse(navigator.userAgent);
        }
    }, []);

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Automatically detects your current browser's User Agent on load.</li>
            <li>Paste any User Agent string to parse it instantly.</li>
            <li>Identifies Browser, Operating System, Device Type, and Engine.</li>
        </ul>
    );

    const faq = [
        { q: "What is a User Agent?", a: "A string sent by your browser to websites identifying itself, your OS, and device type." },
        { q: "Is this private?", a: "Yes. The parsing happens entirely in your browser using JavaScript. No data is stored." },
    ];

    return (
        <ToolShell
            title="User Agent Parser"
            description="Deeply analyze User Agent strings to identify browser, OS, device, and engine details."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <ToolInput
                    value={ua}
                    onChange={(val) => parse(val)}
                    placeholder="Paste User Agent string here..."
                    label="User Agent String"
                    heightClass="h-40"
                />

                {parsed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Browser', value: parsed.browser, icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'Operating System', value: parsed.os, icon: Cpu, color: 'text-sky-600', bg: 'bg-sky-50' },
                            { label: 'Platform', value: parsed.platform, icon: parsed.platform === 'Mobile' ? Smartphone : Monitor, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'Engine', value: parsed.engine, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
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
            </div>
        </ToolShell>
    );
}

