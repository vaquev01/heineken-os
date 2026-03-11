import { Package, Clock, CheckCircle2, AlertOctagon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function FlowBlock() {
    // Mock Pipeline
    const pipeline = [
        { label: "Em Digitação", count: 15, value: "R$ 12k", status: "neutral", icon: Package },
        { label: "Pendentes", count: 4, value: "R$ 48k", status: "warning", icon: Clock },
        { label: "Travados (Risco)", count: 2, value: "R$ 8k", status: "critical", icon: AlertOctagon },
        { label: "Faturados Hoje", count: 28, value: "R$ 110k", status: "success", icon: CheckCircle2 },
    ];

    const colors = {
        neutral: "text-slate-400 bg-slate-950/40 border-slate-800/60 shadow-lg backdrop-blur-md", // Em Digitação
        warning: "text-amber-400 bg-amber-950/10 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)] backdrop-blur-md", // Pendentes
        critical: "text-rose-400 bg-rose-950/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)] backdrop-blur-md", // Travados
        success: "text-emerald-400 bg-emerald-950/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] backdrop-blur-md", // Faturados
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {pipeline.map((item, idx) => {
                const Icon = item.icon;
                const style = colors[item.status as keyof typeof colors];

                return (
                    <div key={idx} className={`p-5 rounded-xl border flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer ${style}`}>
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">{item.label}</span>
                            <Icon className="w-4 h-4 opacity-80" />
                        </div>
                        <div>
                            <span className="text-3xl font-bold block tracking-tight">{item.count}</span>
                            <span className="text-xs opacity-70 font-medium mt-1 block">{item.value}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
