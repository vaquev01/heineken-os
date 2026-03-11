"use client";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SalesBulletChartProps {
    real: number;
    carteira: number;
    meta: number;
    label: string;
    height?: string;
}

export function SalesBulletChart({ real, carteira, meta, label, height = "h-4" }: SalesBulletChartProps) {
    // Calculations
    const totalProj = real + carteira;
    // Define graphic range: Max of (Meta * 1.1) or (Proj * 1.1) to leave breathing room
    const rangeMax = Math.max(meta, totalProj) * 1.15;

    const getPct = (val: number) => Math.min((val / rangeMax) * 100, 100);

    const realPct = getPct(real);
    const carteiraPct = getPct(carteira); // This is width relative to total range
    const metaPct = getPct(meta);
    const projPct = getPct(totalProj);

    return (
        <div className="w-full">
            <div className="flex justify-between items-end mb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                <span className="text-xs font-mono text-slate-500">Meta: {new Intl.NumberFormat('pt-BR').format(meta)}</span>
            </div>

            <div className={`relative w-full bg-slate-800/50 rounded-full overflow-hidden ${height}`}>
                {/* 1. Real Bar (Solid) */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="absolute top-0 left-0 h-full bg-emerald-500 z-20 transition-all duration-1000 ease-out"
                                style={{ width: `${realPct}%` }}
                            ></div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Real: {new Intl.NumberFormat('pt-BR').format(real)}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* 2. Carteira Bar (Striped/Ghost) - Stacked after Real */}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                className="absolute top-0 h-full bg-blue-500/40 z-10 transition-all duration-1000 ease-out border-l border-white/10"
                                style={{
                                    left: `${realPct}%`,
                                    width: `${carteiraPct}%`,
                                    backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,0.1) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.1) 50%,rgba(255,255,255,0.1) 75%,transparent 75%,transparent)',
                                    backgroundSize: '8px 8px'
                                }}
                            ></div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Carteira: {new Intl.NumberFormat('pt-BR').format(carteira)}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* 3. Meta Marker (Line) */}
                <div
                    className="absolute top-0 bottom-0 w-1 bg-white z-30 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    style={{ left: `${metaPct}%` }}
                ></div>
            </div>

            {/* Labels beneath */}
            <div className="relative w-full h-4 mt-1 text-[10px] text-slate-500 font-mono">
                <span className="absolute transform -translate-x-1/2" style={{ left: `${realPct}%` }}>
                    Real
                </span>
                <span className="absolute transform -translate-x-1/2 text-blue-400" style={{ left: `${projPct}%` }}>
                    Proj
                </span>
                <span className="absolute transform -translate-x-1/2 text-white font-bold" style={{ left: `${metaPct}%` }}>
                    Meta
                </span>
            </div>
        </div>
    );
}
