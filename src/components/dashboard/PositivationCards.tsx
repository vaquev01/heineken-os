import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SKUPerformance } from "@/core/data/sales-kpis";

interface PositivationCardsProps {
    data: SKUPerformance[];
    showOnlyPriority?: boolean; // NEW PROP
}

export function PositivationCards({ data, showOnlyPriority = false }: PositivationCardsProps) {
    // Filter first
    const filtered = showOnlyPriority ? data.filter(i => i.isPriority) : data;

    // Sort by Gap (Universe - Positive) descending to show biggest opportunities first
    const sortedData = [...filtered].sort((a, b) => (b.universe - b.positive) - (a.universe - a.positive)).slice(0, 4);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedData.map((item) => {
                const coverage = (item.positive / item.universe) * 100;
                const gap = item.universe - item.positive;

                return (
                    <Card key={item.sku} className="bg-slate-950/40 backdrop-blur-md border border-slate-800/60 hover:border-slate-700 transition-all group">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
                                        {item.brand}
                                    </div>
                                    <div className="font-medium text-slate-200 truncate pr-2">
                                        {item.sku}
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-bold ${gap > 10 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                    {coverage.toFixed(0)}%
                                </div>
                            </div>

                            <div className="mt-3 space-y-2">
                                <Progress value={coverage} className="h-1.5 bg-slate-800" indicatorClassName={gap > 20 ? 'bg-amber-500' : 'bg-emerald-500'} />
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>{item.positive} Positivados</span>
                                    <span className="text-rose-400 font-medium">{gap} Faltantes</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
