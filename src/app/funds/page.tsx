"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    Filter,
    Building2,
    Users,
    PieChart,
    BarChart3,
    ArrowRight
} from "lucide-react";
import { toast } from "sonner";

// Real/Mock data imports
import {
    getTransactions,
    getAggregatedByNetwork,
    getAggregatedByType,
    TRANSACTIONS_MOCK
} from "@/core/data/conta-corrente";

// Format helpers
function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatPercent(value: number): string {
    return `${value.toFixed(1)}%`;
}

export default function FundsPage() {
    // --- GLOBAL FILTERS ---
    const [selectedRegional, setSelectedRegional] = useState("ALL"); // NEW
    const [selectedExecutive, setSelectedExecutive] = useState("ALL");
    const [selectedPeriod, setSelectedPeriod] = useState("ALL"); // ALL, 2025-01, etc.
    const [searchTerm, setSearchTerm] = useState("");

    // --- DERIVED DATA ---
    const filteredData = useMemo(() => {
        return getTransactions({
            regional: selectedRegional === "ALL" ? undefined : selectedRegional,
            executive: selectedExecutive === "ALL" ? undefined : selectedExecutive,
            month: selectedPeriod === "ALL" ? undefined : selectedPeriod
        });
    }, [selectedRegional, selectedExecutive, selectedPeriod]);

    // Aggregations
    const byNetwork = useMemo(() => getAggregatedByNetwork(filteredData), [filteredData]);
    const byType = useMemo(() => getAggregatedByType(filteredData), [filteredData]);

    // KPI Calcs from filtered data
    const totalSpend = filteredData.reduce((sum, t) => t.value < 0 ? sum + Math.abs(t.value) : sum, 0);
    const totalBudget = filteredData.reduce((sum, t) => t.value > 0 ? sum + t.value : sum, 0);
    const totalBalance = totalBudget - totalSpend;
    const utilization = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;

    // Derived Lists for Selects
    const regionals = Array.from(new Set(TRANSACTIONS_MOCK.map(t => t.regional))).sort();

    // Executives filtered by Regional
    const executives = useMemo(() => {
        let list = TRANSACTIONS_MOCK;
        if (selectedRegional !== "ALL") {
            list = list.filter(t => t.regional === selectedRegional);
        }
        return Array.from(new Set(list.map(t => t.executive))).sort();
    }, [selectedRegional]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

            {/* HEADER & FILTERS */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                            <Wallet className="h-8 w-8 text-emerald-500" />
                            Governança de Verbas
                        </h2>
                        <p className="text-slate-400 mt-1">
                            Controle de eficiência e savings (Carteira Digital)
                        </p>
                    </div>
                </div>

                {/* PREMIUM FILTER BAR */}
                <div className="bg-slate-950/40 backdrop-blur-md border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium uppercase tracking-wider">
                        <Filter className="w-4 h-4 text-emerald-500" />
                        Filtros Globais:
                    </div>

                    <div className="flex flex-wrap gap-3 flex-1 justify-end">
                        {/* Regional Filter - NEW */}
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase text-slate-500 font-bold ml-1">Regional</label>
                            <Select value={selectedRegional} onValueChange={(val) => { setSelectedRegional(val); setSelectedExecutive("ALL"); }}>
                                <SelectTrigger className="w-[180px] h-9 bg-slate-900 border-slate-700 text-slate-200">
                                    <SelectValue placeholder="Todas as Regionais" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                    <SelectItem value="ALL">Todas Regionais</SelectItem>
                                    {regionals.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Executive Filter */}
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase text-slate-500 font-bold ml-1">Executivo</label>
                            <Select value={selectedExecutive} onValueChange={setSelectedExecutive}>
                                <SelectTrigger className="w-[200px] h-9 bg-slate-900 border-slate-700 text-slate-200">
                                    <SelectValue placeholder="Todos os Executivos" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                    <SelectItem value="ALL">Todos os Executivos</SelectItem>
                                    {executives.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Period Filter */}
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase text-slate-500 font-bold ml-1">Período</label>
                            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                <SelectTrigger className="w-[160px] h-9 bg-slate-900 border-slate-700 text-slate-200">
                                    <SelectValue placeholder="Ano 2025" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                    <SelectItem value="ALL">Ano 2025 (YTD)</SelectItem>
                                    <SelectItem value="2025-01">Janeiro 2025</SelectItem>
                                    <SelectItem value="2025-02">Fevereiro 2025</SelectItem>
                                    <SelectItem value="2025-03">Março 2025</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-950/40 backdrop-blur-md border-slate-800/60 shadow-lg group">
                    <CardContent className="pt-6">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Orçamento Total</p>
                        <p className="text-2xl font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors">{formatCurrency(totalBudget)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950/40 backdrop-blur-md border-slate-800/60 shadow-lg group">
                    <CardContent className="pt-6">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Gasto (Investido)</p>
                        <p className="text-2xl font-bold text-slate-200 mt-1 group-hover:text-amber-400 transition-colors">{formatCurrency(totalSpend)}</p>
                        <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${utilization > 100 ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(utilization, 100)}%` }} />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950/40 backdrop-blur-md border-slate-800/60 shadow-lg group">
                    <CardContent className="pt-6">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Saldo (Saving)</p>
                        <p className={`text-2xl font-bold mt-1 ${totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                            {formatCurrency(totalBalance)}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{totalBalance >= 0 ? 'Dentro do Budget' : 'Estouro de Verba'}</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-950/40 backdrop-blur-md border-slate-800/60 shadow-lg flex items-center justify-center">
                    <div className="text-center">
                        <div className={`inline-flex p-3 rounded-full mb-2 ${totalBalance >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {totalBalance >= 0 ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                        <p className={`text-sm font-bold ${totalBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {totalBalance >= 0 ? "Sob Controle" : "Atenção Requerida"}
                        </p>
                    </div>
                </Card>
            </div>

            {/* TABBED VIEWS */}
            <Tabs defaultValue="network" className="w-full">
                <TabsList className="bg-slate-900 border border-slate-800 h-11 p-1">
                    <TabsTrigger value="executive" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">
                        <Users className="w-4 h-4 mr-2" /> Visão Executivo
                    </TabsTrigger>
                    <TabsTrigger value="network" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">
                        <Building2 className="w-4 h-4 mr-2" /> Visão Rede
                    </TabsTrigger>
                    <TabsTrigger value="type" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-400">
                        <PieChart className="w-4 h-4 mr-2" /> Visão Tipo
                    </TabsTrigger>
                </TabsList>

                {/* 1. NETWORK VIEW */}
                <TabsContent value="network" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {byNetwork.map((net, idx) => {
                            const share = (net.value / totalSpend) * 100;
                            return (
                                <Card key={idx} className="bg-slate-900/40 border-slate-800 hover:bg-slate-900/60 transition-colors group cursor-pointer">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg text-slate-200 flex justify-between items-start">
                                            {net.name}
                                            <Badge variant="outline" className="bg-slate-950 border-slate-800 text-slate-400 group-hover:text-white group-hover:border-slate-600 transition-colors">
                                                {formatPercent(share)} Share
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4">
                                            <div className="text-2xl font-bold text-white">{formatCurrency(net.value)}</div>
                                            <div className="text-xs text-slate-500">Investimento Total</div>
                                        </div>
                                        <Progress value={share} className="h-1.5" indicatorClassName="bg-indigo-500" />
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                {/* 2. TYPE VIEW */}
                <TabsContent value="type" className="mt-6">
                    <Card className="bg-slate-900/40 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Distribuição por Tipo de Verba</CardTitle>
                            <CardDescription className="text-slate-400">Análise de investimento por natureza (Contrato vs Extra)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {byType.map((item, idx) => {
                                const share = (item.value / totalSpend) * 100;
                                return (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <div className="text-base font-medium text-slate-200 flex items-center gap-2">
                                                    {item.name}
                                                    {item.name === "Contrato" && <Badge className="bg-emerald-950 text-emerald-400 border-emerald-900 text-[10px]">Recorrente</Badge>}
                                                    {item.name === "Verba Extra" && <Badge className="bg-amber-950 text-amber-400 border-amber-900 text-[10px]">Spot</Badge>}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {formatCurrency(item.value)} investidos
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xl font-bold text-white">{formatPercent(share)}</span>
                                            </div>
                                        </div>
                                        <Progress value={share} className="h-2.5 bg-slate-950" indicatorClassName={idx === 0 ? "bg-emerald-500" : idx === 1 ? "bg-amber-500" : "bg-blue-500"} />
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 3. EXECUTIVE VIEW (Legacy + Refined) */}
                <TabsContent value="executive" className="mt-6">
                    <Card className="bg-slate-900/40 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Performance por Executivo</CardTitle>
                            <CardDescription className="text-slate-400">Ranking de gestão de budget</CardDescription>
                        </CardHeader>
                        <CardContent className="overflow-x-auto custom-scrollbar">
                            <Table className="min-w-[600px]">
                                <TableHeader>
                                    <TableRow className="border-slate-800 hover:bg-transparent">
                                        <TableHead className="text-slate-400">Executivo</TableHead>
                                        <TableHead className="text-right text-slate-400">Budget</TableHead>
                                        <TableHead className="text-right text-slate-400">Gasto</TableHead>
                                        <TableHead className="text-right text-slate-400">Saldo</TableHead>
                                        <TableHead className="text-right text-slate-400">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {/* Mock Aggregation for table logic - simplified for demo */}
                                    {executives.map((exec, idx) => {
                                        const execTrans = TRANSACTIONS_MOCK.filter(t => t.executive === exec);
                                        const budget = execTrans.filter(t => t.value > 0).reduce((a, b) => a + b.value, 0);
                                        const spend = execTrans.filter(t => t.value < 0).reduce((a, b) => a + Math.abs(b.value), 0);
                                        const balance = budget - spend;

                                        // Filter by selection if active
                                        if (selectedExecutive !== "ALL" && selectedExecutive !== exec) return null;

                                        return (
                                            <TableRow key={idx} className="border-slate-800 hover:bg-slate-800/50">
                                                <TableCell className="font-medium text-slate-200">{exec}</TableCell>
                                                <TableCell className="text-right text-slate-400">{formatCurrency(budget)}</TableCell>
                                                <TableCell className="text-right text-slate-400">{formatCurrency(spend)}</TableCell>
                                                <TableCell className={`text-right font-bold ${balance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {formatCurrency(balance)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {balance >= 0 ?
                                                        <Badge variant="outline" className="border-emerald-900 bg-emerald-950/20 text-emerald-400">No Azul</Badge> :
                                                        <Badge variant="outline" className="border-rose-900 bg-rose-950/20 text-rose-400">Estouro</Badge>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
