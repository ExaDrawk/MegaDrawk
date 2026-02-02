'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolOutput } from '@/components/tools/shared/ToolOutput';
import { ToolOptionGroup } from '@/components/tools/shared/ToolOptionGroup';
import { RefreshCw } from 'lucide-react';

import { LOREM_EN, LOREM_JP } from '@/config/lorem-data';

export default function LoremIpsumPage() {
    const [count, setCount] = useState(3);
    const [type, setType] = useState<'PARAGRAPH' | 'SENTENCE'>('PARAGRAPH');
    const [lang, setLang] = useState<'EN' | 'JP'>('JP');
    const [output, setOutput] = useState('');

    const generate = () => {
        const pool = lang === 'EN' ? LOREM_EN : LOREM_JP;
        let result = [];
        for (let i = 0; i < count; i++) {
            if (type === 'PARAGRAPH') {
                const shuffled = [...pool].sort(() => 0.5 - Math.random());
                result.push(shuffled.slice(0, 4).join(lang === 'EN' ? ' ' : ''));
            } else {
                result.push(pool[Math.floor(Math.random() * pool.length)]);
            }
        }
        setOutput(result.join(type === 'PARAGRAPH' ? '\n\n' : (lang === 'EN' ? ' ' : '')));
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Select the <strong>Language Vector</strong> (Japanese or English) for text generation.</li>
            <li>Configure the <strong>Granularity</strong> (Sentences or Paragraphs) and <strong>Magnitude</strong> (1-20).</li>
            <li>Execute the <strong>Synthesis Engine</strong> to generate placeholder content for UI/UX prototyping.</li>
            <li>Designed for wireframing, layout stress-testing, and branding visualization.</li>
        </ul>
    );

    const faq = [
        { q: "Is there semantic meaning in the generated strings?", a: "The English vector uses traditional Latin-based Lorem Ipsum. The Japanese vector utilizes abstract, professional linguistic constructs reflective of the MegaDrawk aesthetic." },
        { q: "Usage licensing?", a: "Generated content is released under a zero-restriction protocol. Suitable for commercial or private design integration." },
    ];

    return (
        <ToolShell
            title="Synthetic Content Generator"
            description="High-fidelity placeholder text generation engine for professional UI/UX prototyping and layout calibration."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="flex flex-col gap-12">
                {/* Controls */}
                <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-12 items-end shadow-inner">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Language Vector</label>
                        <ToolOptionGroup
                            value={lang}
                            onChange={(v) => setLang(v as any)}
                            options={[
                                { id: 'JP', label: 'Japanese' },
                                { id: 'EN', label: 'English' }
                            ]}
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center ml-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Magnitude</label>
                            <span className="text-[10px] font-black text-blue-600">{count} Units</span>
                        </div>
                        <div className="px-4">
                            <input
                                type="range"
                                min="1" max="20"
                                value={count}
                                onChange={(e) => setCount(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Granularity</label>
                        <ToolOptionGroup
                            value={type}
                            onChange={(v) => setType(v as any)}
                            options={[
                                { id: 'SENTENCE', label: 'Sentence' },
                                { id: 'PARAGRAPH', label: 'Paragraph' }
                            ]}
                        />
                    </div>
                </div>

                {/* Output */}
                <ToolOutput
                    value={output}
                    label="Synthetic Result"
                    heightClass="h-[500px]"
                    placeholder="Initiate synthesis to generate data..."
                />

                <div className="flex justify-center">
                    <button
                        onClick={generate}
                        className="group relative flex items-center gap-4 px-16 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        Execute Synthesis
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}
