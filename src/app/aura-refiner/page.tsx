'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { SITE } from '../../config/site';

// --- Types & Constants ---
interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    type: 'dissonance' | 'logic' | 'chaos' | 'anomaly';
    velocity: { x: number; y: number };
    angle: number;
    rot: number;
    life: number;
}

interface Feedback {
    id: number;
    x: number;
    y: number;
    text: string;
    type: 'score' | 'combo' | 'warning';
}

const SPAWN_RATE_BASE = 0.03;
const MAX_PARTICLES = 40;

// --- Helper Functions ---
const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

export default function AuraRefinerPage() {
    // Game State
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [cohesion, setCohesion] = useState(100);
    const [level, setLevel] = useState(1);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [burstCharge, setBurstCharge] = useState(0);

    // Entities
    const [particles, setParticles] = useState<Particle[]>([]);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    // Refs for logic
    const nextParticleId = useRef(0);
    const nextFeedbackId = useRef(0);
    const requestRef = useRef<number>();
    const lastTimeRef = useRef<number>();
    const comboTimerRef = useRef<NodeJS.Timeout>();
    const coreControls = useAnimation();

    // --- Particle Logic ---
    const spawnParticle = useCallback(() => {
        const rand = Math.random();
        let type: Particle['type'] = 'logic';
        if (rand < 0.2) type = 'dissonance';
        else if (rand < 0.3) type = 'chaos';
        else if (rand < 0.35) type = 'anomaly';

        // Choose spawn edge (0:T, 1:R, 2:B, 3:L)
        const edge = Math.floor(Math.random() * 4);
        let x = 0, y = 0;
        const margin = 10;

        if (edge === 0) { x = Math.random() * 100; y = -margin; }
        else if (edge === 1) { x = 100 + margin; y = Math.random() * 100; }
        else if (edge === 2) { x = Math.random() * 100; y = 100 + margin; }
        else { x = -margin; y = Math.random() * 100; }

        const targetX = 50 + (Math.random() * 4 - 2);
        const targetY = 50 + (Math.random() * 4 - 2);
        const angle = Math.atan2(targetY - y, targetX - x);
        const speed = (0.2 + (level * 0.04)) * (type === 'anomaly' ? 2 : 1);

        const newParticle: Particle = {
            id: nextParticleId.current++,
            x,
            y,
            size: type === 'chaos' ? 45 : (type === 'anomaly' ? 15 : 24),
            type,
            velocity: {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            },
            angle: angle * (180 / Math.PI),
            rot: Math.random() * 360,
            life: 1
        };

        setParticles(prev => [...prev.slice(-(MAX_PARTICLES - 1)), newParticle]);
    }, [level]);

    const addFeedback = (x: number, y: number, text: string, type: Feedback['type'] = 'score') => {
        const id = nextFeedbackId.current++;
        setFeedbacks(prev => [...prev, { id, x, y, text, type }]);
        setTimeout(() => {
            setFeedbacks(prev => prev.filter(f => f.id !== id));
        }, 1000);
    };

    const shakeCore = (severity: 'light' | 'heavy') => {
        coreControls.start({
            x: severity === 'heavy' ? [0, -10, 10, -10, 10, 0] : [0, -4, 4, -4, 4, 0],
            transition: { duration: 0.4 }
        });
    };

    // --- Main Update Loop ---
    const update = useCallback((time: number) => {
        if (lastTimeRef.current !== undefined && gameState === 'playing') {
            const deltaTime = time - lastTimeRef.current;
            const step = deltaTime / 16.6;

            setParticles(prev => {
                const updated = prev.map(p => {
                    // Anomaly logic: occasional zig-zag
                    let vx = p.velocity.x;
                    let vy = p.velocity.y;
                    if (p.type === 'anomaly') {
                        vx += Math.sin(time * 0.01) * 0.1;
                        vy += Math.cos(time * 0.01) * 0.1;
                    }

                    return {
                        ...p,
                        x: p.x + vx * step,
                        y: p.y + vy * step,
                        rot: p.rot + 2 * step
                    };
                });

                const remaining = updated.filter(p => {
                    const dist = getDistance(p.x, p.y, 50, 50);

                    // Hit detection zone
                    if (dist < 6) {
                        if (p.type === 'dissonance' || p.type === 'chaos' || p.type === 'anomaly') {
                            const damage = p.type === 'chaos' ? 15 : (p.type === 'anomaly' ? 10 : 6);
                            setCohesion(c => Math.max(0, c - damage));
                            shakeCore(p.type === 'chaos' ? 'heavy' : 'light');
                            addFeedback(50, 50, `-${damage}`, 'warning');
                            setCombo(0);
                        } else {
                            // Logic particles that are missed also decay cohesion slightly
                            setCohesion(c => Math.max(0, c - 2));
                        }
                        return false;
                    }

                    // Cleanup out of bounds
                    if (p.x < -20 || p.x > 120 || p.y < -20 || p.y > 120) return false;
                    return true;
                });

                return remaining;
            });

            // Spawn rate based on level and charge
            if (Math.random() < SPAWN_RATE_BASE + (level * 0.008)) {
                spawnParticle();
            }
        }
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(update);
    }, [gameState, level, spawnParticle, coreControls]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [update]);

    // --- Game Flow Effects ---
    useEffect(() => {
        if (cohesion <= 0 && gameState === 'playing') {
            setGameState('gameover');
            if (score > highScore) setHighScore(score);
        }
        if (score > level * 800) {
            setLevel(l => l + 1);
            addFeedback(50, 30, "LOGIC EVOLUTION", 'combo');
        }
    }, [cohesion, score, level, gameState, highScore]);

    // --- Interaction ---
    const handleRefine = (p: Particle) => {
        if (gameState !== 'playing') return;

        setParticles(prev => prev.filter(item => item.id !== p.id));

        // Combo Logic
        setCombo(c => {
            const next = c + 1;
            if (next > maxCombo) setMaxCombo(next);
            return next;
        });

        if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
        comboTimerRef.current = setTimeout(() => setCombo(0), 1500);

        // Score Calculation
        let baseScore = 0;
        let chargeAdd = 1;

        switch (p.type) {
            case 'logic': baseScore = 150; break;
            case 'dissonance': baseScore = 100; chargeAdd = 2; break;
            case 'chaos': baseScore = 300; chargeAdd = 5; setCohesion(c => Math.min(100, c + 3)); break;
            case 'anomaly': baseScore = 500; chargeAdd = 10; setCohesion(c => Math.min(100, c + 8)); break;
        }

        const multiplier = 1 + (combo * 0.1);
        const finalScore = Math.floor(baseScore * multiplier);

        setScore(s => s + finalScore);
        setBurstCharge(c => Math.min(100, c + chargeAdd));

        addFeedback(p.x, p.y, `+${finalScore}`);
        if (combo > 0 && combo % 5 === 0) {
            addFeedback(p.x, p.y - 5, `${combo} COMBO!`, 'combo');
        }
    };

    const triggerBurst = () => {
        if (burstCharge < 100 || gameState !== 'playing') return;

        // Clear all harmful particles and get massive score
        setParticles(prev => {
            const harmful = prev.filter(p => p.type !== 'logic');
            const bonus = harmful.length * 200;
            setScore(s => s + bonus);
            if (bonus > 0) addFeedback(50, 40, `BURST: +${bonus}`, 'combo');
            return prev.filter(p => p.type === 'logic');
        });

        setBurstCharge(0);
        setCohesion(c => Math.min(100, c + 15));
        shakeCore('heavy');
    };

    const startGame = () => {
        setScore(0);
        setCohesion(100);
        setParticles([]);
        setLevel(1);
        setCombo(0);
        setMaxCombo(0);
        setBurstCharge(0);
        setGameState('playing');
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-hidden font-sans select-none">

            {/* --- Advanced VFX Layer --- */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Dynamic Grid */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                {/* Nebula Glows */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-[100] pointer-events-none bg-[length:100%_4px,3px_100%]" />
            </div>

            {/* --- Header HUD --- */}
            <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-50">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-1.5 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-[0.2em] leading-none mb-1">
                                {SITE.name} <span className="text-blue-500">//</span> AuraRefiner <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded ml-2 border border-blue-500/30">V2.0</span>
                            </h1>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">Refining Station : aura.{SITE.baseDomain}</span>
                            </div>
                        </div>
                    </div>

                    {/* Burst Ability Bar */}
                    <div className="flex flex-col gap-2 w-64">
                        <div className="flex justify-between items-end">
                            <span className={`text-[10px] font-black tracking-widest ${burstCharge === 100 ? 'text-blue-400' : 'text-slate-500'}`}>AURA BURST PROTOCOL</span>
                            {burstCharge === 100 && (
                                <motion.span
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.5 }}
                                    className="text-[9px] font-bold text-blue-400 bg-blue-400/10 px-2 rounded"
                                > READY [SPACE] </motion.span>
                            )}
                        </div>
                        <div className="h-1.5 bg-slate-900 rounded-full border border-slate-800 p-[1px] relative overflow-hidden">
                            <motion.div
                                className={`h-full rounded-full ${burstCharge === 100 ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)]' : 'bg-slate-700'}`}
                                animate={{ width: `${burstCharge}%` }}
                            />
                            {burstCharge === 100 && (
                                <motion.button
                                    onClick={triggerBurst}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="absolute inset-0 cursor-pointer"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-16">
                    <div className="text-right group">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 group-hover:text-slate-300 transition-colors">Logic Iteration</div>
                        <div className="text-5xl font-mono font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">{level}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Refinement</div>
                        <div className="text-5xl font-mono font-black tabular-nums">{score.toLocaleString()}<span className="text-xs ml-1 text-slate-600 block">PTS</span></div>
                    </div>
                </div>
            </header>

            {/* --- Progress HUD --- */}
            <div className="absolute bottom-12 left-0 right-0 p-8 flex justify-center items-center gap-12 z-50">
                {/* Cohesion Meter */}
                <div className="flex items-center gap-6 bg-slate-900/40 backdrop-blur-xl p-4 px-8 rounded-full border border-slate-800 shadow-2xl">
                    <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Cohesion</div>
                        <div className={`text-2xl font-mono font-black ${cohesion < 30 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{cohesion}%</div>
                    </div>
                    <div className="w-64 h-2 bg-white/5 rounded-full overflow-hidden relative">
                        <motion.div
                            className={`h-full ${cohesion < 30 ? 'bg-red-500' : 'bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600'}`}
                            animate={{ width: `${cohesion}%` }}
                        />
                        {/* Tick marks */}
                        <div className="absolute inset-0 flex justify-between px-2 opacity-20 pointer-events-none">
                            {[...Array(5)].map((_, i) => <div key={i} className="w-px h-full bg-white" />)}
                        </div>
                    </div>
                </div>

                {/* Combo Counter */}
                <AnimatePresence>
                    {combo > 1 && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, x: 20 }}
                            animate={{ scale: 1, opacity: 1, x: 0 }}
                            exit={{ scale: 1.5, opacity: 0, x: -20 }}
                            className="flex flex-col items-center"
                        >
                            <span className="text-[10px] font-black text-blue-400 tracking-[0.5em] mb-[-4px]">MULT. x{(1 + combo * 0.1).toFixed(1)}</span>
                            <div className="text-5xl font-black font-mono italic text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]">
                                {combo}<span className="text-xl not-italic ml-1">HIT</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* --- Active Game Field --- */}
            <div className="relative w-full h-full flex items-center justify-center transform scale-110">
                {/* Core Engine */}
                <motion.div
                    animate={coreControls}
                    className="relative w-40 h-40 flex items-center justify-center"
                >
                    <div className="absolute inset-[-100px] bg-[radial-gradient(circle,rgba(37,99,235,0.1)_0%,transparent_70%)] rounded-full animate-pulse" />
                    <div className="absolute inset-0 border-[3px] border-white/5 rounded-full rotate-45" />

                    {/* Rotating Rings */}
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute inset-0 border border-blue-500/20 rounded-full" />
                    <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="absolute inset-4 border border-indigo-500/10 rounded-full border-dashed" />
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute inset-10 border-2 border-slate-100/10 rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]" />

                    {/* Core Heart */}
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className={`absolute inset-0 rounded-full blur-md ${cohesion < 30 ? 'bg-red-500' : 'bg-white'}`}
                        />
                        <div className={`w-3 h-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10 ${cohesion < 30 ? 'bg-red-200' : 'bg-white'}`} />
                    </div>

                    {/* Level Glow */}
                    <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
                </motion.div>

                {/* Floating Particles */}
                <div className="absolute inset-0 pointer-events-none">
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                                left: `${p.x}vw`,
                                top: `${p.y}vh`,
                                scale: 1,
                                opacity: 1,
                                rotate: p.rot
                            }}
                            className="absolute pointer-events-auto"
                            style={{ width: p.size, height: p.size, marginLeft: `-${p.size / 2}px`, marginTop: `-${p.size / 2}px` }}
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); handleRefine(p); }}
                                className="w-full h-full relative group transition-transform active:scale-75"
                            >
                                {/* Visuals for Particles */}
                                {p.type === 'logic' && (
                                    <div className="w-full h-full border-2 border-blue-400 bg-blue-400/20 backdrop-blur-sm rounded flex items-center justify-center shadow-[0_0_10px_rgba(96,165,250,0.3)]">
                                        <div className="w-1/2 h-1 bg-blue-400/50 rounded-full" />
                                    </div>
                                )}
                                {p.type === 'dissonance' && (
                                    <div className="w-full h-full border-2 border-slate-500 bg-slate-900/60 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                                        <div className="w-2 h-2 bg-slate-500 rounded-sm rotate-45" />
                                    </div>
                                )}
                                {p.type === 'chaos' && (
                                    <div className="w-full h-full relative">
                                        <div className="absolute inset-0 bg-pink-500/20 rounded-lg blur-md animate-ping" />
                                        <div className="w-full h-full border-[3px] border-pink-500 bg-pink-900/40 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                                            <div className="w-3 h-3 bg-pink-500 rotate-45" />
                                        </div>
                                    </div>
                                )}
                                {p.type === 'anomaly' && (
                                    <div className="w-full h-full relative animate-spin">
                                        <div className="absolute inset-0 bg-yellow-400/40 blur-lg" />
                                        <div className="w-full h-full border-2 border-yellow-400 bg-yellow-400 flex items-center justify-center rounded-sm">
                                            <div className="w-full h-px bg-black opacity-20" />
                                        </div>
                                    </div>
                                )}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Score & Feedback Text */}
                <AnimatePresence>
                    {feedbacks.map((f) => (
                        <motion.div
                            key={f.id}
                            initial={{ opacity: 0, y: 0, scale: 0.5 }}
                            animate={{ opacity: 1, y: -40, scale: 1 }}
                            exit={{ opacity: 0, y: -80 }}
                            className={`absolute font-black pointer-events-none z-[60] text-xl drop-shadow-md tabular-nums ${f.type === 'score' ? 'text-white/80' : (f.type === 'combo' ? 'text-blue-400 text-3xl italic' : 'text-red-500')
                                }`}
                            style={{ left: `${f.x}vw`, top: `${f.y}vh` }}
                        >
                            {f.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* --- Overlays & States --- */}
            <AnimatePresence>
                {gameState === 'idle' && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-[#020617]/90 backdrop-blur-2xl"
                    >
                        <div className="max-w-xl text-center space-y-12 p-8">
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}
                                    className="text-[10px] font-black text-blue-500 tracking-[1em] uppercase mb-4"
                                > Systems Initializing </motion.div>
                                <h2 className="text-8xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-800">AURA<br />REFINER</h2>
                                <p className="text-slate-500 font-medium leading-relaxed">カオスを秩序へ、ノイズを論理へ。浮遊する情報を精製し、システムの凝集性を維持せよ。MegaDrawk Industries が贈る、次世代知性トレーニング・シミュレーター。</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 transition-colors hover:border-slate-700">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Previous Operation</div>
                                    <div className="text-2xl font-mono font-black">{highScore.toLocaleString()}</div>
                                </div>
                                <button
                                    onClick={startGame}
                                    className="bg-white text-black p-6 rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                                >
                                    Sync & Start
                                </button>
                            </div>

                            <div className="flex justify-center gap-12 pt-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500" /> <span className="text-[9px] font-bold tracking-widest uppercase">Logic (+PTS)</span></div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-pink-500" /> <span className="text-[9px] font-bold tracking-widest uppercase">Chaos (+REGEN)</span></div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-yellow-400" /> <span className="text-[9px] font-bold tracking-widest uppercase">Anomaly (ULTRA)</span></div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {gameState === 'gameover' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 z-[110] flex flex-col items-center justify-center bg-red-950/95 backdrop-blur-3xl"
                    >
                        <div className="text-center space-y-12">
                            <div className="space-y-4">
                                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 mb-6 bg-red-500/10 px-6 py-2 rounded-full inline-block border border-red-500/20">Critical System Error</div>
                                <h2 className="text-9xl font-black tracking-tighter italic">ENTROPY<br />OVERFLOW</h2>
                                <div className="flex justify-center gap-16 py-8">
                                    <div className="text-center">
                                        <div className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-2">Final Index</div>
                                        <div className="text-6xl font-mono font-black">{score.toLocaleString()}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-2">Max Synergy</div>
                                        <div className="text-6xl font-mono font-black">{maxCombo}×</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-6 justify-center">
                                <button
                                    onClick={startGame}
                                    className="px-16 py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full hover:bg-red-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl"
                                >
                                    Reconnect System
                                </button>
                                <a
                                    href="/"
                                    className="px-16 py-5 bg-transparent text-white border-2 border-white/20 font-black uppercase tracking-widest text-sm rounded-full hover:bg-white/10 transition-all"
                                >
                                    Abort to Dashboard
                                </a>
                            </div>
                        </div>

                        {/* Glitch Effect Elements */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="absolute bg-white h-px w-full" style={{ top: `${Math.random() * 100}%`, opacity: Math.random() }} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Utility / Nav --- */}
            <a href="/" className="absolute bottom-8 left-8 text-[10px] font-black uppercase tracking-[0.6em] text-slate-600 hover:text-blue-400 transition-colors flex items-center gap-4 group z-50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="group-hover:-translate-x-2 transition-transform">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Return to Neutral Base
            </a>

            {/* Footer Branding */}
            <div className="absolute bottom-8 right-8 text-[10px] font-black text-slate-700 uppercase tracking-widest z-50">
                Integrated by MegaDrawk Core Systems // Dept. of Digital Art
            </div>

        </div>
    );
}
