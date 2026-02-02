'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PasswordGeneratorPage() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(24);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [strength, setStrength] = useState(0);

    const generate = () => {
        let chars = '';
        if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) chars += '0123456789';
        if (includeSymbols) chars += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        if (chars === '') {
            setPassword('');
            return;
        }

        let result = '';
        const cryptoContent = window.crypto;
        const array = new Uint32Array(length);
        cryptoContent.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            result += chars[array[i] % chars.length];
        }
        setPassword(result);
        calculateStrength(result);
    };

    const calculateStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length > 8) score += 20;
        if (pwd.length > 16) score += 20;
        if (/[A-Z]/.test(pwd)) score += 15;
        if (/[a-z]/.test(pwd)) score += 15;
        if (/[0-9]/.test(pwd)) score += 15;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 15;
        setStrength(Math.min(100, score));
    };

    useEffect(() => {
        generate();
    }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
    };

    const getStrengthLabel = () => {
        if (strength < 40) return 'Vulnerable (Weak)';
        if (strength < 80) return 'Operational (Moderate)';
        return 'Top Secret (Maximum Entropy)';
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Adjust the <strong>Entropy Magnitude</strong> (length) slider to define your security threshold (20+ recommended).</li>
            <li>Configure the <strong>Complexity Vector</strong> by toggling uppercase, numerical, and symbolic injection.</li>
            <li>Execute the <strong>Randomization Engine</strong> to generate a cryptographically resilient character string.</li>
            <li>Utilize the <strong>Copy Protocol</strong> to extract the generated secret into your integration layer.</li>
        </ul>
    );

    const faq = [
        { q: "Is the entropy generation cryptographically secure?", a: "Yes. The engine utilizes the industry-standard `window.crypto` API for generating high-entropy pseudo-random character distributions." },
        { q: "Data persistence policy?", a: "Negative. The generated secrets exist exclusively within the local process heap/memory and are never transmitted to external nodes or logs." },
    ];

    return (
        <ToolShell
            title="Entropy Generation Engine"
            description="Generate high-entropy, cryptographically secure character strings for mission-critical access control."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="max-w-4xl mx-auto space-y-20">
                {/* Display Section */}
                <div className="relative group">
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />

                        <div className="font-mono text-3xl md:text-5xl text-slate-900 tracking-[0.1em] break-all leading-relaxed text-center md:text-left select-all">
                            {password}
                        </div>

                        <div className="flex gap-4 shrink-0">
                            <button onClick={generate} className="p-5 bg-slate-50 border border-slate-100 hover:border-blue-500/30 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm">
                                <RefreshCw size={24} />
                            </button>
                            <button onClick={copyToClipboard} className="p-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black hover:scale-105 transition-all shadow-2xl shadow-blue-500/20 flex items-center gap-2">
                                <Copy size={18} />
                                COPY SECRETS
                            </button>
                        </div>
                    </div>

                    {/* Strength Indicator Overlay */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%]">
                        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-2xl px-8 py-3 flex items-center justify-between shadow-xl">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${strength < 40 ? 'bg-rose-500' : strength < 80 ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${strength < 40 ? 'text-rose-600' : strength < 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                    {getStrengthLabel()}
                                </span>
                            </div>
                            <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${strength}%` }}
                                    className={`h-full ${strength < 40 ? 'bg-rose-500' : strength < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Configuration Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 shadow-inner">
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-end mb-6 ml-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Magnitude (Length)</span>
                                <span className="text-4xl font-black text-blue-600 italic leading-none">{length}</span>
                            </div>
                            <input
                                type="range"
                                min="12" max="64"
                                value={length}
                                onChange={(e) => setLength(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                        <p className="text-xs text-slate-400 font-medium ml-4 uppercase tracking-widest">
                            RECOMMENDED: 20+ CHARACTERS
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { label: 'Lowercase (a-z)', state: includeLowercase, set: setIncludeLowercase },
                            { label: 'Uppercase (A-Z)', state: includeUppercase, set: setIncludeUppercase },
                            { label: 'Numerical (0-9)', state: includeNumbers, set: setIncludeNumbers },
                            { label: 'Symbolic (!@#)', state: includeSymbols, set: setIncludeSymbols },
                        ].map((opt, i) => (
                            <label key={i} className="flex items-center justify-between px-6 py-4 rounded-2xl bg-white border border-slate-100 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group shadow-sm">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${opt.state ? 'text-slate-900' : 'text-slate-400'}`}>{opt.label}</span>
                                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${opt.state ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-transparent border-slate-100 text-transparent'}`}>
                                    <Check size={14} strokeWidth={4} />
                                </div>
                                <input type="checkbox" checked={opt.state} onChange={() => opt.set(!opt.state)} className="hidden" />
                            </label>
                        ))}
                    </div>
                </div>

            </div>
        </ToolShell>
    );
}
