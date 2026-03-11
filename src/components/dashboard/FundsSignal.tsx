import { cn } from "@/lib/utils";

interface FundsSignalProps {
    available: string;
    committed: string;
    percentUsed: number;
}

export function FundsSignal({ available, committed, percentUsed }: FundsSignalProps) {
    const status = percentUsed > 95 ? "critical" : percentUsed > 80 ? "warning" : "good";
    const barColor = status === "critical" ? "bg-red-500" : status === "warning" ? "bg-amber-500" : "bg-green-500";

    return (
        <div className="p-4 rounded-lg bg-slate-950/30 border border-slate-800">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-400">Sinal de Verba (Disp. vs Comprom.)</span>
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full uppercase",
                    status === "good" ? "bg-green-950 text-green-400" :
                        status === "warning" ? "bg-amber-950 text-amber-400" : "bg-red-950 text-red-400"
                )}>
                    {status === "good" ? "Livre" : status === "warning" ? "Aperto" : "Estouro"}
                </span>
            </div>

            <div className="flex justify-between items-end mb-2">
                <div>
                    <span className="text-2xl font-bold text-white">{available}</span>
                    <span className="text-xs text-slate-500 block">Disponível Real</span>
                </div>
                <div className="text-right">
                    <span className="text-lg font-medium text-slate-400">{committed}</span>
                    <span className="text-xs text-slate-500 block">Comprometido</span>
                </div>
            </div>

            {/* Signal Bar */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className={cn("h-full transition-all", barColor)} style={{ width: `${percentUsed}%` }}></div>
            </div>
        </div>
    );
}
