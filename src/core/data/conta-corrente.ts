/**
 * REAL CONTA CORRENTE DATA - from Conta corrente - PR.xlsx
 */

export interface Fundo {
  mes: number;
  idFundo2025: number;
  descricaoFundo: string;
  gerado: number;
  gasto: number;
  esturoSalving: number;
  saldo: number;
}

export const FUNDOS: Fundo[] = [
  {
    "mes": 45717,
    "idFundo2025": 9436,
    "descricaoFundo": "TPR OFF - PR",
    "gerado": 178735,
    "gasto": 10168539,
    "esturoSalving": 0,
    "saldo": -9989804
  },
  {
    "mes": 45748,
    "idFundo2025": 9436,
    "descricaoFundo": "TPR OFF - PR",
    "gerado": 4106877.638772948,
    "gasto": 3031578.12,
    "esturoSalving": 1075299.518772948,
    "saldo": -8914504.481227051
  },
  {
    "mes": 45778,
    "idFundo2025": 9436,
    "descricaoFundo": "TPR OFF - PR",
    "gerado": 4113253.9520599223,
    "gasto": 3180546.14,
    "esturoSalving": 932707.8120599221,
    "saldo": -7981796.669167129
  },
  {
    "mes": 45809,
    "idFundo2025": 9436,
    "descricaoFundo": "TPR OFF - PR",
    "gerado": 3731344.5049047875,
    "gasto": 8272166.147487001,
    "esturoSalving": -4540821.6425822135,
    "saldo": -12522618.311749343
  },
  {
    "mes": 45839,
    "idFundo2025": 9436,
    "descricaoFundo": "TPR OFF - PR",
    "gerado": 3536235.3961783536,
    "gasto": 2732772.5599999996,
    "esturoSalving": 803462.836178354,
    "saldo": -11719155.475570988
  },
  {
    "mes": 45870,
    "idFundo2025": 9436,
    "descricaoFundo": "TPR OFF - PR",
    "gerado": 1630310.383343305,
    "gasto": 1294919.68,
    "esturoSalving": 335390.70334330504,
    "saldo": -11383764.772227682
  },
  {
    "mes": 45901,
    "idFundo2025": 9436,
    "descricaoFundo": "TPR OFF - PR",
    "gerado": 4470196.38,
    "gasto": 4354926.71,
    "esturoSalving": 115269.66999999993,
    "saldo": -9755510.05
  }
];

// Summary stats
export const CONTA_CORRENTE_STATS = {
  regional: "PR",
  totalAcordos: 2434,
  totalApuracoes: 28546,
  totalFundos: 7,
};

// Verbas raw data
export const VERBAS_RAW = [
  {
    "2025": "Soma de TPR Calendário",
    "Anos (MÊS)": "Rótulos de Linha"
  },
  {
    "2025": 2553704.8839616366,
    "Anos (MÊS)": "Ariadne Garcia"
  },
  {
    "2025": 6484857.910292678,
    "Anos (MÊS)": "Camila Vieira"
  },
  {
    "2025": 4514632.672859778,
    "Anos (MÊS)": "Emerson Taubenhein Frey"
  },
  {
    "2025": 4309750.7,
    "Anos (MÊS)": "Extra"
  },
  {
    "2025": 7975756.326567817,
    "Anos (MÊS)": "Fabiana Bollis"
  },
  {
    "2025": 2138079.881016366,
    "Anos (MÊS)": "TBD"
  },
  {
    "2025": 1161254.955240198,
    "Anos (MÊS)": "Victor Hugo Barbosa"
  },
  {
    "2025": 1031190.9387999981,
    "Anos (MÊS)": "Victor Vaqueiro"
  },
  {
    "2025": 30169228.26873847,
    "Anos (MÊS)": "Total Geral"
  }
];

export function getFundoById(id: string | number): Fundo | undefined {
  return FUNDOS.find(f => String(f.idFundo2025) === String(id));
}

export function getTotalGerado(): number {
  return FUNDOS.reduce((sum, f) => sum + f.gerado, 0);
}

export function getTotalGasto(): number {
  return FUNDOS.reduce((sum, f) => sum + f.gasto, 0);
}

export function getTotalSaldo(): number {
  return FUNDOS.reduce((sum, f) => sum + f.saldo, 0);
}

// --- MOCK TRANSACTION DATA FOR DEEP DIVES ---

export interface Transaction {
  id: string;
  date: string; // ISO Date 2025-01-15
  executive: string;
  regional: string; // NEW: Regional Heineken
  network: string; // Rede
  type: "Contrato" | "Verba Extra" | "Fechamento" | "Ação Pontual";
  value: number; // Positive = Budget, Negative = Spend
  status: "planned" | "executed";
}

// Map Executives to Regionals
const EXEC_REGIONAL_MAP: Record<string, string> = {
  "Ariadne Garcia": "SUL",
  "Camila Vieira": "SP CAPITAL",
  "Emerson Taubenhein Frey": "SUL",
  "Fabiana Bollis": "SP INTERIOR",
  "Victor Hugo Barbosa": "NE",
  "Victor Vaqueiro": "SP CAPITAL"
};

// Generate deterministic mock data based on our existing totals
export const TRANSACTIONS_MOCK: Transaction[] = [];

const EXECUTIVES = Object.keys(EXEC_REGIONAL_MAP);

const NETWORKS = [
  "Angeloni", "Muffato", "Condor", "Festval", "Supermercados BH",
  "Verdemar", "Carrefour", "Pão de Açúcar"
];

const TYPES = [
  "Contrato", "Contrato", "Contrato", // Higher weight
  "Verba Extra", "Fechamento", "Ação Pontual"
];

// Helper to generate consistent random numbers
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Populate Mock
let seed = 123;
for (let i = 0; i < 450; i++) { // 450 transactions
  const execIndex = Math.floor(pseudoRandom(seed++) * EXECUTIVES.length);
  const executive = EXECUTIVES[execIndex];
  const regional = EXEC_REGIONAL_MAP[executive];
  const netIndex = Math.floor(pseudoRandom(seed++) * NETWORKS.length);
  const typeIndex = Math.floor(pseudoRandom(seed++) * TYPES.length);
  const month = Math.floor(pseudoRandom(seed++) * 12) + 1;
  const day = Math.floor(pseudoRandom(seed++) * 28) + 1;

  // Value distribution
  let value = (pseudoRandom(seed++) * 5000) + 1000;
  if (TYPES[typeIndex] === "Contrato") value *= 5; // Contracts are bigger

  // 80% chance of being SEND (Negative), 20% Budget Injection (Positive)
  const isSpend = pseudoRandom(seed++) > 0.1;

  TRANSACTIONS_MOCK.push({
    id: `TRX-${1000 + i}`,
    date: `2025-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    executive,
    regional,
    network: NETWORKS[netIndex],
    type: TYPES[typeIndex] as any,
    value: isSpend ? -value : value,
    status: month < 6 ? "executed" : "planned"
  });
}

// --- DATA ACCESS HELPERS ---

export function getTransactions(filters: { executive?: string; month?: string; type?: string; regional?: string }) {
  return TRANSACTIONS_MOCK.filter(t => {
    if (filters.regional && filters.regional !== "ALL" && t.regional !== filters.regional) return false;
    if (filters.executive && filters.executive !== "ALL" && t.executive !== filters.executive) return false;
    if (filters.month && filters.month !== "ALL") {
      // Mock month filter logic (e.g. "2025-01")
      if (!t.date.startsWith(filters.month)) return false;
    }
    if (filters.type && filters.type !== "ALL" && t.type !== filters.type) return false;
    return true;
  });
}

export function getAggregatedByNetwork(filteredData: Transaction[]) {
  const map = new Map<string, number>();
  filteredData.forEach(t => {
    if (t.value < 0) { // Only count spending
      const current = map.get(t.network) || 0;
      map.set(t.network, current + Math.abs(t.value));
    }
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getAggregatedByType(filteredData: Transaction[]) {
  const map = new Map<string, number>();
  filteredData.forEach(t => {
    if (t.value < 0) { // Only count spending
      const current = map.get(t.type) || 0;
      map.set(t.type, current + Math.abs(t.value));
    }
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
