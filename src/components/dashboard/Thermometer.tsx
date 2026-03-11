import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface ThermometerProps {
    status: "good" | "warning" | "critical";
    score: number; // 0 to 100
    label: string;
}

export function Thermometer({ status, score, label }: ThermometerProps) {
    const config = {
        good: { color: "text-green-500", bg: "bg-green-500", icon: CheckCircle2, text: "Operação Saudável" },
        warning: { color: "text-amber-500", bg: "bg-amber-500", icon: AlertTriangle, text: "Atenção Necessária" },
        critical: { color: "text-red-500", bg: "bg-red-500", icon: XCircle, text: "Risco Crítico" }
    };

    const current = config[status];
    const Icon = current.icon;

    return (
        <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-900/80 border border-slate-800 shadow-lg backdrop-blur-sm">
            <div className={cn("p-3 rounded-full bg-slate-950/50 border", current.color.replace("text-", "border-"))}>
                <Icon className={cn("w-8 h-8", current.color)} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                    <span className={cn("text-xl font-bold uppercase tracking-wider", current.color)}>{current.text}</span>
                    <span className="text-2xl font-black text-white">{score}<span className="text-sm font-normal text-slate-500">/100</span></span>
                </div>
                {/* Progress Bar with Zones */}
                <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-red-900/40 border-r border-slate-900/50"></div>
                    <div className="absolute top-0 bottom-0 left-1/3 w-1/3 bg-amber-900/40 border-r border-slate-900/50"></div>
                    <div className="absolute top-0 bottom-0 right-0 w-1/3 bg-green-900/40"></div>

                    {/* Indicator */}
                    <div
                        className={cn("absolute top-0 bottom-0 w-1 shadow-[0_0_10px_2px_currentColor] transition-all duration-1000", current.bg)}
                        style={{ left: `${score}%` }}
                    ></div>
                </div>
                <p className="text-xs text-slate-400 mt-2">{label}</p>
            </div>
        </div>
    );
}
