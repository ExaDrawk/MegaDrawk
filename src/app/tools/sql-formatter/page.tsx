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
            setError('Failed to format SQL. Check syntax.');
        }
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Paste your SQL query into the left Input area.</li>
            <li>Select your SQL dialect (PostgreSQL, MySQL, etc.).</li>
            <li>Click "<strong>Format SQL</strong>" to prettify and indent.</li>
            <li>Copy the result from the Output area.</li>
        </ul>
    );

    const faq = [
        { q: "What does this tool do?", a: "It capitalizes keywords (SELECT, FROM, WHERE), adds proper indentation, and separates queries for maximum readability." },
        { q: "Does it support nested queries?", a: "Yes. Complex subqueries and joins are formatted with proper hierarchy." },
    ];

    return (
        <ToolShell
            title="SQL Formatter"
            description="Instantly beautify and structure complex SQL queries."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="flex flex-col gap-12">
                <ToolOptionGroup
                    options={languages}
                    value={language}
                    onChange={setLanguage}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ToolInput
                        value={input}
                        onChange={setInput}
                        placeholder="SELECT * FROM users WHERE active = 1..."
                        label="Input SQL"
                        onClear={() => setInput('')}
                        heightClass="h-96"
                    />

                    <ToolOutput
                        value={output}
                        error={error}
                        label="Formatted SQL"
                        heightClass="h-96"
                    />
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={formatSql}
                        className="group relative flex items-center gap-3 px-16 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                    >
                        <Database size={18} className="group-hover:translate-y-[-2px] transition-transform" />
                        Format SQL
                        <Zap size={14} className="ml-1 opacity-50 animate-pulse" />
                    </button>
                </div>
            </div>
        </ToolShell>
    );
}

