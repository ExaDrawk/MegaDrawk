'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolInput } from '@/components/tools/shared/ToolInput';
import { Zap } from 'lucide-react';

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
            setText('Logic violation. Malformed bitstream distribution detected.');
        }
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li><strong>Text-to-Bitstream</strong>: Inject semantic payloads to generate their 8-bit machine-code distribution (binary sequence).</li>
            <li><strong>Bitstream-to-Text</strong>: Re-inject space-separated binary vectors to reconstruct the original semantic string.</li>
            <li>The engine utilizes UTF-16 character mapping for high-fidelity cross-platform data integrity.</li>
            <li>Real-time transcoding designed for low-level data analysis and bit-level validation.</li>
        </ul>
    );

    const faq = [
        { q: "Sector-specific applications?", a: "Optimized for technical environment profiling, educational analysis of low-level architectures, and basic payload obfuscation." },
        { q: "Multi-byte character resilience?", a: "Negative latency. The engine accurately maps complex character sets to individual bit-patterns for standardized recovery." },
    ];

    return (
        <ToolShell
            title="Binary Logic Transcoder"
            description="Professional bi-directional interface for translating semantic payloads into machine-level bitstream distributions."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ToolInput
                        value={text}
                        onChange={textToBinary}
                        label="Semantic Integration"
                        placeholder="Inject semantic payload here..."
                        heightClass="h-80"
                        onClear={() => { setText(''); setBinary(''); }}
                    />
                    <ToolInput
                        value={binary}
                        onChange={binaryToText}
                        label="Bitstream Distribution"
                        placeholder="01001000 01000101..."
                        heightClass="h-80"
                        onClear={() => { setText(''); setBinary(''); }}
                    />
                </div>

                <div className="flex justify-center">
                    <div className="px-8 py-3 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-2 shadow-sm">
                        <Zap size={12} className="text-blue-600 animate-pulse" />
                        Logic Transcoding Active
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
