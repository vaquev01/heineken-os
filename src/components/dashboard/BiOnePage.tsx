"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Speedometer } from "./Speedometer";
import { BottleGauge } from "./BottleGauge";
import { BrandPerformance } from "./BrandPerformance";
import { SalesRiskList } from "./SalesRiskList";
import { cn } from "@/lib/utils";

interface BiData {
    real: number;
    carteira: number;
    open?: number;
    metaOff: number;
    targetSOP: number;
    salesLY: number;
    status?: {
        pendente: number;
        carteira: number;
        programado: number;
    }
}

interface BiKPIs {
    projection: number;
    realVsMeta: number;
    realVsSOP: number;
    realVsLY: number;
    projVsMeta: number;
    projVsSOP: number;
    projVsLY: number;
}

interface BiOnePageProps {
    data: BiData;
    kpis: BiKPIs;
}

// Formatters
const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(v);

// Helper for "Half Doughnut" Gauge style
const GaugeCard = ({ title, valuePct, color = "emerald" }: { title: string, valuePct: number, color?: "emerald" | "amber" | "rose" | "blue" }) => {
    return (
        <Card className="bg-slate-900/40 border-slate-800 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
            <CardContent className="p-3 flex flex-col items-center justify-center">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 w-full text-center border-b border-white/5 pb-1">
                    {title}
                </div>
                <div className="scale-75 origin-center -my-2">
                    <Speedometer
                        value={valuePct}
                        label=""
                        color={color}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

export function BiOnePage({ data, kpis }: BiOnePageProps) {
    if (!data || !kpis) return null;

    // Gap Calculation
    const gap = data.metaOff - kpis.projection;
    const isMet = gap <= 0;

    return (
        <div className="space-y-6">

            {/* ROW 0: PROMINENT REFERENCE NUMBERS */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">

                {/* 1. FATAL GAP (Action Driver) */}
                <Card className={cn("lg:col-span-2 border shadow-lg relative overflow-hidden group", isMet ? "bg-emerald-950/20 border-emerald-500/30 hover:bg-emerald-950/30" : "bg-rose-950/20 border-rose-500/30 hover:bg-rose-950/30 transition-colors")}>
                    <div className={cn("absolute top-0 w-full h-1", isMet ? "bg-emerald-500" : "bg-rose-500")} />
                    <CardContent className="p-6 flex flex-col justify-center h-full relative">
                        <div className={cn("text-[10px] uppercase font-bold tracking-widest mb-1 flex items-center gap-2", isMet ? "text-emerald-400" : "text-rose-400")}>
                            {isMet ? "Meta Batida (Superavit)" : "Falta para Meta (Gap)"}
                            {!isMet && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span></span>}
                        </div>
                        <div className={cn("text-5xl font-black tracking-tighter tabular-nums", isMet ? "text-emerald-400" : "text-rose-500")}>
                            {isMet ? "+" : "-"}{fmt(Math.abs(gap))} <span className="text-xl font-bold opacity-60">HL</span>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. REAL + CARTEIRA */}
                <Card className="bg-slate-900/40 border-slate-800 lg:col-span-1 shadow-sm hover:border-slate-700 transition-colors">
                    <CardContent className="p-5 flex flex-col justify-center h-full text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">Real + Carteira</div>
                        <div className="text-2xl font-black text-white tracking-tight">{fmt(kpis.projection)}</div>
                    </CardContent>
                </Card>

                {/* 3. LY */}
                <Card className="bg-slate-900/40 border-slate-800 lg:col-span-1 shadow-sm hover:border-slate-700 transition-colors">
                    <CardContent className="p-5 flex flex-col justify-center h-full text-center">
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-2">LY (Ano Ant.)</div>
                        <div className="text-2xl font-black text-slate-400 tracking-tight">{fmt(data.salesLY)}</div>
                    </CardContent>
                </Card>

                {/* 4. META & S&OP */}
                <Card className="bg-amber-950/10 border-amber-900/20 lg:col-span-1 hover:bg-amber-950/20 transition-colors">
                    <CardContent className="p-5 flex flex-col justify-center h-full text-center">
                        <div className="text-[10px] uppercase font-bold text-amber-500/70 tracking-widest mb-2">Meta Original</div>
                        <div className="text-2xl font-black text-amber-200/90 tracking-tight">{fmt(data.metaOff)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-950/10 border-blue-900/20 lg:col-span-1 hover:bg-blue-950/20 transition-colors">
                    <CardContent className="p-5 flex flex-col justify-center h-full text-center">
                        <div className="text-[10px] uppercase font-bold text-blue-500/70 tracking-widest mb-2">S&OP</div>
                        <div className="text-2xl font-black text-blue-200/90 tracking-tight">{fmt(data.targetSOP)}</div>
                    </CardContent>
                </Card>

            </div>

            {/* ROW 1: STRATEGIC TRIAD (Bottle | Brand | Risk) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[420px]"> {/* Increased height for better proportions */}

                {/* 1. VISUAL HERO: THE BOTTLE (Target Achievement) */}
                <Card className="lg:col-span-3 bg-slate-900/40 border-slate-800 overflow-hidden relative shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>
                    <CardContent className="p-0 h-full flex items-center justify-center relative z-10">
                        <BottleGauge
                            real={data.real}
                            carteira={data.carteira}
                            meta={data.metaOff}
                            height={320}
                        />
                    </CardContent>
                </Card>

                {/* 2. BRAND PERFORMANCE */}
                <div className="lg:col-span-5 h-full flex flex-col gap-4">
                    <div className="flex-1 h-full">
                        <BrandPerformance />
                    </div>
                </div>

                {/* 3. HUNTER RISK LIST */}
                <div className="lg:col-span-4 h-full">
                    <SalesRiskList />
                </div>

            </div>

            {/* MINI GAUGES (Moved to bottom row for cleanliness) */}
            <div className="grid grid-cols-3 gap-4">
                <GaugeCard title="Real vs LY" valuePct={kpis.realVsLY} color={kpis.realVsLY >= 100 ? "emerald" : "rose"} />
                <GaugeCard title="Real vs Meta" valuePct={kpis.realVsMeta} color={kpis.realVsMeta >= 100 ? "emerald" : "amber"} />
                <GaugeCard title="Real vs S&OP" valuePct={kpis.realVsSOP} color={kpis.realVsSOP >= 100 ? "emerald" : "blue"} />
            </div>

        </div>
    );
}
