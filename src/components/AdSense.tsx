'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

type Props = {
    pId: string;
    nonce?: string;
};

export function AdSense({ pId, nonce }: Props) {
    const pathname = usePathname();

    // アドセンスを表示するパスのリスト（ホワイトリスト方式）
    // 意図しないページ（404、システムページ等）での広告表示を防ぐため、
    // コンテンツが確実に存在するパスのみを指定します。
    const allowedPaths = [
        '/',
        '/compliance',
        '/documentation',
        '/governance',
    ];

    // パスが許可リストに含まれているかチェック
    // ルート("/")は完全一致、それ以外は前方一致で判定
    const isAllowed = allowedPaths.some((path) => {
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
