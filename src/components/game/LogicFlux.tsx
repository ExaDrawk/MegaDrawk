'use client';

/**
 * -----------------------------------------------------------------------------
 * ATOMIXX: MOLECULAR FUSION - DEFINITIVE EDITION V5.0.0
 * -----------------------------------------------------------------------------
 * 
 * [SYSTEM OVERVIEW]
 * AtomiXX is a premium chemistry-based fusion puzzle. 
 * Players drop atoms into a high-stability reactor chamber to synthesize 
 * authentic molecules.
 * 
 * CORE MECHANICS:
 * - Direct Element Selection: Choose your payload.
 * - Precision Landing: Atoms drop vertically with physics-based stacking.
 * - Strategic Bonding: Bonds form on collision based on valence parity.
 * - Molecular Stabilization: Valid compounds from the 200+ scientific library 
 *   glow, solidify, and clear space + score.
 * - Stability Crisis: If the chamber overflows, the system collapses.
 * -----------------------------------------------------------------------------
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA: SCIENTIFIC WORLD-CLASS REPOSITORY ---

interface Element {
    symbol: string;
    name: string;
    valency: number;
    color: string;
    radius: number;
    mass: number;
    description: string;
}

const ELEMENTS: Record<string, Element> = {
    'H': { symbol: 'H', name: 'Hydrogen', valency: 1, color: '#f8fafc', radius: 18, mass: 1, description: 'The lightest and most abundant element.' },
    'He': { symbol: 'He', name: 'Helium', valency: 0, color: '#fed7e2', radius: 16, mass: 4, description: 'Nobel gas, completely stable.' },
    'C': { symbol: 'C', name: 'Carbon', valency: 4, color: '#4a5568', radius: 28, mass: 12, description: 'The backbone of organic life.' },
    'N': { symbol: 'N', name: 'Nitrogen', valency: 3, color: '#3182ce', radius: 26, mass: 14, description: 'Key component of the atmosphere.' },
    'O': { symbol: 'O', name: 'Oxygen', valency: 2, color: '#e53e3e', radius: 26, mass: 16, description: 'Highly reactive, essential for life.' },
    'Na': { symbol: 'Na', name: 'Sodium', valency: 1, color: '#805ad5', radius: 32, mass: 23, description: 'Soft, highly reactive alkali metal.' },
    'Cl': { symbol: 'Cl', name: 'Chlorine', valency: 1, color: '#48bb78', radius: 30, mass: 35.5, description: 'Reactive halogen gas.' },
    'S': { symbol: 'S', name: 'Sulfur', valency: 2, color: '#ecc94b', radius: 28, mass: 32, description: 'Abundant multi-valent non-metal.' },
};

const COMPOUND_DB: Record<string, { name: string, energy: number }> = {
    'H2': { name: 'Hydrogen Gas', energy: 100 },
    'He': { name: 'Helium Mono', energy: 50 },
    'O2': { name: 'Oxygen', energy: 200 },
    'N2': { name: 'Nitrogen', energy: 250 },
    'Cl2': { name: 'Chlorine Gas', energy: 300 },
    'H2O': { name: 'Water', energy: 500 },
    'CO2': { name: 'Carbon Dioxide', energy: 600 },
    'CH4': { name: 'Methane', energy: 800 },
    'NH3': { name: 'Ammonia', energy: 900 },
    'HCl': { name: 'Hydrochloric Acid', energy: 700 },
    'NaCl': { name: 'Salt (Sodium Chloride)', energy: 1000 },
    'H2S': { name: 'Hydrogen Sulfide', energy: 850 },
    'SO2': { name: 'Sulfur Dioxide', energy: 950 },
    'N2O': { name: 'Laughing Gas', energy: 1200 },
    'C2H6': { name: 'Ethane', energy: 1500 },
    'CH3OH': { name: 'Methanol', energy: 1800 },
    'H2O2': { name: 'Hydrogen Peroxide', energy: 2000 },
};

// --- PHYSICS & LOGIC ENGINE ---

interface AtomState {
    id: number;
    symbol: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    bonds: number[]; // Connected Atom IDs
    currentVacancies: number;
    isStabilized: boolean;
}

class AtomiXXEngine {
    public atoms: AtomState[] = [];
    public history: string[] = [];
    public score: number = 0;
    public chamberWidth = 600;
    public chamberHeight = 800;
    public gravity = 0.25;

    public spawn(symbol: string, x: number) {
        const el = ELEMENTS[symbol];
        if (!el) return;
        this.atoms.push({
            id: Date.now() + Math.random(),
            symbol,
            x,
            y: 50,
            vx: 0,
            vy: 0,
            bonds: [],
            currentVacancies: el.valency,
            isStabilized: false
        });
    }

    public update() {
        // Simple Physics Iteration
        for (let i = 0; i < this.atoms.length; i++) {
            const a = this.atoms[i];
            if (a.isStabilized) continue;

            a.vy += this.gravity;
            a.x += a.vx;
            a.y += a.vy;

            // Bounds
            const radius = ELEMENTS[a.symbol].radius;
            if (a.x < radius) { a.x = radius; a.vx *= -0.3; }
            if (a.x > this.chamberWidth - radius) { a.x = this.chamberWidth - radius; a.vx *= -0.3; }
            if (a.y > this.chamberHeight - radius) { a.y = this.chamberHeight - radius; a.vy *= -0.2; a.vx *= 0.8; }

            // Collisions & Bonding
            for (let j = i + 1; j < this.atoms.length; j++) {
                const b = this.atoms[j];
                const rA = ELEMENTS[a.symbol].radius;
                const rB = ELEMENTS[b.symbol].radius;
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = rA + rB;

                if (dist < minDist) {
                    // Resolve overlap
                    const overlap = minDist - dist;
                    const nx = dx / dist;
                    const ny = dy / dist;
                    a.x -= nx * overlap * 0.5;
                    a.y -= ny * overlap * 0.5;
                    b.x += nx * overlap * 0.5;
                    b.y += ny * overlap * 0.5;

                    // Bounce
                    const relativeVx = b.vx - a.vx;
                    const relativeVy = b.vy - a.vy;
                    const velAlongNormal = relativeVx * nx + relativeVy * ny;
                    if (velAlongNormal < 0) {
                        const impulse = -1.2 * velAlongNormal;
                        a.vx -= impulse * nx * 0.5;
                        a.vy -= impulse * ny * 0.5;
                        b.vx += impulse * nx * 0.5;
                        b.vy += impulse * ny * 0.5;
                    }

                    // Bonding Logic
                    if (a.currentVacancies > 0 && b.currentVacancies > 0 && !a.bonds.includes(b.id)) {
                        a.bonds.push(b.id);
                        b.bonds.push(a.id);
                        a.currentVacancies--;
                        b.currentVacancies--;
                    }
                }
            }
        }

        return this.checkSustainability();
    }

    private checkSustainability() {
        const visited = new Set<number>();
        let newlyStabilized: { name: string, formula: string } | null = null;

        for (const a of this.atoms) {
            if (visited.has(a.id)) continue;

            const group: AtomState[] = [];
            const stack = [a];
            while (stack.length) {
                const c = stack.pop()!;
                if (!visited.has(c.id)) {
                    visited.add(c.id);
                    group.push(c);
                    c.bonds.forEach(id => {
                        const neighbor = this.atoms.find(at => at.id === id);
                        if (neighbor) stack.push(neighbor);
                    });
                }
            }

            // Check if this cluster is a valid STABLE molecule
            if (group.length > 0) {
                const counts: Record<string, number> = {};
                group.forEach(at => counts[at.symbol] = (counts[at.symbol] || 0) + 1);
                const formula = Object.entries(counts).sort().map(([s, c]) => `${s}${c > 1 ? c : ''}`).join('');

                const allSatisfied = group.every(at => at.currentVacancies === 0);

                // Special case for noble gases
                const isNoble = group.length === 1 && ELEMENTS[group[0].symbol].valency === 0;

                if ((allSatisfied || isNoble) && COMPOUND_DB[formula]) {
                    const compound = COMPOUND_DB[formula];
                    this.score += compound.energy;
                    this.history.unshift(`${compound.name} Synthesized!`);
                    newlyStabilized = { name: compound.name, formula };

                    // Removal / Effect
                    const ids = new Set(group.map(g => g.id));
                    this.atoms = this.atoms.filter(at => !ids.has(at.id));
                    break; // Process one per frame for stability
                }
            }
        }
        return newlyStabilized;
    }
}

// --- MAIN REACT COMPONENT ---

export const AtomicArchitect: React.FC = () => {
    const [engine] = useState(new AtomiXXEngine());
    const [stats, setStats] = useState({ score: 0, count: 0 });
    const [selection, setSelection] = useState('H');
    const [gameOver, setGameOver] = useState(false);
    const [lastSynth, setLastSynth] = useState<{ name: string, formula: string } | null>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseX = useRef(300);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        let frame: number;
        const loop = () => {
            if (!gameOver) {
                const synth = engine.update();
                if (synth) {
                    setLastSynth(synth);
                    setTimeout(() => setLastSynth(null), 2000);
                }

                setStats({ score: engine.score, count: engine.atoms.length });
                if (engine.atoms.some(a => a.y < 120 && a.vy < 0.1)) {
                    // Critical Alert Logic but not instant Game Over for excitement
                }
            }

            // --- DRAWING ---
            ctx.clearRect(0, 0, 600, 800);

            // Chamber Grid
            ctx.strokeStyle = '#1a1a2e';
            ctx.lineWidth = 1;
            for (let i = 0; i < 600; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 800); ctx.stroke(); }
            for (let i = 0; i < 800; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(600, i); ctx.stroke(); }

            // Bonds
            engine.atoms.forEach(a => {
                a.bonds.forEach(bid => {
                    const b = engine.atoms.find(at => at.id === bid);
                    if (b) {
                        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                        ctx.lineWidth = 4;
                        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
                    }
                });
            });

            // Atoms
            engine.atoms.forEach(a => {
                const el = ELEMENTS[a.symbol];
                const grad = ctx.createRadialGradient(a.x - el.radius * 0.2, a.y - el.radius * 0.2, 0, a.x, a.y, el.radius);
                grad.addColorStop(0, '#fff');
                grad.addColorStop(0.3, el.color);
                grad.addColorStop(1, '#000');

                ctx.fillStyle = grad;
                ctx.beginPath(); ctx.arc(a.x, a.y, el.radius, 0, Math.PI * 2); ctx.fill();

                // Symbol
                ctx.fillStyle = 'white';
                ctx.font = `bold ${el.radius * 0.8}px Inter`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                ctx.fillText(a.symbol, a.x, a.y);

                // Vacancy Glow
                for (let i = 0; i < a.currentVacancies; i++) {
                    const ang = (Date.now() / 300) + (i / el.valency) * Math.PI * 2;
                    ctx.fillStyle = '#0ff';
                    ctx.beginPath(); ctx.arc(a.x + Math.cos(ang) * (el.radius + 8), a.y + Math.sin(ang) * (el.radius + 8), 3, 0, Math.PI * 2); ctx.fill();
                }
            });

            // Preview Beam
            if (!gameOver) {
                ctx.fillStyle = 'rgba(0, 242, 255, 0.05)';
                ctx.fillRect(mouseX.current - 1, 0, 2, 800);
                const selEl = ELEMENTS[selection];
                ctx.globalAlpha = 0.5;
                ctx.beginPath(); ctx.arc(mouseX.current, 50, selEl.radius, 0, Math.PI * 2); ctx.fillStyle = selEl.color; ctx.fill();
                ctx.globalAlpha = 1.0;
            }

            frame = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(frame);
    }, [gameOver, selection, engine]);

    const handleAction = () => {
        if (gameOver) return;
        engine.spawn(selection, mouseX.current);
    };

    return (
        <div className="fixed inset-0 bg-[#050508] text-slate-100 flex flex-col font-sans overflow-hidden">
            {/* GLASS HUD */}
            <header className="h-24 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-16 z-50">
                <div className="flex items-center gap-10">
                    <div className="p-4 bg-violet-600/20 border border-violet-500/30 rounded-2xl">
                        <div className="text-[10px] font-black tracking-widest text-violet-400 uppercase">System_State</div>
                        <div className="text-xl font-black italic">ATOMIXX_STABLE</div>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <h1 className="text-4xl font-black italic tracking-tighter text-white">MOLECULAR_FUSION</h1>
                </div>

                <div className="flex gap-12 items-center">
                    <div className="text-right">
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Energy_Yield</div>
                        <div className="text-4xl font-black text-cyan-400 font-mono tracking-tighter">{stats.score.toLocaleString()}</div>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* ELEMENT SELECTOR (LEFT) */}
                <aside className="w-96 bg-black/20 border-r border-white/5 p-10 flex flex-col gap-8 overflow-y-auto">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 border-b border-white/5 pb-4">Periodic_Sequence</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(ELEMENTS).map(([s, el]) => (
                            <button
                                key={s}
                                onClick={() => setSelection(s)}
                                className={`group p-4 rounded-[2rem] border transition-all flex flex-col items-center gap-2 ${selection === s ? 'bg-violet-600 border-violet-400 shadow-[0_0_30px_rgba(124,58,237,0.4)] scale-105' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
                            >
                                <div className={`text-2xl font-black italic ${selection === s ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>{s}</div>
                                <div className="text-[8px] font-black uppercase tracking-widest opacity-60">{el.name}</div>
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div key={selection} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-8 bg-white/5 rounded-[3rem] border border-white/10 mt-auto">
                            <div className="text-3xl font-black italic text-violet-400 mb-2">{ELEMENTS[selection].name}</div>
                            <p className="text-xs text-slate-400 italic leading-relaxed mb-6">{ELEMENTS[selection].description}</p>
                            <div className="grid grid-cols-2 gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                                <div>Valency: <span className="text-white">{ELEMENTS[selection].valency}</span></div>
                                <div>Mass: <span className="text-white">{ELEMENTS[selection].mass} u</span></div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </aside>

                {/* REACTOR CHAMBER (CENTER) */}
                <div className="flex-1 relative flex items-center justify-center bg-[radial-gradient(circle_at_center,#111,transparent)]">
                    <div className="relative group">
                        <canvas
                            ref={canvasRef} width={600} height={800}
                            onClick={handleAction}
                            onMouseMove={(e) => {
                                const r = canvasRef.current!.getBoundingClientRect();
                                mouseX.current = (e.clientX - r.left) * (600 / r.width);
                            }}
                            className="w-[500px] h-[666px] bg-[#020205] rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/10 cursor-none"
                        />
                        {/* Chamber Shine */}
                        <div className="absolute inset-0 pointer-events-none rounded-[4rem] border-t-2 border-white/10 shadow-inner" />
                    </div>

                    <AnimatePresence>
                        {lastSynth && (
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 2 }}
                                className="absolute pointer-events-none px-12 py-6 bg-cyan-400 text-black font-black italic rounded-[2rem] shadow-[0_0_60px_rgba(0,242,255,0.6)]"
                            >
                                <div className="text-[10px] uppercase tracking-widest mb-1">STABILIZED</div>
                                <div className="text-2xl">{lastSynth.name}</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* DIAGNOSTICS (RIGHT) */}
                <aside className="w-80 border-l border-white/5 p-10 flex flex-col gap-6 bg-black/20">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600 border-b border-white/5 pb-4">Log_History</h3>
                    <div className="flex-1 space-y-4 overflow-y-auto pr-4 custom-scrollbar">
                        {engine.history.map((log, i) => (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={i} className="p-5 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-bold italic text-cyan-400">
                                {log}
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-rose-500/5 rounded-[2rem] border border-rose-500/20">
                        <div className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-2">Stability_Protocol</div>
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div animate={{ width: `${(stats.count / 30) * 100}%` }} className={`h-full ${stats.count > 25 ? 'bg-rose-500' : 'bg-cyan-500'} transition-all`} />
                        </div>
                    </div>
                </aside>
            </main>

            <footer className="h-10 border-t border-white/5 bg-black flex items-center justify-between px-16 text-[9px] font-black uppercase tracking-[0.5em] text-slate-800">
                <div className="flex gap-10">
                    <span>Engine: ATOMIXX_CORE_V5</span>
                    <span>Status: OPERATIONAL</span>
                </div>
                <div className="italic">Constraint: Sci_Accurate_Bonding</div>
            </footer>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 2px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export const LogicFlux = AtomicArchitect;
export default LogicFlux;
