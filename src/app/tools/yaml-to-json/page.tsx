'use client';

import React, { useState, useEffect } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { ToolInput } from '@/components/tools/shared/ToolInput';
import { ToolOutput } from '@/components/tools/shared/ToolOutput';
import { ToolOptionGroup } from '@/components/tools/shared/ToolOptionGroup';
import yaml from 'js-yaml';

export default function YamlToJsonPage() {
    const [input, setInput] = useState('name: MegaDrawk\nversion: 1.0.0\nfeatures:\n  - speed\n  - precision\n  - logic');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<'YAML_TO_JSON' | 'JSON_TO_YAML'>('YAML_TO_JSON');
    const [error, setError] = useState('');

    const process = (val: string, m: 'YAML_TO_JSON' | 'JSON_TO_YAML') => {
        setError('');
        if (!val.trim()) { setOutput(''); return; }
        try {
            if (m === 'YAML_TO_JSON') {
                const obj = yaml.load(val);
                setOutput(JSON.stringify(obj, null, 4));
            } else {
                const obj = JSON.parse(val);
                setOutput(yaml.dump(obj));
            }
        } catch (e: any) {
            setError(m === 'YAML_TO_JSON' ? 'Invalid YAML schema' : 'Invalid JSON schema');
        }
    };

    useEffect(() => {
        process(input, mode);
    }, [input, mode]);

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li>Select the <strong>Transformation Vector</strong> (YAML to JSON or JSON to YAML).</li>
            <li>Input your configuration source into the <strong>Schema Integration</strong> panel.</li>
            <li>The <strong>Formatted Output</strong> highlights structural errors in real-time.</li>
            <li>Optimized for Kubernetes manifests, Docker configurations, and multi-layered API structures.</li>
        </ul>
    );

    const faq = [
        { q: "What is the primary difference between YAML and JSON?", a: "JSON prioritizes strict syntax with delimiters like braces and double quotes. YAML emphasizes indentation-based structural logic, optimized for human readability and modularity." },
        { q: "Does the engine support massive datasets?", a: "The processing engine is optimized for standard configuration payloads (up to 500KB). For high-volume multi-megabyte data, the performance depends on the client-side execution thread." },
    ];

    return (
        <ToolShell
            title="Schema Transcoder"
            description="High-fidelity bidirectional conversion between YAML and JSON configuration schemas with real-time validation."
            howToUse={howToUse}
            faq={faq}
        >
            <div className="space-y-12">
                <div className="flex justify-center">
                    <ToolOptionGroup
                        options={[
                            { label: 'YAML → JSON', id: 'YAML_TO_JSON' },
                            { label: 'JSON → YAML', id: 'JSON_TO_YAML' }
                        ]}
                        value={mode}
                        onChange={(v) => setMode(v as any)}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ToolInput
                        value={input}
                        onChange={setInput}
                        label={`Source (${mode === 'YAML_TO_JSON' ? 'YAML' : 'JSON'})`}
                        placeholder="Enter configuration code..."
                        heightClass="h-[500px]"
                        onClear={() => setInput('')}
                    />
                    <ToolOutput
                        value={output}
                        label={`Result (${mode === 'YAML_TO_JSON' ? 'JSON' : 'YAML'})`}
                        heightClass="h-[500px]"
                        error={error}
                    />
                </div>
            </div>
        </ToolShell>
    );
}
