'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolInput } from '@/components/tools/shared/ToolInput';
import { ToolOutput } from '@/components/tools/shared/ToolOutput';

export default function CaseConverterPage() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const convert = (mode: string) => {
        let result = input;
        switch (mode) {
            case 'UPPER': result = input.toUpperCase(); break;
            case 'LOWER': result = input.toLowerCase(); break;
            case 'SNAKE': result = input.trim().replace(/\s+/g, '_').toLowerCase(); break;
            case 'KEBAB': result = input.trim().replace(/\s+/g, '-').toLowerCase(); break;
            case 'CAMEL':
                result = input.trim().toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
                break;
            case 'PASCAL':
                const camel = input.trim().toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
                result = camel.charAt(0).toUpperCase() + camel.slice(1);
                break;
            case 'TITLE':
                result = input.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                break;
        }
        setOutput(result);
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Inject your <strong>Semantic Payload</strong> into the integration console.</li>
            <li>Select a <strong>Casing Vector</strong> (e.g., snake_case, PascalCase) to execute a lexical transformation.</li>
            <li>The <strong>Transformed Result</strong> is instantly generated for deployment in source code or URI slugs.</li>
            <li>Optimized for architectural naming conventions and standardized documentation schemas.</li>
        </ul>
    );

    const faq = [
        { q: "Supported Casing Vectors?", a: "The architecture supports standard distributions: UPPER, lower, Snake, Kebab, Camel, Pascal, and Title-level transformations." },
        { q: "Developer-centric utility?", a: "Affirmative. Specifically engineered to accelerate variable naming, slug generation, and structural refactoring workflows." },
    ];

    const CaseButton = ({ label, mode }: { label: string, mode: string }) => (
        <button
            onClick={() => convert(mode)}
            className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm hover:shadow-xl active:scale-95"
        >
            {label}
        </button>
    );

    return (
        <ToolShell
            title="Syntax Case Architect"
            description="Professional engine for executing lexical transformations between standardized casing vectors and architectural naming conventions."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <div className="flex flex-wrap gap-4 justify-center bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    <CaseButton label="SCREAMING_SNAKE" mode="UPPER" />
                    <CaseButton label="lowercase" mode="LOWER" />
                    <CaseButton label="Title Case" mode="TITLE" />
                    <CaseButton label="snake_case" mode="SNAKE" />
                    <CaseButton label="kebab-case" mode="KEBAB" />
                    <CaseButton label="camelCase" mode="CAMEL" />
                    <CaseButton label="PascalCase" mode="PASCAL" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ToolInput
                        value={input}
                        onChange={setInput}
                        placeholder="Inject semantic payload..."
                        label="Payload Integration"
                        onClear={() => { setInput(''); setOutput(''); }}
                    />
                    <ToolOutput
                        value={output}
                        label="Transformed Result"
                        placeholder="Awaiting transformation..."
                    />
                </div>
            </div>
        </ToolShell>
    );
}
