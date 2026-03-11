"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, User, Calendar, ArrowRight } from "lucide-react";

// Mock Data for "At Risk" Items (Hunter Opportunities)
const RISK_ITEMS = [
    { sku: "Heineken 0.0 Long Neck", daysWithoutSale: 45, rede: "Angeloni", potential: 12000, action: "Reativar Mix", owner: "Victor C." },
    { sku: "Eisenbahn Pilsen 600ml", daysWithoutSale: 28, rede: "Bistek", potential: 8500, action: "Oferta Comb.", owner: "Ana P." },
    { sku: "Amstel Ultra Lata", daysWithoutSale: 21, rede: "Giassi", potential: 5400, action: "Verificar Estoque", owner: "Carlos" },
    { sku: "Lagunitas IPA", daysWithoutSale: 60, rede: "Imperatriz", potential: 3200, action: "Apresentar", owner: "Victor C." },
];

export function SalesRiskList() {
    return (
        <Card className="bg-slate-900/40 border-slate-800 h-full">
            <CardHeader className="pb-2 flex flex-row items-center justify-between pt-3">
                <CardTitle className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" />
                    Hunter: Oportunidades (Ação)
                </CardTitle>
                <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px]">
                    {RISK_ITEMS.length} Pendentes
                </Badge>
            </CardHeader>
            <CardContent className="space-y-3 p-5">
                {RISK_ITEMS.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950/20 border border-slate-800/50 hover:border-slate-700 hover:bg-slate-900/40 transition-all group cursor-pointer relative overflow-hidden">
                        {/* Status Stripe */}
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-rose-500/40 group-hover:bg-rose-500 transition-colors"></div>

                        <div className="flex justify-between items-start mb-3 pl-3">
                            <div>
                                <div className="font-bold text-slate-100 text-sm">{item.sku}</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mt-0.5">{item.rede}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-rose-400 bg-rose-950/30 px-2 py-0.5 rounded text-center mb-1">
                                    {item.daysWithoutSale}d sem venda
                                </div>
                                <div className="text-[10px] text-emerald-400 font-bold block">
                                    Potencial: R$ {new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(item.potential)}
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="flex items-center justify-between pl-3 pt-2 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700 text-[10px] h-6 px-2 flex gap-1.5 font-medium border border-slate-700">
                                    <ArrowRight className="w-3 h-3 text-slate-500" />
                                    {item.action}
                                </Badge>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 px-2">
                                    <User className="w-3 h-3 text-slate-600" />
                                    {item.owner}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="pt-1">
                    <button className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors text-center uppercase tracking-wider flex items-center justify-center gap-2">
                        <TrendingUp className="w-3 h-3" />
                        Ver Mapeamento Completo
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
