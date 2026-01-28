'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE } from '../../config/site';

/**
 * LOGIC TETHER: KINETIC REFRACTION (V5.0)
 * -----------------------------------------
 * 世界基準のタクティカル・フィジックス・アクション
 * 
 * コンセプト:
 * 「リンク」と「衝撃」。
 * 情報をただ消すのではなく、それらを「繋ぎ」、互いに「衝突」させることで、
 * 高純度の論理エネルギーを生み出す、物理演算ベースのアクションゲーム。
 * 
 * 操作:
 * - マウス移動: コアの操作
 * - マウスドラッグ: フィールド上の「未処理データ」を「テザー」で連結
 * - スペースキー / 右クリック: 「論理伝導 (CONDUCT)」
 *   - 連結されたデータが一斉にコアへ向けて加速・衝突。
 *   - 複数のデータを一気に衝突させることで、幾何学的な爆発とスコアボムが発生。
 * 
 * 視覚効果:
 * - 高コントラストなホワイト・ミニマリズム
 * - 紫色を一切排除したシアン・エメラルド・ゴールドの極彩色
 * - Verlet積分による物理テザーシミュレーション
 */

const COLORS = {
    CYAN: '#00ccff',
    EMERALD: '#00ffa2',
    GOLD: '#ffcc00',
    ORANGE: '#ff6600',
    RED: '#ff3300',
    BG: '#ffffff',
    TEXT: '#0f172a',
    GRID: 'rgba(15, 23, 42, 0.03)',
};

interface Node {
    id: number;
    x: number;
    y: number;
    px: number; // Previous X for Verlet
    py: number; // Previous Y for Verlet
    vx: number;
    vy: number;
    size: number;
    type: 'DATA' | 'IMPURITY' | 'CATALYST';
    color: string;
    isTethered: boolean;
    mass: number;
}

interface Connection {
    a: number; // Node ID
    b: number; // Node ID
}

interface Particle {
    x: number; y: number; vx: number; vy: number; life: number; color: string; size: number;
}

export function LogicFlux() {
    const [gameState, setGameState] = useState<'IDLE' | 'BOOTING' | 'ACTION' | 'COLLAPSE'>('IDLE');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [energy, setEnergy] = useState(100);
    const [linkCount, setLinkCount] = useState(0);
    const [multiplier, setMultiplier] = useState(1.0);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nodes = useRef<Node[]>([]);
    const FX = useRef<Particle[]>([]);
    const tethers = useRef<Connection[]>([]);
    const mouse = useRef({ x: 500, y: 500, isDown: false, lastX: 500, lastY: 500 });
    const core = useRef({ x: 500, y: 500, r: 25 });
    const frameId = useRef(0);
    const lastSpawn = useRef(0);
    const lastId = useRef(0);

    // --- Juice Systems ---
    const addFX = (x: number, y: number, color: string, count = 10, speedMult = 1) => {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const s = (Math.random() * 8 + 2) * speedMult;
            FX.current.push({
                x, y,
                vx: Math.cos(angle) * s,
                vy: Math.sin(angle) * s,
                life: 1.0,
                color,
                size: Math.random() * 6 + 2
            });
        }
    };

    // --- Physics Engine ---
    const spawnNode = useCallback(() => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 600;
        const x = 500 + Math.cos(angle) * dist;
        const y = 500 + Math.sin(angle) * dist;

        const typeRand = Math.random();
        let type: Node['type'] = 'DATA';
        let color = COLORS.CYAN;
        let mass = 1.0;

        if (typeRand < 0.15) { type = 'IMPURITY'; color = COLORS.RED; mass = 2.0; }
        else if (typeRand > 0.95) { type = 'CATALYST'; color = COLORS.GOLD; mass = 0.5; }
        else if (Math.random() > 0.5) { color = COLORS.EMERALD; }

        const targetX = 500 + (Math.random() * 300 - 150);
        const targetY = 500 + (Math.random() * 300 - 150);
        const dx = targetX - x;
        const dy = targetY - y;
        const mag = Math.sqrt(dx * dx + dy * dy);
        const vx = (dx / mag) * (1.5 + Math.random() * 2);
        const vy = (dy / mag) * (1.5 + Math.random() * 2);

        nodes.current.push({
            id: lastId.current++,
            x, y, px: x - vx, py: y - vy,
            vx, vy,
            size: type === 'IMPURITY' ? 25 : 18,
            type, color,
            isTethered: false,
            mass
        });
    }, []);

    const conductEnergy = useCallback(() => {
        if (gameState !== 'ACTION') return;

        const tethered = nodes.current.filter(n => n.isTethered);
        if (tethered.length === 0) return;

        // Visual Explosion from Core
        addFX(core.current.x, corePos.current.y, COLORS.CYAN, 30, 2);

        // Accelerate all tethered towards center of mass or core
        tethered.forEach(n => {
            const dx = core.current.x - n.x;
            const dy = core.current.y - n.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            n.px = n.x - (dx / d) * 20; // High impulse
            n.py = n.y - (dy / d) * 20;
            n.isTethered = false;
        });

        const bonus = Math.floor(tethered.length * 500 * multiplier);
        setScore(s => s + bonus);
        setMultiplier(m => Math.min(5.0, m + 0.2));
        addFX(500, 50, COLORS.GOLD, 20);
        setLinkCount(0);
        tethers.current = [];
    }, [gameState, multiplier]);

    const corePos = useRef({ x: 500, y: 500 });

    const update = (time: number) => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Rendering Pipeline
        ctx.fillStyle = COLORS.BG;
        ctx.fillRect(0, 0, 1000, 1000);

        // Grid Background
        ctx.strokeStyle = COLORS.GRID;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 1000; i += 50) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1000); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1000, i); ctx.stroke();
        }

        if (gameState === 'ACTION') {
            // Core Physics
            corePos.current.x += (mouse.current.x - corePos.current.x) * 0.2;
            corePos.current.y += (mouse.current.y - corePos.current.y) * 0.2;
            core.current.x = corePos.current.x;
            core.current.y = corePos.current.y;

            // Spawning
            if (time - lastSpawn.current > 500) {
                spawnNode();
                lastSpawn.current = time;
            }

            // Verlet Physics Iteration for Nodes
            nodes.current.forEach(n => {
                const vx = (n.x - n.px) * 0.99; // Friction
                const vy = (n.y - n.py) * 0.99;
                n.px = n.x;
                n.py = n.y;
                n.x += vx;
                n.y += vy;

                // Dragging Tether Logic
                if (mouse.current.isDown) {
                    const dMouse = Math.sqrt(Math.pow(n.x - mouse.current.x, 2) + Math.pow(n.y - mouse.current.y, 2));
                    if (dMouse < 50 && !n.isTethered) {
                        n.isTethered = true;
                        setLinkCount(lc => lc + 1);
                        addFX(n.x, n.y, n.color, 5);
                    }
                }

                // Tether Attraction (String Physics)
                if (n.isTethered) {
                    const dx = core.current.x - n.x;
                    const dy = core.current.y - n.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d > 100) {
                        const force = (d - 100) * 0.05;
                        n.x += (dx / d) * force;
                        n.y += (dy / d) * force;
                    }
                }
            });

            // Collision & Interaction
            nodes.current = nodes.current.filter(n => {
                const dCore = Math.sqrt(Math.pow(n.x - core.current.x, 2) + Math.pow(n.y - core.current.y, 2));

                // Core Interaction
                if (dCore < core.current.r + n.size) {
                    if (n.type === 'DATA' || n.type === 'CATALYST') {
                        setScore(s => s + (n.type === 'CATALYST' ? 1000 : 100));
                        setEnergy(e => Math.min(100, e + (n.type === 'CATALYST' ? 15 : 2)));
                        addFX(n.x, n.y, n.color, 15);
                    } else if (n.type === 'IMPURITY') {
                        setEnergy(e => Math.max(0, e - 20));
                        addFX(n.x, n.y, COLORS.RED, 30, 2.5);
                        setMultiplier(1.0);
                    }
                    return false;
                }

                // Draw Chain if Tethered
                if (n.isTethered) {
                    ctx.beginPath();
                    ctx.strokeStyle = COLORS.EMERALD;
                    ctx.lineWidth = 3;
                    ctx.setLineDash([4, 4]);
                    ctx.moveTo(core.current.x, core.current.y);
                    ctx.lineTo(n.x, n.y);
                    ctx.stroke();
                    ctx.setLineDash([]);
                }

                // Draw Node
                ctx.save();
                ctx.translate(n.x, n.y);
                ctx.fillStyle = n.color;
                ctx.shadowBlur = n.isTethered ? 20 : 0;
                ctx.shadowColor = n.color;

                ctx.beginPath();
                if (n.type === 'IMPURITY') {
                    // Spiky Hexagon
                    for (let i = 0; i < 6; i++) {
                        const a = i * Math.PI / 3;
                        const r = i % 2 === 0 ? n.size : n.size * 0.7;
                        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
                    }
                } else if (n.type === 'CATALYST') {
                    // Diamond
                    ctx.moveTo(0, -n.size); ctx.lineTo(n.size, 0); ctx.lineTo(0, n.size); ctx.lineTo(-n.size, 0);
                } else {
                    ctx.arc(0, 0, n.size, 0, Math.PI * 2);
                }
                ctx.fill();
                ctx.restore();

                return n.x > -500 && n.x < 1500 && n.y > -500 && n.y < 1500;
            });

            // Decay Score Multiplier
            setMultiplier(m => Math.max(1.0, m - 0.001));

            // UI Elements in Canvas
            drawHUD(ctx);
        }

        // Particle System
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

    const drawHUD = (ctx: CanvasRenderingContext2D) => {
        // Aesthetic Center Core
        ctx.save();
        ctx.translate(core.current.x, core.current.y);
        ctx.rotate(Date.now() * 0.002);
        ctx.lineWidth = 4;
        ctx.strokeStyle = COLORS.TEXT;
        ctx.strokeRect(-20, -20, 40, 40);
        ctx.restore();

        // Chain Indicator if linking
        if (mouse.current.isDown) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(15, 23, 42, 0.1)`;
            ctx.lineWidth = 20;
            ctx.lineCap = 'round';
            ctx.moveTo(mouse.current.lastX, mouse.current.lastY);
            ctx.lineTo(mouse.current.x, mouse.current.y);
            ctx.stroke();
            mouse.current.lastX = mouse.current.x;
            mouse.current.lastY = mouse.current.y;
        }
    };

    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); conductEnergy(); }
        };
        const handleMouse = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const r = canvasRef.current.getBoundingClientRect();
            mouse.current.x = (e.clientX - r.left) * (1000 / r.width);
            mouse.current.y = (e.clientY - r.top) * (1000 / r.height);
        };
        const handleDown = () => { mouse.current.isDown = true; mouse.current.lastX = mouse.current.x; mouse.current.lastY = mouse.current.y; };
        const handleUp = () => { mouse.current.isDown = false; };

        window.addEventListener('keydown', handleKeys);
        window.addEventListener('mousemove', handleMouse);
        window.addEventListener('mousedown', handleDown);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('contextmenu', (e) => { e.preventDefault(); conductEnergy(); });

        return () => {
            window.removeEventListener('keydown', handleKeys);
            window.removeEventListener('mousemove', handleMouse);
            window.removeEventListener('mousedown', handleDown);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [conductEnergy]);

    useEffect(() => {
        frameId.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId.current);
    }, []);

    useEffect(() => {
        if (energy <= 0 && gameState === 'ACTION') {
            setGameState('COLLAPSE');
            if (score > highScore) setHighScore(score);
        }
    }, [energy, gameState, score, highScore]);

    const startGame = () => {
        setScore(0); setEnergy(100); setLinkCount(0); setMultiplier(1.0);
        nodes.current = []; FX.current = []; tethers.current = [];
        setGameState('ACTION');
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-cyan-100 overflow-hidden select-none">

            {/* Global HUD Layer */}
            <div className="absolute inset-0 pointer-events-none z-30 flex flex-col p-12">
                <header className="flex justify-between items-start">
                    <div className="space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-2xl">L</div>
                            <div>
                                <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">LOGIC<span className="text-cyan-500">TETHER</span></h1>
                                <p className="text-[10px] font-bold text-slate-400 tracking-[0.5em] mt-1 uppercase">Refraction Protocol Engine V5.0</p>
                            </div>
                        </div>

                        <div className="flex gap-4 pointer-events-auto">
                            <div className="bg-white/90 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex gap-10">
                                <HUDMetric label="Core Integrity" value={`${Math.floor(energy)}%`} color={energy < 30 ? 'text-red-500' : 'text-slate-900'} />
                                <div className="w-px h-10 bg-slate-100 my-auto" />
                                <HUDMetric label="Efficiency Mult" value={`x${multiplier.toFixed(1)}`} color="text-cyan-500" />
                                <div className="w-px h-10 bg-slate-100 my-auto" />
                                <HUDMetric label="Links" value={linkCount.toString()} color="text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 pointer-events-auto">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Global Accumulation</p>
                        <p className="text-6xl font-mono font-black tracking-tighter tabular-nums leading-none">{score.toLocaleString()}</p>
                    </div>
                </header>

                <div className="mt-auto flex justify-between items-end">
                    <div className="max-w-md space-y-4">
                        <div className="flex gap-2">
                            {[...Array(20)].map((_, i) => <div key={i} className={`h-1 w-4 rounded-full ${i < energy / 5 ? 'bg-slate-900' : 'bg-slate-100'}`} />)}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] italic">
                            System Monitoring: Stable // MegaDrawk Kinetic R&D
                        </p>
                    </div>

                    <div className="flex gap-4 pointer-events-auto">
                        <a href="/" className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] text-sm font-black uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-2xl transform hover:-translate-y-1">退避する</a>
                    </div>
                </div>
            </div>

            {/* Game Core Viewport */}
            <main className="h-screen flex items-center justify-center">
                <div className="relative aspect-square h-[92vh] rounded-[5rem] overflow-hidden shadow-[0_60px_150px_rgba(0,0,0,0.1)] bg-white border border-slate-50">
                    <canvas ref={canvasRef} width={1000} height={1000} className="w-full h-full cursor-none" />

                    <AnimatePresence>
                        {gameState === 'IDLE' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-2xl">
                                <div className="max-w-2xl text-center space-y-16">
                                    <div className="space-y-6">
                                        <div className="inline-block px-8 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.6em]">Kinetic Refraction System</div>
                                        <h2 className="text-[10rem] font-black tracking-tighter italic text-slate-950 leading-[0.8]">LOGIC<br /><span className="text-cyan-500">TETHER</span></h2>
                                        <p className="text-slate-400 font-medium text-xl max-w-lg mx-auto">
                                            繋げ、導き、粉砕せよ。<br />
                                            物理演算に基づいた、次世代の論理精製シミュレーター。
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-center gap-8">
                                        <div className="p-10 bg-slate-50 rounded-[4rem] text-left border border-slate-100 min-w-[300px]">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Refusal High Score</p>
                                            <p className="text-6xl font-mono font-black">{highScore.toLocaleString()}</p>
                                        </div>
                                        <button onClick={startGame} className="h-40 w-40 bg-slate-950 text-white rounded-full font-black uppercase tracking-widest text-xl hover:bg-cyan-500 transition-all transform hover:scale-110 active:scale-90 shadow-2xl flex items-center justify-center">起動</button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-8 text-[11px] font-black text-slate-300 uppercase tracking-widest">
                                        <div className="space-y-2">
                                            <div className="text-slate-900">Drag</div>
                                            <p>テザーで連結</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-slate-900">Space / Right Click</div>
                                            <p>論理伝導 (衝突)</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-slate-900">Avoid Red</div>
                                            <p>不純物からの回避</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {gameState === 'COLLAPSE' && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-950/20 backdrop-blur-3xl">
                                <div className="bg-white p-24 rounded-[6rem] shadow-[0_80px_200px_rgba(0,0,0,0.2)] text-center space-y-12 max-w-xl w-full border border-slate-100">
                                    <div className="space-y-2">
                                        <h2 className="text-7xl font-black italic text-red-600 tracking-tighter uppercase leading-none">System Collapse</h2>
                                        <p className="text-[10px] font-black text-slate-300 tracking-[0.4em] uppercase">臨界点に到達し、論理網が崩壊しました。</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase">Total Efficiency Awarded</p>
                                        <p className="text-8xl font-mono font-black tabular-nums tracking-tighter">{score.toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <button onClick={startGame} className="w-full py-8 bg-slate-950 text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-lg hover:bg-cyan-500 transition-all shadow-3xl">再構築を開始</button>
                                        <a href="/" className="px-12 py-4 text-slate-400 font-bold uppercase text-[10px] tracking-[0.6em] hover:text-slate-950 transition-all">基地へ帰還</a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@700;800&display=swap');
                body { background: #ffffff; cursor: crosshair; }
            `}</style>
        </div>
    );
}

function HUDMetric({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
            <p className={`text-3xl font-black ${color} leading-none tracking-tighter`}>{value}</p>
        </div>
    );
}
