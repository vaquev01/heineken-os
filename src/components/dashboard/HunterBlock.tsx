import { Target, TrendingUp, MapPin, Crosshair, LayoutList, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HunterBlock() {
    // Mock Data for Prototype
    const coverage = { current: 85, target: 120, percent: 70 };
    const volumeGap = { current: 3500, target: 5000, gap: 1500, percent: 70 };
    const opportunities = [
        { type: "gap", label: "PDVs sem Cobertura > 30d", count: 12, value: "Potencial 40HL" },
        { type: "mix", label: "Mix Defasado (Top 5 SKUs)", count: 28, value: "Potencial 15HL" },
        { type: "churn", label: "Clientes em Risco (Churn)", count: 5, value: "Risco 8HL" },
        { type: "activation", label: "Não Positivados Mês", count: 45, value: "Meta: 100%" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* KPI 1: Coverage / Positivation */}
            <Card className="bg-slate-950/40 backdrop-blur-md border-slate-800/60 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <MapPin className="w-16 h-16 text-indigo-500" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cobertura & Positivação</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-4xl font-bold text-white tracking-tight">{coverage.current}</span>
                        <span className="text-sm text-slate-500 font-medium">PDVs</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Meta: {coverage.target}</span>
                            <span className="text-indigo-400">{coverage.percent}%</span>
                        </div>
                        <Progress value={coverage.percent} className="h-1.5 bg-slate-800/50" indicatorClassName="bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    </div>
                </CardContent>
            </Card>

            {/* KPI 2: Volume Gap */}
            <Card className="bg-slate-950/40 backdrop-blur-md border-slate-800/60 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Target className="w-16 h-16 text-emerald-500" />
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gap de Volume</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-4xl font-bold text-white tracking-tight">{volumeGap.gap}</span>
                        <span className="text-sm text-slate-500 font-medium">HL Restantes</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Realizado: {volumeGap.current} HL</span>
                            <span className="text-emerald-400">{volumeGap.percent}%</span>
                        </div>
                        <Progress value={volumeGap.percent} className="h-1.5 bg-slate-800/50" indicatorClassName="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                </CardContent>
            </Card>

            {/* Opportunity List */}
            <Card className="bg-slate-950/40 backdrop-blur-md border-slate-800/60 shadow-lg lg:row-span-2 flex flex-col">
                <CardHeader className="pb-4 border-b border-slate-800/50">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                            <Crosshair className="w-4 h-4 text-rose-500" />
                            Oportunidades de Ataque
                        </CardTitle>
                        <Badge variant="secondary" className="bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-0 font-mono text-xs">
                            {opportunities.length} Ativas
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto p-0">
                    <div className="divide-y divide-slate-800/50">
                        {opportunities.map((opp, idx) => (
                            <div key={idx} className="p-4 hover:bg-slate-900/30 transition-colors cursor-pointer group flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 p-1.5 rounded-full bg-slate-900/80 border border-slate-800 group-hover:border-slate-700 transition-colors`}>
                                        <TrendingUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{opp.label}</div>
                                        <div className="text-xs text-slate-500 mt-0.5 font-medium">{opp.value}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className="border-slate-800 text-slate-400 bg-slate-900/50 group-hover:bg-slate-800 group-hover:text-white transition-all text-[10px]">
                                        {opp.count} PDVs
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <div className="p-4 border-t border-slate-800/50 bg-slate-900/20">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 transition-all" size="sm">
                        Ver Lista de Execução
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </Card>
            {/* Quick Actions Grid for Gaps */}
            <div className="lg:col-span-2 grid grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-slate-800/60 bg-slate-900/30 hover:bg-slate-800 hover:border-slate-700 hover:text-white transition-all">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                    <span className="text-xs font-medium">Mapas de Calor</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-slate-800/60 bg-slate-900/30 hover:bg-slate-800 hover:border-slate-700 hover:text-white transition-all">
                    <LayoutList className="h-5 w-5 text-emerald-400" />
                    <span className="text-xs font-medium">Roteiros de Visita</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2 border-slate-800/60 bg-slate-900/30 hover:bg-slate-800 hover:border-slate-700 hover:text-white transition-all">
                    <UserPlus className="h-5 w-5 text-amber-400" />
                    <span className="text-xs font-medium">Reativar Clientes</span>
                </Button>
            </div>
        </div>
    );
}
