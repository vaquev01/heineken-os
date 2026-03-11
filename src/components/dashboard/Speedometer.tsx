"use client";

import { cn } from "@/lib/utils";

interface SpeedometerProps {
    value: number; // 0 to 100+
    label: string;
    subLabel?: string;
    color?: "emerald" | "amber" | "rose" | "blue";
}

export function Speedometer({ value, label, subLabel, color = "emerald" }: SpeedometerProps) {
    // Clamp value for visual arc (0-100 for display, but show real text)
    const clampedValue = Math.min(Math.max(value, 0), 100);
    // Arc calculation: 180 degrees total. 
    // dasharray = pi * r. r=40 -> 125.6
    const radius = 40;
    const circumference = Math.PI * radius;
    const offset = circumference - (clampedValue / 100) * circumference;

    const colors = {
        emerald: "stroke-emerald-500 text-emerald-500",
        amber: "stroke-amber-500 text-amber-500",
        rose: "stroke-rose-500 text-rose-500",
        blue: "stroke-blue-500 text-blue-500",
    };

    const bgColors = {
        emerald: "stroke-emerald-500/20",
        amber: "stroke-amber-500/20",
        rose: "stroke-rose-500/20",
        blue: "stroke-blue-500/20",
    };

    return (
        <div className="flex flex-col items-center justify-center relative">
            <div className="relative w-32 h-16 overflow-hidden">
                <svg className="w-32 h-32 absolute top-0 left-0 transform -rotate-0" viewBox="0 0 100 100">
                    {/* Background Arc */}
                    <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className={bgColors[color]}
                    />
                    {/* Value Arc */}
                    <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className={cn("transition-all duration-1000 ease-out", colors[color])}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ strokeDashoffset: offset }}
                    />
                </svg>
                {/* Needle / Value */}
                <div className="absolute bottom-0 left-0 right-0 text-center flex flex-col items-center">
                    <span className={cn("text-2xl font-bold tracking-tighter", colors[color])}>
                        {value.toFixed(1)}%
                    </span>
                </div>
            </div>
            <div className="text-center mt-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-widest">{label}</div>
                {subLabel && <div className="text-[10px] text-slate-500">{subLabel}</div>}
            </div>
        </div>
    );
}
