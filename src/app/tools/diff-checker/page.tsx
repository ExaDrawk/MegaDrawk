'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolInput } from '@/components/tools/shared/ToolInput';
import { Eye, Split } from 'lucide-react';
import * as Diff from 'diff';

export default function DiffCheckerPage() {
    const [original, setOriginal] = useState('// Old Code\nconst name = "MegaDrawk";\nconsole.log(name);');
    const [modified, setModified] = useState('// New Code\nconst name = "MegaDrawk Industries";\nconsole.log(name);\nconsole.log("System Initialized");');
    const [diffResult, setDiffResult] = useState<Diff.Change[]>([]);
    const [isComparing, setIsComparing] = useState(false);

    const compare = () => {
        const changes = Diff.diffLines(original, modified);
        setDiffResult(changes);
        setIsComparing(true);
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Input your <strong>Baseline Source</strong> data into the left integration panel.</li>
            <li>Paste the <strong>Candidate Version</strong> into the right integration panel for comparison.</li>
            <li>Execute the <strong>Structural Analysis</strong> engine to identify line-level transformations.</li>
            <li>Red highlights indicate removals; emerald highlights indicate successful injections.</li>
        </ul>
    );

    const faq = [
        { q: "What is the analysis granularity?", a: "This engine operates at a line-level granularity, optimized for source code validation and document versioning audits." },
        { q: "Is the data handled securely?", a: "Affirmative. The comparison algorithm executes locally within the client-side session. No data exceeds the local sandbox environment." },
    ];

    return (
        <ToolShell
            title="Structural Diff Engine"
            description="High-precision analysis for detecting structural deviations between two data sources."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                {!isComparing ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ToolInput
                            value={original}
                            onChange={setOriginal}
                            label="Baseline Source"
                            placeholder="Enter original text..."
                            heightClass="h-80"
                            onClear={() => setOriginal('')}
                        />
                        <ToolInput
                            value={modified}
                            onChange={setModified}
                            label="Candidate Version"
                            placeholder="Enter modified text..."
                            heightClass="h-80"
                            onClear={() => setModified('')}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center ml-6">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-2">
                                <Eye size={12} />
                                Analysis Result Report
                            </label>
                            <button onClick={() => setIsComparing(false)} className="text-[10px] font-black text-blue-600 hover:text-black transition-colors uppercase tracking-widest border-b border-blue-200">Return to Integration</button>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 min-h-[400px] shadow-inner overflow-x-auto">
                            <div className="font-mono text-sm leading-relaxed">
                                {diffResult.length > 0 ? diffResult.map((part, i) => (
                                    <div
                                        key={i}
                                        className={`whitespace-pre-wrap p-3 my-1 rounded-xl border-l-4 transition-all ${part.added ? 'bg-emerald-50 text-emerald-700 border-emerald-500 font-medium' :
                                            part.removed ? 'bg-rose-50 text-rose-700 border-rose-500 line-through opacity-70' :
                                                'text-slate-400 opacity-60'
                                            }`}
                                    >
                                        <span className="inline-block w-6 opacity-30 select-none font-bold">
                                            {part.added ? '+ ' : part.removed ? '- ' : '  '}
                                        </span>
                                        {part.value}
                                    </div>
                                )) : <div className="p-20 text-slate-300 text-center font-black uppercase tracking-[0.3em] italic">No structural delta detected</div>}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-center">
                    <button
                        onClick={compare}
                        className="group relative flex items-center gap-4 px-16 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <Split size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                        Execute Structural Analysis
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}
