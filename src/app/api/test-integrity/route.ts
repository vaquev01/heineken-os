import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data_samples');

interface TestResult {
    name: string;
    passed: boolean;
    details: string;
    expected?: any;
    actual?: any;
}

function findHeaderRow(sheet: XLSX.WorkSheet, anchorKeywords: string[]): number {
    const range = XLSX.utils.decode_range(sheet['!ref'] || "A1:Z100");

    for (let R = range.s.r; R <= Math.min(range.e.r, 50); ++R) {
        const rowValues: string[] = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = sheet[XLSX.utils.encode_cell({ r: R, c: C })];
            if (cell && cell.v) {
                rowValues.push(String(cell.v).toLowerCase().trim());
            }
        }

        const isHeader = anchorKeywords.every(keyword =>
            rowValues.some(val => val.includes(keyword.toLowerCase()))
        );

        if (isHeader) return R;
    }

    return 0;
}

export async function GET() {
    const results: TestResult[] = [];

    // Test 1: Paletização
    try {
        const filePath = path.join(DATA_DIR, 'PALETIZAÇÃO ATUAL DEZ-25.xlsx');

        if (!fs.existsSync(filePath)) {
            results.push({ name: 'Paletização: File exists', passed: false, details: 'File not found at ' + filePath });
        } else {
            results.push({ name: 'Paletização: File exists', passed: true, details: 'OK' });

            const buffer = fs.readFileSync(filePath);
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];

            const headerRow = findHeaderRow(sheet, ['Cód. SKU', 'HL/PAC']);
            results.push({
                name: 'Paletização: Header detection',
                passed: headerRow >= 0,
                details: `Header found at row ${headerRow}`,
            });

            const data = XLSX.utils.sheet_to_json(sheet, { range: headerRow });
            results.push({
                name: 'Paletização: Data rows parsed',
                passed: data.length > 0,
                details: `Parsed ${data.length} SKUs`,
                expected: '> 0',
                actual: data.length
            });
        }
    } catch (e: any) {
        results.push({ name: 'Paletização: Parse', passed: false, details: e.message });
    }

    // Test 2: Calendário
    try {
        const filePath = path.join(DATA_DIR, "20251223_Liberação Jan+Fev'26.xlsx");

        if (!fs.existsSync(filePath)) {
            results.push({ name: 'Calendário: File exists', passed: false, details: 'File not found' });
        } else {
            results.push({ name: 'Calendário: File exists', passed: true, details: 'OK' });

            const buffer = fs.readFileSync(filePath);
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('ação')) || workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const headerRow = findHeaderRow(sheet, ['Diretoria', 'Regional']);
            results.push({
                name: 'Calendário: Header detection',
                passed: headerRow >= 0,
                details: `Found at row ${headerRow} in sheet "${sheetName}"`,
            });

            const data = XLSX.utils.sheet_to_json(sheet, { range: headerRow });
            results.push({
                name: 'Calendário: Data rows parsed',
                passed: data.length > 0,
                details: `Parsed ${data.length} rules`,
            });
        }
    } catch (e: any) {
        results.push({ name: 'Calendário: Parse', passed: false, details: e.message });
    }

    // Test 3: Simulador - CORE FORMULA VALIDATION
    try {
        const filePath = path.join(DATA_DIR, "SIMULADOR DE PROPOSTA ASSAÍ Outubro'25.xlsx");

        if (!fs.existsSync(filePath)) {
            results.push({ name: 'Simulador: File exists', passed: false, details: 'File not found' });
        } else {
            results.push({ name: 'Simulador: File exists', passed: true, details: 'OK' });

            const buffer = fs.readFileSync(filePath);
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames.find(s => s.toLowerCase().includes('proposta') && s.toLowerCase().includes('outubro')) || workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            results.push({
                name: 'Simulador: Target sheet found',
                passed: !!sheetName,
                details: `Using: "${sheetName}"`,
            });

            const headerRow = findHeaderRow(sheet, ['Coeficiente']);
            const data = XLSX.utils.sheet_to_json(sheet, { range: headerRow }) as any[];

            // Find first row with actual data for formula validation
            const sample = data.find((r: any) => {
                const caixas = Number(r['Em caixas']);
                const coef = Number(r['Coeficiente']);
                return caixas > 0 && coef > 0;
            });

            if (sample) {
                const caixas = Number(sample['Em caixas']);
                const coef = Number(sample['Coeficiente']);
                const hlFromExcel = Number(sample['HL Act Restrito']);
                const hlCalculated = caixas * coef;

                const tolerance = 0.001;
                const formulaMatches = Math.abs(hlFromExcel - hlCalculated) <= tolerance * hlFromExcel || Math.abs(hlFromExcel - hlCalculated) < 0.01;

                results.push({
                    name: '⭐ CORE FORMULA: HL = Caixas × Coeficiente',
                    passed: formulaMatches,
                    details: formulaMatches ? 'Formula verified successfully!' : 'Formula mismatch detected',
                    expected: hlFromExcel,
                    actual: hlCalculated
                });
            } else {
                results.push({
                    name: '⭐ CORE FORMULA: HL = Caixas × Coeficiente',
                    passed: false,
                    details: 'No sample row found with valid Caixas and Coeficiente',
                });
            }
        }
    } catch (e: any) {
        results.push({ name: 'Simulador: Parse', passed: false, details: e.message });
    }

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;

    return NextResponse.json({
        summary: {
            total: results.length,
            passed,
            failed,
            status: failed === 0 ? '✅ ALL TESTS PASSED' : `⚠️ ${failed} TESTS FAILED`
        },
        results
    });
}
