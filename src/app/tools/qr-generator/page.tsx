'use client';

import React, { useState, useRef } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Share2, Type, Globe, Wifi, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QrGeneratorPage() {
    const [value, setValue] = useState('https://megadrawk.com');
    const [value, setValue] = useState('https://megadrawk.com');
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [size, setSize] = useState(512);
    const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
    const qrRef = useRef<HTMLDivElement>(null);

    const downloadQR = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (!canvas) return;
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'megadrawk-qr.png';
        link.href = url;
        link.click();
    };

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4 text-slate-600">
            <li><strong>URLまたはテキスト</strong>を入力欄に入力してください。</li>
            <li>「フォアグラウンドカラー」と「背景色」を調整して、デザインをカスタマイズできます。</li>
            <li>「誤り訂正レベル」をH（最高）に設定すると、QRコードの一部が汚れなどで隠れても読み取りやすくなります。</li>
            <li>「画像を保存」ボタンで、高解像度のPNG画像としてダウンロード可能です。</li>
        </ul>
    );

    const faq = [
        { q: "QRコードに色を付けても読み取れますか？", a: "はい、可能ですが、文字色と背景色のコントラストが十分に確保されている必要があります（背景を明るく、コードを暗くするのが一般的です）。" },
        { q: "どのようなデータをQRコードにできますか？", a: "URL、プレーンテキスト、メールアドレス、電話番号、WiFi設定など, あらゆるテキストベースのデータを格納できます。" }
    ];

    return (
        <ToolShell
            title="QRコード生成"
            description="カスタムカラー、高解像度出力、強力な誤り訂正に対応したQRコード生成ツール。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-20">
                {/* Configuration */}
                <div className="space-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 flex items-center gap-2">
                            <Type size={12} className="text-blue-600" />
                            コンテンツ (Content)
                        </label>
                        <textarea
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full h-32 bg-white border border-slate-200 rounded-[2rem] p-8 text-lg font-black text-slate-900 focus:outline-none focus:border-blue-500 shadow-sm transition-all resize-none placeholder:text-slate-200"
                            placeholder="URL、テキスト、WiFi設定など..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 flex items-center gap-2">
                                <Palette size={12} className="text-blue-600" />
                                文字色 (Foreground)
                            </label>
                            <div className="flex gap-4">
                                <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="h-14 w-14 rounded-2xl cursor-pointer bg-white border border-slate-200 p-1 hover:border-blue-500 transition-colors shadow-sm" />
                                <input type="text" value={fgColor} onChange={e => setFgColor(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 font-mono text-slate-900 text-sm focus:border-blue-500 transition-all uppercase font-bold shadow-sm" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4 flex items-center gap-2">
                                <Palette size={12} className="text-blue-600" />
                                背景色 (Background)
                            </label>
                            <div className="flex gap-4">
                                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="h-14 w-14 rounded-2xl cursor-pointer bg-white border border-slate-200 p-1 hover:border-blue-500 transition-colors shadow-sm" />
                                <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 font-mono text-slate-900 text-sm focus:border-blue-500 transition-all uppercase font-bold shadow-sm" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">誤り訂正レベル (Error Correction)</label>
                        <div className="flex gap-2">
                            {['L', 'M', 'Q', 'H'].map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLevel(l as any)}
                                    className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${level === l ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20 translate-y-[-2px]' : 'bg-white border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-200'}`}
                                >
                                    {l === 'L' ? 'Low' : l === 'M' ? 'Medium' : l === 'Q' ? 'Quartile' : 'High'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Preview & Download */}
                <div className="flex flex-col items-center justify-center space-y-12">
                    <div className="relative group">
                        <div className="absolute -inset-8 bg-gradient-to-tr from-blue-500/10 to-sky-500/10 rounded-[4rem] blur-3xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                        <div ref={qrRef} className="relative bg-white p-12 rounded-[4rem] shadow-2xl overflow-hidden border-8 border-slate-50">
                            <QRCodeCanvas
                                value={value}
                                size={size}
                                level={level}
                                fgColor={fgColor}
                                bgColor={bgColor}
                                includeMargin={false}
                                className="w-[300px] h-[300px] md:w-[400px] md:h-[400px]"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 w-full max-w-sm">
                        <button
                            onClick={downloadQR}
                            className="flex-1 group relative flex items-center justify-center gap-3 px-8 py-6 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl transition-all hover:bg-black hover:scale-105 active:scale-[0.98] shadow-2xl shadow-blue-500/20"
                        >
                            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                            画像を保存
                        </button>
                    </div>

                    <div className="px-8 py-3 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] shadow-inner">
                        <span className="flex items-center gap-3">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Scanning Engine Ready
                        </span>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
