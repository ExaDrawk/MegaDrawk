import { FileJson, Hash, Code, Palette, Type, Shield, Clock, Calculator, Globe, Image, Database, Link, Key, Box, LayoutGrid } from 'lucide-react';

export type ToolCategory = 'Developer' | 'Design' | 'Text' | 'Security' | 'Productivity';

export interface ToolMeta {
    slug: string;
    title: string;
    description: string;
    category: ToolCategory;
    icon: any;
    path: string;
}

export const TOOLS_REGISTRY: ToolMeta[] = [
    // Developer
    { slug: 'json-validator', title: 'JSON Validator & Beautifier', description: 'Validate, format, and fix your JSON data with advanced error highlighting.', category: 'Developer', icon: FileJson, path: '/tools/json-validator' },
    { slug: 'base64-encoder', title: 'Base64 Encoder/Decoder', description: 'Convert text and files to Base64 format and back instantly.', category: 'Developer', icon: Code, path: '/tools/base64-encoder' },
    { slug: 'sql-formatter', title: 'SQL Formatter', description: 'Prettify generic SQL, PostgreSQL, MySQL or Oracle queries.', category: 'Developer', icon: Database, path: '/tools/sql-formatter' },

    // Security
    { slug: 'password-generator', title: 'Secure Password Generator', description: 'Generate high-entropy passwords with custom character sets.', category: 'Security', icon: Key, path: '/tools/password-generator' },
    { slug: 'hash-generator', title: 'Hash Calculator', description: 'Compute MD5, SHA-1, SHA-256 hashes for any text input.', category: 'Security', icon: Shield, path: '/tools/hash-generator' },

    // Design
    { slug: 'contrast-checker', title: 'Contrast Ratio Checker', description: 'Validate color combos against WCAG AA/AAA accessibility standards.', category: 'Design', icon: Palette, path: '/tools/contrast-checker' },
    { slug: 'px-to-rem', title: 'PX to REM Converter', description: 'Essential CSS unit converter for responsive web design.', category: 'Design', icon: LayoutGrid, path: '/tools/px-to-rem' },

    // Text
    { slug: 'word-counter', title: 'Word & Character Counter', description: 'Analyze text density, reading time, and keyword frequency.', category: 'Text', icon: Type, path: '/tools/word-counter' },
    { slug: 'lorem-ipsum', title: 'Lorem Ipsum Generator', description: 'Generate placeholder text in various formats and styles.', category: 'Text', icon: Type, path: '/tools/lorem-ipsum' },

    // Productivity
    { slug: 'pomodoro-timer', title: 'Focus Pomodoro Timer', description: 'Boost productivity with customizable work/break intervals.', category: 'Productivity', icon: Clock, path: '/tools/pomodoro-timer' },
    { slug: 'qr-generator', title: 'QR Code Generator', description: 'Create custom QR codes for URLs, WiFi, and more.', category: 'Productivity', icon: Box, path: '/tools/qr-generator' },
];

export const ALL_TOOLS = TOOLS_REGISTRY.sort((a, b) => a.title.localeCompare(b.title));

export const TOOLS_BY_CATEGORY = TOOLS_REGISTRY.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
}, {} as Record<ToolCategory, ToolMeta[]>);
