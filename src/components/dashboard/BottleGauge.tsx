"use client";

import { cn } from "@/lib/utils";

interface BottleGaugeProps {
    real: number;
    carteira: number;
    meta: number;
    height?: number;
}

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(v);

export function BottleGauge({ real, carteira, meta }: BottleGaugeProps) {
    // Percentages relative to META
    // Cap at 100% for the main fill to properly fill the bottle shape without spilling weirdly
    // The "Over-achievement" will be shown by the "META BATIDA" status
    const realPct = Math.min((real / meta) * 100, 100);
    const carteiraPct = Math.min((carteira / meta) * 100, 100 - realPct);

    // ACTION METRICS
    const totalProj = real + carteira;
    const gap = meta - totalProj;
    const isMet = gap <= 0;

    // For display text only
    const totalPct = (totalProj / meta) * 100;

    // HIGH FIDELITY LONG NECK PATH (Normalized 0-100 Width, 0-320 Height)
    const bottlePath = `
        M36,10 L64,10 
        L64,25 
        C64,55 68,75 88,95 
        C96,103 98,110 98,150 
        L98,305 
        C98,315 90,320 50,320 
        C10,320 2,315 2,305 
        L2,150 
        C2,110 4,103 12,95 
        C32,75 36,55 36,25 
        Z
    `;

    // Liquid Clip Path (Inner - Slightly tighter to avoid stroke overlap)
    const liquidPath = `
        M38,12 L62,12 
        L62,25 
        C62,53 66,73 86,93 
        C94,101 96,108 96,150 
        L96,303 
        C96,313 88,318 50,318 
        C12,318 4,313 4,303 
        L4,150 
        C4,108 6,101 14,93 
        C34,73 38,53 38,25 
        Z
    `;

    // Calculate Heights for SVG Rects (Total Height 320)
    // We Map 0-100% to the full liquid range
    const totalH = 320;
    const realH = (realPct / 100) * totalH;
    const carteiraH = (carteiraPct / 100) * totalH;

    // Y coordinates (SVG originates top-left)
    // Bottom is 320.
    // Real starts at 320, goes up by realH. -> y = 320 - realH
    // Carteira starts at (320 - realH), goes up by carteiraH -> y = 320 - realH - carteiraH
    const realY = totalH - realH;
    const carteiraY = realY - carteiraH;

    return (
        <div className="flex flex-row items-center justify-between w-full h-full p-4 gap-6">

            {/* 1. THE BOTTLE (Visual Context) */}
            <div className="h-full relative flex-shrink-0 flex items-center justify-center w-1/3 min-w-[140px]">
                <div className="relative h-[300px] w-full max-w-[120px] mx-auto filter drop-shadow-[0_0_20px_rgba(16,185,129,0.2)]">

                    <svg viewBox="0 0 100 320" className="w-full h-full overflow-visible">
                        <defs>
                            <clipPath id="bottle-liquid-mask">
                                <path d={liquidPath} />
                            </clipPath>

                            <linearGradient id="glass-shine-left" x1="0" y1="0" x2="0.4" y2="0">
                                <stop offset="0%" stopColor="white" stopOpacity="0.7" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="glass-shine-right" x1="1" y1="0" x2="0.6" y2="0">
                                <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="liquid-gradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#059669" /> {/* emerald-600 */}
                                <stop offset="50%" stopColor="#10b981" /> {/* emerald-500 */}
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                            <pattern id="hatch-pattern" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                <rect width="1" height="8" fill="#10b981" fillOpacity="0.5" />
                            </pattern>
                        </defs>

                        {/* EMPTY BOTTLE BACKGROUND (Tinted) */}
                        <path d={bottlePath} fill="#022c22" fillOpacity="0.4" />

                        {/* LIQUID LAYER (Masked) */}
                        <g clipPath="url(#bottle-liquid-mask)">

                            {/* 1. REAL FILL */}
                            <rect x="0" y={realY} width="100" height={realH} fill="url(#liquid-gradient)" />
                            {/* Inner Noise (Simulated with partial opacity pattern or grain) */}

                            {/* 2. CARTEIRA FILL */}
                            <rect x="0" y={carteiraY} width="100" height={carteiraH} fill="url(#hatch-pattern)" />
                            <rect x="0" y={carteiraY} width="100" height={carteiraH} fill="#064e3b" fillOpacity="0.3" /> {/* Darken bg of hatch */}

                            {/* 3. MENISCUS (Surface Lines) */}
                            {/* Top of Real */}
                            {realH > 0 && (
                                <ellipse cx="50" cy={realY} rx="46" ry="6" fill="#10b981" fillOpacity="0.5" filter="blur(2px)" />
                            )}
                            {/* Top of Carteira */}
                            {carteiraH > 0 && (
                                <ellipse cx="50" cy={carteiraY} rx="46" ry="6" fill="#34d399" fillOpacity="0.3" filter="blur(2px)" />
                            )}

                        </g>

                        {/* GLASS EFFECTS (Overlay) */}
                        <path d="M6,150 L6,290" stroke="url(#glass-shine-left)" strokeWidth="4" fill="none" opacity="0.5" filter="blur(1px)" />
                        <path d="M94,150 L94,290" stroke="url(#glass-shine-right)" strokeWidth="3" fill="none" opacity="0.4" filter="blur(1px)" />
                        <path d="M12,100 Q22,115 8,140" stroke="white" strokeWidth="2" fill="none" opacity="0.4" filter="blur(1px)" />
                        <path d="M88,98 Q85,105 92,125" stroke="white" strokeWidth="1.5" fill="none" opacity="0.3" filter="blur(1px)" />
                        <rect x="40" y="15" width="3" height="60" fill="white" opacity="0.15" filter="blur(1px)" />

                        {/* OUTLINE */}
                        <path d={bottlePath} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

                        {/* CAP & FOIL */}
                        <path d="M35,5 L65,5 L65,15 L35,15 Z" fill="#1a1a1a" />
                        <rect x="35" y="12" width="30" height="2" fill="#555" />
                        <path d="M36,15 L64,15 L64,30 L36,30 Z" fill="#e2e8f0" />
                    </svg>
                </div>
            </div>

            {/* 2. THE NUMBERS (Action Focus) - Keep Layout */}
            <div className="flex-1 flex flex-col justify-center space-y-6">

                {/* PRIMARY: THE GAP */}
                <div className="space-y-1">
                    <div className="text-xs text-rose-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", isMet ? "bg-emerald-500" : "bg-rose-500 animate-pulse")}></span>
                        {isMet ? "Meta Superada" : "Falta para Meta (Gap)"}
                    </div>
                    {isMet ? (
                        <div className="text-5xl font-black text-emerald-400 tracking-tighter drop-shadow-lg">
                            +{fmt(Math.abs(gap))} <span className="text-2xl text-emerald-400/80">hl</span>
                        </div>
                    ) : (
                        <div className="text-6xl font-black text-rose-500 tracking-tighter tabular-nums drop-shadow-md">
                            -{fmt(gap)} <span className="text-2xl text-rose-400/80">hl</span>
                        </div>
                    )}
                </div>

                {/* BREAKDOWN TABLE */}
                <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs text-slate-400 uppercase">Real (Já Faturado)</span>
                        <span className="text-lg font-bold text-emerald-400">{fmt(real)}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs text-slate-400 uppercase">Carteira (Pendente)</span>
                        <span className="text-lg font-bold text-blue-400">{fmt(carteira)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-400 uppercase font-bold text-white">Meta Total</span>
                        <span className="text-xl font-black text-white">{fmt(meta)}</span>
                    </div>
                </div>

                {/* KPI SMALL */}
                <div className="flex gap-4">
                    <div className="bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
                        <span className="text-[10px] text-slate-400 uppercase mr-2">Atingimento Real</span>
                        <span className={cn("font-bold font-mono", totalPct >= 100 ? "text-emerald-400" : "text-white")}>
                            {((real / meta) * 100).toFixed(1)}%
                        </span>
                    </div>
                    <div className="bg-slate-800/50 px-2 py-1 rounded border border-slate-700/50">
                        <span className="text-[10px] text-slate-400 uppercase mr-2">Proj. Final</span>
                        <span className="font-bold font-mono text-blue-300">
                            {totalPct.toFixed(1)}%
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}
