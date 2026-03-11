const XLSX = require('xlsx');
const fs = require('fs');

console.log('='.repeat(80));
console.log('GENERATING ALL DATA MODULES FROM REAL EXCEL FILES');
console.log('='.repeat(80));

// ============================================================================
// 1. PRODUCTS (from PALETIZAÇÃO)
// ============================================================================
console.log('\n1. Creating products.ts from PALETIZAÇÃO...');
const palWb = XLSX.readFile('./data_samples/PALETIZAÇÃO ATUAL DEZ-25.xlsx');
const palSheet = palWb.Sheets[palWb.SheetNames[0]];
const palData = XLSX.utils.sheet_to_json(palSheet, { defval: '' });
const products = palData
    .filter(row => typeof row['Cód. SKU'] === 'number')
    .map(row => ({
        codSku: String(row['Cód. SKU']),
        descricao: row['Descrição do Material'],
        marca: row['Marca'],
        categoria: row['CATEGORIA'],
        lastro: row['Lastro'],
        qtdLastros: row['Qtd Lastros'],
        palete: row['Palete'],
        hlPac: typeof row['HL/PAC'] === 'number' ? row['HL/PAC'] : 0,
        hlPallet: typeof row['HL/PALLET'] === 'number' ? row['HL/PALLET'] : Number(row['HL/PALLET']) || 0,
    }));

const productsTS = `/**
 * REAL PRODUCT DATA - from PALETIZAÇÃO ATUAL DEZ-25.xlsx
 * Total: ${products.length} SKUs
 */

export interface Product {
  codSku: string;
  descricao: string;
  marca: string;
  categoria: string;
  lastro: number;
  qtdLastros: number;
  palete: number;
  hlPac: number;
  hlPallet: number;
}

export const PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

export const BRANDS = [...new Set(PRODUCTS.map(p => p.marca))].sort();
export const CATEGORIES = [...new Set(PRODUCTS.map(p => p.categoria))].sort();

export function getProductBySku(sku: string): Product | undefined {
  return PRODUCTS.find(p => p.codSku === sku);
}

export function getProductsByBrand(brand: string): Product[] {
  return PRODUCTS.filter(p => p.marca.toUpperCase().includes(brand.toUpperCase()));
}
`;
fs.writeFileSync('./src/core/data/products.ts', productsTS);
console.log(`Created products.ts (${products.length} SKUs)`);

// ============================================================================
// 2. CALENDAR (from Liberação)
// ============================================================================
console.log('\n2. Creating calendar.ts from Liberação...');
const calWb = XLSX.readFile("./data_samples/20251223_Liberação Jan+Fev'26.xlsx");
const calSheet = calWb.Sheets[calWb.SheetNames[0]];
const calData = XLSX.utils.sheet_to_json(calSheet, { defval: '' });
const calendar = calData
    .filter(row => row['__EMPTY_1'] && row['__EMPTY_1'] !== 'Diretoria' && row['__EMPTY_1'] !== '')
    .map(row => ({
        diretoria: String(row['__EMPTY_1']),
        regional: String(row['__EMPTY_2']),
        uf: String(row['__EMPTY_3']),
        marca: String(row['__EMPTY_4']),
        embalagem: String(row['__EMPTY_5']),
        volCompromissoJan: Number(row['__EMPTY_6']) || 0,
        volCompromissoFev: Number(row['__EMPTY_7']) || 0,
        ttcLista: Number(row['Política Comercial']) || 0,
        ttcPromo: Number(row['__EMPTY_8']) || 0,
        pressao: Number(row['__EMPTY_9']) || 0,
        ttcMedPolitica: Number(row['__EMPTY_10']) || 0,
        novoTtcPromo: Number(row['Política Ação']) || 0,
        pressaoNova: Number(row['__EMPTY_11']) || 0,
        novoTtcMed: Number(row['__EMPTY_12']) || 0,
        tprRsHlExtra: Number(row['__EMPTY_13']) || 0,
    }));

const diretorias = [...new Set(calendar.map(c => c.diretoria))].filter(Boolean);
const regionais = [...new Set(calendar.map(c => c.regional))].filter(Boolean);
const ufs = [...new Set(calendar.map(c => c.uf))].filter(Boolean);
const marcasCalendario = [...new Set(calendar.map(c => c.marca))].filter(Boolean);

const calendarTS = `/**
 * REAL CALENDAR DATA - from 20251223_Liberação Jan+Fev'26.xlsx
 * Total: ${calendar.length} entries
 */

export interface CalendarEntry {
  diretoria: string;
  regional: string;
  uf: string;
  marca: string;
  embalagem: string;
  volCompromissoJan: number;
  volCompromissoFev: number;
  ttcLista: number;
  ttcPromo: number;
  pressao: number;
  ttcMedPolitica: number;
  novoTtcPromo: number;
  pressaoNova: number;
  novoTtcMed: number;
  tprRsHlExtra: number;
}

export const CALENDAR: CalendarEntry[] = ${JSON.stringify(calendar, null, 2)};

export const DIRETORIAS = ${JSON.stringify(diretorias)};
export const REGIONAIS = ${JSON.stringify(regionais)};
export const UFS = ${JSON.stringify(ufs)};
export const MARCAS_CALENDARIO = ${JSON.stringify(marcasCalendario)};

export function getCalendarByUf(uf: string): CalendarEntry[] {
  return CALENDAR.filter(c => c.uf === uf);
}

export function getCalendarByDiretoria(diretoria: string): CalendarEntry[] {
  return CALENDAR.filter(c => c.diretoria === diretoria);
}

export function getCalendarByMarca(marca: string): CalendarEntry[] {
  return CALENDAR.filter(c => c.marca === marca);
}
`;
fs.writeFileSync('./src/core/data/calendar.ts', calendarTS);
console.log(`Created calendar.ts (${calendar.length} entries)`);

// ============================================================================
// 3. PRICE TABLE (from Tabela de Preços) - SAMPLED for performance
// ============================================================================
console.log('\n3. Creating price-table.ts from Tabela de Preços...');
const priceWb = XLSX.readFile('./data_samples/Tabela de preços.xlsx');
const priceSheet = priceWb.Sheets[priceWb.SheetNames[0]];
const priceData = XLSX.utils.sheet_to_json(priceSheet, { defval: '' });

// Extract unique values for dropdowns
const canais = [...new Set(priceData.map(r => r['Canal']))].filter(Boolean);
const redes = [...new Set(priceData.map(r => r['REDE']))].filter(Boolean);
const priceUfs = [...new Set(priceData.map(r => r['UF']))].filter(Boolean);
const tributacoes = [...new Set(priceData.map(r => r['Tributação']))].filter(Boolean);

// Sample first 500 rows for in-memory use (full data is 150K rows)
const priceSample = priceData.slice(0, 500).map(row => ({
    canal: row['Canal'],
    orgVenda: row['Org Venda'],
    centro: row['Centro'],
    uf: row['UF'],
    listaPrecos: row['Lista Preços'],
    rede: row['REDE'],
    tributacao: row['Tributação'],
    materialRef: String(row['MATERIAL REFERÊNCIA']),
    descMaterial: row['DESC. MATERIAL'],
    split: row['Split'],
    unidadeMedida: row['Unidade medida'],
    pis: row['PIS'],
    cofins: row['COFINS'],
    icms: row['ICMS'],
    icmsFecop: row['ICMS FECOP'],
    liquido: row['LÍQUIDO'],
    descZf: row['DESC. ZF'],
    ipi: row['IPI'],
    icmsSt: row['ICMS-ST'],
    icmsStFecop: row['ICMS ST FECOP'],
    total: row['TOTAL'],
}));

const priceTableTS = `/**
 * REAL PRICE TABLE DATA - from Tabela de preços.xlsx
 * Total in file: 150,002 rows
 * Sample loaded: ${priceSample.length} rows (for performance)
 */

export interface PriceEntry {
  canal: string;
  orgVenda: string;
  centro: string;
  uf: string;
  listaPrecos: string;
  rede: string;
  tributacao: string;
  materialRef: string;
  descMaterial: string;
  split: string;
  unidadeMedida: string;
  pis: number;
  cofins: number;
  icms: number;
  icmsFecop: number;
  liquido: number;
  descZf: number;
  ipi: number;
  icmsSt: number;
  icmsStFecop: number;
  total: number;
}

// Sample data for UI (full table has 150K rows)
export const PRICE_TABLE_SAMPLE: PriceEntry[] = ${JSON.stringify(priceSample, null, 2)};

// Unique filter values from FULL dataset
export const CANAIS = ${JSON.stringify(canais)};
export const REDES = ${JSON.stringify(redes.slice(0, 100))};  // Top 100
export const PRICE_UFS = ${JSON.stringify(priceUfs)};
export const TRIBUTACOES = ${JSON.stringify(tributacoes)};

export const TOTAL_PRICE_ROWS = 150002;

export function searchPrices(uf?: string, rede?: string, material?: string): PriceEntry[] {
  return PRICE_TABLE_SAMPLE.filter(p => {
    if (uf && p.uf !== uf) return false;
    if (rede && p.rede !== rede) return false;
    if (material && !p.descMaterial.toUpperCase().includes(material.toUpperCase())) return false;
    return true;
  });
}
`;
fs.writeFileSync('./src/core/data/price-table.ts', priceTableTS);
console.log(`Created price-table.ts (${priceSample.length} sample rows, ${priceData.length} total)`);

// ============================================================================
// 4. SIMULADOR ASSAÍ (from Simulador de Proposta)
// ============================================================================
console.log('\n4. Creating simulador-assai.ts from Simulador...');
const simWb = XLSX.readFile("./data_samples/SIMULADOR DE PROPOSTA ASSAÍ Outubro'25.xlsx");

// Extract Fábricas
const fabricasSheet = simWb.Sheets['Fábricas'];
const fabricasData = XLSX.utils.sheet_to_json(fabricasSheet, { defval: '' });
const fabricas = fabricasData.map(row => ({
    fabrica: row[' Fábrica '],
    ordemVendas: row[' Ordem de vendas '],
    razaoSocial: row[' Razão Social '],
    cnpj: row[' Cnpj '],
    inscricaoEstadualSt: row[' Inscrição Estadual St '],
    endereco: row[' Endereço '],
    numero: row[' N '],
    bairro: row[' Bairro '],
    cep: row[' CEP '],
    cidade: row[' Cidade '],
}));

// Extract Proposta Assaí (main proposal data)
const propostaSheet = simWb.Sheets["Proposta Assaí Outubro'25"];
const propostaData = XLSX.utils.sheet_to_json(propostaSheet, { defval: '', range: 3 }); // Skip header rows

// Extract investment summary
const investSheet = simWb.Sheets['Planilha4'];
const investData = XLSX.utils.sheet_to_json(investSheet, { defval: '' });

const simuladorTS = `/**
 * REAL SIMULADOR DATA - from SIMULADOR DE PROPOSTA ASSAÍ Outubro'25.xlsx
 */

export interface Fabrica {
  fabrica: string;
  ordemVendas: string;
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadualSt: string;
  endereco: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
}

export const FABRICAS: Fabrica[] = ${JSON.stringify(fabricas, null, 2)};

// Investment summary
export const INVESTIMENTOS = ${JSON.stringify(investData, null, 2)};

// Cliente info
export const CLIENTE_ASSAI = {
  nome: "ASSAÍ",
  periodo: "Outubro 2025",
  totalProposta: ${propostaData.length} // rows
};
`;
fs.writeFileSync('./src/core/data/simulador-assai.ts', simuladorTS);
console.log(`Created simulador-assai.ts (${fabricas.length} fábricas)`);

// ============================================================================
// 5. CONTA CORRENTE PR (from Conta corrente)
// ============================================================================
console.log('\n5. Creating conta-corrente.ts from Conta Corrente PR...');
const ccWb = XLSX.readFile('./data_samples/Conta corrente - PR.xlsx');

// Extract Fundos (main fund balances)
const fundosSheet = ccWb.Sheets['Fundos'];
const fundosData = XLSX.utils.sheet_to_json(fundosSheet, { defval: '' });
const fundos = fundosData.map(row => ({
    mes: row['MÊS'],
    idFundo2025: row['ID FUNDO 2025'],
    descricaoFundo: row['DESCRIÇÃO FUNDO'],
    gerado: Number(row['Gerado']) || 0,
    gasto: Number(row['Gasto']) || 0,
    esturoSalving: Number(row['Estouro/Salving']) || 0,
    saldo: Number(row['Saldo']) || 0,
}));

// Extract Verbas summary
const verbasSheet = ccWb.Sheets['Verbas'];
const verbasData = XLSX.utils.sheet_to_json(verbasSheet, { defval: '' });

// Extract BaseAcordos summary (just count)
const acordosSheet = ccWb.Sheets['BaseAcordos'];
const acordosData = XLSX.utils.sheet_to_json(acordosSheet, { defval: '' });

// Extract Apuração summary (just count)
const apuracaoSheet = ccWb.Sheets['Apuração'];
const apuracaoData = XLSX.utils.sheet_to_json(apuracaoSheet, { defval: '' });

const contaCorrenteTS = `/**
 * REAL CONTA CORRENTE DATA - from Conta corrente - PR.xlsx
 */

export interface Fundo {
  mes: string;
  idFundo2025: string;
  descricaoFundo: string;
  gerado: number;
  gasto: number;
  esturoSalving: number;
  saldo: number;
}

export const FUNDOS: Fundo[] = ${JSON.stringify(fundos, null, 2)};

// Summary stats
export const CONTA_CORRENTE_STATS = {
  regional: "PR",
  totalAcordos: ${acordosData.length},
  totalApuracoes: ${apuracaoData.length},
  totalFundos: ${fundos.length},
};

// Verbas raw data
export const VERBAS_RAW = ${JSON.stringify(verbasData, null, 2)};

export function getFundoById(id: string): Fundo | undefined {
  return FUNDOS.find(f => f.idFundo2025 === id);
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
`;
fs.writeFileSync('./src/core/data/conta-corrente.ts', contaCorrenteTS);
console.log(`Created conta-corrente.ts (${fundos.length} fundos, ${acordosData.length} acordos)`);

console.log('\n' + '='.repeat(80));
console.log('ALL DATA MODULES CREATED SUCCESSFULLY');
console.log('='.repeat(80));
console.log(`
Summary:
1. products.ts       - ${products.length} SKUs from Paletização
2. calendar.ts       - ${calendar.length} entries from Liberação  
3. price-table.ts    - ${priceSample.length} sample (150K total) from Tabela de Preços
4. simulador-assai.ts - ${fabricas.length} fábricas from Simulador
5. conta-corrente.ts - ${fundos.length} fundos, ${acordosData.length} acordos from Conta Corrente
`);
