/**
 * CALCULATION SERVICE
 * ===================
 * Motor de cálculo para o Simulador de Negociação.
 * Todas as fórmulas do Excel replicadas aqui.
 */

// Product with conversion coefficients
export interface ProductSKU {
    sku: string;
    name: string;
    pack: string;
    priceList: number;      // Preço Lista (R$/caixa)
    hlPerPack: number;      // Coeficiente HL/PAC (from Paletização)
    palletCapacity: number; // Caixas por palete
    ratePerHL: number;      // R$/HL base (from Calendário)
}

// Line item in the proposal
export interface ProposalLine {
    sku: string;
    volumeCaixas: number;   // Input: Quantity in boxes
    promoPrice: number;     // Input: Promotional price
}

// Calculated result for a line
export interface CalculatedLine extends ProposalLine {
    volumeHL: number;           // Caixas × hlPerPack
    discount: number;           // (priceList - promoPrice) / priceList × 100
    investmentGenerated: number; // volumeHL × ratePerHL
    margin: number;             // (promoPrice - cost) / promoPrice × 100
    pallets: number;            // volumeCaixas / palletCapacity
}

// Summary totals
export interface ProposalSummary {
    totalCaixas: number;
    totalHL: number;
    totalInvestment: number;
    avgDiscount: number;
    avgMargin: number;
    totalPallets: number;
    truckLoad: number; // pallets / 24 (standard truck)
}

/**
 * Calculate all derived values for a proposal line
 */
export function calculateLine(
    product: ProductSKU,
    input: ProposalLine
): CalculatedLine {
    const volumeHL = input.volumeCaixas * product.hlPerPack;

    const discount = product.priceList > 0
        ? ((product.priceList - input.promoPrice) / product.priceList) * 100
        : 0;

    const investmentGenerated = volumeHL * product.ratePerHL;

    // Simplified margin calculation (cost assumed as 70% of list price)
    const estimatedCost = product.priceList * 0.70;
    const margin = input.promoPrice > 0
        ? ((input.promoPrice - estimatedCost) / input.promoPrice) * 100
        : 0;

    const pallets = product.palletCapacity > 0
        ? input.volumeCaixas / product.palletCapacity
        : 0;

    return {
        ...input,
        volumeHL: Math.round(volumeHL * 100) / 100,
        discount: Math.round(discount * 10) / 10,
        investmentGenerated: Math.round(investmentGenerated * 100) / 100,
        margin: Math.round(margin * 10) / 10,
        pallets: Math.round(pallets * 10) / 10,
    };
}

/**
 * Calculate summary totals for the entire proposal
 */
export function calculateSummary(
    products: ProductSKU[],
    lines: CalculatedLine[]
): ProposalSummary {
    const totalCaixas = lines.reduce((sum, l) => sum + l.volumeCaixas, 0);
    const totalHL = lines.reduce((sum, l) => sum + l.volumeHL, 0);
    const totalInvestment = lines.reduce((sum, l) => sum + l.investmentGenerated, 0);
    const totalPallets = lines.reduce((sum, l) => sum + l.pallets, 0);

    const linesWithVolume = lines.filter(l => l.volumeCaixas > 0);
    const avgDiscount = linesWithVolume.length > 0
        ? linesWithVolume.reduce((sum, l) => sum + l.discount, 0) / linesWithVolume.length
        : 0;
    const avgMargin = linesWithVolume.length > 0
        ? linesWithVolume.reduce((sum, l) => sum + l.margin, 0) / linesWithVolume.length
        : 0;

    return {
        totalCaixas,
        totalHL: Math.round(totalHL * 100) / 100,
        totalInvestment: Math.round(totalInvestment * 100) / 100,
        avgDiscount: Math.round(avgDiscount * 10) / 10,
        avgMargin: Math.round(avgMargin * 10) / 10,
        totalPallets: Math.round(totalPallets * 10) / 10,
        truckLoad: Math.round((totalPallets / 24) * 100), // % truck capacity
    };
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/**
 * Format number with decimals
 */
export function formatNumber(value: number, decimals: number = 2): string {
    return value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}
