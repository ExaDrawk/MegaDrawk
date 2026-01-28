'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SITE } from '../../config/site';

const SPAWN_INTERVAL = 400;

/**
 * LOGIC FLUX: THE NEURO-SYNCHRONIZER (V3.1 - ASCENSION)
 * -----------------------------------------
 * A massive, high-octane neuro-synchronization simulation.
 * 
 * FEATURES:
 * - 3 Combat Modes (Triangle, Square, Circle)
 * - Pulse & Tether Chains
 * - Overdrive Mode (High Risk/Reward)
 * - Persistent Upgrade System (Logic Shards)
 * - Dynamic Global Events (Anomaly Spikes)
 */

const COLORS = {
    CYAN: '#00f2ff',
    LIME: '#00ff88',
    YELLOW: '#fff200',
    ORANGE: '#ff9d00',
    RED: '#ff4d00',
    BG: '#f8fafc',
    TEXT: '#0f172a',
    GRID: 'rgba(15, 23, 42, 0.05)',
};

const SHAPES = ['TRIANGLE', 'SQUARE', 'CIRCLE'] as const;
type ShapeType = typeof SHAPES[number];

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    shape: ShapeType;
    color: string;
    velocity: { x: number; y: number };
    state: 'active' | 'synced' | 'harvested' | 'exploding';
    birth: number;
    special?: 'splitter' | 'booster' | 'anomaly';
    health?: number;
    freq: number;
}

interface Pulse {
    id: number;
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    shape: ShapeType;
}

interface VisualLog {
    id: number;
    text: string;
    type: 'info' | 'warn' | 'success' | 'danger';
    time: number;
}

interface Upgrade {
    id: string;
    name: string;
    description: string;
    level: number;
    maxLevel: 5;
    cost: number;
}

const INITIAL_UPGRADES: Upgrade[] = [
    { id: 'pulse_radius', name: 'パルス半径 拡張', description: '同期パルスの到達距離を拡大', level: 0, maxLevel: 5, cost: 500 },
    { id: 'tether_power', name: 'テザー吸引力', description: 'テザーによる粒子回収速度を向上', level: 0, maxLevel: 5, cost: 800 },
    { id: 'core_recovery', name: '自己修復プロトコル', description: '回収時のコア復旧量を増加', level: 0, maxLevel: 5, cost: 1200 },
    { id: 'score_multiplier', name: 'データ抽出効率', description: '基本獲得スコアをブースト', level: 0, maxLevel: 5, cost: 1500 },
];

export function LogicFlux() {
    // --- State Management ---
    const [gameState, setGameState] = useState<'IDLE' | 'SYNCING' | 'OVERLOAD' | 'UPGRADING'>('IDLE');
    const [score, setScore] = useState(0);
    const [logicShards, setLogicShards] = useState(0);
    const [neuroLink, setNeuroLink] = useState(1);
    const [stability, setStability] = useState(100);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [activeShape, setActiveShape] = useState<ShapeType>('TRIANGLE');
    const [upgrades, setUpgrades] = useState(INITIAL_UPGRADES);
    const [overdrive, setOverdrive] = useState(0); // 0 to 100
    const [isOverdriveActive, setIsOverdriveActive] = useState(false);

    // UI Systems
    const [logs, setLogs] = useState<VisualLog[]>([]);
    const [highScore, setHighScore] = useState(0);

    // Refs for Physics
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const pulses = useRef<Pulse[]>([]);
    const mousePos = useRef({ x: 0, y: 0 });
    const lastId = useRef(0);
    const frameId = useRef(0);
    const lastSpawn = useRef(0);
    const tetherActive = useRef(false);

    // --- Helpers ---
    const addLog = useCallback((text: string, type: VisualLog['type'] = 'info') => {
        const id = Date.now() + Math.random();
        setLogs(prev => [{ id, text, type, time: Date.now() }, ...prev.slice(0, 6)]);
    }, []);

    const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    // --- Game Actions ---
    const spawnParticle = useCallback(() => {
        const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        let color = COLORS.CYAN;
        if (shape === 'SQUARE') color = COLORS.LIME;
        if (shape === 'CIRCLE') color = COLORS.YELLOW;

        const randSpecial = Math.random();
        let special: Particle['special'] = undefined;
        if (randSpecial < 0.05) { special = 'anomaly'; color = COLORS.RED; }
        else if (randSpecial < 0.1) { special = 'splitter'; }
        else if (randSpecial < 0.15) { special = 'booster'; color = COLORS.ORANGE; }

        const side = Math.floor(Math.random() * 4);
        let x = 0, y = 0;
        const margin = 50;
        if (side === 0) { x = Math.random() * 1000; y = -margin; }
        else if (side === 1) { x = 1000 + margin; y = Math.random() * 1000; }
        else if (side === 2) { x = Math.random() * 1000; y = 1000 + margin; }
        else { x = -margin; y = Math.random() * 1000; }

        const targetX = 500;
        const targetY = 500;
        const angle = Math.atan2(targetY - y, targetX - x);
        const speed = (isOverdriveActive ? 4 : 2) + (neuroLink * 0.2) + Math.random() * 1.5;

        particles.current.push({
            id: lastId.current++,
            x, y,
            size: special === 'anomaly' ? 40 : 20,
            shape, color,
            velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
            state: 'active',
            birth: Date.now(),
            special,
            health: special === 'anomaly' ? 3 : 1,
            freq: 1 + Math.random()
        });
    }, [neuroLink, isOverdriveActive]);

    const emitPulse = useCallback(() => {
        const upgradeLevel = upgrades.find(u => u.id === 'pulse_radius')?.level || 0;
        const radius = 350 + (upgradeLevel * 70);

        pulses.current.push({
            id: Date.now() + Math.random(),
            x: 500, y: 500,
            radius: 0,
            maxRadius: radius,
            shape: activeShape
        });

        let synced = 0;
        particles.current.forEach(p => {
            if (p.state === 'active') {
                const d = getDistance(p.x, p.y, 500, 500);
                if (d < radius && p.shape === activeShape) {
                    if (p.special === 'anomaly') {
                        p.health! -= 1;
                        if (p.health! <= 0) p.state = 'synced';
                    } else {
                        p.state = 'synced';
                    }
                    synced++;
                }
            }
        });
        if (synced > 0) {
            setCombo(c => c + synced);
            setOverdrive(o => Math.min(100, o + synced * 0.5));
        }
    }, [activeShape, upgrades]);

    const harvestTether = useCallback(() => {
        const tetherLevel = upgrades.find(u => u.id === 'tether_power')?.level || 0;
        const range = 60 + (tetherLevel * 20);

        particles.current.forEach(p => {
            if (p.state === 'synced') {
                const d = getDistance(p.x, p.y, mousePos.current.x, mousePos.current.y);
                if (d < range) {
                    p.state = 'harvested';
                    const multLevel = upgrades.find(u => u.id === 'score_multiplier')?.level || 0;
                    const baseGain = 150 + (multLevel * 50);
                    const gain = Math.floor(baseGain * (1 + combo * 0.1) * neuroLink * (isOverdriveActive ? 3 : 1));
                    setScore(s => s + gain);
                    setLogicShards(l => l + (p.special === 'booster' ? 50 : 5));

                    const recoveryLevel = upgrades.find(u => u.id === 'core_recovery')?.level || 0;
                    setStability(s => Math.min(100, s + 0.2 + (recoveryLevel * 0.1)));
                }
            }
        });
    }, [combo, neuroLink, isOverdriveActive, upgrades]);

    const toggleOverdrive = useCallback(() => {
        if (overdrive >= 100 && !isOverdriveActive) {
            setIsOverdriveActive(true);
            setOverdrive(100);
            addLog("!! OVERDRIVE MODE ACTIVATED !!", 'danger');

            const interval = setInterval(() => {
                setOverdrive(prev => {
                    const next = prev - 2;
                    if (next <= 0) {
                        clearInterval(interval);
                        setIsOverdriveActive(false);
                        addLog("Overdrive Depleted.", 'info');
                        return 0;
                    }
                    return next;
                });
            }, 100);
        }
    }, [overdrive, isOverdriveActive, addLog]);

    // --- Main Loop ---
    const update = useCallback((time: number) => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Visual Effects
        ctx.fillStyle = isOverdriveActive ? 'rgba(0, 242, 255, 0.05)' : COLORS.BG;
        ctx.fillRect(0, 0, 1000, 1000);

        // Render Grid
        ctx.strokeStyle = isOverdriveActive ? 'rgba(0, 242, 255, 0.15)' : COLORS.GRID;
        ctx.lineWidth = 1;
        for (let i = 0; i <= 1000; i += 50) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1000); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1000, i); ctx.stroke();
        }

        if (gameState === 'SYNCING') {
            const spawnRate = Math.max(80, SPAWN_INTERVAL - (neuroLink * 15) - (isOverdriveActive ? 100 : 0));
            if (time - lastSpawn.current > spawnRate) {
                spawnParticle();
                lastSpawn.current = time;
            }

            // Pulses
            pulses.current = pulses.current.filter(p => {
                p.radius += 15;
                ctx.beginPath();
                ctx.strokeStyle = activeShape === p.shape ? COLORS.CYAN : 'rgba(0,0,0,0.05)';
                ctx.lineWidth = isOverdriveActive ? 6 : 2;
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.stroke();
                return p.radius < p.maxRadius;
            });

            // Tether
            if (tetherActive.current) {
                harvestTether();
                ctx.beginPath();
                ctx.strokeStyle = isOverdriveActive ? '#fff' : COLORS.ORANGE;
                ctx.lineWidth = 4;
                ctx.setLineDash([5, 5]);
                ctx.arc(mousePos.current.x, mousePos.current.y, 60, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);

                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255,157,0, 0.2)';
                ctx.moveTo(500, 500); ctx.lineTo(mousePos.current.x, mousePos.current.y); ctx.stroke();
            }

            // Particles
            particles.current = particles.current.filter(p => {
                const pullSpeed = isOverdriveActive ? 0.25 : 0.15;
                if (p.state === 'harvested') {
                    p.x += (500 - p.x) * pullSpeed;
                    p.y += (500 - p.y) * pullSpeed;
                    if (getDistance(p.x, p.y, 500, 500) < 30) return false;
                } else if (p.state === 'synced') {
                    p.x += p.velocity.x * 0.1;
                    p.y += p.velocity.y * 0.1;
                } else {
                    p.x += p.velocity.x;
                    p.y += p.velocity.y;
                }

                const distToCore = getDistance(p.x, p.y, 500, 500);
                if (distToCore < 45 && p.state === 'active') {
                    const dmg = p.special === 'anomaly' ? 20 : 6;
                    setStability(s => Math.max(0, s - dmg));
                    setCombo(0);
                    addLog(`警告: コア侵食 (${dmg}%)`, 'warn');
                    return false;
                }

                // Draw Particle
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(time * 0.003 * p.freq);
                ctx.fillStyle = p.state === 'synced' ? COLORS.ORANGE : p.color;
                if (isOverdriveActive && p.state === 'synced') ctx.fillStyle = '#fff';

                ctx.beginPath();
                if (p.shape === 'TRIANGLE') { ctx.moveTo(0, -p.size); ctx.lineTo(p.size, p.size); ctx.lineTo(-p.size, p.size); }
                else if (p.shape === 'SQUARE') { ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size); }
                else { ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); }
                ctx.fill();

                if (p.special === 'anomaly') {
                    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
                }
                ctx.restore();

                return p.x > -200 && p.x < 1200 && p.y > -200 && p.y < 1200;
            });

            // Core UI
            drawCore(ctx, time);
        }

        frameId.current = requestAnimationFrame(update);
    }, [gameState, neuroLink, activeShape, isOverdriveActive, spawnParticle, harvestTether, addLog]);

    const drawCore = (ctx: CanvasRenderingContext2D, time: number) => {
        ctx.save();
        ctx.translate(500, 500);

        ctx.shadowBlur = isOverdriveActive ? 40 : 0;
        ctx.shadowColor = COLORS.CYAN;

        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.strokeStyle = isOverdriveActive ? COLORS.CYAN : `rgba(15, 23, 42, ${0.12 - i * 0.03})`;
            ctx.lineWidth = 2;
            const r = 60 + i * 25 + Math.sin(time * 0.003 + i) * 12;
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.fillStyle = isOverdriveActive ? '#fff' : COLORS.TEXT;
        const s = 40 + Math.sin(time * 0.006) * 6;
        ctx.beginPath();
        if (activeShape === 'TRIANGLE') { ctx.moveTo(0, -s); ctx.lineTo(s, s); ctx.lineTo(-s, s); }
        else if (activeShape === 'SQUARE') { ctx.rect(-s / 2, -s / 2, s, s); }
        else { ctx.arc(0, 0, s / 1.5, 0, Math.PI * 2); }
        ctx.fill();

        ctx.restore();
    };

    // --- Input Binding ---
    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (gameState !== 'SYNCING') return;
            if (e.key === 'ArrowUp' || e.key === 'w') setActiveShape('TRIANGLE');
            if (e.key === 'ArrowRight' || e.key === 'd') setActiveShape('SQUARE');
            if (e.key === 'ArrowDown' || e.key === 's') setActiveShape('CIRCLE');
            if (e.key === ' ') { e.preventDefault(); emitPulse(); }
            if (e.key === 'Shift') { e.preventDefault(); toggleOverdrive(); }
            if (e.key === 'u' || e.key === 'Escape') setGameState(s => s === 'UPGRADING' ? 'SYNCING' : 'UPGRADING');
        };
        const handleMouse = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const r = canvasRef.current.getBoundingClientRect();
            mousePos.current = { x: (e.clientX - r.left) * (1000 / r.width), y: (e.clientY - r.top) * (1000 / r.height) };
        };
        window.addEventListener('keydown', handleKeys);
        window.addEventListener('mousemove', handleMouse);
        window.addEventListener('mousedown', () => tetherActive.current = true);
        window.addEventListener('mouseup', () => tetherActive.current = false);
        return () => { window.removeEventListener('keydown', handleKeys); window.removeEventListener('mousemove', handleMouse); };
    }, [gameState, emitPulse, toggleOverdrive]);

    useEffect(() => {
        frameId.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId.current);
    }, [update]);

    useEffect(() => {
        if (stability <= 0 && gameState === 'SYNCING') {
            setGameState('IDLE');
            addLog("!! システム致命的崩壊 : セッション終了 !!", 'danger');
            if (score > highScore) setHighScore(score);
        }
        if (neuroLink < 15 && score > neuroLink * neuroLink * 4000) {
            setNeuroLink(n => n + 1);
            addLog(`ニューロリンク 同期レベル [LV.${neuroLink + 1}] に上昇`, 'success');
        }
        if (combo > maxCombo) setMaxCombo(combo);
    }, [score, stability, neuroLink, gameState, combo, highScore, addLog, maxCombo]);

    // --- Helpers ---
    const buyUpgrade = (u: Upgrade) => {
        if (logicShards >= u.cost && u.level < u.maxLevel) {
            setLogicShards(l => l - u.cost);
            setUpgrades(prev => prev.map(item => item.id === u.id ? { ...item, level: item.level + 1, cost: Math.floor(item.cost * 1.8) } : item));
            addLog(`${u.name} をアップグレードしました`, 'success');
        }
    };

    return (
        <div className={`min-h-screen ${isOverdriveActive ? 'bg-cyan-50' : 'bg-slate-50'} text-slate-900 font-sans transition-colors duration-500 overflow-hidden relative`}>

            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none z-20 flex flex-col p-8 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.02)_100%)]">
                <div className="flex justify-between items-start">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <motion.div animate={{ rotate: isOverdriveActive ? 360 : 0 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="h-10 w-10 border-4 border-cyan-500 rounded-lg flex items-center justify-center font-black">LF</motion.div>
                            <div>
                                <h1 className="text-2xl font-black italic tracking-tighter uppercase">LOGIC<span className="text-cyan-500">FLUX</span></h1>
                                <p className="text-[9px] font-bold text-slate-400 tracking-[0.4em] uppercase">Phase Ascension 3.1</p>
                            </div>
                        </div>

                        <div className="flex gap-4 pointer-events-auto">
                            <div className="HUD-CARD flex items-center gap-6 p-4 bg-white/90 backdrop-blur border-2 border-slate-100 rounded-3xl shadow-xl">
                                <HUDItem label="Neuro Link" value={`LV.${neuroLink}`} color="text-cyan-500" />
                                <div className="h-8 w-px bg-slate-100" />
                                <HUDItem label="Logic Shards" value={logicShards.toLocaleString()} color="text-lime-500" />
                            </div>
                            <div className="HUD-CARD p-4 bg-slate-900 text-white rounded-3xl shadow-xl flex items-center gap-8">
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Score Matrix</p>
                                    <p className="text-3xl font-mono font-black">{score.toLocaleString()}</p>
                                </div>
                                {combo > 0 && (
                                    <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-right">
                                        <p className="text-[9px] font-black text-cyan-400 uppercase mb-1">Combo</p>
                                        <p className="text-3xl font-black italic text-cyan-400">{combo}×</p>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-80 space-y-3 pointer-events-auto">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Neural Stability</span>
                            <span className={`font-black font-mono ${stability < 30 ? 'text-red-500' : ''}`}>{Math.floor(stability)}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden border border-white shadow-inner">
                            <motion.div animate={{ width: `${stability}%` }} className={`h-full ${stability < 30 ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-lime-500'}`} />
                        </div>

                        <div className="pt-4 border-t border-slate-200">
                            <AnimatePresence>
                                {logs.map(log => (
                                    <motion.div key={log.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                                        className={`text-[10px] font-bold p-2.5 rounded-xl border-l-4 mb-2 shadow-sm ${log.type === 'danger' ? 'bg-red-950 text-red-100 border-red-500' :
                                            log.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-500' :
                                                log.type === 'warn' ? 'bg-orange-50 text-orange-700 border-orange-500' :
                                                    'bg-white text-slate-600 border-slate-300'
                                            }`}
                                    >
                                        {log.text}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="mt-auto flex justify-between items-end">
                    <div className="space-y-4 pointer-events-auto">
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Overdrive Gauge</span>
                            {overdrive >= 100 && <motion.span animate={{ opacity: [1, 0, 1] }} className="text-[9px] font-black text-orange-500 tracking-widest">[SHIFT] 起動準備完了</motion.span>}
                        </div>
                        <div className="w-80 h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-white shadow-inner">
                            <motion.div animate={{ width: `${overdrive}%` }} className={`h-full rounded-full ${overdrive >= 100 ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-cyan-400'}`} />
                        </div>
                    </div>

                    <div className="flex gap-6 pointer-events-auto">
                        <button onClick={() => setGameState(s => s === 'UPGRADING' ? 'SYNCING' : 'UPGRADING')} className="px-8 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-cyan-500 transition-all shadow-lg">
                            [U] Upgrades
                        </button>
                        <a href="/" className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-xl">
                            Back to Base
                        </a>
                    </div>
                </div>
            </div>

            {/* Central Viewport */}
            <main className="h-screen flex items-center justify-center p-12">
                <div className="relative aspect-square h-[85vh] rounded-[4rem] overflow-hidden shadow-[0_50px_120px_rgba(0,0,0,0.12)] bg-white border border-slate-100">
                    <canvas ref={canvasRef} width={1000} height={1000} className="w-full h-full cursor-crosshair" />

                    {/* Overlays */}
                    <AnimatePresence>
                        {gameState === 'IDLE' && <MenuScreen score={highScore} onStart={() => { setScore(0); setStability(100); setNeuroLink(1); setCombo(0); setLogicShards(0); setGameState('SYNCING'); particles.current = []; addLog("Initializing Neural Link..."); }} />}
                        {gameState === 'UPGRADING' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-xl flex items-center justify-center p-20">
                                <div className="max-w-3xl w-full space-y-12">
                                    <div className="flex justify-between items-end">
                                        <h2 className="text-5xl font-black italic">UPGRADE <span className="text-cyan-500">CORE</span></h2>
                                        <p className="text-xl font-mono text-lime-500 font-bold">SHARDS: {logicShards.toLocaleString()}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        {upgrades.map(u => (
                                            <button key={u.id} onClick={() => buyUpgrade(u)} disabled={logicShards < u.cost || u.level >= u.maxLevel} className="UpgradeButton p-6 border-2 border-slate-100 rounded-3xl text-left transition-all hover:border-cyan-500 group disabled:opacity-50">
                                                <div className="flex justify-between mb-4">
                                                    <h4 className="font-black text-sm uppercase">{u.name}</h4>
                                                    <span className="text-[10px] font-bold py-1 px-3 bg-slate-100 rounded-full">LV.{u.level}</span>
                                                </div>
                                                <p className="text-xs text-slate-400 mb-6">{u.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex gap-1">
                                                        {[...Array(u.maxLevel)].map((_, i) => <div key={i} className={`h-1 w-6 rounded-full ${i < u.level ? 'bg-cyan-500' : 'bg-slate-200'}`} />)}
                                                    </div>
                                                    <span className="text-sm font-black text-lime-600 italic">COST: {u.cost.toLocaleString()}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                    <button onClick={() => setGameState('SYNCING')} className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-cyan-500 transition-all shadow-xl">
                                        演算再開 [ESC]
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <style jsx global>{`
                .container-max { max-width: 1600px; margin: 0 auto; width: 100%; }
                .UpgradeButton:hover:not(:disabled) { transform: translateY(-4px); background: #fff; }
            `}</style>
        </div>
    );
}

function HUDItem({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
        </div>
    );
}

function MenuScreen({ score, onStart }: { score: number, onStart: () => void }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-2xl p-12">
            <div className="max-w-2xl w-full text-center space-y-12">
                <div className="space-y-4">
                    <div className="inline-block px-6 py-2 bg-cyan-100/50 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-[0.4em] border border-cyan-200">System Ready</div>
                    <h2 className="text-9xl font-black italic tracking-tighter leading-none text-slate-900">LOGIC<br /><span className="text-cyan-500">FLUX</span></h2>
                    <p className="text-slate-400 font-medium text-lg max-w-lg mx-auto leading-relaxed">情報の不確実性を排除せよ。ニューラル周波数を合わせ、巨大な知性網（ネットワーク）を構築するための次世代シミュレーター。</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-50 border-2 border-slate-100 p-8 rounded-[3rem] text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Synchronicity</p>
                        <p className="text-5xl font-mono font-black">{score.toLocaleString()}</p>
                    </div>
                    <button onClick={onStart} className="bg-slate-900 text-white p-8 rounded-[3rem] font-black uppercase tracking-widest shadow-2xl hover:bg-cyan-500 transition-all transform hover:scale-105 active:scale-95">同期開始</button>
                </div>
                <div className="flex justify-center gap-12 text-[10px] font-black text-slate-300 uppercase tracking-[0.6em]">
                    <span>[↑→↓] SYNC</span>
                    <span>[SPACE] PULSE</span>
                    <span>[SHIFT] DRIVE</span>
                </div>
            </div>
        </motion.div>
    );
}
