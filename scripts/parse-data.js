const XLSX = require('xlsx');
const fs = require('fs');

// === PARSE PALETIZAÇÃO ===
console.log('=== GENERATING PALETIZAÇÃO DATA ===');
const palWb = XLSX.readFile('./data_samples/PALETIZAÇÃO ATUAL DEZ-25.xlsx');
const palSheet = palWb.Sheets[palWb.SheetNames[0]];
const palData = XLSX.utils.sheet_to_json(palSheet, { defval: '' });

// Filter out header rows (those where Cód. SKU is text or empty)
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
        hlPac: row['HL/PAC'],
        hlPallet: row['HL/PALLET'],
    }));

console.log('Products extracted:', products.length);

// Generate TypeScript file
const productsTS = `/**
 * REAL PRODUCT DATA - from PALETIZAÇÃO ATUAL DEZ-25.xlsx
 * Auto-generated from real Heineken data
 */

export interface Product {
  codSku: string;
  descricao: string;
  marca: string;
  categoria: string;
  lastro: number;
  qtdLastros: number;
  palete: number;
  hlPac: number;     // HL per box (Caixa)
  hlPallet: number;  // HL per pallet
}

export const PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};

// Helper: Get product by SKU
export function getProductBySku(sku: string): Product | undefined {
  return PRODUCTS.find(p => p.codSku === sku);
}

// Helper: Get products by brand
export function getProductsByBrand(brand: string): Product[] {
  return PRODUCTS.filter(p => p.marca.toUpperCase() === brand.toUpperCase());
}

// Unique brands
export const BRANDS = [...new Set(PRODUCTS.map(p => p.marca))].sort();

// Unique categories
export const CATEGORIES = [...new Set(PRODUCTS.map(p => p.categoria))].sort();
`;

fs.writeFileSync('./src/core/data/products.ts', productsTS);
console.log('Created: src/core/data/products.ts');

// === PARSE CALENDÁRIO ===
console.log('\n=== GENERATING CALENDÁRIO DATA ===');
const calWb = XLSX.readFile('./data_samples/20251223_Liberação Jan+Fev\'26.xlsx');
const calSheet = calWb.Sheets[calWb.SheetNames[0]];
const calData = XLSX.utils.sheet_to_json(calSheet, { defval: '' });

// Map the weird column names to real ones
const calendar = calData
    .filter(row => row['__EMPTY_1'] && row['__EMPTY_1'] !== 'Diretoria') // Skip header rows
    .map(row => ({
        diretoria: row['__EMPTY_1'],
        regional: row['__EMPTY_2'],
        uf: row['__EMPTY_3'],
        marca: row['__EMPTY_4'],
        embalagem: row['__EMPTY_5'],
        volCompromissoJan: row['__EMPTY_6'],
        volCompromissoFev: row['__EMPTY_7'],
        ttcLista: row['Política Comercial'],
        ttcPromo: row['__EMPTY_8'],
        pressao: row['__EMPTY_9'],
        ttcMedPolitica: row['__EMPTY_10'],
        novoTtcPromo: row['Política Ação'],
        pressaoNova: row['__EMPTY_11'],
        novoTtcMed: row['__EMPTY_12'],
        tprRsHlExtra: row['__EMPTY_13'],
    }));

console.log('Calendar entries extracted:', calendar.length);

// Get unique values
const diretorias = [...new Set(calendar.map(c => c.diretoria))].filter(Boolean);
const ufs = [...new Set(calendar.map(c => c.uf))].filter(Boolean);
const regionais = [...new Set(calendar.map(c => c.regional))].filter(Boolean);
const marcas = [...new Set(calendar.map(c => c.marca))].filter(Boolean);

console.log('Diretorias:', diretorias);
console.log('Regionais:', regionais);
console.log('UFs:', ufs);
console.log('Marcas:', marcas);

// Generate TypeScript file
const calendarTS = `/**
 * REAL CALENDAR DATA - from 20251223_Liberação Jan+Fev'26.xlsx
 * Auto-generated from real Heineken data
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

// Unique Diretorias
export const DIRETORIAS = ${JSON.stringify(diretorias)};

// Unique Regionais
export const REGIONAIS = ${JSON.stringify(regionais)};

// Unique UFs
export const UFS = ${JSON.stringify(ufs)};

// Unique Marcas in calendar
export const MARCAS_CALENDARIO = ${JSON.stringify(marcas)};

// Get calendar entries by UF
export function getCalendarByUf(uf: string): CalendarEntry[] {
  return CALENDAR.filter(c => c.uf === uf);
}

// Get calendar entries by Diretoria
export function getCalendarByDiretoria(diretoria: string): CalendarEntry[] {
  return CALENDAR.filter(c => c.diretoria === diretoria);
}
`;

fs.writeFileSync('./src/core/data/calendar.ts', calendarTS);
console.log('Created: src/core/data/calendar.ts');

// === GENERATE HIERARCHY from real data ===
console.log('\n=== GENERATING HIERARCHY DATA ===');

// Build hierarchy from real Diretorias/Regionais/UFs
const hierarchyTS = `/**
 * REAL ORGANIZATIONAL HIERARCHY - from Calendário
 * Auto-generated from real Heineken data
 */

export enum RoleLevel {
  EXECUTIVO = 1,
  GERENTE_REGIONAL = 2,
  DIRETOR_DIRETORIA = 3,
  ADMIN = 99,
}

export interface OrgNode {
  id: string;
  name: string;
  email: string;
  role: keyof typeof RoleLevel;
  roleLevel: RoleLevel;
  scope: string;
  parentId: string | null;
  children: string[];
}

// Real Diretorias from data
export const DIRETORIAS = ${JSON.stringify(diretorias)};

// Real Regionais from data  
export const REGIONAIS = ${JSON.stringify(regionais)};

// Real UFs from data
export const UFS = ${JSON.stringify(ufs)};

// Build org hierarchy based on real data structure
export const ORG_HIERARCHY: OrgNode[] = [
  // Admin (top level)
  {
    id: "admin-nacional",
    name: "Admin Nacional",
    email: "admin@heineken.com",
    role: "ADMIN",
    roleLevel: RoleLevel.ADMIN,
    scope: "Nacional",
    parentId: null,
    children: ${JSON.stringify(diretorias.map(d => `dir-${d.toLowerCase().replace(/[^a-z]/g, '')}`))},
  },
  // Diretorias
${diretorias.map(dir => {
    const dirId = `dir-${dir.toLowerCase().replace(/[^a-z]/g, '')}`;
    const regionaisNaDiretoria = [...new Set(calendar.filter(c => c.diretoria === dir).map(c => c.regional))];
    return `  {
    id: "${dirId}",
    name: "Diretor ${dir}",
    email: "diretor.${dir.toLowerCase().replace(/[^a-z]/g, '')}@heineken.com",
    role: "DIRETOR_DIRETORIA",
    roleLevel: RoleLevel.DIRETOR_DIRETORIA,
    scope: "${dir}",
    parentId: "admin-nacional",
    children: ${JSON.stringify(regionaisNaDiretoria.map(r => `reg-${r.toLowerCase().replace(/[^a-z]/g, '')}`))},
  }`;
}).join(',\n')}
];

// Helper functions
export function getUserById(id: string): OrgNode | undefined {
  return ORG_HIERARCHY.find(u => u.id === id);
}

export function getDescendantIds(userId: string): string[] {
  const user = getUserById(userId);
  if (!user) return [];
  
  const descendants: string[] = [];
  function collect(nodeId: string) {
    const node = getUserById(nodeId);
    if (!node) return;
    for (const childId of node.children) {
      descendants.push(childId);
      collect(childId);
    }
  }
  collect(userId);
  return descendants;
}

export function getVisibleUserIds(userId: string): string[] {
  return [userId, ...getDescendantIds(userId)];
}

export function canSeeUser(viewerId: string, targetId: string): boolean {
  if (viewerId === targetId) return true;
  return getDescendantIds(viewerId).includes(targetId);
}

export function getRoleDisplayName(role: keyof typeof RoleLevel): string {
  const names: Record<keyof typeof RoleLevel, string> = {
    EXECUTIVO: "Executivo de Vendas",
    GERENTE_REGIONAL: "Gerente Regional",
    DIRETOR_DIRETORIA: "Diretor de Diretoria",
    ADMIN: "Administrador",
  };
  return names[role] || role;
}
`;

fs.writeFileSync('./src/core/auth/hierarchy.ts', hierarchyTS);
console.log('Created: src/core/auth/hierarchy.ts');

console.log('\n=== DONE! ===');
