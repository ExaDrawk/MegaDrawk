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
            platform: result.device.type ? (result.device.type === 'mobile' || result.device.type === 'tablet' ? 'Mobile' : 'Desktop') : 'Desktop',
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
            <li>Auto-detects the <strong>Active Agent Signature</strong> upon initialization of the client environment.</li>
            <li>Inject any remote User Agent string into the <strong>Signature Integration</strong> panel for rapid parsing.</li>
            <li>Deconstructs data into <strong>Kernel, Rendering, and Hardware</strong> vectors for technical profiling.</li>
            <li>Utilizes the industry-standard UAParser engine for high-fidelity deconstruction.</li>
        </ul>
    );

    const faq = [
        { q: "What defines an Agent Signature?", a: "An identification string transmitted by the client during HTTP handshake, detailing the OS, browser version, and hardware platform." },
        { q: "Local data integrity?", a: "Processing is executed strictly within the client sandbox. No telemetry or signatures are transmitted to external servers." },
    ];

    return (
        <ToolShell
            title="Client Intelligence Engine"
            description="High-fidelity deconstruction of User Agent signatures for precise technical environment profiling."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <ToolInput
                    value={ua}
                    onChange={(val) => parse(val)}
                    placeholder="Vector signature injection here..."
                    label="Agent Signature"
                    heightClass="h-40"
                />

                {parsed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Client Environment', value: parsed.browser, icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { label: 'OS Kernel', value: parsed.os, icon: Cpu, color: 'text-sky-600', bg: 'bg-sky-50' },
                            { label: 'Hardware Platform', value: parsed.platform, icon: parsed.platform === 'Mobile' ? Smartphone : Monitor, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { label: 'Rendering Engine', value: parsed.engine, icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
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

