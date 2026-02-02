'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { ADSENSE_CONFIG } from '@/config/site';

type Props = {
    pId?: string; // Made optional, defaults to config
    nonce?: string;
};

export function AdSense({ pId = ADSENSE_CONFIG.id, nonce }: Props) {
    const pathname = usePathname();

    const isAllowed = ADSENSE_CONFIG.allowedPaths.some((path) => {
        if (path === '/') return pathname === '/';
        return pathname?.startsWith(path);
    });

    if (!isAllowed) {
        return null;
    }

    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
            nonce={nonce}
        />
    );
}
