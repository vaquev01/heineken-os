"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock Data for Brands
const BRAND_DATA = [
    { name: "Heineken", target: 45000, real: 38000, carteira: 9000 },
    { name: "Amstel", target: 32000, real: 21000, carteira: 5000 },
    { name: "Eisenbahn", target: 12000, real: 11000, carteira: 1500 },
    { name: "Devassa", target: 8000, real: 4000, carteira: 1000 },
];

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { notation: "compact" }).format(v);
const fmtAbs = (v: number) => new Intl.NumberFormat('pt-BR').format(v);

export function BrandPerformance() {
    return (
        <Card className="bg-slate-900/40 border-slate-800 h-full">
            <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest flex justify-between">
                    <span>Performance por Marca</span>
                    <span>GAP (Falta)</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {BRAND_DATA.map(brand => {
                    const totalProj = brand.real + brand.carteira;
                    const gap = brand.target - totalProj;
                    const isMet = gap <= 0;
                    const pct = (totalProj / brand.target) * 100;

                    return (
                        <div key={brand.name} className="space-y-1">
                            {/* Header: Name vs Gap */}
                            <div className="flex justify-between items-end">
                                <span className={cn("font-bold text-sm", isMet ? "text-emerald-400" : "text-white")}>
                                    {brand.name}
                                </span>

                                {isMet ? (
                                    <span className="text-xs font-bold text-emerald-500">SUPEROU!</span>
                                ) : (
                                    <span className="text-sm font-black text-rose-500 bg-rose-500/10 px-1 rounded">
                                        -{fmtAbs(gap)}
                                    </span>
                                )}
                            </div>

                            {/* Mini Data Grid - Clean Row Layout */}
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono py-1 border-t border-white/5 mx-1">
                                <div className="flex gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] uppercase tracking-wider text-slate-500">Real</span>
                                        <span className="font-bold text-slate-200">{fmt(brand.real)}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] uppercase tracking-wider text-slate-500">Cart.</span>
                                        <span className="font-bold text-blue-300">{fmt(brand.carteira)}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] uppercase tracking-wider text-slate-500">Meta</span>
                                        <span className="font-bold text-slate-400">{fmt(brand.target)}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={cn("font-bold text-xs", pct >= 100 ? "text-emerald-400" : "text-amber-400")}>
                                        {pct.toFixed(0)}%
                                    </span>
                                </div>
                            </div>

                            {/* Slim Progress */}
                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                                <div className="h-full bg-emerald-500" style={{ width: `${Math.min((brand.real / brand.target) * 100, 100)}%` }}></div>
                                <div className="h-full bg-blue-500/50" style={{ width: `${Math.min((brand.carteira / brand.target) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    );
}
