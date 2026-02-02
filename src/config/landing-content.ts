
import { Zap, Shield, Layout, Target } from 'lucide-react';
import { SERVICES } from './site';

export const HERO_CONTENT = {
    badge: "Professional Utility Stack",
    headline: {
        line1: "Translate data,",
        line2: "Utility",
        line2Suffix: " into power."
    },
    description: "MegaDrawk is a high-performance utility suite designed to accelerate engineering, design, and operational excellence with millisecond precision. Zero-latency processing for the modern architect.",
    cta: {
        primary: "Access Vectors",
        secondary: "Documentation"
    }
};

export const CORE_VALUES = [
    {
        icon: Target,
        title: "Precision Engineering",
        description: "Deconstruct and analyze data payloads with absolute precision to eliminate cognitive noise.",
        color: "blue"
    },
    {
        icon: Shield,
        title: "Mission Critical",
        description: "Robust local-only processing ensuring your most sensitive data never leaves your environment.",
        color: "sky"
    },
    {
        icon: Layout,
        title: "Architectural UX",
        description: "Transform complex logic into intuitive experiences designed to augment human intelligence.",
        color: "cyan"
    }
];

export const LAB_ITEMS = SERVICES.filter(s => s.isGame).map(s => ({
    ...s,
    tag: "Simulation"
}));
