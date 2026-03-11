/**
 * DATA FLOW INTEGRITY TESTS
 * =========================
 * Testes de confiabilidade para garantir que os dados fluem corretamente
 * desde os arquivos Excel até o banco de dados.
 * 
 * GOLDEN MASTER: Usamos os arquivos reais do usuário como fonte de verdade.
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { ExcelParser } from '@/core/utils/excel-parser';

// Caminho para os arquivos de teste
const DATA_DIR = path.join(process.cwd(), 'data_samples');

interface TestResult {
    name: string;
    passed: boolean;
    details: string;
    expected?: any;
    actual?: any;
}

const results: TestResult[] = [];

function logResult(result: TestResult) {
    results.push(result);
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
    if (!result.passed) {
        console.log(`   Expected: ${JSON.stringify(result.expected)}`);
        console.log(`   Actual:   ${JSON.stringify(result.actual)}`);
    }
}

// ===========================================
// TEST 1: Paletização - HL/PAC Conversion
// ===========================================
async function testPaletizacao() {
    const filePath = path.join(DATA_DIR, 'PALETIZAÇÃO ATUAL DEZ-25.xlsx');

    if (!fs.existsSync(filePath)) {
        logResult({ name: 'Paletização: File exists', passed: false, details: 'File not found' });
        return;
    }

    logResult({ name: 'Paletização: File exists', passed: true, details: 'OK' });

    const buffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Check if we can find the header columns
    const headerRow = ExcelParser.findHeaderRow(sheet, ['Cód. SKU', 'HL/PAC']);

    logResult({
        name: 'Paletização: Header detection',
        passed: headerRow >= 0,
        details: `Header found at row ${headerRow}`,
        expected: '>= 0',
        actual: headerRow
    });

    // Parse data and validate structure
    const data = XLSX.utils.sheet_to_json(sheet, { range: headerRow });

    logResult({
        name: 'Paletização: Data rows parsed',
        passed: data.length > 0,
        details: `Parsed ${data.length} rows`,
        expected: '> 0',
        actual: data.length
    });

    // Validate a known SKU conversion (spot check)
    const sampleRow = data[0] as any;
    const hasRequiredFields = sampleRow['Cód. SKU'] && sampleRow['HL/PAC'];

    logResult({
        name: 'Paletização: Required fields present',
        passed: hasRequiredFields,
        details: 'Checking Cód. SKU and HL/PAC',
        expected: 'Both fields present',
        actual: `SKU: ${sampleRow['Cód. SKU']}, HL/PAC: ${sampleRow['HL/PAC']}`
    });
}

// ===========================================
// TEST 2: Calendário - Rules Parsing
// ===========================================
async function testCalendario() {
    const filePath = path.join(DATA_DIR, "20251223_Liberação Jan+Fev'26.xlsx");

    if (!fs.existsSync(filePath)) {
        logResult({ name: 'Calendário: File exists', passed: false, details: 'File not found' });
        return;
    }

    logResult({ name: 'Calendário: File exists', passed: true, details: 'OK' });

    const buffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Find the "Ação" sheet
    const sheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('ação')) || workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    logResult({
        name: 'Calendário: Found target sheet',
        passed: !!sheetName,
        details: `Using sheet: ${sheetName}`,
    });

    // Check for anchor columns
    const headerRow = ExcelParser.findHeaderRow(sheet, ['Diretoria', 'Regional', 'UF']);

    logResult({
        name: 'Calendário: Header detection',
        passed: headerRow >= 0,
        details: `Header found at row ${headerRow}`,
    });

    // Parse and validate
    const data = XLSX.utils.sheet_to_json(sheet, { range: headerRow });

    logResult({
        name: 'Calendário: Data rows parsed',
        passed: data.length > 0,
        details: `Parsed ${data.length} rows`,
    });
}

// ===========================================
// TEST 3: Tabela de Preços - Tax Structure
// ===========================================
async function testTabelaPrecos() {
    const filePath = path.join(DATA_DIR, 'Tabela de preços.xlsx');

    if (!fs.existsSync(filePath)) {
        logResult({ name: 'Tabela Preços: File exists', passed: false, details: 'File not found' });
        return;
    }

    logResult({ name: 'Tabela Preços: File exists', passed: true, details: 'OK' });

    const buffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Find Export sheet
    const sheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('export')) || workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    logResult({
        name: 'Tabela Preços: Found target sheet',
        passed: !!sheetName,
        details: `Using sheet: ${sheetName}`,
    });

    // Check for key pricing columns
    const headerRow = ExcelParser.findHeaderRow(sheet, ['MATERIAL', 'LÍQUIDO']);

    logResult({
        name: 'Tabela Preços: Header detection',
        passed: headerRow >= 0,
        details: `Header found at row ${headerRow}`,
    });
}

// ===========================================
// TEST 4: Simulador - Formula Validation
// ===========================================
async function testSimulador() {
    const filePath = path.join(DATA_DIR, "SIMULADOR DE PROPOSTA ASSAÍ Outubro'25.xlsx");

    if (!fs.existsSync(filePath)) {
        logResult({ name: 'Simulador: File exists', passed: false, details: 'File not found' });
        return;
    }

    logResult({ name: 'Simulador: File exists', passed: true, details: 'OK' });

    const buffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Find Proposta sheet
    const sheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('proposta')) || workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    logResult({
        name: 'Simulador: Found target sheet',
        passed: !!sheetName,
        details: `Using sheet: ${sheetName}`,
    });

    // Check for key columns that define the formula structure
    const headerRow = ExcelParser.findHeaderRow(sheet, ['Coeficiente', 'HL Act']);

    logResult({
        name: 'Simulador: Header with formulas detected',
        passed: headerRow >= 0,
        details: `Header found at row ${headerRow}`,
    });

    // Validate the CORE FORMULA: HL = Caixas * Coeficiente
    const data = XLSX.utils.sheet_to_json(sheet, { range: headerRow }) as any[];

    if (data.length > 0) {
        const sample = data.find((r: any) => r['Em caixas'] && r['Coeficiente'] && r['HL Act Restrito']);

        if (sample) {
            const caixas = Number(sample['Em caixas']);
            const coef = Number(sample['Coeficiente']);
            const hlExpected = Number(sample['HL Act Restrito']);
            const hlCalculated = caixas * coef;

            // Allow for floating point tolerance
            const tolerance = 0.01;
            const formulaMatches = Math.abs(hlExpected - hlCalculated) < tolerance * hlExpected;

            logResult({
                name: 'Simulador: HL = Caixas * Coeficiente (CORE FORMULA)',
                passed: formulaMatches,
                details: 'Validating core conversion formula',
                expected: hlExpected,
                actual: hlCalculated
            });
        } else {
            logResult({
                name: 'Simulador: HL = Caixas * Coeficiente (CORE FORMULA)',
                passed: false,
                details: 'Could not find sample row with all required fields',
            });
        }
    }
}

// ===========================================
// RUN ALL TESTS
// ===========================================
async function runAllTests() {
    console.log('\n========================================');
    console.log('🧪 DATA FLOW INTEGRITY TEST SUITE');
    console.log('========================================\n');

    await testPaletizacao();
    console.log('');

    await testCalendario();
    console.log('');

    await testTabelaPrecos();
    console.log('');

    await testSimulador();
    console.log('');

    console.log('========================================');
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    console.log(`📊 SUMMARY: ${passed} passed, ${failed} failed`);
    console.log('========================================\n');

    return { passed, failed, results };
}

// Export for use in API routes
export { runAllTests, TestResult };
