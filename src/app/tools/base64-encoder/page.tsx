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
                    if (!result) throw new Error('Invalid conversion');
                    setOutput(result);
                } catch (e) {
                    setError('Invalid Base64 string');
                    setOutput('');
                }
            }
        } catch (e) {
            setError('Conversion failed');
        }
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li><strong>Encode</strong>: Convert text to Base64 format.</li>
            <li><strong>Decode</strong>: Restore text from Base64 string.</li>
            <li>Supports UTF-8 characters (Japanese, Emoji, etc.) safely.</li>
        </ul>
    );

    const faq = [
        { q: "Is Japanese supported?", a: "Yes, this tool uses UTF-8 encoding via CryptoJS, ensuring multi-byte characters are handled correctly." },
        { q: "Data Privacy?", a: "All conversion happens entirely in your browser. No data is sent to any server." }
    ];

    return (
        <ToolShell
            title="Base64 Converter"
            description="Securely encode and decode text to Base64 format with full UTF-8 support."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="flex flex-col gap-12">
                <ToolOptionGroup
                    value={mode}
                    onChange={(id) => {
                        setMode(id as any);
                        process(input, id as any);
                    }}
                    options={[
                        { id: 'ENCODE', label: 'Encode (Text → B64)' },
                        { id: 'DECODE', label: 'Decode (B64 → Text)' }
                    ]}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ToolInput
                        value={input}
                        onChange={(val) => process(val, mode)}
                        placeholder={mode === 'ENCODE' ? "Enter text here..." : "Paste Base64 string here..."}
                        onClear={() => process('', mode)}
                        label="Input"
                    />

                    <ToolOutput
                        value={output}
                        error={error}
                        label="Output"
                    />
                </div>
            </div>
        </ToolShell>
    );
}

