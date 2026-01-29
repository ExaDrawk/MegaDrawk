'use client';

/**
 * -----------------------------------------------------------------------------
 * CRYSTAL LOGIC: THE REFLECTION SIMULATOR (V1.0.0)
 * -----------------------------------------------------------------------------
 * 【システム概要】
 * 降り注ぐ「未精製データ（プリズム）」を物理的に反射・誘導し、
 * 適切な「プロセス・コア」へと選別する高密度パズルアクション。
 * 
 * 【コア機能】
 * - Physics Reflector: マウス追従＋ホイール回転で操作する物理パドル。
 * - Data Stream: 上空から落下する3色（CYAN, MAGENTA, YELLOW）のデータ群。
 * - Core Sorting: 左（CYAN）、右（MAGENTA）、上（YELLOW）に配置された受容コア。
 * - Evolution: 正確なソーティングにより、システム（背景・音楽・難易度）が進化する。
 * -----------------------------------------------------------------------------
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA TYPES & CONSTANTS ---

type DataType = 'CYAN' | 'MAGENTA' | 'YELLOW';

interface DataParticle {
    id: number;
    type: DataType;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    active: boolean;
}

interface Core {
    type: DataType;
    x: number;
    y: number;
    radius: number;
    pulse: number;
}

interface Paddle {
    x: number;
    y: number;
    angle: number; // Radian
    length: number;
    width: number;
}

const COLORS = {
    CYAN: '#00d2ff',
    MAGENTA: '#ff4d6d',
    YELLOW: '#ffaa00',
    BG: '#ffffff'
};

// --- GAME LOGIC ENGINE ---

class CrystalEngine {
    public particles: DataParticle[] = [];
    public paddle: Paddle = { x: 500, y: 800, angle: 0, length: 150, width: 20 };
    public cores: Core[] = [
        { type: 'CYAN', x: 100, y: 300, radius: 60, pulse: 0 },    // LEFT
        { type: 'MAGENTA', x: 900, y: 300, radius: 60, pulse: 0 }, // RIGHT
        { type: 'YELLOW', x: 500, y: 100, radius: 60, pulse: 0 }   // TOP
    ];

    public score: number = 0;
    public combo: number = 0;
    public systemLevel: number = 1;
    public energy: number = 50; // 0-100
    public gameOver: boolean = false;

    private spawnRate = 60; // Frames per spawn
    private frame = 0;

    public update(mouseX: number, mouseY: number, wheelDelta: number) {
        if (this.gameOver) return;
        this.frame++;

        // --- PADDLE CONTROL ---
        // Smooth follow
        this.paddle.x += (mouseX - this.paddle.x) * 0.2;
        this.paddle.y += (mouseY - this.paddle.y) * 0.2;
        // Rotation via wheel (accumulated outside or passed directly)
        // Here we assume angle is updated via React state/event prop, but for smoother physics typicaly engine handles.
        // Let's modify: angle is updated externally.

        // --- SPAWN DATA ---
        if (this.frame % Math.max(10, this.spawnRate - this.systemLevel * 5) === 0) {
            this.spawnParticle();
        }

        // --- PHYSICS LOOP ---
        this.particles.forEach(p => {
            if (!p.active) return;

            // Gravity
            p.vy += 0.15;
            p.x += p.vx;
            p.y += p.vy;

            // Air Resistance
            p.vx *= 0.995;
            p.vy *= 0.995;

            // --- PADDLE REFLECTION (Line Segment Collision) ---
            // Coordinate transformation to Paddle space
            const dx = p.x - this.paddle.x;
            const dy = p.y - this.paddle.y;

            // Rotate p relative to paddle center
            const cos = Math.cos(-this.paddle.angle);
            const sin = Math.sin(-this.paddle.angle);
            const rx = dx * cos - dy * sin;
            const ry = dx * sin + dy * cos;

            // AABB Check in local space
            if (
                Math.abs(rx) < this.paddle.length / 2 + p.radius &&
                Math.abs(ry) < this.paddle.width / 2 + p.radius
            ) {
                // Precise check: Previous position comparison to determine collision side? 
                // Simplified: just reflect velocity vector based on normal

                // Normal vector depends on side? assuming hitting top/bottom (flat face)
                // Paddle Normal in World Space:
                const nx = Math.sin(this.paddle.angle);
                const ny = -Math.cos(this.paddle.angle);

                // Velocity Reflect: V = V - 2(V.N)N
                const dot = p.vx * nx + p.vy * ny;

                // Only bounce if moving towards the face
                if (dot < 0 || Math.abs(ry) < this.paddle.width / 2) {
                    // Add slight "kick" from paddle movement (omitted for simplicity, but adds juice)
                    p.vx = (p.vx - 2 * dot * nx) * 1.2; // 1.2 restitution (bouncy)
                    p.vy = (p.vy - 2 * dot * ny) * 1.2;

                    // Push out of collision
                    p.x += nx * 5;
                    p.y += ny * 5;

                    // Add some spin/chaos
                    p.vx += (Math.random() - 0.5) * 2;
                }
            }

            // --- CORE COLLISION ---
            this.cores.forEach(c => {
                const dist = Math.sqrt((p.x - c.x) ** 2 + (p.y - c.y) ** 2);
                if (dist < c.radius + p.radius) {
                    // HIT CORE
                    if (p.type === c.type) {
                        // MATCH
                        this.score += 100 * (1 + this.combo * 0.1);
                        this.combo++;
                        this.energy = Math.min(100, this.energy + 5);
                        c.pulse = 20; // Visual Pulse
                        p.active = false;

                        // Level Up Logic
                        if (this.combo % 10 === 0) this.systemLevel++;

                    } else {
                        // MISMATCH
                        this.combo = 0;
                        this.energy -= 10;
                        p.active = false;
                        // Punishment VFX
                    }
                }
            });

            // Bounds (Death)
            if (p.y > 1100 || p.x < -100 || p.x > 1100 || p.y < -1000) {
                if (p.active) {
                    p.active = false;
                    this.combo = 0;
                    this.energy -= 5;
                }
            }
        });

        // Cleanup
        this.particles = this.particles.filter(p => p.active);

        // Cores Pulse Decay
        this.cores.forEach(c => {
            if (c.pulse > 0) c.pulse *= 0.9;
        });

        // Game Over Check
        // if (this.energy <= 0) this.gameOver = true;
    }

    private spawnParticle() {
        const types: DataType[] = ['CYAN', 'MAGENTA', 'YELLOW'];
        const t = types[Math.floor(Math.random() * types.length)];
        this.particles.push({
            id: Math.random(),
            type: t,
            x: 500 + (Math.random() - 0.5) * 200,
            y: -50,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() * 5) + 2,
            radius: 12,
            active: true
        });
    }

    public setPaddleAngle(delta: number) {
        this.paddle.angle += delta * 0.1;
    }
}

// --- MAIN COMPONENT ---

export const CrystalLogic: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const engine = useRef(new CrystalEngine());
    const [stats, setStats] = useState({ score: 0, combo: 0, level: 1, energy: 50 });
    const mouseRef = useRef({ x: 500, y: 800 });

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            // Mapping mouse visual position to canvas logical coords (1000x1000)
            const scaleX = 1000 / rect.width;
            const scaleY = 1000 / rect.height;
            mouseRef.current.x = (e.clientX - rect.left) * scaleX;
            mouseRef.current.y = (e.clientY - rect.top) * scaleY;
        }
    }, []);

    const handleWheel = useCallback((e: React.WheelEvent) => {
        engine.current.setPaddleAngle(e.deltaY > 0 ? 1 : -1);
    }, []);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;

        let frameId: number;

        const loop = () => {
            const eng = engine.current;
            eng.update(mouseRef.current.x, mouseRef.current.y, 0);

            // Sync Stats (throttle for perf usually, but simple here)
            setStats({
                score: Math.floor(eng.score),
                combo: eng.combo,
                level: eng.systemLevel,
                energy: eng.energy
            });

            // --- RENDER ---
            ctx.fillStyle = COLORS.BG;
            ctx.fillRect(0, 0, 1000, 1000);

            // Grid Effects
            ctx.strokeStyle = 'rgba(0,0,0,0.03)';
            ctx.lineWidth = 1;
            const t = Date.now() / 1000;
            const gridSize = 100;
            const off = (t * 20) % gridSize;
            for (let i = 0; i < 1200; i += gridSize) {
                ctx.beginPath(); ctx.moveTo(0, i + off); ctx.lineTo(1000, i + off); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1000); ctx.stroke();
            }

            // Draw Cores
            eng.cores.forEach(c => {
                ctx.shadowBlur = 10 + c.pulse;
                ctx.shadowColor = COLORS[c.type];
                ctx.fillStyle = COLORS[c.type];
                ctx.strokeStyle = 'rgba(0,0,0,0.1)';
                ctx.lineWidth = 2;

                ctx.beginPath();
                ctx.arc(c.x, c.y, c.radius + c.pulse * 0.5, 0, Math.PI * 2);
                ctx.stroke();

                ctx.globalAlpha = 0.1 + (c.pulse > 1 ? 0.2 : 0);
                ctx.fill();
                ctx.globalAlpha = 1.0;

                // Label
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#64748b';
                ctx.font = 'bold 12px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('PROCESS', c.x, c.y - 15);
                ctx.fillText('CORE', c.x, c.y + 5);
            });

            // Draw Paddle
            const p = eng.paddle;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);

            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0,0,0,0.1)';
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-p.length / 2, -p.width / 2, p.length, p.width);

            // Reflective sheen
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            ctx.fillRect(-p.length / 2 + 5, -p.width / 2 + 2, p.length - 10, p.width / 4);

            ctx.restore();

            // Draw Particles
            eng.particles.forEach(pt => {
                ctx.shadowBlur = 10;
                ctx.shadowColor = COLORS[pt.type];
                ctx.fillStyle = COLORS[pt.type];

                ctx.beginPath();
                if (pt.type === 'CYAN') {
                    // Circle
                    ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
                } else if (pt.type === 'MAGENTA') {
                    // Square
                    ctx.rect(pt.x - pt.radius, pt.y - pt.radius, pt.radius * 2, pt.radius * 2);
                } else {
                    // Triangle
                    ctx.moveTo(pt.x, pt.y - pt.radius);
                    ctx.lineTo(pt.x + pt.radius, pt.y + pt.radius);
                    ctx.lineTo(pt.x - pt.radius, pt.y + pt.radius);
                }
                ctx.fill();
            });

            ctx.shadowBlur = 0;
            frameId = requestAnimationFrame(loop);
        };
        loop();

        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <div className="fixed inset-0 bg-white text-slate-900 flex flex-col font-sans overflow-hidden cursor-none">
            {/* CANVAS LAYER */}
            <div className="absolute inset-0 flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    width={1000} height={1000}
                    className="w-full h-full object-contain"
                    onMouseMove={handleMouseMove}
                    onWheel={handleWheel}
                />
            </div>

            {/* UI OVERLAY */}
            <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-[10px] font-bold text-blue-600 tracking-[0.6em] uppercase mb-1">MegaDrawk_Labs</div>
                        <h1 className="text-4xl font-black italic tracking-tighter text-slate-900">CRYSTAL LOGIC <span className="text-xl text-slate-400 font-light not-italic">/ REFLECTOR</span></h1>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] uppercase tracking-widest text-slate-400">Processing_Efficiency</div>
                        <div className="text-4xl font-mono font-bold text-blue-600">{stats.score.toLocaleString()}</div>
                        {stats.combo > 1 && (
                            <motion.div initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-xl font-bold text-amber-500 italic mt-2">
                                CHAIN {stats.combo}x
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Footer Controls / Energy */}
                <div className="flex justify-between items-end">
                    <div className="text-xs font-mono text-slate-400">
                        <div>CONTROLS:</div>
                        <div>MOUSE: POSITION</div>
                        <div>WHEEL: ANGLE</div>
                    </div>

                    <div className="w-64">
                        <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-slate-400">SYSTEM_INTEGRITY</span>
                            <span className="text-slate-900">{stats.energy.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                                animate={{ width: `${stats.energy}%` }}
                                className={`h-full ${stats.energy < 30 ? 'bg-rose-500' : 'bg-blue-600'}`}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Instruction Overlay (First Time) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-30 pointer-events-none">
                <div className="text-[10px] tracking-[0.5em] uppercase text-slate-400 mb-2">Initialize Reflector</div>
                <div className="w-16 h-16 border border-slate-200 rounded-full mx-auto flex items-center justify-center animate-pulse">
                    <div className="w-1 h-1 bg-slate-400 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export const LogicFlux = CrystalLogic;
export default LogicFlux;
