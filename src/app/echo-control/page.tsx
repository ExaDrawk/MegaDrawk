'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Play, Info, CheckCircle2, AlertCircle, History, Clock } from 'lucide-react';
import Link from 'next/link';

// Types
type Grid = number[][];
type ScheduledTap = {
    id: string;
    turnAt: number;
    x: number;
    y: number;
};

const GRID_SIZE = 3;
const MAX_TURN_VIEW = 8;

export default function EchoControlPage() {
    const [grid, setGrid] = useState<Grid>(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)));
    const [target, setTarget] = useState<Grid>(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)));
    const [turn, setTurn] = useState(0);
    const [scheduled, setScheduled] = useState<ScheduledTap[]>([]);
    const [isCleared, setIsCleared] = useState(false);
    const [level, setLevel] = useState(1);
    const [history, setHistory] = useState<string[]>([]);

    // Initialize level
    const initLevel = useCallback((lv: number) => {
        const newTarget = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
        // Simple level generation logic
        if (lv === 1) {
            newTarget[1][1] = 2;
        } else if (lv === 2) {
            newTarget[0][0] = 1;
            newTarget[2][2] = 1;
        } else {
            for (let i = 0; i < GRID_SIZE; i++) {
                for (let j = 0; j < GRID_SIZE; j++) {
                    if (Math.random() > 0.6) newTarget[i][j] = Math.floor(Math.random() * 4);
                }
            }
        }
        setGrid(Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0)));
        setTarget(newTarget);
        setTurn(0);
        setScheduled([]);
        setIsCleared(false);
        setHistory(['静寂の開始']);
    }, []);

    useEffect(() => {
        initLevel(level);
    }, [level, initLevel]);

    const processScheduled = (currentTurn: number, currentGrid: Grid, currentScheduled: ScheduledTap[]) => {
        let nextGrid = currentGrid.map(row => [...row]);
        let nextScheduled = currentScheduled.filter(s => s.turnAt > currentTurn);
        const happeningNow = currentScheduled.filter(s => s.turnAt === currentTurn);

        happeningNow.forEach(tap => {
            const newVal = (nextGrid[tap.y][tap.x] + 1) % 4;
            nextGrid[tap.y][tap.x] = newVal;
            if (newVal > 0) {
                nextScheduled.push({
                    id: Math.random().toString(36).substr(2, 9),
                    turnAt: currentTurn + newVal,
                    x: tap.x,
                    y: tap.y
                });
            }
        });

        return { nextGrid, nextScheduled };
    };

    const handleTap = (x: number, y: number) => {
        if (isCleared) return;

        setTurn(prev => {
            const nextTurn = prev + 1;

            // 1. User Tap Action
            let newGrid = grid.map(row => [...row]);
            const newVal = (newGrid[y][x] + 1) % 4;
            newGrid[y][x] = newVal;

            let newScheduled = [...scheduled];
            if (newVal > 0) {
                newScheduled.push({
                    id: Math.random().toString(36).substr(2, 9),
                    turnAt: nextTurn + newVal,
                    x,
                    y
                });
            }

            // 2. Process automation for this turn
            const { nextGrid, nextScheduled } = processScheduled(nextTurn, newGrid, newScheduled);

            setGrid(nextGrid);
            setScheduled(nextScheduled);

            // Check clearing condition
            const match = nextGrid.every((row, i) => row.every((val, j) => val === target[i][j]));
            if (match && nextScheduled.length === 0) {
                setIsCleared(true);
            }

            setHistory(h => [`ターン ${nextTurn}: (${x},${y})をタップ`, ...h].slice(0, 10));

            return nextTurn;
        });
    };

    const getCellColor = (val: number) => {
        switch (val) {
            case 1: return 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.2)] text-white';
            case 2: return 'bg-cyan-600 shadow-[0_0_20px_rgba(8,145,178,0.2)] text-white';
            case 3: return 'bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.2)] text-white';
            default: return 'bg-slate-100/50 grayscale opacity-40 text-slate-400';
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-100">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-8 h-12 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/tools" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Tools</Link>
                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="text-xs font-black uppercase tracking-widest text-blue-600">Echo Control</span>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => initLevel(level)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900 transition-all">
                        <RefreshCw size={16} />
                    </button>
                    <Link href="/" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors">Home</Link>
                </div>
            </nav>

            <main className="pt-24 pb-12 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Info & Levels */}
                <div className="lg:col-span-3 space-y-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-2">エコー制御</h1>
                        <p className="text-slate-500 text-sm leading-relaxed">タップの残響（エコー）を管理し、盤面を揃えて静寂を取り戻すパズル。</p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Levels</h3>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5].map(lv => (
                                <button
                                    key={lv}
                                    onClick={() => setLevel(lv)}
                                    className={`w-10 h-10 rounded-xl font-bold transition-all ${level === lv ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-50 border border-slate-200 text-slate-400 hover:border-blue-500 hover:text-blue-600'}`}
                                >
                                    {lv}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Info size={16} />
                            <span className="text-xs font-black uppercase tracking-widest">Rule</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            マスをタップすると数字が 0→1→2→3→0 と進みます。<br />
                            タップの結果 <strong>n</strong> になると、ちょうど <strong>n</strong> ターン後に再タップが予約されます。<br />
                            全てのマスを目標と一致させ、且つ予約がゼロになればクリアです。
                        </p>
                    </div>
                </div>

                {/* Center: Grid */}
                <div className="lg:col-span-6 flex flex-col items-center gap-12">
                    <div className="relative group">
                        {/* Target Preview */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex gap-4 items-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Target</span>
                            <div className="grid grid-cols-3 gap-1 opacity-40">
                                {target.map((row, i) => row.map((val, j) => (
                                    <div key={`${i}-${j}`} className={`w-3 h-3 rounded-sm ${getCellColor(val)}`} />
                                )))}
                            </div>
                        </div>

                        {/* Main Grid */}
                        <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200 shadow-2xl relative">
                            {isCleared && (
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center rounded-[2.5rem]"
                                >
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 border border-green-200">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 italic mb-2 tracking-tighter">SILENCE</h2>
                                    <p className="text-slate-500 text-sm font-bold">静寂の状態に到達しました</p>
                                    <button
                                        onClick={() => setLevel(prev => prev + 1)}
                                        className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl"
                                    >
                                        Next Level
                                    </button>
                                </motion.div>
                            )}

                            <div className="grid grid-cols-3 gap-4">
                                {grid.map((row, y) => row.map((val, x) => (
                                    <motion.button
                                        key={`${x}-${y}`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleTap(x, y)}
                                        className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-300 font-black shadow-inner border-2 border-white ${getCellColor(val)}`}
                                    >
                                        <span className="text-3xl drop-shadow-sm">{val}</span>
                                        {/* Animation rings */}
                                        {val > 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <div className="w-full h-full border border-white/20 rounded-2xl animate-ping" />
                                            </div>
                                        )}
                                    </motion.button>
                                )))}
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="w-full max-w-md space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-2">
                                <Clock size={12} />
                                <span>Future Reservation</span>
                            </div>
                            <span>Turn {turn}</span>
                        </div>
                        <div className="flex gap-2 h-16 bg-slate-50 rounded-2xl p-2 border border-slate-200 overflow-x-auto custom-scrollbar shadow-inner">
                            {Array.from({ length: MAX_TURN_VIEW }).map((_, i) => {
                                const t = turn + i + 1;
                                const taps = scheduled.filter(s => s.turnAt === t);
                                return (
                                    <div key={t} className="flex-shrink-0 w-12 h-full rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center gap-1 relative overflow-hidden shadow-sm">
                                        <span className="text-[8px] font-bold text-slate-300 absolute top-1">{t}</span>
                                        <div className="flex gap-0.5 mt-2">
                                            {taps.map(tap => (
                                                <div key={tap.id} className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-sm" />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="flex-shrink-0 w-12 h-full flex items-center justify-center text-slate-200">
                                <Clock size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: History & Stats */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 text-slate-400">
                                <History size={16} />
                                <span className="text-xs font-black uppercase tracking-widest">History</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-300">Latest 10</span>
                        </div>
                        <div className="space-y-3">
                            <AnimatePresence>
                                {history.map((h, i) => (
                                    <motion.div
                                        key={`${h}-${i}`}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-[10px] font-bold text-slate-400 border-l-2 border-slate-100 pl-3 py-1"
                                    >
                                        {h}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl space-y-2 shadow-sm">
                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Reserved Taps</div>
                        <div className="text-4xl font-black text-blue-900">{scheduled.length}</div>
                        <p className="text-[10px] text-slate-400 leading-tight">これが 0 になった時、真の「静寂」が訪れます。</p>
                    </div>
                </div>
            </main>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { height: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}</style>
        </div>
    );
}
