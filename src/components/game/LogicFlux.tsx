'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE } from '../../config/site';

/**
 * NEURO-FLOW: ZENITH (V6.0)
 * -----------------------------------------
 * 革命的・放射状リズムアクション・シミュレーター
 * 
 * コンセプト:
 * 「静寂」と「爆発」。
 * プレイヤーは回転する「軌道（オービット）」を操り、飛来する情報を
 * タイミングよく「弾き飛ばす」ことで、純粋なフロー状態を目指す。
 * 
 * 操作:
 * - マウス移動: コアの移動
 * - 左クリック（押しっぱなし）: 軌道の拡大 (EXPAND)
 * - 左クリック（離す）: 瞬時の収縮 ＆ インパクト (PULSE)
 *   - 収縮の瞬間に敵が軌道上にいると、超高エネルギーの連鎖爆発が発生。
 * 
 * 視覚:
 * - 白と黒の極限のミニマリズム
 * - シアン、ライム、ゴールドの輝き
 * - 紫色は一切排除
 */

const COLORS = {
    PLAYER: '#00f2ff',
    ORBIT: 'rgba(0, 242, 255, 0.4)',
    DANGER: '#ff4d00',
    LIME: '#00ff88',
    GOLD: '#ffcc00',
    TEXT: '#0f172a',
    BG: '#ffffff',
};

interface Particle {
    x: number; y: number; vx: number; vy: number; life: number; color: string; size: number;
}

interface Enemy {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    type: 'SIGNAL' | 'NOISE' | 'CORE_BREAKER';
    size: number;
    health: number;
    color: string;
}

export function LogicFlux() {
    const [gameState, setGameState] = useState<'LOADING' | 'READY' | 'FLOW' | 'STOP'>('READY');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [flowState, setFlowState] = useState(0); // 0 to 100
    const [shield, setShield] = useState(100);
    const [combo, setCombo] = useState(0);
    const [intensity, setIntensity] = useState(1);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const enemies = useRef<Enemy[]>([]);
    const FX = useRef<Particle[]>([]);
    const mouse = useRef({ x: 500, y: 500, isDown: false });
    const orbit = useRef({ radius: 80, targetRadius: 80, rotation: 0 });
    const frameId = useRef(0);
    const lastSpawn = useRef(0);
    const lastId = useRef(0);

    // --- Juice Engine ---
    const addFX = (x: number, y: number, color: string, count = 12, s = 1) => {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = (Math.random() * 6 + 2) * s;
            FX.current.push({
                x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                life: 1.0, color, size: Math.random() * 4 + 1
            });
        }
    };

    const spawnEnemy = useCallback(() => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 700;
        const x = 500 + Math.cos(angle) * dist;
        const y = 500 + Math.sin(angle) * dist;

        const typeRand = Math.random();
        let type: Enemy['type'] = 'SIGNAL';
        let color = COLORS.LIME;
        let size = 15;
        let health = 1;

        if (typeRand < 0.2 + (intensity * 0.05)) {
            type = 'NOISE';
            color = COLORS.DANGER;
            size = 20;
        } else if (typeRand > 0.96) {
            type = 'CORE_BREAKER';
            color = COLORS.GOLD;
            size = 30;
            health = 3;
        }

        const targetX = 500 + (Math.random() * 200 - 100);
        const targetY = 500 + (Math.random() * 200 - 100);
        const dx = targetX - x;
        const dy = targetY - y;
        const mag = Math.sqrt(dx * dx + dy * dy);
        const speed = (3 + Math.random() * 4) * (1 + intensity * 0.1);

        enemies.current.push({
            id: lastId.current++,
            x, y, vx: (dx / mag) * speed, vy: (dy / mag) * speed,
            type, size, health, color
        });
    }, [intensity]);

    const update = (time: number) => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Clean Canvas
        ctx.fillStyle = COLORS.BG;
        ctx.fillRect(0, 0, 1000, 1000);

        // Background Decor
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.02)';
        ctx.lineWidth = 1;
        for (let i = 100; i <= 900; i += 200) {
            ctx.beginPath(); ctx.arc(500, 500, i + Math.sin(time * 0.001) * 20, 0, Math.PI * 2); ctx.stroke();
        }

        if (gameState === 'FLOW') {
            // Orbit Logic
            orbit.current.targetRadius = mouse.current.isDown ? 200 : 80;
            orbit.current.radius += (orbit.current.targetRadius - orbit.current.radius) * 0.2;
            orbit.current.rotation += 0.05 + (flowState * 0.001);

            // Spawning
            if (time - lastSpawn.current > 400 / (1 + intensity * 0.3)) {
                spawnEnemy();
                lastSpawn.current = time;
            }

            // Enemies Update
            enemies.current = enemies.current.filter(e => {
                e.x += e.vx; e.y += e.vy;

                const dist = Math.sqrt(Math.pow(e.x - 500, 2) + Math.pow(e.y - 500, 2));

                // Collision with Core
                if (dist < 30) {
                    setShield(s => Math.max(0, s - (e.type === 'SIGNAL' ? 5 : 15)));
                    setFlowState(f => Math.max(0, f - 20));
                    setCombo(0);
                    addFX(e.x, e.y, COLORS.DANGER, 20, 2);
                    return false;
                }

                // Collision with Orbit (Impact Check)
                const distToOrbit = Math.abs(dist - orbit.current.radius);
                if (distToOrbit < 15) {
                    // Pulsing / Reflecting
                    if (!mouse.current.isDown && orbit.current.radius < 90) {
                        // Impact!
                        if (e.type === 'SIGNAL') {
                            setScore(s => s + 100 + combo * 10);
                            setFlowState(f => Math.min(100, f + 5));
                            setCombo(c => c + 1);
                            addFX(e.x, e.y, COLORS.LIME, 15);
                        } else if (e.type === 'CORE_BREAKER') {
                            e.health--;
                            if (e.health <= 0) {
                                setScore(s => s + 1000);
                                addFX(e.x, e.y, COLORS.GOLD, 40, 2);
                            } else {
                                e.vx *= -1.5; e.vy *= -1.5; // Reflect
                                addFX(e.x, e.y, COLORS.GOLD, 10);
                                return true;
                            }
                        } else {
                            // Hit noise - bad but not death
                            setShield(s => Math.max(0, s - 2));
                            addFX(e.x, e.y, COLORS.DANGER, 10);
                        }
                        return false;
                    }
                }

                // Draw Enemy
                ctx.save();
                ctx.translate(e.x, e.y);
                ctx.rotate(time * 0.01);
                ctx.fillStyle = e.color;
                ctx.beginPath();
                if (e.type === 'CORE_BREAKER') {
                    for (let i = 0; i < 4; i++) {
                        ctx.rect(-e.size / 2, -e.size / 2, e.size, e.size);
                        ctx.rotate(Math.PI / 4);
                    }
                } else if (e.type === 'NOISE') {
                    ctx.moveTo(-e.size, -e.size); ctx.lineTo(e.size, e.size); ctx.lineTo(e.size, -e.size); ctx.lineTo(-e.size, e.size);
                } else {
                    ctx.arc(0, 0, e.size / 2, 0, Math.PI * 2);
                }
                ctx.fill();
                ctx.restore();

                return dist < 1000;
            });

            // Intensity ramp
            if (score > intensity * intensity * 5000) setIntensity(i => i + 1);

            // Flow decay
            setFlowState(f => Math.max(0, f - 0.05));

            // Rendering Flow HUD
            drawZenithUI(ctx, time);
        }

        // FX Update
        FX.current = FX.current.filter(p => {
            p.x += p.vx; p.y += p.vy; p.life -= 0.03;
            if (p.life <= 0) return false;
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
            ctx.globalAlpha = 1.0;
            return true;
        });

        frameId.current = requestAnimationFrame(update);
    };

    const drawZenithUI = (ctx: CanvasRenderingContext2D, time: number) => {
        // Core
        ctx.save();
        ctx.translate(500, 500);
        ctx.rotate(time * 0.001);

        // Aura
        ctx.lineWidth = 1;
        ctx.strokeStyle = COLORS.PLAYER;
        ctx.beginPath(); ctx.arc(0, 0, 40 + Math.sin(time * 0.01) * 5, 0, Math.PI * 2); ctx.stroke();

        // Main Shape
        ctx.fillStyle = COLORS.TEXT;
        ctx.shadowBlur = 20;
        ctx.shadowColor = COLORS.PLAYER;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const a = i * Math.PI * 2 / 3;
            ctx.lineTo(Math.cos(a) * 25, Math.sin(a) * 25);
        }
        ctx.fill();
        ctx.restore();

        // Orbit Ring
        ctx.beginPath();
        ctx.strokeStyle = mouse.current.isDown ? 'rgba(0,0,0,0.1)' : COLORS.ORBIT;
        ctx.lineWidth = 2 + (flowState * 0.1);
        ctx.arc(500, 500, orbit.current.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Orbit Satellites
        for (let i = 0; i < 3; i++) {
            const a = orbit.current.rotation + (i * Math.PI * 2 / 3);
            const sx = 500 + Math.cos(a) * orbit.current.radius;
            const sy = 500 + Math.sin(a) * orbit.current.radius;
            ctx.fillStyle = COLORS.PLAYER;
            ctx.beginPath(); ctx.arc(sx, sy, 8, 0, Math.PI * 2); ctx.fill();
            if (flowState > 50) {
                ctx.strokeStyle = COLORS.LIME; ctx.lineWidth = 2; ctx.stroke();
            }
        }
    };

    useEffect(() => {
        const handleDown = () => { mouse.current.isDown = true; };
        const handleUp = () => { mouse.current.isDown = false; };
        window.addEventListener('mousedown', handleDown);
        window.addEventListener('mouseup', handleUp);
        return () => { window.removeEventListener('mousedown', handleDown); window.removeEventListener('mouseup', handleUp); };
    }, []);

    useEffect(() => {
        frameId.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId.current);
    }, [gameState, flowState, score, shield]);

    useEffect(() => {
        if (shield <= 0 && gameState === 'FLOW') {
            setGameState('STOP');
            if (score > highScore) setHighScore(score);
        }
    }, [shield, gameState, score, highScore]);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans select-none overflow-hidden relative">

            {/* Minimal High-End HUD */}
            <div className="absolute inset-0 pointer-events-none z-30 flex flex-col p-16">
                <header className="flex justify-between items-start">
                    <div className="space-y-12">
                        <div className="flex items-center gap-8">
                            <div className="h-16 w-16 bg-slate-950 text-white rounded-[2rem] flex items-center justify-center font-black text-3xl shadow-2xl">Z</div>
                            <div>
                                <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">NEURO<span className="text-cyan-500">FLOW</span></h1>
                                <p className="text-[11px] font-bold text-slate-400 tracking-[0.6em] mt-2 uppercase">Zenith Optimization Phase 6.0</p>
                            </div>
                        </div>

                        <div className="flex gap-6 pointer-events-auto">
                            <HUDSection label="SYNCHRONICITY" value={`${Math.floor(flowState)}%`} color="text-cyan-500" />
                            <div className="w-px h-12 bg-slate-100 my-auto" />
                            <HUDSection label="STABILITY" value={`${Math.floor(shield)}%`} color={shield < 30 ? 'text-red-500 animate-pulse' : 'text-slate-950'} />
                            <div className="w-px h-12 bg-slate-100 my-auto" />
                            <HUDSection label="MULTIPLIER" value={`x${(1 + combo * 0.1).toFixed(1)}`} color="text-lime-500" />
                        </div>
                    </div>

                    <div className="text-right pointer-events-auto">
                        <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-2">Processed Intelligence</p>
                        <p className="text-8xl font-mono font-black tracking-tighter leading-none tabular-nums text-slate-900">{score.toLocaleString()}</p>
                    </div>
                </header>

                <div className="mt-auto flex justify-between items-end">
                    <div className="space-y-6">
                        <div className="flex gap-2">
                            {[...Array(40)].map((_, i) => <div key={i} className={`h-1.5 w-4 rounded-full transition-all duration-300 ${i < flowState / 2.5 ? 'bg-cyan-500 shadow-[0_0_10px_rgba(0,242,255,0.5)]' : 'bg-slate-100'}`} />)}
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] italic mb-2">
                            MegaDrawk Industries // Neural Flow R&D Labs
                        </p>
                    </div>
                    <div className="flex gap-4 pointer-events-auto">
                        <a href="/" className="px-14 py-6 bg-slate-950 text-white rounded-[2.5rem] text-sm font-black uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-[0_30px_60px_rgba(0,0,0,0.2)] transform hover:-translate-y-2">DISCONNECT</a>
                    </div>
                </div>
            </div>

            {/* Central Simulator Viewport */}
            <main className="h-screen flex items-center justify-center p-12">
                <div className="relative aspect-square h-[94vh] rounded-[6rem] overflow-hidden shadow-[0_80px_200px_rgba(0,0,0,0.15)] bg-white border border-slate-50">
                    <canvas ref={canvasRef} width={1000} height={1000} className="w-full h-full cursor-none" />

                    <AnimatePresence>
                        {gameState === 'READY' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-white/98 backdrop-blur-3xl p-24">
                                <div className="max-w-3xl text-center space-y-20">
                                    <div className="space-y-8">
                                        <div className="inline-block px-10 py-3 bg-slate-100 text-slate-900 rounded-full text-[12px] font-black uppercase tracking-[0.8em]">Neural Equilibrium Established</div>
                                        <h2 className="text-[12rem] font-black tracking-tighter italic text-slate-950 leading-[0.75]">NEURO<br /><span className="text-cyan-500">FLOW</span></h2>
                                        <p className="text-slate-400 font-medium text-2xl max-w-xl mx-auto leading-relaxed">
                                            タイミングを掴め。情報を弾き飛ばし、<br />
                                            フローの頂点（ゼニス）へと到達せよ。
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center gap-12">
                                        <div className="p-12 bg-slate-50 rounded-[4.5rem] text-left border border-slate-100 min-w-[350px]">
                                            <p className="text-[12px] font-black text-slate-400 uppercase mb-3">Peak Performance</p>
                                            <p className="text-7xl font-mono font-black text-slate-900 tabular-nums">{highScore.toLocaleString()}</p>
                                        </div>
                                        <button onClick={() => { setGameState('FLOW'); setScore(0); setShield(100); setFlowState(0); setCombo(0); enemies.current = []; FX.current = []; }} className="h-44 w-44 bg-slate-950 text-white rounded-full font-black uppercase tracking-widest text-2xl hover:bg-cyan-500 transition-all transform hover:scale-110 shadow-3xl flex items-center justify-center">同期</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-12 text-[12px] font-black text-slate-300 uppercase tracking-widest">
                                        <div className="space-y-3">
                                            <div className="text-slate-950">HOLD MOUSE</div>
                                            <p>軌道を拡大して待機</p>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="text-slate-950">RELEASE</div>
                                            <p>収縮時の衝撃で情報の排除</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {gameState === 'STOP' && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-3xl">
                                <div className="bg-white p-24 rounded-[7rem] shadow-[0_100px_250px_rgba(0,0,0,0.2)] text-center space-y-12 max-w-2xl w-full border border-slate-100">
                                    <div className="space-y-3">
                                        <h2 className="text-8xl font-black italic text-red-600 tracking-tighter uppercase leading-none">TERMINATED</h2>
                                        <p className="text-[12px] font-black text-slate-300 tracking-[0.5em] uppercase">ニューロフローが限界を超え、遮断されました。</p>
                                    </div>
                                    <div className="py-8 bg-slate-50 rounded-[4rem] border border-slate-100">
                                        <p className="text-[12px] font-black text-slate-400 uppercase mb-2">Final Neural Gain</p>
                                        <p className="text-9xl font-mono font-black text-slate-950 tabular-nums leading-none tracking-tighter">{score.toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col gap-5 px-12">
                                        <button onClick={() => { setGameState('READY'); }} className="w-full py-8 bg-slate-950 text-white rounded-[3rem] font-black uppercase tracking-[0.4em] text-xl hover:bg-cyan-500 transition-all shadow-3xl">RE-ESTABLISH</button>
                                        <a href="/" className="px-12 py-4 text-slate-400 font-bold uppercase text-[12px] tracking-[0.8em] hover:text-slate-950 transition-all">BASE</a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@800&display=swap');
                body { background: #ffffff; cursor: none; }
            `}</style>
        </div>
    );
}

function HUDSection({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
            <p className={`text-4xl font-black ${color} leading-none tracking-tighter`}>{value}</p>
        </div>
    );
}
