"use client";

import { useDataStore } from "@/core/store/data-store";
import { useEffect } from "react";
import { BiOnePage } from "@/components/dashboard/BiOnePage";
import { PositivationCards } from "@/components/dashboard/PositivationCards";
import { QuotaTable } from "@/components/dashboard/QuotaTable";
import { ORDER_PIPELINE, GENERAL_KPIS, SALES_KPIS_MOCK } from "@/core/data/sales-kpis";
import { Target, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { fetchData, isLoading } = useDataStore();

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">

      {/* HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Sales Control Center</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-slate-400 text-sm">Visão Executiva de Fechamento (One Page)</p>
            <div className="bg-emerald-950/30 border border-emerald-900/50 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Online
            </div>
          </div>
        </div>

        <Button
          onClick={() => fetchData()}
          disabled={isLoading}
          variant="outline"
          className="border-slate-800 bg-slate-900/50 text-slate-300 hover:bg-slate-800"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Dados
        </Button>
      </div>

      {/* COMPONENT 1: BI ONE PAGE HEADER (KPI BOARD) */}
      <section>
        <BiOnePage data={ORDER_PIPELINE} kpis={GENERAL_KPIS} />
      </section>

      {/* COMPONENT 2: EXECUTION QUALITY (POSITIVATION) */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">Qualidade de Execução</h2>
        </div>
        {/* Passing showOnlyPriority as default true for executive view */}
        <PositivationCards data={SALES_KPIS_MOCK} showOnlyPriority={true} />
      </section>

      {/* COMPONENT 3: QUOTA ACHIEVEMENT */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-semibold text-white">Atingimento de Cota (Volume)</h2>
        </div>
        <QuotaTable data={SALES_KPIS_MOCK} />
      </section>

    </div>
  );
}
