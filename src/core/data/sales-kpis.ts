export interface SKUPerformance {
    sku: string;
    brand: string;
    targetVol: number; // Meta em HL
    actualVol: number; // Realizado em HL
    universe: number; // Total de clientes na carteira
    positive: number; // Clientes positivados (com compra)
    lastMonth: number; // Volume mês anterior
    isPriority?: boolean; // NEW: Focus item
}

export const SALES_KPIS_MOCK: SKUPerformance[] = [
    {
        sku: "Heineken 600ml",
        brand: "Heineken",
        targetVol: 12500,
        actualVol: 11800,
        universe: 145,
        positive: 142,
        lastMonth: 12100,
        isPriority: true
    },
    {
        sku: "Heineken Lata 350ml",
        brand: "Heineken",
        targetVol: 8500,
        actualVol: 9200, // Over-performance
        universe: 145,
        positive: 138,
        lastMonth: 8000
    },
    {
        sku: "Amstel 600ml",
        brand: "Amstel",
        targetVol: 15000,
        actualVol: 13200,
        universe: 145,
        positive: 115, // Gap de positivação
        lastMonth: 14000,
        isPriority: true
    },
    {
        sku: "Amstel Lata 473ml",
        brand: "Amstel",
        targetVol: 6000,
        actualVol: 4500,
        universe: 145,
        positive: 98, // Critical gap
        lastMonth: 5800,
        isPriority: true
    },
    {
        sku: "Devassa 600ml",
        brand: "Devassa",
        targetVol: 5000,
        actualVol: 5100,
        universe: 145,
        positive: 105,
        lastMonth: 4900
    },
    {
        sku: "Eisenbahn 600ml",
        brand: "Eisenbahn",
        targetVol: 3500,
        actualVol: 3100,
        universe: 145,
        positive: 88,
        lastMonth: 3400,
        isPriority: true
    }
];

// SALES KPI MOCK DATA
// Aligned with "One Page" BI Report - Power BI Replica

export const ORDER_PIPELINE = {
    // Left Block
    real: 19823,      // Real (Sold)
    carteira: 13004,  // Carteira (Backlog)

    // Breakdown (Mês Atual)
    status: {
        pendente: 1096,
        carteira: 335,
        programado: 11573
    },

    // Right Block (References)
    metaOff: 40937,
    targetSOP: 41817,
    salesLY: 25792,
}

export const GENERAL_KPIS = {
    // Projeção (Real + Carteira)
    projection: ORDER_PIPELINE.real + ORDER_PIPELINE.carteira,

    // ROW 1: REAL vs Targets (Current Status)
    realVsMeta: (ORDER_PIPELINE.real / ORDER_PIPELINE.metaOff) * 100,
    realVsSOP: (ORDER_PIPELINE.real / ORDER_PIPELINE.targetSOP) * 100,
    realVsLY: (ORDER_PIPELINE.real / ORDER_PIPELINE.salesLY) * 100,

    // ROW 2: PROJECTION (Real + Carteira) vs Targets (Forecast Status)
    projVsMeta: ((ORDER_PIPELINE.real + ORDER_PIPELINE.carteira) / ORDER_PIPELINE.metaOff) * 100,
    projVsSOP: ((ORDER_PIPELINE.real + ORDER_PIPELINE.carteira) / ORDER_PIPELINE.targetSOP) * 100,
    projVsLY: ((ORDER_PIPELINE.real + ORDER_PIPELINE.carteira) / ORDER_PIPELINE.salesLY) * 100,
};
