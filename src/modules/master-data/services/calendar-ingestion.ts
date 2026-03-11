import { ExcelParser } from "@/core/utils/excel-parser";
import * as XLSX from 'xlsx';

export interface CalendarRuleRaw {
    directorate: string;
    region: string;
    uf: string;
    brand: string;
    pack: string;
    ttcList: number;
    ttcPromo: number;
    pressure: number;
    tprExtra: number;
}

export class CalendarIngestionService {
    static parse(buffer: ArrayBuffer): CalendarRuleRaw[] {
        const workbook = ExcelParser.readWorkbook(buffer);
        // Assuming "Ação" is the sheet name, or just take the first one
        const sheetName = workbook.SheetNames.find(s => s.toLowerCase().includes("ação")) || workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Anchor: "Diretoria", "Regional", "UF"
        const headerRow = ExcelParser.findHeaderRow(sheet, ["Diretoria", "Regional", "UF"]);

        return ExcelParser.parseSheet<CalendarRuleRaw>(sheet, headerRow, (row: any) => {
            // Map Excel Columns to Internal Object
            // Using flexible matching in case exact names vary slightly

            // Mandatory checks
            if (!row['Marca'] || !row['Embalagem']) return null;

            return {
                directorate: row['Diretoria'],
                region: row['Regional'],
                uf: row['UF'],
                brand: row['Marca'],
                pack: row['Embalagem'],
                ttcList: Number(row['TTC Lista']) || 0,
                ttcPromo: Number(row['TTC Promo']) || 0,
                pressure: Number(row['% Pressão']) || 0,
                tprExtra: Number(row['TPR R$/HL EXTRA']) || 0,
            };
        });
    }
}
