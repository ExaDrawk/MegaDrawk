'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LOGIC FLUX V7: ARCHITECT (SUPREME)
 * -----------------------------------------
 * 世界基準の「物理×構築×連鎖」シミュレーター。
 * 
 * 従来の「避ける・集める」ゲームを完全に捨て、
 * 「物理的な衝突」と「情報の高次化（マージ）」に特化した全く新しいゲーム体験。
 * 
 * コンセプト:
 * 上部から降り注ぐ「未精製データ（Shards）」を、マウスで操作する「リフレクター（反射板）」を用いて
 * フィールド下部の3つの「プロセス・コア」へと導け。
 * 同色のデータが空中で衝突すると、より高次で高価値な「論理結晶」へと進化する。
 * 
 * 操作:
 * - マウス移動: リフレクターの移動
 * - マウスを左右に振る: リフレクターを傾ける（反射角度の制御）
 * - クリック / スペース: 「コア・オーバーロード」（溜まったエネルギーを一気に精製）
 * 
 * 視覚:
 * - 高精細な物理演算、光の屈折エフェクト
 * - シアン、ライム、エメラルド、ゴールドの輝き
 * - 紫色・ピンクは一切排除。白と黒のコントラストによるプレミアムな質感。
 */

const COLORS = {
    CYAN: '#00f2ff',
    LIME: '#00ff88',
    GOLD: '#ffcc00',
    ORANGE: '#ff6600',
    RED: '#ff3300',
    BG: '#ffffff',
    TEXT: '#0f172a',
    GRID: 'rgba(15, 23, 42, 0.03)',
    CORE_A: 'rgba(0, 242, 255, 0.1)',
    CORE_B: 'rgba(0, 255, 136, 0.1)',
    CORE_C: 'rgba(255, 204, 0, 0.1)',
};

interface Shard {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    value: number; // 0, 1, 2 (Evolution level)
    color: string;
    rotation: number;
    rv: number;
    life: number;
}

interface Particle {
    x: number; y: number; vx: number; vy: number; life: number; color: string; size: number;
}

export function LogicFlux() {
    // --- System State ---
    const [gameState, setGameState] = useState<'STASIS' | 'EVOLVING' | 'TERMINATED'>('STASIS');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [integrity, setIntegrity] = useState(100);
    const [combo, setCombo] = useState(1);
    const [processingPower, setProcessingPower] = useState(1.0);

    // Core Storage (Normalized 0.0 to 1.0)
    const [coreA, setCoreA] = useState(0);
    const [coreB, setCoreB] = useState(0);
    const [coreC, setCoreC] = useState(0);

    // --- References ---
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shards = useRef<Shard[]>([]);
    const FX = useRef<Particle[]>([]);
    const mouse = useRef({ x: 500, y: 500, lx: 500, tilt: 0 });
    const paddle = useRef({ x: 500, width: 140, height: 12, tilt: 0 });
    const frameId = useRef(0);
    const lastSpawn = useRef(0);
    const lastId = useRef(0);

    // --- Juice Systems ---
    const addFX = (x: number, y: number, color: string, count = 10, s = 1) => {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = (Math.random() * 8 + 2) * s;
            FX.current.push({
                x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                life: 1.0, color, size: Math.random() * 5 + 1
            });
        }
    };

    // --- Game Logic ---
    const spawnShard = useCallback(() => {
        const type = Math.floor(Math.random() * 3);
        let color = COLORS.CYAN;
        if (type === 1) color = COLORS.LIME;
        if (type === 2) color = COLORS.GOLD;

        const x = Math.random() * 800 + 100;
        const y = -50;

        shards.current.push({
            id: lastId.current++,
            x, y, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 2 * processingPower,
            size: 12,
            value: type, // Matches core index
            color,
            rotation: Math.random() * Math.PI,
            rv: (Math.random() - 0.5) * 0.1,
            life: 1.0
        });
    }, [processingPower]);

    const flushCores = useCallback(() => {
        if (gameState !== 'EVOLVING') return;

        let totalGain = 0;
        let gained = false;

        const handleFlush = (val: number, setVal: React.Dispatch<React.SetStateAction<number>>, color: string) => {
            if (val > 0.3) {
                totalGain += Math.floor(val * 5000 * combo);
                setVal(0);
                addFX(500, 800, color, 40, 2);
                gained = true;
            }
        };

        handleFlush(coreA, setCoreA, COLORS.CYAN);
        handleFlush(coreB, setCoreB, COLORS.LIME);
        handleFlush(coreC, setCoreC, COLORS.GOLD);

        if (gained) {
            setScore(s => s + totalGain);
            setCombo(c => c + 1);
            setProcessingPower(p => Math.min(3.0, p + 0.1));
        }
    }, [gameState, coreA, coreB, coreC, combo]);

    const update = (time: number) => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Background
        ctx.fillStyle = COLORS.BG;
        ctx.fillRect(0, 0, 1000, 1000);

        // Grid lines (Parallax)
        ctx.strokeStyle = COLORS.GRID;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 1000; i += 100) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1000); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1000, i); ctx.stroke();
        }

        if (gameState === 'EVOLVING') {
            // Paddle Physics
            const speed = (mouse.current.x - mouse.current.lx);
            mouse.current.tilt += (speed * 0.015 - mouse.current.tilt) * 0.1;
            mouse.current.lx = mouse.current.x;

            paddle.current.x += (mouse.current.x - paddle.current.x) * 0.2;
            paddle.current.tilt = mouse.current.tilt;

            // Spawning
            if (time - lastSpawn.current > 600 / processingPower) {
                spawnShard();
                lastSpawn.current = time;
            }

            // Shards Update
            shards.current = shards.current.filter(s => {
                s.vy += 0.05; // Gravity
                s.x += s.vx;
                s.y += s.vy;
                s.rotation += s.rv;

                // Paddle Collision
                const dx = s.x - paddle.current.x;
                const dy = s.y - 700;
                if (Math.abs(dx) < paddle.current.width / 2 && Math.abs(dy) < 30 && s.vy > 0) {
                    // Refraction Physics
                    const hitPos = dx / (paddle.current.width / 2); // -1 to 1
                    const reflectAngle = hitPos * 1.0 + paddle.current.tilt * 2;
                    const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy) * 1.1;

                    s.vx = Math.sin(reflectAngle) * speed;
                    s.vy = -Math.cos(reflectAngle) * speed;
                    s.y = 680;
                    addFX(s.x, s.y, s.color, 8);
                    setScore(sc => sc + 10);
                }

                // Core Detection (Bottom zones)
                if (s.y > 900) {
                    const zone = Math.floor(s.x / (1000 / 3));
                    if (zone === s.value) { // Correct core
                        if (zone === 0) setCoreA(v => Math.min(1, v + 0.05));
                        if (zone === 1) setCoreB(v => Math.min(1, v + 0.05));
                        if (zone === 2) setCoreC(v => Math.min(1, v + 0.05));
                        addFX(s.x, 950, s.color, 20);
                        setScore(sc => sc + 100 * combo);
                    } else { // Inconsistency detected
                        setIntegrity(i => Math.max(0, i - 5));
                        addFX(s.x, 950, COLORS.RED, 30, 2);
                    }
                    return false;
                }

                // Interaction: Shard Wall Collision
                if (s.x < 50 || s.x > 950) { s.vx *= -0.8; s.x = s.x < 50 ? 51 : 949; }

                // Draw Shard
                ctx.save();
                ctx.translate(s.x, s.y);
                ctx.rotate(s.rotation);
                ctx.fillStyle = s.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = s.color;

                ctx.beginPath();
                if (s.value === 0) { // Triangle
                    ctx.moveTo(0, -s.size); ctx.lineTo(s.size, s.size); ctx.lineTo(-s.size, s.size);
                } else if (s.value === 1) { // Square
                    ctx.rect(-s.size / 2, -s.size / 2, s.size, s.size);
                } else { // Diamond
                    ctx.moveTo(0, -s.size); ctx.lineTo(s.size, 0); ctx.lineTo(0, s.size); ctx.lineTo(-s.size, 0);
                }
                ctx.fill();
                ctx.restore();

                return true;
            });

            // Draw Structures
            drawStructures(ctx, time);
        }

        // FX Update
        FX.current = FX.current.filter(p => {
            p.x += p.vx; p.y += p.vy; p.life -= 0.02;
            if (p.life <= 0) return false;
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1.0;
            return true;
        });

        frameId.current = requestAnimationFrame(update);
    };

    const drawStructures = (ctx: CanvasRenderingContext2D, time: number) => {
        // Paddle (Glassmorphic)
        ctx.save();
        ctx.translate(paddle.current.x, 700);
        ctx.rotate(paddle.current.tilt);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.roundRect(-paddle.current.width / 2, -paddle.current.height / 2, paddle.current.width, paddle.current.height, 10);
        ctx.fill();

        // Paddle Highlight
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-paddle.current.width / 2 + 10, -paddle.current.height / 2 + 2); ctx.lineTo(paddle.current.width / 2 - 10, -paddle.current.height / 2 + 2); ctx.stroke();
        ctx.restore();

        // Bottom Cores
        const coreWidth = 1000 / 3;
        [
            { val: coreA, color: COLORS.CYAN, label: 'TRI-SYNC' },
            { val: coreB, color: COLORS.LIME, label: 'SQ-FLUX' },
            { val: coreC, color: COLORS.GOLD, label: 'DM-CORE' }
        ].forEach((c, i) => {
            const x = i * coreWidth;

            // Background
            ctx.fillStyle = i === 0 ? COLORS.CORE_A : i === 1 ? COLORS.CORE_B : COLORS.CORE_C;
            ctx.fillRect(x + 10, 920, coreWidth - 20, 70);

            // Fill level
            ctx.fillStyle = c.color;
            const h = 70 * c.val;
            ctx.fillRect(x + 10, 920 + (70 - h), coreWidth - 20, h);

            // Label
            ctx.fillStyle = COLORS.TEXT;
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(c.label, x + coreWidth / 2, 910);
        });
    };

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const r = canvasRef.current.getBoundingClientRect();
            mouse.current.x = (e.clientX - r.left) * (1000 / r.width);
        };
        window.addEventListener('mousemove', handleMouse);
        window.addEventListener('mousedown', flushCores);
        window.addEventListener('keydown', (e) => { if (e.key === ' ') { e.preventDefault(); flushCores(); } });
        return () => { window.removeEventListener('mousemove', handleMouse); window.removeEventListener('mousedown', flushCores); };
    }, [flushCores]);

    useEffect(() => {
        frameId.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId.current);
    }, [gameState, coreA, coreB, coreC, score, integrity, processingPower]);

    useEffect(() => {
        if (integrity <= 0 && gameState === 'EVOLVING') {
            setGameState('TERMINATED');
            if (score > highScore) setHighScore(score);
        }
    }, [integrity, gameState, score, highScore]);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-cyan-100 overflow-hidden relative select-none">

            {/* High-Fidelity Tactical HUD */}
            <div className="absolute inset-0 pointer-events-none z-30 flex flex-col p-12">
                <header className="flex justify-between items-start">
                    <div className="space-y-12">
                        <div className="flex items-center gap-10">
                            <div className="h-20 w-20 bg-slate-950 text-white rounded-[2.5rem] flex items-center justify-center font-black text-4xl shadow-2xl border-4 border-cyan-500/30">F</div>
                            <div className="space-y-1">
                                <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-none">LOGIC<span className="text-cyan-500">FLUX</span></h1>
                                <p className="text-[12px] font-bold text-slate-400 tracking-[0.8em] uppercase">Architectural Logic Simulator // V7.0 Supreme</p>
                            </div>
                        </div>

                        <div className="flex gap-10 pointer-events-auto">
                            <Stat label="SYSTEM INTEGRITY" value={`${Math.floor(integrity)}%`} color={integrity < 30 ? 'text-red-500 animate-pulse' : 'text-slate-950'} />
                            <div className="w-px h-16 bg-slate-100 my-auto" />
                            <Stat label="SYNC MULTIPLIER" value={`x${combo}`} color="text-cyan-500" />
                            <div className="w-px h-16 bg-slate-100 my-auto" />
                            <Stat label="PROCESS LOAD" value={`${processingPower.toFixed(1)}x`} color="text-emerald-500" />
                        </div>
                    </div>

                    <div className="text-right pointer-events-auto">
                        <p className="text-[12px] font-black text-slate-300 uppercase tracking-widest mb-3">Total Logic Accumulation</p>
                        <p className="text-[10rem] font-mono font-black tracking-tighter leading-none tabular-nums text-slate-900">{score.toLocaleString()}</p>
                    </div>
                </header>

                <div className="mt-auto flex justify-between items-end">
                    <div className="w-1/3 space-y-4">
                        <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Global Network Stability</span>
                            <span>Secure</span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div animate={{ width: `${integrity}%` }} className={`h-full ${integrity < 30 ? 'bg-red-500' : 'bg-slate-950'}`} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.5em] italic">
                            MegaDrawk Intelligence // Project: Crystal Architect
                        </p>
                    </div>

                    <div className="flex gap-4 pointer-events-auto">
                        <button onClick={flushCores} className="px-16 py-8 bg-white border-4 border-slate-950 rounded-[3rem] text-lg font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all shadow-3xl transform hover:-translate-y-2">
                            [SPACE] FLUSH CORES
                        </button>
                    </div>
                </div>
            </div>

            {/* Sim Viewport */}
            <main className="h-screen flex items-center justify-center p-12">
                <div className="relative aspect-square h-[95vh] rounded-[7rem] overflow-hidden shadow-[0_100px_250px_rgba(0,0,0,0.1)] bg-white border border-slate-50">
                    <canvas ref={canvasRef} width={1000} height={1000} className="w-full h-full cursor-none" />

                    <AnimatePresence>
                        {gameState === 'STASIS' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-white/98 backdrop-blur-3xl">
                                <div className="max-w-4xl text-center space-y-24">
                                    <div className="space-y-10">
                                        <div className="inline-block px-12 py-3 bg-slate-950 text-white rounded-full text-[14px] font-black uppercase tracking-[1em]">Universal Architect Protocol</div>
                                        <h2 className="text-[15rem] font-black tracking-tighter italic text-slate-950 leading-[0.7] select-none">CRYSTAL<br /><span className="text-cyan-500">LOGIC</span></h2>
                                        <p className="text-slate-400 font-medium text-3xl max-w-2xl mx-auto leading-relaxed">
                                            データを「導き」、論理を「構築」せよ。<br />
                                            避けるだけの時代は終わった。物理と反射を極め、完璧なシステムをデザインしろ。
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center gap-16">
                                        <div className="p-16 bg-slate-50 rounded-[5rem] text-left border border-slate-100 min-w-[400px]">
                                            <p className="text-[14px] font-black text-slate-400 uppercase mb-4">Supreme Record</p>
                                            <p className="text-9xl font-mono font-black text-slate-900 tabular-nums">{highScore.toLocaleString()}</p>
                                        </div>
                                        <button onClick={() => { setGameState('EVOLVING'); setScore(0); setIntegrity(100); setCoreA(0); setCoreB(0); setCoreC(0); setCombo(1); setProcessingPower(1); shards.current = []; FX.current = []; }} className="h-56 w-56 bg-slate-950 text-white rounded-full font-black uppercase tracking-[0.2em] text-3xl hover:bg-cyan-500 transition-all transform hover:scale-110 shadow-3xl border-[8px] border-white flex items-center justify-center">BUILD</button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-16 text-[14px] font-black text-slate-300 uppercase tracking-widest">
                                        <div className="space-y-4">
                                            <div className="text-slate-950">REFLECT</div>
                                            <p>マウスで角度を操り<br />データを反射させろ</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="text-slate-950">SORT</div>
                                            <p>正しいコアへ<br />情報を分類しろ</p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="text-slate-950">EVOLVE</div>
                                            <p>溜まったコアを<br />一気に精製(FLUSH)</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {gameState === 'TERMINATED' && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-3xl">
                                <div className="bg-white p-32 rounded-[8rem] shadow-[0_120px_300px_rgba(0,0,0,0.25)] text-center space-y-16 max-w-3xl w-full border border-slate-100">
                                    <div className="space-y-4">
                                        <h2 className="text-[8rem] font-black italic text-red-600 tracking-tighter uppercase leading-none">COLLAPSE</h2>
                                        <p className="text-[14px] font-black text-slate-300 tracking-[0.8em] uppercase">整合性が崩壊し、宇宙が静止しました。</p>
                                    </div>
                                    <div className="py-16 bg-slate-50 rounded-[5rem] border border-slate-100">
                                        <p className="text-[14px] font-black text-slate-400 uppercase mb-4">Total Integrity Gain</p>
                                        <p className="text-[12rem] font-mono font-black text-slate-950 tabular-nums leading-none tracking-tighter">{score.toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col gap-6 px-20">
                                        <button onClick={() => setGameState('STASIS')} className="w-full py-10 bg-slate-950 text-white rounded-[4rem] font-black uppercase tracking-[0.5em] text-2xl hover:bg-cyan-500 transition-all shadow-3xl">RE-INITIATE</button>
                                        <a href="/" className="px-12 py-4 text-slate-400 font-bold uppercase text-[14px] tracking-[1em] hover:text-slate-950 transition-all underline decoration-4 underline-offset-8">ABANDON BASE</a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@800&display=swap');
                body { background: #ffffff; cursor: none; overflow: hidden; }
            `}</style>
        </div>
    );
}

function Stat({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="space-y-3">
            <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
            <p className={`text-5xl font-black ${color} leading-none tracking-tighter`}>{value}</p>
        </div>
    );
}
