import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnomalyRowProps {
    name: string;
    metric: string;
    value: string;
    delta: number; // percentage, positive or negative
    type: "negative" | "positive"; // "negative" means bad (e.g. low sales), "positive" means opportunity
}

export function AnomalyRow({ name, metric, value, delta, type }: AnomalyRowProps) {
    const isBad = type === "negative";
    const color = isBad ? "text-red-400" : "text-green-400";
    const Icon = delta < 0 ? ArrowDown : ArrowUp;

    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800/50 transition-colors">
            <div className="flex flex-col">
                <span className="text-sm font-medium text-white">{name}</span>
                <span className="text-xs text-slate-500">{metric}</span>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-white">{value}</span>
                <div className={cn("flex items-center text-xs font-medium px-2 py-1 rounded-full bg-slate-950", color)}>
                    <Icon className="h-3 w-3 mr-1" />
                    {Math.abs(delta).toFixed(1)}%
                </div>
            </div>
        </div>
    );
}
