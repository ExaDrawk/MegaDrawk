import { FileJson, Hash, Code, Palette, Type, Shield, Clock, Calculator, Globe, Image, Database, Link, Key, Box, LayoutGrid, FileCode, Split, Fingerprint, Search, FileText, Minimize2, Maximize, Smartphone, Layers, Percent, Binary } from 'lucide-react';

export type ToolCategory = 'Engineering' | 'Design' | 'Content' | 'Security' | 'Workflow';

export interface ToolMeta {
    slug: string;
    title: string;
    description: string;
    category: ToolCategory;
    icon: any;
    path: string;
}

export const TOOLS_REGISTRY: ToolMeta[] = [
    // Engineering
    { slug: 'json-validator', title: 'Structural JSON Validator', description: 'High-fidelity debugging and formatting engine for ensuring absolute integrity in JSON data structures.', category: 'Engineering', icon: FileJson, path: '/tools/json-validator' },
    { slug: 'base64-encoder', title: 'Base64 Serialization Engine', description: 'Professional high-fidelity encoding and decoding system for mapping data payloads into robust Base64 binary serialization.', category: 'Engineering', icon: Code, path: '/tools/base64-encoder' },
    { slug: 'sql-formatter', title: 'Relational Query Architect', description: 'Professional SQL normalization engine for structuring complex database queries into standardized architectural layouts.', category: 'Engineering', icon: Database, path: '/tools/sql-formatter' },
    { slug: 'yaml-to-json', title: 'Schema Transcoder', description: 'High-performance bidirectional transformation engine for YAML and JSON configuration schemas.', category: 'Engineering', icon: FileCode, path: '/tools/yaml-to-json' },
    { slug: 'diff-checker', title: 'Structural Diff Engine', description: 'High-precision analysis for detecting structural deviations between two data sources.', category: 'Engineering', icon: Split, path: '/tools/diff-checker' },
    { slug: 'uuid-generator', title: 'Universal Identity Architect', description: 'High-entropy generation engine for synthesizing unique universal identifiers in bulk distributions.', category: 'Engineering', icon: Fingerprint, path: '/tools/uuid-generator' },
    { slug: 'js-minifier', title: 'JavaScript Payload Architect', description: 'Professional footprint optimization engine for reducing JavaScript asset weight through technical debt elimination.', category: 'Engineering', icon: Minimize2, path: '/tools/js-minifier' },
    { slug: 'user-agent-parser', title: 'Client Intelligence Engine', description: 'High-fidelity deconstruction of User Agent signatures for precise technical environment profiling.', category: 'Engineering', icon: Smartphone, path: '/tools/user-agent-parser' },

    // Security
    { slug: 'password-generator', title: 'Entropy Generation Engine', description: 'Professional generation of high-entropy cryptographic strings utilizing customized character-set vectors.', category: 'Security', icon: Key, path: '/tools/password-generator' },
    { slug: 'hash-generator', title: 'Cryptographic Digest Engine', description: 'High-fidelity generation of secure MD5, SHA-1, SHA-256, and SHA-512 digital fingerprints for data integrity and security audit.', category: 'Security', icon: Shield, path: '/tools/hash-generator' },

    // Design
    { slug: 'contrast-checker', title: 'Luminance Contrast Architect', description: 'Professional validation engine for verifying chromatic combinations against WCAG architectural standards.', category: 'Design', icon: Palette, path: '/tools/contrast-checker' },
    { slug: 'px-to-rem', title: 'Dimensions Transcoding Engine', description: 'High-fidelity transformation between Relative (REM) and Absolute (PX) dimensional vectors for architectural UI scaling.', category: 'Design', icon: LayoutGrid, path: '/tools/px-to-rem' },
    { slug: 'color-palette-generator', title: 'Chromatic Synthesis Engine', description: 'High-fidelity generation of harmonious, production-grade chromatic schematics for elite UI design and architectural layout.', category: 'Design', icon: Palette, path: '/tools/color-palette-generator' },
    { slug: 'css-gradient-generator', title: 'Chromatic Gradient Engine', description: 'Professional high-fidelity design engine for synthesizing complex linear CSS gradients for architectural web UI.', category: 'Design', icon: Layers, path: '/tools/css-gradient-generator' },
    { slug: 'aspect-ratio-calculator', title: 'Aspect Ratio Engine', description: 'High-fidelity calculator for scaling visual assets while maintaining geometric proportions.', category: 'Design', icon: Maximize, path: '/tools/aspect-ratio-calculator' },

    // Content
    { slug: 'word-counter', title: 'Lexical Analysis Engine', description: 'Real-time deconstruction of linguistic payloads to derive structural complexity, magnitude, and temporal consumption requirements.', category: 'Content', icon: Type, path: '/tools/word-counter' },
    { slug: 'lorem-ipsum', title: 'Synthetic Content Generator', description: 'High-fidelity placeholder text generation engine for professional UI/UX prototyping and layout calibration.', category: 'Content', icon: Type, path: '/tools/lorem-ipsum' },
    { slug: 'markdown-preview', title: 'Semantic Markdown Architect', description: 'Professional rendering engine for deconstructing markdown source into high-fidelity visual architectures.', category: 'Content', icon: FileText, path: '/tools/markdown-preview' },
    { slug: 'case-converter', title: 'Syntax Case Architect', description: 'Professional engine for executing lexical transformations between standardized casing vectors and architectural naming conventions.', category: 'Content', icon: Type, path: '/tools/case-converter' },
    { slug: 'binary-converter', title: 'Binary Logic Transcoder', description: 'Professional bi-directional interface for translating semantic payloads into machine-level bitstream distributions.', category: 'Content', icon: Binary, path: '/tools/binary-converter' },

    // Workflow
    { slug: 'pomodoro-timer', title: 'Focus Engine', description: 'A high-performance cycle management tool designed to maximize cognitive throughput and operational resilience.', category: 'Workflow', icon: Clock, path: '/tools/pomodoro-timer' },
    { slug: 'qr-generator', title: 'Vector Matrix Synthesizer', description: 'High-precision generation of optical data matrices with custom spectral calibration and redundant correction protocols.', category: 'Workflow', icon: Box, path: '/tools/qr-generator' },
    { slug: 'timestamp-converter', title: 'Temporal Synchronization Engine', description: 'Professional bi-directional transformation between Unix Epoch vectors and standardized chronological architectures.', category: 'Workflow', icon: Clock, path: '/tools/timestamp-converter' },
    { slug: 'url-encoder', title: 'URI Protocol Transcoder', description: 'High-fidelity encoding and decoding of data strings for standardized URI protocol integration and network resilience.', category: 'Workflow', icon: Globe, path: '/tools/url-encoder' },
    { slug: 'percentage-calculator', title: 'Analytical Dimension Engine', description: 'High-precision arithmetic engines for complex magnitude extraction and ratio derivation in professional workflows.', category: 'Workflow', icon: Percent, path: '/tools/percentage-calculator' },
    { slug: 'image-placeholder-generator', title: 'Visual Proxy Synthesizer', description: 'Professional high-fidelity engine for generating customized visual layout proxies for architectural design and UI deconstruction.', category: 'Workflow', icon: Image, path: '/tools/image-placeholder-generator' },
];

export const ALL_TOOLS = [...TOOLS_REGISTRY].sort((a, b) => a.title.localeCompare(b.title));

export const TOOLS_BY_CATEGORY = TOOLS_REGISTRY.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
}, {} as Record<ToolCategory, ToolMeta[]>);

