import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface HealthBarProps {
    label: string;
    value: number;
    total: number;
    formatValue: (v: number) => string;
    status?: "success" | "warning" | "critical";
    subtext?: string;
}

export function HealthBar({ label, value, total, formatValue, status = "success", subtext }: HealthBarProps) {
    const percentage = Math.min((value / total) * 100, 100);

    let progressColor = "bg-green-500";
    if (status === "warning") progressColor = "bg-amber-500";
    if (status === "critical") progressColor = "bg-red-500";

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-slate-300 font-medium">{label}</span>
                <span className="text-white font-bold">
                    {formatValue(value)} <span className="text-slate-500 text-xs font-normal">/ {formatValue(total)}</span>
                </span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                    className={cn("h-full transition-all duration-500", progressColor)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {subtext && <p className="text-xs text-slate-500 text-right">{subtext}</p>}
        </div>
    );
}
