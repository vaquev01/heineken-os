const XLSX = require('xlsx');
const fs = require('fs');

console.log('='.repeat(80));
console.log('FULL DATA EXTRACTION FROM ALL 5 EXCEL FILES');
console.log('='.repeat(80));

// ============================================================================
// 1. PALETIZAÇÃO ATUAL DEZ-25.xlsx
// ============================================================================
console.log('\n1. PALETIZAÇÃO ATUAL DEZ-25.xlsx');
console.log('-'.repeat(50));
const palWb = XLSX.readFile('./data_samples/PALETIZAÇÃO ATUAL DEZ-25.xlsx');
console.log('Sheets:', palWb.SheetNames);
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
        hlPac: row['HL/PAC'] || 0,
        hlPallet: row['HL/PALLET'] || 0,
    }));
console.log('Products:', products.length);

// ============================================================================
// 2. CALENDÁRIO/LIBERAÇÃO
// ============================================================================
console.log('\n2. 20251223_Liberação Jan+Fev\'26.xlsx');
console.log('-'.repeat(50));
const calWb = XLSX.readFile("./data_samples/20251223_Liberação Jan+Fev'26.xlsx");
console.log('Sheets:', calWb.SheetNames);
const calSheet = calWb.Sheets[calWb.SheetNames[0]];
const calData = XLSX.utils.sheet_to_json(calSheet, { defval: '' });
const calendar = calData
    .filter(row => row['__EMPTY_1'] && row['__EMPTY_1'] !== 'Diretoria' && row['__EMPTY_1'] !== '')
    .map(row => ({
        diretoria: row['__EMPTY_1'],
        regional: row['__EMPTY_2'],
        uf: row['__EMPTY_3'],
        marca: row['__EMPTY_4'],
        embalagem: row['__EMPTY_5'],
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
console.log('Calendar entries:', calendar.length);

// ============================================================================
// 3. TABELA DE PREÇOS
// ============================================================================
console.log('\n3. Tabela de preços.xlsx');
console.log('-'.repeat(50));
const priceWb = XLSX.readFile('./data_samples/Tabela de preços.xlsx');
console.log('Sheets:', priceWb.SheetNames);
const priceSheet = priceWb.Sheets[priceWb.SheetNames[0]];
const priceData = XLSX.utils.sheet_to_json(priceSheet, { defval: '' });
console.log('First row keys:', Object.keys(priceData[0] || {}));
console.log('Sample row:', JSON.stringify(priceData[0], null, 2));
console.log('Total rows:', priceData.length);

// ============================================================================
// 4. SIMULADOR DE PROPOSTA ASSAÍ
// ============================================================================
console.log('\n4. SIMULADOR DE PROPOSTA ASSAÍ Outubro\'25.xlsx');
console.log('-'.repeat(50));
const simWb = XLSX.readFile("./data_samples/SIMULADOR DE PROPOSTA ASSAÍ Outubro'25.xlsx");
console.log('Sheets:', simWb.SheetNames);
simWb.SheetNames.forEach(name => {
    const sheet = simWb.Sheets[name];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    console.log(`  Sheet "${name}": ${data.length} rows`);
    if (data.length > 0) {
        console.log('    First row keys:', Object.keys(data[0]).slice(0, 10));
    }
});

// ============================================================================
// 5. CONTA CORRENTE - PR
// ============================================================================
console.log('\n5. Conta corrente - PR.xlsx');
console.log('-'.repeat(50));
const ccWb = XLSX.readFile('./data_samples/Conta corrente - PR.xlsx');
console.log('Sheets:', ccWb.SheetNames);
ccWb.SheetNames.forEach(name => {
    const sheet = ccWb.Sheets[name];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    console.log(`  Sheet "${name}": ${data.length} rows`);
    if (data.length > 0 && data.length < 1000) {
        console.log('    First row keys:', Object.keys(data[0]).slice(0, 10));
    }
});

console.log('\n' + '='.repeat(80));
console.log('EXTRACTION COMPLETE');
console.log('='.repeat(80));
