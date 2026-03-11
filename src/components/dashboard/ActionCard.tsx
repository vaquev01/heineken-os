import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ActionCardProps {
    title: string;
    count: number;
    status: "critical" | "warning" | "success" | "neutral";
    description: string;
    actionLabel: string;
    actionUrl: string;
}

export function ActionCard({ title, count, status, description, actionLabel, actionUrl }: ActionCardProps) {
    const statusConfig = {
        critical: {
            icon: AlertCircle,
            color: "text-red-500",
            borderColor: "border-red-900",
            bgColor: "bg-red-950/20",
            btnVariant: "destructive" as const
        },
        warning: {
            icon: AlertTriangle,
            color: "text-amber-500",
            borderColor: "border-amber-900",
            bgColor: "bg-amber-950/20",
            btnVariant: "outline" as const
        },
        success: {
            icon: CheckCircle2,
            color: "text-green-500",
            borderColor: "border-green-900",
            bgColor: "bg-green-950/20",
            btnVariant: "outline" as const
        },
        neutral: {
            icon: ArrowRight,
            color: "text-slate-400",
            borderColor: "border-slate-800",
            bgColor: "bg-slate-900/50",
            btnVariant: "ghost" as const
        }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <Card className={cn("border backdrop-blur-sm transition-all hover:scale-[1.02]", config.borderColor, config.bgColor)}>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className={cn("text-sm font-medium", config.color)}>
                        {title}
                    </CardTitle>
                    <Icon className={cn("h-5 w-5", config.color)} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-white mb-1">{count}</div>
                <p className="text-xs text-slate-400">{description}</p>
            </CardContent>
            <CardFooter>
                <Link href={actionUrl} className="w-full">
                    <Button variant={config.btnVariant} className="w-full h-8 text-xs">
                        {actionLabel} <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
