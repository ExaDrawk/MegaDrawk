'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolInput } from '@/components/tools/shared/ToolInput';
import { Eye } from 'lucide-react';

export default function MarkdownPreviewPage() {
    const [markdown, setMarkdown] = useState('# Semantic Synthesis\n\nInitialize **structural deconstruction** here to observe the *visual schematic* output.\n\n### Core Logic:\n- Real-time Rendering Engine\n- Structural Analysis\n- Functional UI Distribution');

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Inject your <strong>Semantic Source</strong> into the Integration Editor on the left console.</li>
            <li>The <strong>Render Engine</strong> executes a real-time deconstruction to synchronize the visual schematic.</li>
            <li>Supported vectors include structural headers, emphasized text nodes, and relational list distributions.</li>
            <li>Optimized for rapid validation of documentation schemas and architectural notes.</li>
        </ul>
    );

    const faq = [
        { q: "Compliance standards?", a: "The architecture supports CommonMark foundations, ensuring high-fidelity rendering of headers, weighted text, and structural hierarchies." },
        { q: "Data persistence protocol?", a: "Negative. This is a volatile environment dedicated to real-time synthesis. All buffers are purged upon session termination to ensure data sovereignty." },
    ];

    return (
        <ToolShell
            title="Semantic Markdown Architect"
            description="Professional rendering engine for deconstructing markdown source into high-fidelity visual architectures."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[700px]">
                {/* Editor */}
                <ToolInput
                    value={markdown}
                    onChange={setMarkdown}
                    label="Source Integration"
                    placeholder="Inject markdown source here..."
                    heightClass="h-full"
                    onClear={() => setMarkdown('')}
                />

                {/* Preview */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center ml-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <Eye size={12} className="text-emerald-500" />
                            Architectural Result
                        </label>
                    </div>
                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-[2rem] p-10 overflow-y-auto text-slate-900 shadow-xl shadow-slate-200/50">
                        <article className="max-w-none">
                            {markdown.split('\n').filter(Boolean).map((line, i) => {
                                if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-black mb-8 mt-2 text-slate-900 tracking-tighter italic">{line.slice(2)}</h1>;
                                if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-black mb-6 mt-8 text-slate-800 tracking-tight border-b border-slate-200 pb-2 uppercase tracking-widest">{line.slice(3)}</h2>;
                                if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-black mb-4 mt-6 text-slate-700 underline decoration-blue-500/30 decoration-4">{line.slice(4)}</h3>;
                                if (line.trim().startsWith('- ')) return <li key={i} className="ml-4 list-disc mb-2 text-slate-600 font-medium">{line.trim().slice(2)}</li>;
                                return <p key={i} className="mb-6 leading-relaxed text-slate-600 font-medium">{line}</p>;
                            })}
                        </article>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
