'use client';

/**
 * -----------------------------------------------------------------------------
 * MARKET REAPER: REAL-TIME VOLATILITY COMBAT (V1.0.0)
 * -----------------------------------------------------------------------------
 * 【システム概要】
 * 世界の株式・仮想通貨市場の「生データ」を武器に変える、リアルタイム連動型アクション。
 * 定義されたデータではなく、外部API（Yahoo Finance API / CoinGecko 等を想定）
 * から取得される「ボラティリティ」が、キャラクターの攻撃力とステージの運命を決定する。
 * 
 * 【ゲーム性】
 * - 銘柄の「ボラティリティ（変動率）」がエネルギーに変換される。
 * - チャートの「上昇/下落」がステージの重力や地形を変化させる。
 * - 「含み損（Damage）」が限界を超えると強制ロスカット（Game Over）。
 * -----------------------------------------------------------------------------
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 型定義 ---

interface MarketAsset {
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    volatility: number;
    color: string;
}

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
}

// --- 初期アセット（API取得を想定したモックデータ） ---
const INITIAL_ASSETS: MarketAsset[] = [
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 580.42, change24h: 4.5, volatility: 0.8, color: '#10b981' },
    { symbol: 'BTC', name: 'Bitcoin', price: 64200.00, change24h: -2.1, volatility: 0.95, color: '#f59e0b' },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 185.20, change24h: -1.2, volatility: 0.7, color: '#ef4444' },
    { symbol: 'AAPL', name: 'Apple Inc.', price: 192.50, change24h: 0.3, volatility: 0.3, color: '#ffffff' },
];

// --- メインコンポーネント ---

export const MarketReaper: React.FC = () => {
    // ゲーム状態
    const [selectedAsset, setSelectedAsset] = useState<MarketAsset>(INITIAL_ASSETS[0]);
    const [score, setScore] = useState(0);
    const [stability, setStability] = useState(100);
    const [isGameOver, setIsGameOver] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<number>(0);
    const lastUpdateRef = useRef<number>(0);
    const gameState = useRef({
        playerY: 500,
        playerTargetY: 500,
        enemyPos: 1000,
        combo: 0,
        volatilityPulse: 0
    });

    // パーティクル生成
    const spawnParticles = useCallback((x: number, y: number, color: string, count: number) => {
        const newParticles: Particle[] = [];
        for (let i = 0; i < count; i++) {
            newParticles.push({
                id: Math.random(),
                x, y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                life: 1.0,
                color
            });
        }
        setParticles(prev => [...prev.slice(-100), ...newParticles]);
    }, []);

    // API擬似更新（リアルタイム市場連動のシミュレーション）
    useEffect(() => {
        const interval = setInterval(() => {
            setSelectedAsset(prev => ({
                ...prev,
                price: prev.price * (1 + (Math.random() - 0.5) * 0.01),
                volatility: Math.min(1.0, prev.volatility + (Math.random() - 0.5) * 0.1)
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // ゲームループ
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        const loop = (timestamp: number) => {
            const dt = timestamp - lastUpdateRef.current;
            lastUpdateRef.current = timestamp;

            if (!isGameOver) {
                // プレイヤーの動き（ボラティリティに比例して震える）
                const shake = (Math.random() - 0.5) * selectedAsset.volatility * 20;
                gameState.current.playerY += (gameState.current.playerTargetY - gameState.current.playerY) * 0.1 + shake;

                // 敵の出現と衝突判定
                gameState.current.enemyPos -= 10 + selectedAsset.volatility * 10;
                if (gameState.current.enemyPos < -100) {
                    gameState.current.enemyPos = 1200;
                    setScore(s => s + Math.floor(100 * (1 + selectedAsset.volatility)));
                    spawnParticles(1000, 500, selectedAsset.color, 10);
                }

                // 「含み損」の概念：ボラティリティが高すぎると安定性が低下
                if (selectedAsset.volatility > 0.8) {
                    setStability(s => Math.max(0, s - 0.1));
                } else {
                    setStability(s => Math.min(100, s + 0.05));
                }

                if (stability <= 0) setIsGameOver(true);
            }

            // --- レンダリング ---
            ctx.clearRect(0, 0, 1000, 1000);

            // 背景チャート（グリッド）
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1;
            for (let i = 0; i < 1000; i += 50) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1000); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1000, i); ctx.stroke();
            }

            // プレイヤー（リーパー・コア）
            const glow = ctx.createRadialGradient(200, gameState.current.playerY, 0, 200, gameState.current.playerY, 50 + selectedAsset.volatility * 50);
            glow.addColorStop(0, selectedAsset.color);
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.beginPath(); ctx.arc(200, gameState.current.playerY, 100, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 40px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(selectedAsset.symbol, 200, gameState.current.playerY + 15);

            // 敵（マーケット・ボラティリティ・スパイク）
            ctx.fillStyle = '#ef4444';
            const h = 50 + Math.sin(timestamp / 100) * 100;
            ctx.fillRect(gameState.current.enemyPos, 500 - h / 2, 20, h);

            // パーティクル
            setParticles(prev => prev.map(p => ({
                ...p,
                x: p.x + p.vx,
                y: p.y + p.vy,
                life: p.life - 0.02
            })).filter(p => p.life > 0));

            particles.forEach(p => {
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
            });
            ctx.globalAlpha = 1.0;

            frameRef.current = requestAnimationFrame(loop);
        };

        frameRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frameRef.current);
    }, [isGameOver, selectedAsset, stability, particles, spawnParticles]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            gameState.current.playerTargetY = (e.clientY - rect.top) * (1000 / rect.height);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#020617] text-white flex flex-col font-sans overflow-hidden">
            {/* プレミアム・ヘッダー：リアルタイム・ティッカーボード */}
            <header className="h-28 border-b border-white/10 bg-black/50 backdrop-blur-2xl flex items-center justify-between px-12 z-50">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.6em] text-emerald-500 uppercase">Live_Market_Stream</span>
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter leading-none">MARKET_REAPER <span className="text-slate-600 text-xl font-normal tracking-normal italic ml-3">/ VOLATILITY_COMBAT</span></h1>
                </div>

                <div className="flex gap-12 items-center">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Cumulative_Yield</span>
                        <span className="text-5xl font-black italic text-emerald-400 font-mono tracking-tighter shadow-emerald-500/50 drop-shadow-lg">{score.toLocaleString()}</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 relative flex">
                {/* サイドバー：アセット・セレクター */}
                <aside className="w-96 border-r border-white/10 p-10 flex flex-col gap-6 bg-black/20 z-40">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 mb-4">Select_Asset_Class</h2>
                    <div className="space-y-4">
                        {INITIAL_ASSETS.map((asset) => (
                            <button
                                key={asset.symbol}
                                onClick={() => {
                                    setSelectedAsset(asset);
                                    setStability(100);
                                }}
                                className={`w-full p-6 rounded-[2rem] border transition-all flex items-center justify-between ${selectedAsset.symbol === asset.symbol ? 'bg-white/10 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)] scale-[1.02]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex flex-col items-start gap-1">
                                    <span className="text-2xl font-black italic">{asset.symbol}</span>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{asset.name}</span>
                                </div>
                                <div className="text-right">
                                    <div className={`text-lg font-black italic ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400">${asset.price.toFixed(2)}</div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* ボラティリティ・インジケーター */}
                    <div className="mt-auto p-8 bg-emerald-500/5 rounded-[3rem] border border-emerald-500/10">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active_Volatility</span>
                            <span className="text-2xl font-black font-mono italic">{(selectedAsset.volatility * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: `${selectedAsset.volatility * 100}%` }}
                                className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                            />
                        </div>
                    </div>
                </aside>

                {/* バトル・チャンバー */}
                <div className="flex-1 relative flex items-center justify-center p-12 overflow-hidden">
                    <div className="relative w-full h-full max-w-[1200px] aspect-[16/9]">
                        <canvas
                            ref={canvasRef}
                            width={1200} height={675}
                            onMouseMove={handleMouseMove}
                            className="w-full h-full bg-[#01030a] rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] cursor-none"
                        />

                        {/* 安定性ゲージ（オーバーレイ） */}
                        <div className="absolute top-12 left-12 right-12 flex items-center gap-6">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Core_Stability</span>
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    animate={{ width: `${stability}%` }}
                                    className={`h-full ${stability < 30 ? 'bg-rose-500 animate-pulse' : 'bg-cyan-500'}`}
                                />
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isGameOver && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-20"
                            >
                                <div className="text-center">
                                    <h2 className="text-9xl font-black italic text-rose-500 tracking-tighter mb-4 scale-x-110">LIQUIDATED</h2>
                                    <p className="text-xl font-bold uppercase tracking-widest text-rose-300 mb-12">Total Core Instability. Portfolio Collapsed.</p>
                                    <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 mb-12">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Session_Final_Analysis</div>
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-slate-400 font-bold uppercase text-sm tracking-widest">Total_Yield:</span>
                                            <span className="text-5xl font-black italic text-white">{score.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setScore(0);
                                            setStability(100);
                                            setIsGameOver(false);
                                        }}
                                        className="px-20 py-8 bg-white text-black font-black italic uppercase tracking-widest rounded-full hover:scale-105 transition active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.3)]"
                                    >
                                        Re_Enter_Market
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* フッター：システムログ */}
            <footer className="h-12 border-t border-white/10 bg-black flex items-center justify-between px-12 text-[9px] font-black uppercase tracking-[0.5em] text-slate-700">
                <div className="flex gap-12">
                    <div className="flex gap-4 items-center"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> API_Status: Synchronized</div>
                    <div className="flex gap-4 items-center"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Physics: Market_Elastic_Core</div>
                </div>
                <div className="italic text-slate-500">Global_Market_Reaper_Protocol_Active</div>
            </footer>
        </div>
    );
};

export const LogicFlux = MarketReaper;
export default LogicFlux;
