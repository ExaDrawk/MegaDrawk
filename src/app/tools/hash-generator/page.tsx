'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolInput } from '@/components/tools/shared/ToolInput';
import { ToolOutput } from '@/components/tools/shared/ToolOutput';
import { ShieldCheck } from 'lucide-react';
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

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Inject the <strong>Seed Data</strong> into the primary integration panel for real-time cryptographic deconstruction.</li>
            <li>The engine automatically derives MD5, SHA-1, SHA-256, and SHA-512 <strong>Digital Fingerprints</strong>.</li>
            <li>Utilize the generated hashes for data integrity verification, file checksums, and architectural security audits.</li>
            <li>Operations execute within the client-side sandbox using high-fidelity cryptographic algorithms.</li>
        </ul>
    );

    const faq = [
        { q: "What defines a Cryptographic Digest?", a: "A digest is a fixed-length hexadecimal distribution derived through one-way mathematical transformation, ensuring the source payload cannot be reconstructed from the fingerprint." },
        { q: "Security vs Performance?", a: "MD5/SHA-1 are optimized for integrity checks (checksums). For architectural security or password hashing, higher-entropy vectors like Argon2 are recommended over basic digests." },
    ];

    return (
        <ToolShell
            title="Cryptographic Digest Engine"
            description="High-fidelity generation of secure MD5, SHA-1, SHA-256, and SHA-512 digital fingerprints for data integrity and security audit."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <ToolInput
                    value={input}
                    onChange={setInput}
                    placeholder="Inject seed data for digestion..."
                    label="Seed Integration"
                    heightClass="h-48"
                    onClear={() => setInput('')}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ToolOutput label="MD5 Fingerprint" value={hashes.md5} placeholder="Awaiting seed..." heightClass="h-32" />
                    <ToolOutput label="SHA-1 Fingerprint" value={hashes.sha1} placeholder="Awaiting seed..." heightClass="h-32" />
                    <ToolOutput label="SHA-256 Vector" value={hashes.sha256} placeholder="Awaiting seed..." heightClass="h-32" />
                    <ToolOutput label="SHA-512 Vector" value={hashes.sha512} placeholder="Awaiting seed..." heightClass="h-32" />
                </div>

                <div className="flex justify-center pt-8">
                    <div className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 shadow-sm">
                        <ShieldCheck size={14} className="animate-pulse" />
                        CRYPTO ENGINE SECURE
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
