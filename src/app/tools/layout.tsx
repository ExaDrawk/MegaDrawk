import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MegaDrawk Professional Tools Suite',
    description: 'A collection of efficient developer, design, and productivity utilities.',
};

export default function ToolsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white min-h-screen">
            {children}
        </div>
    );
}
