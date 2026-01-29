'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ToolShell } from '@/components/tools/ToolShell';
import { Play, Pause, RotateCcw, Coffee, Zap, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PomodoroPage() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'WORK' | 'BREAK'>('WORK');
    const [stats, setStats] = useState({ completed: 0 });
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const toggle = () => setIsActive(!isActive);
    const reset = () => {
        setIsActive(false);
        setTimeLeft(mode === 'WORK' ? 25 * 60 : 5 * 60);
    };

    const switchMode = (newMode: 'WORK' | 'BREAK') => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(newMode === 'WORK' ? 25 * 60 : 5 * 60);
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((t) => t - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (mode === 'WORK') {
                setStats(prev => ({ completed: prev.completed + 1 }));
                // Notification/Sound could be added here
            }
            clearInterval(timerRef.current!);
        }
        return () => clearInterval(timerRef.current!);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const progress = (mode === 'WORK' ? 25 * 60 - timeLeft : 5 * 60 - timeLeft) / (mode === 'WORK' ? 25 * 60 : 5 * 60) * 100;

    const howToUse = (
        <ul className="list-disc pl-5 space-y-4">
            <li><strong>ポモドーロ・テクニック</strong>を使用して、集中力を最大限に引き出します。</li>
            <li>「作業 (25分)」と「休憩 (5分)」のサイクルを繰り返してください。</li>
            <li>タイマーが終了すると、完了セッション数としてカウントされます。</li>
            <li>リセットボタンを使用して、いつでもタイマーを最初から開始できます。</li>
        </ul>
    );

    const faq = [
        { q: "なぜ25分なのですか？", a: "研究によれば、人間の高度な集中力は25分程度が限界とされており、合間に短い休憩を挟むことで疲労を抑え、長時間高いパフォーマンスを維持できます。" },
        { q: "休憩時間は何をするべきですか？", a: "画面から目を離し、水を飲む、ストレッチをする、あるいは深呼吸をすることをお勧めします。脳を完全にリラックスさせることが重要です。" },
    ];

    return (
        <ToolShell
            title="ポモドーロタイマー"
            description="生産性を科学的に向上させる、ミニマルで洗練されたワークサイクル管理ツール。"
            howToUse={howToUse}
            faq={faq}
        >
            <div className="flex flex-col items-center justify-center space-y-20 py-10">
                {/* Mode Selector */}
                <div className="bg-slate-900/50 p-2 rounded-2xl flex gap-3 border border-white/5">
                    <button
                        onClick={() => switchMode('WORK')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'WORK' ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}
                    >
                        <Zap size={14} />
                        Focus
                    </button>
                    <button
                        onClick={() => switchMode('BREAK')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'BREAK' ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}
                    >
                        <Coffee size={14} />
                        Break
                    </button>
                </div>

                {/* Main Timer Display */}
                <div className="relative group">
                    <div className="absolute -inset-10 bg-gradient-to-tr from-blue-500/10 to-sky-500/10 rounded-full blur-[4rem] opacity-50 group-hover:opacity-100 transition-opacity" />

                    <div className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full bg-slate-950 border-8 border-slate-900 flex flex-col items-center justify-center shadow-2xl overflow-hidden">
                        {/* Progress Wave/Fill */}
                        <motion.div
                            className={`absolute bottom-0 left-0 w-full transition-colors duration-1000 ${mode === 'WORK' ? 'bg-blue-600/10' : 'bg-green-600/10'}`}
                            animate={{ height: `${progress}%` }}
                        />

                        <div className="relative z-10 text-center">
                            <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-700 mb-4">{mode === 'WORK' ? 'System Processing' : 'System Idle'}</div>
                            <div className="text-8xl md:text-[10rem] font-bold font-mono text-white tracking-widest leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                {formatTime(timeLeft)}
                            </div>
                            <div className="mt-8 flex gap-8">
                                <button onClick={toggle} className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-blue-500/20">
                                    {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                                </button>
                                <button onClick={reset} className="w-20 h-20 rounded-full bg-slate-900 border border-white/5 text-slate-500 hover:text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
                                    <RotateCcw size={28} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Session Stats */}
                <div className="flex gap-12 items-center">
                    <div className="text-center">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Cycle Completed</div>
                        <div className="text-4xl font-black text-blue-400 italic">{stats.completed}</div>
                    </div>
                    <div className="h-10 w-px bg-slate-800" />
                    <div className="text-center">
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Current Efficiency</div>
                        <div className="text-4xl font-black text-cyan-400 italic">{isActive ? '98%' : '---'}</div>
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
