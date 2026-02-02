'use client';

import React, { useState } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolInput } from '@/components/tools/shared/ToolInput';
import { ToolOutput } from '@/components/tools/shared/ToolOutput';
import { ToolOptionGroup } from '@/components/tools/shared/ToolOptionGroup';
import { format } from 'sql-formatter';
import { Database, Zap } from 'lucide-react';

export default function SqlFormatterPage() {
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState<any>('sql');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');

    const languages = [
        { id: 'sql', label: 'Standard SQL' },
        { id: 'postgresql', label: 'PostgreSQL' },
        { id: 'mysql', label: 'MySQL' },
        { id: 'mariadb', label: 'MariaDB' },
        { id: 'sqlite', label: 'SQLite' },
        { id: 'tsql', label: 'T-SQL' },
    ];

    const formatSql = () => {
        if (!input.trim()) return;
        try {
            const result = format(input, {
                language: language,
                tabWidth: 4,
                keywordCase: 'upper',
                linesBetweenQueries: 2,
            });
            setOutput(result);
            setError('');
        } catch (e: any) {
            setError('Architectural failure. Coordinate-syntax verification failed.');
        }
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Inject your raw relational query into the <strong>Query Integration</strong> panel.</li>
            <li>Select the appropriate <strong>Dialect Vector</strong> (PostgreSQL, MySQL, etc.) for syntax alignment.</li>
            <li>Execute the <strong>Architectural Layout</strong> to normalize keyword casing and structural indentation.</li>
            <li>Design optimized for nested subqueries and complex relational JOIN operations.</li>
        </ul>
    );

    const faq = [
        { q: "What parameters are optimized?", a: "The engine enforces keyword capitalization (DML/DDL), logical indentation, and query isolation for maximum cognitive clarity." },
        { q: "Support for non-standard dialects?", a: "Yes. The system supports multiple legacy and modern T-SQL, MariaDB, and SQLite extensions." },
    ];

    return (
        <ToolShell
            title="Relational Query Architect"
            description="Professional SQL normalization engine for structuring complex database queries into standardized architectural layouts."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="flex flex-col gap-12">
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Dialect Vector</label>
                    <ToolOptionGroup
                        options={languages}
                        value={language}
                        onChange={setLanguage}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ToolInput
                        value={input}
                        onChange={setInput}
                        placeholder="SELECT * FROM node_map WHERE active = 1..."
                        label="Query Integration"
                        onClear={() => setInput('')}
                        heightClass="h-96"
                    />

                    <ToolOutput
                        value={output}
                        error={error}
                        label="Architectural Result"
                        heightClass="h-96"
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={formatSql}
                        className="group relative flex items-center gap-3 px-16 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <Database size={18} className="group-hover:translate-y-[-2px] transition-transform" />
                        Execute Architectural Layout
                        <Zap size={14} className="ml-1 opacity-50 animate-pulse" />
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}

