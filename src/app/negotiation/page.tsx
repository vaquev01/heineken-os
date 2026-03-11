"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Save, TrendingUp, TrendingDown, Package, Calculator,
    Settings2, Eye, Truck, DollarSign, GripVertical
} from "lucide-react";

import { toast } from "sonner";
import { useDataStore } from "@/core/store/data-store";

// Formatters
function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}
function formatNumber(value: number): string {
    return new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(value);
}
function formatDecimal(value: number): string {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

// Columns Configuration
const AVAILABLE_COLUMNS = [
    { id: "logistics", label: "Logística (Pal/Truck)" },
    { id: "inv_avail", label: "Inv. Disponível" },
    { id: "inv_released", label: "Inv. Liberado (Unit)" },
    { id: "inv_total", label: "Inv. Total (R$)" },
];

export default function NegotiationPage() {
    const { products: PRODUCTS, calendar: CALENDAR, priceTable, fetchData, isLoading } = useDataStore();

    useEffect(() => {
        if (PRODUCTS.length === 0) fetchData();
    }, []);

    // --- STATE: FILTERS ---
    const [selectedRede, setSelectedRede] = useState("");
    const [selectedUf, setSelectedUf] = useState("SP");
    const [selectedMarca, setSelectedMarca] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("jan");
    const [selectedSubBrand, setSelectedSubBrand] = useState("ALL");
    const [selectedSize, setSelectedSize] = useState("ALL");

    // --- STATE: CONFIG ---
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
        "logistics": true,
        "inv_avail": true,
        "inv_released": true,
        "inv_total": true
    });

    // --- STATE: SELECTION & INPUTS ---
    const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set());

    interface LineInput {
        volumeValue: number;
        selectedUnit: "CX" | "HL" | "PAL";
        promoPrice: number; // Preço Ponta (Net Price)
    }

    const [lineInputs, setLineInputs] = useState<Record<string, LineInput>>({});

    // --- METADATA INIT ---
    // Initialize Selection for all items initially (or could start empty)
    useEffect(() => {
        if (PRODUCTS.length > 0 && selectedSkus.size === 0) {
            // Default: Select top 20 for demo to avoid overwhelming list
            // In production, might want 'All' or 'None'
            // For now, let's select ALL matching the default filter if small, or limited.
            // Let's rely on user interactions.
        }
    }, [PRODUCTS]);


    // --- HELPERS: DERIVED DATA ---
    const PRODUCT_METADATA = useMemo(() => {
        return PRODUCTS.map(p => {
            const desc = p.descricao;
            let size = "Outros";
            if (desc.includes("600ML")) size = "600ML";
            else if (desc.includes("350ML")) size = "Lata 350ML";
            else if (desc.includes("269ML")) size = "Lata 269ML";
            else if (desc.includes("LONG NECK")) size = "Long Neck";
            else if (desc.includes("1L")) size = "1 Litro";
            else if (desc.includes("KEG") || desc.includes("BARRIL")) size = "Barril";

            let sub = p.marca;
            if (desc.includes("ULTRA")) sub = p.marca + " ULTRA";
            if (desc.includes("ZERO")) sub = p.marca + " 0.0";

            return { ...p, derivedSize: size, derivedSub: sub };
        });
    }, [PRODUCTS]);

    const BRANDS = useMemo(() => Array.from(new Set(PRODUCTS.map(p => p.marca))).sort(), [PRODUCTS]);
    const REDES = useMemo(() => Array.from(new Set(priceTable.map(p => p.rede))).sort(), [priceTable]);

    // --- FILTER LOGIC ---
    const filteredProducts = useMemo(() => {
        let result = PRODUCT_METADATA;
        if (selectedMarca && selectedMarca !== "ALL") result = result.filter(p => p.marca === selectedMarca);
        if (selectedSubBrand && selectedSubBrand !== "ALL") result = result.filter(p => p.derivedSub === selectedSubBrand);
        if (selectedSize && selectedSize !== "ALL") result = result.filter(p => p.derivedSize === selectedSize);
        return result;
    }, [selectedMarca, selectedSubBrand, selectedSize, PRODUCT_METADATA]);

    // --- CALCULATION ENGINE ---
    const rows = useMemo(() => {
        return filteredProducts.map(product => {
            const calEntry = CALENDAR.find(c =>
                c.uf === selectedUf &&
                c.marca.toUpperCase() === product.marca.toUpperCase()
            );

            // 1. BASE PRICES
            const listPrice = calEntry?.ttcLista || 100; // Tabela
            const calendarPromoPrice = calEntry?.ttcPromo || listPrice; // Sugestão Calendário

            // 2. INPUTS
            const input = lineInputs[product.codSku] || {
                volumeValue: 0,
                selectedUnit: "CX",
                promoPrice: 0
            };

            // 3. VOLUME CONVERSION
            const hlPerCase = product.hlPac || 0.042;
            const casesPerPallet = product.palete || 100;

            let volumeCaixas = 0;
            let volumeHL = 0;
            let volumePallets = 0;

            if (input.selectedUnit === "CX") {
                volumeCaixas = input.volumeValue;
                volumeHL = volumeCaixas * hlPerCase;
                volumePallets = casesPerPallet > 0 ? volumeCaixas / casesPerPallet : 0;
            } else if (input.selectedUnit === "HL") {
                volumeHL = input.volumeValue;
                volumeCaixas = hlPerCase > 0 ? volumeHL / hlPerCase : 0;
                volumePallets = casesPerPallet > 0 ? volumeCaixas / casesPerPallet : 0;
            } else if (input.selectedUnit === "PAL") {
                volumePallets = input.volumeValue;
                volumeCaixas = volumePallets * casesPerPallet;
                volumeHL = volumeCaixas * hlPerCase;
            }

            // 4. LOGISTICS (UPDATED FACTOR: 26 Pallets)
            const TRUCK_FACTOR = 26;
            const trucks = volumePallets / TRUCK_FACTOR;

            // 5. FINANCIALS
            // Available (Disponivel): Based on Calendar guidelines (Tabela - CalendarPromo)
            // If CalendarPromo < Tabela, there is support.
            const unitInvAvailable = Math.max(0, listPrice - calendarPromoPrice);

            // Released (Liberado): Based on User Input (Tabela - UserPromo)
            const userNetPrice = input.promoPrice > 0 ? input.promoPrice : listPrice;
            const unitInvReleased = Math.max(0, listPrice - userNetPrice);

            // Total Investment Generated (Sell In)
            const totalInvGenerated = volumeCaixas * unitInvReleased;

            // Gross Revenue (Faturamento Tabela)
            const grossRevenue = volumeCaixas * listPrice;

            return {
                product,
                input,
                listPrice,
                volumeCaixas,
                volumeHL,
                volumePallets,
                trucks,
                unitInvAvailable,
                unitInvReleased,
                totalInvGenerated,
                grossRevenue,
                isSelected: selectedSkus.has(product.codSku)
            };
        });
    }, [filteredProducts, CALENDAR, selectedUf, lineInputs, selectedSkus]);


    // --- TOTALS (Only Selected SKUs) ---
    const activeRows = rows.filter(r => r.isSelected);

    const totalGrossRevenue = activeRows.reduce((sum, r) => sum + r.grossRevenue, 0);
    const totalVolumeHL = activeRows.reduce((sum, r) => sum + r.volumeHL, 0);
    const totalTrucks = activeRows.reduce((sum, r) => sum + r.trucks, 0);
    const totalCalendarInv = activeRows.reduce((sum, r) => sum + r.totalInvGenerated, 0);

    // Dynamic Buckets
    // "Contrato" usually ~1.7%, "PFP" ~5.0% - user wants labels just related to concept
    const CONTRACT_RATE = 1.7;
    const PFP_RATE = 5.0;

    const contractValue = totalGrossRevenue * (CONTRACT_RATE / 100);
    const pfpValue = totalGrossRevenue * (PFP_RATE / 100);

    const grandTotalInv = totalCalendarInv + contractValue + pfpValue;
    const grandTotalPct = totalGrossRevenue > 0 ? (grandTotalInv / totalGrossRevenue) * 100 : 0;


    // --- HANDLERS ---
    const handleInput = (sku: string, field: keyof LineInput, val: any) => {
        setLineInputs(prev => ({
            ...prev,
            [sku]: {
                ...prev[sku] || { volumeValue: 0, selectedUnit: "CX", promoPrice: 0 },
                [field]: val
            }
        }));
        // Auto-select if interaction happens
        if (!selectedSkus.has(sku) && val > 0) {
            const newSet = new Set(selectedSkus);
            newSet.add(sku);
            setSelectedSkus(newSet);
        }
    };

    const toggleSelection = (sku: string) => {
        const newSet = new Set(selectedSkus);
        if (newSet.has(sku)) newSet.delete(sku);
        else newSet.add(sku);
        setSelectedSkus(newSet);
    };

    const toggleColumn = (id: string) => {
        setVisibleColumns(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const fillTargets = () => {
        // Mock: Fill random volumes for displayed SKUs
        const newInputs = { ...lineInputs };
        const newSelection = new Set(selectedSkus);

        filteredProducts.forEach(p => {
            // Mock target: 100 cases
            if (!newInputs[p.codSku] || newInputs[p.codSku].volumeValue === 0) {
                newInputs[p.codSku] = {
                    volumeValue: Math.floor(Math.random() * 500) + 50,
                    selectedUnit: "CX",
                    promoPrice: 0
                };
                newSelection.add(p.codSku);
            }
        });
        setLineInputs(newInputs);
        setSelectedSkus(newSelection);
        toast.success("Metas preenchidas com sucesso!");
    };


    if (isLoading) return <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">Carregando Simulador...</div>;

    return (
        <div className="min-h-screen bg-slate-950 pb-32 animate-in fade-in duration-500">

            {/* --- HEADER --- */}
            <div className="bg-slate-900/50 border-b border-slate-800 p-6 sticky top-0 z-20 backdrop-blur-md">
                <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">

                    {/* TITLE & ACTIONS */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                Simulador de Proposta
                                <div className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">v2.2</div>
                            </h1>
                            <p className="text-slate-400 text-sm">Gestão de Rentabilidade e Logística</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={fillTargets} className="border-slate-700 hover:bg-slate-800 text-slate-300">
                                <TrendingUp className="w-4 h-4 mr-2 text-blue-400" /> Preencher Meta
                            </Button>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                                <Save className="w-4 h-4 mr-2" /> Finalizar
                            </Button>
                        </div>
                    </div>

                    {/* FILTERS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-slate-500 font-bold">Cliente</Label>
                            <Select value={selectedRede} onValueChange={setSelectedRede}>
                                <SelectTrigger className="h-8 bg-slate-900 border-slate-700 text-xs text-slate-200"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800"><SelectItem value="ALL">Todos</SelectItem>{REDES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-slate-500 font-bold">Estado (UF)</Label>
                            <Select value={selectedUf} onValueChange={setSelectedUf}>
                                <SelectTrigger className="h-8 bg-slate-900 border-slate-700 text-xs text-slate-200"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800"><SelectItem value="SP">SP</SelectItem><SelectItem value="RJ">RJ</SelectItem><SelectItem value="MG">MG</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-slate-500 font-bold">Marca</Label>
                            <Select value={selectedMarca} onValueChange={setSelectedMarca}>
                                <SelectTrigger className="h-8 bg-slate-900 border-slate-700 text-xs text-slate-200"><SelectValue placeholder="Todas" /></SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800"><SelectItem value="ALL">Todas</SelectItem>{BRANDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* FINANCIAL CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* TOTAL */}
                        <Card className="bg-slate-800/40 border-slate-700/50">
                            <CardContent className="p-4">
                                <div className="text-xs text-slate-500 font-bold uppercase mb-1">Investimento Total</div>
                                <div className="text-2xl font-bold text-white tracking-tight">{formatCurrency(grandTotalInv)}</div>
                                <div className={`text-xs font-mono mt-1 ${grandTotalPct > 30 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {grandTotalPct.toFixed(2)}% <span className="text-slate-500">do Faturamento</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* BREAKDOWN ITEMS */}
                        <div className="col-span-3 grid grid-cols-3 gap-2">
                            <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-800/60 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><DollarSign className="w-8 h-8 text-blue-500" /></div>
                                <div className="text-[10px] text-blue-400 font-bold uppercase">Calendário (Promo)</div>
                                <div className="text-lg font-semibold text-slate-200 mt-1">{formatCurrency(totalCalendarInv)}</div>
                                <div className="text-[10px] text-slate-500">Verba Variável (Sell-in)</div>
                            </div>
                            <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-800/60 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><GripVertical className="w-8 h-8 text-amber-500" /></div>
                                <div className="text-[10px] text-amber-500 font-bold uppercase">Contrato</div>
                                <div className="text-lg font-semibold text-slate-200 mt-1">{formatCurrency(contractValue)}</div>
                                <div className="text-[10px] text-slate-500">Fixo ({CONTRACT_RATE}%)</div>
                            </div>
                            <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-800/60 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><Package className="w-8 h-8 text-purple-500" /></div>
                                <div className="text-[10px] text-purple-500 font-bold uppercase">PFP</div>
                                <div className="text-lg font-semibold text-slate-200 mt-1">{formatCurrency(pfpValue)}</div>
                                <div className="text-[10px] text-slate-500">Execução ({PFP_RATE}%)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="max-w-[1600px] mx-auto p-6">

                {/* TOOLBAR */}
                <div className="flex justify-between items-center mb-3">
                    <div className="text-sm text-slate-400">
                        Exibindo <span className="text-white font-medium">{rows.length}</span> SKUs
                        (<span className="text-emerald-400 font-medium">{selectedSkus.size}</span> selecionados)
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-white hover:bg-slate-800">
                                <Settings2 className="w-4 h-4 mr-2" /> Configurar Colunas
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 bg-slate-900 border-slate-800 p-2" align="end">
                            <div className="text-xs font-semibold text-slate-500 mb-2 px-2 uppercase">Visibilidade</div>
                            {AVAILABLE_COLUMNS.map(col => (
                                <div key={col.id} className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded cursor-pointer" onClick={() => toggleColumn(col.id)}>
                                    <Checkbox checked={visibleColumns[col.id]} onCheckedChange={() => toggleColumn(col.id)} className="border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500" />
                                    <span className="text-sm text-slate-300">{col.label}</span>
                                </div>
                            ))}
                        </PopoverContent>
                    </Popover>
                </div>

                {/* TABLE */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-hidden shadow-2xl">
                    <Table>
                        <TableHeader className="bg-slate-950/80 backdrop-blur border-b border-slate-800">
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="w-[50px] text-center"><Checkbox className="border-slate-600" /></TableHead>
                                <TableHead className="w-[300px] text-slate-300 font-semibold">Produto</TableHead>

                                {visibleColumns['logistics'] && (
                                    <TableHead className="text-center text-blue-400 border-l border-slate-800/50">
                                        <div className="flex items-center justify-center gap-1"><Truck className="w-3 h-3" /> Logística</div>
                                    </TableHead>
                                )}

                                <TableHead className="text-center text-slate-300">Volume</TableHead>

                                {visibleColumns['inv_avail'] && (
                                    <TableHead className="text-right text-slate-400 border-l border-slate-800/50" title="Verba Disponível em Calendário">
                                        Disp. (R$)
                                    </TableHead>
                                )}

                                {visibleColumns['inv_released'] && (
                                    <TableHead className="text-center text-emerald-400 border-l border-slate-800/50">
                                        <div className="flex items-center justify-center gap-1"><DollarSign className="w-3 h-3" /> Liberado (Un)</div>
                                    </TableHead>
                                )}

                                {visibleColumns['inv_total'] && (
                                    <TableHead className="text-right text-amber-400 border-l border-slate-800/50">Total Gerado</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.product.codSku} className={`border-b border-slate-800/40 transition-colors ${row.isSelected ? 'bg-slate-800/20 hover:bg-slate-800/40' : 'hover:bg-slate-800/10 opacity-70'}`}>

                                    {/* SELECTION */}
                                    <TableCell className="text-center py-3">
                                        <Checkbox
                                            checked={row.isSelected}
                                            onCheckedChange={() => toggleSelection(row.product.codSku)}
                                            className="border-slate-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                        />
                                    </TableCell>

                                    {/* PRODUCT */}
                                    <TableCell className="py-3">
                                        <div className="font-medium text-slate-200 text-sm">{row.product.descricao}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500 h-5 px-1.5 font-mono">{row.product.codSku}</Badge>
                                            <span className="text-[10px] text-slate-500">Tabela: {formatCurrency(row.listPrice)}</span>
                                        </div>
                                    </TableCell>

                                    {/* LOGISTICS */}
                                    {visibleColumns['logistics'] && (
                                        <TableCell className="text-center border-l border-slate-800/50">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs text-slate-400 font-mono">{Math.ceil(row.volumePallets)} pal</span>
                                                <span className="text-[10px] text-blue-500/80 font-mono flex items-center gap-0.5">
                                                    {row.trucks.toFixed(2)} <Truck className="w-2.5 h-2.5" />
                                                </span>
                                            </div>
                                        </TableCell>
                                    )}

                                    {/* VOLUME & RELEASE INPUT */}
                                    <TableCell className="py-2">
                                        <div className="flex items-center justify-center gap-2">
                                            <Input
                                                type="number"
                                                className="h-8 w-20 text-right bg-slate-950 border-slate-800 text-slate-200 text-xs font-mono focus:border-emerald-500/50"
                                                placeholder="0"
                                                value={row.input.volumeValue || ''}
                                                onChange={(e) => handleInput(row.product.codSku, 'volumeValue', parseFloat(e.target.value))}
                                            />
                                            <Select value={row.input.selectedUnit} onValueChange={(v) => handleInput(row.product.codSku, 'selectedUnit', v as any)}>
                                                <SelectTrigger className="h-8 w-[60px] bg-slate-950 border-slate-800 text-[10px] px-1"><SelectValue /></SelectTrigger>
                                                <SelectContent className="bg-slate-950 border-slate-800"><SelectItem value="CX">CX</SelectItem><SelectItem value="HL">HL</SelectItem></SelectContent>
                                            </Select>
                                        </div>
                                    </TableCell>

                                    {/* AVAILABLE (READ ONLY) */}
                                    {visibleColumns['inv_avail'] && (
                                        <TableCell className="text-right border-l border-slate-800/50">
                                            <div className="text-xs font-mono text-slate-400">{formatDecimal(row.unitInvAvailable)}</div>
                                        </TableCell>
                                    )}

                                    {/* RELEASED (INPUT) */}
                                    {visibleColumns['inv_released'] && (
                                        <TableCell className="py-2 border-l border-slate-800/50">
                                            <div className="flex items-center justify-center">
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1.5 text-[10px] text-slate-500">R$</span>
                                                    <Input
                                                        type="number"
                                                        className={`h-8 w-24 text-right pl-6 font-mono text-xs transition-all ${row.unitInvReleased > row.unitInvAvailable ? 'border-amber-500/50 bg-amber-500/5 text-amber-200' : 'bg-slate-950 border-slate-800 text-emerald-300'}`}
                                                        placeholder={row.listPrice.toFixed(2)}
                                                        value={row.input.promoPrice || ''}
                                                        onChange={(e) => handleInput(row.product.codSku, 'promoPrice', parseFloat(e.target.value))}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-center mt-1">
                                                <span className="text-[10px] text-slate-600 font-mono">
                                                    Lib: {formatDecimal(row.unitInvReleased)}
                                                </span>
                                            </div>
                                        </TableCell>
                                    )}

                                    {/* TOTAL GENERATED */}
                                    {visibleColumns['inv_total'] && (
                                        <TableCell className="text-right border-l border-slate-800/50">
                                            <div className="text-sm font-mono font-medium text-amber-400">{formatCurrency(row.totalInvGenerated)}</div>
                                        </TableCell>
                                    )}

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

        </div>
    );
}
