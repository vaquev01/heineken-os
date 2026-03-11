import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { SKUPerformance } from "@/core/data/sales-kpis";
import { Badge } from "@/components/ui/badge";

interface QuotaTableProps {
    data: SKUPerformance[];
}

export function QuotaTable({ data }: QuotaTableProps) {
    const sortedData = [...data].sort((a, b) => (b.actualVol / b.targetVol) - (a.actualVol / a.targetVol));

    return (
        <div className="rounded-xl border border-slate-800 bg-slate-950/40 backdrop-blur-md overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-900/50">
                    <TableRow className="border-slate-800 hover:bg-transparent">
                        <TableHead className="text-slate-400 font-medium">SKU / Produto</TableHead>
                        <TableHead className="text-right text-slate-400 font-medium">Meta (HL)</TableHead>
                        <TableHead className="text-right text-slate-400 font-medium">Real (HL)</TableHead>
                        <TableHead className="text-center text-slate-400 font-medium w-[180px]">Atingimento</TableHead>
                        <TableHead className="text-right text-slate-400 font-medium">Tendência</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedData.map((item) => {
                        const achievement = (item.actualVol / item.targetVol) * 100;
                        const isHigh = achievement >= 100;
                        const isLow = achievement < 80;
                        const growth = ((item.actualVol - item.lastMonth) / item.lastMonth) * 100;

                        return (
                            <TableRow key={item.sku} className="border-b border-slate-800/50 hover:bg-slate-900/40 transition-colors">
                                <TableCell className="font-medium text-slate-200">
                                    {item.sku}
                                    <div className="text-[10px] text-slate-500 uppercase">{item.brand}</div>
                                </TableCell>
                                <TableCell className="text-right font-mono text-slate-400">
                                    {new Intl.NumberFormat('pt-BR').format(item.targetVol)}
                                </TableCell>
                                <TableCell className="text-right font-mono text-slate-200 font-semibold">
                                    {new Intl.NumberFormat('pt-BR').format(item.actualVol)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Progress
                                            value={Math.min(achievement, 100)}
                                            className="h-2 bg-slate-800 w-full"
                                            indicatorClassName={isLow ? 'bg-rose-500' : isHigh ? 'bg-emerald-500' : 'bg-amber-400'}
                                        />
                                        <span className={`text-xs font-bold w-12 text-right ${isLow ? 'text-rose-400' : isHigh ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {achievement.toFixed(0)}%
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="outline" className={`border-0 bg-transparent ${growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
