import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { saveData, StorageKeys } from '@/core/services/storage-service';

// Type definitions for parsed data
interface ParsedCalendar {
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
    tprRsHl: number;
}

interface ParsedPaletizacao {
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

interface ParseResult {
    success: boolean;
    fileType: string;
    rowCount: number;
    data: any[];
    errors: string[];
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

function detectFileType(workbook: XLSX.WorkBook): string {
    const sheetNames = workbook.SheetNames.map(s => s.toLowerCase());

    if (sheetNames.some(s => s.includes('ação') || s.includes('liberação'))) {
        return 'CALENDARIO';
    }
    if (sheetNames.some(s => s.includes('export'))) {
        return 'TABELA_PRECOS';
    }
    if (sheetNames.some(s => s.includes('planilha1'))) {
        // Check for paletização columns
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const headerRow = findHeaderRow(sheet, ['Cód. SKU', 'HL/PAC']);
        if (headerRow >= 0) return 'PALETIZACAO';
    }
    if (sheetNames.some(s => s.includes('proposta'))) {
        return 'SIMULADOR';
    }
    if (sheetNames.some(s => s.includes('baseacordos') || s.includes('apuração'))) {
        return 'CONTA_CORRENTE';
    }

    return 'UNKNOWN';
}

function parseCalendario(workbook: XLSX.WorkBook): ParseResult {
    const sheetName = workbook.SheetNames.find(s =>
        s.toLowerCase().includes('ação') || s.toLowerCase().includes('liberação')
    ) || workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];
    const headerRow = findHeaderRow(sheet, ['Diretoria', 'Regional']);
    const data = XLSX.utils.sheet_to_json(sheet, { range: headerRow }) as any[];

    const parsed: ParsedCalendar[] = data.map(row => ({
        diretoria: row['Diretoria'] || '',
        regional: row['Regional'] || '',
        uf: row['UF'] || '',
        marca: row['Marca'] || '',
        embalagem: row['Embalagem'] || '',
        volCompromissoJan: Number(row['Vol Compromisso Jan']) || 0,
        volCompromissoFev: Number(row['Vol Compromisso Fev']) || 0,
        ttcLista: Number(row['TTC Lista']) || 0,
        ttcPromo: Number(row['TTC Promo']) || 0,
        pressao: Number(row['% Pressão']) || 0,
        tprRsHl: Number(row['TPR R$/HL EXTRA']) || 0,
    })).filter(r => r.diretoria || r.regional);

    return {
        success: true,
        fileType: 'CALENDARIO',
        rowCount: parsed.length,
        data: parsed,
        errors: [],
    };
}

function parsePaletizacao(workbook: XLSX.WorkBook): ParseResult {
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const headerRow = findHeaderRow(sheet, ['Cód. SKU', 'HL/PAC']);
    const data = XLSX.utils.sheet_to_json(sheet, { range: headerRow }) as any[];

    const parsed: ParsedPaletizacao[] = data.map(row => ({
        codSku: String(row['Cód. SKU'] || ''),
        descricao: row['Descrição do Material'] || '',
        marca: row['Marca'] || '',
        categoria: row['CATEGORIA'] || '',
        lastro: Number(row['Lastro']) || 0,
        qtdLastros: Number(row['Qtd Lastros']) || 0,
        palete: Number(row['Palete']) || 0,
        hlPac: Number(row['HL/PAC']) || 0,
        hlPallet: Number(row['HL/PALLET']) || 0,
    })).filter(r => r.codSku);

    return {
        success: true,
        fileType: 'PALETIZACAO',
        rowCount: parsed.length,
        data: parsed,
        errors: [],
    };
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });

        const fileType = detectFileType(workbook);

        let result: ParseResult;

        switch (fileType) {
            case 'CALENDARIO':
                result = parseCalendario(workbook);
                if (result.success) await saveData(StorageKeys.CALENDAR, result.data);
                break;
            case 'PALETIZACAO':
                result = parsePaletizacao(workbook);
                if (result.success) await saveData(StorageKeys.PRODUCTS, result.data);
                break;
            default:
                result = {
                    success: false,
                    fileType: 'UNKNOWN',
                    rowCount: 0,
                    data: [],
                    errors: [`Tipo de arquivo não reconhecido. Sheets: ${workbook.SheetNames.join(', ')}`],
                };
        }

        return NextResponse.json({
            success: result.success,
            message: `Arquivo processado e salvo: ${result.fileType}`,
            fileType: result.fileType,
            rowCount: result.rowCount,
            sampleData: result.data.slice(0, 5), // First 5 rows as preview
            errors: result.errors,
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to process file'
        }, { status: 500 });
    }
}
