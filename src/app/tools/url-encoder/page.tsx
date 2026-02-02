'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolInput } from '@/components/tools/shared/ToolInput';
import { ToolOutput } from '@/components/tools/shared/ToolOutput';
import { ToolOptionGroup } from '@/components/tools/shared/ToolOptionGroup';

export default function UrlEncoderPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [mode, setMode] = useState<'ENCODE' | 'DECODE'>('ENCODE');

    const handleProcess = (val: string, m: 'ENCODE' | 'DECODE') => {
        setInput(val);
        if (!val) {
            setOutput('');
            setError('');
            return;
        }
        try {
            if (m === 'ENCODE') {
                setOutput(encodeURIComponent(val));
            } else {
                setOutput(decodeURIComponent(val));
            }
            setError('');
        } catch (e) {
            setError('Transcode violation. Malformed percent-encoding sequence detected.');
            setOutput('');
        }
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Initialize <strong>Encapsulation Mode</strong> to sanitize strings for secure network transmission (percent-encoding).</li>
            <li>Enable <strong>Extraction Mode</strong> to revert percent-encoded vectors back to their human-readable baseline.</li>
            <li>Multi-byte characters and logical delimiters are transformed into safe `%xx` hex distributions during transcoding.</li>
            <li>Engine compliant with RFC 3986 standards for URI protocol structural integrity.</li>
        </ul>
    );

    const faq = [
        { q: "Why is network transcoding critical?", a: "URI architectures are restricted to specific character sets. Spaces and reserved delimiters must be encapsulated to prevent structural failure in query parameters." },
        { q: "Resolution level?", a: "The engine utilizes `encodeURIComponent` logic, ensuring all reserved characters including '/' and ':' are sanitized for nested parameter integration." },
    ];

    return (
        <ToolShell
            title="URI Protocol Transcoder"
            description="High-fidelity encoding and decoding of data strings for standardized URI protocol integration and network resilience."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <div className="flex justify-center flex-col items-center gap-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Transcode Vector</label>
                    <ToolOptionGroup
                        options={[
                            { label: 'Encapsulation', id: 'ENCODE' },
                            { label: 'Extraction', id: 'DECODE' },
                        ]}
                        value={mode}
                        onChange={(v) => {
                            const newMode = v as 'ENCODE' | 'DECODE';
                            setMode(newMode);
                            handleProcess(input, newMode);
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ToolInput
                        value={input}
                        onChange={(v) => handleProcess(v, mode)}
                        placeholder="Inject data string here..."
                        label="URI Integration"
                        onClear={() => {
                            setInput('');
                            setOutput('');
                            setError('');
                        }}
                    />
                    <ToolOutput
                        value={output}
                        error={error}
                        label="Transcoded Result"
                        placeholder="Awaiting data injection..."
                    />
                </div>
            </div>
        </ToolShell>
    );
}
