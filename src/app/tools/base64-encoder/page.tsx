'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolInput } from '@/components/tools/shared/ToolInput';
import { ToolOutput } from '@/components/tools/shared/ToolOutput';
import { ToolOptionGroup } from '@/components/tools/shared/ToolOptionGroup';
import CryptoJS from 'crypto-js';

export default function Base64ToolPage() {
    const [mode, setMode] = useState<'ENCODE' | 'DECODE'>('ENCODE');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const process = (val: string, currentMode: 'ENCODE' | 'DECODE') => {
        setInput(val);
        setError('');
        if (!val) {
            setOutput('');
            return;
        }

        try {
            if (currentMode === 'ENCODE') {
                const utf8Words = CryptoJS.enc.Utf8.parse(val);
                const result = CryptoJS.enc.Base64.stringify(utf8Words);
                setOutput(result);
            } else {
                try {
                    const decodedWords = CryptoJS.enc.Base64.parse(val);
                    const result = CryptoJS.enc.Utf8.stringify(decodedWords);
                    if (!result && val.trim().length > 0) throw new Error('Invalid conversion');
                    setOutput(result);
                } catch (e) {
                    setError('Invalid Serialization: Malformed Base64 stream detected.');
                    setOutput('');
                }
            }
        } catch (e) {
            setError('Operational failure during logic transcoding.');
        }
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li><strong>Encapsulation Vector</strong>: Map semantic plaintext payloads into standardized Base64 binary serialization.</li>
            <li><strong>Extraction Protocol</strong>: Reconstruct high-fidelity UTF-8 strings from existing Base64 encoded streams.</li>
            <li>Utilizes full character-set mapping for the safe deconstruction of multi-byte data profiles and architectural symbols.</li>
            <li>Real-time serialization optimized for secure data transmission and network-safe payloads.</li>
        </ul>
    );

    const faq = [
        { q: "Is high-fidelity mapping supported?", a: "Yes. The architecture utilizes UTF-8 block parsing to ensure no data loss during complex multi-byte character transformation." },
        { q: "Data sovereignty policy?", a: "Affirmative. The entire transcoding process is executed within the client-side sandbox. No external network requests are initiated for processing." }
    ];

    return (
        <ToolShell
            title="Base64 Serialization Engine"
            description="Professional high-fidelity encoding and decoding system for mapping data payloads into robust Base64 binary serialization."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="flex flex-col gap-12">
                <div className="flex justify-center">
                    <ToolOptionGroup
                        value={mode}
                        onChange={(id) => {
                            setMode(id as any);
                            process(input, id as any);
                        }}
                        options={[
                            { id: 'ENCODE', label: 'Encapsulate (Payload → B64)' },
                            { id: 'DECODE', label: 'Extract (B64 → Payload)' }
                        ]}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ToolInput
                        value={input}
                        onChange={(val) => process(val, mode)}
                        placeholder={mode === 'ENCODE' ? "Inject payload source..." : "Inject Base64 stream..."}
                        onClear={() => process('', mode)}
                        label="Source Integration"
                        heightClass="h-72"
                    />

                    <ToolOutput
                        value={output}
                        error={error}
                        label="Transcoded Result"
                        heightClass="h-72"
                    />
                </div>
            </div>
        </ToolShell>
    );
}

