import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICellProps {
    label: string;
    value: string;
    subValue?: string;
    trend?: "up" | "down" | "flat";
    highlight?: boolean;
}

function KPICell({ label, value, subValue, trend, highlight }: KPICellProps) {
    return (
        <div className={cn("flex flex-col px-6 py-3 border-r border-slate-800 last:border-0", highlight && "bg-slate-800/30")}>
            <span className="text-xs text-slate-500 uppercase tracking-tight mb-1">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{value}</span>
                {trend && (
                    <span className={cn("flex",
                        trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-slate-500"
                    )}>
                        {trend === "up" && <ArrowUp className="w-4 h-4" />}
                        {trend === "down" && <ArrowDown className="w-4 h-4" />}
                        {trend === "flat" && <Minus className="w-4 h-4" />}
                    </span>
                )}
            </div>
            {subValue && <span className="text-xs text-slate-400">{subValue}</span>}
        </div>
    );
}

interface CockpitRowProps {
    target: number; // %
    volume: string;
    ordersWallet: number;
    ordersBilled: number;
    ordersPending: number;
}

export function CockpitRow({ target, volume, ordersWallet, ordersBilled, ordersPending }: CockpitRowProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden backdrop-blur-sm">
            <KPICell
                label="Meta Atingida"
                value={`${target.toFixed(1)}%`}
                trend={target >= 90 ? "up" : target < 70 ? "down" : "flat"}
                highlight
            />
            <KPICell
                label="Volume (HL)"
                value={volume}
                subValue="Realizado MTD"
            />
            <KPICell
                label="Pedidos"
                value={(ordersWallet + ordersBilled + ordersPending).toString()}
                subValue={`${ordersPending} Pendentes`}
                trend="flat"
            />
            <KPICell
                label="Risco Operacional"
                value={ordersPending > 5 ? "ALTO" : "BAIXO"}
                trend={ordersPending > 5 ? "down" : "up"}
                subValue="Pedidos Travados"
            />
        </div>
    );
}
