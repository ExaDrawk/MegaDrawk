'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE } from '../../config/site';

/**
 * LOGIC ASCENT: SYNCHRO-STORM (V4.0)
 * -----------------------------------------
 * 超直感的・高爽快感 ニューロ・アクション
 * 
 * 操作:
 * - マウス移動: 自機(コア)の移動
 * - クリック / スペース: 「シンクロ・バースト」 (周囲のデータを一括回収 ＆ ノイズを消去)
 * 
 * ルール:
 * - 飛来する「データ(青/緑)」に触れて回収。
 * - 回収し続けると「シンクロ率」が上昇し、自機が強化。
 * - 「ノイズ(赤)」に当たるとシールド低下。
 */

const COLORS = {
    CYAN: '#00f2ff',
    LIME: '#00ff88',
    YELLOW: '#fff200',
    ORANGE: '#ff9d00',
    RED: '#ff4d00',
    BG: '#ffffff',
    TEXT: '#0f172a',
    UI_BG: 'rgba(255, 255, 255, 0.8)',
};

interface Entity {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    type: 'DATA' | 'NOISE' | 'POWERUP';
    color: string;
    life: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
}

export function LogicFlux() {
    const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [shield, setShield] = useState(100);
    const [syncRate, setSyncRate] = useState(0); // 0 to 100
    const [level, setLevel] = useState(1);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const entities = useRef<Entity[]>([]);
    const FX = useRef<Particle[]>([]);
    const mousePos = useRef({ x: 500, y: 500 });
    const corePos = useRef({ x: 500, y: 500 }); // Smoothed position
    const frameId = useRef(0);
    const lastSpawn = useRef(0);
    const lastId = useRef(0);

    const createExplosion = (x: number, y: number, color: string, count = 10) => {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            FX.current.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                color
            });
        }
    };

    const spawnEntity = useCallback(() => {
        const typeRand = Math.random();
        let type: Entity['type'] = 'DATA';
        let color = COLORS.CYAN;
        let size = 15;

        if (typeRand < 0.2 + (level * 0.05)) {
            type = 'NOISE';
            color = COLORS.RED;
            size = 20;
        } else if (typeRand > 0.98) {
            type = 'POWERUP';
            color = COLORS.YELLOW;
            size = 25;
        } else if (Math.random() > 0.5) {
            color = COLORS.LIME;
        }

        const angle = Math.random() * Math.PI * 2;
        const dist = 800;
        const x = 500 + Math.cos(angle) * dist;
        const y = 500 + Math.sin(angle) * dist;

        const targetX = 500 + (Math.random() * 200 - 100);
        const targetY = 500 + (Math.random() * 200 - 100);
        const moveAngle = Math.atan2(targetY - y, targetX - x);
        const speed = (2 + Math.random() * 3) * (1 + level * 0.1);

        entities.current.push({
            id: lastId.current++,
            x, y,
            vx: Math.cos(moveAngle) * speed,
            vy: Math.sin(moveAngle) * speed,
            size, type, color,
            life: 1.0
        });
    }, [level]);

    const triggerBurst = useCallback(() => {
        if (gameState !== 'PLAYING') return;

        const burstRadius = 250 + (syncRate * 2);
        createExplosion(corePos.current.x, corePos.current.y, COLORS.CYAN, 30);

        entities.current.forEach(e => {
            const d = Math.sqrt(Math.pow(e.x - corePos.current.x, 2) + Math.pow(e.y - corePos.current.y, 2));
            if (d < burstRadius) {
                if (e.type === 'DATA') {
                    setScore(s => s + 100);
                    setSyncRate(r => Math.min(100, r + 2));
                } else if (e.type === 'NOISE') {
                    setScore(s => s + 50);
                }
                e.life = 0;
                createExplosion(e.x, e.y, e.color, 5);
            }
        });
    }, [gameState, syncRate]);

    const update = (time: number) => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Clear with slight trail
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, 0, 1000, 1000);

        if (gameState === 'PLAYING') {
            // Core smooth follow
            corePos.current.x += (mousePos.current.x - corePos.current.x) * 0.15;
            corePos.current.y += (mousePos.current.y - corePos.current.y) * 0.15;

            // Spawning
            if (time - lastSpawn.current > 400 / (1 + level * 0.2)) {
                spawnEntity();
                lastSpawn.current = time;
            }

            // Update Entities
            entities.current = entities.current.filter(e => {
                if (e.life <= 0) return false;

                e.x += e.vx;
                e.y += e.vy;

                const d = Math.sqrt(Math.pow(e.x - corePos.current.x, 2) + Math.pow(e.y - corePos.current.y, 2));
                const hitDist = e.size + 20 + (syncRate * 0.2);

                if (d < hitDist) {
                    if (e.type === 'DATA') {
                        setScore(s => s + 10);
                        setSyncRate(r => Math.min(100, r + 0.5));
                        createExplosion(e.x, e.y, e.color, 3);
                    } else if (e.type === 'NOISE') {
                        setShield(s => Math.max(0, s - 10));
                        createExplosion(e.x, e.y, COLORS.RED, 15);
                    } else if (e.type === 'POWERUP') {
                        setShield(s => Math.min(100, s + 20));
                        setSyncRate(100);
                        createExplosion(e.x, e.y, COLORS.YELLOW, 20);
                    }
                    return false;
                }

                // Draw Entity
                ctx.fillStyle = e.color;
                ctx.beginPath();
                if (e.type === 'DATA') {
                    ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
                } else if (e.type === 'NOISE') {
                    ctx.rect(e.x - e.size, e.y - e.size, e.size * 2, e.size * 2);
                } else {
                    ctx.moveTo(e.x, e.y - e.size);
                    ctx.lineTo(e.x + e.size, e.y + e.size);
                    ctx.lineTo(e.x - e.size, e.y + e.size);
                    ctx.closePath();
                }
                ctx.fill();

                return e.x > -200 && e.x < 1200 && e.y > -200 && e.y < 1200;
            });

            // Level Up logic
            if (score > level * level * 2000) {
                setLevel(l => l + 1);
            }

            // Sync Decay
            setSyncRate(r => Math.max(0, r - 0.05));

            // Draw Core
            ctx.shadowBlur = 15 + Math.sin(time * 0.01) * 5 + (syncRate * 0.5);
            ctx.shadowColor = COLORS.CYAN;
            ctx.fillStyle = COLORS.TEXT;
            ctx.beginPath();
            ctx.arc(corePos.current.x, corePos.current.y, 20 + (syncRate * 0.1), 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Draw Sync Field
            ctx.strokeStyle = COLORS.CYAN;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(corePos.current.x, corePos.current.y, 60 + (syncRate * 0.5), 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Particles
        FX.current = FX.current.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            if (p.life <= 0) return false;
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, 4, 4);
            ctx.globalAlpha = 1.0;
            return true;
        });

        frameId.current = requestAnimationFrame(update);
    };

    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === ' ') { e.preventDefault(); triggerBurst(); }
        };
        const handleMouse = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const r = canvasRef.current.getBoundingClientRect();
            mousePos.current = { x: (e.clientX - r.left) * (1000 / r.width), y: (e.clientY - r.top) * (1000 / r.height) };
        };
        window.addEventListener('keydown', handleKeys);
        window.addEventListener('mousemove', handleMouse);
        window.addEventListener('mousedown', triggerBurst);
        return () => {
            window.removeEventListener('keydown', handleKeys);
            window.removeEventListener('mousemove', handleMouse);
            window.removeEventListener('mousedown', triggerBurst);
        };
    }, [gameState, triggerBurst]);

    useEffect(() => {
        frameId.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId.current);
    }, [update]);

    useEffect(() => {
        if (shield <= 0 && gameState === 'PLAYING') {
            setGameState('GAMEOVER');
            if (score > highScore) setHighScore(score);
        }
    }, [shield, gameState, score, highScore]);

    const startGame = () => {
        setScore(0); setShield(100); setLevel(1); setSyncRate(0);
        entities.current = []; FX.current = [];
        setGameState('PLAYING');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden select-none">
            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20 flex flex-col p-8">
                <div className="flex justify-between items-start">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-black italic">LS</div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tighter uppercase italic">LOGIC<span className="text-cyan-500">ASCENT</span></h1>
                                <p className="text-[9px] font-bold text-slate-400 tracking-[0.4em]">SYNCHRO-STORM V4.0</p>
                            </div>
                        </div>

                        <div className="flex gap-4 pointer-events-auto">
                            <div className="bg-white/90 backdrop-blur p-5 rounded-3xl shadow-xl border border-slate-100 flex gap-8">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Stability</p>
                                    <p className={`text-2xl font-black ${shield < 30 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>{Math.floor(shield)}%</p>
                                </div>
                                <div className="w-px h-8 bg-slate-100 my-auto" />
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Sync Rate</p>
                                    <p className="text-2xl font-black text-cyan-500">{Math.floor(syncRate)}%</p>
                                </div>
                            </div>
                            <div className="bg-slate-950 text-white p-5 rounded-3xl shadow-2xl flex items-center gap-10">
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-black text-slate-500 uppercase">Process Score</p>
                                    <p className="text-3xl font-mono font-black">{score.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-cyan-400 uppercase">Level</p>
                                    <p className="text-3xl font-black italic">{level}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-auto flex justify-between items-end">
                    <div className="bg-white/80 backdrop-blur px-6 py-4 rounded-full border border-slate-100 shadow-lg text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                        MegaDrawk Logic Dept. // Protocol: Synchronize & ASCEND
                    </div>
                    <div className="flex gap-4 pointer-events-auto">
                        <a href="/" className="px-10 py-4 bg-slate-950 text-white rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-xl">基地へ帰還</a>
                    </div>
                </div>
            </div>

            {/* Game Viewport */}
            <main className="h-screen flex items-center justify-center">
                <div className="relative aspect-square h-[90vh] rounded-[4rem] overflow-hidden shadow-2xl bg-white border border-slate-100">
                    <canvas ref={canvasRef} width={1000} height={1000} className="w-full h-full cursor-none" />

                    <AnimatePresence>
                        {gameState === 'IDLE' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-xl">
                                <div className="max-w-xl text-center space-y-12">
                                    <div className="space-y-4">
                                        <div className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.6em]">Neural Synchronization Environment</div>
                                        <h2 className="text-9xl font-black tracking-tighter italic text-slate-950 leading-none">LOGIC<br /><span className="text-cyan-500">ASCENT</span></h2>
                                        <p className="text-slate-400 font-medium text-lg">マウスを動かすだけ。直感的にデータを同期せよ。</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">High Record</p>
                                            <p className="text-5xl font-mono font-black">{highScore.toLocaleString()}</p>
                                        </div>
                                        <button onClick={startGame} className="bg-slate-950 text-white p-8 rounded-[2.5rem] font-black uppercase tracking-widest text-lg hover:bg-cyan-500 transition-all transform hover:scale-105 active:scale-95 shadow-2xl">演算開始</button>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">[Mouse] Move // [Click/Space] Burst</div>
                                </div>
                            </motion.div>
                        )}

                        {gameState === 'GAMEOVER' && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] flex items-center justify-center bg-red-600/10 backdrop-blur-2xl">
                                <div className="bg-white p-16 rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] text-center space-y-8 border border-red-50 max-w-lg w-full">
                                    <h2 className="text-6xl font-black italic text-red-600 tracking-tighter uppercase">Sync Failure</h2>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Final Accumulation</p>
                                        <p className="text-7xl font-mono font-black">{score.toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <button onClick={startGame} className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-cyan-500 transition-all animate-bounce">再試行する</button>
                                        <a href="/" className="w-full py-6 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-950 transition-all">基地へ帰還</a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
