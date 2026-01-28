'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Copy, RefreshCw, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

export default function PasswordGeneratorPage() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [strength, setStrength] = useState(0); // 0-100

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
        const crypto = window.crypto;
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            result += chars[array[i] % chars.length];
        }
        setPassword(result);
        calculateStrength(result);
    };

    const calculateStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length > 8) score += 20;
        if (pwd.length > 12) score += 20;
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

    const getStrengthColor = () => {
        if (strength < 40) return 'text-red-500 bg-red-500';
        if (strength < 70) return 'text-yellow-500 bg-yellow-500';
        return 'text-green-500 bg-green-500';
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-2">
            <li>Adjust the <strong>Length</strong> slider to your desired complexity (12+ recommended).</li>
            <li>Toggle character sets (Uppercase, Numbers, Symbols) to meet specific requirements.</li>
            <li>Press the <RefreshCw className="inline w-4 h-4" /> icon to generate a new random combination.</li>
            <li>Click the Copy button to save it to your clipboard.</li>
        </ul>
    );

    const faq = [
        { q: "Is it secure?", a: "Yes. We use the browser's native `window.crypto` API for cryptographically secure random number generation." },
        { q: "Do you save my passwords?", a: "Absolutely not. The password is generated locally on your device and disappears when you close the tab." },
    ];

    return (
        <ToolShell
            title="Secure Password Generator"
            description="Create uncrackable, cryptographically secure passwords instantly."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="max-w-3xl mx-auto space-y-12">

                {/* Display */}
                <div className="relative group">
                    <div className="bg-[#0b1121] border-2 border-slate-800 rounded-2xl p-8 flex items-center justify-between shadow-inner">
                        <div className="font-mono text-2xl md:text-4xl text-white tracking-widest break-all">
                            {password}
                        </div>
                        <div className="flex gap-4 pl-4 shrink-0">
                            <button onClick={generate} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all">
                                <RefreshCw size={24} />
                            </button>
                            <button onClick={copyToClipboard} className="p-3 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-105">
                                <Copy size={24} />
                            </button>
                        </div>
                    </div>
                    {/* Strength Bar */}
                    <div className="h-1.5 w-full bg-slate-800 mt-0 rounded-b-2xl overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${getStrengthColor().split(' ')[1]}`}
                            style={{ width: `${strength}%` }}
                        />
                    </div>
                    <div className={`mt-2 text-right text-xs font-bold uppercase tracking-widest ${getStrengthColor().split(' ')[0]}`}>
                        {strength < 40 ? 'Weak' : strength < 70 ? 'Moderate' : 'Very Strong'}
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                    <div className="space-y-6">
                        <label className="block">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-slate-300">Length</span>
                                <span className="font-mono text-cyan-400">{length}</span>
                            </div>
                            <input
                                type="range"
                                min="6" max="64"
                                value={length}
                                onChange={(e) => setLength(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Lowercase (a-z)', state: includeLowercase, set: setIncludeLowercase },
                            { label: 'Uppercase (A-Z)', state: includeUppercase, set: setIncludeUppercase },
                            { label: 'Numbers (0-9)', state: includeNumbers, set: setIncludeNumbers },
                            { label: 'Symbols (!@#)', state: includeSymbols, set: setIncludeSymbols },
                        ].map((opt, i) => (
                            <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${opt.state ? 'bg-cyan-500 border-cyan-500' : 'bg-transparent border-slate-600 group-hover:border-slate-500'}`}>
                                    {opt.state && <CheckCircle size={14} className="text-white" />}
                                </div>
                                <input type="checkbox" checked={opt.state} onChange={() => opt.set(!opt.state)} className="hidden" />
                                <span className={`text-sm font-medium ${opt.state ? 'text-white' : 'text-slate-500'}`}>{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

            </div>
        </ToolShell>
    );
}
